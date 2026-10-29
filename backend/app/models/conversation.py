from datetime import datetime
from app import db

class ConversationSession(db.Model):
    __tablename__ = 'conversation_sessions'
    
    id = db.Column(db.String(100), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_activity = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    message_count = db.Column(db.Integer, default=0)
    
    # Relationship with messages
    messages = db.relationship('ConversationMessage', backref='session', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'last_activity': self.last_activity.isoformat() if self.last_activity else None,
            'message_count': self.message_count,
        }

class ConversationMessage(db.Model):
    __tablename__ = 'conversation_messages'
    
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(100), db.ForeignKey('conversation_sessions.id'), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # user, bot, system
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    detected_intent = db.Column(db.String(100))
    confidence = db.Column(db.Float)
    rule_id = db.Column(db.String(100))
    answer_status = db.Column(db.String(50))  # answered, needs_review, unanswered
    requires_clarification = db.Column(db.Boolean, default=False)
    from_verified_knowledge = db.Column(db.Boolean, default=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'session_id': self.session_id,
            'role': self.role,
            'content': self.content,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'detected_intent': self.detected_intent,
            'confidence': self.confidence,
            'answer_status': self.answer_status,
        }
