import React, { useState } from 'react';
import {
  Search, ChevronDown, ChevronUp, UserCheck, CreditCard,
  BookOpen, Bed, Briefcase, FileText, LifeBuoy, HelpCircle,
  Bot, CheckCircle2, PhoneCall, Building
} from 'lucide-react';
import { mockCategories, mockArticles } from '../api/knowledgeApi';

const ICONS = {
  'user-check': UserCheck,
  'credit-card': CreditCard,
  'book-open': BookOpen,
  'bed': Bed,
  'briefcase': Briefcase,
  'file-text': FileText,
  'life-buoy': LifeBuoy,
};

export default function KnowledgeBase({ ask }) {
  const [q, setQ] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(1); // First item open by default

  const filteredArticles = mockArticles.filter((a) => {
    const matchQ =
      !q ||
      a.title.toLowerCase().includes(q.toLowerCase()) ||
      a.answer.toLowerCase().includes(q.toLowerCase());
    const matchC =
      selectedCategory === 'All' ||
      a.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchQ && matchC;
  });

  const toggleAccordion = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* ── HEADER BANNER ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
              <Building size={13} />
              <span>Official Institutional Guidelines • Session 2026-27</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
              Knowledge Base &amp; FAQs
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Concise reference answers covering admissions, tuition scholarships, loan processes, hostel room tiers, and academic attendance regulations.
            </p>
          </div>

          <button
            type="button"
            onClick={() => ask && ask('What are the key admission deadlines and scholarship cutoffs for 2026-27?')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/25 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <Bot size={14} />
            <span>Ask Helpdesk Assistant</span>
          </button>
        </div>

        {/* ── SEARCH & FILTER CONTROLS ── */}
        <div className="space-y-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by topic, e.g. education loan, 75% attendance, hostel AC, mess, LPUNEST..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs transition-colors"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                selectedCategory === 'All'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              All Topics ({mockArticles.length})
            </button>
            {mockCategories.map((c) => {
              const active = selectedCategory.toLowerCase() === c.name.toLowerCase();
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCategory(active ? 'All' : c.name)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    active
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── FAQ ACCORDION LIST ── */}
        <div className="space-y-3">
          {filteredArticles.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-800 space-y-3">
              <HelpCircle size={28} className="text-slate-400 mx-auto" />
              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                No matching questions found
              </p>
              <p className="text-xs text-slate-500">
                Try searching for broader terms like 'fee', 'hostel', or 'loan'.
              </p>
              <button
                type="button"
                onClick={() => { setQ(''); setSelectedCategory('All'); }}
                className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredArticles.map((art) => {
              const isOpen = expandedId === art.id;
              return (
                <div
                  key={art.id}
                  className={`rounded-2xl transition-all duration-200 border overflow-hidden ${
                    isOpen
                      ? 'bg-white dark:bg-slate-900 border-orange-500/60 shadow-md ring-1 ring-orange-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs'
                  }`}
                >
                  {/* Click to Toggle Accordion Header */}
                  <button
                    type="button"
                    onClick={() => toggleAccordion(art.id)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer group select-none"
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
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-snug block">
                          {art.title}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                            {art.tag}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {art.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-slate-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>

                  {/* Clean, Bite-sized Answer Panel */}
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800/80 animate-fade-in space-y-3">
                      <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-line">
                        {art.answer}
                      </div>

                      {/* Key Highlights Tags */}
                      {art.highlights && art.highlights.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                            Highlights:
                          </span>
                          {art.highlights.map((h, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                            >
                              <CheckCircle2 size={11} className="text-emerald-500 shrink-0" />
                              <span>{h}</span>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Ask AI Contextual Action */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
                        <span className="text-slate-400 text-[11px]">
                          Official verified academic reference
                        </span>
                        <button
                          type="button"
                          onClick={() => ask && ask(`Tell me more details about: ${art.title}`)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
                        >
                          <Bot size={12} />
                          <span>Ask Helpdesk for guidance</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ── DIRECT HELPLINE FOOTNOTE ── */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PhoneCall size={15} className="text-orange-500 shrink-0" />
              <span>Need Direct Administrative Assistance?</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Visit the Division of Student Relations (DSR) in Block 29, Room 102, or call +91-1824-517000 for official student desk inquiries.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') window.location.hash = '#/contact';
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer shrink-0"
          >
            Contact Admissions &amp; DSR
          </button>
        </div>

      </div>
    </div>
  );
}
