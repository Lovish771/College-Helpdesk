import sys
import os
import io

# Ensure backend and project root are in Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app import create_app, db
from app.models import Program, CurriculumCourse, IntentPattern, KnowledgeEntry, KnowledgeSource, AdminUser
import bcrypt

try:
    from backend.data.lpu_data import programs as lpu_programs
except ImportError:
    from data.lpu_data import programs as lpu_programs

# Fix unicode encoding for Windows console
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

def seed_programs():
    """Seed authentic Lovely Professional University (LPU) degree programmes"""
    for p in lpu_programs:
        prog_data = {
            'id': p['id'],
            'name': p['name'],
            'short_name': p['short'],
            'degree': p['degree'],
            'duration': p['duration'],
            'eligibility': p['eligibility'],
            'accepts_qualifications': p['accepts'],
            'min_percent': p['minPercent'],
            'description': p['description'],
            'tags': p['tags'],
            'match_pattern': p['match'],
            'verification_status': 'verified_official',
            'is_active': True,
        }
        existing = db.session.get(Program, p['id'])
        if existing:
            for k, v in prog_data.items():
                setattr(existing, k, v)
        else:
            program = Program(**prog_data)
            db.session.add(program)
    
    db.session.commit()
    print(f"[OK] Seeded {len(lpu_programs)} authentic LPU programs into database")

