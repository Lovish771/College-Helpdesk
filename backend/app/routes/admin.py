import os
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, g
from sqlalchemy import text
from app import db
from app.models.user import User, SecurityLog, utc_now
from app.models.conversation import ConversationSession, ConversationMessage
from app.models.feedback import UnansweredQuery
from app.models.program import Program
from app.models.intent import IntentPattern
from app.routes.auth import admin_required

bp = Blueprint('admin', __name__)

@bp.route('/admin/metrics', methods=['GET'])
@admin_required
def admin_metrics():
    """Retrieve comprehensive system metrics and real database analytics."""
    range_param = request.args.get('range', '30d')
    days = 7 if range_param == '7d' else (90 if range_param == '90d' else 30)
    cutoff = utc_now() - timedelta(days=days)

    total_users = User.query.count()
    active_users = User.query.filter(User.last_login >= cutoff).count()
    new_registrations = User.query.filter(User.created_at >= cutoff).count()

    # Every count below is scoped to the selected range, so the header's range
    # selector describes the numbers under it rather than only some of them.
    total_conversations = ConversationSession.query.filter(
        ConversationSession.started_at >= cutoff
    ).count()
    total_messages = ConversationMessage.query.filter(
        ConversationMessage.timestamp >= cutoff
    ).count()
    bot_messages = ConversationMessage.query.filter(
        ConversationMessage.role == 'bot',
        ConversationMessage.timestamp >= cutoff
    ).count()
    unanswered_queries = UnansweredQuery.query.filter(
        UnansweredQuery.last_seen >= cutoff
    ).count()

    failed_logins = SecurityLog.query.filter(
        SecurityLog.event_type.in_(['failed_admin_login', 'otp_failed']),
        SecurityLog.timestamp >= cutoff
    ).count()

    total_programs = Program.query.count()

    # Report the database as it actually answers right now. The previous
    # hardcoded "99.98% uptime / Healthy" was decoration that could not go red.
    try:
        db.session.execute(text('SELECT 1'))
        database_ok = True
    except Exception:
        db.session.rollback()
        database_ok = False

    # User registrations grouped by day
    # SQLite compatible date string formatting
    users_by_date = db.session.query(
        db.func.date(User.created_at),
        db.func.count(User.id)
    ).filter(User.created_at >= cutoff).group_by(db.func.date(User.created_at)).all()

    registration_trends = [{'date': d, 'count': c} for d, c in users_by_date]

    # Intent / category distribution
    category_counts = db.session.query(
        ConversationMessage.detected_intent,
        db.func.count(ConversationMessage.id)
    ).filter(
        ConversationMessage.detected_intent.isnot(None),
        ConversationMessage.detected_intent != 'unknown',
        ConversationMessage.timestamp >= cutoff
    ).group_by(ConversationMessage.detected_intent).order_by(db.func.count(ConversationMessage.id).desc()).limit(8).all()

    chat_volume = [{'category': intent.replace('_', ' ').title(), 'count': count} for intent, count in category_counts]
    # Chat volume is 100% real database distribution

    return jsonify({
        'success': True,
        'metrics': {
            'totalUsers': total_users,
            'activeUsers': active_users,
            'newRegistrations': new_registrations,
            'totalConversations': total_conversations,
            'totalMessages': total_messages,
            'botMessages': bot_messages,
            'unansweredQueries': unanswered_queries,
            'failedLogins': failed_logins,
            'totalPrograms': total_programs,
            'serverHealth': {
                'status': 'healthy' if database_ok else 'degraded',
                'database': 'Connected' if database_ok else 'Unavailable',
                'environment': os.environ.get('FLASK_ENV', 'production'),
                'rateLimiter': 'Active (30 req/min sliding-window)'
            }
        },
        'registrationTrends': registration_trends,
        'chatVolume': chat_volume,
        'range': range_param
    }), 200

@bp.route('/admin/users', methods=['GET'])
@admin_required
def admin_users():
    """Retrieve searchable, paginated list of registered student and admin accounts."""
    page = int(request.args.get('page', 1))
    limit = min(int(request.args.get('limit', 10)), 50)
    q = (request.args.get('q') or '').strip().lower()
    role_filter = request.args.get('role')

    query = User.query
    if q:
        query = query.filter(
            (User.email.ilike(f'%{q}%')) | (User.name.ilike(f'%{q}%'))
        )
    if role_filter:
        query = query.filter(User.role == role_filter)

    total = query.count()
    users = query.order_by(User.created_at.desc()).offset((page - 1) * limit).limit(limit).all()

    return jsonify({
        'success': True,
        'users': [u.to_dict() for u in users],
        'total': total,
        'page': page,
        'limit': limit,
        'totalPages': (total + limit - 1) // limit if limit > 0 else 1
    }), 200

