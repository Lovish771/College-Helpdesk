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
    answer: 'Apply online at admission.lpu.in, pay the registration fee (₹1,000 for boys, ₹500 for girls), and select your preferred test date for either a campus center or home-proctored online exam. Your merit scholarship tier is unlocked automatically upon result announcement.',
    highlights: ['Online proctored or center test', 'Up to 50% scholarship unlock', '2026-27 slot booking open'],
  },
  {
    id: 2,
    title: 'What is the step-by-step process to get an Education Loan for LPU fees?',
    category: 'Education Loans',
    tag: 'Loans',
    reads: '5.8k',
    answer: 'Download your official Bonafide Fee Estimate from UMS or collect it from the Loan Helpdesk (Block 29, Room 104). Apply via the Vidya Lakshmi portal for on-campus bank branches (SBI, PNB, Canara Bank, HDFC) with direct tuition disbursement.',
    highlights: ['On-campus bank branches (SBI/PNB/Canara)', 'Eligible for Central Interest Subsidy (CSIS)', 'Block 29 Room 104 loan cell'],
  },
  {
    id: 3,
    title: 'What are the hostel room options, mess plans, and laundry facilities?',
    category: 'Hostel',
    tag: 'Living',
    reads: '5.1k',
    answer: 'Standard rooms range from ₹83,000/yr (Air-Cooled) to ₹1,53,000/yr (AC). Premium Studio Apartments with kitchenette start from ₹1,00,000 to ₹1,90,000/yr. Mess plans (₹42,000 to ₹58,000/yr) and Uni-Laundry (₹5,400/yr) are optional and customized annually.',
    highlights: ['AC & Air-cooled 1-to-4 seaters', 'Studio apartments with kitchenette', 'Optional dining & laundry'],
  },
  {
    id: 4,
    title: 'How do the LPUNEST Category I, II, and III scholarship slabs work?',
    category: 'Fees',
    tag: 'Scholarships',
    reads: '7.4k',
    answer: 'Scholarships grant tuition fee waivers based on test merit: Category I gives up to 50% waiver (95%+ LPUNEST / 10+2 or 95+ percentile JEE), Category II gives 40% (90-94.9%), and Category III gives 30% (80-89.9%). Retained annually with a 6.5+ CGPA and clear backlogs.',
    highlights: ['Up to 50% tuition reduction', 'Calculated across all semesters', 'Retained with 6.5+ CGPA'],
  },
  {
    id: 5,
    title: 'What is the mandatory 75% attendance rule and UMS duty leave submission?',
    category: 'UMS & Attendance',
    tag: 'Academic Rules',
    reads: '8.1k',
    answer: 'Students must maintain at least 75% attendance in each registered subject to sit for End-Term Examinations (ETE). Medical certificates and official event duty leaves (DL) must be submitted via the UMS portal within 3 working days.',
    highlights: ['75% minimum attendance requirement', 'Biometric & UMS digital tracking', '3-day medical submission window'],
  },
  {
    id: 6,
    title: 'Can we change hostel rooms, mess plans, or laundry options across different years?',
    category: 'Hostel',
    tag: 'Hostel Policy',
    reads: '3.9k',
    answer: 'Yes. An annual reallocation window opens on UMS every April–May, allowing students to switch room tiers, roommate groups, or mess plans. Day Scholar conversions are also permitted with local guardian NOC.',
    highlights: ['Annual reallocation window in May', 'Switch between standard & studio', 'Day scholar conversion permitted'],
  },
  {
    id: 7,
    title: 'What are the continuous assessment (CA) components and semester examination patterns?',
    category: 'UMS & Attendance',
    tag: 'Examinations',
    reads: '4.6k',
    answer: 'Courses follow UGC-CBCS grading: 30% Continuous Assessment (best 2 of 3 class tests, lab practicals, and assignments), 20% Mid-Term Examination (MTE), and 50% End-Term Examination (ETE) on a 10-point relative scale.',
    highlights: ['30% CA + 20% MTE + 50% ETE', 'Best tests considered for CA', 'Relative grading system'],
  },
  {
    id: 8,
    title: 'What are the top placement packages and company eligibility criteria?',
    category: 'Corporate Placements',
    tag: 'Placements',
    reads: '9.3k',
    answer: 'Over 1,000+ national and global recruiters visit LPU, with record packages reaching ₹3 Crore international and ₹64 LPA domestic. Placement readiness (PEA aptitude and PEV communication) is embedded directly into semester timetables.',
    highlights: ['₹64 LPA highest domestic CTC', '1,000+ recruiters on campus', 'Integrated PEA/PEV training'],
  },
  {
    id: 9,
    title: 'What are the exact prices and amenities of Studio Apartments and Luxury Flat Hostels at LPU?',
    category: 'Hostel',
    tag: 'Studio Living',
    reads: '6.5k',
    answer: 'Furnished studio suites include split AC, private kitchenette with induction, geyser washroom, study desks, and weekly housekeeping. Annual rates: 1-Seater ₹1,90,000; 2-Seater ₹1,40,000; 3-Seater ₹1,20,000; and 4-Seater ₹1,00,000 per academic year.',
    highlights: ['Split AC & private kitchenette', 'Attached geyser washroom', '₹1.0L to ₹1.9L per academic year'],
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
