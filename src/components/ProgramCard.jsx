import React, { useState } from 'react';
import {
  Clock, GraduationCap, ArrowRight, BookOpen,
  Wallet, Award, Scale, ChevronDown, ChevronUp, Briefcase, Trophy, Flame, CheckCircle2
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
      glowClass: 'hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-[0_12px_30px_-6px_rgba(59,130,246,0.35)]',
      textAccent: 'text-blue-600 dark:text-blue-400',
    };
  }
  if (combined.includes('m.tech') || combined.includes('mtech')) {
    return {
      degree: 'M.Tech',
      badgeClass: 'bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-500 text-white shadow-purple-500/25',
      glowClass: 'hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-[0_12px_30px_-6px_rgba(168,85,247,0.35)]',
      textAccent: 'text-purple-600 dark:text-purple-400',
    };
  }
  if (combined.includes('mca')) {
    return {
      degree: 'MCA',
      badgeClass: 'bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white shadow-sky-500/25',
      glowClass: 'hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-[0_12px_30px_-6px_rgba(14,165,233,0.35)]',
      textAccent: 'text-sky-600 dark:text-sky-400',
    };
  }
  if (combined.includes('bca')) {
    return {
      degree: 'BCA',
      badgeClass: 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-cyan-500/25',
      glowClass: 'hover:border-cyan-400 dark:hover:border-cyan-500 hover:shadow-[0_12px_30px_-6px_rgba(6,182,212,0.35)]',
      textAccent: 'text-cyan-600 dark:text-cyan-400',
    };
  }
  if (combined.includes('mba')) {
    return {
      degree: 'MBA',
      badgeClass: 'bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 text-white shadow-amber-500/25',
      glowClass: 'hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-[0_12px_30px_-6px_rgba(245,158,11,0.35)]',
      textAccent: 'text-amber-600 dark:text-amber-400',
    };
  }
  if (combined.includes('bba') || combined.includes('b.b.a')) {
    return {
      degree: 'BBA',
      badgeClass: 'bg-gradient-to-r from-orange-500 via-amber-600 to-yellow-500 text-white shadow-orange-500/25',
      glowClass: 'hover:border-orange-400 dark:hover:border-orange-500 hover:shadow-[0_12px_30px_-6px_rgba(249,115,22,0.35)]',
      textAccent: 'text-orange-600 dark:text-orange-400',
    };
  }
  if (combined.includes('b.sc') || combined.includes('bsc')) {
    return {
      degree: 'B.Sc',
      badgeClass: 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-500 text-white shadow-emerald-500/25',
      glowClass: 'hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-[0_12px_30px_-6px_rgba(16,185,129,0.35)]',
      textAccent: 'text-emerald-600 dark:text-emerald-400',
    };
  }
  if (combined.includes('m.sc') || combined.includes('msc')) {
    return {
      degree: 'M.Sc',
      badgeClass: 'bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 text-white shadow-teal-500/25',
      glowClass: 'hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-[0_12px_30px_-6px_rgba(20,184,166,0.35)]',
      textAccent: 'text-teal-600 dark:text-teal-400',
    };
  }
  if (combined.includes('pharm') || combined.includes('bpt')) {
    const isPharm = combined.includes('pharm');
    const degreeLabel = isPharm ? (combined.includes('m.pharm') ? 'M.Pharm' : 'B.Pharm') : 'BPT';
    return {
      degree: degreeLabel,
      badgeClass: 'bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-500 text-white shadow-rose-500/25',
      glowClass: 'hover:border-rose-400 dark:hover:border-rose-500 hover:shadow-[0_12px_30px_-6px_rgba(244,63,94,0.35)]',
      textAccent: 'text-rose-600 dark:text-rose-400',
    };
  }
  if (combined.includes('b.com') || combined.includes('bcom')) {
    return {
      degree: 'B.Com',
      badgeClass: 'bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 text-white shadow-teal-500/25',
      glowClass: 'hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-[0_12px_30px_-6px_rgba(20,184,166,0.35)]',
      textAccent: 'text-teal-600 dark:text-teal-400',
    };
  }
  if (combined.includes('law') || combined.includes('llb') || combined.includes('ll.b') || combined.includes('llm') || combined.includes('ll.m')) {
    const degreeLabel = combined.includes('llm') || combined.includes('ll.m') ? 'LL.M' : 'LL.B';
    return {
      degree: degreeLabel,
      badgeClass: 'bg-gradient-to-r from-amber-700 via-yellow-700 to-stone-800 text-white shadow-amber-600/25',
      glowClass: 'hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-[0_12px_30px_-6px_rgba(217,119,6,0.35)]',
      textAccent: 'text-amber-600 dark:text-amber-400',
    };
  }

  const fallback = p.short ? p.short.split(' ')[0] : 'Degree';
  return {
    degree: fallback,
    badgeClass: 'bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 text-white shadow-orange-500/25',
    glowClass: 'hover:border-orange-400 dark:hover:border-orange-500 hover:shadow-[0_12px_30px_-6px_rgba(249,115,22,0.35)]',
    textAccent: 'text-orange-600 dark:text-orange-400',
  };
}

