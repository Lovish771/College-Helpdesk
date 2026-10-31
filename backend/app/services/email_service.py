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
        """
        Reload .env so newly added SMTP settings are picked up without a restart.
        override=False on purpose: real environment variables (e.g. the ones set in
        the Vercel dashboard) must always win over a bundled .env file.
        """
        try:
            project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
            env_path = os.path.join(project_root, '.env')
            if os.path.exists(env_path):
                load_dotenv(env_path, override=False)
        except Exception as e:
            logger.debug(f"Failed to reload .env dynamically: {e}")

    @staticmethod
    def _safe_port(*names, default: int = 587) -> int:
        """Read a port from the environment without ever raising on a malformed value."""
        for name in names:
            raw = (os.environ.get(name) or '').strip()
            if not raw:
                continue
            try:
                port = int(raw)
            except (TypeError, ValueError):
                logger.error(f'[Gmail SMTP] {name}={raw!r} is not a valid port number; using {default}.')
                return default
            if not (1 <= port <= 65535):
                logger.error(f'[Gmail SMTP] {name}={raw!r} is out of range; using {default}.')
                return default
            return port
        return default

    @classmethod
    def generate_otp(cls) -> str:
        """Cryptographically secure 6-digit number between 100000 and 999999."""
        return str(secrets.randbelow(900000) + 100000)

    @classmethod
    def _storage_failure(cls, error: Exception, email: str, action: str) -> tuple[str, int]:
        """
        Turn an unexpected backend error into a diagnosable response plus a server-side
        log line, instead of letting it escape as an opaque 500.
        """
        logger.error(f'[AUTH] Could not {action} for {email}: {type(error).__name__}: {error}')
        try:
            db.session.rollback()
        except Exception:
            pass
        # Set EXPOSE_ERROR_DETAILS=0 once the deployment is healthy to hide internals
        verbose = os.getenv('EXPOSE_ERROR_DETAILS', '1') != '0'
        reason = f' ({type(error).__name__}: {error})' if verbose else ''
        return (
            f'Could not {action} due to a server-side error{reason}. Please try again shortly.',
            503
        )

    @classmethod
    def request_otp(cls, email: str, ip_address: str = None, user_agent: str = None) -> tuple[bool, str, int, dict]:
        """Request an OTP. Storage/provider failures are reported back, never raised."""
        cls._reload_env()
        email = (email or '').strip().lower()
        if not email or '@' not in email or '.' not in email:
            return False, 'Please provide a valid email address.', 400, {}

        try:
            return cls._issue_otp(email, ip_address, user_agent)
        except Exception as e:
            msg, status_code = cls._storage_failure(e, email, 'issue a verification code')
            return False, msg, status_code, {'error_type': type(e).__name__}

    @classmethod
    def _issue_otp(cls, email: str, ip_address: str = None, user_agent: str = None) -> tuple[bool, str, int, dict]:
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

        # Dispatch OTP email via Gmail SMTP
        delivered_online, provider_name, dispatch_detail = cls._dispatch_online_email(email, otp_code)

        # Log security audit with dispatch outcome
        event_type = 'otp_sent' if delivered_online else 'otp_dispatch_failed'
        sec_log = SecurityLog(
            event_type=event_type,
            email=email,
            ip_address=ip_address,
            user_agent=user_agent,
            details=f'OTP dispatch via {provider_name}: {dispatch_detail}'
        )
        db.session.add(sec_log)
        db.session.commit()

        meta = {
            'delivered_online': delivered_online,
            'provider': provider_name,
            'dispatch_detail': dispatch_detail,
            'cooldown_seconds': cls.COOLDOWN_SECONDS
        }

        if delivered_online:
            return True, f'Verification code sent to {email}. Please check your inbox.', 200, meta
        else:
            # Email delivery failed — don't pretend success
            # Include dev_otp only if truly no provider is configured at all
            no_provider_configured = 'No online email provider' in dispatch_detail
            if no_provider_configured:
                meta['dev_otp'] = otp_code
            return False, (
                'Email delivery failed. The server email credentials are not properly configured. '
                'Please contact the site administrator to set up SMTP/email credentials, or try again later.'
            ), 503, meta

    @classmethod
    def _dispatch_online_email(cls, email: str, otp_code: str) -> tuple[bool, str, str]:
        """
        Dispatches OTP email via Google Gmail SMTP using an App Password.
        Set SMTP_USER (gmail address) and SMTP_PASSWORD (16-char App Password) in env.

        Never raises: any dispatch problem is reported as a failed delivery so the
        caller can answer with a readable message instead of an opaque 500.
        """
        try:
            return cls._dispatch_online_email_impl(email, otp_code)
        except Exception as e:
            logger.error(f'[Gmail SMTP] Unexpected dispatch failure for {email}: {type(e).__name__}: {e}')
            return False, 'Gmail SMTP', f'dispatch error ({type(e).__name__}): {e}'

    @classmethod
    def _dispatch_online_email_impl(cls, email: str, otp_code: str) -> tuple[bool, str, str]:
        # Fast path for automated testing where real network SMTP is unavailable
        try:
            from flask import current_app
            if current_app and current_app.config.get('TESTING'):
                return True, 'Gmail SMTP (Mock)', 'delivered in test mode'
        except Exception:
            pass

        subject = f"Your sign-in code: {otp_code} · Student Helpdesk"
        text_content, html_content = cls._build_email_templates(email, otp_code)

        smtp_user = (
            os.environ.get('SMTP_USER') or
            os.environ.get('SMTP_USERNAME') or
            os.environ.get('EMAIL_USER') or
            os.environ.get('GMAIL_USER') or
            ''
        ).strip()

        smtp_pass = (
            os.environ.get('SMTP_PASSWORD') or
            os.environ.get('SMTP_PASS') or
            os.environ.get('EMAIL_PASSWORD') or
            os.environ.get('EMAIL_PASS') or
            os.environ.get('GMAIL_APP_PASSWORD') or
            os.environ.get('APP_PASSWORD') or
            ''
        ).strip()

        smtp_server = (
            os.environ.get('SMTP_SERVER') or
            os.environ.get('SMTP_HOST') or
            'smtp.gmail.com'
        ).strip()

        smtp_port = cls._safe_port('SMTP_PORT', 'EMAIL_PORT', default=587)

        if not smtp_user or not smtp_pass:
            detail = 'SMTP_USER or SMTP_PASSWORD not configured in environment variables'
            logger.error(f'[Gmail SMTP] {detail}')
            print(f'\n=======================================================')
            print(f'[AUTH EMAIL SERVICE] Verification Code for: {email}')
            print(f'OTP CODE: >>> {otp_code} <<< (Valid for {cls.EXPIRATION_MINUTES} minutes)')
            print(f'Status: {detail}')
            print(f'=======================================================\n')
            return False, 'Gmail SMTP', detail

        # Try STARTTLS port 587 first, SSL port 465 as fallback
        ports_to_try = [smtp_port]
        if smtp_server == 'smtp.gmail.com' and smtp_port == 587:
            ports_to_try.append(465)

        last_error = ''
        for p in ports_to_try:
            try:
                msg = MIMEMultipart('alternative')
                msg['Subject'] = subject
                msg['From'] = f'Student Helpdesk <{smtp_user}>'
                msg['To'] = email
                msg.attach(MIMEText(text_content, 'plain'))
                msg.attach(MIMEText(html_content, 'html'))

                if p == 465:
                    server = smtplib.SMTP_SSL(smtp_server, p, timeout=25)
                else:
                    server = smtplib.SMTP(smtp_server, p, timeout=25)
                    server.ehlo()
                    server.starttls()
                    server.ehlo()

                server.login(smtp_user, smtp_pass)
                server.sendmail(smtp_user, [email], msg.as_string())
                server.quit()
                logger.info(f'[Gmail SMTP] OTP dispatched to {email} via {smtp_server}:{p}')
                return True, 'Gmail SMTP', f'delivered via port {p}'
            except Exception as e:
                last_error = f'SMTP error ({smtp_server}:{p}): {e}'
                logger.error(f'[Gmail SMTP] Failed on port {p}: {e}')

        # All ports failed
        print(f'\n=======================================================')
        print(f'[AUTH EMAIL SERVICE] Verification Code for: {email}')
        print(f'OTP CODE: >>> {otp_code} <<< (Valid for {cls.EXPIRATION_MINUTES} minutes)')
        print(f'Status: {last_error}')
        print(f'=======================================================\n')
        logger.error(f'[Gmail SMTP] All delivery attempts failed for {email}: {last_error}')
        return False, 'Gmail SMTP', last_error

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
        """Plain, transactional sign-in code email.

        Deliberately matches the website's design system: Inter for text, Plus
        Jakarta Sans for the one heading, a single orange accent, 1px borders and
        small radii. The word "Unofficial" does not appear; the site carries the
        disclaimer. Set SUPPORT_EMAIL to change the reply address.
        """
        display_name = cls._extract_display_name(email)
        support_email = os.environ.get('SUPPORT_EMAIL', 'hlobin3@gmail.com')
        logo_url = 'https://college-helpdesk-topaz.vercel.app/images/lpu-mascot-logo.png'

        text_content = f"""Hi {display_name},

Enter this code to sign in to Student Helpdesk. It can be used once and expires in {cls.EXPIRATION_MINUTES} minutes.

    {otp_code}

Keep this code private. We will never ask for it by email, chat, or phone.

Didn't try to sign in?
You can ignore this email. Nobody can access your account without the code. If these keep arriving, write to {support_email}.

Student Helpdesk
"""

        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>Your sign-in code</title>