def seed_curriculum():
    """Seed comprehensive course syllabi across programs"""
    courses_data = [
        # B.Tech AI & ML - Semester 1
        {'program_id': 'btech-aiml', 'year': 1, 'semester': 1, 'course_code': 'CSE101', 'course_title': 'Programming in C & Problem Solving', 'credits': 4, 'course_type': 'Core', 'description': 'Fundamentals of structured programming, pointers, memory allocation, and problem solving.'},
        {'program_id': 'btech-aiml', 'year': 1, 'semester': 1, 'course_code': 'MTH165', 'course_title': 'Calculus and Linear Algebra for Engineers', 'credits': 4, 'course_type': 'Core', 'description': 'Differential calculus, vector spaces, eigenvalues, eigenvectors, and matrix algebra for AI.'},
        {'program_id': 'btech-aiml', 'year': 1, 'semester': 1, 'course_code': 'PHY110', 'course_title': 'Engineering Physics & Electromagnetics', 'credits': 3, 'course_type': 'Core', 'description': 'Semiconductor physics, lasers, optics, and sensors.'},
        {'program_id': 'btech-aiml', 'year': 1, 'semester': 1, 'course_code': 'ECE131', 'course_title': 'Digital Electronics & Logic Design', 'credits': 3, 'course_type': 'Core', 'description': 'Boolean algebra, combinational logic, flip-flops, and sequential circuit design.'},
        {'program_id': 'btech-aiml', 'year': 1, 'semester': 1, 'course_code': 'PEL121', 'course_title': 'Corporate Communication & Soft Skills', 'credits': 2, 'course_type': 'Skill', 'description': 'Verbal ability, presentation skills, technical report writing, and professional etiquette.'},
        
        # B.Tech AI & ML - Semester 2
        {'program_id': 'btech-aiml', 'year': 1, 'semester': 2, 'course_code': 'CSE205', 'course_title': 'Data Structures & Algorithms in C++', 'credits': 4, 'course_type': 'Core', 'description': 'Arrays, linked lists, stacks, queues, trees, balanced BSTs, graphs, and hashing.'},
        {'program_id': 'btech-aiml', 'year': 1, 'semester': 2, 'course_code': 'CSE202', 'course_title': 'Object-Oriented Programming using Java', 'credits': 4, 'course_type': 'Core', 'description': 'Classes, inheritance, polymorphism, interfaces, exception handling, and multithreading.'},
        {'program_id': 'btech-aiml', 'year': 1, 'semester': 2, 'course_code': 'MTH240', 'course_title': 'Probability & Statistical Foundations for AI', 'credits': 4, 'course_type': 'Core', 'description': 'Probability distributions, Bayes theorem, hypothesis testing, ANOVA, and regression.'},
        {'program_id': 'btech-aiml', 'year': 1, 'semester': 2, 'course_code': 'CSE211', 'course_title': 'Computer Organization & Architecture', 'credits': 3, 'course_type': 'Core', 'description': 'CPU architecture, pipelining, cache memory hierarchy, and instruction set design.'},
        
        # B.Tech AI & ML - Semester 3
        {'program_id': 'btech-aiml', 'year': 2, 'semester': 3, 'course_code': 'CSE306', 'course_title': 'Design & Analysis of Algorithms', 'credits': 4, 'course_type': 'Core', 'description': 'Divide & conquer, dynamic programming, greedy algorithms, NP-completeness, and graph search.'},
        {'program_id': 'btech-aiml', 'year': 2, 'semester': 3, 'course_code': 'INT246', 'course_title': 'Machine Learning Foundations', 'credits': 4, 'course_type': 'Core', 'description': 'Linear models, decision trees, random forests, SVM, k-means clustering, and PCA.'},
        {'program_id': 'btech-aiml', 'year': 2, 'semester': 3, 'course_code': 'CSE316', 'course_title': 'Operating Systems & Concurrency', 'credits': 3, 'course_type': 'Core', 'description': 'Process scheduling, semaphores, deadlock avoidance, virtual memory, and file systems.'},
        {'program_id': 'btech-aiml', 'year': 2, 'semester': 3, 'course_code': 'CSE325', 'course_title': 'Database Management Systems & SQL', 'credits': 3, 'course_type': 'Core', 'description': 'Relational algebra, normalization (BCNF, 3NF), transaction management, and indexing.'},
        
        # B.Tech AI & ML - Semester 4
        {'program_id': 'btech-aiml', 'year': 2, 'semester': 4, 'course_code': 'INT404', 'course_title': 'Deep Learning & Neural Networks', 'credits': 4, 'course_type': 'Core', 'description': 'Backpropagation, CNN architectures, RNNs, LSTMs, Transformers, and PyTorch frameworks.'},
        {'program_id': 'btech-aiml', 'year': 2, 'semester': 4, 'course_code': 'INT428', 'course_title': 'Natural Language Processing & LLMs', 'credits': 3, 'course_type': 'Elective', 'description': 'Tokenization, embeddings (Word2Vec), attention mechanisms, sentiment analysis, and LLM prompting.'},
        {'program_id': 'btech-aiml', 'year': 2, 'semester': 4, 'course_code': 'CSE320', 'course_title': 'Software Engineering & Agile DevOps', 'credits': 3, 'course_type': 'Core', 'description': 'Agile methodologies, CI/CD pipelines, Docker containers, testing, and Git workflows.'},
        {'program_id': 'btech-aiml', 'year': 2, 'semester': 4, 'course_code': 'CAP491', 'course_title': 'AI Capstone Project I', 'credits': 4, 'course_type': 'Project', 'description': 'Industry-guided prototype development in computer vision, robotics, or conversational AI.'},

        # B.Tech CSE - Semester 1 & 2
        {'program_id': 'btech-cse', 'year': 1, 'semester': 1, 'course_code': 'CSE101', 'course_title': 'Introduction to Computer Science & C', 'credits': 4, 'course_type': 'Core', 'description': 'Core programming constructs, arrays, functions, and algorithmic thinking.'},
        {'program_id': 'btech-cse', 'year': 1, 'semester': 1, 'course_code': 'MTH165', 'course_title': 'Engineering Mathematics I', 'credits': 4, 'course_type': 'Core', 'description': 'Matrices, determinants, sequences, series, and multivariable calculus.'},
        {'program_id': 'btech-cse', 'year': 1, 'semester': 2, 'course_code': 'CSE205', 'course_title': 'Data Structures & Algorithms', 'credits': 4, 'course_type': 'Core', 'description': 'Advanced algorithmic design and data structuring in modern systems.'},
        {'program_id': 'btech-cse', 'year': 1, 'semester': 2, 'course_code': 'CSE316', 'course_title': 'Operating Systems Principles', 'credits': 3, 'course_type': 'Core', 'description': 'Concurrency, thread pooling, Linux kernel fundamentals, and memory virtualization.'},

        # MBA - Semester 1
        {'program_id': 'mba', 'year': 1, 'semester': 1, 'course_code': 'MGT501', 'course_title': 'Financial Management & Accounting', 'credits': 4, 'course_type': 'Core', 'description': 'Corporate finance, financial statement analysis, capital budgeting, and working capital management.'},
        {'program_id': 'mba', 'year': 1, 'semester': 1, 'course_code': 'MKT502', 'course_title': 'Marketing Management & Consumer Insights', 'credits': 4, 'course_type': 'Core', 'description': 'Brand positioning, market segmentation, digital consumer behavior, and marketing mix.'},
        {'program_id': 'mba', 'year': 1, 'semester': 1, 'course_code': 'HRM503', 'course_title': 'Organizational Behaviour & Leadership', 'credits': 3, 'course_type': 'Core', 'description': 'Team dynamics, conflict resolution, leadership paradigms, and organizational transformation.'},
        {'program_id': 'mba', 'year': 1, 'semester': 1, 'course_code': 'ANA504', 'course_title': 'Business Analytics for Decision Making', 'credits': 3, 'course_type': 'Core', 'description': 'Predictive modeling, Excel simulations, business intelligence dashboards, and data-driven strategy.'},
    ]
    
    for course_data in courses_data:
        existing = CurriculumCourse.query.filter_by(
            program_id=course_data['program_id'],
            course_code=course_data['course_code'],
            semester=course_data['semester']
        ).first()
        if existing:
            for k, v in course_data.items():
                setattr(existing, k, v)
            existing.verification_status = 'verified_official'
        else:
            course = CurriculumCourse(**course_data, verification_status='verified_official')
            db.session.add(course)
    
    db.session.commit()
    print(f"[OK] Seeded {len(courses_data)} authentic LPU curriculum courses")

