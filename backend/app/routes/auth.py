import os
import logging
from functools import wraps
from datetime import datetime
from flask import Blueprint, request, jsonify, g
from app import db
from app.models.user import User, SecurityLog, utc_now
from app.models.admin import AdminUser
from app.services.email_service import EmailService
from app.services.jwt_service import JWTService

logger = logging.getLogger(__name__)

auth_bp = Blueprint('auth', __name__)

DEFAULT_ADMIN_EMAILS = [
    'anshulbadmosh2007@gmail.com',
    'lovishwork003@gmail.com',
    'admin@lpu.in',
    'admissions@lpu.co.in'
]

def is_admin_email(email: str) -> bool:
    """Check if an email address is designated as an administrator."""
    if not email or not isinstance(email, str):
        return False
    clean = email.strip().lower()
    env_admins = [e.strip().lower() for e in os.environ.get('ADMIN_EMAILS', '').split(',') if e.strip()]
    return clean in DEFAULT_ADMIN_EMAILS or clean in env_admins

def _restore_user_from_claims(payload):
    """Rebuild a session user from a valid JWT.

    The deployment stores SQLite in /tmp, which is per-instance: after a cold
    start the user row can be gone even though the signed token is still valid.
    Without this, every protected endpoint (including /api/auth/me) answered
    "not logged in" on the next page load and the browser threw the session away.
    """
    email = (payload.get('email') or '').strip().lower()
    if not email:
        return None

    role = 'admin' if is_admin_email(email) else (payload.get('role') or 'student')
    user = User.query.filter_by(email=email).first()

    if user is None:
        user = User(
            email=email,
            name=payload.get('name') or 'Student',
            role=role,
            is_verified=True,
            accepted_terms=True,
            created_at=utc_now(),
            last_login=utc_now(),
        )
        db.session.add(user)
    else:
        if role == 'admin' and user.role != 'admin':
            user.role = 'admin'
        user.last_login = utc_now()

    try:
        db.session.commit()
    except Exception as exc:
        db.session.rollback()
        logger.warning(f'[AUTH] Could not persist restored session for {email}: {exc}')

    return user


def get_current_user():
    """Extract and authenticate current user from Bearer token."""
    payload, _ = get_session_identity()
    if not payload:
        return None
    return _resolve_user_for_payload(payload)


def get_session_identity():
    """Return (payload, reason). reason is 'token_invalid' when the token itself
    is unusable, or None when the signature and expiry check passed."""
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None, 'token_invalid'
    token = auth_header.split(' ', 1)[1].strip()
    payload = JWTService.decode(token)
    if not payload:
        return None, 'token_invalid'
    return payload, None


def _resolve_user_for_payload(payload):
    user_id = payload.get('sub')
    email = (payload.get('email') or '').strip().lower()

    # 1. Normal path: the row still exists in this instance's database.
    if user_id:
        try:
            user = db.session.get(User, user_id)
        except Exception:
            user = None
        if user:
            if user.email and is_admin_email(user.email) and user.role != 'admin':
                user.role = 'admin'
                try:
                    db.session.commit()
                except Exception:
                    db.session.rollback()
            return user

    # 2. Admin accounts created through the admin table.
    if (payload.get('role') == 'admin' or (email and is_admin_email(email))) and email:
        admin_user = AdminUser.query.filter_by(email=email).first()
        if admin_user:
            return admin_user

    # 3. Row lost with the ephemeral database: rebuild it from the token.
    if email:
        return _restore_user_from_claims(payload)

    # 4. Admin table row addressed by id only.
    if user_id and payload.get('role') == 'admin':
        return db.session.get(AdminUser, user_id)

    return None

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({
                'success': False,
                'error': 'Authentication required. Please provide a valid Bearer token.'
            }), 401
        g.current_user = user
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({
                'success': False,
                'error': 'Admin authorization required. Please log in as an administrator.'
            }), 401
            
        is_admin = False
        if isinstance(user, AdminUser):
            is_admin = True
        elif hasattr(user, 'email') and is_admin_email(user.email):
            is_admin = True
        elif hasattr(user, 'role') and user.role == 'admin':
            is_admin = True
            
        if not is_admin:
            return jsonify({
                'success': False,
                'error': 'Access denied. Administrator privileges required.'
            }), 403
            
        g.current_user = user
        return f(*args, **kwargs)
    return decorated_function

@auth_bp.route('/api/auth/send-otp', methods=['POST'])
def send_otp():
    """Request a 6-digit cryptographic verification code sent to student email."""
    data = request.get_json(silent=True) or {}
    email = (data.get('email') or '').strip().lower()
    
    if not email or '@' not in email or '.' not in email:
        return jsonify({
            'success': False,
            'error': 'Please enter a valid email address.'
        }), 400
        
    ip_addr = request.remote_addr
    user_agent = request.headers.get('User-Agent', '')[:250]
    
    success, msg, status_code, meta = EmailService.request_otp(email, ip_address=ip_addr, user_agent=user_agent)
    resp = {
        'success': success,
        'message': msg if success else None,
        'error': msg if not success else None,
        'cooldownSeconds': meta.get('cooldown_seconds', EmailService.COOLDOWN_SECONDS),
        'deliveredOnline': meta.get('delivered_online', False),
        'provider': meta.get('provider', ''),
    }
    # In local/dev mode only: expose OTP in response so dev can test without real email
    if meta.get('dev_otp') and not meta.get('delivered_online'):
        resp['devOtp'] = meta['dev_otp']
        resp['notice'] = (
            f"[Dev Mode] No email provider configured. "
            f"Your verification code is: {meta['dev_otp']}. "
            f"Configure SMTP_USER and SMTP_PASSWORD (Gmail App Password) in Vercel environment variables to enable real email delivery."
        )
        # In dev mode, we allow proceeding even though email wasn't actually sent
        resp['success'] = True
        status_code = 200

    return jsonify(resp), status_code