@bp.route('/admin/users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    """Delete a user account and associated records."""
    user = User.query.get_or_404(user_id)
    if user.email == getattr(g.current_user, 'email', None):
        return jsonify({'success': False, 'error': 'Cannot delete your own administrator account.'}), 400

    # Also delete associated conversation sessions
    ConversationSession.query.filter_by(user_id=user.id).delete()
    db.session.delete(user)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': f'User {user.email} has been permanently deleted.'
    }), 200

@bp.route('/admin/logs', methods=['GET'])
@admin_required
def admin_logs():
    """Retrieve security audit logs with masked sensitive credentials."""
    page = int(request.args.get('page', 1))
    limit = min(int(request.args.get('limit', 20)), 100)
    event_type = request.args.get('type')

    query = SecurityLog.query
    if event_type:
        query = query.filter_by(event_type=event_type)

    total = query.count()
    logs = query.order_by(SecurityLog.timestamp.desc()).offset((page - 1) * limit).limit(limit).all()

    return jsonify({
        'success': True,
        'logs': [l.to_dict() for l in logs],
        'total': total,
        'page': page,
        'limit': limit
    }), 200

@bp.route('/admin/unanswered', methods=['GET'])
@admin_required
def admin_unanswered():
    """Retrieve and analyze unanswered student queries for continuous model & rule learning."""
    page = int(request.args.get('page', 1))
    limit = min(int(request.args.get('limit', 20)), 100)
    status_filter = request.args.get('status')

    query = UnansweredQuery.query
    if status_filter:
        query = query.filter_by(status=status_filter)

    total = query.count()
    items = query.order_by(UnansweredQuery.occurrence_count.desc(), UnansweredQuery.last_seen.desc()).offset((page - 1) * limit).limit(limit).all()

    return jsonify({
        'success': True,
        'unanswered': [q.to_dict() for q in items],
        'total': total,
        'page': page,
        'limit': limit
    }), 200

@bp.route('/admin/unanswered/<int:query_id>', methods=['PATCH'])
@admin_required
def update_unanswered_status(query_id):
    """Mark an unanswered query as reviewed, pending, or resolved."""
    q = db.session.get(UnansweredQuery, query_id)
    if not q:
        return jsonify({'success': False, 'error': 'Query not found'}), 404

    data = request.get_json(silent=True) or {}
    status = data.get('status')
    if status:
        q.status = status
    if 'notes' in data:
        q.notes = data['notes']
    db.session.commit()

    return jsonify({'success': True, 'query': q.to_dict()}), 200

@bp.route('/admin/intents', methods=['GET'])
@admin_required
def admin_get_intents():
    """List all registered intent patterns from the rule base."""
    patterns = IntentPattern.query.order_by(IntentPattern.priority.desc()).all()
    return jsonify({
        'success': True,
        'intents': [
            {
                'id': p.id,
                'name': p.intent_name,
                'patterns': p.patterns,
                'priority': p.priority,
                'is_active': p.is_active
            } for p in patterns
        ]
    }), 200

@bp.route('/admin/intents', methods=['POST'])
@admin_required
def admin_add_intent():
    """Dynamically expand the rule base with new intent patterns and regex."""
    data = request.get_json(silent=True) or {}
    intent_name = (data.get('intent_name') or '').strip()
    patterns = data.get('patterns') or []
    priority = int(data.get('priority', 5))

    if not intent_name or not patterns:
        return jsonify({'success': False, 'error': 'Both intent_name and patterns are required'}), 400

    existing = IntentPattern.query.filter_by(intent_name=intent_name).first()
    if existing:
        existing.patterns = patterns
        existing.priority = priority
        existing.is_active = True
    else:
        new_intent = IntentPattern(intent_name=intent_name, patterns=patterns, priority=priority, is_active=True)
        db.session.add(new_intent)

    db.session.commit()
    return jsonify({
        'success': True,
        'message': f'Intent pattern {intent_name} registered into active rule base.'
    }), 201