def seed_intent_patterns():
    """Seed intent detection patterns"""
    intents_data = [
        {
            'intent_name': 'greeting',
            'patterns': [r'^(hi|hello|hey|namaste|good\s*(morning|afternoon|evening)|start)(\b|!)'],
            'priority': 10,
        },
        {
            'intent_name': 'goodbye',
            'patterns': [r'bye|goodbye|see you|thank\s*you|thanks|exit|quit'],
            'priority': 10,
        },
        {
            'intent_name': 'fee_query',
            'patterns': [r'\b(fee|fees|cost|tuition|charges|pricing|expense|per\s*sem|how\s*much)\b'],
            'priority': 6,
        },
        {
            'intent_name': 'hostel_query',
            'patterns': [r'\b(hostel|mess|accommodation|dorm|room|seater|food\s*court|stay|living|uni-world)\b'],
            'priority': 6,
        },
        {
            'intent_name': 'scholarship_query',
            'patterns': [r'\b(scholarship|scholar|waiver|financial\s*aid|concession|discount|cat[- ]?[123])\b'],
            'priority': 6,
        },
        {
            'intent_name': 'eligibility_query',
            'patterns': [r'\b(eligib|criteria|qualification|qualif|cut\s*off|percent(age)?|marks\s*required)\b'],
            'priority': 6,
        },
        {
            'intent_name': 'admission_query',
            'patterns': [r'\b(admission|apply|application|enrol|register|procedure|step|how\s*to\s*join)\b'],
            'priority': 6,
        },
        {
            'intent_name': 'entrance_exam',
            'patterns': [r'\b(lpunest|lpu\s*nest|entrance|exam|test|slot\s*booking)\b'],
            'priority': 7,
        },
        {
            'intent_name': 'curriculum_query',
            'patterns': [r'\b(curriculum|syllabus|subjects|courses|what\s*will\s*i\s*learn|credits)\b'],
            'priority': 6,
        },
        {
            'intent_name': 'placements',
            'patterns': [r'\b(placement|package|recruiter|salary|companies|highest\s*pack|lpa|hiring|job)\b'],
            'priority': 6,
        },
        {
            'intent_name': 'campus_life',
            'patterns': [r'\b(campus|uni-mall|uni-hospital|infrastructure|stadium|swimming|acres|library)\b'],
            'priority': 5,
        },
        {
            'intent_name': 'deadline_query',
            'patterns': [r'\b(deadline|last\s*date|schedule|due\s*date|when\s*is)\b'],
            'priority': 6,
        },
        {
            'intent_name': 'document_query',
            'patterns': [r'\b(document|certificate|paper|marksheet|checklist|verification)\b'],
            'priority': 6,
        },
        {
            'intent_name': 'contact_query',
            'patterns': [r'\b(contact|phone|email|call|toll\s*free|address|office|location|helpdesk)\b'],
            'priority': 6,
        },
        {
            'intent_name': 'program_query',
            'patterns': [r'\b(program|course|degree|branch|speciali[sz]ation|offered)\b'],
            'priority': 4,
        },
    ]
    
    for intent_data in intents_data:
        existing = db.session.query(IntentPattern).filter_by(intent_name=intent_data['intent_name']).first()
        if existing:
            existing.patterns = intent_data['patterns']
            existing.priority = intent_data['priority']
        else:
            intent = IntentPattern(**intent_data)
            db.session.add(intent)
    
    db.session.commit()
    print(f"[OK] Seeded {len(intents_data)} active intent patterns")

