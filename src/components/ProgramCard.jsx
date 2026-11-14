import { useState } from 'react';
import {
  Clock, GraduationCap, ArrowRight, MessageSquare, BookOpen,
  Wallet, Award, Scale, ChevronDown, ChevronUp, Briefcase, Trophy, Check, Flame
} from 'lucide-react';
import { PROGRAM_IMAGES } from '../data/programImages';
import { fees } from '../data/mockData';
import { getProgramEnrichment } from '../data/programDetails';

// Official high-enrollment flagship courses at LPU
const HIGH_DEMAND_IDS = new Set(['btech-cse', 'btech-aiml', 'btech-ds', 'mba', 'bca']);

/**
 * Format duration to strictly mention "X Year Programme" without semesters
 */
function formatDuration(durationStr) {
  if (!durationStr) return '4 Year Programme';
  const match = durationStr.match(/(\d+)\s*Year/i);
  if (match) {
    return `${match[1]} Year Programme`;
  }
  return durationStr.replace(/\s*\(.*?semesters.*?\)/gi, '').trim();
}

/**
 * Categorize program into its canonical main degree with tailored color palette and glowing hover border.
 */
function getMainDegreeInfo(p) {
  const short = (p.short || '').toLowerCase();
  const name = (p.name || '').toLowerCase();
  const combined = `${short} ${name}`;

  if (combined.includes('b.tech') || combined.includes('btech')) {
    return {
      degree: 'B.Tech',
      badgeClass: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-blue-500/25',
      glowClass: 'hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-[0_16px_36px_-6px_rgba(59,130,246,0.35)]',
      textAccent: 'text-blue-600 dark:text-blue-400',
    };
  }
  if (combined.includes('m.tech') || combined.includes('mtech')) {
    return {
      degree: 'M.Tech',
      badgeClass: 'bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-500 text-white shadow-purple-500/25',
      glowClass: 'hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-[0_16px_36px_-6px_rgba(168,85,247,0.35)]',
      textAccent: 'text-purple-600 dark:text-purple-400',
    };
  }
  if (combined.includes('mca')) {
    return {
      degree: 'MCA',
      badgeClass: 'bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white shadow-sky-500/25',
      glowClass: 'hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-[0_16px_36px_-6px_rgba(14,165,233,0.35)]',
      textAccent: 'text-sky-600 dark:text-sky-400',
    };
  }
  if (combined.includes('bca')) {
    return {
      degree: 'BCA',
      badgeClass: 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-cyan-500/25',
      glowClass: 'hover:border-cyan-400 dark:hover:border-cyan-500 hover:shadow-[0_16px_36px_-6px_rgba(6,182,212,0.35)]',
      textAccent: 'text-cyan-600 dark:text-cyan-400',
    };
  }
  if (combined.includes('mba')) {
    return {
      degree: 'MBA',
      badgeClass: 'bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 text-white shadow-amber-500/25',
      glowClass: 'hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-[0_16px_36px_-6px_rgba(245,158,11,0.35)]',
      textAccent: 'text-amber-600 dark:text-amber-400',
    };
  }
  if (combined.includes('bba') || combined.includes('b.b.a')) {
    return {
      degree: 'BBA',
      badgeClass: 'bg-gradient-to-r from-orange-500 via-amber-600 to-yellow-500 text-white shadow-orange-500/25',
      glowClass: 'hover:border-orange-400 dark:hover:border-orange-500 hover:shadow-[0_16px_36px_-6px_rgba(249,115,22,0.35)]',
      textAccent: 'text-orange-600 dark:text-orange-400',
    };
  }
  if (combined.includes('b.sc') || combined.includes('bsc')) {
    return {
      degree: 'B.Sc',
      badgeClass: 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-500 text-white shadow-emerald-500/25',
      glowClass: 'hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-[0_16px_36px_-6px_rgba(16,185,129,0.35)]',
      textAccent: 'text-emerald-600 dark:text-emerald-400',
    };
  }
  if (combined.includes('m.sc') || combined.includes('msc')) {
    return {
      degree: 'M.Sc',
      badgeClass: 'bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 text-white shadow-teal-500/25',
      glowClass: 'hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-[0_16px_36px_-6px_rgba(20,184,166,0.35)]',
      textAccent: 'text-teal-600 dark:text-teal-400',
    };
  }
  if (combined.includes('pharm') || combined.includes('bpt')) {
    const isPharm = combined.includes('pharm');
    const degreeLabel = isPharm ? (combined.includes('m.pharm') ? 'M.Pharm' : 'B.Pharm') : 'BPT';
    return {
      degree: degreeLabel,
      badgeClass: 'bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-500 text-white shadow-rose-500/25',
      glowClass: 'hover:border-rose-400 dark:hover:border-rose-500 hover:shadow-[0_16px_36px_-6px_rgba(244,63,94,0.35)]',
      textAccent: 'text-rose-600 dark:text-rose-400',
    };
  }
  if (combined.includes('b.com') || combined.includes('bcom')) {
    return {
      degree: 'B.Com',
      badgeClass: 'bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 text-white shadow-teal-500/25',
      glowClass: 'hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-[0_16px_36px_-6px_rgba(20,184,166,0.35)]',
      textAccent: 'text-teal-600 dark:text-teal-400',
    };
  }
  if (combined.includes('law') || combined.includes('llb') || combined.includes('ll.b') || combined.includes('llm') || combined.includes('ll.m')) {
    const degreeLabel = combined.includes('llm') || combined.includes('ll.m') ? 'LL.M' : 'LL.B';
    return {
      degree: degreeLabel,
      badgeClass: 'bg-gradient-to-r from-amber-700 via-yellow-700 to-stone-800 text-white shadow-amber-600/25',
      glowClass: 'hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-[0_16px_36px_-6px_rgba(217,119,6,0.35)]',
      textAccent: 'text-amber-600 dark:text-amber-400',
    };
  }
  if (combined.includes('arch') || combined.includes('des')) {
    const degreeLabel = combined.includes('arch') ? 'B.Arch' : 'B.Des';
    return {
      degree: degreeLabel,
      badgeClass: 'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-violet-500/25',
      glowClass: 'hover:border-violet-400 dark:hover:border-violet-500 hover:shadow-[0_16px_36px_-6px_rgba(139,92,246,0.35)]',
      textAccent: 'text-violet-600 dark:text-violet-400',
    };
  }

  const fallback = p.short ? p.short.split(' ')[0] : 'Degree';
  return {
    degree: fallback,
    badgeClass: 'bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 text-white shadow-orange-500/25',
    glowClass: 'hover:border-orange-400 dark:hover:border-orange-500 hover:shadow-[0_16px_36px_-6px_rgba(249,115,22,0.35)]',
    textAccent: 'text-orange-600 dark:text-orange-400',
  };
}

