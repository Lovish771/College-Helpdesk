import React, { useState, useEffect, useMemo } from 'react';
import {
  X, Plus, Sparkles, Scale, Check, ArrowRight,
  GraduationCap, Wallet, Award, Clock, BookOpen, Briefcase, ChevronDown, CheckCircle2,
  Trash2, AlertCircle, Code, Cpu, Layers, Laptop, ExternalLink, HelpCircle
} from 'lucide-react';
import { programs, fees } from '../data/mockData';
import { PROGRAM_ENRICHMENT } from '../data/programDetails';
import { getProgramComparisonDetails } from '../data/programComparisonData';

export default function DegreeComparisonModal({ isOpen, onClose, initialPrograms = [], ask }) {
  // Array of program IDs selected (no artificial limit)
  const [selectedIds, setSelectedIds] = useState(() => {
    if (initialPrograms && initialPrograms.length > 0) {
      return initialPrograms;
    }
    return ['btech-cse', 'btech-aiml'];
  });

  const [addSelectorOpen, setAddSelectorOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [highlightDifferences, setHighlightDifferences] = useState(false);

  // Synchronize when initialPrograms changes and modal opens
  useEffect(() => {
    if (isOpen && initialPrograms && initialPrograms.length > 0) {
      setSelectedIds(initialPrograms);
    }
  }, [isOpen, initialPrograms]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const selectedPrograms = useMemo(() => {
    return selectedIds
      .map((id) => programs.find((p) => p.id === id))
      .filter(Boolean);
  }, [selectedIds]);

  const availablePrograms = useMemo(() => {
    const q = searchFilter.toLowerCase();
    return programs.filter(
      (p) =>
        !selectedIds.includes(p.id) &&
        (p.name.toLowerCase().includes(q) ||
          p.short.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q)))
    );
  }, [selectedIds, searchFilter]);

  const addDegree = (id) => {
    if (!selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
      setAddSelectorOpen(false);
      setSearchFilter('');
    }
  };

  const removeDegree = (id) => {
    setSelectedIds(selectedIds.filter((item) => item !== id));
  };

  const handleClearAll = () => {
    setSelectedIds([]);
  };

  // Launch AI deep comparative analysis
  const handleDeepAIAnalysis = () => {
    if (selectedPrograms.length === 0) return;
    const names = selectedPrograms.map((p) => `${p.short} (${p.name})`).join(' vs ');
    const query = `Please provide a deep comparative analysis between ${names} at Lovely Professional University. Compare their syllabus difficulty, core subjects, programming languages and tech stacks taught, industry demand, top corporate recruiters, average and highest placement packages, LPUNEST scholarship cutoffs, and provide a clear recommendation on which degree suits specific career goals best.`;
    onClose();
    ask(query);
  };

  // Row difference checker
  const rowDiffers = (values) => {
    if (values.length <= 1) return false;
    return new Set(values).size > 1;
  };

  if (!isOpen) return null;

  // Pre-calculate differences for each key row
  const durationDiffers = rowDiffers(selectedPrograms.map((p) => p.duration));
  const minPercentDiffers = rowDiffers(selectedPrograms.map((p) => p.minPercent));
  const tuitionDiffers = rowDiffers(selectedPrograms.map((p) => fees[p.id]?.tuition || '₹1,60,000'));
  const cat1Differs = rowDiffers(
    selectedPrograms.map((p) => {
      const f = fees[p.id] || { tuition: '₹1,60,000' };
      const raw = parseInt(f.tuition.replace(/[^0-9]/g, ''), 10) || 160000;
      return Math.round(raw * 0.5);
    })
  );
  const degreeTypeDiffers = rowDiffers(selectedPrograms.map((p) => p.degree));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Compare Degree Programmes"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl max-h-[94vh] flex flex-col rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-white/10 overflow-hidden animate-scale-up transition-colors shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.8)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.08)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-800/90">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 shadow-xs">
              <Scale size={18} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-display">
                  Compare Degree Programmes
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400">
                  {selectedPrograms.length} {selectedPrograms.length === 1 ? 'Degree' : 'Degrees'} in Matrix
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Detailed side-by-side comparative matrix of curriculums, programming languages, tech stacks, career tracks &amp; fees.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedPrograms.length > 0 && (
              <button
                onClick={handleDeepAIAnalysis}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs transition-all hover:brightness-105 active:scale-95 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                }}
              >
                <Sparkles size={13} />
                <span>Analyse All with AI</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Action & Filter Strip */}
        <div className="px-5 sm:px-6 py-2.5 bg-slate-100/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
          {/* Selected Degree Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
              Active:
            </span>
            {selectedPrograms.length === 0 ? (
              <span className="text-xs text-slate-400 italic">None selected</span>
            ) : (
              selectedPrograms.map((p) => (
                <span
                  key={p.id}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-2xs"
                >
                  <span>{p.short}</span>
                  <button
                    onClick={() => removeDegree(p.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer ml-0.5"
                    title={`Remove ${p.short}`}
                  >
                    <X size={11} />
                  </button>
                </span>
              ))
            )}

            {selectedPrograms.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-[11px] font-bold text-slate-400 hover:text-red-500 transition-colors ml-2 cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Highlight Differences Toggle */}
            <button
              onClick={() => setHighlightDifferences(!highlightDifferences)}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                highlightDifferences
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shadow-2xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <CheckCircle2 size={12} className={highlightDifferences ? 'text-amber-600' : 'text-slate-400'} />
              <span>Highlight Differences</span>
            </button>

            {/* Add Degree Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAddSelectorOpen(!addSelectorOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-600 text-white shadow-xs hover:bg-orange-700 transition-colors cursor-pointer"
              >
                <Plus size={13} />
                <span>Add Programme</span>
              </button>

              {addSelectorOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 max-h-72 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 z-50 flex flex-col">
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search degree to add..."
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl mb-2 focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900 dark:text-white"
                    autoFocus
                  />
                  <div className="overflow-y-auto space-y-1">
                    {availablePrograms.slice(0, 20).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => addDegree(p.id)}
                        className="w-full text-left p-2 rounded-xl text-xs hover:bg-orange-50 dark:hover:bg-slate-700 hover:text-orange-600 dark:hover:text-orange-400 flex items-center justify-between group transition-colors cursor-pointer"
                      >
                        <div className="truncate">
                          <p className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-orange-600 truncate">
                            {p.short}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">{p.name}</p>
                        </div>
                        <Plus size={13} className="text-slate-400 group-hover:text-orange-600 shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comparison Matrix Area */}
        {selectedPrograms.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900">
            <div className="h-16 w-16 rounded-3xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center mb-4">
              <Scale size={28} />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
              No Degrees Selected for Comparison
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
              You removed all degrees from the comparison suite. Select any degree to start comparing side-by-side.
            </p>

            <button
              onClick={() => setAddSelectorOpen(true)}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 transition-colors cursor-pointer shadow-sm"
            >
              <Plus size={14} />
              <span>+ Add Degree to Compare</span>
            </button>
          </div>
        ) : (
          <div className="relative flex-1 overflow-hidden flex flex-col bg-white dark:bg-slate-900">
            {/* Mobile swipe hint banner */}
            <div className="sm:hidden px-4 py-1.5 bg-orange-50/80 dark:bg-orange-950/40 text-[11px] text-orange-700 dark:text-orange-300 font-semibold flex items-center justify-between border-b border-orange-200/50 dark:border-orange-900/40 shrink-0">
              <span>Swipe horizontally to compare degrees</span>
              <span className="font-bold">⇄</span>
            </div>

            {/* Left & Right Gradient Shadows */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 opacity-80" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 opacity-80" />

            <div className="flex-1 overflow-auto p-4 sm:p-5">
              <div className="min-w-[680px]">
                <div
                  className="grid gap-3"
                  style={{
                    gridTemplateColumns: `210px repeat(${selectedPrograms.length}, minmax(220px, 1fr))`,
                  }}
                >
                  {/* 0. Header Course Row */}
                  <div className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 pt-2">
                    Degree Programme
                  </div>
                  {selectedPrograms.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/80 relative flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-orange-600 text-white text-[10px] font-bold uppercase tracking-wider">
                            {p.short}
                          </span>
                          <button
                            onClick={() => removeDegree(p.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                            title="Remove degree"
                          >
                            <X size={12} />
                          </button>
                        </div>
                        <h3 className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight font-display line-clamp-2">
                          {p.name}
                        </h3>
                        <p className="text-[10px] text-slate-400 mt-1">{p.degree}</p>
                      </div>

                      <button
                        onClick={() => {
                          onClose();
                          ask(`Give me details about ${p.name} eligibility, syllabus, and scholarship`);
                        }}
                        className="mt-2.5 w-full py-1.5 rounded-lg text-[11px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 transition-colors cursor-pointer text-center"
                      >
                        Inquire with AI
                      </button>
                    </div>
                  ))}

                  {/* ── SECTION 1: ACADEMIC ESSENTIALS ── */}
                  <div className="col-span-full pt-4 pb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50 px-2.5 py-1 rounded-md">
                      1. Academic Essentials &amp; Curriculum
                    </span>
                  </div>

                  {/* Duration */}
                  <div className={`font-bold text-xs flex items-center gap-1.5 py-2.5 border-t border-slate-200 dark:border-slate-800 ${
                    highlightDifferences && durationDiffers
                      ? 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-900 dark:text-amber-200 border-l-4 border-l-amber-500 pl-2 rounded-r'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    <Clock size={13} className="text-orange-500" />
                    <span>Duration</span>
                    {highlightDifferences && durationDiffers && (
                      <span className="text-[9px] bg-amber-500 text-white font-extrabold px-1 rounded">Differs</span>
                    )}
                  </div>
                  {selectedPrograms.map((p) => (
                    <div key={p.id} className="py-2.5 border-t border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {p.duration}
                    </div>
                  ))}

                  {/* Eligibility */}
                  <div className={`font-bold text-xs flex items-center gap-1.5 py-2.5 border-t border-slate-200 dark:border-slate-800 ${
                    highlightDifferences && minPercentDiffers
                      ? 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-900 dark:text-amber-200 border-l-4 border-l-amber-500 pl-2 rounded-r'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    <GraduationCap size={13} className="text-blue-500" />
                    <span>Eligibility Criteria</span>
                    {highlightDifferences && minPercentDiffers && (
                      <span className="text-[9px] bg-amber-500 text-white font-extrabold px-1 rounded">Differs</span>
                    )}
                  </div>
                  {selectedPrograms.map((p) => (
                    <div key={p.id} className="py-2.5 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-bold text-slate-900 dark:text-white">Min {p.minPercent}%</span> in {p.accepts?.[0] || '10+2'}
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{p.eligibility}</p>
                    </div>
                  ))}

                  {/* Semester 1 Foundation Subjects */}
                  <div className="font-bold text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 py-2.5 border-t border-slate-200 dark:border-slate-800">
                    <BookOpen size={13} className="text-indigo-500" />
                    <span>Semester 1 Courses</span>
                  </div>
                  {selectedPrograms.map((p) => {
                    const enrichment = PROGRAM_ENRICHMENT[p.id];
                    const subs = enrichment?.semester1Subjects || [];
                    return (
                      <div key={p.id} className="py-2.5 border-t border-slate-200 dark:border-slate-800 text-xs space-y-1">
                        {subs.slice(0, 3).map((s) => (
                          <div key={s.code} className="flex items-center justify-between text-[11px]">
                            <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[150px]">{s.name}</span>
                            <span className="text-[10px] text-slate-400 shrink-0">{s.credits} cr</span>
                          </div>
                        ))}
                        {subs.length > 3 && (
                          <span className="text-[10px] text-orange-600 font-bold block">+{subs.length - 3} more foundational courses</span>
                        )}
                      </div>
                    );
                  })}

                  {/* Core & Elective Subjects */}
                  <div className="font-bold text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 py-2.5 border-t border-slate-200 dark:border-slate-800">
                    <Layers size={13} className="text-purple-500" />
                    <span>Core &amp; Electives</span>
                  </div>
                  {selectedPrograms.map((p) => {
                    const details = getProgramComparisonDetails(p);
                    return (
                      <div key={p.id} className="py-2.5 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        <p className="line-clamp-3">{details?.coreElectives || p.description}</p>
                      </div>
                    );
                  })}

                  {/* ── SECTION 2: TECHNICAL & INDUSTRY STACK ── */}
                  <div className="col-span-full pt-4 pb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-md">
                      2. Programming Languages, Tech Stack &amp; Labs
                    </span>
                  </div>

                  {/* Languages Taught */}
                  <div className="font-bold text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 py-2.5 border-t border-slate-200 dark:border-slate-800">
                    <Code size={13} className="text-blue-600" />
                    <span>Languages &amp; Tools</span>
                  </div>
                  {selectedPrograms.map((p) => {
                    const details = getProgramComparisonDetails(p);
                    return (
                      <div key={p.id} className="py-2.5 border-t border-slate-200 dark:border-slate-800 text-xs">
                        <div className="flex flex-wrap gap-1">
                          {details?.languages?.map((lang) => (
                            <span key={lang} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-[10px]">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {/* Tech Stack & Dev Tools */}
                  <div className="font-bold text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 py-2.5 border-t border-slate-200 dark:border-slate-800">
                    <Laptop size={13} className="text-emerald-600" />
                    <span>Technology Stack</span>
                  </div>
                  {selectedPrograms.map((p) => {
                    const details = getProgramComparisonDetails(p);
                    return (
                      <div key={p.id} className="py-2.5 border-t border-slate-200 dark:border-slate-800 text-xs">
                        <div className="flex flex-wrap gap-1">
                          {details?.techStack?.map((tool) => (
                            <span key={tool} className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium text-[10px]">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {/* AI / Emerging Topics */}
                  <div className="font-bold text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 py-2.5 border-t border-slate-200 dark:border-slate-800">
                    <Cpu size={13} className="text-amber-500" />
                    <span>AI / Emerging Topics</span>
                  </div>
                  {selectedPrograms.map((p) => {
                    const details = getProgramComparisonDetails(p);
                    return (
                      <div key={p.id} className="py-2.5 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                        <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                          {details?.aiTopics?.map((topic) => (
                            <li key={topic}>{topic}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}

                  {/* Practical Labs & Internships */}
                  <div className="font-bold text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 py-2.5 border-t border-slate-200 dark:border-slate-800">
                    <Briefcase size={13} className="text-indigo-600" />
                    <span>Labs &amp; Internships</span>
                  </div>
                  {selectedPrograms.map((p) => {
                    const details = getProgramComparisonDetails(p);
                    return (
                      <div key={p.id} className="py-2.5 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                        {details?.labsAndInternships}
                      </div>
                    );
                  })}

                  {/* Certifications */}
                  <div className="font-bold text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 py-2.5 border-t border-slate-200 dark:border-slate-800">
                    <Award size={13} className="text-orange-500" />
                    <span>Industry Certifications</span>
                  </div>
                  {selectedPrograms.map((p) => {
                    const details = getProgramComparisonDetails(p);
                    return (
                      <div key={p.id} className="py-2.5 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                        {details?.certifications}
                      </div>
                    );
                  })}

                  {/* ── SECTION 3: CAREER & HIGHER EDUCATION ── */}
                  <div className="col-span-full pt-4 pb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2.5 py-1 rounded-md">
                      3. Career Outcomes &amp; Higher Studies
                    </span>
                  </div>

                  {/* Career Roles */}
                  <div className="font-bold text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 py-2.5 border-t border-slate-200 dark:border-slate-800">
                    <Briefcase size={13} className="text-purple-600" />
                    <span>Target Job Roles</span>
                  </div>
                  {selectedPrograms.map((p) => {
                    const details = getProgramComparisonDetails(p);
                    return (
                      <div key={p.id} className="py-2.5 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200">
                        <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                          {details?.careerRoles?.map((role) => (
                            <li key={role} className="font-semibold">{role}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}

                  {/* Higher Education Pathways */}
                  <div className="font-bold text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 py-2.5 border-t border-slate-200 dark:border-slate-800">
                    <GraduationCap size={13} className="text-teal-600" />
                    <span>Higher Education</span>
                  </div>
                  {selectedPrograms.map((p) => {
                    const details = getProgramComparisonDetails(p);
                    return (
                      <div key={p.id} className="py-2.5 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 text-[11px]">
                        {details?.higherEducation}
                      </div>
                    );
                  })}

                  {/* ── SECTION 4: FEES & SCHOLARSHIPS ── */}
                  <div className="col-span-full pt-4 pb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-md">
                      4. Fees &amp; LPUNEST Scholarships
                    </span>
                  </div>

                  {/* Base Tuition */}
                  <div className={`font-bold text-xs flex items-center gap-1.5 py-2.5 border-t border-slate-200 dark:border-slate-800 ${
                    highlightDifferences && tuitionDiffers
                      ? 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-900 dark:text-amber-200 border-l-4 border-l-amber-500 pl-2 rounded-r'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    <Wallet size={13} className="text-emerald-600" />
                    <span>Base Tuition (Per Sem)</span>
                    {highlightDifferences && tuitionDiffers && (
                      <span className="text-[9px] bg-amber-500 text-white font-extrabold px-1 rounded">Differs</span>
                    )}
                  </div>
                  {selectedPrograms.map((p) => {
                    const f = fees[p.id] || { tuition: '₹1,60,000 / semester' };
                    return (
                      <div key={p.id} className="py-2.5 border-t border-slate-200 dark:border-slate-800 text-xs">
                        <span className="font-extrabold text-slate-900 dark:text-white block">
                          {f.tuition.split(' ')[0]} / sem
                        </span>
                        <span className="text-[10px] text-slate-400">+ ₹4,500 Exam fee</span>
                      </div>
                    );
                  })}

                  {/* Cat I Scholarship */}
                  <div className={`font-bold text-xs flex items-center gap-1.5 py-2.5 border-t border-slate-200 dark:border-slate-800 ${
                    highlightDifferences && cat1Differs
                      ? 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-900 dark:text-amber-200 border-l-4 border-l-amber-500 pl-2 rounded-r'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    <Award size={13} className="text-amber-500" />
                    <span>Cat I Scholarship (50% Off)</span>
                    {highlightDifferences && cat1Differs && (
                      <span className="text-[9px] bg-amber-500 text-white font-extrabold px-1 rounded">Differs</span>
                    )}
                  </div>
                  {selectedPrograms.map((p) => {
                    const f = fees[p.id] || { tuition: '₹1,60,000 / semester' };
                    const raw = parseInt(f.tuition.replace(/[^0-9]/g, ''), 10) || 160000;
                    const netCat1 = Math.round(raw * 0.5);
                    return (
                      <div key={p.id} className="py-2.5 border-t border-slate-200 dark:border-slate-800 text-xs">
                        <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold">
                          ₹{netCat1.toLocaleString('en-IN')} / sem
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Bottom Action Bar */}
        <div className="px-5 sm:px-6 py-3.5 bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 shrink-0">
              <Sparkles size={16} />
            </span>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Unsure which degree fits your future ambition best?
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Our AI Admission Engine can analyze syllabus difficulty, coding intensity, and placement histories side by side.
              </p>
            </div>
          </div>

          {selectedPrograms.length > 0 && (
            <button
              onClick={handleDeepAIAnalysis}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all hover:brightness-110 active:scale-95 cursor-pointer shrink-0"
              style={{
                background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
              }}
            >
              <span>Analyse Them with AI ({selectedPrograms.length})</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
