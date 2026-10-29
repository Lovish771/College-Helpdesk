import re
from app.models import IntentPattern, Program

class IntentDetector:
    def __init__(self):
        self.cache = {}
    
    def detect_intent(self, message):
        """
        Detect the primary intent from a user message.
        Returns tuple: (intent_name, confidence_score, matched_pattern)
        """
        message_lower = message.lower().strip()
        
        # Load active intent patterns from database ordered by priority
        patterns = IntentPattern.query.filter_by(is_active=True).order_by(IntentPattern.priority.desc()).all()
        
        best_match = None
        best_pattern = None
        highest_priority = -1
        
        for intent_obj in patterns:
            for pattern in intent_obj.patterns:
                try:
                    if re.search(pattern, message_lower, re.IGNORECASE):
                        if intent_obj.priority > highest_priority:
                            highest_priority = intent_obj.priority
                            best_match = intent_obj.intent_name
                            best_pattern = pattern
                except re.error:
                    continue
        
        if best_match:
            # High-confidence matched rule
            confidence = 0.95 if highest_priority >= 5 else 0.88
            return best_match, confidence, best_pattern
        
        return 'unknown', 0.20, None
    
    def extract_program(self, message):
        """Extract program reference from message using name, short_name, or regex pattern"""
        programs = Program.query.filter_by(is_active=True).all()
        msg_lower = message.lower()
        
        # Sort candidates so specializations/specific tracks are evaluated before base/core CSE
        sorted_programs = sorted(
            programs,
            key=lambda p: (
                p.id == 'btech-cse',
                -len(p.short_name)
            )
        )
        
        # 1. Exact match with short_name or full name (specific first)
        for program in sorted_programs:
            if program.short_name.lower() in msg_lower or program.name.lower() in msg_lower:
                return program
        
        # 2. Pattern match via match_pattern (specific first)
        for program in sorted_programs:
            if program.match_pattern:
                try:
                    if re.search(program.match_pattern, msg_lower, re.IGNORECASE):
                        return program
                except re.error:
                    continue
        
        return None
    
    def extract_semester(self, message):
        """Extract semester/year from message"""
        message_lower = message.lower()
        
        # Match "Semester X" or "Sem X"
        sem_match = re.search(r'(?:semester|sem)\s*(\d+)', message_lower)
        if sem_match:
            return int(sem_match.group(1))
        
        # Match "Xth year" and convert to first semester of that year
        year_match = re.search(r'(\d+)(?:st|nd|rd|th)?\s*year', message_lower)
        if year_match:
            year = int(year_match.group(1))
            return year * 2 - 1
        
        return None
    
    def extract_fee_type(self, message):
        """Extract fee type from message"""
        message_lower = message.lower()
        
        if 'hostel' in message_lower:
            return 'hostel'
        elif 'tuition' in message_lower:
            return 'tuition'
        elif 'annual' in message_lower or 'year' in message_lower:
            return 'annual'
        elif 'semester' in message_lower or 'sem' in message_lower:
            return 'semester'
        elif 'exam' in message_lower:
            return 'exam'
        
        return 'all'
