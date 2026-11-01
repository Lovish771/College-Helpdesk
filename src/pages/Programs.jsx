import { useState, useMemo } from 'react';
import {
  Search, ArrowRight, X, CheckCircle2, Award, Briefcase, GraduationCap,
  Clock, ShieldCheck, Building2, BookOpen, ChevronRight, ArrowLeft,
  Sparkles, Wallet, Filter, Check, Scale, Layers, ChevronDown, CheckSquare,
  Cpu, Code, Terminal, HeartPulse, Sprout, Landmark, Trophy, LayoutGrid, List,
  Activity, ChevronsUpDown
} from 'lucide-react';
import { programs, fees } from '../data/mockData';
import ProgramCard from '../components/ProgramCard';
import ProgramsCarousel from '../components/ProgramsCarousel';
import { PROGRAM_IMAGES } from '../data/programImages';

// Academic Schools / Faculties representing LPU's institutional hierarchy
const ACADEMIC_SCHOOLS = [
  {
    id: 'school-cse',
    name: 'School of Computer Science & Engineering',
    short: 'CSE & AI',
    badge: 'NBA & NAAC A++ • Highest Placement Packages',
    description: 'India’s premier computing hub for Artificial Intelligence, Data Science, Cyber Security, Cloud Computing, and Full Stack Engineering.',
    programPrefixes: ['btech-cse', 'btech-aiml', 'btech-ds', 'btech-cyber', 'btech-cloud', 'btech-fullstack', 'btech-spe', 'btech-iot', 'btech-devops'],
  },
  {
    id: 'school-core-engg',
    name: 'School of Core Engineering & Technology',
    short: 'Core Engineering',
    badge: 'World-Class Robotics & EV Technology Labs',
    description: 'Interdisciplinary engineering tracks in Electronics, Mechanical Systems, Aerospace Drones, Civil Infrastructure, and Biotechnology.',
    programPrefixes: ['btech-ece', 'btech-me', 'btech-civil', 'btech-aero', 'btech-biotech'],
  },
  {
    id: 'school-ca',
    name: 'School of Computer Applications',
    short: 'Computer Applications',
    badge: 'Hands-on Software Development & Web Architecture',
    description: 'Industry-aligned programs in enterprise software development, database architecture, and full-stack systems engineering.',
    programPrefixes: ['bca', 'mca'],
  },
  {
    id: 'school-business',
    name: 'Mittal School of Business & Commerce',
    short: 'Mittal Business School',
    badge: 'ACBSP (USA) Accredited • Top 32 in Management',
    description: 'Globally benchmarked management education with live equity trading lab, startup incubators, and Fortune 500 corporate mentors.',
    programPrefixes: ['bba', 'mba', 'bcom'],
  },
  {
    id: 'school-health',
    name: 'School of Pharmaceutical & Healthcare Sciences',
    short: 'Pharmacy & Healthcare',
    badge: 'PCI Approved • Hospital Tie-ups',
    description: 'Clinical research, drug design, pharmacology, kinesiology, and sports injury physical therapy.',
    programPrefixes: ['bpharm', 'bpt'],
  },
  {
    id: 'school-sciences',
    name: 'School of Agriculture & Applied Sciences',
    short: 'Agriculture & Sciences',
    badge: 'ICAR Accredited (India’s 1st Private Agri School)',
    description: 'Research over 1,000+ acres of agricultural farms, precision drone farming, organic production, and forensic laboratories.',
    programPrefixes: ['bsc-agri', 'bsc-forensic'],
  },
  {
    id: 'school-law',
    name: 'School of Law & Legal Studies',
    short: 'School of Law',
    badge: 'Bar Council of India (BCI) Approved',
    description: 'Constitutional law, corporate compliance, cyber jurisprudence, intellectual property rights, and state-of-the-art moot courts.',
    programPrefixes: ['ba-llb', 'bba-llb'],
  },
];

const DEGREE_LEVELS = ['All Degrees', 'Undergraduate', 'Postgraduate'];

