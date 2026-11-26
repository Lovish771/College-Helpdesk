from flask import Blueprint, jsonify
from app import db
from app.models import ConversationSession, ConversationMessage, UnansweredQuery

bp = Blueprint('analytics', __name__)

@bp.route('/analytics', methods=['GET'])
def get_analytics():
    """Get live analytics data from conversation database (real data only)"""
    total_conversations = ConversationSession.query.count()
    total_messages = ConversationMessage.query.filter_by(role='bot').count()
    answered_messages = ConversationMessage.query.filter_by(role='bot', answer_status='answered').count()
    unanswered_queries = UnansweredQuery.query.count()

    answer_rate = (answered_messages / total_messages * 100) if total_messages > 0 else 0.0

    # Topic distribution with human-readable names
    intent_label_map = {
        'fee_query': 'Fees & Expenses',
        'hostel_query': 'Hostel & Living',
        'scholarship_query': 'Scholarships & Aid',
        'admission_query': 'Admissions & LPUNEST',
        'program_query': 'Programmes & Degrees',
        'eligibility_query': 'Eligibility Criteria',
        'curriculum_query': 'Curriculum & Syllabi',
        'placement_query': 'Placements & Packages',
        'campus_life': 'Campus Infrastructure',
        'contact_query': 'Contact & Helpline',
        'knowledge_query': 'FAQs & Guidelines',
    }

    topic_distribution = db.session.query(
        ConversationMessage.detected_intent,
        db.func.count(ConversationMessage.id)
    ).filter(
        ConversationMessage.detected_intent.isnot(None),
        ConversationMessage.detected_intent != 'unknown',
        ConversationMessage.detected_intent != 'greeting',
        ConversationMessage.detected_intent != 'goodbye'
    ).group_by(ConversationMessage.detected_intent).order_by(db.func.count(ConversationMessage.id).desc()).limit(6).all()

    topics = [[intent_label_map.get(intent, intent.replace('_', ' ').title()), count] for intent, count in topic_distribution]

    # Recent unanswered queries from real database
    recent_unanswered = UnansweredQuery.query.order_by(
        UnansweredQuery.last_seen.desc()
    ).limit(10).all()

    recent = [
        [q.query_text, q.detected_intent or 'unknown', q.status or 'Needs review', q.last_seen.isoformat() if q.last_seen else '']
        for q in recent_unanswered
    ]

    return jsonify({
        'totals': {
            'conversations': total_conversations,
            'messages': total_messages,
            'answered': answered_messages,
            'unanswered': unanswered_queries,
            'rate': round(answer_rate, 1)
        },
        'topics': topics,
        'recent': recent
    })
