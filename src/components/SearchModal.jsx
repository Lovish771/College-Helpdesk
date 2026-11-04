import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search, X, GraduationCap, Wallet, BedDouble, HelpCircle,
  ArrowRight, Sparkles, BookOpen, Clock, Building2, ChevronRight
} from 'lucide-react';
import { programs, fees } from '../data/mockData';

const SEARCHABLE_ITEMS = [
  // Programs
  ...programs.map(p => ({
    id: `program-${p.id}`,
    type: 'Program',
    title: p.name,
    subtitle: `${p.short} · ${p.duration} · Min ${p.minPercent}%`,
    target: 'programs',
    targetData: p,
    icon: GraduationCap,
    badgeColor: 'bg-orange-50 text-orange-600 border-orange-200',
    queryKeywords: `${p.name} ${p.short} ${p.degree} ${p.tags?.join(' ')} ${p.description}`,
  })),

  // Fee categories
  {
    id: 'fee-btech-cse',
    type: 'Fee & Scholarship',
    title: 'B.Tech CSE Core Fees & Scholarships',
    subtitle: '₹1,60,000 / sem (Base) · Up to 50% waiver with LPUNEST',
    target: 'fees',
    icon: Wallet,
    badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    queryKeywords: 'cse btech fees scholarship 160000 1.6 lakh discount lpunest tuition',
  },
  {
    id: 'fee-btech-spec',
    type: 'Fee & Scholarship',
    title: 'B.Tech AI/ML, Data Science, Cyber Security Fees',
    subtitle: '₹2,00,000 / sem (Base) · Up to 50% waiver with LPUNEST',
    target: 'fees',
    icon: Wallet,
    badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    queryKeywords: 'aiml artificial intelligence data science cyber security cloud devops full stack fees 200000 2 lakh',
  },
  {
    id: 'fee-mba',
    type: 'Fee & Scholarship',
    title: 'MBA Mittal School of Business Fees',
    subtitle: '₹2,00,000 / sem (Base) · CAT/MAT/LPUNEST scholarship slabs',
    target: 'fees',
    icon: Wallet,
    badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    queryKeywords: 'mba business management fees cat mat lpunest mittal',
  },

  // Hostel & Living
  {
    id: 'hostel-room-ac',
    type: 'Residential',
    title: 'Air Conditioned & Air Cooled Hostel Rooms',
    subtitle: '1-Seater to 4-Seater options: ₹83,000 to ₹1,53,000 / academic year',
    target: 'hostel',
    icon: BedDouble,
    badgeColor: 'bg-blue-50 text-blue-600 border-blue-200',
    queryKeywords: 'hostel room ac air cooled 1 seater 2 seater 3 seater 4 seater accommodation living',
  },
  {
    id: 'hostel-mess-laundry',
    type: 'Residential',
    title: 'Mess Meal Plans & Uni-Laundry Charges',
    subtitle: 'Standard 4-Meal ₹50k/yr (Early: ₹45k) · Standard 3-Meal ₹46k · Laundry ₹5,400/yr',
    target: 'hostel',
    icon: BedDouble,
    badgeColor: 'bg-blue-50 text-blue-600 border-blue-200',
    queryKeywords: 'mess food meal dining vegetarian south indian non veg laundry clothes wash',
  },

  // Official Offices
  {
    id: 'office-dsr',
    type: 'Helpdesk Office',
    title: 'Division of Student Relations (DSR)',
    subtitle: 'Block 29, Room 102 · dsr@lpu.co.in · Ext: 2901/2902',
    target: 'contact',
    icon: Building2,
    badgeColor: 'bg-purple-50 text-purple-600 border-purple-200',
    queryKeywords: 'dsr division student relations block 29 grievances identity card hostel permission leave complaints',
  },
  {
    id: 'office-admissions',
    type: 'Helpdesk Office',
    title: 'Central Admissions & Counselling (Block 30 Chancellery)',
    subtitle: 'Toll-Free 1800 102 4431 / 1800 274 0615 · WhatsApp: +91-98762-98762',
    target: 'contact',
    icon: Building2,
    badgeColor: 'bg-purple-50 text-purple-600 border-purple-200',
    queryKeywords: 'admissions block 30 counselling contact phone toll free helpline whatsapp chancellery',
  },

  // Rules & Knowledge Base
  {
    id: 'kb-attendance',
    type: 'Academic Rule',
    title: 'Mandatory 75% Minimum Attendance Policy',
    subtitle: 'Biometric tracking; mandatory for appearing in End-Term Examinations',
    target: 'knowledge',
    icon: HelpCircle,
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    queryKeywords: 'attendance 75 percent duty leave medical leave rules exams detention condonation',
  },
  {
    id: 'kb-ums',
    type: 'Student Portal',
    title: 'University Management System (UMS) & LPU Touch App',
    subtitle: 'UMS registration, timetable, grade points, fee receipts & notices',
    target: 'knowledge',
    icon: HelpCircle,
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    queryKeywords: 'ums portal login lpu touch app marks grades results fee payment registration password',
  },
];