export default function ProgramCard({ p, onView, onAsk, onCompare, isCompared = false, isSelected = false }) {
  const image = PROGRAM_IMAGES[p.id] || PROGRAM_IMAGES['btech-cse'];
  const degreeInfo = getMainDegreeInfo(p);
  const durationText = formatDuration(p.duration);
  const isHighDemand = HIGH_DEMAND_IDS.has(p.id);
  const inCompare = isCompared || isSelected;

  const programFee = fees[p.id] || {
    tuition: '₹1,60,000 / semester (Base)',
    other: '₹5,000 / semester (Examination Fee)',
    scholarship: 'Category I: up to 50% waiver',
  };

  const semFeeMatch = (programFee.tuition || '').match(/₹[\d,]+/);
  const semFeeFormatted = semFeeMatch ? `${semFeeMatch[0]} / sem` : '₹1,60,000 / sem';

  return (
    <div
      onClick={() => onView && onView(p)}
      className={`group relative flex flex-col justify-between rounded-3xl bg-white dark:bg-[#0D131F] border border-slate-200/90 dark:border-slate-800/80 shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 active:scale-[0.99] overflow-hidden cursor-pointer select-none ${degreeInfo.glowClass} ${
        inCompare ? 'ring-2 ring-orange-500 border-transparent shadow-md' : ''
      }`}
      tabIndex={0}
      role="article"
      aria-label={`${p.name} - Click to view complete details`}
    >
      {/* ── CARD TOP BAR (STRICT SPEC: Top-left Main Degree, Top-right Duration) ── */}
      <div className="p-4 pb-3 flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/70 bg-slate-50/70 dark:bg-slate-900/60">
        {/* Top-Left: Main Degree with Shimmer Sweep */}
        <span
          className={`relative overflow-hidden inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider shadow-xs select-none ${degreeInfo.badgeClass}`}
        >
          <GraduationCap size={13} className="shrink-0" />
          <span>{degreeInfo.degree}</span>
          <span
            aria-hidden="true"
            className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
          />
        </span>

        {/* Top-Right: Strictly "X Year Programme" without semesters */}
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-white dark:bg-slate-800 px-3 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
          <Clock size={12} className="text-orange-500 shrink-0" />
          <span>{durationText}</span>
        </span>
      </div>

      {/* ── IMAGE BANNER WITH OVERLAYS (NO TEXT CLASH) ── */}
      <div className="relative h-40 w-full overflow-hidden bg-slate-950 shrink-0">
        <img
          src={image}
          alt={p.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 opacity-85"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

        {/* Bottom Banner Indicators: Stream code on left, High Demand on right */}
        <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
          <span className="rounded-md bg-slate-950/80 backdrop-blur-md text-slate-200 border border-white/10 px-2 py-0.5 text-[11px] font-bold truncate max-w-[180px]">
            {p.short}
          </span>

          {/* High Demand badge strictly on highest enrolled courses */}
          {isHighDemand && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white shadow-xs">
              <Flame size={11} className="fill-white" />
              <span>High Demand</span>
            </span>
          )}
        </div>
      </div>

      {/* ── CARD BODY (CLEAN PADDING & HIERARCHY) ── */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Degree Full Name cleanly positioned below image */}
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug font-display group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
            {p.name}
          </h3>

          {/* Concise Programme Description */}
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed font-sans">
            {p.description}
          </p>
        </div>

        {/* Minimum Marks Requirement */}
        {p.minPercent && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
            <span>Min. {p.minPercent}% aggregate in qualifying examination</span>
          </div>
        )}

        {/* ── CARD FOOTER: SEMESTER FEE & ACTION BUTTONS ── */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
              Semester Fee
            </span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
              {semFeeFormatted}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Compare Toggle Button */}
            {onCompare && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCompare(p.id);
                }}
                className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer ${
                  inCompare
                    ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-orange-50 dark:hover:bg-orange-950/30 text-slate-700 dark:text-slate-300 hover:text-orange-600'
                }`}
                title={inCompare ? 'Remove from Comparison' : 'Add to Compare'}
              >
                <Scale size={12} className={inCompare ? 'text-white' : 'text-orange-500'} />
                <span>{inCompare ? 'Added' : 'Compare'}</span>
              </button>
            )}

            {/* View Details Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onView) onView(p);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 bg-orange-500/10 hover:bg-orange-600 text-orange-600 dark:text-orange-400 hover:text-white hover:dark:text-white border border-orange-500/30 transition-all cursor-pointer shadow-2xs"
            >
              <span>Details</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
