import { useState } from 'react';
import {
  ArrowRight, Search, GraduationCap, Wallet, CheckCircle2, BedDouble,
  FileText, PhoneCall, Scale, Building2, MapPin, AlertCircle
} from 'lucide-react';

// Landmarks stay plain data. No auto-advancing carousel: it moved while people
// were reading it, and every card was identical anyway.
const CAMPUS_HIGHLIGHTS = [
  {
    id: 'chancellery',
    title: 'Admissions & Chancellery (Block 30)',
    location: 'Block 30 · Admissions Division',
    desc: 'Counselling, document verification, and international admissions. This is where admission paperwork is handled.',
    image: '/images/lpu-campus-academic.png',
  },
  {
    id: 'library',
    title: 'Central Library',
    location: 'Central Campus · 9 storeys',
    desc: 'Over 1.5 million physical and digital titles, automated circulation, and research cubicles.',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 'unimall',
    title: 'Uni-Mall',
    location: 'Residential sector',
    desc: 'Six floors of stores, food courts, salons and banks inside the residential campus.',
    image: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=1000&auto=format&fit=crop&q=80',
  },
];

const TASKS = [
  {
    title: 'Fees and scholarships',
    desc: 'Per-semester tuition for each programme, plus LPUNEST scholarship slabs.',
    icon: Wallet,
    action: (go) => () => go('fees'),
    cta: 'See fee structure',
  },
  {
    title: 'Check eligibility',
    desc: 'Enter your qualification and percentage to see if you qualify for a programme.',
    icon: CheckCircle2,
    action: (go) => () => go('eligibility'),
    cta: 'Run the check',
  },
  {
    title: 'Hostel and mess charges',
    desc: 'Room types from 1- to 4-seater, mess plans, laundry, and electricity allowances.',
    icon: BedDouble,
    action: (go) => () => go('hostel'),
    cta: 'View hostel charges',
  },
  {
    title: 'Documents and deadlines',
    desc: 'The admission checklist and the dates that matter for the current session.',
    icon: FileText,
    action: (go) => () => go('admissions'),
    cta: 'Read the checklist',
  },
];

