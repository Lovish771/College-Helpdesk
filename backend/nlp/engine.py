"""
Conversational NLP & Slot Filling Engine for LPU Admission Helpdesk.
Combines rule-based pattern matching with TF-IDF cosine similarity for high-accuracy intent classification,
context-aware slot-filling, and entity extraction.
"""

import re
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from backend.data.lpu_data import (
    college,
    programs,
    fees,
    scholarships,
    hostel,
    admission_steps,
    deadlines,
    documents,
    contact,
    placements,
    quick_actions,
)
from backend.database.db import log_interaction

# ----------------- INTENT TRAINING CORPUS -----------------
INTENT_EXAMPLES = {
    "greeting": [
        "hi", "hello", "hey", "good morning", "good evening", "namaste", "greetings",
        "hey there", "hello assistant", "start conversation", "hi lpu",
    ],
    "fee_query": [
        "what is the fee", "how much is tuition fee", "fee structure", "course fees",
        "tuition charges", "cost of studying", "per semester fee", "examination fee",
        "how much does btech cost", "what are the charges", "fee details",
    ],
    "hostel_query": [
        "hostel facilities", "hostel fees", "room types", "is hostel available",
        "mess and food facilities", "ac rooms in hostel", "1 seater room", "2 seater hostel",
        "uni-world hostel living", "campus accommodation", "gym and sports in hostel",
        "laundry facility", "security in hostel",
    ],
    "scholarship_query": [
        "scholarships available", "lpunest scholarship", "how to get scholarship",
        "financial aid", "fee concession", "merit scholarship", "sports scholarship",
        "defense ward concession", "can i get scholarship based on 12th marks",
        "category 1 scholarship", "waiver on tuition fees",
    ],
    "eligibility_query": [
        "eligibility criteria", "what are the requirements to join", "minimum marks required",
        "can i get admission with 65 percent", "qualification needed", "am i eligible",
        "marks required in 12th for btech", "eligibility for mba",
    ],
    "admission_query": [
        "how do i apply", "what is the admission process", "lpunest admission steps",
        "how to take admission in lpu", "application form", "registration process",
        "counseling procedure", "seat booking", "how to register online",
    ],
    "program_query": [
        "available programs", "what courses do you offer", "engineering branches",
        "degree programs", "btech specializations", "programs list", "show all courses",
        "postgraduate courses", "tell me about programs",
    ],
    "placement_query": [
        "placement statistics", "what is the highest package", "average salary package",
        "which companies visit lpu", "placement record", "google placement",
        "job opportunities", "career support", "top recruiters at lpu",
    ],
    "campus_query": [
        "tell me about the campus", "how big is the campus", "uni mall",
        "uni hospital", "swimming pool", "campus infrastructure",
        "library facilities", "sports stadium", "campus life at lpu",
    ],
    "deadline_query": [
        "last date to apply", "admission deadline", "when is lpunest exam",
        "important dates", "due date for fee submission", "application closing date",
    ],
    "document_query": [
        "what documents are required", "document checklist", "certificates needed",
        "which papers do i need for admission", "verification documents",
    ],
    "contact_query": [
        "admission office contact", "helpline number", "phone number", "email address",
        "campus address", "how to visit campus", "toll free number", "location of lpu",
    ],
}

# Compile training vectors
training_texts = []
training_labels = []
for intent_label, examples in INTENT_EXAMPLES.items():
    for text in examples:
        training_texts.append(text)
        training_labels.append(intent_label)

vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words="english")
X_train = vectorizer.fit_transform(training_texts)

# ----------------- REGEX PATTERN RULES -----------------
INTENT_REGEX_RULES = [
    ("greeting", r"^(hi|hello|hey|namaste|good\s*(morning|afternoon|evening)|start)(\b|!)"),
    ("fee_query", r"\b(fee|fees|cost|tuition|charges|pricing|expense|per\s*sem|how\s*much)\b"),
    ("hostel_query", r"\b(hostel|mess|accommodation|dorm|room|seater|food\s*court|stay|living)\b"),
    ("scholarship_query", r"\b(scholarship|scholar|waiver|financial\s*aid|concession|discount|cat[- ]?[123])\b"),
    ("eligibility_query", r"\b(eligib|criteria|qualification|qualif|cut\s*off|percent(age)?|marks\s*required)\b"),
    ("placement_query", r"\b(placement|package|recruiter|salary|companies|highest\s*pack|lpa|hiring)\b"),
    ("admission_query", r"\b(admission|apply|application|enrol|register|procedure|step|lpunest)\b"),
    ("campus_query", r"\b(campus|uni-mall|uni-hospital|infrastructure|stadium|swimming|acres)\b"),
    ("deadline_query", r"\b(deadline|last\s*date|schedule|due\s*date|exam\s*date|when\s*is)\b"),
    ("document_query", r"\b(document|certificate|paper|marksheet|checklist|verification)\b"),
    ("contact_query", r"\b(contact|phone|email|call|toll\s*free|address|office|location|helpdesk)\b"),
    ("program_query", r"\b(program|course|degree|branch|speciali[sz]ation|offered)\b"),
]

