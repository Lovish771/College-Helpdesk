import { programs, fees, scholarships, documents, admissionSteps, deadlines, contact } from '../data/mockData';
import { USE_MOCK, wait, request } from './client';

// ---- MOCK ENGINE (used when VITE_USE_MOCK=true) ----
const memory = {}; // conversation_id -> { pending, program, semester }
const INTENTS = [
  ['greeting', /^(hi|hello|hey|namaste|good\s*(morning|evening|afternoon))/i],
  ['fee_query', /fee|cost|tuition|charges|price|per sem|how much/i],
  ['hostel_query', /hostel|accommodation|room|mess|seater|food court|living|stay/i],
  ['scholarship_query', /scholar|financial aid|waiver|concession|discount|cat[- ]?[123]/i],
  ['eligibility_query', /eligib|qualif|criteria|marks required|percentage|minimum/i],
  ['placement_query', /placement|package|recruiter|salary|companies|highest pack|lpa/i],
  ['document_query', /document|certificate|papers|checklist|marksheet|verification/i],
  ['deadline_query', /deadline|last date|due date|exam date|dates/i],
  ['admission_query', /admission|apply|application|process|enrol|lpunest|register/i],
  ['program_query', /course|program|branch|degree|specialization/i],
  ['contact_query', /contact|phone|email|office|address|call|toll free|helpline/i],
  ['curriculum_query', /curriculum|subjects|syllabus|course|what.*study|what.*learn/i],
];
const findProgram = (t) => {
  // Check specializations and specific programs before generic core CSE
  const sorted = [...programs].sort((a, b) => (a.id === 'btech-cse' ? 1 : b.id === 'btech-cse' ? -1 : b.short.length - a.short.length));
  return sorted.find((p) => new RegExp(p.match, 'i').test(t));
};
const list = (a) => a.map((x) => `• ${x}`).join('\n');
const names = programs.map((p) => p.short);

function answer(intent, p, semester) {
  if (intent === 'fee_query') {
    const f = fees[p.id] || {
      tuition: '₹1,60,000 / semester (Base)',
      other: '₹5,000 / semester (Examination Fee)',
      hostel: 'Air-Cooled: ₹83,000 - ₹1,13,000 / yr | AC: ₹93,000 - ₹1,53,000 / yr',
      scholarship: 'Category I: up to 50% off | Cat II: up to 40% off | Cat III: up to 30% off',
    };
    return `Here is the official fee structure for **${p.name} (${p.short})** at Lovely Professional University:\n\n${list([
      `Base Tuition Fee: ${f.tuition}`,
      `Examination Fee: ${f.other}`,
      `Hostel Accommodation: ${f.hostel}`,
      `LPUNEST Scholarship Slabs: ${f.scholarship}`,
    ])}\n\n💡 *Scholarship Benefit:* With a qualifying score in LPUNEST or 90%+ in 10+2 board, your per-semester tuition fee can be reduced by up to 50%!`;
  }
  if (intent === 'eligibility_query') {
    return `Eligibility Criteria for **${p.name} (${p.short})** at Lovely Professional University:\n\n${list([
      `Accepted Qualifications: ${p.accepts.join(', ')}`,
      `Minimum Aggregate Marks: ${p.minPercent}%`,
      `Official Requirement: ${p.eligibility}`,
    ])}\n\nYou can also test your exact marks on the interactive Eligibility Checker page.`;
  }
  if (intent === 'curriculum_query') {
    return `Curriculum for **${p.name} (${p.short})**:\n\nThe programme covers foundational core computing, specialized laboratory electives, industrial certifications, and capstone projects. You can explore the full semester-wise syllabus on the Curriculum page.`;
  }
  return `**${p.name} (${p.short})**\n\n${list([`Degree Level: ${p.degree}`, `Duration: ${p.duration}`, `Eligibility: ${p.eligibility}`])}\n\n${p.description}`;
}

