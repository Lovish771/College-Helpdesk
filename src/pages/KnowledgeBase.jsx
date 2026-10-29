import { useState } from 'react';
import {
  Search, ChevronDown, ChevronUp, ArrowRight, UserCheck, CreditCard,
  BookOpen, Bed, Users, Briefcase, FileText, LifeBuoy, HelpCircle,
  Sparkles, CheckCircle2, BookmarkCheck, PhoneCall
} from 'lucide-react';
import { mockCategories, mockArticles } from '../api/knowledgeApi';

const ICONS = {
  'user-check': UserCheck,
  'credit-card': CreditCard,
  'book-open': BookOpen,
  'bed': Bed,
  'users': Users,
  'briefcase': Briefcase,
  'file-text': FileText,
  'life-buoy': LifeBuoy,
};

export default function KnowledgeBase({ ask }) {
  const [q, setQ] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [expandedId, setExpandedId] = useState(1); // Default first FAQ open

  const filteredArticles = mockArticles.filter((a) => {
    const matchQ =
      !q ||
      a.title.toLowerCase().includes(q.toLowerCase()) ||
      a.answer.toLowerCase().includes(q.toLowerCase());
    const matchC =
      selectedCategory === 'All Categories' ||
      a.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchQ && matchC;
  });

  const toggleAccordion = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Title Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">
              Student Knowledge Hub • Batch 2026-27
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display mt-1">
              Official FAQs &amp; University Guidelines
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Find immediate answers right here to common queries regarding admissions, education loans, hostel rooms, fee slabs, and 75% attendance rules.
            </p>
          </div>

          <button
            onClick={() => ask && ask('What are the key admission deadlines and scholarship cutoffs for 2026-27?')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800 text-xs font-bold text-orange-600 dark:text-orange-400 hover:bg-orange-100 transition-all cursor-pointer shrink-0"
          >
            <Sparkles size={14} />
            <span>Ask Custom Question to AI</span>
          </button>
        </div>

        {/* Search Bar with Category Select */}
        <div className="max-w-3xl">
          <div className="flex items-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm p-2 transition-colors">
            <Search size={18} className="text-slate-400 ml-2 shrink-0" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by keywords (e.g. Education loan, 75% attendance, hostel AC, mess fee, LPUNEST)..."
              className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none"
            />
            <div className="relative border-l border-slate-200 dark:border-slate-800 pl-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-transparent pr-7 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 outline-none cursor-pointer"
              >
                <option value="All Categories" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">All Categories</option>
                <option value="Admission" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Admission Process</option>
                <option value="Education Loans" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Education Loans</option>
                <option value="Fees" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Fees &amp; Scholarships</option>
                <option value="Hostel" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Hostel &amp; Living</option>
                <option value="UMS" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">UMS &amp; Attendance</option>
                <option value="Placements" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Placements</option>
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Category Quick Filter Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {mockCategories.map((c) => {
            const Icon = ICONS[c.icon] || HelpCircle;
            const active = selectedCategory.toLowerCase().includes(c.id.toLowerCase());
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(active ? 'All Categories' : c.name.split(' ')[0])}
                className={`flex items-center gap-3 rounded-2xl p-3.5 text-left border transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-300 dark:border-orange-700 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-orange-300 dark:hover:border-slate-700'
                }`}
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-2xs"
                  style={{ background: c.bg, color: c.color }}
                >
                  <Icon size={17} />
                </span>
                <div className="truncate">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {c.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                    {c.count} Articles
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* FAQs Accordion Section (Answering DIRECTLY in place) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-display">
              {selectedCategory === 'All Categories' ? 'Frequently Asked Questions' : `${selectedCategory} Questions`}
              <span className="text-xs font-normal text-slate-400 ml-2">({filteredArticles.length} answered)</span>
            </h2>

            <span className="text-xs text-slate-400">Click any question to view the full verified response</span>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-slate-200 dark:border-slate-800">
              <HelpCircle size={28} className="text-slate-400 mx-auto mb-2" />
              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">No matching questions found</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for other terms like 'hostel', 'loan', or 'scholarship'.</p>
              <button
                onClick={() => { setQ(''); setSelectedCategory('All Categories'); }}
                className="mt-3 px-3 py-1.5 bg-orange-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredArticles.map((art) => {
                const isOpen = expandedId === art.id;
                return (
                  <div
                    key={art.id}
                    className={`rounded-2xl transition-all duration-200 border overflow-hidden ${
                      isOpen
                        ? 'bg-white dark:bg-slate-900 border-orange-300 dark:border-orange-800/80 shadow-md ring-1 ring-orange-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                    }`}
                  >
                    {/* Accordion Question Header */}
                    <button
                      type="button"
                      onClick={() => toggleAccordion(art.id)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer group"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center gap-3.5 pr-4">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-colors ${
                            isOpen
                              ? 'bg-orange-600 text-white shadow-xs'
                              : 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 group-hover:bg-orange-100'
                          }`}
                        >
                          <HelpCircle size={15} />
                        </span>
                        <div>
                          <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-snug">
                            {art.title}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                              {art.tag}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">
                              {art.reads} students found this helpful
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 text-slate-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </button>

                    {/* Accordion In-Place Answer Content */}
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800/80 animate-fade-in">
                        {/* Direct Structured Answer */}
                        <div className="mt-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-2 whitespace-pre-line font-medium bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                          {art.answer}
                        </div>

                        {/* Key Highlights Bullet Points */}
                        {art.highlights && art.highlights.length > 0 && (
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              Key Highlights:
                            </span>
                            {art.highlights.map((h, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                              >
                                <CheckCircle2 size={12} className="text-emerald-500" />
                                <span>{h}</span>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Optional Inline AI Follow-up */}
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <span className="text-slate-400 text-[11px]">
                            Verified by Lovely Professional University Academic Administration.
                          </span>

                          <button
                            type="button"
                            onClick={() => ask && ask(`Regarding: "${art.title}" — can you give me more specific guidelines and deadlines?`)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors cursor-pointer"
                          >
                            <Sparkles size={13} />
                            <span>Ask AI for Personalized Details</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Direct Contacts Notice */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl">
            <h3 className="text-lg sm:text-xl font-extrabold font-display">
              Can't find what you are looking for?
            </h3>
            <p className="text-xs sm:text-sm text-orange-100 leading-relaxed">
              Contact the Division of Student Relations (DSR) in Block 29, Room 102 or talk to our 24/7 AI Student Helpdesk anytime.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => ask && ask('I have a query not covered in the FAQ. Can you assist me?')}
              className="bg-white text-orange-600 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-orange-50 transition-colors cursor-pointer"
            >
              Ask AI Assistant
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