export default function ProgramCard({ p, onView, onAsk, onCompare, isCompared = false }) {
  const [showQuickGlimpse, setShowQuickGlimpse] = useState(false);
  const image = PROGRAM_IMAGES[p.id] || PROGRAM_IMAGES['btech-cse'];
  const enrichment = getProgramEnrichment(p.id);
  const degreeInfo = getMainDegreeInfo(p);
  const durationText = formatDuration(p.duration);
  const isHighDemand = HIGH_DEMAND_IDS.has(p.id);

  const programFee = fees[p.id] || {
    tuition: '₹1,60,000 / semester (Base)',
    other: '₹5,000 / semester (Examination Fee)',
    scholarship: 'Category I: up to 50% waiver',
  };

  return (
    <div
      onClick={() => onView && onView(p)}
      className={`group relative flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 active:scale-[0.99] overflow-hidden cursor-pointer ${degreeInfo.glowClass}`}
      tabIndex={0}
      role="article"
      aria-label={`${p.name} - Click to view complete details`}
    >
      {/* Top Banner Image with Gradient Overlay */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900 shrink-0">
        <img
          src={image}
          alt={p.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

        {/* ── CARD HEADER (STRICT USER SPECIFICATION) ── */}
        {/* Top-Left: Main Degree Badge | Top-Right: Duration (e.g. "4 Year Programme") */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
          {/* Main Degree on Top Left with Metallic Shimmer */}
          <span
            className={`relative overflow-hidden inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider shadow-md border border-white/20 select-none ${degreeInfo.badgeClass}`}
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <GraduationCap size={13} className="shrink-0" />
              <span>{degreeInfo.degree}</span>
            </span>
            {/* Shimmer sweep animation */}
            <span
              aria-hidden="true"
              className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none"
            />
          </span>

          {/* Duration on Top Right strictly formatted (no semesters) */}
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white border border-white/20 shadow-xs">
            <Clock size={12} className="text-orange-400 shrink-0" />
            <span>{durationText}</span>
          </span>
        </div>

        {/* Bottom Banner Strip: Stream Tag & High Demand Indicator */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between gap-2">
          <span className="rounded-md bg-slate-950/80 backdrop-blur-md text-slate-200 border border-white/10 px-2.5 py-0.5 text-[11px] font-bold truncate max-w-[170px] shadow-xs">
            {p.short}
          </span>

          {/* High Demand badge strictly on highest enrolled courses */}
          {isHighDemand && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white shadow-sm border border-rose-400/40">
              <Flame size={11} className="fill-white" />
              <span>High Demand</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Degree Full Name */}
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug font-display group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
            {p.name}
          </h3>

          {/* Quick Metrics Grid */}
          <div className="mt-3.5 space-y-2 text-xs font-sans">
            {/* Tuition Fee */}
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                <Wallet size={12} className="text-slate-400" />
                Semester Fee
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {programFee.tuition.split(' ')[0]} / sem
              </span>
            </div>

            {/* Scholarship */}
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                <Award size={12} className="text-amber-500" />
                LPUNEST Scholarship
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded text-[11px] border border-amber-200 dark:border-amber-900/60">
                Up to 50% Off
              </span>
            </div>

            {/* Eligibility */}
            <div className="flex items-center justify-between py-1 text-slate-500 dark:text-slate-400 font-medium">
              <span>Min Eligibility</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {p.minPercent}% in {p.accepts?.[0] || '10+2'}
              </span>
            </div>
          </div>

          {/* Expandable "Quick Glimpse" Accordion */}
          {showQuickGlimpse && (
            <div
              id={`quick-glimpse-${p.id}`}
              onClick={(e) => e.stopPropagation()}
              className="mt-3.5 p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-200 animate-fade-in space-y-3"
            >
              {/* NIRF Rank Badge */}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/50 text-orange-800 dark:text-orange-300 font-semibold text-[11px]">
                <Trophy size={14} className="text-orange-600 dark:text-orange-400 shrink-0" />
                <span className="truncate">{enrichment.nirfBadge}</span>
              </div>

              {/* Semester 1 Subjects Preview */}
              <div>
                <p className="font-bold text-[11px] text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mb-1.5">
                  <BookOpen size={12} className="text-orange-600 dark:text-orange-400" />
                  <span>Semester 1 Foundation:</span>
                </p>
                <div className="space-y-1">
                  {enrichment.semester1Subjects.slice(0, 3).map((subj) => (
                    <div
                      key={subj.code}
                      className="flex items-center justify-between text-[11px] py-0.5 border-b border-slate-200/50 dark:border-slate-700/50 last:border-0"
                    >
                      <span className="truncate max-w-[170px] text-slate-800 dark:text-slate-200">
                        <strong className="text-slate-900 dark:text-white font-mono mr-1">{subj.code}:</strong>
                        {subj.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200/80 dark:bg-slate-700 font-bold shrink-0 text-slate-700 dark:text-slate-300">
                        {subj.credits} Cr
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Tracks */}
              <div>
                <p className="font-bold text-[11px] text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mb-1.5">
                  <Briefcase size={12} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Key Placement Roles:</span>
                </p>
                <div className="flex flex-wrap gap-1">
                  {enrichment.careerTracks.slice(0, 3).map((role) => (
                    <span
                      key={role}
                      className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card Footer Action Buttons */}
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onView(p);
              }}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-3 text-xs font-bold text-white shadow-sm transition-all duration-200 active:scale-[0.98] cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
              style={{
                background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
              }}
              aria-label={`View full details for ${p.name}`}
            >
              <span>View Details</span>
              <ArrowRight size={13} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAsk(`Tell me about admission, fees, and eligibility for ${p.short}`);
              }}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 active:scale-[0.98] cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
              aria-label={`Ask Helpdesk about ${p.short}`}
            >
              <MessageSquare size={12} className="text-orange-500" />
              <span>Ask Helpdesk</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            {onCompare && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCompare(p.id);
                }}
                className={`inline-flex items-center gap-1 text-[11px] font-bold py-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 rounded transition-colors ${
                  isCompared
                    ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                    : 'text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300'
                }`}
                aria-label={`Add ${p.short} to comparison matrix`}
              >
                {isCompared ? <Check size={12} className="text-emerald-600" /> : <Scale size={12} />}
                <span>{isCompared ? 'In Comparison' : '+ Compare Degree'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowQuickGlimpse((prev) => !prev);
              }}
              aria-expanded={showQuickGlimpse}
              aria-controls={`quick-glimpse-${p.id}`}
              className="inline-flex items-center gap-1 text-right text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors py-1 cursor-pointer ml-auto focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
            >
              <span>{showQuickGlimpse ? 'Hide Glimpse' : 'Quick Glimpse'}</span>
              {showQuickGlimpse ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
