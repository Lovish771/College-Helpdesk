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
import { getProgramEnrichment } from '../data/programDetails';
import { PROGRAM_COMPARISON_DATA } from '../data/programComparisonData';
import { getMainDegree, getDegreeTheme } from '../utils/degreeUtils';

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

const getProgramType = (p) => {
  const name = (p.name || '').toUpperCase();
  const short = (p.short || '').toUpperCase();
  if (name.includes('B.TECH') || short.includes('B.TECH')) return 'B.Tech';
  if (name.includes('BCA') || short.includes('BCA')) return 'BCA';
  if (name.includes('B.SC') || short.includes('B.SC')) return 'B.Sc';
  if (name.includes('BBA') || short.includes('BBA')) return 'BBA';
  if (name.includes('B.COM') || short.includes('B.COM')) return 'B.Com';
  if (name.includes('PHARM') || name.includes('PHYSIOTHERAPY')) return p.degree === 'Postgraduate' ? 'M.Pharm' : 'B.Pharm';
  if (name.includes('LL.B') || name.includes('LL.M') || name.includes('LAW')) return p.degree === 'Postgraduate' ? 'LL.M' : 'Law';
  if (name.includes('DESIGN') || name.includes('ARCH') || name.includes('ANIMATION')) return 'Design & Arch';
  if (name.includes('MBA') || short.includes('MBA')) return 'MBA';
  if (name.includes('MCA') || short.includes('MCA')) return 'MCA';
  if (name.includes('M.TECH') || short.includes('M.TECH')) return 'M.Tech';
  if (name.includes('M.SC') || short.includes('M.SC')) return 'M.Sc';
  return 'Other';
};

const UG_DEGREE_TYPES = ['All Degrees', 'B.Tech', 'BCA', 'B.Sc', 'BBA', 'B.Com', 'B.Pharm', 'Law', 'Design & Arch'];
const PG_DEGREE_TYPES = ['All Degrees', 'MBA', 'MCA', 'M.Tech', 'M.Sc', 'M.Pharm', 'LL.M'];
const ALL_DEGREE_TYPES = ['All Degrees', 'B.Tech', 'BCA', 'B.Sc', 'BBA', 'B.Com', 'MBA', 'MCA', 'M.Tech', 'M.Sc', 'Law', 'Design & Arch'];


