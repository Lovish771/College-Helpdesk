import { useState } from 'react';
import {
  Calendar, HelpCircle, CheckCircle, ArrowRight, Sparkles,
  CreditCard, Building2, FileText, CheckCircle2, ChevronDown, ChevronUp,
  Download, PhoneCall, ShieldCheck, Landmark, BadgePercent
} from 'lucide-react';
import { getAdmissionsInfo } from '../api/programsApi';
import { useAsync, Async, PageHead } from '../utils/useAsync';

const LOAN_STEPS = [
  {
    step: '01',
    title: 'Admission Token & Bonafide Letter',
    desc: 'Reserve your provisional seat by submitting the initial admission token. Download the official "University Bonafide Certificate & Total Fee Estimate Letter" from UMS or collect it from Block 29, Room 104.',
  },
  {
    step: '02',
    title: 'Register on Vidya Lakshmi Portal',
    desc: 'Apply online on Government of India’s portal (www.vidyalakshmi.co.in). Select preferred participating banks including SBI, PNB, Canara Bank, HDFC, or ICICI Bank.',
  },
  {
    step: '03',
    title: 'Document Verification & Submission',
    desc: 'Submit student 10th/12th marksheets, LPU allotment letter, fee structure, parent/guarantor KYC, ITR (last 2 years) or salary slips, and 6 months bank statement.',
  },
  {
    step: '04',
    title: 'Govt. Interest Subsidy (CSIS Scheme)',
    desc: 'Students with annual family income up to ₹4.5 Lakh are eligible for 100% interest subsidy during the moratorium period under the Central Sector Interest Subsidy (CSIS) scheme.',
  },
  {
    step: '05',
    title: 'Direct University Account Disbursement',
    desc: 'Upon sanction, the loan amount (covering tuition, hostel, mess, and books) is disbursed directly to Lovely Professional University’s verified fee account via NEFT/RTGS.',
  },
];

const ON_CAMPUS_BANKS = [
  { name: 'State Bank of India (SBI)', branch: 'LPU Campus Uni-Mall Branch', contact: '01824-500120', type: 'Nationalized Bank' },
  { name: 'Punjab National Bank (PNB)', branch: 'LPU Student Center Branch', contact: '01824-500210', type: 'Nationalized Bank' },
  { name: 'Canara Bank', branch: 'Block 30 Admissions Desk', contact: '01824-500330', type: 'Nationalized Bank' },
  { name: 'HDFC Bank & ICICI Bank', branch: 'Uni-Center Banking Plaza', contact: '1800 202 6161', type: 'Premier Private Bank' },
];

