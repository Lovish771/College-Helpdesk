import { programs, fees, scholarships, documents, admissionSteps, deadlines, contact } from '../data/mockData';
import { mockArticles } from './knowledgeApi';
import { getProgramComparisonDetails } from '../data/programComparisonData';
import { USE_MOCK, wait, request } from './client';

// ---- MOCK ENGINE (used when VITE_USE_MOCK=true) ----
const memory = {}; // conversation_id -> { pending, program, semester }
const INTENTS = [
  ['greeting', /^(hi|hello|hey|namaste|good\s*(morning|evening|afternoon))/i],
  ['compare_query', /\b(?:compar(?:e|ison|ative|ing)|vs\.?|versus|difference\s+between)\b/i],
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

const findComparingPrograms = (t) => {
  const matched = [];
  // Sort by specificity
  const sorted = [...programs].sort((a, b) => (a.id === 'btech-cse' ? 1 : b.id === 'btech-cse' ? -1 : b.short.length - a.short.length));
  for (const p of sorted) {
    const regShort = new RegExp(`\\b${p.short.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    const regMatch = p.match ? new RegExp(p.match, 'i') : null;
    const regName = new RegExp(p.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    if (regShort.test(t) || (regMatch && regMatch.test(t)) || regName.test(t)) {
      if (!matched.some((m) => m.id === p.id)) {
        matched.push(p);
      }
    }
  }
  if (matched.length === 1) {
    if (matched[0].id === 'btech-cse') {
      const peer = programs.find((p) => p.id === 'btech-aiml');
      if (peer) matched.push(peer);
    } else if (matched[0].id.startsWith('btech')) {
      const peer = programs.find((p) => p.id === 'btech-cse');
      if (peer) matched.push(peer);
    }
  }
  return matched.length >= 2 ? matched : [programs.find((p) => p.id === 'btech-cse'), programs.find((p) => p.id === 'btech-aiml')];
};

const formatComparisonResponse = (p1, p2) => {
  const c1 = getProgramComparisonDetails(p1) || {};
  const c2 = getProgramComparisonDetails(p2) || {};
  const f1 = fees[p1.id] || { tuition: '₹1,60,000 / sem' };
  const f2 = fees[p2.id] || { tuition: '₹2,00,000 / sem' };

  return `### 📊 Deep Comparative Analysis: **${p1.short}** vs **${p2.short}**
*Lovely Professional University (Session 2026-27 Verified)*

---

#### 1. Core Focus & Curriculum Architecture
• **${p1.short} (${p1.name}):**
  - **Curriculum Focus:** ${p1.description}
  - **Core Subjects:** ${c1.coreElectives || 'Data Structures, Operating Systems, Computer Networks, DBMS, Software Engineering, Cloud Systems'}
  - **Practicum & Labs:** ${c1.labsAndInternships || 'Systems Programming Lab, Cloud Computing Sandbox, 6-Month Industry Capstone Internship'}

• **${p2.short} (${p2.name}):**
  - **Curriculum Focus:** ${p2.description}
  - **Specialized AI/ML Modules:** ${c2.aiTopics ? c2.aiTopics.join(', ') : 'Deep Learning, NLP, Computer Vision, Generative AI'}
  - **Core Subjects:** ${c2.coreElectives || 'Applied Machine Learning, Pattern Recognition, Linear Algebra for AI, Neural Networks'}
  - **Practicum & Labs:** ${c2.labsAndInternships || 'AI Innovation Cluster, Deep Learning GPU Lab, Industry AI Capstone'}

---

#### 2. Programming Languages & Tech Stacks
• **${p1.short}:** Languages: ${c1.languages?.join(', ') || 'C, C++, Java, Python, SQL'} | Tools: ${c1.techStack?.join(', ') || 'Linux, Git, Docker, Spring Boot, MySQL'}
• **${p2.short}:** Languages: ${c2.languages?.join(', ') || 'Python, C++, R, Julia, SQL'} | Tools: ${c2.techStack?.join(', ') || 'PyTorch, TensorFlow, Scikit-learn, OpenCV, Hugging Face'}

---

#### 3. Syllabus Difficulty & Mathematical Intensity
• **${p1.short}:** Balanced engineering rigor centered around discrete mathematics, computational logic, data structures, and distributed software systems.
• **${p2.short}:** High mathematical intensity requiring strong foundations in multivariate calculus, linear algebra, probability matrices, Bayesian inference, and neural backpropagation.

---

#### 4. Industry Demand & Corporate Recruiters
• **Recruiters for both:** Google, Microsoft, Amazon, Cisco, Apple, Cognizant, Infosys, Capgemini, TCS, Wipro.
• **Primary Career Roles:**
  - **${p1.short}:** ${c1.careerRoles?.join(', ') || 'Software Development Engineer (SDE), Full-Stack Architect, Cloud Engineer'}
  - **${p2.short}:** ${c2.careerRoles?.join(', ') || 'AI/ML Research Engineer, NLP Specialist, Computer Vision Engineer, Data Scientist'}

---

#### 5. Placement Packages & Statistics
• **${p1.short}:** Highest International: ₹3 Crore | Highest Domestic: ₹54.75 LPA (Google) | Average Package: ~₹7.2 - 8.5 LPA
• **${p2.short}:** Highest Domestic: ₹54.75+ LPA | Specialized AI niche offers average ~₹8.5 - 10.5 LPA

---

#### 6. Tuition Fees & LPUNEST Merit Scholarships (Per Semester)
• **${p1.short}:** Base Tuition: **${f1.tuition || '₹1,60,000 / sem'}**
  - Category I (50% waiver / 95%+ in 12th / 95+ %ile JEE): ~₹80,000 / sem
  - Category II (40% waiver / 90-94.9% in 12th / 90-94.9 %ile JEE): ~₹96,000 / sem
  - Category III (30% waiver / 80-89.9% in 12th / 80-89.9 %ile JEE): ~₹1,12,000 / sem

• **${p2.short}:** Base Tuition: **${f2.tuition || '₹2,00,000 / sem'}**
  - Category I (50% waiver / 95%+ in 12th / 95+ %ile JEE): ~₹1,00,000 / sem
  - Category II (40% waiver / 90-94.9% in 12th / 90-94.9 %ile JEE): ~₹1,20,000 / sem
  - Category III (30% waiver / 80-89.9% in 12th / 80-89.9 %ile JEE): ~₹1,40,000 / sem

---

#### 7. Clear Recommendation for Your Career Goals
• Choose **${p1.short}** if you want maximum versatile career flexibility across full-stack development, cloud architecture, system design, and the widest breadth of tech corporate roles worldwide.
• Choose **${p2.short}** if you are explicitly passionate about machine learning models, artificial intelligence research, algorithmic data modeling, and specialized AI engineer careers.`;
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
    return `Here is the fee structure for **${p.name} (${p.short})** at Lovely Professional University:\n\n${list([
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
      `Requirement: ${p.eligibility}`,
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
    const stopwords = new Set(['what', 'when', 'where', 'which', 'how', 'the', 'for', 'and', 'with', 'are', 'you', 'can', 'tell', 'about', 'lpu', 'is', 'in', 'to', 'of', 'a', 'an', 'do', 'does', 'rule']);
    const tokens = (message.toLowerCase().match(/[a-z0-9]{2,}/g) || []).filter((t) => !stopwords.has(t));
    if (tokens.length > 0) {
      let bestArt = null;
      let bestScore = 0;
      for (const art of mockArticles) {
        const hay = `${art.title} ${art.category} ${art.tag} ${art.answer}`.toLowerCase();
        let score = tokens.reduce((acc, tok) => acc + (hay.includes(tok) ? 1 : 0), 0);
        if (tokens.some((tok) => art.title.toLowerCase().includes(tok))) score += 1;
        if (score > bestScore) {
          bestScore = score;
          bestArt = art;
        }
      }
      if (bestArt && bestScore >= 2) {
        return {
          ...base,
          reply: `**${bestArt.title}**\n\n${bestArt.answer}`,
          intent: 'knowledge_query',
          confidence: 0.9,
          suggestions: ['Fee Structure', 'LPUNEST Scholarship', 'Hostel Facilities', 'Admission Process'],
        };
      }
    }
    return {
      ...base,
      reply: "I'm sorry, I couldn't identify that enquiry.\n\nI can help with Lovely Professional University (LPU) information on:\n• Programmes & Specializations\n• LPUNEST & Admissions\n• Fee Structure & Slabs\n• Scholarships up to 50%\n• Hostel & Campus Facilities\n• Placement Statistics\n• Eligibility & Documents\n\nCould you please rephrase your question?",
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

  if (intent === 'compare_query') {
    const pair = findComparingPrograms(message);
    const p1 = pair[0] || programs[0];
    const p2 = pair[1] || programs[1];
    return {
      ...base,
      reply: formatComparisonResponse(p1, p2),
      intent: 'compare_query',
      confidence: 0.99,
      suggestions: [`Fee for ${p1.short}`, `Fee for ${p2.short}`, 'LPUNEST Scholarships', 'Hostel Facilities'],
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
    if (err.status === 401 || err.requires_login) {
      throw err;
    }
    console.warn('Backend fetch failed, smoothly falling back to local LPU engine:', err);
    await wait(300);
    return mockReply(message, conversationId);
  }
}

export const resetConversation = (id) => {
  delete memory[id];
};