// Detailed Program View (Comprehensive, Lists All Degree Details)
function ProgramDetailsView({ p, onBack, ask, onOpenCompare }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview & Pathways', 'Curriculum & Semester 1', 'Placements & Recruiters', 'Eligibility & Criteria', 'Fee & Scholarships'];

  const mainDeg = getMainDegree(p);
  const theme = getDegreeTheme(mainDeg);
  const enrichment = getProgramEnrichment(p.id) || {};
  const compData = PROGRAM_COMPARISON_DATA[p.id] || {};

  const f = fees[p.id] || {
    tuition: '₹1,60,000 / semester (Base)',
    other: '₹5,000 / semester (Examination Fee)',
    hostel: 'Air-Cooled: ₹83,000 - ₹1,13,000 / yr | AC: ₹93,000 - ₹1,53,000 / yr',
    scholarship: 'Category I: up to 50% waiver | Cat II: up to 40% | Cat III: up to 30%',
  };

  const rawTuition = parseInt((f.tuition || '₹1,60,000').replace(/[^0-9]/g, ''), 10) || 160000;
  const semFeeStr = `₹${rawTuition.toLocaleString('en-IN')}`;
  const annualFeeStr = `₹${(rawTuition * 2).toLocaleString('en-IN')}`;
  const cat1Fee = `₹${Math.round(rawTuition * 0.5).toLocaleString('en-IN')}`;
  const cat2Fee = `₹${Math.round(rawTuition * 0.6).toLocaleString('en-IN')}`;
  const cat3Fee = `₹${Math.round(rawTuition * 0.7).toLocaleString('en-IN')}`;

  const semester1Courses = enrichment.semester1Subjects || [
    { code: 'CSE101', name: 'Computer Programming & Problem Solving', credits: 4, type: 'Core' },
    { code: 'CSE111', name: 'Software Foundations Practicum', credits: 1, type: 'Lab' },
    { code: 'MTH165', name: 'Mathematics & Statistical Foundations', credits: 4, type: 'Core' },
    { code: 'PHY110', name: 'Engineering Physics & Systems', credits: 3, type: 'Core' },
    { code: 'PEL121', name: 'Corporate Communication & Soft Skills', credits: 2, type: 'Skill' },
  ];

  const careerRoles = enrichment.careerTracks || compData.careerRoles || [
    'Software Development Engineer (SDE)', 'Systems Architect', 'Full Stack Developer', 'Data Specialist'
  ];

  const techStack = compData.techStack || ['Linux', 'Git', 'Cloud Platforms', 'SQL', 'Modern Frameworks'];
  const languages = compData.languages || ['Python', 'Java', 'C++', 'SQL'];
  const topRecruiters = [
    'Google', 'Microsoft', 'Amazon', 'Cognizant', 'Infosys', 'Capgemini',
    'Deloitte', 'Cisco', 'TCS', 'Wipro', 'IBM', 'Oracle'
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-20 transition-colors">
      {/* Top Breadcrumb Bar */}
      <div className="sticky top-16 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to All Programmes</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Programme ID:</span>
            <code className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {p.id}
            </code>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Hero Banner for Program */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-25 mix-blend-luminosity scale-105 pointer-events-none"
            style={{
              backgroundImage: `url(${PROGRAM_IMAGES[p.id] || PROGRAM_IMAGES['btech-cse']})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-orange-50/40 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-950/95 pointer-events-none" />

          <div className="relative z-10 p-6 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Shining Main Degree Bar */}
                <div className={`relative inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider overflow-hidden shadow-sm ${theme.glow} select-none`}>
                  <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} opacity-95`} />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-shimmer pointer-events-none" />
                  <GraduationCap size={13} className="relative z-10 text-white drop-shadow-xs" />
                  <span className="relative z-10 text-white font-extrabold tracking-wide drop-shadow-xs">
                    {mainDegree}
                  </span>
                </div>

                <span className="rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-[11px] font-semibold">
                  {p.degree}
                </span>

                <span className="rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-semibold">
                  {p.duration}
                </span>

                {enrichment.nirfBadge && (
                  <span className="rounded-lg bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/20 px-2.5 py-1 text-[11px] font-bold">
                    {enrichment.nirfBadge}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display leading-tight text-slate-900 dark:text-white">
                {p.name}
              </h1>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {p.description}
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-2.5">
              {onOpenCompare && (
                <button
                  type="button"
                  onClick={() => onOpenCompare([p.id])}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-all cursor-pointer shadow-xs"
                >
                  <Scale size={15} className="text-orange-500" />
                  <span>Compare with Another Degree</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => ask(`I want detailed admission information for ${p.name} at LPU. Tell me the eligibility, LPUNEST exam syllabus, fee structures, and scholarship cutoffs.`)}
                className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold cursor-pointer shadow-lg shadow-orange-600/20"
              >
                <span>Ask AI About Admissions</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 no-scrollbar scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview & Pathways */}
        {activeTab === 'Overview & Pathways' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Duration</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white mt-1 block">{p.duration}</span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Academic Level</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white mt-1 block">{p.degree}</span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Base Semester Fee</span>
                <span className="text-base font-extrabold text-orange-600 dark:text-orange-400 mt-1 block">{semFeeStr} / sem</span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Min. Eligibility</span>
                <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">{p.minPercent}% Marks</span>
              </div>
            </div>

            {/* Career Tracks */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Briefcase size={17} className="text-orange-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">Target Career Roles &amp; Profiles</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Graduates from this degree programme are placed into specialized corporate trajectories:</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {careerRoles.map((role) => (
                  <span key={role} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 text-xs font-bold">
                    <CheckCircle2 size={12} className="text-orange-500" />
                    <span>{role}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Tech Stack & Languages */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <Code size={16} />
                  <h4 className="text-sm font-bold font-display">Core Programming Languages</h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {languages.map((lang) => (
                    <span key={lang} className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
                <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
                  <Cpu size={16} />
                  <h4 className="text-sm font-bold font-display">Tools &amp; Industry Frameworks</h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {techStack.map((tech) => (
                    <span key={tech} className="px-2.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 text-xs font-semibold">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Academic Electives & Labs */}
            {compData.coreElectives && (
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white font-display">Key Academic Electives</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{compData.coreElectives}</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Curriculum & Semester 1 */}
        {activeTab === 'Curriculum & Semester 1' && (
          <div className="space-y-6">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">Semester 1 Course Structure</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Official syllabus subjects, laboratory practicums, and credit allocations.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs font-bold self-start sm:self-center">
                  Total ~20 Credits
                </span>
              </div>

              <div className="overflow-x-auto mt-4 no-scrollbar scrollbar-none">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50">
                      <th className="py-3 px-4 font-bold text-slate-900 dark:text-white">Course Code</th>
                      <th className="py-3 px-4 font-bold text-slate-900 dark:text-white">Subject Title</th>
                      <th className="py-3 px-4 font-bold text-orange-600 dark:text-orange-400">Type</th>
                      <th className="py-3 px-4 font-bold text-slate-900 dark:text-white text-right">Credits</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {semester1Courses.map((c) => (
                      <tr key={c.code} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">{c.code}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{c.name || c.title}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            c.type === 'Lab' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
                            c.type === 'Skill' ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300' :
                            'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                          }`}>
                            {c.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white text-right">{c.credits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-500 dark:text-slate-400">Want full syllabus for Semester 2 to 8?</span>
                <button
                  type="button"
                  onClick={() => ask(`Give me the full 8-semester curriculum, total credits, and elective choices for ${p.name}`)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs cursor-pointer shadow-sm transition-all"
                >
                  <Sparkles size={13} />
                  <span>Ask AI for Full 8-Semester Syllabus</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Placements & Recruiters */}
        {activeTab === 'Placements & Recruiters' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                <span className="text-xs text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wider block">Highest International Package</span>
                <strong className="text-xl sm:text-2xl font-extrabold text-emerald-800 dark:text-emerald-200 font-display block">₹3 Crore / annum</strong>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Global Tech Placement</span>
              </div>
              <div className="p-5 rounded-3xl bg-orange-500/10 border border-orange-500/30 space-y-1">
                <span className="text-xs text-orange-700 dark:text-orange-300 font-bold uppercase tracking-wider block">Highest Domestic Package</span>
                <strong className="text-xl sm:text-2xl font-extrabold text-orange-800 dark:text-orange-200 font-display block">₹64 LPA</strong>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Top Tier Corporate Offers</span>
              </div>
              <div className="p-5 rounded-3xl bg-blue-500/10 border border-blue-500/30 space-y-1">
                <span className="text-xs text-blue-700 dark:text-blue-300 font-bold uppercase tracking-wider block">Average Super-Dream Tier</span>
                <strong className="text-xl sm:text-2xl font-extrabold text-blue-800 dark:text-blue-200 font-display block">₹8.5 - 12 LPA</strong>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Tier 1 Recruiters</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">Top Corporate Recruiters</h3>
              <div className="flex flex-wrap gap-2">
                {topRecruiters.map((company) => (
                  <span key={company} className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs">
                    {company}
                  </span>
                ))}
              </div>
              {compData.certifications && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Industry Certifications Integrated</span>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{compData.certifications}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Eligibility & Criteria */}
        {activeTab === 'Eligibility & Criteria' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">Official Qualifying Requirements</h3>
              <div className="p-4 rounded-2xl bg-orange-500/5 dark:bg-orange-950/20 border border-orange-500/20">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">{p.eligibility}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Accepted Entrance Exams</span>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">LPUNEST / JEE Main / CUET</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Minimum Aggregate Percentage</span>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">{p.minPercent}% Marks</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Fee & Scholarships */}
        {activeTab === 'Fee & Scholarships' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Base Tuition (Per Semester)</span>
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-display mt-1 block">{semFeeStr}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">Full Year: {annualFeeStr}</span>
              </div>
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Examination &amp; Admin Fee</span>
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-display mt-1 block">₹5,000 / sem</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">Standard university examination fee</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">LPUNEST Scholarship Concession Slabs</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">Category I (Top Slab)</span>
                  <strong className="text-xl font-extrabold text-emerald-800 dark:text-emerald-200 mt-1 block">Up to 50% Waiver</strong>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium">Net Fee: <strong className="text-emerald-700 dark:text-emerald-300 font-bold">{cat1Fee} / sem</strong></p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                  <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300 uppercase tracking-wider block">Category II Slab</span>
                  <strong className="text-xl font-extrabold text-amber-800 dark:text-amber-200 mt-1 block">Up to 40% Waiver</strong>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium">Net Fee: <strong className="text-amber-700 dark:text-amber-300 font-bold">{cat2Fee} / sem</strong></p>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                  <span className="text-xs font-extrabold text-blue-700 dark:text-blue-300 uppercase tracking-wider block">Category III Slab</span>
                  <strong className="text-xl font-extrabold text-blue-800 dark:text-blue-200 mt-1 block">Up to 30% Waiver</strong>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium">Net Fee: <strong className="text-blue-700 dark:text-blue-300 font-bold">{cat3Fee} / sem</strong></p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default function Programs({ ask, onOpenCompare }) {
  const [q, setQ] = useState('');
  const [level, setLevel] = useState('All'); // 'All' | 'UG' | 'PG'
  const [selectedDegreeType, setSelectedDegreeType] = useState('All');
  const [selectedSchoolId, setSelectedSchoolId] = useState('all');
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
      // Level match
      if (level === 'UG' && p.degree !== 'Undergraduate') return false;
      if (level === 'PG' && p.degree !== 'Postgraduate') return false;

      // Degree Type match
      if (selectedDegreeType !== 'All' && selectedDegreeType !== 'All Degrees') {
        const pType = getProgramType(p);
        if (pType !== selectedDegreeType) return false;
      }

      // School match
      const pSchool = getProgramSchool(p);
      if (selectedSchoolId !== 'all' && pSchool.id !== selectedSchoolId) return false;

      // Query match
      if (q.trim()) {
        const query = q.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesShort = p.short.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesSchool = pSchool.name.toLowerCase().includes(query) || pSchool.short.toLowerCase().includes(query);
        if (!matchesName && !matchesShort && !matchesDesc && !matchesSchool) return false;
      }

      return true;
    });
  }, [q, level, selectedDegreeType, selectedSchoolId]);

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

  const handleViewProgram = (prog) => {
    setSelectedProgram(prog);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
    (level !== 'All' ? 1 : 0) +
    (selectedDegreeType !== 'All' && selectedDegreeType !== 'All Degrees' ? 1 : 0) +
    (selectedSchoolId !== 'all' ? 1 : 0) +
    (q.trim() ? 1 : 0);

  const handleResetFilters = () => {
    setQ('');
    setLevel('All');
    setSelectedDegreeType('All');
    setSelectedSchoolId('all');
  };

  const currentDegreeTypes =
    level === 'UG'
      ? UG_DEGREE_TYPES
      : level === 'PG'
      ? PG_DEGREE_TYPES
      : ALL_DEGREE_TYPES;

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

      {/* ── Unified Search & Filter Control Bar (Matches user attached image) ── */}
      <div className="sticky top-16 z-20 backdrop-blur-md bg-white/95 dark:bg-[#080D1A]/95 border-b border-slate-200/90 dark:border-slate-800 shadow-sm transition-colors py-3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 sm:p-4 shadow-xs space-y-3">
            {/* Row 1: Search Input + Showing count + Compare button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 flex items-center">
                <Search size={15} className="absolute left-3.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by degree title, subject, or short code (e.g. B.Tech, CSE, MBA)..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 font-sans"
                />
                {q && (
                  <button onClick={() => setQ('')} className="absolute right-3 p-1 text-slate-400 hover:text-slate-600">
                    <X size={14} />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Showing <strong className="text-orange-600 dark:text-orange-400 font-bold">{sortedFiltered.length}</strong> of {programs.length} Programmes
                </span>
                {onOpenCompare && (
                  <button
                    type="button"
                    onClick={() => onOpenCompare(compareQueue.length > 0 ? compareQueue : ['btech-cse', 'btech-aiml'])}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 hover:bg-orange-100 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Scale size={13} />
                    <span>Compare ({compareQueue.length > 0 ? compareQueue.length : 2})</span>
                  </button>
                )}
              </div>
            </div>

            {/* Row 2: Level Filter Pills + Disciplines */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none text-xs">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mr-1">
                  LEVEL:
                </span>
                {['All', 'UG', 'PG'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => {
                      setLevel(lvl);
                      setSelectedDegreeType('All');
                    }}
                    className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                      level === lvl
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              <span className="text-slate-300 dark:text-slate-700 shrink-0">|</span>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setSelectedSchoolId('all')}
                  className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedSchoolId === 'all'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  All Disciplines
                </button>
                {ACADEMIC_SCHOOLS.map((school) => {
                  const active = selectedSchoolId === school.id;
                  return (
                    <button
                      key={school.id}
                      onClick={() => setSelectedSchoolId(school.id)}
                      className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                        active
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {school.short}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 3: Degree award types (B.Tech, BCA, B.Sc, BBA, MBA, etc.) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
                DEGREE:
              </span>
              {currentDegreeTypes.map((type) => {
                const active = selectedDegreeType === type || (type === 'All Degrees' && selectedDegreeType === 'All');
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedDegreeType(type === 'All Degrees' ? 'All' : type)}
                    className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      active
                        ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}

              {activeFilterCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer shrink-0"
                >
                  <X size={12} />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
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
                      onView={(prog) => handleViewProgram(prog)}
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
                      onView={(prog) => handleViewProgram(prog)}
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
                      onView={(prog) => handleViewProgram(prog)}
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
                onView={(prog) => handleViewProgram(prog)}
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
