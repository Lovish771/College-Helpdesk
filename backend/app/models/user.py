from datetime import datetime, timedelta
import hashlib
import secrets
from app import db

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    name = db.Column(db.String(150), default='Student')
    role = db.Column(db.String(50), default='student')  # 'student', 'admin'
    is_verified = db.Column(db.Boolean, default=True)
    accepted_terms = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship with conversation sessions
    conversations = db.relationship('ConversationSession', backref='user', lazy='dynamic')
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'role': self.role,
            'is_verified': self.is_verified,
            'accepted_terms': self.accepted_terms,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None,
        }

class EmailOTP(db.Model):
    __tablename__ = 'email_otps'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False, index=True)
    otp_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)
    attempts = db.Column(db.Integer, default=0)
    is_used = db.Column(db.Boolean, default=False)
    
    @staticmethod
    def hash_otp(otp_str: str) -> str:
        return hashlib.sha256(otp_str.strip().encode('utf-8')).hexdigest()
    
    def verify(self, candidate_otp: str) -> bool:
        if self.is_used:
            return False
        if datetime.utcnow() > self.expires_at:
            return False
        if self.attempts >= 5:
            return False
            
        candidate_hash = self.hash_otp(candidate_otp)
        matches = secrets.compare_digest(self.otp_hash, candidate_hash)
        if not matches:
            self.attempts += 1
            db.session.commit()
            return False
            
        self.is_used = True
        db.session.commit()
        return True

class SecurityLog(db.Model):
    __tablename__ = 'security_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    event_type = db.Column(db.String(50), nullable=False)  # 'otp_sent', 'otp_success', 'otp_failed', 'login', 'rate_limit', etc.
    email = db.Column(db.String(255), nullable=True)
    ip_address = db.Column(db.String(50), nullable=True)
    user_agent = db.Column(db.String(255), nullable=True)
    details = db.Column(db.String(255), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        # Mask email for privacy: jo***@example.com
        masked_email = None
        if self.email and '@' in self.email:
            parts = self.email.split('@')
            local = parts[0]
            masked_local = (local[:2] + '***') if len(local) > 2 else (local[0] + '***')
            masked_email = f"{masked_local}@{parts[1]}"
        elif self.email:
            masked_email = self.email[:3] + '***'
            
        return {
            'id': self.id,
            'event_type': self.event_type,
            'email': masked_email,
            'ip_address': self.ip_address,
            'details': self.details,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
        }