export default function Admissions({ ask, go }) {
  const s = useAsync(getAdmissionsInfo);
  const [openFaqIndex, setOpenFaqIndex] = useState(0); // Default open first FAQ

  const toggleFaq = (idx) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-10 sm:py-12 space-y-12">
        
        {/* Header */}
        <PageHead
          title="Admission Guide & Roadmap"
          text="Complete step-by-step guidance from qualification cutoffs to confirmed seat enrollment, document verification, and education loan sanction for Lovely Professional University."
          badge="Admissions 2026-27"
        >
          <button
            className="btn-3d-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md cursor-pointer"
            onClick={() => ask('What is the complete step-by-step admission and scholarship process for 2026-27?')}
          >
            <Sparkles size={15} />
            Ask AI Admission Assistant
          </button>
        </PageHead>

        <Async state={s}>
          {(d) => (
            <>
              {/* Steps List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
                    Admissions Roadmap • Batch 2026-27
                  </h2>
                  <span className="text-xs font-semibold text-slate-400">5 Clear Sequential Steps</span>
                </div>

                <ol className="space-y-3.5">
                  {d.steps.map(([t, x], i) => (
                    <li
                      key={t}
                      className="card-3d group flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-orange-300 dark:hover:border-orange-700"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-display text-lg font-bold bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 transition-transform duration-300 group-hover:scale-105 shadow-2xs">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          {t}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {x}
                        </p>
                      </div>
                      <span className="hidden sm:flex text-xs items-center gap-1 font-semibold text-slate-400 dark:text-slate-500 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        Step {i + 1}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Deadlines / Important Dates */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-orange-600 dark:text-orange-400" />
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
                    Important Dates &amp; Deadlines (2026-27)
                  </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {d.deadlines.map(([a, b]) => (
                    <div
                      key={a}
                      className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm"
                    >
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{a}</p>
                      <p className="mt-2 text-base font-bold text-orange-600 dark:text-orange-400">{b}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ════════════════════════════════════════════════════════════
                  DEDICATED SECTION: EDUCATION LOAN PROCESS & FINANCIAL AID
              ════════════════════════════════════════════════════════════ */}
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                      <Landmark size={14} />
                      <span>Financial aid &amp; loans at LPU</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display">
                      Education Loan Application Process
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                      LPU partners with leading nationalized and private banks to ensure 100% financial coverage for tuition, accommodation, examination, and computer laptop expenses.
                    </p>
                  </div>

                  <button
                    onClick={() => ask('How do I get an education loan sanction letter from LPU? What documents are needed?')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-xs font-bold text-orange-600 dark:text-orange-400 hover:bg-orange-100 transition-colors cursor-pointer shrink-0"
                  >
                    <CreditCard size={14} />
                    <span>Inquire About Education Loan</span>
                  </button>
                </div>

                {/* 5-Step Loan Workflow Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                  {LOAN_STEPS.map((step) => (
                    <div
                      key={step.step}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 flex flex-col justify-between"
                    >
                      <div>
                        <span className="font-mono text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/70 px-2 py-0.5 rounded-md">
                          Step {step.step}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-2 leading-tight">
                          {step.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* On-Campus Bank Partners */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      On-Campus Bank Branches &amp; Desks (Immediate Processing)
                    </h4>
                    <span className="text-[11px] text-slate-400">Available Monday–Saturday, 9:00 AM – 5:00 PM</span>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {ON_CAMPUS_BANKS.map((b) => (
                      <div
                        key={b.name}
                        className="p-3.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs"
                      >
                        <p className="font-bold text-slate-900 dark:text-white">{b.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{b.branch}</p>
                        <div className="mt-2 flex items-center justify-between text-[10px] font-semibold text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-1.5">
                          <span className="text-emerald-600 dark:text-emerald-400">{b.type}</span>
                          <span>Helpline: {b.contact}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Loan Assistance Box */}
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={20} className="text-blue-600 dark:text-blue-400 shrink-0" />
                    <div>
                      <p className="font-bold text-blue-950 dark:text-blue-200">
                        Need an expedited Bonafide &amp; Multi-Year Fee Letter for your bank?
                      </p>
                      <p className="text-blue-700 dark:text-blue-300 text-[11px] mt-0.5">
                        Visit the Education Loan Desk in Block 29, Room 104 or email <a href="mailto:loans@lpu.co.in" className="underline font-bold">loans@lpu.co.in</a>. Letters are issued within 24 hours.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => go('contact')}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs shrink-0 cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    Contact Loan Cell
                  </button>
                </div>
              </div>

              {/* ════════════════════════════════════════════════════════════
                  IN-PLACE FAQ ACCORDION (Answers Directly Here!)
              ════════════════════════════════════════════════════════════ */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle size={18} className="text-orange-600 dark:text-orange-400" />
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
                      Admissions &amp; Enrollment FAQs
                    </h2>
                  </div>
                  <span className="text-xs text-slate-400">Click any question to view the full answer</span>
                </div>

                <div className="space-y-3">
                  {d.faqs.map(([q, a], idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={q}
                        className={`rounded-2xl transition-all duration-200 border overflow-hidden ${
                          isOpen
                            ? 'bg-white dark:bg-slate-900 border-orange-300 dark:border-orange-800 shadow-md ring-1 ring-orange-500/20'
                            : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleFaq(idx)}
                          className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer group"
                        >
                          <div className="flex items-center gap-3.5 pr-4">
                            <span
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-colors ${
                                isOpen
                                  ? 'bg-orange-600 text-white'
                                  : 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400'
                              }`}
                            >
                              <HelpCircle size={15} />
                            </span>
                            <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-snug">
                              {q}
                            </span>
                          </div>

                          <div className="shrink-0 text-slate-400 group-hover:text-orange-600 transition-colors">
                            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </div>
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800/80 animate-fade-in">
                            <div className="mt-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                              {a}
                            </div>

                            <div className="mt-3 flex items-center justify-between text-xs pt-2">
                              <span className="text-[11px] text-slate-400">
                                Verified by LPU Central Admissions Office (Block 30).
                              </span>
                              <button
                                onClick={() => ask(`Can you give me more details about: ${q}?`)}
                                className="inline-flex items-center gap-1 font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
                              >
                                <Sparkles size={12} />
                                <span>Ask AI More Details</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Eligibility Check Callout Footer */}
              <div className="rounded-lg p-6 sm:p-8 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">
                    Ready to verify your marks and eligibility?
                  </h3>
                  <p className="text-xs sm:text-sm mt-1 text-slate-600 dark:text-slate-400 max-w-xl">
                    Run the automated eligibility checker with your 10+2 / graduation stream and percentage to view exact qualified programmes.
                  </p>
                </div>
                <button
                  className="rounded-xl px-5 py-2.5 text-xs font-bold bg-orange-600 text-white hover:bg-orange-700 transition-all shadow-md shrink-0 cursor-pointer"
                  onClick={() => go('eligibility')}
                >
                  Open Eligibility Checker
                </button>
              </div>
            </>
          )}
        </Async>
      </div>
    </div>
  );
}