@auth_bp.route('/api/auth/verify-otp', methods=['POST'])
def verify_otp():
    """Verify 6-digit OTP, create/login user, and issue JWT session token."""
    data = request.get_json(silent=True) or {}
    email = (data.get('email') or '').strip().lower()
    otp = str(data.get('otp') or '').strip()
    name = (data.get('name') or '').strip() or 'Student'
    accepted_terms = bool(data.get('acceptedTerms', True))
    
    if not email or not otp:
        return jsonify({
            'success': False,
            'error': 'Both email and 6-digit verification code are required.'
        }), 400
        
    ip_addr = request.remote_addr
    success, msg, status_code = EmailService.verify_otp(email, otp, ip_address=ip_addr)
    
    if not success:
        return jsonify({
            'success': False,
            'error': msg
        }), status_code

    # Check if this email is designated as an admin
    role = 'admin' if is_admin_email(email) else 'student'

    try:
        # Find or create User
        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(
                email=email,
                name=name,
                role=role,
                is_verified=True,
                accepted_terms=accepted_terms,
                created_at=utc_now(),
                last_login=utc_now()
            )
            db.session.add(user)
        else:
            if name and name != 'Student':
                user.name = name
            if role == 'admin':
                user.role = 'admin'
            user.last_login = utc_now()
            user.accepted_terms = accepted_terms

        db.session.commit()

        # Generate JWT Token
        token = JWTService.encode({
            'sub': user.id,
            'email': user.email,
            'name': user.name,
            'role': user.role
        })
    except Exception as e:
        try:
            db.session.rollback()
        except Exception:
            pass
        logger.error(f'[AUTH] Could not establish session for {email}: {type(e).__name__}: {e}')
        verbose = os.environ.get('EXPOSE_ERROR_DETAILS', '1') != '0'
        reason = f' ({type(e).__name__}: {e})' if verbose else ''
        return jsonify({
            'success': False,
            'error': f'Verified, but the session could not be created due to a server-side error{reason}. Please try again shortly.'
        }), 503

    return jsonify({
        'success': True,
        'message': 'Authentication successful.',
        'token': token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/api/auth/me', methods=['GET'])
def me():
    """Return authenticated profile information.

    Three distinct outcomes, because the client must only sign a user out when
    the token itself is unusable:
      401 token_invalid -> clear the stored session
      503 retryable     -> keep the session, try again later
      200 success       -> refresh the profile
    """
    payload, _ = get_session_identity()
    if not payload:
        return jsonify({
            'success': False,
            'user': None,
            'token_invalid': True,
            'error': 'Session expired. Please sign in again.'
        }), 401

    user = _resolve_user_for_payload(payload)
    if not user:
        return jsonify({
            'success': False,
            'user': None,
            'retryable': True,
            'error': 'Could not load the session profile right now. Please retry.'
        }), 503

    profile = user.to_dict()
    profile['isAdmin'] = bool(
        getattr(user, 'role', '') == 'admin'
        or (getattr(user, 'email', None) and is_admin_email(user.email))
        or isinstance(user, AdminUser)
    )

    return jsonify({
        'success': True,
        'user': profile
    }), 200

@auth_bp.route('/api/auth/logout', methods=['POST'])
def logout():
    """Log out current user and record security log."""
    user = get_current_user()
    if user:
        log = SecurityLog(
            event_type='logout',
            email=getattr(user, 'email', None),
            ip_address=request.remote_addr,
            details='User logged out'
        )
        db.session.add(log)
        db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Logged out successfully.'
    }), 200

@auth_bp.route('/api/auth/admin-login', methods=['POST'])
def admin_login():
    """Authenticate administrator using username/password credentials."""
    data = request.get_json(silent=True) or {}
    username = (data.get('username') or '').strip()
    password = str(data.get('password') or '').strip()

    if not username or not password:
        return jsonify({
            'success': False,
            'error': 'Username and password are required.'
        }), 400

    admin_user = AdminUser.query.filter(
        (AdminUser.username == username) | (AdminUser.email == username)
    ).first()

    if not admin_user or not admin_user.check_password(password):
        # Record security event
        log = SecurityLog(
            event_type='failed_admin_login',
            email=username,
            ip_address=request.remote_addr,
            details='Invalid admin credentials'
        )
        db.session.add(log)
        db.session.commit()
        return jsonify({
            'success': False,
            'error': 'Invalid administrator credentials.'
        }), 401

    admin_user.last_login = datetime.utcnow()
    
    # Audit log
    sec_log = SecurityLog(
        event_type='admin_login_success',
        email=admin_user.email,
        ip_address=request.remote_addr,
        details='Admin dashboard login'
    )
    db.session.add(sec_log)
    db.session.commit()

    token = JWTService.encode({
        'sub': admin_user.id,
        'username': admin_user.username,
        'email': admin_user.email,
        'role': 'admin'
    })

    return jsonify({
        'success': True,
        'token': token,
        'user': admin_user.to_dict()
    }), 200
