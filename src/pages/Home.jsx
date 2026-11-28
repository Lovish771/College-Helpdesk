import React, { useState, useRef } from 'react';
import Campus3dCard from '../components/Campus3dCard';
import {
  ArrowRight, Search, GraduationCap, Wallet, CheckCircle2, BedDouble,
  FileText, PhoneCall, Scale, Building2, MapPin, HelpCircle,
  Award, ShieldCheck, Flame, Compass, ChevronRight
} from 'lucide-react';

const CAMPUS_HIGHLIGHTS = [
  {
    id: 'chancellery',
    title: 'Academic Block & Chancellery',
    location: 'Block 30 · Admissions Division',
    desc: 'Central counselling, document verification, and international admissions paperwork hub.',
    image: '/images/lpu-academic-block.jpg',
  },
  {
    id: 'library',
    title: 'Central Library',
    location: 'Central Campus · 9 Storeys',
    desc: 'Over 1.5 million physical and digital titles, automated circulation, and silent research cubicles.',
    image: '/images/lpu-central-library.jpg',
  },
  {
    id: 'unimall',
    title: 'Uni-Mall & Lifestyle Complex',
    location: 'Residential Sector',
    desc: 'Six floors of departmental stores, food courts, brand outlets, and banking services.',
    image: '/images/lpu-unimall.jpg',
  },
];

const TASKS = [
  {
    title: 'Fees & Scholarships',
    desc: 'Per-semester tuition for each programme, plus LPUNEST scholarship slabs up to 50%.',
    icon: Wallet,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-500/30',
    action: (go) => () => go('fees'),
    cta: 'Explore Fee Structure',
  },
  {
    title: 'Eligibility Checker',
    desc: 'Enter your qualification and aggregate percentage to see your eligible degrees.',
    icon: CheckCircle2,
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-500/30',
    action: (go) => () => go('eligibility'),
    cta: 'Check Instant Eligibility',
  },
  {
    title: 'Hostel & Living Tariffs',
    desc: '1- to 4-seater AC & air-cooled options, mess meal plans, and campus amenities.',
    icon: BedDouble,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-500/30',
    action: (go) => () => go('hostel'),
    cta: 'View Living Tariffs',
  },
  {
    title: 'Checklists & Deadlines',
    desc: 'Document verification checklists, reporting dates, and LPUNEST registration phases.',
    icon: FileText,
    color: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-500/30',
    action: (go) => () => go('admissions'),
    cta: 'Read Checklist',
  },
];

const STATS = [
  { label: 'Accredited Programmes', value: '44+', icon: GraduationCap },
  { label: 'Campus Infrastructure', value: '600+ Acres', icon: Building2 },
  { label: 'NAAC Accreditation', value: 'A++ Grade', icon: Award },
  { label: 'Highest Package', value: '₹3 Crore', icon: Flame },
];