def seed_knowledge_entries():
    """Seed official LPU knowledge base articles"""
    knowledge_data = [
        {
            'category': 'hostel',
            'question': 'What are the hostel accommodations and living facilities at LPU?',
            'answer': 'LPU Uni-World provides comprehensive residential facilities across AC and Non-AC 1, 2, 3, and 4-seater rooms with attached washrooms, geysers, and study desks. Dining includes hygienic North Indian, South Indian, and Continental mess options. Campus features the 24/7 Uni-Hospital, 6-storey Uni-Mall, Olympic-size swimming pool, and biometric security.',
            'verification_status': 'verified_official',
            'notes': 'Official LPU Residential Services Portal',
        },
        {
            'category': 'scholarships',
            'question': 'How does LPU scholarship work and what are the slabs?',
            'answer': 'LPU provides scholarships up to 48% fee reduction per semester based on performance in LPUNEST (Category I, II, III slabs), 12th board marks (95%+ qualifies for top slab), national tests (JEE Main, CUET, NEET, CAT), sports/cultural achievements, and special concessions for wards of defense personnel and single girl children.',
            'verification_status': 'verified_official',
            'notes': 'Official LPU Scholarship Policy 2025-26',
        },
        {
            'category': 'admissions',
            'question': 'What is the step-by-step admission process for LPU?',
            'answer': 'The admission process involves 6 clear steps: 1) Register online at admission.lpu.in, 2) Apply for LPUNEST and book exam slot, 3) Appear in the online proctored test, 4) Check qualifying results and scholarship category, 5) Select program preference in counseling, and 6) Upload documents and pay initial seat confirmation fee (₹10,000).',
            'verification_status': 'verified_official',
            'notes': 'Directorate of Admissions, Lovely Professional University',
        },
        {
            'category': 'fees',
            'question': 'What is the fee structure for engineering and management programs at LPU?',
            'answer': 'Base per-semester tuition fees: B.Tech CSE: ₹1,40,000; B.Tech AI & ML: ₹1,60,000; MBA: ₹2,00,000; BCA: ₹80,000; MCA: ₹1,00,000; B.Pharm: ₹1,20,000; B.Sc Agriculture: ₹1,20,000. Examination fee is ₹5,000/semester. Tuition fee is reduced by up to 48% depending on your LPUNEST scholarship category.',
            'verification_status': 'verified_official',
            'notes': 'Official Fee Schedule 2025-26',
        },
        {
            'category': 'documents',
            'question': 'Which documents are required for LPU admission verification?',
            'answer': 'Required documents: Class 10th marksheet & passing certificate, Class 12th marksheet, Graduation degree & marksheets (for PG), LPUNEST scorecard / Admit card, Government Photo ID (Aadhaar / Passport), 4-6 passport size photos, Transfer Certificate (TC) & Migration Certificate.',
            'verification_status': 'verified_official',
            'notes': 'LPU Document Verification Checklist',
        },
        {
            'category': 'placements',
            'question': 'What are the placement statistics and highest packages at LPU?',
            'answer': 'LPU graduates hold records for the highest international package of ₹3 Crore per annum, and ₹54.75 LPA domestic package at Google. More than 2,000 top multinational companies recruit on campus, including Microsoft, Amazon, Cisco, Apple, Cognizant, and Deloitte.',
            'verification_status': 'verified_official',
            'notes': 'LPU Corporate Relations Division (CRD)',
        },
        {
            'category': 'contact',
            'question': 'How can I contact the LPU Admission Office?',
            'answer': 'Admission Helpline: +91-1824-517000, Toll-Free: 1800 102 4431 / 1800 274 0615, WhatsApp: +91-98550-84000, Email: admissions@lpu.co.in. Campus Address: Lovely Professional University, Jalandhar-Delhi G.T. Road, Phagwara, Punjab - 144411.',
            'verification_status': 'verified_official',
            'notes': 'LPU Official Contact Directorate',
        },
    ]
    
    for kb_data in knowledge_data:
        existing = KnowledgeEntry.query.filter_by(category=kb_data['category']).first()
        if existing:
            for k, v in kb_data.items():
                setattr(existing, k, v)
        else:
            kb = KnowledgeEntry(**kb_data, is_active=True)
            db.session.add(kb)
    
    db.session.commit()
    print(f"[OK] Seeded {len(knowledge_data)} verified LPU knowledge entries")

