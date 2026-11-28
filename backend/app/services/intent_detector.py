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
        
        # Priority check: Compare / versus queries take absolute precedence
        if re.search(r'\b(compare|comparison|comparative|vs\.?|versus|difference\s+between)\b', message_lower):
            return 'compare_query', 0.99, 'compare_pattern'

        # Priority check: Hostel / mess fee queries shouldn't be hijacked by general fee_query
        if re.search(r'\b(hostel|hostels|mess|studio\s*apartment|seater|laundry)\b', message_lower) and not re.search(r'\b(tuition|b\.?tech|mba|bca|mca|b\.?com|bba)\b', message_lower):
            return 'hostel_query', 0.95, 'hostel_priority_pattern'

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

        # Built-in fallback intent patterns so conversational queries never fall through
        # when DB IntentPattern rows are partial or phrased colloquially
        fallback_rules = [
            ('hostel_query', r'\b(hostel|hostels|mess|accommodation|seater|studio|laundry|dorm|day\s*scholar)\b', 0.92),
            ('scholarship_query', r'\b(scholarship|scholarships|waiver|concession|merit\s*slab|lpunest\s*(?:slab|criteria|scholarship))\b', 0.92),
            ('placements', r'\b(placement|placements|package|packages|average\s*package|highest\s*package|ctc|salary|recruiter|recruiters)\b', 0.92),
            ('fee_query', r'\b(fee|fees|tuition|slab|slabs|fee\s*structure|charges|exam(?:ination)?\s*fee)\b', 0.90),
            ('admission_query', r'\b(admission|admissions|deadline|deadlines|documents|checklist|reporting|counselling|counseling|how\s+to\s+apply)\b', 0.90),
            ('eligibility_query', r'\b(eligibility|eligible|criteria|qualify|cutoff|cut-off)\b', 0.90),
            ('curriculum_query', r'\b(curriculum|syllabus|syllabi|subjects|modules)\b', 0.90),
            ('greeting', r'^(?:hi|hello|hey|namaste|hlo|yo|good\s*(?:morning|afternoon|evening))\b', 0.92),
        ]
        for intent_name, pat, conf in fallback_rules:
            if re.search(pat, message_lower, re.IGNORECASE):
                return intent_name, conf, f'builtin:{intent_name}'

        return 'unknown', 0.20, None
    
    def extract_program(self, message):
        """Extract program reference from message using name, short_name, or regex pattern"""
        programs = Program.query.filter_by(is_active=True).all()
        msg_lower = message.lower()
        msg_norm = re.sub(r'[().,/]+', ' ', msg_lower)
        msg_norm = re.sub(r'\s+', ' ', msg_norm).strip()
        
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
            short_l = program.short_name.lower()
            name_l = program.name.lower()
            if short_l in msg_lower or name_l in msg_lower or short_l in msg_norm or name_l in msg_norm:
                return program
        
        # 2. Pattern match via match_pattern (specific first)
        for program in sorted_programs:
            if program.match_pattern:
                try:
                    if re.search(program.match_pattern, msg_lower, re.IGNORECASE) or re.search(program.match_pattern, msg_norm, re.IGNORECASE):
                        return program
                except re.error:
                    continue
        
        return None

    def extract_programs(self, message):
        """Extract multiple program references from message"""
        programs = Program.query.filter_by(is_active=True).all()
        msg_lower = message.lower()
        matched = []
        
        sorted_programs = sorted(
            programs,
            key=lambda p: (
                p.id == 'btech-cse',
                -len(p.short_name)
            )
        )
        
        for program in sorted_programs:
            if program.short_name.lower() in msg_lower or program.name.lower() in msg_lower:
                if program not in matched:
                    matched.append(program)
            elif program.match_pattern:
                try:
                    if re.search(program.match_pattern, msg_lower, re.IGNORECASE):
                        if program not in matched:
                            matched.append(program)
                except re.error:
                    continue
        
        return matched
    
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
