from datetime import datetime
from app import db

class Feedback(db.Model):
    __tablename__ = 'feedback'
    
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(100), db.ForeignKey('conversation_sessions.id'))
    message_id = db.Column(db.Integer, db.ForeignKey('conversation_messages.id'))
    is_helpful = db.Column(db.Boolean, nullable=False)
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'session_id': self.session_id,
            'is_helpful': self.is_helpful,
            'comment': self.comment,
            'created_at': self.created_at.isoformat(),
        }

class UnansweredQuery(db.Model):
    __tablename__ = 'unanswered_queries'
    
    id = db.Column(db.Integer, primary_key=True)
    query_text = db.Column(db.Text, nullable=False)
    detected_intent = db.Column(db.String(100))
    session_id = db.Column(db.String(100), db.ForeignKey('conversation_sessions.id'))
    occurrence_count = db.Column(db.Integer, default=1)
    first_seen = db.Column(db.DateTime, default=datetime.utcnow)
    last_seen = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    status = db.Column(db.String(50), default='pending')  # pending, needs_review, resolved
    notes = db.Column(db.Text)
    
    def to_dict(self):
        return {
            'id': self.id,
            'query_text': self.query_text,
            'detected_intent': self.detected_intent,
            'occurrence_count': self.occurrence_count,
            'status': self.status,
            'first_seen': self.first_seen.isoformat(),
            'last_seen': self.last_seen.isoformat(),
        }
