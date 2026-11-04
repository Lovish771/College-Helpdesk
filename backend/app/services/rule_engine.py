from app.models import Program, CurriculumCourse, KnowledgeEntry
from app.services.intent_detector import IntentDetector
from app.services.slot_filling import SlotFilling
try:
    from backend.data.lpu_data import (
        fees as lpu_fees,
        scholarships as lpu_scholarships,
        hostel as lpu_hostel,
        admission_steps,
        deadlines,
        documents as lpu_documents,
        contact as lpu_contact,
        placements as lpu_placements,
    )
except ImportError:
    from data.lpu_data import (
        fees as lpu_fees,
        scholarships as lpu_scholarships,
        hostel as lpu_hostel,
        admission_steps,
        deadlines,
        documents as lpu_documents,
        contact as lpu_contact,
        placements as lpu_placements,
    )

class RuleEngine:
    """IF-THEN rule engine for generating authentic LPU responses"""
    
    def __init__(self):
        self.intent_detector = IntentDetector()
        self.slot_filling = SlotFilling()
    
    def process_message(self, message, conversation_id):
        """
        Process a user message through the rule engine.
        Returns: (reply, intent, confidence, requires_slot, slot, suggestions)
        """
        # Detect intent
        intent, confidence, pattern = self.intent_detector.detect_intent(message)
        
        # Get conversation context
        context = self.slot_filling.get_context(conversation_id)
        
        # Extract entities
        program = self.intent_detector.extract_program(message)
        semester = self.intent_detector.extract_semester(message)
        fee_type = self.intent_detector.extract_fee_type(message)
        
        # Update context with extracted entities
        if program:
            context['program'] = program
        if semester:
            context['semester'] = semester
        if fee_type:
            context['fee_type'] = fee_type
        
        # Check if we have a pending intent from previous turn
        if context.get('pending_intent') and program:
            intent = context['pending_intent']
            context['pending_intent'] = None
        
        # Handle greetings & exits
        if intent == 'greeting':
            return self._handle_greeting(), intent, confidence, False, None, ['Available Programmes', 'Fee Structure', 'LPUNEST Scholarship', 'Hostel Facilities']
        
        if intent == 'goodbye':
            return self._handle_goodbye(), intent, confidence, False, None, []
        
        if intent == 'unknown':
            # Check if user mentioned a program directly
            if program:
                return self._format_program_info(program), 'program_query', 0.92, False, None, [f'Fee for {program.short_name}', f'Eligibility for {program.short_name}', 'Admission Process']
            return self._handle_unknown(), intent, confidence, False, None, ['Available Programmes', 'Fee Structure', 'LPUNEST Scholarship', 'Hostel Facilities', 'Placements']
        
        # Check for missing slots (e.g. asking for fee without specifying program)
        missing_slots = self.slot_filling.get_missing_slots(intent, context)
        if missing_slots:
            slot = missing_slots[0]
            question, suggestions = self.slot_filling.generate_slot_question(slot, context)
            context['pending_intent'] = intent
            return question, intent, confidence, True, slot, suggestions
        
        # Generate response based on intent and resolved context
        response = self._generate_response(intent, context)
        suggestions = self._get_suggestions(intent, context)
        
        return response, intent, confidence, False, None, suggestions
    
    def _handle_greeting(self):
        return (
            "Hello! Welcome to the Lovely Professional University (LPU) Admission Assistant. 🎓\n\n"
            "I can help you explore 150+ degree programmes, calculate semester fee structures, "
            "check LPUNEST cutoff & scholarship slabs, view semester curricula, and guide your admission process.\n\n"
            "What would you like to know today?"
        )
    
    def _handle_goodbye(self):
        return "Thank you for connecting with the Lovely Professional University Helpdesk. If you need any further assistance, feel free to ask anytime. Best of luck with your academic journey!"
    
    def _handle_unknown(self):
        return (
            "I'm sorry, I couldn't identify the exact information you requested.\n\n"
            "I can assist you with official Lovely Professional University details on:\n"
            "• **Programmes & Specializations** (B.Tech CSE, AI & ML, MBA, BCA, MCA, B.Sc Agri)\n"
            "• **LPUNEST & Admissions** (Dates, Steps, Proctored Exam)\n"
            "• **Fee Structure & Expenses**\n"
            "• **Scholarships up to 50%** (LPUNEST, 12th Board marks, Sports, Defense)\n"
            "• **Curriculum & Semester Subjects**\n"
            "• **Hostel & Uni-World Campus Facilities**\n"
            "• **Placements & Top Recruiters**\n\n"
            "Could you please rephrase or choose from the quick suggestions below?"
        )
    
    def _generate_response(self, intent, context):
        """Generate authentic LPU response based on intent and context"""
        program = context.get('program')
        
        if intent == 'program_query':
            if program:
                return self._format_program_info(program)
            return self._list_programs()
        
        if intent == 'fee_query':
            if program:
                return self._format_fee_info(program, context.get('fee_type'))
            return self._list_programs() + "\n\nWhich programme's fee information would you like to check?"
        
        if intent == 'eligibility_query':
            if program:
                return self._format_eligibility_info(program)
            return self._list_programs() + "\n\nWhich programme's eligibility criteria would you like to check?"
        
        if intent == 'curriculum_query':
            if program:
                semester = context.get('semester')
                if semester:
                    return self._format_curriculum_info(program, semester)
                return self._format_curriculum_overview(program)
            return self._list_programs() + "\n\nWhich programme's curriculum would you like to explore?"
        
        if intent == 'hostel_query':
            return (
                "**LPU Uni-World Residential Facilities:**\n"
                "Lovely Professional University provides safe, comfortable on-campus student housing across multiple towers.\n\n"
                "• **Room Types:** 1-Seater, 2-Seater, 3-Seater, 4-Seater (both AC and Non-AC available with study desks and attached washrooms).\n"
                "• **Dining & Mess:** Multi-cuisine dining serving hygienic North Indian, South Indian, and Continental menus.\n"
                "• **Uni-Hospital:** 24/7 in-house 50+ bed hospital with residential doctors, ambulance, and pharmacy.\n"
                "• **Uni-Mall:** 6-storey on-campus shopping mall featuring departmental stores, cafes (Domino's, Subway, CCD), and lifestyle stores.\n"
                "• **Security:** 24x7 security, turnstile gates, biometric attendance, and 4,000+ CCTV surveillance cameras.\n"
                "• **Sports & Fitness:** Indoor sports stadium, Olympic-size swimming pool, and modern fitness gymnasiums."
            )
        
        if intent == 'scholarship_query':
            scholar_bullets = "\n".join([f"• **{s['name']}:** {s['text']}" for s in lpu_scholarships[:4]])
            return (
                "**Lovely Professional University Scholarships (Up to 50% Fee Concession):**\n\n"
                f"{scholar_bullets}\n\n"
                "💡 More than 50% of students at LPU study on scholarships up to ₹1,00,000+ per year based on LPUNEST scores or 12th board marks!"
            )
        
        if intent == 'document_query':
            doc_bullets = "\n".join([f"• {doc}" for doc in lpu_documents[:6]])
            return (
                "**Checklist of Required Documents for LPU Admission:**\n\n"
                f"{doc_bullets}\n\n"
                "You can also track and tick off your documents on the **Eligibility & Documents** page."
            )
        
        if intent == 'admission_query':
            step_bullets = "\n".join([f"{i+1}. **{s[0]}:** {s[1]}" for i, s in enumerate(admission_steps)])
            return (
                "**LPU Admission & LPUNEST Procedure:**\n\n"
                f"{step_bullets}\n\n"
                "Apply online at [admission.lpu.in](https://admission.lpu.in)."
            )
        
        if intent == 'deadline_query':
            dates_bullets = "\n".join([f"• **{d[0]}:** {d[1]}" for d in deadlines])
            return (
                "**Important Admission & LPUNEST Dates:**\n\n"
                f"{dates_bullets}\n\n"
                "Early applicants secure preferred slots and the highest scholarship slabs."
            )
        
        if intent == 'contact_query':
            return (
                f"**Lovely Professional University Admission Helpdesk:**\n\n"
                f"• **Office:** {lpu_contact['office']}\n"
                f"• **Helpline:** {lpu_contact['phone']}\n"
                f"• **Toll-Free:** {lpu_contact['toll_free']}\n"
                f"• **WhatsApp Support:** {lpu_contact['whatsapp']}\n"
                f"• **Email:** {lpu_contact['email']}\n"
                f"• **Office Hours:** {lpu_contact['hours']}\n"
                f"• **Campus Address:** {lpu_contact['address']}\n"
                f"• **Official Website:** {lpu_contact['website']}"
            )
        
        if intent == 'entrance_exam':
            return (
                "**Lovely Professional University National Entrance and Scholarship Test (LPUNEST):**\n\n"
                "• **Dual Benefit:** Acts as both the qualifying Entrance Test and India's largest private university Scholarship Test.\n"
                "• **Exam Mode:** Online Remotely Proctored from the comfort of your home, or at authorized test centres nationwide.\n"
                "• **Format:** Multiple-choice questions (Physics, Chemistry, Math/Bio, English for B.Tech) with no negative marking.\n"
                "• **Exemption:** Candidates with 90+ percentile in JEE Main or 95%+ marks in 12th board are eligible for direct admission with Category I scholarship."
            )
        
        if intent == 'campus_life':
            return (
                "**LPU Mega Campus Life & Facilities:**\n\n"
                "• **600+ Acre Campus:** One of India's largest single-campus universities on Jalandhar-Delhi GT Road, Punjab.\n"
                "• **Shanti Devi Mittal Central Library:** 9-storey automated library with over 1.5 million print volumes and digital subscriptions.\n"
                "• **Uni-Mall:** 6-storey commercial mall with retail shops, food courts, banks, post office, and salons.\n"
                "• **Uni-Hospital:** 24/7 50+ bed hospital with residential doctors, dental clinic, and ambulance.\n"
                "• **Global Exposure:** Over 30,000+ students from 28 Indian states and 50+ foreign countries."
            )
        
        if intent == 'placements':
            return (
                "**LPU Placements Highlights & Track Record:**\n\n"
                f"• **Highest International Package:** {lpu_placements['highest_international']}\n"
                f"• **Highest Domestic Package:** {lpu_placements['highest_domestic']}\n"
                f"• **Top Recruiter Network:** 2,000+ recruiting companies including Google, Microsoft, Amazon, Cisco, Apple, Cognizant, and Deloitte.\n"
                f"• **Super Dream Offers:** Over 1,000+ Fortune 500 companies actively hire LPU engineering and management graduates."
            )
        
        return self._handle_unknown()
    
    def _format_program_info(self, program):
        return (
            f"**{program.name} ({program.short_name})**\n\n"
            f"• **Degree Level:** {program.degree}\n"
            f"• **Duration:** {program.duration}\n"
            f"• **Eligibility:** {program.eligibility}\n"
            f"• **Accepted Streams:** {', '.join(program.accepts_qualifications or [])}\n"
            f"• **Minimum Required Marks:** {program.min_percent}%\n"
            f"• **Curriculum Overview:** {program.description}\n\n"
            f"Would you like to know the fee structure, scholarships, or semester curriculum for {program.short_name}?"
        )
    
    def _list_programs(self):
        programs = Program.query.filter_by(is_active=True).limit(8).all()
        program_list = "\n".join([f"• **{p.short_name}** - {p.name} ({p.duration})" for p in programs])
        return f"Lovely Professional University offers over 150+ globally benchmarked degree programmes:\n\n{program_list}\n\nYou can explore complete syllabi on the **Programs** and **Curriculum** pages."
    
    def _format_fee_info(self, program, fee_type):
        f = lpu_fees.get(program.id, {
            'tuition': '₹1,60,000 / semester (Base)',
            'other': '₹5,000 / semester (Examination Fee)',
            'hostel': 'Air-Cooled: ₹83,000 - ₹1,13,000 / yr | AC: ₹93,000 - ₹1,53,000 / yr',
            'scholarship': 'Category I: up to 50% off | Cat II: up to 40% off | Cat III: up to 30% off',
        })
        return (
            f"Here is the authentic fee structure for **{program.name} ({program.short_name})** at LPU:\n\n"
            f"• **Base Tuition Fee:** {f['tuition']}\n"
            f"• **Examination & Tech Charges:** {f['other']}\n"
            f"• **Hostel Accommodation:** {f['hostel']}\n"
            f"• **Merit Scholarship:** {f['scholarship']}\n\n"
            f"💡 *Scholarship Benefit:* With a good score in LPUNEST or 90%+ in 12th board, your per-semester tuition fee can be reduced by up to 50%!"
        )
    
    def _format_eligibility_info(self, program):
        qualifications = program.accepts_qualifications or []
        qual_list = ", ".join(qualifications)
        return (
            f"Eligibility Criteria for **{program.name} ({program.short_name})** at LPU:\n\n"
            f"• **Accepted Qualification:** {qual_list}\n"
            f"• **Minimum Marks Required:** {program.min_percent}%\n"
            f"• **Admission Requirement:** {program.eligibility}\n\n"
            f"You can also use our **Eligibility Checker** tool in the navbar to test your exact score."
        )
    
    def _format_curriculum_overview(self, program):
        courses = CurriculumCourse.query.filter_by(program_id=program.id).all()
        if not courses:
            return f"Curriculum data for {program.short_name} is available on the Curriculum page. You can filter courses by year and semester."
        
        sem1_courses = [c for c in courses if c.semester == 1]
        c_list = "\n".join([f"• **{c.course_code}:** {c.course_title} ({c.credits} credits) - {c.course_type}" for c in sem1_courses[:5]])
        return (
            f"Curriculum Overview for **{program.name} ({program.short_name})**:\n\n"
            f"**Semester 1 Foundation Subjects:**\n{c_list}\n\n"
            f"To view a specific semester, you can ask e.g. *'Show curriculum for Semester 2'* or visit the **Curriculum** page."
        )
    
    def _format_curriculum_info(self, program, semester):
        courses = CurriculumCourse.query.filter_by(program_id=program.id, semester=semester).all()
        if not courses:
            return f"Curriculum courses for **{program.short_name} - Semester {semester}** are currently being updated. You can check the complete 4-year syllabus in the **Curriculum** section."
        
        course_list = "\n".join([f"• **{c.course_code}:** {c.course_title} ({c.credits} credits) - {c.course_type}" for c in courses])
        return (
            f"**Curriculum for {program.name} ({program.short_name}) - Semester {semester}:**\n\n"
            f"{course_list}\n\n"
            f"You can view complete course descriptions, credits, and electives on the **Curriculum** page."
        )
    
    def _get_suggestions(self, intent, context=None):
        """Get relevant suggestions based on intent and context"""
        program = context.get('program') if context else None
        
        if intent == 'fee_query':
            return [f'Eligibility for {program.short_name}' if program else 'LPUNEST Scholarship', 'Hostel Facilities', 'Admission Process']
        elif intent == 'eligibility_query':
            return [f'Fee for {program.short_name}' if program else 'Fee Structure', 'Admission Process', 'Required Documents']
        elif intent == 'hostel_query':
            return ['1-Seater Room', '2-Seater Room', 'Mess Facilities', 'Uni-Hospital']
        elif intent == 'scholarship_query':
            return ['LPUNEST Category I', 'Sports Scholarship', 'Defense Concession', 'Eligibility Checker']
        elif intent == 'admission_query':
            return ['LPUNEST Dates', 'Required Documents', 'Fee Structure', 'Contact Admission Office']
        elif intent == 'curriculum_query':
            return ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4']
        elif intent == 'program_query':
            return ['B.Tech CSE', 'B.Tech AI & ML', 'MBA', 'BCA', 'MCA']
        elif intent == 'placement_query':
            return ['B.Tech CSE Placements', 'Top Recruiters', 'Fee Structure', 'Available Programmes']
        
        return ['Available Programmes', 'Fee Structure', 'LPUNEST Scholarship', 'Hostel Facilities']
