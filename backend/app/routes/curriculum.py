from flask import Blueprint, request, jsonify
from app import db
from app.models import CurriculumCourse, Program

bp = Blueprint('curriculum', __name__)

@bp.route('/curriculum', methods=['GET'])
def get_curriculum():
    """Get curriculum with filters"""
    program_id = request.args.get('program')
    academic_session = request.args.get('academic_session')
    year = request.args.get('year', type=int)
    semester = request.args.get('semester', type=int)
    
    query = CurriculumCourse.query
    
    if program_id:
        query = query.filter_by(program_id=program_id)
    if academic_session:
        query = query.filter_by(academic_session=academic_session)
    if year:
        query = query.filter_by(year=year)
    if semester:
        query = query.filter_by(semester=semester)
    
    courses = query.all()
    return jsonify([c.to_dict() for c in courses])

@bp.route('/curriculum/programs', methods=['GET'])
def get_curriculum_programs():
    """Get programs that have curriculum data"""
    program_ids = db.session.query(CurriculumCourse.program_id).distinct().all()
    program_ids = [p[0] for p in program_ids]
    
    programs = Program.query.filter(Program.id.in_(program_ids)).all()
    return jsonify([p.to_dict() for p in programs])
