import React, { useState } from 'react';
import {
  ArrowRight, Search, GraduationCap, Wallet, CheckCircle2, BedDouble,
  FileText, PhoneCall, Scale, Building2, MapPin, Sparkles,
  Award, ShieldCheck, Flame, Compass, ChevronRight
} from 'lucide-react';

const CAMPUS_HIGHLIGHTS = [
  {
    id: 'chancellery',
    title: 'Admissions & Chancellery (Block 30)',
    location: 'Block 30 · Admissions Division',
    desc: 'Central counselling, document verification, and international admissions paperwork hub.',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 'library',
    title: 'Central Library',
    location: 'Central Campus · 9 Storeys',
    desc: 'Over 1.5 million physical and digital titles, automated circulation, and silent research cubicles.',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 'unimall',
    title: 'Uni-Mall & Lifestyle Complex',
    location: 'Residential Sector',
    desc: 'Six floors of departmental stores, food courts, brand outlets, and banking services.',
    image: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=1000&auto=format&fit=crop&q=80',
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

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    ask(quickQuery);
  };

  return (
    <div className="bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors pb-12">

      {/* ── Top Notice Bar (Compact, matches theme cleanly) ── */}
      <div className="border-b border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#070B14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-900/50">
              <ShieldCheck size={12} className="text-orange-600 dark:text-orange-400" />
              Verified Public Information
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
            <span className="hidden md:inline">Authentic data on programmes, fee structures &amp; hostel plans</span>
          </div>

          <button
            type="button"
            onClick={() => go('contact')}
            className="inline-flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer"
          >
            <span>Block 30 Admissions Desk</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* ── Elevated Modern Hero (matches white on white theme, and dark on dark theme) ── */}
      <section className="relative bg-white dark:bg-[#070B14] text-slate-900 dark:text-white pt-6 sm:pt-8 pb-8 sm:pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-slate-200 dark:border-slate-800/80 transition-colors">
        {/* Ambient background glow & architecture */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-20 mix-blend-luminosity scale-105 pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&auto=format&fit=crop&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-orange-50/40 dark:from-[#070B14] dark:via-[#070B14]/90 dark:to-[#070B14]/75 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Column: Heading + Compact Search Bar */}
          <div className="lg:col-span-7">
            {/* Pill: Student Portal */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-500/40 text-orange-600 dark:text-orange-400 text-xs font-bold mb-3 shadow-2xs">
              <Sparkles size={12} className="text-orange-500" />
              <span>LPU Student Helpdesk Gateway</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-tight">
              Instant answers on admissions, <span className="text-orange-500">fees &amp; hostel life</span>.
            </h1>

            <p className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed font-sans">
              Search authentic university data covering 44 accredited degrees, LPUNEST scholarship slabs, verified accommodation tariffs, and admission requirements.
            </p>

            {/* Compact Rounded Search Bar */}
            <form onSubmit={handleHeroSearch} className="mt-5 max-w-xl">
              <div className="relative flex items-center bg-slate-50 dark:bg-[#0B101D]/90 border border-slate-200 dark:border-slate-700/80 rounded-full pl-4 pr-1.5 py-1 shadow-sm dark:shadow-xl focus-within:border-orange-500/60 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
                <Search size={16} className="text-slate-400 mr-2 shrink-0" />
                <input
                  id="home-question"
                  type="text"
                  value={quickQuery}
                  onChange={(e) => setQuickQuery(e.target.value)}
                  placeholder="e.g. What is the fee for B.Tech CSE?"
                  aria-label="Ask a question about admissions or fees"
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none font-sans"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shrink-0 shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Ask Helpdesk</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </form>

            {/* Quick Suggestion Chips */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Popular:</span>
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
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-700/70 text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-white transition-all cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Key Navigation Hub Card + Institutional Highlights */}
          <div className="lg:col-span-5 space-y-3">
            <div className="rounded-2xl p-5 bg-white dark:bg-[#0D1322]/85 border border-slate-200/90 dark:border-white/10 shadow-sm dark:shadow-xl">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-white/10">
                <span className="text-xs font-extrabold text-orange-600 dark:text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass size={14} />
                  Quick Action Portals
                </span>
                <span className="text-[11px] text-slate-400">Direct Navigation</span>
              </div>

              <div className="mt-2.5 space-y-1.5">
                {[
                  ['Explore 44 Programmes', 'programs', GraduationCap, 'B.Tech, Management, Law & Health'],
                  ['Tuition & Scholarship Calculator', 'fees', Wallet, 'Calculate per-sem costs with waivers'],
                  ['Instant Eligibility Check', 'eligibility', CheckCircle2, 'Check marks & qualification match'],
                  ['Hostel Living & Mess Plans', 'hostel', BedDouble, 'Tariffs for 1 to 4 seater rooms'],
                ].map(([label, target, Icon, sub]) => (
                  <button
                    key={target}
                    type="button"
                    onClick={() => go(target)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] hover:bg-orange-50 dark:hover:bg-orange-500/10 border border-slate-200/70 dark:border-white/[0.06] hover:border-orange-500/30 text-left transition-all duration-200 group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          {label}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">{sub}</p>
                      </div>
                    </div>
                    <ArrowRight size={13} className="text-slate-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-all shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Mini Stat Badges */}
            <div className="grid grid-cols-2 gap-2.5">
              {STATS.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="p-3 rounded-xl bg-white dark:bg-[#0D1322]/70 border border-slate-200/90 dark:border-white/10 flex items-center gap-2.5 shadow-2xs"
                >
                  <div className="w-7 h-7 rounded-lg bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                    <Icon size={15} />
                  </div>
                  <div>
                    <span className="block text-xs font-extrabold text-slate-900 dark:text-white leading-tight">{value}</span>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── Common Enquiries: Modern 3D Elevated Cards (Compact spacing) ── */}
      <section className="py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
                <span className="text-[11px] font-extrabold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                  Core Topics
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-display">
                Frequently Requested Information
              </h2>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                Direct access to the most consulted university datasets and calculators.
              </p>
            </div>

            <button
              type="button"
              onClick={() => (onOpenCompare ? onOpenCompare() : go('programs'))}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-orange-500/60 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40 text-xs font-bold transition-all shadow-2xs shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <Scale size={13} />
              <span>Compare Degrees Matrix</span>
            </button>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TASKS.map((task) => {
              const Icon = task.icon;
              return (
                <div
                  key={task.title}
                  onClick={task.action(go)}
                  className="group relative flex flex-col p-5 rounded-2xl cursor-pointer border transition-all duration-300 select-none
                    bg-white dark:bg-[#0D131F] border-slate-200/90 dark:border-slate-800/90
                    hover:-translate-y-1.5 hover:border-orange-500/60
                    hover:shadow-md dark:hover:shadow-[0_15px_30px_-10px_rgba(249,115,22,0.2)] shadow-2xs"
                >
                  {/* Emblem squircle */}
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mb-3 transition-transform duration-300 group-hover:scale-105 ${task.bg}`}>
                    <Icon size={19} className={task.color} />
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {task.title}
                  </h3>

                  <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
                    {task.desc}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-orange-600 dark:text-orange-400 group-hover:translate-x-1 transition-transform">
                    <span>{task.cta}</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
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
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
                <span className="text-[11px] font-extrabold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                  Campus Facilities
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-display">
                Key Landmark Hubs
              </h2>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                Primary campus venues for admissions, academic research, and residential life.
              </p>
            </div>

            <button
              type="button"
              onClick={() => go('contact')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-orange-500 text-xs font-bold transition-all shadow-2xs shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <Building2 size={13} className="text-orange-500" />
              <span>Campus Office Helplines</span>
            </button>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CAMPUS_HIGHLIGHTS.map((item) => (
              <article
                key={item.id}
                className="group rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#0D131F] shadow-2xs hover:border-orange-500/50 hover:shadow-md transition-all duration-300"
              >
                <div className="relative h-36 w-full overflow-hidden bg-slate-900">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-orange-400 text-[10px] font-bold border border-white/10">
                    <MapPin size={10} className="text-orange-400 shrink-0" />
                    <span>{item.location}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
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
          <div className="relative rounded-2xl p-6 sm:p-7 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50/20 dark:from-slate-900 dark:via-[#0B101D] dark:to-[#070B14] border border-orange-200/70 dark:border-slate-800 shadow-sm dark:shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="relative z-10 max-w-xl">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 border border-orange-300 dark:border-orange-500/40 text-orange-700 dark:text-orange-400 text-[10px] font-bold mb-2">
                <Sparkles size={10} />
                Need Dedicated Assistance?
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display">
                Still looking for specific details?
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                The admissions desk is available on toll-free <strong className="text-slate-900 dark:text-white">1800 102 4431</strong>. Or speak with the interactive AI student helpdesk in real time.
              </p>
            </div>

            <div className="relative z-10 flex shrink-0 flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => go('chat')}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <GraduationCap size={15} />
                <span>Ask AI Assistant</span>
              </button>

              <button
                type="button"
                onClick={() => go('contact')}
                className="px-4 py-2 rounded-full bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/15 border border-slate-300 dark:border-white/20 text-slate-800 dark:text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
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
