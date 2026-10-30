from datetime import datetime, timedelta
from flask import Blueprint, jsonify, current_app, request
from app import db
from app.models.conversation import ConversationSession, ConversationMessage
from app.models.feedback import UnansweredQuery, Feedback
from app.models.user import utc_now, User
from app.routes.auth import get_current_user, is_admin_email

bp = Blueprint('analytics', __name__)

INTENT_LABEL_MAP = {
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
    'entrance_exam': 'Entrance & LPUNEST',
    'transport_query': 'Transport & Bus',
}

@bp.route('/analytics', methods=['GET'])
def get_analytics():
    """Retrieve real database analytics and telemetry (restricted strictly to Admin)."""
    user = get_current_user()
    is_admin = False
    if user:
        if getattr(user, 'role', '') == 'admin' or user.__class__.__name__ == 'AdminUser':
            is_admin = True
        elif hasattr(user, 'email') and is_admin_email(user.email):
            is_admin = True

    if not is_admin and not current_app.config.get('TESTING'):
        return jsonify({
            'success': False,
            'error': 'Access denied. Telemetry and audit logs are restricted strictly to university administrators.'
        }), 403

    range_param = request.args.get('range', '30d')
    days = 7 if range_param == '7d' else (90 if range_param == '90d' else (3650 if range_param == 'all' else 30))
    cutoff = utc_now() - timedelta(days=days)

    # 1. Real totals, scoped to the selected range like every other panel.
    sessions_query = ConversationSession.query
    messages_query = ConversationMessage.query
    if range_param != 'all':
        sessions_query = sessions_query.filter(ConversationSession.started_at >= cutoff)
        messages_query = messages_query.filter(ConversationMessage.timestamp >= cutoff)

    total_conversations = sessions_query.count()
    total_messages = messages_query.count()
    total_bot_messages = messages_query.filter(ConversationMessage.role == 'bot').count()
    answered_messages = messages_query.filter(
        ConversationMessage.role == 'bot',
        ConversationMessage.answer_status == 'answered'
    ).count()

    unanswered_query = UnansweredQuery.query
    if range_param != 'all':
        unanswered_query = unanswered_query.filter(UnansweredQuery.last_seen >= cutoff)
    unanswered_queries = unanswered_query.count()

    # No bot replies in range means there is no rate to report. Reporting 100%
    # here is what made an empty dashboard look healthy.
    answer_rate = (
        round((answered_messages / total_bot_messages) * 100, 1)
        if total_bot_messages > 0 else None
    )

    # 2. Real Topic / Intent Distribution
    topic_query = db.session.query(
        ConversationMessage.detected_intent,
        db.func.count(ConversationMessage.id)
    ).filter(
        ConversationMessage.detected_intent.isnot(None),
        ConversationMessage.detected_intent != 'unknown',
        ConversationMessage.detected_intent != 'greeting',
        ConversationMessage.detected_intent != 'goodbye'
    )
    if range_param != 'all':
        topic_query = topic_query.filter(ConversationMessage.timestamp >= cutoff)

    topic_rows = topic_query.group_by(ConversationMessage.detected_intent).order_by(
        db.func.count(ConversationMessage.id).desc()
    ).limit(6).all()

    total_topic_count = sum(c for _, c in topic_rows) or 1
    topics = [
        {
            'name': INTENT_LABEL_MAP.get(intent, intent.replace('_', ' ').title()),
            'count': count,
            'percentage': round((count / total_topic_count) * 100, 1)
        }
        for intent, count in topic_rows
    ]

    # 3. Real Daily Activity Timeline (for SVG area / volume chart)
    daily_query = db.session.query(
        db.func.date(ConversationMessage.timestamp),
        db.func.count(ConversationMessage.id)
    )
    if range_param != 'all':
        daily_query = daily_query.filter(ConversationMessage.timestamp >= cutoff)

    daily_rows = daily_query.group_by(
        db.func.date(ConversationMessage.timestamp)
    ).order_by(db.func.date(ConversationMessage.timestamp)).all()

    timeline = [{'date': str(d), 'count': c} for d, c in daily_rows if d]

    # 4. Real User Satisfaction Feedback
    feedback_query = Feedback.query
    if range_param != 'all':
        feedback_query = feedback_query.filter(Feedback.created_at >= cutoff)

    positive_count = feedback_query.filter(Feedback.is_helpful == True).count()
    negative_count = feedback_query.filter(Feedback.is_helpful == False).count()
    total_feedback = positive_count + negative_count

    # Only ever report what was actually submitted. An earlier version derived a
    # satisfaction split from the answer rate when nobody had voted, which put
    # invented percentages on the dashboard.
    if total_feedback > 0:
        pos_pct = round((positive_count / total_feedback) * 100)
        neg_pct = round((negative_count / total_feedback) * 100)
        neu_pct = max(0, 100 - pos_pct - neg_pct)
    else:
        pos_pct = neg_pct = neu_pct = 0

    feedback_data = {
        'positive': pos_pct,
        'neutral': neu_pct,
        'negative': neg_pct,
        'total': total_feedback,
        'upvotes': positive_count,
        'downvotes': negative_count,
        'has_data': total_feedback > 0
    }

    # 5. Real Student Inquiry & Audit Logs (same window as the rest of the page)
    recent_query = ConversationMessage.query.filter_by(role='user')
    if range_param != 'all':
        recent_query = recent_query.filter(ConversationMessage.timestamp >= cutoff)
    recent_user_messages = recent_query.order_by(
        ConversationMessage.timestamp.desc()
    ).limit(25).all()

    recent = []
    for m in recent_user_messages:
        text = (m.content or '').strip()
        if not text:
            continue
        intent = m.detected_intent or 'general_inquiry'
        label = INTENT_LABEL_MAP.get(intent, intent.replace('_', ' ').title())
        is_answered = intent != 'unknown' and intent != 'general_inquiry'
        status = 'Answered' if is_answered else 'Needs review'
        date_str = m.timestamp.strftime('%Y-%m-%d %H:%M') if m.timestamp else 'Recent'
        recent.append([text, label, status, date_str])

    # If no recent user messages yet, check UnansweredQuery table
    if not recent:
        unanswered_items = UnansweredQuery.query.order_by(UnansweredQuery.last_seen.desc()).limit(15).all()
        for u in unanswered_items:
            date_str = u.last_seen.strftime('%Y-%m-%d %H:%M') if u.last_seen else 'Recent'
            recent.append([
                u.query_text,
                INTENT_LABEL_MAP.get(u.detected_intent, (u.detected_intent or 'unknown').title()),
                'Unanswered',
                date_str
            ])

    return jsonify({
        'success': True,
        'totals': {
            'conversations': total_conversations,
            'messages': total_messages,
            'bot_messages': total_bot_messages,
            'answered': answered_messages,
            'unanswered': unanswered_queries,
            'rate': answer_rate,  # null when there is nothing to measure
            'has_data': total_messages > 0
        },
        'topics': topics,
        'timeline': timeline,
        'feedback': feedback_data,
        'recent': recent,
        'range': range_param,
        'generated_at': utc_now().isoformat()
    }), 200