// Detailed Program View
function ProgramDetailsView({ p, onBack, ask, onOpenCompare }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Eligibility & Admissions', 'Fee & Scholarship Slabs', 'Curriculum', 'Placements'];

  const f = fees[p.id] || {
    tuition: '₹1,60,000 / semester (Base)',
    other: '₹5,000 / semester (Examination Fee)',
    hostel: 'Air-Cooled: ₹83,000 - ₹1,13,000 / yr | AC: ₹93,000 - ₹1,53,000 / yr',
    scholarship: 'Category I: up to 50% waiver | Cat II: up to 40% | Cat III: up to 30%',
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-16 transition-colors">
      {/* Top Breadcrumb Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer"
          >
            <ArrowLeft size={15} />
            <span>Back to All Programmes</span>
          </button>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
            Programme Code: <code className="text-slate-600 dark:text-slate-300 font-mono font-bold">{p.id}</code>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {/* Hero Banner for Program */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-800 bg-slate-950 text-white">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-35 mix-blend-luminosity scale-105"
            style={{
              backgroundImage: `url(${PROGRAM_IMAGES[p.id] || PROGRAM_IMAGES['btech-cse']})`,
            }}
          />
          <div className="absolute inset-0 bg-slate-950/80" />

          <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="rounded-lg bg-orange-600 text-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider">
                  {p.short}
                </span>
                <span className="rounded-lg bg-white/10 backdrop-blur-md text-white border border-white/20 px-2.5 py-1 text-[11px] font-semibold">
                  {p.degree}
                </span>
                <span className="rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-1 text-[11px] font-semibold">
                  {p.duration}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display leading-tight text-white">
                {p.name}
              </h1>

              <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-2xl line-clamp-2">
                {p.description}
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              {onOpenCompare && (
                <button
                  onClick={() => onOpenCompare([p.id])}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
                >
                  <Scale size={14} />
                  <span>Compare Degree</span>
                </button>
              )}
              <button
                onClick={() => ask(`I want to apply for ${p.name}. What is the eligibility, LPUNEST cutoff, and scholarship slabs?`)}
                className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold cursor-pointer"
              >
                <span>Ask AI About Admissions</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 border-b border-slate-200 dark:border-slate-800 mt-6 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-colors">
          {activeTab === 'Overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-2">Programme Summary</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{p.description}</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Duration</span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white mt-1 block">{p.duration}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Academic Level</span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white mt-1 block">{p.degree}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Semester Base Fee</span>
                  <span className="text-base font-extrabold text-orange-600 dark:text-orange-400 mt-1 block">{f.tuition.split(' ')[0]} / sem</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Eligibility & Admissions' && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Minimum Qualifying Criteria</h3>
              <div className="p-5 rounded-2xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                  {p.eligibility}
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Accepted Entrance Exams</p>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">LPUNEST / JEE Main / CUET</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Minimum Aggregate Marks</p>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">{p.minPercent}% in Qualifying Exam</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Fee & Scholarship Slabs' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Tuition and LPUNEST Scholarships</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">Category I Scholarship</span>
                  <span className="text-xl font-extrabold text-emerald-800 dark:text-emerald-200 mt-1 block">Up to 50% Waiver</span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">For LPUNEST 95%+ or 95%+ in qualifying examination.</p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                  <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300 uppercase tracking-wider block">Category II Scholarship</span>
                  <span className="text-xl font-extrabold text-amber-800 dark:text-amber-200 mt-1 block">Up to 40% Waiver</span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">For LPUNEST 90% - 94.9%.</p>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                  <span className="text-xs font-extrabold text-blue-700 dark:text-blue-300 uppercase tracking-wider block">Category III Scholarship</span>
                  <span className="text-xl font-extrabold text-blue-800 dark:text-blue-200 mt-1 block">Up to 30% Waiver</span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">For LPUNEST 80% - 89.9%.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Curriculum' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Curriculum Framework</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Organized into Autumn Term (August-December) and Spring Term (January-June) with continuous assessment (CA), mid-term examinations, and lab practicums.
              </p>
              <button
                onClick={() => ask(`Give me the semester-wise subjects and credit breakdown for ${p.name}`)}
                className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
              >
                <Sparkles size={14} />
                <span>Ask AI for Full Semester Syllabus</span>
              </button>
            </div>
          )}

          {activeTab === 'Placements' && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Corporate Placements &amp; Career Trajectory</h3>
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  LPU graduates from this programme are recruited by top Fortune 500 corporations including Google, Microsoft, Amazon, Cognizant, Infosys, Capgemini, and Deloitte.
                </p>
                <p className="text-xs font-bold text-orange-600 dark:text-orange-400 mt-3">
                  Highest Package: Up to ₹3 Crore (International) / ₹64 LPA (Domestic)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Programs({ ask, onOpenCompare }) {
  const [q, setQ] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState('all');
  const [selectedDegree, setSelectedDegree] = useState('All Degrees');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [compareQueue, setCompareQueue] = useState([]);
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState('moving'); // 'moving' | 'grid'

  // Map each program to an Academic School
  const getProgramSchool = (p) => {
    for (const school of ACADEMIC_SCHOOLS) {
      if (school.programPrefixes.some((prefix) => p.id.startsWith(prefix))) {
        return school;
      }
    }
    // Fallback based on tags
    if (p.tags?.includes('Computer Science')) return ACADEMIC_SCHOOLS[0];
    if (p.tags?.includes('Engineering')) return ACADEMIC_SCHOOLS[1];
    if (p.tags?.includes('Management') || p.tags?.includes('Commerce')) return ACADEMIC_SCHOOLS[3];
    if (p.tags?.includes('Pharmacy') || p.tags?.includes('Medical')) return ACADEMIC_SCHOOLS[4];
    if (p.tags?.includes('Agriculture') || p.tags?.includes('Science')) return ACADEMIC_SCHOOLS[5];
    if (p.tags?.includes('Law')) return ACADEMIC_SCHOOLS[6];
    return ACADEMIC_SCHOOLS[0];
  };

  // Filtered Programs
  const filtered = useMemo(() => {
    return programs.filter((p) => {
      // Degree match
      const matchDegree =
        selectedDegree === 'All Degrees' ||
        (selectedDegree === 'Undergraduate' && p.degree === 'Undergraduate') ||
        (selectedDegree === 'Postgraduate' && p.degree === 'Postgraduate');

      // School match
      const pSchool = getProgramSchool(p);
      const matchSchool =
        selectedSchoolId === 'all' || pSchool.id === selectedSchoolId;

      // Query match
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.short.toLowerCase().includes(q.toLowerCase()) ||
        p.description.toLowerCase().includes(q.toLowerCase()) ||
        pSchool.name.toLowerCase().includes(q.toLowerCase());

      return matchDegree && matchSchool && matchQuery;
    });
  }, [q, selectedSchoolId, selectedDegree]);

  // Sorted list according to current sort criteria
  const sortedFiltered = useMemo(() => {
    const list = [...filtered];
    if (sortBy === 'fee-asc') {
      list.sort((a, b) => {
        const feeA = parseInt((fees[a.id]?.tuition || '').replace(/[^0-9]/g, '')) || 200000;
        const feeB = parseInt((fees[b.id]?.tuition || '').replace(/[^0-9]/g, '')) || 200000;
        return feeA - feeB;
      });
    } else if (sortBy === 'fee-desc') {
      list.sort((a, b) => {
        const feeA = parseInt((fees[a.id]?.tuition || '').replace(/[^0-9]/g, '')) || 200000;
        const feeB = parseInt((fees[b.id]?.tuition || '').replace(/[^0-9]/g, '')) || 200000;
        return feeB - feeA;
      });
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [filtered, sortBy]);

  // 3-Column distribution for vertical moving card stream
  const col1 = useMemo(() => sortedFiltered.filter((_, i) => i % 3 === 0), [sortedFiltered]);
  const col2 = useMemo(() => sortedFiltered.filter((_, i) => i % 3 === 1), [sortedFiltered]);
  const col3 = useMemo(() => sortedFiltered.filter((_, i) => i % 3 === 2), [sortedFiltered]);

  // Group programs by School for hierarchical display
  const groupedBySchool = useMemo(() => {
    const map = {};
    ACADEMIC_SCHOOLS.forEach((school) => {
      map[school.id] = {
        school,
        programs: [],
      };
    });

    filtered.forEach((p) => {
      const s = getProgramSchool(p);
      if (map[s.id]) {
        map[s.id].programs.push(p);
      }
    });

    return Object.values(map).filter((group) => group.programs.length > 0);
  }, [filtered]);

  const handleToggleCompareQueue = (id) => {
    setCompareQueue((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const handleLaunchComparison = () => {
    if (compareQueue.length > 0 && onOpenCompare) {
      onOpenCompare(compareQueue);
    }
  };

  if (selectedProgram) {
    return (
      <ProgramDetailsView
        p={selectedProgram}
        onBack={() => setSelectedProgram(null)}
        ask={ask}
        onOpenCompare={onOpenCompare}
      />
    );
  }

  const activeFilterCount =
    (selectedSchoolId !== 'all' ? 1 : 0) +
    (selectedDegree !== 'All Degrees' ? 1 : 0) +
    (q.trim() ? 1 : 0);

  const handleResetFilters = () => {
    setQ('');
    setSelectedSchoolId('all');
    setSelectedDegree('All Degrees');
  };

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors pb-24">
      
      {/* ── Institutional Header Banner (matches white on white theme, dark on dark theme) ── */}
      <div className="relative bg-white dark:bg-[#070B14] text-slate-900 dark:text-white pt-6 sm:pt-8 pb-8 sm:pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-slate-200 dark:border-slate-800/80 transition-colors">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-25 mix-blend-luminosity scale-105 pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&auto=format&fit=crop&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-orange-50/40 dark:from-[#070B14] dark:via-[#070B14]/85 dark:to-[#070B14]/90 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            {/* Pill: Explore Your Future */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-500/40 text-orange-600 dark:text-orange-400 text-xs font-bold mb-2.5 shadow-2xs">
              <Sparkles size={12} className="text-orange-500" />
              <span>Explore Your Future</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-tight">
              Programmes <span className="text-orange-500">&amp;</span> Specializations
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed font-sans">
              Explore 44 industry-aligned undergraduate and postgraduate programs across computing, engineering, management, and healthcare.
            </p>

            {/* Compact Search Input Bar */}
            <div className="mt-5 max-w-xl relative flex items-center bg-slate-50 dark:bg-[#0B101D]/90 border border-slate-200 dark:border-slate-700/80 rounded-full pl-4 pr-1.5 py-1 shadow-sm dark:shadow-xl focus-within:border-orange-500/60 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
              <Search size={16} className="text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={q}
                maxLength={100}
                onChange={(e) => setQ(e.target.value.slice(0, 100))}
                placeholder="Search by degree name, specialization, or school (e.g. AI & ML, B.Tech, MBA)..."
                aria-label="Search programmes by name or discipline"
                className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none font-sans"
              />
              {q && (
                <button
                  onClick={() => setQ('')}
                  aria-label="Clear search input"
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white mr-1 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 flex items-center justify-center text-white shrink-0 shadow-sm transition-all active:scale-95 cursor-pointer ml-1"
                aria-label="Submit search"
              >
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Right Floating Card: LPU-NEST Scholarships */}
          <div className="hidden lg:flex flex-col p-5 rounded-2xl bg-white dark:bg-[#0D1322]/80 border border-slate-200 dark:border-white/10 max-w-xs xl:max-w-sm shadow-sm dark:shadow-xl shrink-0">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                <Trophy size={20} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">LPU-NEST Scholarships</h4>
                <p className="text-[11px] text-orange-600 dark:text-orange-400 font-semibold mt-0.5">Phase 1 Admissions Open</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              Up to 50% tuition fee waiver based on national test performance across all technical programs.
            </p>
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Category 1 Benefits</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">₹1,00,000+ Waiver</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Interactive Sticky Filter Drawer / Pill Bar ── */}
      <div className="sticky top-16 z-20 backdrop-blur-md bg-white/95 dark:bg-[#080D1A]/95 border-b border-slate-200/90 dark:border-slate-800 shadow-sm transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 space-y-2.5">
          {/* Row 1: Filter by: School Category Pills + Compare Degree Button */}
          <div className="flex items-center justify-between gap-3">
            <div
              className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none max-w-full"
              role="tablist"
              aria-label="Academic Faculty Filter Pills"
            >
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap shrink-0 mr-1">
                Filter by:
              </span>

              <button
                role="tab"
                aria-selected={selectedSchoolId === 'all'}
                onClick={() => setSelectedSchoolId('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-orange-500 ${
                  selectedSchoolId === 'all'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-transparent dark:border-slate-700/60'
                }`}
              >
                All Schools ({programs.length})
              </button>

              {ACADEMIC_SCHOOLS.map((school) => {
                const active = selectedSchoolId === school.id;
                const count = programs.filter((p) => getProgramSchool(p).id === school.id).length;
                return (
                  <button
                    key={school.id}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedSchoolId(school.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-orange-500 ${
                      active
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-transparent dark:border-slate-700/60'
                    }`}
                  >
                    <span>{school.short}</span>
                    <span
                      className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                        active ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Compare Degrees Button on right */}
            {onOpenCompare && (
              <button
                type="button"
                onClick={() => onOpenCompare(compareQueue.length > 0 ? compareQueue : ['btech-cse', 'btech-aiml'])}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors cursor-pointer shrink-0 shadow-2xs"
              >
                <Scale size={13} />
                <span>Compare ({compareQueue.length > 0 ? compareQueue.length : 2})</span>
              </button>
            )}
          </div>

          {/* Row 2: Degree Level Filter Pills */}
          <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800/80 text-xs font-sans">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">
                Degree Level:
              </span>
              {DEGREE_LEVELS.map((deg) => {
                const active = selectedDegree === deg;
                return (
                  <button
                    key={deg}
                    onClick={() => setSelectedDegree(deg)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 ${
                      active
                        ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {deg}
                  </button>
                );
              })}
            </div>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
              >
                <X size={12} />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Catalog Container ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">

        {/* Section Header Toolbar (matches new_design.png) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Showing {sortedFiltered.length} of {programs.length} Programmes
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort by dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              >
                <option value="popularity">Popularity</option>
                <option value="fee-asc">Fee: Low to High</option>
                <option value="fee-desc">Fee: High to Low</option>
                <option value="name">Alphabetical (A-Z)</option>
              </select>
            </div>

            {/* View Mode Switcher: Moving Stream vs Static Grid */}
            <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('moving')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'moving'
                    ? 'bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Moving Stream Transition (Hover to Pause & 3D Uplift)"
                aria-label="Moving Stream"
              >
                <ChevronsUpDown size={14} className="text-orange-500" />
                <span className="hidden sm:inline">Moving Stream</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Static 3-Column Grid View"
                aria-label="Static Grid View"
              >
                <LayoutGrid size={14} />
                <span className="hidden sm:inline">Static Grid</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Content: Program Cards with Vertical Moving Transition or Static Grid ── */}
        {sortedFiltered.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
            <div className="h-12 w-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center mx-auto mb-3">
              <Search size={22} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">No matching programmes found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              We couldn't find any courses matching "{q}". Try clearing your filters or search for another faculty.
            </p>
            <button
              onClick={() => { setQ(''); setSelectedSchoolId('all'); setSelectedDegree('All Degrees'); }}
              className="mt-4 px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === 'moving' ? (
          /* ── Infinite Vertical Moving Streams (Slow speed, pauses on hover with 3D uplift) ── */
          <div className="vertical-stream-group relative h-[680px] overflow-hidden rounded-2xl p-1">
            {/* Top & Bottom gradient fade masks for smooth infinite visual feel */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#F8FAFC] dark:from-slate-950 to-transparent z-10" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F8FAFC] dark:from-slate-950 to-transparent z-10" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
              {/* Column 1 (Scrolls Up slowly) */}
              <div className="overflow-hidden h-full">
                <div className="animate-vertical-up space-y-6 pb-6">
                  {(col1.length > 0 ? [...col1, ...col1] : sortedFiltered).map((p, idx) => (
                    <ProgramCard
                      key={`col1-${p.id}-${idx}`}
                      p={p}
                      onView={(prog) => setSelectedProgram(prog)}
                      onAsk={ask}
                      onCompare={(id) => handleToggleCompareQueue(id)}
                      isSelected={compareQueue.includes(p.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Column 2 (Scrolls Down / Alternating) */}
              <div className="overflow-hidden h-full hidden md:block">
                <div className="animate-vertical-down space-y-6 pb-6">
                  {(col2.length > 0 ? [...col2, ...col2] : sortedFiltered).map((p, idx) => (
                    <ProgramCard
                      key={`col2-${p.id}-${idx}`}
                      p={p}
                      onView={(prog) => setSelectedProgram(prog)}
                      onAsk={ask}
                      onCompare={(id) => handleToggleCompareQueue(id)}
                      isSelected={compareQueue.includes(p.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Column 3 (Scrolls Up gently) */}
              <div className="overflow-hidden h-full hidden lg:block">
                <div className="animate-vertical-up-slow space-y-6 pb-6">
                  {(col3.length > 0 ? [...col3, ...col3] : sortedFiltered).map((p, idx) => (
                    <ProgramCard
                      key={`col3-${p.id}-${idx}`}
                      p={p}
                      onView={(prog) => setSelectedProgram(prog)}
                      onAsk={ask}
                      onCompare={(id) => handleToggleCompareQueue(id)}
                      isSelected={compareQueue.includes(p.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ── Static 3-Column Grid View ── */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedFiltered.map((p) => (
              <ProgramCard
                key={p.id}
                p={p}
                onView={(prog) => setSelectedProgram(prog)}
                onAsk={ask}
                onCompare={(id) => handleToggleCompareQueue(id)}
                isSelected={compareQueue.includes(p.id)}
              />
            ))}
          </div>
        )}

      </div>

      {/* ── Floating Degree Comparison Drawer (Appears when degrees are selected) ── */}
      {compareQueue.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-slide-up">
          <div className="bg-slate-900/95 text-white backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <span className="p-2 rounded-xl bg-orange-600 text-white shrink-0">
                <Scale size={16} />
              </span>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">
                  {compareQueue.length} {compareQueue.length === 1 ? 'Degree' : 'Degrees'} in Compare Queue
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  Compare side-by-side in real time
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setCompareQueue([])}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Clear queue"
              >
                <X size={15} />
              </button>
              <button
                onClick={handleLaunchComparison}
                className="btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                <span>Compare ({compareQueue.length})</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
