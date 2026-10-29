import os
from functools import wraps
from datetime import datetime
from flask import Blueprint, request, jsonify, g
from app import db
from app.models.user import User, SecurityLog, utc_now
from app.models.admin import AdminUser
from app.services.email_service import EmailService
from app.services.jwt_service import JWTService

auth_bp = Blueprint('auth', __name__)

def get_current_user():
    """Extract and authenticate current user from Bearer token."""
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None
    token = auth_header.split(' ', 1)[1].strip()
    payload = JWTService.decode(token)
    if not payload:
        return None
        
    user_id = payload.get('sub')
    email = payload.get('email')
    
    # Check regular User table
    if user_id:
        user = db.session.get(User, user_id)
        if user:
            return user
            
    # Check AdminUser table if role is admin
    if payload.get('role') == 'admin' and email:
        admin_user = AdminUser.query.filter_by(email=email).first()
        if admin_user:
            return admin_user
            
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
        'message': msg,
        'cooldownSeconds': meta.get('cooldown_seconds', EmailService.COOLDOWN_SECONDS),
        'deliveredOnline': meta.get('delivered_online', False),
        'provider': meta.get('provider', '')
    }
    if meta.get('dev_otp'):
        resp['devOtp'] = meta['dev_otp']
        resp['notice'] = f"Notice: External email credentials are not configured in .env. For testing, your verification code is {meta['dev_otp']}."
    if not success:
        resp['error'] = msg

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
    admin_emails = [e.strip().lower() for e in os.environ.get('ADMIN_EMAILS', '').split(',') if e.strip()]
    role = 'admin' if email in admin_emails else 'student'

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

    return jsonify({
        'success': True,
        'message': 'Authentication successful.',
        'token': token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/api/auth/me', methods=['GET'])
def me():
    """Return authenticated profile information."""
    user = get_current_user()
    if not user:
        return jsonify({
            'success': False,
            'user': None
        }), 200
        
    return jsonify({
        'success': True,
        'user': user.to_dict()
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
