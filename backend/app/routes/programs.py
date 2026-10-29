from flask import Blueprint, request, jsonify
from app import db
from app.models import Program
try:
    from backend.data.lpu_data import (
        admission_steps,
        deadlines,
        faqs,
        fees as lpu_fees,
        scholarships as lpu_scholarships,
        hostel as lpu_hostel,
        documents as lpu_documents,
        contact as lpu_contact,
        placements as lpu_placements,
    )
except ImportError:
    from data.lpu_data import (
        admission_steps,
        deadlines,
        faqs,
        fees as lpu_fees,
        scholarships as lpu_scholarships,
        hostel as lpu_hostel,
        documents as lpu_documents,
        contact as lpu_contact,
        placements as lpu_placements,
    )

bp = Blueprint('programs', __name__)

@bp.route('/programs', methods=['GET'])
def get_programs():
    """Get all programs"""
    programs = Program.query.filter_by(is_active=True).all()
    return jsonify([p.to_dict() for p in programs])

@bp.route('/programs/<program_id>', methods=['GET'])
def get_program_detail(program_id):
    """Get program details"""
    program = db.session.get(Program, program_id)
    if not program:
        return jsonify({'error': 'Program not found'}), 404
    return jsonify(program.to_dict())

@bp.route('/programs/search', methods=['GET'])
def search_programs():
    """Search programs by name or tags"""
    query = request.args.get('q', '').strip()[:100].lower()
    if not query:
        return get_programs()
    
    programs = Program.query.filter_by(is_active=True).all()
    filtered = [
        p for p in programs
        if query in p.name.lower() or query in p.short_name.lower() or any(query in str(tag).lower() for tag in (p.tags or []))
    ]
    return jsonify([p.to_dict() for p in filtered])

@bp.route('/admissions', methods=['GET'])
def get_admissions():
    """Get LPUNEST and admission steps, deadlines, and faqs"""
    return jsonify({
        'steps': admission_steps,
        'deadlines': deadlines,
        'faqs': faqs,
    })

@bp.route('/fees', methods=['GET'])
def get_fees():
    """Get fee structures for all programs"""
    programs = Program.query.filter_by(is_active=True).all()
    fee_list = []
    for p in programs:
        f = lpu_fees.get(p.id, {
            'tuition': '₹1,20,000 / semester',
            'other': '₹4,500 / semester (Exam & Tech fee)',
            'hostel': '₹45,000 to ₹1,20,000 / year',
            'scholarship': 'Up to 48% waiver via LPUNEST',
        })
        fee_list.append({
            'program': p.name,
            'short': p.short_name,
            'tuition': f['tuition'],
            'other': f['other'],
            'hostel': f['hostel'],
            'scholarship': f['scholarship'],
        })
    return jsonify(fee_list)

@bp.route('/scholarships', methods=['GET'])
def get_scholarships():
    """Get LPU scholarship schemes"""
    return jsonify(lpu_scholarships)

@bp.route('/hostel', methods=['GET'])
def get_hostel():
    """Get LPU Uni-World hostel facilities and room types"""
    return jsonify(lpu_hostel)

@bp.route('/documents', methods=['GET'])
def get_documents():
    """Get admission document checklist"""
    return jsonify(lpu_documents)

@bp.route('/contact', methods=['GET'])
def get_contact():
    """Get LPU admission office contact details"""
    return jsonify(lpu_contact)

@bp.route('/placements', methods=['GET'])
def get_placements():
    """Get LPU placement statistics and highlights"""
    return jsonify(lpu_placements)

@bp.route('/eligibility', methods=['POST'])
def check_eligibility():
    """Validate student eligibility for a specific program"""
    data = request.get_json(force=True, silent=True) or {}
    program_id = data.get('programId')
    qualification = data.get('qualification')
    percent_str = data.get('percent')

    program = db.session.get(Program, program_id)
    if not program:
        return jsonify({'eligible': False, 'message': 'Selected program was not found.'}), 404

    try:
        percent = float(percent_str)
    except (TypeError, ValueError):
        return jsonify({'eligible': False, 'message': 'Please enter a valid numeric percentage between 0 and 100.'}), 400

    accepts = program.accepts_qualifications or []
    if qualification not in accepts:
        return jsonify({
            'eligible': False,
            'message': f"{program.short_name} requires { ' or '.join(accepts) }. You selected {qualification}."
        })

    min_required = program.min_percent or 60
    if percent < min_required:
        return jsonify({
            'eligible': False,
            'message': f"Minimum requirement for {program.short_name} is {min_required}%. You entered {percent}%."
        })

    return jsonify({
        'eligible': True,
        'message': f"Congratulations! You meet the minimum academic criteria for {program.short_name} at Lovely Professional University. You can now register for LPUNEST to secure your admission and merit scholarship!"
    })