# ----------------- SESSION MEMORY -----------------
session_memory = {}  # conversation_id -> {"pending": str, "program": dict}

def find_program(text: str):
    """Finds a program mentioned in text using regex matchers or acronyms."""
    t = text.lower()
    for p in programs:
        if re.search(p["match"], t, re.IGNORECASE):
            return p
        if p["short"].lower() in t or p["id"].lower() in t:
            return p
    return None

def classify_intent(message: str):
    """
    Classifies intent using a hybrid model:
    1. Direct Regex rule match
    2. TF-IDF Cosine Similarity against exemplar corpus
    """
    cleaned = message.strip().lower()
    
    # 1. Regex Match check
    for intent_name, pattern in INTENT_REGEX_RULES:
        if re.search(pattern, cleaned, re.IGNORECASE):
            return intent_name, 0.95

    # 2. TF-IDF Cosine Similarity
    try:
        query_vec = vectorizer.transform([cleaned])
        scores = cosine_similarity(query_vec, X_train)[0]
        max_idx = np.argmax(scores)
        best_score = float(scores[max_idx])

        if best_score >= 0.35:
            return training_labels[max_idx], round(min(0.99, best_score + 0.3), 2)
    except Exception:
        pass

    return "fallback", 0.20

def format_bullet_list(items):
    return "\n".join([f"• {x}" for x in items])

def generate_program_detail(p):
    return (
        f"**{p['name']} ({p['short']})**\n\n"
        f"• **Degree Level:** {p['degree']}\n"
        f"• **Duration:** {p['duration']}\n"
        f"• **Eligibility:** {p['eligibility']}\n"
        f"• **Accepted Qualifications:** {', '.join(p['accepts'])}\n"
        f"• **Overview:** {p['description']}\n\n"
        f"Would you like to know about the fee structure, scholarships, or admission process for this program?"
    )

def generate_fee_reply(p):
    f = fees.get(p["id"], {
        "tuition": "₹1,20,000 / semester",
        "other": "₹4,500 / semester",
        "hostel": "₹45,000 - ₹1,20,000 / year",
        "scholarship": "Up to 48% via LPUNEST"
    })
    return (
        f"Here is the authentic fee breakdown for **{p['name']} ({p['short']})**:\n\n"
        f"• **Base Tuition Fee:** {f['tuition']}\n"
        f"• **Examination & Tech Charges:** {f['other']}\n"
        f"• **Hostel Accommodation:** {f['hostel']}\n"
        f"• **Scholarship Concession:** {f['scholarship']}\n\n"
        f"💡 *Tip:* Depending on your score in LPUNEST or 12th marks, your tuition fee can be reduced by up to 48% per semester!"
    )

def generate_eligibility_reply(p):
    return (
        f"Eligibility Criteria for **{p['name']} ({p['short']})**:\n\n"
        f"• **Requirement:** {p['eligibility']}\n"
        f"• **Accepted Stream:** {', '.join(p['accepts'])}\n"
        f"• **Minimum Percentage:** {p['minPercent']}%\n\n"
        f"You can also use our interactive **Eligibility Checker** in the navbar to test your exact score."
    )

