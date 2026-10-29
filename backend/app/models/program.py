from datetime import datetime
from app import db

class Program(db.Model):
    __tablename__ = 'programs'
    
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    short_name = db.Column(db.String(100), nullable=False)
    degree = db.Column(db.String(50), nullable=False)
    duration = db.Column(db.String(20), nullable=False)
    eligibility = db.Column(db.Text)
    accepts_qualifications = db.Column(db.JSON)  # List of accepted qualifications
    min_percent = db.Column(db.Integer)
    description = db.Column(db.Text)
    tags = db.Column(db.JSON)  # List of tags
    match_pattern = db.Column(db.String(500))  # Regex pattern for matching
    verification_status = db.Column(db.String(50), default='needs_review')  # verified_official, secondary_source, needs_review, expired
    source_url = db.Column(db.String(500))
    last_verified = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with curriculum
    curriculum_courses = db.relationship('CurriculumCourse', backref='program', lazy='dynamic')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'short': self.short_name,
            'degree': self.degree,
            'duration': self.duration,
            'eligibility': self.eligibility,
            'accepts': self.accepts_qualifications or [],
            'minPercent': self.min_percent,
            'description': self.description,
            'tags': self.tags or [],
            'match': self.match_pattern,
            'verification_status': self.verification_status,
            'is_active': self.is_active,
        }