export default function SearchModal({ isOpen, onClose, go, ask }) {
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else go && onClose(); // toggle handled by parent
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SEARCHABLE_ITEMS.filter((item) => {
      if (selectedFilter !== 'All' && item.type !== selectedFilter) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.queryKeywords.toLowerCase().includes(q)
      );
    }).slice(0, 8);
  }, [query, selectedFilter]);

  if (!isOpen) return null;

  const handleSelect = (item) => {
    onClose();
    go(item.target);
  };

  const handleAskAI = (text) => {
    onClose();
    ask(text || query || 'Tell me about LPU admission criteria');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-scale-up transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="relative flex items-center px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/80">
          <Search size={20} className="text-orange-500 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 44+ programmes, tuition fees, hostels, DSR, rules..."
            className="w-full bg-transparent text-sm sm:text-base font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors mr-2 cursor-pointer"
            >
              <X size={16} />
            </button>
          ) : null}
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded-md bg-slate-200 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
            ESC to close
          </kbd>
        </div>

        {/* Quick Filter Category Pills */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-100/60 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none">
          {['All', 'Program', 'Fee & Scholarship', 'Residential', 'Helpdesk Office', 'Academic Rule'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                selectedFilter === cat
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="max-h-[380px] overflow-y-auto p-3 space-y-1 divide-y divide-slate-100 dark:divide-slate-800">
          {filteredResults.length > 0 ? (
            filteredResults.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="group flex items-center justify-between p-3 rounded-2xl hover:bg-orange-50/60 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                  onClick={() => handleSelect(item)}
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-3">
                    <span className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-orange-100 dark:group-hover:bg-orange-950/60 text-slate-600 dark:text-slate-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors shrink-0">
                      <Icon size={18} />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${item.badgeColor} dark:bg-slate-800 dark:border-slate-700`}>
                          {item.type}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors truncate mt-0.5 font-display">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAskAI(`Give me complete details about ${item.title}`);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 shadow-xs hover:bg-orange-50 dark:hover:bg-slate-700 cursor-pointer"
                      title="Ask AI about this"
                    >
                      <Sparkles size={11} className="inline mr-1" />
                      Ask AI
                    </button>
                    <ChevronRight size={16} className="text-slate-400 group-hover:text-orange-600" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No direct results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-400 mt-1">Try asking the AI Admission Assistant directly below!</p>
            </div>
          )}
        </div>

        {/* AI Instant Question Footer Banner */}
        <div className="p-4 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-t border-orange-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200 min-w-0">
            <span className="p-1.5 rounded-lg bg-orange-600 text-white shrink-0">
              <Sparkles size={14} />
            </span>
            <span className="truncate font-semibold">
              {query ? `Ask AI: "${query}"` : 'Have a custom inquiry? Ask the 24/7 AI Assistant'}
            </span>
          </div>

          <button
            onClick={() => handleAskAI(query ? `Tell me in detail about: ${query}` : '')}
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-all hover:brightness-105 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
            }}
          >
            <span>Ask AI Assistant</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
