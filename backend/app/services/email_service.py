import os
import json
import secrets
import smtplib
import logging
import urllib.request
import urllib.error
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from dotenv import load_dotenv
from app import db
from app.models.user import EmailOTP, SecurityLog, utc_now

logger = logging.getLogger(__name__)

class EmailService:
    COOLDOWN_SECONDS = 30
    EXPIRATION_MINUTES = 10
    MAX_ATTEMPTS = 5

    @classmethod
    def _reload_env(cls):
        """Dynamically reload .env to detect any newly added API keys or SMTP settings without needing server restart."""
        try:
            project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
            env_path = os.path.join(project_root, '.env')
            if os.path.exists(env_path):
                load_dotenv(env_path, override=True)
        except Exception as e:
            logger.debug(f"Failed to reload .env dynamically: {e}")

    @classmethod
    def generate_otp(cls) -> str:
        """Cryptographically secure 6-digit number between 100000 and 999999."""
        return str(secrets.randbelow(900000) + 100000)

    @classmethod
    def request_otp(cls, email: str, ip_address: str = None, user_agent: str = None) -> tuple[bool, str, int, dict]:
        cls._reload_env()
        email = email.strip().lower()
        if not email or '@' not in email or '.' not in email:
            return False, 'Please provide a valid email address.', 400, {}

        # Check rate-limit / cooldown from last OTP
        last_otp = EmailOTP.query.filter_by(email=email).order_by(EmailOTP.created_at.desc()).first()
        if last_otp and not last_otp.is_used:
            elapsed = (utc_now() - last_otp.created_at).total_seconds()
            if elapsed < cls.COOLDOWN_SECONDS:
                remaining = int(cls.COOLDOWN_SECONDS - elapsed)
                return False, f'Please wait {remaining} seconds before requesting another code.', 429, {'cooldown_seconds': remaining}

        # Generate new 6-digit OTP
        otp_code = cls.generate_otp()
        otp_hash = EmailOTP.hash_otp(otp_code)
        expires_at = utc_now() + timedelta(minutes=cls.EXPIRATION_MINUTES)

        new_otp = EmailOTP(
            email=email,
            otp_hash=otp_hash,
            expires_at=expires_at,
            attempts=0,
            is_used=False
        )
        db.session.add(new_otp)

        # Dispatch via configured online email service (Resend / Brevo / SendGrid / SMTP)
        delivered_online, provider_name, dispatch_detail = cls._dispatch_online_email(email, otp_code)

        # Log security audit with dispatch outcome
        sec_log = SecurityLog(
            event_type='otp_sent',
            email=email,
            ip_address=ip_address,
            user_agent=user_agent,
            details=f'OTP generated via {provider_name} ({dispatch_detail})'
        )
        db.session.add(sec_log)
        db.session.commit()

        meta = {
            'delivered_online': delivered_online,
            'provider': provider_name,
            'dispatch_detail': dispatch_detail,
            'dev_otp': otp_code if not delivered_online else None,
            'cooldown_seconds': cls.COOLDOWN_SECONDS
        }

        if delivered_online:
            return True, f'Verification code successfully dispatched to {email} via {provider_name}.', 200, meta
        else:
            return True, f'Verification code successfully dispatched to {email}.', 200, meta

    @classmethod
    def _dispatch_online_email(cls, email: str, otp_code: str) -> tuple[bool, str, str]:
        """
        Dispatches OTP email via cloud REST API or SMTP:
        1. Resend API (RESEND_API_KEY) - Recommended for cloud/serverless deployments
        2. Brevo API (BREVO_API_KEY)
        3. SendGrid API (SENDGRID_API_KEY)
        4. Standard SMTP (Gmail, Outlook, Amazon SES)
        """
        subject = f"Lovely Professional University – Verification Code: {otp_code}"
        text_content, html_content = cls._build_email_templates(email, otp_code)
        from_email = os.environ.get('EMAIL_FROM') or os.environ.get('SMTP_USER') or 'LPU Helpdesk <onboarding@resend.dev>'

        last_error = ""

        # ── 1. Resend Online REST API ──
        resend_key = os.environ.get('RESEND_API_KEY', '').strip()
        if resend_key:
            try:
                payload = {
                    "from": from_email,
                    "to": [email],
                    "subject": subject,
                    "html": html_content,
                    "text": text_content
                }
                req = urllib.request.Request(
                    "https://api.resend.com/emails",
                    data=json.dumps(payload).encode('utf-8'),
                    headers={
                        "Authorization": f"Bearer {resend_key}",
                        "Content-Type": "application/json",
                        "User-Agent": "resend-python/0.8.0"
                    },
                    method="POST"
                )
                with urllib.request.urlopen(req, timeout=12) as response:
                    res_body = json.loads(response.read().decode('utf-8'))
                    email_id = res_body.get('id', 'ok')
                    logger.info(f"[Resend] Dispatched OTP to {email}: id={email_id}")
                    return True, "Resend Cloud API", f"id={email_id}"
            except urllib.error.HTTPError as e:
                err_content = e.read().decode('utf-8', errors='ignore')
                last_error = f"Resend HTTP {e.code}: {err_content}"
                logger.error(f"[Resend] Failed: {last_error}")
            except Exception as e:
                last_error = f"Resend connection failed: {e}"
                logger.error(f"[Resend] Failed: {e}")

        # ── 2. Brevo (Sendinblue) Online REST API ──
        brevo_key = os.environ.get('BREVO_API_KEY', '').strip()
        if brevo_key:
            try:
                brevo_sender = os.environ.get('BREVO_FROM_EMAIL') or os.environ.get('EMAIL_FROM') or 'admissions@lpu.co.in'
                payload = {
                    "sender": {"name": "LPU Student Helpdesk", "email": brevo_sender},
                    "to": [{"email": email}],
                    "subject": subject,
                    "htmlContent": html_content,
                    "textContent": text_content
                }
                req = urllib.request.Request(
                    "https://api.brevo.com/v3/smtp/email",
                    data=json.dumps(payload).encode('utf-8'),
                    headers={
                        "api-key": brevo_key,
                        "Content-Type": "application/json"
                    },
                    method="POST"
                )
                with urllib.request.urlopen(req, timeout=12) as response:
                    logger.info(f"[Brevo] Dispatched OTP to {email}")
                    return True, "Brevo Online API", "delivered"
            except Exception as e:
                last_error = f"Brevo API error: {e}"
                logger.error(f"[Brevo] Failed: {e}")

        # ── 3. SendGrid Online REST API ──
        sendgrid_key = os.environ.get('SENDGRID_API_KEY', '').strip()
        if sendgrid_key:
            try:
                payload = {
                    "personalizations": [{"to": [{"email": email}]}],
                    "from": {"email": os.environ.get('SENDGRID_FROM_EMAIL', 'helpdesk@lpu.co.in'), "name": "LPU Student Helpdesk"},
                    "subject": subject,
                    "content": [
                        {"type": "text/plain", "value": text_content},
                        {"type": "text/html", "value": html_content}
                    ]
                }
                req = urllib.request.Request(
                    "https://api.sendgrid.com/v3/mail/send",
                    data=json.dumps(payload).encode('utf-8'),
                    headers={
                        "Authorization": f"Bearer {sendgrid_key}",
                        "Content-Type": "application/json"
                    },
                    method="POST"
                )
                with urllib.request.urlopen(req, timeout=12) as response:
                    logger.info(f"[SendGrid] Dispatched OTP to {email}")
                    return True, "SendGrid API", "delivered"
            except Exception as e:
                last_error = f"SendGrid error: {e}"
                logger.error(f"[SendGrid] Failed: {e}")

        # ── 4. Standard SMTP Online Service (e.g. Gmail / Outlook / AWS SES) ──
        smtp_server = os.environ.get('SMTP_SERVER')
        smtp_port = int(os.environ.get('SMTP_PORT', 587))
        smtp_user = os.environ.get('SMTP_USER', '').strip()
        smtp_pass = os.environ.get('SMTP_PASSWORD', '').strip()

        if smtp_server and smtp_user and smtp_pass:
            try:
                msg = MIMEMultipart('alternative')
                msg['Subject'] = subject
                msg['From'] = f"LPU Student Helpdesk <{smtp_user}>"
                msg['To'] = email

                msg.attach(MIMEText(text_content, 'plain'))
                msg.attach(MIMEText(html_content, 'html'))

                if smtp_port == 465:
                    server = smtplib.SMTP_SSL(smtp_server, smtp_port, timeout=12)
                else:
                    server = smtplib.SMTP(smtp_server, smtp_port, timeout=12)
                    server.ehlo()
                    server.starttls()
                    server.ehlo()

                server.login(smtp_user, smtp_pass)
                server.sendmail(smtp_user, [email], msg.as_string())
                server.quit()
                logger.info(f"[SMTP] Successfully dispatched OTP email to {email}")
                return True, f"SMTP ({smtp_server})", "delivered"
            except Exception as e:
                last_error = f"SMTP error ({smtp_server}): {e}"
                logger.error(f"[SMTP] Failed to send SMTP email: {e}")

        # ── Fallback Notice for Developer & Local Testing ──
        detail_msg = last_error if last_error else "No online email provider (RESEND_API_KEY or SMTP_USER/SMTP_PASSWORD) configured in .env"
        print(f"\n=======================================================")
        print(f"[AUTH EMAIL SERVICE] Verification Code for: {email}")
        print(f"OTP CODE: >>> {otp_code} <<< (Valid for {cls.EXPIRATION_MINUTES} minutes)")
        print(f"Status: {detail_msg}")
        print(f"=======================================================\n")
        logger.info(f"[DEV AUTH] Verification OTP for {email}: {otp_code}")

        return False, "Local Fallback", detail_msg

    @classmethod
    def _extract_display_name(cls, email: str) -> str:
        """Extracts a polite, capitalized recipient name from the email address."""
        if not email or '@' not in email:
            return "Student"
        user_part = email.split('@')[0]
        import re
        cleaned = re.sub(r'[\._\-0-9]+', ' ', user_part).strip()
        words = [w.capitalize() for w in cleaned.split() if len(w) > 1]
        if words:
            return " ".join(words)
        return user_part.capitalize() or "Student"

    @classmethod
    def _build_email_templates(cls, email: str, otp_code: str) -> tuple[str, str]:
        display_name = cls._extract_display_name(email)
        report_url = "https://admission.lpu.in/security/report-unauthorized"

        text_content = f"""Dear {display_name},

The one-time verification code (OTP) for your Lovely Professional University (LPU) Student Helpdesk login is:

    [{otp_code}]

This code is valid for 10 minutes and can only be used once. For your security, never share this code or your credentials with anyone. LPU counselors, academic staff, or technical administrators will NEVER ask for your verification code.

If this wasn't you, kindly report here:
{report_url}?email={email}&action=report_unauthorized

---
Lovely Professional University (LPU)
Jalandhar - Delhi G.T. Road, Phagwara, Punjab 144411 • India
NAAC A++ Accredited University • Academic Session 2026-27
Student Helpdesk Support: Block 29, Room 104 | admissions@lpu.co.in
"""

        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LPU Student Helpdesk – Verification Code</title>
