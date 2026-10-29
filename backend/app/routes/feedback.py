from flask import Blueprint, request, jsonify
from app import db
from app.models import Feedback

bp = Blueprint('feedback', __name__)

@bp.route('/feedback', methods=['POST'])
def submit_feedback():
    """Submit feedback on a response"""
    data = request.get_json()
    
    feedback = Feedback(
        session_id=data.get('session_id'),
        message_id=data.get('message_id'),
        is_helpful=data.get('is_helpful'),
        comment=data.get('comment')
    )
    
    db.session.add(feedback)
    db.session.commit()
    
    return jsonify({'message': 'Feedback recorded'}), 201
