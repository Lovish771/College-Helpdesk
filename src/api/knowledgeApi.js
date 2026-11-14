import { request } from './client';

export const mockCategories = [
  { id: 'admissions', name: 'Admission & LPUNEST', count: 12, icon: 'user-check', color: '#2563EB', bg: 'rgba(37,99,235,0.1)' },
  { id: 'fees', name: 'Fees & Scholarships', count: 18, icon: 'credit-card', color: '#059669', bg: 'rgba(5,150,105,0.1)' },
  { id: 'loans', name: 'Education Loans', count: 7, icon: 'briefcase', color: '#D97706', bg: 'rgba(217,119,6,0.1)' },
  { id: 'hostel', name: 'Hostel & Living', count: 12, icon: 'bed', color: '#DB2777', bg: 'rgba(219,39,119,0.1)' },
  { id: 'exams', name: 'Attendance & UMS Rules', count: 14, icon: 'file-text', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  { id: 'placements', name: 'Corporate Placements', count: 8, icon: 'briefcase', color: '#0D9488', bg: 'rgba(13,148,136,0.1)' },
];

export const mockArticles = [
  {
    id: 1,
    title: 'How to apply for LPUNEST and book an exam slot?',
    category: 'Admission & LPUNEST',
    tag: 'LPUNEST',
    reads: '6.2k',
    answer: `• Registration: Apply online at admission.lpu.in with your mobile number and email.
• Registration Fee: ₹1,000 (boys) / ₹500 (girls) for LPUNEST kit.
• Slot Booking: Choose your preferred exam date and time slot in the student portal.
• Exam Modes: Available both as Remotely Proctored from home or at authorized test centres.
• Merit Scholarship: Automatically calculated upon test result and applied directly to your semester fee.`,
    highlights: ['Online proctored or test centre', 'Instant scholarship bracket', 'Application open for 2026-27 batch'],
  },
  {
    id: 2,
    title: 'What is the procedure for availing an Education Loan?',
    category: 'Education Loans',
    tag: 'Loans',
    reads: '5.8k',
    answer: `• Bonafide & Fee Estimate: Confirm provisional admission and download your fee letter from UMS or Loan Cell (Block 29, Room 104).
• Vidya Lakshmi Portal: Apply via www.vidyalakshmi.co.in with nationalized or private partner banks (SBI, PNB, Canara, HDFC, ICICI).
• Required Documents: 10th/12th marksheets, admission allotment letter, KYC, and co-borrower income proofs.
• Sanction & Direct Disbursement: The bank sanctions and transfers funds directly to LPU fee account via NEFT/RTGS with automated fee receipt.`,
    highlights: ['On-campus SBI, PNB, and Canara branches', 'Central Govt CSIS interest subsidy eligible', 'Loan desk: Block 29, Room 104'],
  },
  {
    id: 3,
    title: 'What are the hostel room options, tariffs, and mess facilities?',
    category: 'Hostel & Living',
    tag: 'Hostel',
    reads: '5.1k',
    answer: `• Studio Apartments (100% AC with attached kitchenette): 1-Seater: ₹1,90,000 | 2-Seater: ₹1,40,000 | 3-Seater: ₹1,20,000 | 4-Seater: ₹1,00,000 per 10-month session.
• Standard Rooms (AC & Air-Cooled): 2-Seater AC: ₹1,33,000 (Cooler: ₹1,13,000) | 3-Seater AC: ₹1,13,000 (Cooler: ₹98,000) | 4-Seater AC: ₹93,000 (Cooler: ₹83,000).
• Uni-Laundry Service: Consolidated ₹5,400 per 10-month academic session (up to 70 garments/month with barcode tracking).
• Dining: Optional mess plans (Standard 4-meal: ₹50,000/yr, 3-meal: ₹46,000/yr) or pay-as-you-eat at 40+ campus food courts.`,
    highlights: ['10-month academic session charges', 'Identical AC quota in Studio & Standard', 'Optional mess dining'],
  },
  {
    id: 4,
    title: 'How do the LPUNEST scholarship slabs work?',
    category: 'Fees & Scholarships',
    tag: 'Scholarships',
    reads: '7.4k',
    answer: `• Category I (Top Bracket): Up to 50% tuition waiver (95%+ in LPUNEST or 95%+ in 10+2 / JEE Main 95+ percentile).
• Category II (Mid Bracket): Up to 40% tuition waiver (90% – 94.9% in LPUNEST or qualifying exam).
• Category III (Base Bracket): Up to 30% tuition waiver (80% – 89.9% in LPUNEST or qualifying exam).
• Retention: Maintained across all subsequent years by securing a minimum CGPA of 6.5 with no active disciplinary backlogs.`,
    highlights: ['Applied on every semester tuition fee', 'Multi-year continuation on 6.5 CGPA', 'National exam scores accepted'],
  },
  {
    id: 5,
    title: 'What is the mandatory 75% attendance rule and duty leave policy?',
    category: 'Attendance & UMS Rules',
    tag: 'Academic Rules',
    reads: '8.1k',
    answer: `• 75% Attendance Requirement: Mandatory in every registered course to be eligible for End-Term Examinations (ETE).
• Medical Leave (ML): Upload hospital certificate from Uni-Hospital or verified civil hospital on UMS within 3 days of resuming classes.
• Duty Leave (DL): University-approved hackathons, competitions, and placement drives can be claimed via UMS with Dean/Mentor endorsement.
• Attendance Shortfall: 65%–74% requires makeup assignments; below 65% results in course debarment.`,
    highlights: ['Tracked real-time on UMS mobile app', 'Medical certificates submitted within 3 days', 'DL permitted for approved events'],
  },
  {
    id: 6,
    title: 'What are the examination and continuous assessment patterns?',
    category: 'Attendance & UMS Rules',
    tag: 'Exams',
    reads: '4.6k',
    answer: `• Continuous Assessment (CA) – 30%: Best 2 out of 3 class tests, laboratory evaluations, and assignments.
• Mid-Term Examination (MTE) – 20%: Evaluates syllabus Units 1 to 3 conducted mid-term.
• End-Term Examination (ETE) – 50%: Comprehensive final theory and practical exams at semester end.
• Grading: Relative grading scale from O (Outstanding) to E/F (Fail) with mandatory minimum passing criteria.`,
    highlights: ['Best tests considered for CA', 'Relative grading system', 'Transparent marks review on UMS'],
  },
  {
    id: 7,
    title: 'What are the placement eligibility criteria and highest packages?',
    category: 'Corporate Placements',
    tag: 'Placements',
    reads: '9.3k',
    answer: `• Package Records: Highest domestic CTC of ₹64 LPA (Palo Alto Networks) and international package of ₹3 Crore.
• Recruiter Base: 1,000+ recruiters visit annually including Google, Microsoft, Amazon, Cisco, Intel, and TCS.
• Eligibility: Most Tier-1 tech and product companies require 7.0+ CGPA with no active backlogs.
• Professional Readiness: PEA (Aptitude) and PEV (Verbal) training modules integrated directly into semester timetables from 3rd year.`,
    highlights: ['Highest domestic CTC: ₹64 LPA', '1,000+ hiring partners annually', 'PEA & PEV career training included'],
  },
];

export const getKnowledgeCategories = () =>
  request('/api/knowledge/categories', () => mockCategories.map((c) => c.name));