def create_admin_user():
    """Create initial admin user with environment-based secure password."""
    import secrets
    admin_username = os.environ.get('ADMIN_USERNAME', 'admin')
    admin_email = os.environ.get('ADMIN_EMAIL', 'admissions@lpu.co.in')
    admin_password = os.environ.get('ADMIN_PASSWORD')
    
    admin = db.session.query(AdminUser).filter(
        (AdminUser.username == admin_username) | (AdminUser.email == admin_email)
    ).first()
    
    if not admin:
        if not admin_password:
            admin_password = secrets.token_urlsafe(16)
            print(f"\n[SECURITY NOTICE] No ADMIN_PASSWORD provided in environment.")
            print(f"[SECURITY NOTICE] Generated bootstrap admin password: {admin_password}")
            print(f"[SECURITY NOTICE] Set ADMIN_PASSWORD in your .env for a persistent custom password.\n")
            
        admin = AdminUser(
            username=admin_username,
            email=admin_email,
            is_active=True
        )
        admin.set_password(admin_password)
        db.session.add(admin)
        db.session.commit()
        print(f"[OK] Provisioned administrator account (username: {admin_username}, email: {admin_email})")
    else:
        if admin_password:
            admin.set_password(admin_password)
            db.session.commit()
            print("[OK] Admin password synchronized from ADMIN_PASSWORD environment variable")
        else:
            print("[OK] Admin user already exists")

def main():
    app = create_app()
    with app.app_context():
        print("--- Seeding Authentic Lovely Professional University (LPU) Database ---")
        seed_programs()
        seed_curriculum()
        seed_intent_patterns()
        seed_knowledge_entries()
        create_admin_user()
        print("\n✓ Database seeding successfully complete with official LPU content!")

if __name__ == '__main__':
    main()
