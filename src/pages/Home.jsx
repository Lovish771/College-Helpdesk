import { useState } from 'react';
import {
  ArrowRight, Search, GraduationCap, Users, ShieldCheck, Clock,
  Sparkles, Wallet, BedDouble, Scale, PhoneCall, BookOpen,
  Building2, CheckCircle2, ChevronRight, Award, Compass, HelpCircle
} from 'lucide-react';
import LpuLogo from '../components/LpuLogo';

const CAMPUS_HIGHLIGHTS = [
  {
    id: 'entrance',
    title: 'Iconic Grand Entrance & Sunburst Monument',
    location: 'Main Gate 1 · Jalandhar-Delhi G.T. Road (NH-1)',
    desc: 'The grand landmark entrance welcoming thousands of students daily into the 600+ acre university campus.',
    image: '/images/lpu-campus-entrance.jpg',
    tag: 'Campus Landmark',
  },
  {
    id: 'chancellery',
    title: 'Central Admissions Block & Chancellery (Block 30)',
    location: 'Block 30 · Admissions Division',
    desc: 'The nerve center for admissions, counselling, document verification, and foreign student admissions.',
    image: '/images/lpu-campus-academic.png',
    tag: 'Administrative Block',
  },
  {
    id: 'library',
    title: 'Shanti Devi Mittal Central Library',
    location: 'Central Campus · 9 Storeys',
    desc: 'Houses over 1.5 million physical and digital books, automated circulation systems, and dedicated research cubicles.',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1000&auto=format&fit=crop&q=80',
    tag: 'Academic Infrastructure',
  },
  {
    id: 'unimall',
    title: 'Uni-Mall & Student Life Hub',
    location: 'Residential Sector',
    desc: 'A dedicated 6-floor lifestyle mall with departmental stores, international food courts, lifestyle salons, and banks.',
    image: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=1000&auto=format&fit=crop&q=80',
    tag: 'Student Living',
  },
  {
    id: 'sports',
    title: 'Olympic-Standard Indoor Sports Stadium',
    location: 'Sports & Athletics Complex',
    desc: 'Features world-class badminton courts, squash arenas, basketball pavilions, and a heated Olympic swimming pool.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1000&auto=format&fit=crop&q=80',
    tag: 'Athletics & Fitness',
  },
  {
    id: 'hospital',
    title: 'Uni-Hospital 24/7 Medical Care',
    location: 'Medical Block · Opposite Block 34',
    desc: 'Fully equipped multispecialty hospital with resident physicians, emergency ICU, diagnostic labs, and ambulances.',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1000&auto=format&fit=crop&q=80',
    tag: 'Health & Safety',
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
    <div className="bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen transition-colors duration-300">
      {/* ── Official Institutional Announcement Banner ── */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white text-xs py-2 px-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 font-semibold">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-white animate-pulse" />
            <span className="tracking-wide">
              <strong>Admissions 2026-27:</strong> NAAC A++ (Score 3.68/4) · LPUNEST &amp; Merit Scholarships Open Across All 44 Programmes.
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => go('admissions')}
              className="hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Application Checklist</span>
              <ChevronRight size={12} />
            </button>
            <span className="hidden sm:inline">|</span>
            <button
              onClick={() => go('contact')}
              className="hover:underline hidden sm:inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Admissions Block 30 Helpline</span>
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          SECTION 1: PRODUCTION HERO SECTION
      ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-16">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Institutional Crest + Authority Badge + Unofficial Project Notice */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
                <Award size={14} className="text-orange-600 dark:text-orange-400" />
                <span>NAAC A++ Accredited · NIRF Top 30 · Student-Developed (Unofficial)</span>
              </div>

              {/* Exact Requested Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Lovely Professional University Student Helpdesk
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                The centralized portal for prospective and enrolled students of Lovely Professional University. Access verified tuition fees, 50% merit scholarships, hostel booking guides, curriculum syllabi, and 24/7 AI-assisted inquiry resolution.
              </p>

              {/* Instant Search Bar */}
              <form onSubmit={handleHeroSearch} className="max-w-xl">
                <div className="relative flex items-center rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm p-1.5 focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 transition-all">
                  <Search size={18} className="text-slate-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={quickQuery}
                    onChange={(e) => setQuickQuery(e.target.value)}
                    placeholder="Ask anything: e.g. B.Tech CSE fee, 50% scholarship, hostel AC rooms..."
                    className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs cursor-pointer transition-all hover:brightness-105 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                    }}
                  >
                    <Sparkles size={13} />
                    <span>Ask AI</span>
                  </button>
                </div>
              </form>

              {/* Quick Inquiry Filter Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-slate-400 dark:text-slate-500 font-semibold">Popular queries:</span>
                {[
                  'B.Tech CSE Fee',
                  '50% Scholarship',
                  'Hostel Room Charges',
                  'Compare Degrees',
                  'DSR Block 29',
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => {
                      if (chip === 'Compare Degrees') {
                        onOpenCompare && onOpenCompare();
                      } else {
                        ask(`Tell me details about ${chip} at LPU`);
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => go('programs')}
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md cursor-pointer transition-all hover:brightness-105 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                  }}
                >
                  <GraduationCap size={16} />
                  <span>Browse 44 Programmes</span>
                </button>

                <button
                  onClick={() => go('fees')}
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 cursor-pointer transition-all"
                >
                  <Wallet size={15} className="text-orange-500" />
                  <span>Tuition &amp; Slabs Calculator</span>
                </button>

                {onOpenCompare && (
                  <button
                    onClick={() => onOpenCompare()}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-xs sm:text-sm font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 hover:bg-orange-100 transition-all cursor-pointer"
                  >
                    <Scale size={15} />
                    <span>Compare Degrees</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right: Authentic Real LPU Campus Showcase (5 Cols) */}
            <div className="lg:col-span-5 relative space-y-4">
              {/* Primary Real Photo: Grand Entrance */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 group">
                <img
                  src="/images/lpu-campus-entrance.jpg"
                  alt="Lovely Professional University Iconic Grand Entrance Landmark on GT Road"
                  className="w-full h-64 sm:h-72 object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

                <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-orange-600/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                    Campus Landmark
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 text-slate-200 text-[10px] font-semibold backdrop-blur-md border border-white/20">
                    Phagwara, Punjab
                  </span>
                </div>

                <div className="absolute bottom-3.5 left-4 right-4">
                  <h3 className="font-display font-bold text-white text-base leading-snug">
                    Iconic Grand Entrance &amp; Sunburst Monument
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Main Gate 1 along Jalandhar-Delhi G.T. Road (NH-1)
                  </p>
                </div>
              </div>

              {/* Secondary Real Photo: Admissions Block 30 (Chancellery) */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 bg-slate-900 group">
                <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800/95">
                  <img
                    src="/images/lpu-campus-academic.png"
                    alt="LPU Central Admissions Block 30 Chancellery"
                    className="w-24 h-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                      Admissions Division
                    </span>
                    <h4 className="font-display font-bold text-xs text-slate-900 dark:text-white truncate mt-0.5">
                      Block 30 Chancellery Building
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      Counselling, LPUNEST desk &amp; Document verification
                    </p>
                  </div>
                  <button
                    onClick={() => go('contact')}
                    className="shrink-0 p-2 text-slate-400 hover:text-orange-600"
                    title="View office contacts"
                  >
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Verified Institutional Credentials Strip ── */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'NAAC Accreditation', value: 'A++ Grade', sub: 'Highest CGPA 3.68/4 in North India' },
              { label: 'Ministry of Education', value: 'NIRF Top 30', sub: 'Top multidisciplinary university rank' },
              { label: 'Ultra-Modern Campus', value: '600+ Acres', sub: 'Smart hi-tech residential township' },
              { label: 'Top Global Recruiters', value: '₹3 Cr Highest', sub: '2000+ top firms (Google, Microsoft)' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 text-left"
              >
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {stat.label}
                </p>
                <p className="text-xl sm:text-2xl font-extrabold font-display text-slate-900 dark:text-white mt-1">
                  {stat.value}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 2: CORE STUDENT SERVICES & HELPDESK SECTIONS
      ────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-[#F8FAFC] dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                Institutional Portals
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white mt-1">
                Student &amp; Admission Services
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                Direct access to university admission guidelines, official fees, degree comparison tools, and departmental desks.
              </p>
            </div>

            {onOpenCompare && (
              <button
                onClick={() => onOpenCompare()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 hover:bg-orange-100 transition-colors cursor-pointer self-start md:self-auto"
              >
                <Scale size={14} />
                <span>Launch Degree Comparison Tool</span>
              </button>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Academic Programmes',
                desc: 'Explore 44 verified degree programs spanning Engineering, Management, Law, Pharmacy, Design & Agriculture.',
                icon: GraduationCap,
                tag: '44 Programmes',
                action: () => go('programs'),
                btnText: 'View All Programmes',
              },
              {
                title: 'Tuition Fees & Scholarships',
                desc: 'Official per-semester tuition (CSE Core ₹1,60,000, AI/ML ₹2,00,000) with interactive LPUNEST 50% waiver calculations.',
                icon: Wallet,
                tag: 'Fee Calculator',
                action: () => go('fees'),
                btnText: 'Calculate Net Fees',
              },
              {
                title: 'Degree Comparison Matrix',
                desc: 'Compare up to 4 degrees side-by-side with eligibility, fees, curriculum focus, and 1-click AI Deep Analysis.',
                icon: Scale,
                tag: 'Side-by-Side',
                action: () => (onOpenCompare ? onOpenCompare() : go('programs')),
                btnText: 'Compare Degrees',
              },
              {
                title: 'Hostels, Dining & Living',
                desc: '1-to-4 seater AC/Air-cooled rooms (₹83,000-₹1,53,000/yr), 4-meals/day mess plans (₹40,000/yr), and automated laundry.',
                icon: BedDouble,
                tag: 'Uni-Living',
                action: () => go('hostel'),
                btnText: 'Hostel Charges',
              },
              {
                title: 'Division of Student Relations',
                desc: 'DSR Block 29 Room 102 helpline for student identity cards, gate passes, bonafide certificates, and student welfare.',
                icon: Building2,
                tag: 'Block 29 Desk',
                action: () => go('contact'),
                btnText: 'DSR Coordinates',
              },
              {
                title: 'Central Admissions Desk',
                desc: 'Block 30 Chancellery toll-free 1800 102 4431 / 1800 274 0615 and WhatsApp +91-98762-98762 for live counselling.',
                icon: PhoneCall,
                tag: 'Block 30 Toll-Free',
                action: () => go('contact'),
                btnText: 'Contact Admissions',
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  onClick={card.action}
                  className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-900/60 group-hover:scale-105 transition-transform">
                        <Icon size={20} />
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {card.tag}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-base text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-orange-600 dark:text-orange-400">
                    <span>{card.btnText}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 3: REAL LPU CAMPUS LIFE & INFRASTRUCTURE
      ────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Campus Tour &amp; Landmarks
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white mt-1">
              Explore Lovely Professional University Campus
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Situated across 600+ sprawling acres in Phagwara, Punjab on the Jalandhar-Delhi G.T. Road, LPU integrates cutting-edge academic architecture, residential townships, and research hubs.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CAMPUS_HIGHLIGHTS.map((item) => (
              <div
                key={item.id}
                className="group rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-md border border-white/20">
                      {item.tag}
                    </span>
                  </div>

                  <div className="p-5">
                    <p className="text-[11px] font-semibold text-orange-600 dark:text-orange-400">
                      {item.location}
                    </p>
                    <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white mt-1 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2">
                  <button
                    onClick={() => ask(`Tell me more about ${item.title} at LPU`)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer"
                  >
                    <span>Inquire about this landmark</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 4: DIRECT 24/7 AI ADMISSION ASSISTANT BANNER
      ────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-[#F8FAFC] dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl bg-gradient-to-br from-orange-50/90 via-white to-amber-50/80 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 text-slate-900 dark:text-white p-8 sm:p-12 shadow-xl border border-orange-200/80 dark:border-slate-800 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 transition-colors">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/15 dark:bg-orange-600/30 border border-orange-500/30 dark:border-orange-500/40 text-orange-600 dark:text-orange-400 text-xs font-bold">
                <Sparkles size={14} />
                <span>Instant University Guidance Engine</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight text-slate-900 dark:text-white">
                Have specific admission, fees, or living queries?
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Skip waiting in phone queues. The AI Helpdesk provides instant, verified answers trained on all official Lovely Professional University academic regulations, LPUNEST criteria, and residential policies.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={() => go('chat')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-md cursor-pointer transition-all hover:brightness-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                }}
              >
                <Sparkles size={16} />
                <span>Open Instant AI Chat</span>
              </button>

              <button
                onClick={() => go('contact')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-xs"
              >
                <span>Department Directory</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