export default function Home({ go, ask, onOpenCompare }) {
  const [quickQuery, setQuickQuery] = useState('');

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    ask(quickQuery);
  };

  return (
    <div className="bg-[#F8FAFC] dark:bg-slate-950">

      {/* Status bar: says plainly what this site is. */}
      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="container-page flex flex-wrap items-center gap-x-4 gap-y-1 py-2.5 text-xs text-slate-600 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
            <AlertCircle size={13} className="text-orange-600" />
            Unofficial student project
          </span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
          <span>Data compiled from public LPU sources. Verify admissions on lpu.in.</span>
          <button
            type="button"
            onClick={() => go('contact')}
            className="ml-auto inline-flex items-center gap-1 text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-orange-700 dark:text-slate-300 dark:hover:text-orange-400"
          >
            Admissions desk numbers
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Hero: the search box is the task, not a slogan. */}
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="container-page grid gap-10 py-10 sm:py-14 lg:grid-cols-12 lg:gap-12">

          <div className="lg:col-span-7">
            <p className="eyebrow">LPU enquiry helpdesk</p>
            <h1 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Ask a question about admissions, fees or hostel life.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Type a question and get an answer drawn from the programme, fee and hostel data on this site.
              If the answer is not in the data, the assistant will say so instead of guessing.
            </p>

            <form onSubmit={handleHeroSearch} className="mt-6 max-w-xl">
              <label htmlFor="home-question" className="label">
                Your question
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="home-question"
                    type="text"
                    value={quickQuery}
                    onChange={(e) => setQuickQuery(e.target.value)}
                    placeholder="e.g. What is the fee for B.Tech CSE?"
                    className="input pl-9"
                  />
                </div>
                <button type="submit" className="btn-primary shrink-0">
                  Ask the helpdesk
                </button>
              </div>
            </form>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Try:</span>
              {[
                'B.Tech CSE fees',
                'LPUNEST scholarship slabs',
                'Hostel AC room charges',
                'MBA eligibility',
              ].map((tag) => (
                <button key={tag} type="button" onClick={() => ask(tag)} className="chip">
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Start-here panel: four real tasks instead of a decorative hero image. */}
          <div className="lg:col-span-5">
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Start here</h2>
              <ul className="mt-3 divide-y divide-slate-200 dark:divide-slate-800">
                {[
                  ['Check your eligibility', 'eligibility', CheckCircle2],
                  ['Estimate tuition and scholarships', 'fees', Wallet],
                  ['Look up hostel and mess charges', 'hostel', BedDouble],
                  ['Find the right office to call', 'contact', PhoneCall],
                ].map(([label, page, Icon]) => (
                  <li key={page}>
                    <button
                      type="button"
                      onClick={() => go(page)}
                      className="flex w-full items-center gap-3 py-2.5 text-left text-sm text-slate-700 hover:text-orange-700 dark:text-slate-300 dark:hover:text-orange-400"
                    >
                      <Icon size={16} className="shrink-0 text-slate-400" />
                      <span className="flex-1">{label}</span>
                      <ArrowRight size={14} className="shrink-0 text-slate-300 dark:text-slate-600" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800">
              {[
                ['Programmes listed', '44'],
                ['Campus area', '600+ acres'],
                ['NAAC grade', 'A++ (3.68/4)'],
                ['Highest package', '₹3 Cr'],
              ].map(([label, value]) => (
                <div key={label} className="bg-white px-4 py-3 dark:bg-slate-900">
                  <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {label}
                  </dt>
                  <dd className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Four concrete tasks. Not three identical feature cards. */}
      <section className="section">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-h2 font-semibold text-slate-900 dark:text-white">Common enquiries</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                The four things people ask about most.
              </p>
            </div>
            <button type="button" onClick={() => (onOpenCompare ? onOpenCompare() : go('programs'))} className="btn-secondary btn-sm">
              <Scale size={14} />
              Compare programmes
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TASKS.map((task) => {
              const Icon = task.icon;
              return (
                <div key={task.title} className="card card-hover flex flex-col p-5">
                  <Icon size={20} className="text-orange-600" />
                  <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">{task.title}</h3>
                  <p className="mt-1 flex-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {task.desc}
                  </p>
                  <button
                    type="button"
                    onClick={task.action(go)}
                    className="mt-4 inline-flex items-center gap-1 self-start text-xs font-medium text-orange-700 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300"
                  >
                    {task.cta}
                    <ArrowRight size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Campus landmarks: static, so they can be read. */}
      <section className="border-y border-slate-200 bg-white section dark:border-slate-800 dark:bg-slate-900">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-h2 font-semibold text-slate-900 dark:text-white">Places on campus</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Where students actually go for these things.
              </p>
            </div>
            <button type="button" onClick={() => go('contact')} className="btn-secondary btn-sm">
              <Building2 size={14} />
              All office contacts
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CAMPUS_HIGHLIGHTS.map((item) => (
              <article key={item.id} className="card card-hover overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="h-40 w-full object-cover"
                />
                <div className="p-4">
                  <p className="inline-flex items-center gap-1 text-[11px] font-medium text-orange-700 dark:text-orange-400">
                    <MapPin size={11} />
                    {item.location}
                  </p>
                  <h3 className="mt-1.5 text-sm font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{item.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Closing call to action, flat. */}
      <section className="section">
        <div className="container-page">
          <div className="card flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-h3 font-semibold text-slate-900 dark:text-white">Need to speak to someone?</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                The admissions desk takes calls on 1800 102 4431. The student relations desk is in Block 29.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <button type="button" onClick={() => go('chat')} className="btn-primary">
                <GraduationCap size={16} />
                Open the chat
              </button>
              <button type="button" onClick={() => go('contact')} className="btn-secondary">
                Contact details
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}