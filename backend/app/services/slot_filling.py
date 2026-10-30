import json
from datetime import timedelta
from app import db
from app.models import ConversationSession
from app.models.user import utc_now

class SlotFilling:
    """Manages conversation context and slot filling for LPU Helpdesk"""

    SLOT_TYPES = {
        'program': 'Which programme at Lovely Professional University are you asking about?',
        'semester': 'Which year or semester would you like to explore?',
        'fee_type': 'Are you asking about tuition fee, hostel fee, or total programme fee?',
        'qualification': 'What is your highest qualification?',
    }

    # The slots carried from one turn to the next. Only plain JSON values are ever
    # stored here - a programme is remembered by its *id*, never as an ORM row.
    # A row cached from an earlier request belongs to that request's SQLAlchemy
    # session, and reading it later raised
    # "Instance <Program ...> is not bound to a Session".
    CONTEXT_SLOTS = ('program', 'semester', 'fee_type', 'qualification', 'pending_intent')

    def get_context(self, conversation_id):
        """Load the slot context remembered for this conversation."""
        context = {slot: None for slot in self.CONTEXT_SLOTS}
        session = db.session.get(ConversationSession, conversation_id)
        context['last_update'] = session.last_activity if session else utc_now()

        stored = self._stored_context(session)
        if stored:
            for slot in self.CONTEXT_SLOTS:
                if stored.get(slot) is not None:
                    context[slot] = stored[slot]

        return context

    def save_context(self, conversation_id, context):
        """
        Persist the slot context on the conversation row.

        Never raises: failing to remember a slot must not cost the user their
        answer, so a database hiccup here degrades to a single-turn conversation.
        """
        context['last_update'] = utc_now()
        try:
            session = db.session.get(ConversationSession, conversation_id)
            if session is None:
                return context
            session.context_json = json.dumps(
                {slot: context.get(slot) for slot in self.CONTEXT_SLOTS})
            db.session.commit()
        except Exception:
            db.session.rollback()
        return context

    def update_context(self, conversation_id, slot, value):
        """Update a single slot in the conversation context"""
        context = self.get_context(conversation_id)
        context[slot] = value
        return self.save_context(conversation_id, context)

    def clear_context(self, conversation_id):
        """Forget everything remembered about this conversation"""
        try:
            session = db.session.get(ConversationSession, conversation_id)
            if session is not None:
                session.context_json = None
                db.session.commit()
        except Exception:
            db.session.rollback()

    def _stored_context(self, session):
        """The JSON context stored on a session row, or None when unusable."""
        if session is None:
            return None
        try:
            raw = session.context_json
        except Exception:
            # A database older than the context_json column simply has no memory.
            return None
        if not raw:
            return None
        try:
            data = json.loads(raw)
        except (TypeError, ValueError):
            return None
        return data if isinstance(data, dict) else None

    def get_missing_slots(self, intent, context):
        """
        Determine which slots are missing for a given intent.
        For fee, total fee, and eligibility queries, the essential slot is 'program'.
        """
        required_slots = {
            'fee_query': ['program'],
            'total_fee_query': ['program'],
            'eligibility_query': ['program'],
            'curriculum_query': ['program'],
        }

        if intent not in required_slots:
            return []

        # Hostel tariffs depend on the room, not on the degree programme, so
        # "what is the hostel fee?" must not be answered with "which programme?".
        if intent == 'fee_query' and context.get('fee_type') == 'hostel':
            return []

        missing = []
        for slot in required_slots[intent]:
            if not context.get(slot):
                missing.append(slot)

        return missing

    def generate_slot_question(self, slot, context):
        """Generate a question and suggestions to fill a missing slot"""
        if slot == 'program':
            suggestions = ['B.Tech CSE', 'B.Tech AI & ML', 'MBA', 'BCA', 'MCA', 'BBA']
            if context.get('pending_intent') == 'total_fee_query':
                return "Which programme would you like to calculate total degree fees for?", suggestions
            return "Sure! Which programme at Lovely Professional University are you asking about?", suggestions
        elif slot == 'semester':
            return "Which semester would you like to view the curriculum for?", ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4']
        elif slot == 'qualification':
            return "What is your qualifying examination stream?", ['10+2 (PCM)', '10+2 (Any stream)', "Bachelor's Degree"]

        return f"Could you please specify your {slot}?", []

    def is_context_expired(self, conversation_id):
        """Check if conversation context has expired"""
        context = self.get_context(conversation_id)
        if not context.get('last_update'):
            return True

        expiry_minutes = 60
        expiry_time = context['last_update'] + timedelta(minutes=expiry_minutes)
        return utc_now() > expiry_time
