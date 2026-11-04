import { request } from './client';

export const mockCategories = [
  { id: 'admissions', name: 'Admission Process', count: 12, icon: 'user-check', color: '#2563EB', bg: 'rgba(37,99,235,0.1)' },
  { id: 'fees', name: 'Fees & Scholarships', count: 18, icon: 'credit-card', color: '#059669', bg: 'rgba(5,150,105,0.1)' },
  { id: 'loans', name: 'Education Loans', count: 7, icon: 'credit-card', color: '#D97706', bg: 'rgba(217,119,6,0.1)' },
  { id: 'programs', name: 'Academic Programs', count: 25, icon: 'book-open', color: '#7C3AED', bg: 'rgba(124,58,237,0.1)' },
  { id: 'hostel', name: 'Hostel & Living', count: 12, icon: 'bed', color: '#DB2777', bg: 'rgba(219,39,119,0.1)' },
  { id: 'exams', name: 'UMS & Attendance', count: 14, icon: 'file-text', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  { id: 'placements', name: 'Corporate Placements', count: 8, icon: 'briefcase', color: '#0D9488', bg: 'rgba(13,148,136,0.1)' },
  { id: 'support', name: 'Student Welfare & DSR', count: 9, icon: 'life-buoy', color: '#EA580C', bg: 'rgba(234,88,12,0.1)' },
];

export const mockArticles = [
  {
    id: 1,
    title: 'How to apply for LPUNEST 2026-27 and book an online test slot?',
    category: 'Admission',
    tag: 'LPUNEST',
    reads: '6.2k',
    answer: `1. Visit the official admissions portal (admission.lpu.in) and register with your email and mobile number.\n2. Complete the initial profile and pay the LPUNEST registration kit fee (₹1,000 for boys, ₹500 for girls).\n3. Fill in your academic marks and preferred exam date/time slot via the LPUNEST Slot Booking dashboard.\n4. Download your test admit card with assigned test center or opt for the Remotely Proctored Online Examination from home.\n5. Upon qualifying, your scholarship bracket (Category I, II, or III) is automatically unlocked on your admission allotment portal.`,
    highlights: ['Exam mode: Online proctored or test centre', 'Instant scholarship calculation upon result release', 'Test booking open for 2026-27 batch'],
  },
  {
    id: 2,
    title: 'What is the step-by-step process to get an Education Loan for LPU fees?',
    category: 'Education Loans',
    tag: 'Loans',
    reads: '5.8k',
    answer: `LPU provides full institutional support for student loans with nationalized and private banks located right inside the campus:\n\n1. Fee Estimate & Bonafide Letter: After confirming provisional admission by paying the initial seat token, download your official 'Bonafide Certificate & Multi-Year Fee Estimate Letter' directly from UMS or collect it from the Education Loan Helpdesk (Block 29, Room 104).\n2. Apply via Vidya Lakshmi Portal: Register on the Government of India portal (www.vidyalakshmiproc.gov.in) and select approved banks like SBI, PNB, Canara Bank, HDFC, or ICICI Bank.\n3. Submit Documents: Required KYC, 10th/12th marksheets, LPU allotment letter, fee structure, parent/co-borrower ITR or salary slips.\n4. Verification & Sanction: The bank verifies documents and issues a Sanction Letter (typically within 7–14 working days).\n5. Direct University Disbursement: The loan amount is transferred directly into LPU's fee account via NEFT/RTGS, and a formal receipt is updated on your student UMS ledger.`,
    highlights: ['SBI, PNB & Canara branches on campus', 'CSIS Central Govt Interest Subsidy eligible', 'Education Loan Cell: Block 29, Room 104'],
  },
  {
    id: 3,
    title: 'What are the hostel room options, mess plans, and laundry facilities?',
    category: 'Hostel',
    tag: 'Living',
    reads: '5.1k',
    answer: `LPU offers one of India’s largest on-campus residential systems across 15+ student hostels with biometric access:\n\n• Studio Apartments (AC + Kitchenette): 1-Seater Studio is ₹1,90,000/yr (Early Bird: ₹1,80k / Reg: ₹2,00k); 2-Seater Studio is ₹1,40,000/yr; 3-Seater Studio is ₹1,20,000/yr; 4-Seater Studio is ₹1,00,000/yr.\n• Standard Rooms (AC & Air-Cooled): 1-Seater AC is ₹1,53,000/yr; 2-Seater AC is ₹1,33,000/yr (Air-Cooled: ₹1,13,000/yr); 3-Seater AC is ₹1,13,000/yr (Air-Cooled: ₹98,000/yr); 4-Seater AC is ₹93,000/yr (Air-Cooled: ₹83,000/yr).\n• Mess & Dining Plans: Standard Mess 4-Meals is ₹50,000/yr (Early Bird: ₹45,000); Standard 3-Meals is ₹46,000/yr (Early: ₹41,400); Standard 2-Meals is ₹42,000/yr (Early: ₹37,800); Special Multi-Cuisine Mess is ₹58,000/yr. Mess is optional—students can dine pay-as-you-eat at 40+ campus food courts and Uni-Mall.\n• Uni-Laundry Automated Service: Available for ₹5,400/academic session (up to 70 garments/month with steam iron & barcode tracking).\n• Campus Amenities: 24/7 biometric turnstiles, 50-bed Uni-Hospital with emergency ambulance, indoor sports stadium, Olympic pool, and 6-storey Uni-Mall.`,
    highlights: ['Studio Apartments: ₹1,90,000/yr with kitchenette', '2-BHK Luxury Flats: from ₹1,60,000/yr', 'Choice to opt in or out of mess each year'],
  },
  {
    id: 4,
    title: 'How do the LPUNEST Category I, II, and III scholarship slabs work?',
    category: 'Fees',
    tag: 'Scholarships',
    reads: '7.4k',
    answer: `Scholarships at LPU are awarded based on performance in LPUNEST, qualifying exam percentages, or national entrance exams (JEE Main, CUET, NEET, CAT):\n\n• Category I (Up to 50% Tuition Waiver): Requires 95%+ in LPUNEST or 95%+ in 10+2 / graduation or 95+ percentile in JEE Main.\n• Category II (Up to 40% Tuition Waiver): Requires 90% – 94.9% in LPUNEST or 90% – 94.9% in qualifying examination.\n• Category III (Up to 30% Tuition Waiver): Requires 80% – 89.9% in LPUNEST or qualifying examination.\n\nContinuation Criteria: The scholarship continues for all subsequent academic years provided the student maintains a minimum CGPA of 6.5 (or as specified for honours) without any backlogs or disciplinary warnings.`,
    highlights: ['Applied on every semester tuition fee', 'Continues for full degree duration with CGPA maintenance', 'Can be upgraded via national exam percentiles'],
  },
  {
    id: 5,
    title: 'What is the mandatory 75% attendance rule and UMS duty leave submission?',
    category: 'UMS & Attendance',
    tag: 'Academic Rules',
    reads: '8.1k',
    answer: `At LPU, attendance is tracked digitally through the University Management System (UMS) and biometric punches:\n\n• Mandatory Requirement: Every student must maintain a minimum of 75% attendance in every registered course to be eligible to sit for End-Term Examinations (ETE).\n• Medical Leaves: In case of illness, medical certificates from the University Hospital (Uni-Hospital) or verified civil hospitals must be uploaded on UMS within 3 working days of resumption.\n• Duty Leaves (DL): For university-approved hackathons, sports tournaments, placement drives, or conferences, official duty leave applications must be endorsed by the School Dean/Mentor on UMS.\n• Defaulter Lists: Students falling between 65%–74% may be required to attend remedial classes or submit assignments; below 65% leads to course debarment.`,
    highlights: ['Digital daily tracking on UMS app', 'Medical certificates must be submitted within 3 days', 'Debarment from final exams if below threshold'],
  },
  {
    id: 6,
    title: 'Can we change hostel rooms, mess plans, or laundry options across different years?',
    category: 'Hostel',
    tag: 'Hostel Policy',
    reads: '3.9k',
    answer: `Yes! Hostel, mess, and laundry choices are customized on an annual basis:\n\n• Room & Hostel Re-Allotment: At the end of every academic year (around April–May), an online hostel reallocation window opens on UMS. You can switch between Studio Apartments, AC flats, and standard rooms, or change your roommate group.\n• Mess Flexibility: A student can take the mess plan in Year 1 and choose to opt out in Year 2 to eat at the campus food courts, or upgrade to the Special Mess in subsequent terms.\n• Day Scholar Conversion: Students who relocate with local guardians or take off-campus PG accommodation in Phagwara/Jalandhar can convert to Day Scholar status before the start of the autumn term by submitting an NOC to DSR.`,
    highlights: ['Annual reallocation window on UMS in May', 'Independent food and laundry subscriptions', 'Day Scholar conversion permitted with guardian NOC'],
  },
  {
    id: 7,
    title: 'What are the continuous assessment (CA) components and semester examination patterns?',
    category: 'UMS & Attendance',
    tag: 'Examinations',
    reads: '4.6k',
    answer: `Each course in the Autumn (Odd) and Spring (Even) terms follows the standard UGC-CBCS evaluation structure:\n\n• Continuous Assessment (CA) – 30% Weightage: Best 2 out of 3 class tests, laboratory practical evaluations, group presentations, and home assignments on UMS.\n• Mid-Term Examination (MTE) – 20% Weightage: Conducted mid-semester covering initial modules (Units 1 to 3).\n• End-Term Examination (ETE) – 50% Weightage: Comprehensive theory and practical examination at term end.\n• Grading System: Relative grading scale from O (Outstanding, 10 Grade Points) down to E/F (Fail) with mandatory minimum passing criteria in ETE and overall course total.`,
    highlights: ['Continuous evaluation throughout the term', 'Best of tests considered for CA', 'Relative grading system ensures fair benchmarking'],
  },
  {
    id: 8,
    title: 'What are the top placement packages and company eligibility criteria?',
    category: 'Corporate Placements',
    tag: 'Placements',
    reads: '9.3k',
    answer: `LPU’s Division of Career Services (DCS) collaborates with over 1,000+ national and global recruiters:\n\n• Record Packages: Highest international package of ₹3 Crore at a German multinational; highest domestic CTC of ₹64 LPA at Palo Alto Networks; 1,000+ students placed in Dream & Super Dream companies (₹10 LPA to ₹64 LPA).\n• Placement Readiness: From 3rd year onwards, students undergo rigorous Corporate Aptitude (PEA) and Verbal Ability (PEV) training integrated directly into their semester timetable.\n• Eligibility: Most Tier-1 companies (Google, Microsoft, Amazon, Cisco, Palo Alto) require a minimum CGPA of 7.0 or 7.5 with no active backlogs.`,
    highlights: ['Highest domestic package: ₹64 LPA', '1,000+ recruiters visit campus annually', 'Soft-skill training (PEA/PEV) built into curriculum'],
  },
  {
    id: 9,
    title: 'What are the exact prices and amenities of Studio Apartments and Luxury Flat Hostels at LPU?',
    category: 'Hostel',
    tag: 'Studio Living',
    reads: '6.5k',
    answer: `LPU offers premium executive residential living with luxury Studio Apartments and Air-Conditioned flats:\n\n1. 1-Seater Studio Apartment (AC + Kitchenette) – ₹1,90,000 / year (10 Months):\n• Features an independent luxury studio suite, split AC, personal kitchenette with induction cooktop & sink, attached modern washroom with 24/7 geyser, refrigerator provision, study desk, and private balcony.\n\n2. 2-Seater Studio Apartment (AC + Kitchenette) – ₹1,40,000 / year (10 Months):\n• Twin-sharing luxury apartment layout with dual box storage beds, split AC, shared modular kitchenette, attached washroom with geyser, and twin study desks.\n\n3. 3-Seater Studio Apartment (AC + Kitchenette) – ₹1,20,000 / year (10 Months):\n• Triple-sharing layout featuring split AC, modular pantry space, attached modern bath, and individual wardrobes.\n\n4. 4-Seater Studio Apartment (AC + Kitchenette) – ₹1,00,000 / year (10 Months):\n• Quad-sharing apartment living with Hot & Cold split AC, kitchenette space, attached washroom, and weekly housekeeping.`,
    highlights: ['Private kitchenette with microwave & induction', 'Furnished living room lounge with smart TV', 'Daily housekeeping & high-speed Wi-Fi included'],
  },
];

export const getKnowledgeCategories = () =>
  request('/api/knowledge/categories', () => mockCategories.map((c) => c.name));

export const searchKnowledge = (q = '', category = '') =>
  request(`/api/knowledge/search?q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}`, () => {
    return mockArticles.filter((a) => {
      const matchQ = !q || a.title.toLowerCase().includes(q.toLowerCase()) || a.answer.toLowerCase().includes(q.toLowerCase());
      const matchC = !category || category === 'All Categories' || a.category.toLowerCase() === category.toLowerCase();
      return matchQ && matchC;
    });
  });