function mockReply(message, cid) {
  const ctx = (memory[cid] ||= {});
  const prog = findProgram(message);
  let intent = INTENTS.find(([, re]) => re.test(message))?.[0];
  const base = { conversation_id: cid, requires_slot: false, slot: null };

  if (ctx.pending && prog && (!intent || intent === 'program_query')) intent = ctx.pending;
  if (prog) ctx.program = prog;
  if (!intent && prog) intent = 'program_query';

  if (!intent) {
    return {
      ...base,
      reply: "I'm sorry, I couldn't identify that enquiry.\n\nI can assist you with official Lovely Professional University (LPU) information on:\n• Programmes & Specializations\n• LPUNEST & Admissions\n• Fee Structure & Slabs\n• Scholarships up to 50%\n• Hostel & Campus Facilities\n• Placement Statistics\n• Eligibility & Documents\n\nCould you please rephrase your question?",
      intent: 'fallback',
      confidence: 0.2,
      action: 'contact',
      suggestions: ['B.Tech CSE Fee', 'Admission Process', 'LPUNEST Scholarship', 'Hostel Facilities', 'Placements'],
    };
  }

  if (intent === 'greeting') {
    return {
      ...base,
      reply: 'Hello! 👋 Welcome to the Lovely Professional University (LPU) Admission Assistant.\n\nI can help you explore 150+ degree programmes, check LPUNEST cutoff & scholarship slabs, view semester fee structures, and guide your admission step-by-step.\n\nWhat would you like to know today?',
      intent,
      confidence: 0.98,
      suggestions: ['Available Programs', 'Fee Structure', 'LPUNEST Scholarship', 'Hostel Facilities'],
    };
  }

  if (intent === 'fee_query' || intent === 'eligibility_query') {
    const p = prog || ctx.program;
    if (!p) {
      ctx.pending = intent;
      return {
        ...base,
        reply: `Sure! Which programme at Lovely Professional University are you asking about?`,
        intent,
        confidence: 0.94,
        requires_slot: true,
        slot: 'program',
        suggestions: names.slice(0, 6),
      };
    }
    ctx.pending = null;
    return {
      ...base,
      reply: answer(intent, p),
      intent,
      confidence: 0.96,
      suggestions: [`Fee for ${p.short}`, `Eligibility for ${p.short}`, 'Admission Process'],
    };
  }

  ctx.pending = null;
  const R = {
    program_query: prog
      ? answer(intent, prog)
      : 'Lovely Professional University offers 150+ globally benchmarked degree programmes across Engineering, Management, Computer Applications, Agriculture, Design, Law, and Sciences.\n\n' + list(names.slice(0, 10)),
    hostel_query:
      'LPU Uni-World provides comprehensive residential facilities across AC and Air-Cooled 1, 2, 3, and 4-seater rooms with multi-cuisine dining, 24/7 Uni-Hospital, 6-storey Uni-Mall, indoor sports complex, and biometric turnstiles.\n\nAnnual charges range from ₹83,000 to ₹1,13,000/yr for air-cooled rooms, and ₹93,000 to ₹1,53,000/yr for AC rooms.',
    scholarship_query: `LPU provides India's largest private university scholarship scheme:\n${list(scholarships.map((s) => `${s.name}: ${s.text}`))}`,
    document_query: `Documents required for LPU admission:\n${list(documents)}`,
    admission_query: `The LPU admission process has ${admissionSteps.length} simple steps:\n${list(admissionSteps.map((s, i) => `${i + 1}. ${s[0]}: ${s[1]}`))}\n\nApply online at admission.lpu.in.`,
    deadline_query: `Key dates for LPUNEST & Admission:\n${list(deadlines.map((d) => `${d[0]}: ${d[1]}`))}`,
    placement_query:
      'LPU Placements Record:\n• Highest International: ₹3 Crore\n• Highest Domestic: ₹54.75 LPA (Google)\n• 2,000+ top recruiting companies including Microsoft, Amazon, Google, Cisco, Apple, and Cognizant.',
    contact_query: `${contact.office}\n${list([`Email: ${contact.email}`, `Phone: ${contact.phone}`, `Toll-Free: ${contact.toll_free}`, `Hours: ${contact.hours}`, `Address: ${contact.address}`])}`,
    curriculum_query: prog ? answer(intent, prog) : 'You can view complete semester-wise course syllabi, credits, and electives on the Curriculum page.',
  };

  return {
    ...base,
    reply: R[intent] || R['program_query'],
    intent,
    confidence: 0.92,
    suggestions: intent === 'hostel_query'
      ? ['1-Seater Room (AC)', '2-Seater Room', 'Mess Facilities']
      : ['Available Programs', 'Fee Structure', 'Admission Process'],
  };
}

// POST /api/chat -> { reply, intent, confidence, requires_slot, slot, conversation_id }
export async function sendMessage(message, conversationId) {
  if (USE_MOCK) {
    if (!navigator.onLine) throw new Error('You appear to be offline.');
    await wait(350);
    return mockReply(message, conversationId);
  }
  try {
    const res = await request('/api/chat', () => mockReply(message, conversationId), {
      method: 'POST',
      body: JSON.stringify({ message, conversation_id: conversationId }),
    });
    return res || mockReply(message, conversationId);
  } catch (err) {
    console.warn('Backend fetch failed, smoothly falling back to local LPU engine:', err);
    await wait(300);
    return mockReply(message, conversationId);
  }
}

export const resetConversation = (id) => {
  delete memory[id];
};
