"""
The intent rule base for the LPU Helpdesk chatbot.

Each rule is one IF-THEN entry: if the user's message matches one of the regular
expressions, THEN the question is handled by that intent's response rule (see
`app/services/rule_engine.py`).

This module is the single source of truth for the patterns. It is plain data with
no Flask imports, so both the seeder (`scripts/seed_database.py`) and the expansion
tool (`scripts/expand_rule_base.py`) can load it, and the seeded rows in
`intent_patterns` can be re-synced at any time.

Design notes
------------
* Keywords end in an optional plural / suffix group (``programs?``, ``programmes?``,
  ``eligib\\w*``). A previous version used ``\\bprogram\\b``, which silently failed
  on "programmes" and "loans" - exactly the questions real users asked.
* Priority decides the winner when several intents match; a higher number wins.
  "mess charges" hits both the mess and fee rules, so mess is higher than fee.
* The matching intent also breaks ties by the length of the matched text, so the
  more specific keyword wins (see `IntentDetector.detect_intent`).
"""

INTENT_PATTERNS = [
    {
        'intent_name': 'greeting',
        'patterns': [r'^(hi|hello|hey|namaste|good\s*(morning|afternoon|evening)|start)(\b|!)'],
        'priority': 10,
    },
    {
        'intent_name': 'goodbye',
        'patterns': [r'\b(bye|goodbye|see\s*you|thank\s*you|thanks|exit|quit)\b'],
        'priority': 10,
    },
    {
        # Exam fee must outrank the generic fee rule ("when is the exam fee?").
        'intent_name': 'exam_fee_query',
        'patterns': [r'\bexam(ination)?s?\s*(fee|fees|charges?|cost)\b',
                     r'\bwhen\s*is\s*the?\s*exam\s*fee\b'],
        'priority': 8,
    },
    {
        # Mess is charged with the hostel, and "mess charges" also matches the fee
        # rule, so this rule sits above fee and hostel. It fires on mess *money*
        # questions only - "hostel rooms and mess" is still a hostel question.
        'intent_name': 'mess_query',
        'patterns': [r'\bmess\s*(charges?|fee|fees|bill|plan|plans|price|prices|cost)\b',
                     r'\bmeal\s*(plan|plans|charges?|bill)\b',
                     r'\bfood\s*(charges?|bill)\b',
                     r'\bcatering\b',
                     r'\bdining\s*(charges?|fee|fees|bill)\b',
                     r'\bmonthly\s*bill\b'],
        'priority': 7,
    },
    {
        'intent_name': 'transport_query',
        'patterns': [r'\b(bus|buses|bus\s*stop|bus\s*station|transport|transportation|'
                     r'shuttle|shuttles|cab|taxi|railway|train\s*station|airport|'
                     r'pickup|pick\s*up|drop\s*point|commute|parking|how\s*to\s*reach)\b'],
        'priority': 7,
    },
    {
        'intent_name': 'loan_query',
        'patterns': [r'\b(loans?|education\s*loans?|bank\s*loans?|vidya\s*lakshmi|emi|'
                     r'installments?|sbi\s*loans?|pnb\s*loans?|financial\s*assistance|'
                     r'sanction\s*letter)\b'],
        'priority': 8,
    },
    {
        'intent_name': 'hostel_tier_query',
        'patterns': [r'\b(apartment\s*hostels?|studio\s*hostels?|studio\s*apartments?|'
                     r'hostel\s*tiers?|room\s*tiers?|tiers?|room\s*categor(y|ies)|'
                     r'ac\s*rooms?|standard\s*hostels?)\b'],
        'priority': 7,
    },
    {
        'intent_name': 'laundry_query',
        'patterns': [r'\b(laundry|clothes|washing|dry\s*clean|wash\s*charges?)\b'],
        'priority': 7,
    },
    {
        'intent_name': 'total_fee_query',
        'patterns': [r'\b(total\s*fees?|4\s*year\s*fees?|four\s*year\s*fees?|full\s*fees?|'
                     r'overall\s*cost|calculator)\b'],
        'priority': 7,
    },
    {
        'intent_name': 'compare_query',
        'patterns': [r'\b(compare|difference\s*between|vs|versus|which\s*is\s*better)\b'],
        'priority': 7,
    },
    {
        'intent_name': 'entrance_exam',
        'patterns': [r'\b(lpunest|lpu\s*nest|entrance|exams?|tests?|slot\s*booking)\b'],
        'priority': 7,
    },
    {
        'intent_name': 'fee_query',
        'patterns': [r'\b(fee|fees|cost|costs|tuition|charges?|pricing|price|prices|expenses?|'
                     r'per\s*sem|how\s*much)\b'],
        'priority': 6,
    },
    {
        'intent_name': 'hostel_query',
        'patterns': [r'\b(hostels?|mess|accommodation|dorm|dorms|rooms?|seaters?|'
                     r'stay|living|uni-world)\b'],
        'priority': 6,
    },
    {
        'intent_name': 'scholarship_query',
        'patterns': [r'\b(scholarships?|scholars?|waivers?|financial\s*aid|concessions?|'
                     r'discounts?|cat[- ]?[123])\b'],
        'priority': 6,
    },
    {
        'intent_name': 'eligibility_query',
        'patterns': [r'\b(eligib\w*|criteria|qualifications?|qualif\w*|cut\s*off|cutoff|'
                     r'percent(age)?|marks\s*required)\b'],
        'priority': 6,
    },
    {
        'intent_name': 'admission_query',
        'patterns': [r'\b(admissions?|apply|applying|application|applications?|enrol\w*|'
                     r'register|registration|procedure|steps?|how\s*to\s*join)\b'],
        'priority': 6,
    },
    {
        'intent_name': 'curriculum_query',
        'patterns': [r'\b(curriculum|syllabus|subjects?|courses?|what\s*will\s*i\s*learn|'
                     r'credits?)\b'],
        'priority': 6,
    },
    {
        'intent_name': 'placements',
        'patterns': [r'\b(placements?|packages?|recruiters?|salaries|salary|companies|'
                     r'highest\s*pack|lpa|hiring|jobs?)\b'],
        'priority': 6,
    },
    {
        'intent_name': 'deadline_query',
        'patterns': [r'\b(deadlines?|last\s*dates?|schedules?|due\s*dates?|'
                     r'closing\s*date|when\s*can\s*i\s*apply)\b'],
        'priority': 7,
    },
    {
        # "what documents do I need?" is asked far more than it is answered by the
        # admission flow, so the document rule outranks the generic admission rule.
        'intent_name': 'document_query',
        'patterns': [r'\b(documents?|certificates?|papers?|marksheets?|checklist|verification)\b'],
        'priority': 7,
    },
    {
        # Block 30 / DSR / the Welcome Center are the admission offices real users
        # ask to reach by name, so contact outranks the general admission rule there.
        'intent_name': 'contact_query',
        'patterns': [r'\b(dsr|block\s*30|welcome\s*cent(er|re))\b',
                     r'\b(contact|phone|email|call|toll\s*free|address|office|location|'
                     r'helpdesk)\b'],
        'priority': 7,
    },
    {
        'intent_name': 'campus_life',
        'patterns': [r'\b(campus|uni-mall|uni-hospital|infrastructure|stadium|swimming|acres|'
                     r'library|food\s*courts?|restaurants?|cafeterias?|dining\s*halls?|'
                     r'facilities)\b'],
        'priority': 5,
    },
    {
        # Plural forms matter: "What programmes do you offer?" used to fall through
        # because the rule only matched the singular "program".
        'intent_name': 'program_query',
        'patterns': [r'\b(programs?|programmes?|courses?|degrees?|branches?|'
                     r'speciali[sz]ations?|offered|streams?)\b'],
        'priority': 4,
    },
]