from datetime import datetime
from app import db

class IntentPattern(db.Model):
    __tablename__ = 'intent_patterns'
    
    id = db.Column(db.Integer, primary_key=True)
    intent_name = db.Column(db.String(100), nullable=False, unique=True)
    patterns = db.Column(db.JSON, nullable=False)  # List of regex patterns
    priority = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'intent': self.intent_name,
            'patterns': self.patterns,
            'priority': self.priority,
            'is_active': self.is_active,
        }