def process_chat_message(message: str, conversation_id: str):
    """
    Main dialogue manager:
    - Maintains conversation context per conversation_id
    - Performs slot detection and slot filling
    - Generates context-rich responses with suggestions
    - Logs each interaction for analytics
    """
    cid = conversation_id or "default_session"
    ctx = session_memory.setdefault(cid, {"pending": None, "program": None})

    prog = find_program(message)
    intent, confidence = classify_intent(message)

    # Context Resolution / Slot Filling
    # Case A: User previously asked for fee/eligibility without program, and now provided the program name
    if ctx.get("pending") and prog and (intent == "fallback" or intent == "program_query"):
        intent = ctx["pending"]

    if prog:
        ctx["program"] = prog

    # If user mentioned a program without explicit intent (e.g. "B.Tech CSE")
    if intent in ["fallback", "program_query"] and prog:
        if ctx.get("pending"):
            intent = ctx["pending"]
        else:
            intent = "program_query"

    response = {
        "reply": "",
        "intent": intent,
        "confidence": confidence,
        "requires_slot": False,
        "slot": None,
        "conversation_id": cid,
        "suggestions": None,
        "action": None,
    }

    # Handle slot requirement for fee and eligibility if program is missing
    if intent in ["fee_query", "eligibility_query"]:
        target_prog = prog or ctx.get("program")
        if not target_prog:
            ctx["pending"] = intent
            prompt_word = "fee structure" if intent == "fee_query" else "eligibility requirements"
            response["reply"] = (
                f"Sure! Which program at Lovely Professional University would you like to check {prompt_word} for?"
            )
            response["requires_slot"] = True
            response["slot"] = "program"
            response["confidence"] = 0.95
            response["suggestions"] = ["B.Tech CSE", "B.Tech AI & ML", "BBA", "MBA", "MCA", "B.Sc Agriculture"]
            
            # Log slot inquiry
            log_interaction(cid, message, response["reply"], intent, 0.95, is_answered=True)
            return response

        # Program slot is resolved
        ctx["pending"] = None
        if intent == "fee_query":
            response["reply"] = generate_fee_reply(target_prog)
            response["suggestions"] = [f"Eligibility for {target_prog['short']}", "LPUNEST Scholarship", "Hostel Fees"]
        else:
            response["reply"] = generate_eligibility_reply(target_prog)
            response["suggestions"] = [f"Fee for {target_prog['short']}", "Admission Process", "Required Documents"]
        
        log_interaction(cid, message, response["reply"], intent, 0.96, is_answered=True)
        return response

    # Reset any pending slot if intent switched
    ctx["pending"] = None

    # Handle all other intents
    if intent == "greeting":
        response["reply"] = (
            f"Hello and welcome to the **Lovely Professional University (LPU) Admission Assistant**! 🎓\n\n"
            f"I can help you explore programs, check LPUNEST cutoff and scholarship slabs, "
            f"calculate semester fees, browse hostel room options, and guide your admission step-by-step.\n\n"
            f"What would you like to know today?"
        )
        response["suggestions"] = ["Available Programs", "Fee Structure", "LPUNEST Scholarship", "Hostel Facilities"]

    elif intent == "program_query":
        if prog:
            response["reply"] = generate_program_detail(prog)
            response["suggestions"] = [f"Fee for {prog['short']}", f"Eligibility for {prog['short']}", "Admission Process"]
        else:
            program_bullets = format_bullet_list([f"{p['name']} ({p['short']}) - {p['duration']}" for p in programs[:7]])
            response["reply"] = (
                f"Lovely Professional University offers 150+ globally benchmarked degree programs across disciplines.\n\n"
                f"**Popular Flagship Programs:**\n{program_bullets}\n\n"
                f"You can explore detailed syllabi and specializations on the **Programs** page or ask me about any course directly!"
            )
            response["suggestions"] = ["B.Tech CSE", "B.Tech AI & ML", "MBA", "BCA", "B.Sc Agriculture"]

    elif intent == "hostel_query":
        response["reply"] = (
            f"**LPU Uni-World Residential Facilities:**\n"
            f"LPU houses one of Asia's largest student residential communities across secure apartment complexes.\n\n"
            f"• **Room Types:** 1-Seater, 2-Seater, 3-Seater, 4-Seater (both AC and Non-AC available)\n"
            f"• **Mess:** Multi-cuisine dining serving hygienic North Indian, South Indian, and Continental meals\n"
            f"• **Campus Care:** In-campus 50+ bed Uni-Hospital with 24/7 doctors & emergency ambulance\n"
            f"• **Convenience:** Uni-Mall with departmental stores, food courts (Domino's, Subway), and grooming salons\n"
            f"• **Security:** 24x7 security, turnstile gates, biometric attendance, and 4,000+ CCTV cameras\n"
            f"• **Sports:** Indoor sports complex, Olympic-size swimming pool, and modern fitness gyms"
        )
        response["suggestions"] = ["1-Seater Room", "2-Seater Room", "Hostel Fees", "Uni-Hospital Facilities"]

    elif intent == "scholarship_query":
        scholar_bullets = format_bullet_list([f"**{s['name']}:** {s['text']}" for s in scholarships[:4]])
        response["reply"] = (
            f"Lovely Professional University believes financial constraints should never stop talented students.\n\n"
            f"**Key Scholarship Categories:**\n{scholar_bullets}\n\n"
            f"💡 More than 50% of students at LPU study on scholarships up to ₹1,00,000+ per year!"
        )
        response["suggestions"] = ["LPUNEST Category I", "Sports Scholarship", "Defense Concession", "Check Eligibility"]

    elif intent == "admission_query":
        steps_text = "\n".join([f"{i+1}. **{s[0]}:** {s[1]}" for i, s in enumerate(admission_steps)])
        response["reply"] = (
            f"**LPU Admission & LPUNEST Process (2026-27):**\n\n"
            f"{steps_text}\n\n"
            f"🌐 Applications are online at [admission.lpu.in](https://admission.lpu.in)."
        )
        response["suggestions"] = ["LPUNEST Exam Dates", "Required Documents", "Fee Structure", "Contact Admission Office"]

    elif intent == "placement_query":
        companies_str = ", ".join(placements["top_companies"][:7])
        response["reply"] = (
            f"**LPU Placement Highlights & Records:**\n\n"
            f"• **Highest International Package:** {placements['highest_international']}\n"
            f"• **Highest Domestic Package:** {placements['highest_domestic']}\n"
            f"• **Top Recruiter Network:** 2,000+ companies including {companies_str}\n"
            f"• **Record Offers:** Over 1,000+ top Fortune 500 companies have recruited LPU graduates with super dream packages.\n\n"
            f"{placements['highlights']}"
        )
        response["suggestions"] = ["B.Tech CSE Placements", "Available Programs", "Fee Structure", "Apply for LPUNEST"]

    elif intent == "campus_query":
        response["reply"] = (
            f"**Welcome to the Mega LPU Campus:**\n\n"
            f"• **Campus Area:** 600+ Acres of lush green, state-of-the-art infrastructure on Jalandhar-Delhi GT Road.\n"
            f"• **Diverse Community:** 30,000+ students from 28 Indian states and 50+ countries.\n"
            f"• **Uni-Mall:** 6-storey commercial mall on campus with banks, branded stores, cafes, and supermarkets.\n"
            f"• **Shanti Devi Mittal Central Library:** Automated 9-storey library with 1.5 million+ volumes & digital journals.\n"
            f"• **Sports & Fitness:** Indoor sports arena, Olympic-grade pool, synthetic athletic tracks, and cricket stadiums."
        )
        response["suggestions"] = ["Hostel Facilities", "Campus Location", "Admission Process", "Programs"]

    elif intent == "deadline_query":
        deadline_text = "\n".join([f"• **{d[0]}:** {d[1]}" for d in deadlines])
        response["reply"] = (
            f"**Important Admission & LPUNEST Dates:**\n\n"
            f"{deadline_text}\n\n"
            f"Early applicants receive maximum scholarship brackets. We advise applying before the current phase concludes."
        )
        response["suggestions"] = ["Admission Process", "LPUNEST Scholarship", "Required Documents"]

    elif intent == "document_query":
        doc_list = format_bullet_list(documents[:6])
        response["reply"] = (
            f"**Checklist of Required Documents for LPU Admission:**\n\n"
            f"{doc_list}\n\n"
            f"You can also track and tick off your papers on our **Eligibility & Documents** page."
        )
        response["suggestions"] = ["Admission Process", "Eligibility Criteria", "Contact Office"]

    elif intent == "contact_query":
        response["reply"] = (
            f"**Lovely Professional University Admission Helpdesk:**\n\n"
            f"• **Office:** {contact['office']}\n"
            f"• **Phone:** {contact['phone']}\n"
            f"• **Toll-Free:** {contact['toll_free']}\n"
            f"• **WhatsApp Support:** {contact['whatsapp']}\n"
            f"• **Email:** {contact['email']}\n"
            f"• **Timings:** {contact['hours']}\n"
            f"• **Campus Address:** {contact['address']}\n"
            f"• **Official Website:** {contact['website']}"
        )
        response["suggestions"] = ["Admission Process", "Fee Structure", "Campus Location"]
        response["action"] = "contact"

    else:
        # Fallback response
        response["reply"] = (
            f"I'm sorry, I couldn't completely understand your query regarding LPU.\n\n"
            f"I can provide official information on:\n"
            f"• **Programs & Degrees** (B.Tech CSE, AI/ML, MBA, MCA, BBA, B.Sc Agri)\n"
            f"• **LPUNEST & Admissions** (Dates, Steps, Slot Booking)\n"
            f"• **Fee Structure & Expenses**\n"
            f"• **Scholarships up to 48%** (LPUNEST, 12th Marks, Sports, Defense)\n"
            f"• **Hostel & Campus Facilities** (Rooms, Mess, Uni-Mall, Uni-Hospital)\n"
            f"• **Placement Records** (Highest packages, Recruiters)\n"
            f"• **Contact & Admission Office Helpdesk**\n\n"
            f"Could you please rephrase or choose one of the options below?"
        )
        response["confidence"] = 0.22
        response["suggestions"] = ["B.Tech CSE Fee", "Admission Process", "LPUNEST Scholarship", "Hostel Facilities", "Placement Records"]
        response["action"] = "contact"

    # Log interaction to SQLite database
    is_answered = (intent != "fallback" and response["confidence"] >= 0.35)
    log_interaction(cid, message, response["reply"], intent, response["confidence"], is_answered)

    return response