export default function Home({ go, ask, onOpenCompare }) {
  const [quickQuery, setQuickQuery] = useState('');
  const [searchHint, setSearchHint] = useState(false);
  const inputRef = useRef(null);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (!quickQuery.trim()) {
      setSearchHint(true);
      inputRef.current?.focus();
      return;
    }
    setSearchHint(false);
    ask(quickQuery);
  };

  return (
    <div className="bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors pb-12">

      {/* ── Elevated Modern Hero ── */}
      <section className="relative bg-white dark:bg-[#070B14] text-slate-900 dark:text-white pt-6 sm:pt-8 pb-8 sm:pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-slate-200 dark:border-slate-800/80 transition-colors">
        {/* Ambient background glow & architecture */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-20 mix-blend-luminosity scale-105 pointer-events-none"
          style={{
            backgroundImage: `url('/images/lpu-academic-block.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-slate-50/60 dark:from-[#070B14] dark:via-[#070B14]/90 dark:to-[#070B14]/75 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            {/* Left Column: Metadata + Heading + Search Bar */}
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2.5 text-xs mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-500/40 text-orange-700 dark:text-orange-400 font-bold">
                  <ShieldCheck size={13} />
                  <span>2026–27 Verified Data</span>
                </span>
                <button
                  type="button"
                  onClick={() => go('contact')}
                  className="inline-flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300 hover:text-orange-700 dark:hover:text-orange-400 transition-colors cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                >
                  <span>Block 30 Admissions Desk</span>
                  <ChevronRight size={13} />
                </button>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-tight">
                Instant answers on admissions, <span className="text-orange-700 dark:text-orange-400">fees &amp; hostel life.</span>
              </h1>

              <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed font-sans">
                Search 44 accredited degrees, LPUNEST scholarship slabs, verified accommodation tariffs, and admission requirements.
              </p>

              {/* Compact Rounded Search Bar */}
              <form onSubmit={handleHeroSearch} className="mt-5 max-w-xl">
                <div className={`relative flex items-center bg-slate-50 dark:bg-[#0B101D]/90 border rounded-full pl-4 pr-1.5 py-1 shadow-sm dark:shadow-xl focus-within:border-orange-600 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all ${
                  searchHint ? 'border-orange-600 ring-2 ring-orange-500/25' : 'border-slate-200 dark:border-slate-700/80'
                }`}>
                  <Search size={16} className="text-slate-500 dark:text-slate-400 mr-2 shrink-0" />
                  <input
                    ref={inputRef}
                    id="home-question"
                    type="text"
                    value={quickQuery}
                    onChange={(e) => {
                      setQuickQuery(e.target.value);
                      if (searchHint) setSearchHint(false);
                    }}
                    placeholder="Ask fees, hostel, or LPUNEST..."
                    aria-label="Ask a question about admissions or fees"
                    className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 outline-none font-sans"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-full bg-orange-700 hover:bg-orange-800 dark:bg-orange-600 dark:hover:bg-orange-500 text-white text-xs font-bold shrink-0 shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  >
                    <span>Ask Helpdesk</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
                {searchHint ? (
                  <p className="mt-1.5 text-xs font-medium text-orange-700 dark:text-orange-400 pl-2">
                    Enter a question or pick one of the popular topics below.
                  </p>
                ) : (
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 pl-2">
                    No login needed for Fee &amp; Eligibility calculators · Email OTP required for AI chat
                  </p>
                )}
              </form>

              {/* Quick Suggestion Chips */}
              <div className="mt-3.5 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Popular:</span>
                {[
                  'B.Tech CSE fees',
                  'LPUNEST scholarship slabs',
                  'Hostel AC room charges',
                  'MBA eligibility',
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => ask(tag)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-700/70 text-slate-700 dark:text-slate-300 hover:text-orange-700 dark:hover:text-white transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Clean Campus Showcase */}
            <div className="lg:col-span-5">
              <Campus3dCard onExplore={() => go('contact')} />
            </div>
          </div>

          {/* Bottom Hero Stat Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-7 pt-6 border-t border-slate-200/80 dark:border-slate-800/80">
            {STATS.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="p-3 rounded-xl bg-slate-50/80 dark:bg-[#0D1322]/70 border border-slate-200/90 dark:border-white/10 flex items-center gap-3 shadow-2xs"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 flex items-center justify-center shrink-0">
                  <Icon size={16} />
                </div>
                <div>
                  <span className="block text-sm font-extrabold text-slate-900 dark:text-white leading-tight">{value}</span>
                  <span className="block text-xs text-slate-600 dark:text-slate-400 mt-0.5">{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Common Enquiries ── */}
      <section className="py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2">
            <div>
              <span className="text-xs font-extrabold text-orange-700 dark:text-orange-400 uppercase tracking-wider block mb-1">
                Core Tools
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display">
                Frequently Requested Information
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Direct access to LPU fee tables, eligibility rules, and hostel tariffs.
              </p>
            </div>

            <button
              type="button"
              onClick={() => (onOpenCompare ? onOpenCompare() : go('programs'))}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-orange-500/60 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40 text-xs font-bold transition-all shadow-2xs shrink-0 self-start sm:self-auto cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <Scale size={13} />
              <span>Compare Degrees Matrix</span>
            </button>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TASKS.map((task) => {
              const Icon = task.icon;
              return (
                <button
                  key={task.title}
                  type="button"
                  onClick={task.action(go)}
                  className="group relative flex flex-col text-left p-5 rounded-2xl cursor-pointer border transition-all duration-300
                    bg-white dark:bg-[#0D131F] border-slate-200/90 dark:border-slate-800/90
                    hover:-translate-y-1.5 hover:border-orange-500/60
                    hover:shadow-md dark:hover:shadow-[0_15px_30px_-10px_rgba(249,115,22,0.2)] shadow-2xs
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                >
                  {/* Emblem squircle */}
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mb-3 transition-transform duration-300 group-hover:scale-105 ${task.bg}`}>
                    <Icon size={19} className={task.color} />
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-orange-700 dark:group-hover:text-orange-400 transition-colors">
                    {task.title}
                  </h3>

                  <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
                    {task.desc}
                  </p>

                  <div className="mt-4 pt-3 w-full border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-orange-700 dark:text-orange-400 group-hover:translate-x-1 transition-transform">
                    <span>{task.cta}</span>
                    <ArrowRight size={13} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Campus Landmarks / Life on Campus ── */}
      <section className="py-8 sm:py-10 bg-slate-50/70 dark:bg-[#080D1A] border-y border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-extrabold text-orange-700 dark:text-orange-400 uppercase tracking-wider block mb-1">
                Campus Venues
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display">
                Key Landmark Hubs
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Primary campus venues for admissions, academic research, and residential life.
              </p>
            </div>

            <button
              type="button"
              onClick={() => go('contact')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-orange-500 text-xs font-bold transition-all shadow-2xs shrink-0 self-start sm:self-auto cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <Building2 size={13} className="text-orange-600 dark:text-orange-400" />
              <span>Campus Office Helplines</span>
            </button>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CAMPUS_HIGHLIGHTS.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#0D131F] shadow-2xs"
              >
                <div className="relative h-36 w-full overflow-hidden bg-slate-900">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-orange-300 text-[10px] font-bold border border-white/10">
                    <MapPin size={10} className="text-orange-300 shrink-0" />
                    <span>{item.location}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing Call-To-Action Banner ── */}
      <section className="py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl p-6 sm:p-7 bg-white dark:bg-[#0D131F] border border-slate-200/90 dark:border-slate-800 shadow-sm dark:shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="max-w-xl">
              <span className="text-xs font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wider block mb-1">
                Direct Admissions Support
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display">
                Still looking for specific details?
              </h2>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                Call the admissions desk on toll-free <strong className="text-slate-900 dark:text-white">1800 102 4431</strong>, or ask the AI student helpdesk in real time.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => go('chat')}
                className="px-4 py-2.5 rounded-xl bg-orange-700 hover:bg-orange-800 dark:bg-orange-600 dark:hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <GraduationCap size={15} />
                <span>Ask AI Assistant</span>
              </button>

              <button
                type="button"
                onClick={() => go('contact')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 border border-slate-200 dark:border-white/20 text-slate-800 dark:text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <PhoneCall size={14} />
                <span>Admissions Contacts</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
