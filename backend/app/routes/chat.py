from flask import Blueprint, request, jsonify, current_app, abort
from app import db
from app.models import ConversationSession, ConversationMessage, UnansweredQuery
from app.services.rule_engine import RuleEngine
from app.routes.auth import get_current_user
from sqlalchemy import text
import secrets
import time
import os
from collections import defaultdict

bp = Blueprint('chat', __name__)
rule_engine = RuleEngine()

# Sliding-window rate limiter: max 30 requests per 60 seconds per IP
RATE_LIMIT_MAX = 30
RATE_LIMIT_WINDOW = 60  # seconds
_ip_request_timestamps = defaultdict(list)

def check_rate_limit(client_ip: str) -> tuple[bool, int]:
    """Check if client IP exceeds the rate limit in a sliding 60-second window."""
    now = time.time()
    window_start = now - RATE_LIMIT_WINDOW
    # Purge expired timestamps
    _ip_request_timestamps[client_ip] = [
        t for t in _ip_request_timestamps[client_ip] if t > window_start
    ]
    if len(_ip_request_timestamps[client_ip]) >= RATE_LIMIT_MAX:
        oldest = _ip_request_timestamps[client_ip][0]
        retry_after = max(1, int(oldest + RATE_LIMIT_WINDOW - now))
        return False, retry_after
    
    _ip_request_timestamps[client_ip].append(now)
    return True, 0

def get_client_ip() -> str:
    """Extract client IP honoring X-Forwarded-For or remote_addr."""
    forwarded = request.headers.get('X-Forwarded-For')
    if forwarded:
        return forwarded.split(',')[0].strip()
    return request.remote_addr or '127.0.0.1'

@bp.route('/health', methods=['GET'])
def health():
    """Health check endpoint checking DB connectivity and memory metrics"""
    try:
        db_status = 'connected'
        try:
            db.session.execute(text('SELECT 1')).scalar()
        except Exception as e:
            db_status = f'degraded: {str(e)}'

        memory_mb = 45.0
        try:
            import tracemalloc
            if not tracemalloc.is_tracing():
                tracemalloc.start()
            current, peak = tracemalloc.get_traced_memory()
            if current > 0:
                memory_mb = round(current / (1024 * 1024), 2)
        except Exception:
            pass

        email_env_detected = {
            'has_resend': bool(os.environ.get('RESEND_API_KEY') or os.environ.get('RESEND_KEY') or os.environ.get('RESEND_TOKEN') or os.environ.get('VITE_RESEND_API_KEY')),
            'has_smtp_user': bool(
                os.environ.get('SMTP_USER') or os.environ.get('SMTP_USERNAME') or
                os.environ.get('EMAIL_USER') or os.environ.get('EMAIL_USERNAME') or
                os.environ.get('EMAIL_ADDRESS') or os.environ.get('GMAIL_ADDRESS') or
                os.environ.get('MAIL_USERNAME') or os.environ.get('MAIL_USER') or
                os.environ.get('GMAIL_USER') or os.environ.get('GOOGLE_USER') or
                os.environ.get('GOOGLE_EMAIL') or os.environ.get('GMAIL') or
                os.environ.get('GMAIL_ID') or os.environ.get('EMAIL')
            ),
            'has_smtp_pass': bool(
                os.environ.get('SMTP_PASSWORD') or os.environ.get('SMTP_PASS') or
                os.environ.get('EMAIL_PASS') or os.environ.get('EMAIL_PASSWORD') or
                os.environ.get('MAIL_PASSWORD') or os.environ.get('MAIL_PASS') or
                os.environ.get('GMAIL_PASSWORD') or os.environ.get('GMAIL_APP_PASSWORD') or
                os.environ.get('GOOGLE_APP_PASSWORD') or os.environ.get('GOOGLE_PASSWORD') or
                os.environ.get('GOOGLE_PASS') or os.environ.get('APP_PASSWORD') or
                os.environ.get('GMAIL_PASS')
            ),
            'has_smtp_server': bool(os.environ.get('SMTP_SERVER') or os.environ.get('SMTP_HOST') or os.environ.get('EMAIL_HOST') or os.environ.get('MAIL_HOST') or os.environ.get('MAIL_SERVER')),
            'has_brevo': bool(os.environ.get('BREVO_API_KEY')),
            'has_sendgrid': bool(os.environ.get('SENDGRID_API_KEY')),
        }

        return jsonify({
            'status': 'healthy' if db_status == 'connected' else 'degraded',
            'version': '1.0.0',
            'service': 'LPU Helpdesk Backend',
            'university': 'Lovely Professional University',
            'database': db_status,
            'memory_mb': memory_mb,
            'email_config': email_env_detected
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'degraded',
            'error': str(e),
            'service': 'LPU Helpdesk Backend',
            'version': '1.0.0'
        }), 200

