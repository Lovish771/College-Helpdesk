from datetime import datetime
from app import db
from app.models.user import utc_now
import hashlib
import secrets
try:
    import bcrypt
except ImportError:
    bcrypt = None

class AdminUser(db.Model):
    __tablename__ = 'admin_users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(200), unique=True, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=utc_now)
    last_login = db.Column(db.DateTime)
    
    def set_password(self, password):
        if bcrypt:
            self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        else:
            salt = secrets.token_hex(16)
            h = hashlib.sha256((salt + password).encode('utf-8')).hexdigest()
            self.password_hash = f"sha256${salt}${h}"
    
    def check_password(self, password):
        if self.password_hash.startswith('sha256$'):
            parts = self.password_hash.split('$')
            if len(parts) == 3:
                _, salt, h = parts
                return hashlib.sha256((salt + password).encode('utf-8')).hexdigest() == h
        if bcrypt:
            try:
                return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
            except Exception:
                return False
        return False
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'last_login': self.last_login.isoformat() if self.last_login else None,
        }

class AuditLog(db.Model):
    __tablename__ = 'audit_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    admin_id = db.Column(db.Integer, db.ForeignKey('admin_users.id'))
    action = db.Column(db.String(100), nullable=False)  # knowledge_created, knowledge_verified, etc.
    entity_type = db.Column(db.String(50))  # knowledge_entry, program, etc.
    entity_id = db.Column(db.Integer)
    old_value = db.Column(db.JSON)
    new_value = db.Column(db.JSON)
    ip_address = db.Column(db.String(50))
    timestamp = db.Column(db.DateTime, default=utc_now)
    
    def to_dict(self):
        return {
            'id': self.id,
            'admin_id': self.admin_id,
            'action': self.action,
            'entity_type': self.entity_type,
            'entity_id': self.entity_id,
            'timestamp': self.timestamp.isoformat(),
        }
