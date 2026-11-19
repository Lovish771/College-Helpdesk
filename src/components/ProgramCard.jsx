import React from 'react';
import { Clock, ArrowRight, GraduationCap, Scale } from 'lucide-react';
import { fees } from '../data/mockData';
import { cleanProgramTitle, getMainDegree, getDegreeTheme } from '../utils/degreeUtils';

// Top enrollment tracks at LPU based on official university admission figures
const HIGH_DEMAND_IDS = new Set(['btech-cse', 'btech-aiml', 'mba', 'bca', 'bsc-agri']);

const formatDuration = (d) => {
  if (!d) return '4 yr programme';
  const num = d.match(/\d+/);
  return num ? `${num[0]} yr programme` : '4 yr programme';
};

/**
 * Extract clean tuition fee string e.g. "₹1,60,000 / sem"
 */
const getFormattedFee = (p) => {
  const f = fees[p.id];
  if (f && f.tuition) {
    const match = f.tuition.match(/₹[\d,]+/);
    if (match) return `${match[0]} / sem`;
  }
  return '₹1,60,000 / sem';
};

export default function ProgramCard({
  p,
  onView,
  onAsk,
  onCompare,
  isSelected = false,
  isFeatured = false,
  onSelect
}) {
  const formattedFee = getFormattedFee(p);
  const mainDegree = getMainDegree(p);
  const theme = getDegreeTheme(mainDegree);
  const title = cleanProgramTitle(p.name, mainDegree);
  const feeParts = formattedFee.split(' / ');
  const feeAmount = feeParts[0] || formattedFee;
  const feePeriod = feeParts[1] ? ` / ${feeParts[1]}` : ' / sem';

  return (
    <div
      onClick={() => {
        if (onSelect) onSelect(p);
        else if (onView) onView(p);
      }}
      className={`group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl p-5 sm:p-5.5 transition-all duration-300 ease-out cursor-pointer select-none overflow-hidden
        bg-white dark:bg-[#0c1322]
        border transition-all duration-300
        ${
          isSelected
            ? 'border-orange-500 ring-2 ring-orange-500/80 shadow-[0_18px_36px_-6px_rgba(234,88,12,0.22)] -translate-y-1.5'
            : isFeatured
            ? 'border-orange-500/60 dark:border-orange-500/60 ring-1 ring-orange-500/30 shadow-[0_18px_36px_-6px_rgba(234,88,12,0.16)] dark:shadow-[0_18px_36px_-6px_rgba(234,88,12,0.24)] -translate-y-1'
            : 'border-slate-200/50 dark:border-slate-800/50 shadow-xs hover:border-orange-500/70 dark:hover:border-orange-400/60 hover:shadow-[0_20px_38px_-8px_rgba(234,88,12,0.18)] dark:hover:shadow-[0_20px_38px_-8px_rgba(234,88,12,0.28)] hover:-translate-y-2'
        }
      `}
      style={{
        transformStyle: 'preserve-3d',
      }}
      role="article"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          if (onSelect) onSelect(p);
          else onView?.(p);
        }
      }}
    >
      {/* Top subtle light reflection */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300/60 dark:via-white/10 to-transparent pointer-events-none"
      />

      {/* Subtle Ambient Color Glow in corner */}
      <div
        aria-hidden="true"
        className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${theme.gradient} opacity-[0.06] blur-2xl transition-all duration-500 group-hover:opacity-[0.12] pointer-events-none`}
      />

      <div>
        {/* ── Row 1: Left = Shining Degree Badge; Right = High Demand + Duration ── */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          {/* Shining degree badge (e.g. B.Tech / MBA / BCA) with shimmer sweep */}
          <div className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider overflow-hidden shadow-2xs select-none shrink-0">
            {/* Degree vibrant gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} opacity-95 group-hover:opacity-100 transition-opacity`} />
            {/* Shimmer light beam */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-shimmer pointer-events-none" />
            <GraduationCap size={13} className="relative z-10 text-white drop-shadow-xs shrink-0" />
            <span className="relative z-10 text-white font-extrabold tracking-wide drop-shadow-xs whitespace-nowrap">
              {mainDegree}
            </span>
          </div>

          {/* Right: High Demand badge (top enrollment only) + Course Duration */}
          <div className="flex items-center gap-1.5 shrink-0">
            {HIGH_DEMAND_IDS.has(p.id) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30 text-amber-700 dark:text-amber-300 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                High Demand
              </span>
            )}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 whitespace-nowrap">
              <Clock size={11} className={`${theme.textAccent} shrink-0`} />
              <span>{formatDuration(p.duration)}</span>
            </div>
          </div>
        </div>

        {/* ── Row 2: Name of the Degree ── */}
        <h3 className="relative z-10 text-base sm:text-[17px] font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug mt-3">
          {title}
        </h3>

        {/* Short clean description */}
        <p className="relative z-10 text-slate-500 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed mt-1.5 font-sans">
          {p.description}
        </p>

        {/* Key Highlights / Eligibility Badge */}
        {p.eligibility && (
          <div className="relative z-10 mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/20 dark:border-emerald-800/40 text-[11px] font-medium text-emerald-800 dark:text-emerald-300 max-w-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="truncate">Min. {p.minPercent || 60}% in 10+2 • LPUNEST / JEE</span>
          </div>
        )}

        {/* ── Row 3: Semester Fee & Scholarship Inset Well ── */}
        <div className="relative z-10 mt-3.5 p-3 rounded-2xl bg-slate-50/90 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/70 flex items-center justify-between">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Tuition Fee
            </span>
            <div className="flex items-baseline gap-0.5 mt-0.5">
              <span className="text-slate-900 dark:text-white font-black text-base tracking-tight">
                {feeAmount}
              </span>
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                {feePeriod}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-tight bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              Up to 50% Waiver
            </span>
            <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-medium text-right mt-0.5">
              LPUNEST Merit
            </span>
          </div>
        </div>
      </div>

      {/* ── Row 4: Action Buttons (Equal Height, Perfectly Balanced) ── */}
      <div className="relative z-10 mt-3.5 pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/90 gap-2.5">
        {onCompare ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCompare(p.id);
            }}
            className={`h-9 px-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer active:scale-95 ${
              isSelected
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs font-bold'
                : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:text-slate-900 dark:hover:text-white shadow-2xs'
            }`}
            title={isSelected ? 'Remove from Comparison' : 'Compare Programme'}
            aria-label={isSelected ? `Remove ${p.name} from comparison` : `Compare ${p.name}`}
          >
            <Scale size={13} className={isSelected ? 'text-orange-400' : 'text-slate-400'} />
            <span className="text-[11px] font-medium">{isSelected ? 'Compared' : 'Compare'}</span>
          </button>
        ) : <div />}

        {/* View Details Button: Primary, prominent */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onView) onView(p);
          }}
          className={`h-9 px-4 rounded-xl border border-transparent text-xs font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-xs active:scale-95 hover:shadow-md hover:scale-[1.02] ${theme.btnClass}`}
        >
          <span>View Details</span>
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}
