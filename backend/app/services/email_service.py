import os
import secrets
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from app import db
from app.models.user import EmailOTP, SecurityLog

logger = logging.getLogger(__name__)

class EmailService:
    COOLDOWN_SECONDS = 30
    EXPIRATION_MINUTES = 10
    MAX_ATTEMPTS = 5

    @classmethod
    def generate_otp(cls) -> str:
        # Cryptographically secure 6-digit number between 100000 and 999999
        return str(secrets.randbelow(900000) + 100000)

    @classmethod
    def request_otp(cls, email: str, ip_address: str = None, user_agent: str = None) -> tuple[bool, str, int]:
        email = email.strip().lower()
        if not email or '@' not in email or '.' not in email:
            return False, 'Please provide a valid email address.', 400

        # Check rate-limit / cooldown from last OTP
        last_otp = EmailOTP.query.filter_by(email=email).order_by(EmailOTP.created_at.desc()).first()
        if last_otp and not last_otp.is_used:
            elapsed = (datetime.utcnow() - last_otp.created_at).total_seconds()
            if elapsed < cls.COOLDOWN_SECONDS:
                remaining = int(cls.COOLDOWN_SECONDS - elapsed)
                return False, f'Please wait {remaining} seconds before requesting another code.', 429

        # Generate new 6-digit OTP
        otp_code = cls.generate_otp()
        otp_hash = EmailOTP.hash_otp(otp_code)
        expires_at = datetime.utcnow() + timedelta(minutes=cls.EXPIRATION_MINUTES)

        new_otp = EmailOTP(
            email=email,
            otp_hash=otp_hash,
            expires_at=expires_at,
            attempts=0,
            is_used=False
        )
        db.session.add(new_otp)

        # Log security audit
        sec_log = SecurityLog(
            event_type='otp_sent',
            email=email,
            ip_address=ip_address,
            user_agent=user_agent,
            details=f'OTP generated, expires in {cls.EXPIRATION_MINUTES} min'
        )
        db.session.add(sec_log)
        db.session.commit()

        # Send via SMTP or log to server
        cls._send_email(email, otp_code)

        return True, 'Verification code has been sent to your email address.', 200

    @classmethod
    def _send_email(cls, email: str, otp_code: str):
        smtp_server = os.environ.get('SMTP_SERVER')
        smtp_port = int(os.environ.get('SMTP_PORT', 587))
        smtp_user = os.environ.get('SMTP_USER')
        smtp_pass = os.environ.get('SMTP_PASSWORD')

        if smtp_server and smtp_user and smtp_pass:
            try:
                msg = MIMEMultipart('alternative')
                msg['Subject'] = f'Lovely Professional University Helpdesk – Your Verification Code: {otp_code}'
                msg['From'] = f'LPU Helpdesk <{smtp_user}>'
                msg['To'] = email

                text_content = f"""Lovely Professional University Student Helpdesk (Unofficial Project)
Your 6-digit one-time verification code is: {otp_code}

This code expires in {cls.EXPIRATION_MINUTES} minutes. If you did not request this, you can safely ignore this email.
"""
                html_content = f"""
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
                    <h2 style="color: #ea580c; margin-bottom: 8px;">Lovely Professional University Student Helpdesk</h2>
                    <p style="color: #64748b; font-size: 13px; margin-top: 0;">Student-Developed Unofficial Guidance Project</p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
                    <p style="color: #334155; font-size: 14px;">Your 6-digit one-time verification code is:</p>
                    <div style="background: #fff7ed; border: 1px dashed #f97316; border-radius: 12px; padding: 16px; text-align: center; margin: 20px 0;">
                        <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #c2410c;">{otp_code}</span>
                    </div>
                    <p style="color: #64748b; font-size: 12px; line-height: 1.5;">
                        This verification code expires in <strong>{cls.EXPIRATION_MINUTES} minutes</strong> and can only be used once. Never share this code with anyone.
                    </p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                    <p style="color: #94a3b8; font-size: 11px;">
                        This is an unofficial peer helpdesk project and is not affiliated with or endorsed by Lovely Professional University.
                    </p>
                </div>
                """
                msg.attach(MIMEText(text_content, 'plain'))
                msg.attach(MIMEText(html_content, 'html'))

                server = smtplib.SMTP(smtp_server, smtp_port, timeout=10)
                server.starttls()
                server.login(smtp_user, smtp_pass)
                server.sendmail(smtp_user, [email], msg.as_string())
                server.quit()
                logger.info(f"Successfully dispatched OTP email to {email}")
                return
            except Exception as e:
                logger.error(f"Failed to send SMTP email: {e}. Falling back to server logs.")

        # Development / Default Fallback: Clean console log
        print(f"\n=======================================================")
        print(f"[AUTH EMAIL SERVICE] Secure Verification Code for: {email}")
        print(f"OTP CODE: >>> {otp_code} <<< (Valid for {cls.EXPIRATION_MINUTES} minutes)")
        print(f"=======================================================\n")
        logger.info(f"[DEV AUTH] Verification OTP for {email}: {otp_code}")

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
            EmailOTP.expires_at > datetime.utcnow()
        ).order_by(EmailOTP.created_at.desc()).first()

        if not otp_record:
            # Check if there is an expired or exhausted record
            past_record = EmailOTP.query.filter_by(email=email).order_by(EmailOTP.created_at.desc()).first()
            if past_record and past_record.attempts >= cls.MAX_ATTEMPTS:
                return False, 'Too many invalid attempts. Please request a new verification code.', 400
            return False, 'Invalid or expired code. Please request a new code.', 400

        if otp_record.attempts >= cls.MAX_ATTEMPTS:
            return False, 'Maximum attempts exceeded for this code. Please request a new one.', 400

        if not otp_record.verify(candidate_otp):
            attempts_left = cls.MAX_ATTEMPTS - otp_record.attempts
            return False, f'Incorrect verification code. {attempts_left} attempt(s) remaining.', 400

        # Log success
        sec_log = SecurityLog(
            event_type='otp_verified',
            email=email,
            ip_address=ip_address,
            details='OTP successfully verified'
        )
        db.session.add(sec_log)
        db.session.commit()

        return True, 'Verification successful.', 200