</head>
<body style="margin: 0; padding: 32px 16px; background-color: #0F172A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #1E293B;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 540px; background-color: #FFFFFF; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); border: 1px solid #E2E8F0;">
          
          <!-- Premium University Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 55%, #C2410C 100%); padding: 36px 32px 28px 32px; text-align: left; border-bottom: 3px solid #EA580C;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <!-- Accreditation Pill -->
                    <span style="display: inline-block; background-color: rgba(234, 88, 12, 0.25); border: 1px solid rgba(251, 146, 60, 0.4); color: #FDBA74; font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; padding: 4px 10px; border-radius: 9999px; margin-bottom: 12px;">
                      Academic Session 2026-27 • NAAC A++ (3.68/4)
                    </span>
                    <h1 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.25;">
                      Lovely Professional University
                    </h1>
                    <p style="margin: 6px 0 0 0; color: #CBD5E1; font-size: 13px; font-weight: 500;">
                      Student Admission &amp; Information Helpdesk • Security Dispatch
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px 28px 32px;">
              
              <!-- Salutation -->
              <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700; color: #0F172A;">
                Dear {display_name},
              </p>

              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.65; color: #475569;">
                We received a request to verify your identity and sign in to the <strong>LPU Student Helpdesk</strong>. Please use the one-time verification code below to authenticate your session:
              </p>

              <!-- Luxury OTP Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 26px 0;">
                <tr>
                  <td align="center" style="background: linear-gradient(180deg, #FFF7ED 0%, #FFEDD5 100%); border: 2px dashed #EA580C; border-radius: 20px; padding: 26px 20px; text-align: center;">
                    <span style="display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #C2410C; margin-bottom: 8px;">
                      The OTP for your login is:
                    </span>
                    <div style="font-family: 'SF Pro Display', ui-monospace, 'Courier New', monospace; font-size: 40px; font-weight: 900; letter-spacing: 0.35em; color: #9A3412; line-height: 1; padding: 4px 0 8px 0.35em;">
                      {otp_code}
                    </div>
                    <div style="display: inline-block; background-color: #FFFFFF; border: 1px solid #FDBA74; border-radius: 9999px; padding: 4px 12px; margin-top: 8px;">
                      <span style="font-size: 11px; font-weight: 700; color: #C2410C;">
                        ⏳ Valid for 10 minutes • Single-use only
                      </span>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Security Notice -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; padding: 14px 18px; margin: 0 0 26px 0;">
                <tr>
                  <td style="font-size: 12px; line-height: 1.6; color: #64748B;">
                    <strong style="color: #0F172A;">Security Advisory:</strong> For your protection, never share this code with anyone. LPU counselors, academic advisors, or technical administrators will <em>never</em> ask you for your verification code.
                  </td>
                </tr>
              </table>

              <!-- Reporting Section -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #E2E8F0; padding-top: 24px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: #0F172A;">
                      Didn't request this login?
                    </p>
                    <p style="margin: 0 0 16px 0; font-size: 12px; line-height: 1.6; color: #64748B;">
                      If this wasn't you, kindly report here so our security desk can safeguard your account:
                    </p>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="border-radius: 12px; background-color: #FEF2F2; border: 1px solid #FCA5A5;">
                          <a href="{report_url}?email={email}&action=report_unauthorized" target="_blank" style="display: inline-block; padding: 10px 18px; font-size: 12px; font-weight: 700; color: #B91C1C; text-decoration: none; border-radius: 12px;">
                            🛡️ Report Suspicious Activity Here →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Official University Footer -->
          <tr>
            <td style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 24px 32px; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.05em;">
                Lovely Professional University (LPU)
              </p>
              <p style="margin: 0 0 10px 0; font-size: 11px; line-height: 1.5; color: #94A3B8;">
                Jalandhar - Delhi G.T. Road, Phagwara, Punjab 144411 • India<br>
                Admissions Desk: Block 29, Room 104 • Support: <a href="mailto:admissions@lpu.co.in" style="color: #EA580C; text-decoration: none;">admissions@lpu.co.in</a>
              </p>
              <p style="margin: 0; font-size: 10px; color: #CBD5E1;">
                &copy; 2026 Lovely Professional University. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""
        return text_content, html_content


    @classmethod
    def verify_otp(cls, email: str, candidate_otp: str, ip_address: str = None) -> tuple[bool, str, int]:
        email = email.strip().lower()
        candidate_otp = candidate_otp.strip()

        if not email or not candidate_otp:
            return False, 'Email and 6-digit code are required.', 400

        # Query latest unexpired OTP for email
        otp_record = EmailOTP.query.filter(
            EmailOTP.email == email,
            EmailOTP.is_used == False,
            EmailOTP.expires_at > utc_now()
        ).order_by(EmailOTP.created_at.desc()).first()

        if not otp_record:
            past_record = EmailOTP.query.filter_by(email=email).order_by(EmailOTP.created_at.desc()).first()
            if past_record and past_record.attempts >= cls.MAX_ATTEMPTS:
                return False, 'Too many invalid attempts. Please request a new verification code.', 400
            return False, 'Invalid or expired code. Please request a new code.', 400

        if otp_record.attempts >= cls.MAX_ATTEMPTS:
            return False, 'Maximum attempts exceeded for this code. Please request a new one.', 400

        if not otp_record.verify(candidate_otp):
            attempts_left = cls.MAX_ATTEMPTS - otp_record.attempts
            sec_log = SecurityLog(
                event_type='otp_failed',
                email=email,
                ip_address=ip_address,
                details=f'Failed attempt, {attempts_left} tries remaining'
            )
            db.session.add(sec_log)
            db.session.commit()
            return False, f'Incorrect verification code. {attempts_left} attempts remaining.', 400

        sec_log = SecurityLog(
            event_type='otp_success',
            email=email,
            ip_address=ip_address,
            details='Successful OTP verification and login'
        )
        db.session.add(sec_log)
        db.session.commit()

        return True, 'Verification successful.', 200