@bp.route('/chat', methods=['POST'])
def chat():
    """Main chat endpoint with sliding-window rate limiter, length caps, and intent detection"""
    client_ip = get_client_ip()
    allowed, retry_after = check_rate_limit(client_ip)
    if not allowed:
        res = jsonify({
            'error': 'Too many requests. Rate limit of 30 requests per minute exceeded.',
            'retry_after': retry_after
        })
        res.status_code = 429
        res.headers['Retry-After'] = str(retry_after)
        return res

    data = request.get_json(force=True, silent=True) or {}
    raw_message = data.get('message', '')
    
    if not isinstance(raw_message, str):
        return jsonify({'error': 'Message must be a string'}), 400

    message = raw_message.strip()
    if not message:
        return jsonify({'error': 'Message is required'}), 400

    # Enforce 500-character input cap
    if len(message) > 500:
        return jsonify({'error': 'Message length exceeds maximum limit of 500 characters'}), 400
    
    current_user = get_current_user()
    if not current_user and not current_app.config.get('TESTING'):
        return jsonify({
            'success': False,
            'error': 'Student login required. Please verify your email with a 6-digit OTP to chat with the LPU AI Assistant.',
            'requires_login': True
        }), 401

    user_id = getattr(current_user, 'id', None)
    conversation_id = data.get('conversation_id')
    
    # Get or create conversation session
    if not conversation_id:
        conversation_id = secrets.token_hex(12)
        session = ConversationSession(id=conversation_id, user_id=user_id)
        db.session.add(session)
        db.session.commit()
    else:
        session = db.session.get(ConversationSession, conversation_id)
        if not session:
            session = ConversationSession(id=conversation_id, user_id=user_id)
            db.session.add(session)
            db.session.commit()
        elif user_id and not session.user_id:
            session.user_id = user_id
            db.session.commit()
    
    # Log user message
    user_msg = ConversationMessage(
        session_id=conversation_id,
        role='user',
        content=message
    )
    db.session.add(user_msg)
    
    # Process message through rule engine
    try:
        reply, intent, confidence, requires_slot, slot, suggestions = rule_engine.process_message(message, conversation_id)
        
        is_answered = (intent != 'unknown' and confidence >= 0.35)
        answer_status = 'answered' if is_answered else 'unanswered'
        
        # Log bot response
        bot_msg = ConversationMessage(
            session_id=conversation_id,
            role='bot',
            content=reply,
            detected_intent=intent,
            confidence=confidence,
            answer_status=answer_status,
            requires_clarification=requires_slot
        )
        db.session.add(bot_msg)
        
        session.message_count = (session.message_count or 0) + 1
        db.session.commit()
        
        if not is_answered:
            existing = UnansweredQuery.query.filter_by(query_text=message).first()
            if existing:
                existing.occurrence_count = (existing.occurrence_count or 1) + 1
            else:
                unanswered = UnansweredQuery(
                    query_text=message,
                    detected_intent=intent,
                    session_id=conversation_id
                )
                db.session.add(unanswered)
            db.session.commit()
        
        action = 'contact' if intent in ['contact_query', 'unknown'] else None
        
        return jsonify({
            'reply': reply,
            'conversation_id': conversation_id,
            'intent': intent,
            'confidence': confidence,
            'requires_slot': requires_slot,
            'slot': slot,
            'suggestions': suggestions,
            'action': action,
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/conversations', methods=['GET'])
def list_conversations():
    """List recent conversation sessions for the authenticated user or anonymous session."""
    user = get_current_user()
    if user:
        sessions = ConversationSession.query.filter_by(user_id=user.id).order_by(ConversationSession.last_activity.desc()).limit(20).all()
    else:
        sessions = ConversationSession.query.filter_by(user_id=None).order_by(ConversationSession.last_activity.desc()).limit(10).all()
        
    return jsonify({
        'success': True,
        'conversations': [s.to_dict() for s in sessions]
    })

@bp.route('/conversations', methods=['DELETE'])
def clear_all_conversations():
    """Permanently clear all conversation sessions for the active user from the database."""
    user = get_current_user()
    if user:
        sessions = ConversationSession.query.filter_by(user_id=user.id).all()
        for s in sessions:
            db.session.delete(s)
        db.session.commit()
        return jsonify({'success': True, 'message': 'All conversation history has been permanently cleared from database.'})
    else:
        conv_id = request.args.get('conversation_id') or (request.get_json(silent=True) or {}).get('conversation_id')
        if conv_id:
            s = db.session.get(ConversationSession, conv_id)
            if s:
                db.session.delete(s)
                db.session.commit()
        return jsonify({'success': True, 'message': 'Conversation cleared successfully.'})

@bp.route('/conversations/<conversation_id>', methods=['GET'])
def get_conversation(conversation_id):
    """Get conversation history for a specific session."""
    session = db.session.get(ConversationSession, conversation_id)
    if not session:
        abort(404)
    user = get_current_user()
    if session.user_id and user and session.user_id != user.id and getattr(user, 'role', '') != 'admin':
        return jsonify({'error': 'Unauthorized to view this conversation.'}), 403

    messages = ConversationMessage.query.filter_by(session_id=conversation_id).order_by(ConversationMessage.timestamp).all()
    
    return jsonify({
        'session': session.to_dict(),
        'messages': [m.to_dict() for m in messages]
    })

@bp.route('/conversations/<conversation_id>', methods=['DELETE'])
def delete_conversation(conversation_id):
    """Permanently delete a specific conversation from the database."""
    session = db.session.get(ConversationSession, conversation_id)
    if not session:
        return jsonify({'success': True, 'message': 'Conversation does not exist or already deleted.'}), 200
    user = get_current_user()
    if session.user_id and user and session.user_id != user.id and getattr(user, 'role', '') != 'admin':
        return jsonify({'error': 'Unauthorized to delete this conversation.'}), 403

    db.session.delete(session)
    db.session.commit()
    
    return jsonify({'success': True, 'message': 'Conversation permanently deleted from database.'})