</head>
<body style="margin:0;padding:24px 12px;background-color:#F1F5F9;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#334155;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;background-color:#FFFFFF;border:1px solid #E2E8F0;border-radius:10px;border-collapse:separate;">

          <!-- Header: logo + product name -->
          <tr>
            <td style="padding:18px 24px;border-bottom:1px solid #E2E8F0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                <tr>
                  <td style="padding-right:10px;vertical-align:middle;">
                    <img src="{logo_url}" alt="Student Helpdesk" width="28" height="28" style="display:block;width:28px;height:28px;border:0;outline:none;text-decoration:none;">
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="font-family:'Plus Jakarta Sans','Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;font-weight:600;color:#0F172A;letter-spacing:-0.01em;">Student Helpdesk</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Heading and lead -->
          <tr>
            <td style="padding:28px 24px 0 24px;">
              <h1 style="margin:0 0 12px 0;font-family:'Plus Jakarta Sans','Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:24px;line-height:1.25;font-weight:600;color:#0F172A;letter-spacing:-0.02em;">Your sign-in code</h1>
              <p style="margin:0;font-size:15px;line-height:1.6;color:#475569;">
                Hi {display_name}, enter this code to sign in to Student Helpdesk. It can be used once and expires in {cls.EXPIRATION_MINUTES} minutes.
              </p>
            </td>
          </tr>

          <!-- Code -->
          <tr>
            <td style="padding:20px 24px 0 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;">
                <tr>
                  <td align="center" style="border:1px solid #E2E8F0;border-radius:8px;background-color:#F8FAFC;padding:18px 12px;">
                    <span style="display:block;font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;font-size:34px;line-height:1;font-weight:600;letter-spacing:0.28em;color:#0F172A;padding-left:0.28em;">{otp_code}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:14px 24px 24px 24px;">
              <p style="margin:0;font-size:13px;line-height:1.6;color:#64748B;">
                Keep this code private. We will never ask for it by email, chat, or phone.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 24px;">
              <div style="border-top:1px solid #E2E8F0;height:1px;line-height:1px;font-size:0;">&nbsp;</div>
            </td>
          </tr>

          <!-- Didn't try to sign in -->
          <tr>
            <td style="padding:20px 24px 26px 24px;">
              <p style="margin:0 0 6px 0;font-size:14px;font-weight:600;color:#0F172A;">Didn&rsquo;t try to sign in?</p>
              <p style="margin:0;font-size:13px;line-height:1.6;color:#64748B;">
                You can ignore this email. Nobody can access your account without the code. If these keep arriving, write to
                <a href="mailto:{support_email}" style="color:#C2410C;text-decoration:underline;">{support_email}</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 24px;border-top:1px solid #E2E8F0;background-color:#F8FAFC;">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#94A3B8;">
                Student Helpdesk &middot; sign-in code requested for {email}
              </p>
            </td>
          </tr>

        </table>

        <p style="margin:12px 0 0 0;font-size:11px;line-height:1.5;color:#94A3B8;">
          Sent automatically &mdash; replies to this address are not monitored.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
"""

        return text_content, html_content



    @classmethod
    def verify_otp(cls, email: str, candidate_otp: str, ip_address: str = None) -> tuple[bool, str, int]:
        email = (email or '').strip().lower()
        candidate_otp = str(candidate_otp or '').strip()

        if not email or not candidate_otp:
            return False, 'Email and 6-digit code are required.', 400

        try:
            return cls._verify_otp_impl(email, candidate_otp, ip_address)
        except Exception as e:
            msg, status_code = cls._storage_failure(e, email, 'verify your code')
            return False, msg, status_code

    @classmethod
    def _verify_otp_impl(cls, email: str, candidate_otp: str, ip_address: str = None) -> tuple[bool, str, int]:
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
