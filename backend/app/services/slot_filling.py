from datetime import datetime, timedelta
from app import db
from app.models import ConversationSession, Program

class SlotFilling:
    """Manages conversation context and slot filling for LPU Helpdesk"""
    
    SLOT_TYPES = {
        'program': 'Which programme at Lovely Professional University are you asking about?',
        'semester': 'Which year or semester would you like to explore?',
        'fee_type': 'Are you asking about tuition fee, hostel fee, or total programme fee?',
        'qualification': 'What is your highest qualification?',
    }
    
    def __init__(self):
        self.context_cache = {}
    
    def get_context(self, conversation_id):
        """Get conversation context from cache or database"""
        if conversation_id in self.context_cache:
            return self.context_cache[conversation_id]
        
        session = db.session.get(ConversationSession, conversation_id)
        context = {
            'program': None,
            'semester': None,
            'fee_type': None,
            'qualification': None,
            'pending_intent': None,
            'last_update': session.last_activity if session else datetime.utcnow(),
        }
        self.context_cache[conversation_id] = context
        return context
    
    def update_context(self, conversation_id, slot, value):
        """Update a specific slot in the conversation context"""
        context = self.get_context(conversation_id)
        context[slot] = value
        context['last_update'] = datetime.utcnow()
        self.context_cache[conversation_id] = context
        return context
    
    def clear_context(self, conversation_id):
        """Clear conversation context"""
        if conversation_id in self.context_cache:
            del self.context_cache[conversation_id]
    
    def get_missing_slots(self, intent, context):
        """
        Determine which slots are missing for a given intent.
        For fee and eligibility queries, the essential slot is 'program'.
        """
        required_slots = {
            'fee_query': ['program'],
            'eligibility_query': ['program'],
            'curriculum_query': ['program'],
        }
        
        if intent not in required_slots:
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
        return datetime.utcnow() > expiry_time
