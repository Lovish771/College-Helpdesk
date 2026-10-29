from datetime import datetime
from app import db

class CurriculumCourse(db.Model):
    __tablename__ = 'curriculum_courses'
    
    id = db.Column(db.Integer, primary_key=True)
    program_id = db.Column(db.String(50), db.ForeignKey('programs.id'), nullable=False)
    academic_session = db.Column(db.String(50))  # e.g., "2024-25"
    year = db.Column(db.Integer)  # 1, 2, 3, 4
    semester = db.Column(db.Integer)  # 1-8
    course_code = db.Column(db.String(50), nullable=False)
    course_title = db.Column(db.String(200), nullable=False)
    credits = db.Column(db.Integer)
    course_type = db.Column(db.String(50))  # Core, Elective, Project, Internship
    description = db.Column(db.Text)
    verification_status = db.Column(db.String(50), default='needs_review')
    source_url = db.Column(db.String(500))
    last_verified = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'program_id': self.program_id,
            'academic_session': self.academic_session,
            'year': self.year,
            'semester': self.semester,
            'code': self.course_code,
            'name': self.course_title,
            'credits': self.credits,
            'type': self.course_type,
            'description': self.description,
            'verification_status': self.verification_status,
        }
