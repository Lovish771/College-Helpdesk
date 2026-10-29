from datetime import datetime
from app import db

class KnowledgeSource(db.Model):
    __tablename__ = 'knowledge_sources'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    url = db.Column(db.String(500))
    document_filename = db.Column(db.String(200))
    source_type = db.Column(db.String(50))  # official_website, official_document, secondary_source
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship with knowledge entries
    knowledge_entries = db.relationship('KnowledgeEntry', backref='source', lazy='dynamic')

class KnowledgeEntry(db.Model):
    __tablename__ = 'knowledge_entries'
    
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(100), nullable=False)  # programmes, admissions, fees, etc.
    program_id = db.Column(db.String(50), db.ForeignKey('programs.id'), nullable=True)
    question = db.Column(db.Text)
    answer = db.Column(db.Text, nullable=False)
    verification_status = db.Column(db.String(50), default='needs_review')
    source_id = db.Column(db.Integer, db.ForeignKey('knowledge_sources.id'))
    last_verified = db.Column(db.DateTime)
    effective_date = db.Column(db.DateTime)
    expiry_date = db.Column(db.DateTime)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'category': self.category,
            'program_id': self.program_id,
            'question': self.question,
            'answer': self.answer,
            'verification_status': self.verification_status,
            'last_verified': self.last_verified.isoformat() if self.last_verified else None,
            'notes': self.notes,
        }
