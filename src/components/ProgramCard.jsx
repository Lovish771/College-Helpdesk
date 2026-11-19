import React from 'react';
import { Clock, ArrowRight, Wallet, GraduationCap, Scale } from 'lucide-react';
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
 * Extract clean tuition fee string e.g. "₹2,00,000 / sem"
 */
const getFormattedFee = (p) => {
  const f = fees[p.id];
  if (f && f.tuition) {
    const match = f.tuition.match(/₹[\d,]+/);
    if (match) return `${match[0]} / sem`;
  }
  return '₹2,00,000 / sem';
};

export default function ProgramCard({
  p,
  onView,
  onAsk,
  onCompare,
  isSelected = false,
  onSelect
}) {
  const formattedFee = getFormattedFee(p);
  const mainDegree = getMainDegree(p);
  const theme = getDegreeTheme(mainDegree);
  const title = cleanProgramTitle(p.name, mainDegree);

  return (
    <div
      onClick={() => {
        if (onSelect) onSelect(p);
        else if (onView) onView(p);
      }}
      className={`group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl p-4 sm:p-5 transition-all duration-300 ease-out cursor-pointer border select-none overflow-hidden
        bg-white dark:bg-[#0D131F]
        border-slate-200/90 dark:border-slate-800/90
        shadow-[0_4px_20px_-10px_rgba(15,23,42,0.15)] dark:shadow-[0_8px_30px_-16px_rgba(0,0,0,0.65)]
        hover:-translate-y-1.5 hover:shadow-xl
        ${theme.glowBorder}
        ${theme.glowShadow}
        ${
          isSelected
            ? `ring-2 ${theme.ringColor} border-transparent shadow-md scale-[1.01]`
            : ''
        }`}
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
      {/* Subtle Ambient Color Glow Top Edge */}
      <div aria-hidden="true" className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${theme.gradient} opacity-[0.08] blur-xl transition-all duration-500 group-hover:opacity-[0.14]`} />

      <div>
        {/* ── Row 1: Left = Shining Degree Badge; Right = High Demand (if top enrolled) + Duration ── */}
        <div className="relative z-10 flex items-center justify-between gap-2 mb-3">
          {/* Shining degree badge (e.g. B.Tech / MBA / BCA) with shimmer sweep */}
          <div className={`relative inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider overflow-hidden shadow-xs select-none shrink-0 ${theme.glow}`}>
            {/* Degree vibrant gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} opacity-95 group-hover:opacity-100 transition-opacity`} />
            {/* Shimmer light beam */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-shimmer pointer-events-none" />
            <GraduationCap size={13} className="relative z-10 text-white drop-shadow-xs shrink-0" />
            <span className="relative z-10 text-white font-extrabold tracking-wide drop-shadow-xs whitespace-nowrap">
              {mainDegree}
            </span>
          </div>

          {/* Right: High Demand badge (top enrollment only) + Course Duration ("4 yr programme") */}
          <div className="flex items-center gap-1.5 shrink-0">
            {HIGH_DEMAND_IDS.has(p.id) && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 dark:bg-orange-950/40 border border-orange-500/30 text-orange-600 dark:text-orange-400 whitespace-nowrap">
                High Demand
              </span>
            )}
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 whitespace-nowrap">
              <Clock size={11} className={`${theme.textAccent} shrink-0`} />
              <span>{formatDuration(p.duration)}</span>
            </div>
          </div>
        </div>

        {/* ── Row 2: Name of the Degree ── */}
        <h3 className="relative z-10 text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-100 transition-colors line-clamp-2 leading-snug">
          {title}
        </h3>

        {/* Short clean description */}
        <p className="relative z-10 text-slate-600 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed mt-2 font-sans">
          {p.description}
        </p>

        {/* Key Highlights / Eligibility Badge - prevents card from feeling too small or empty */}
        {p.eligibility && (
          <div className="relative z-10 mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="truncate">Min. {p.minPercent || 60}% in 10+2 • LPUNEST / JEE</span>
          </div>
        )}

        {/* ── Row 3: Semester Fee & Scholarship ── */}
        <div className="relative z-10 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-baseline justify-between">
          <div>
            <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Tuition Fee
            </span>
            <span className="text-slate-900 dark:text-white font-extrabold text-sm sm:text-base tracking-tight">
              {formattedFee}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              Up to 50% Waiver
            </span>
            <span className="text-[10px] text-slate-400 font-medium">LPUNEST Merit</span>
          </div>
        </div>
      </div>

      {/* ── Row 4: Action Buttons (Compare & View Details) with 3D click micro-interaction ── */}
      <div className="relative z-10 mt-3 pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/90 gap-2">
        {/* Compare feature: more subtle / lesser than View Details & themed */}
        {onCompare ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCompare(p.id);
            }}
            className={`premium-interaction px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 active:translate-y-0.5 ${
              isSelected
                ? `${theme.badgeBg} border-current shadow-xs font-bold`
                : 'border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:text-slate-900 dark:hover:text-white'
            }`}
            title={isSelected ? 'Remove from Comparison' : 'Compare Programme'}
            aria-label={isSelected ? `Remove ${p.name} from comparison` : `Compare ${p.name}`}
          >
            <Scale size={12} className={isSelected ? theme.textAccent : 'text-slate-400'} />
            <span className="text-[11px]">{isSelected ? '✓ Compared' : 'Compare'}</span>
          </button>
        ) : <div />}

        {/* View Details Button: Primary, prominent */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onView) onView(p);
          }}
          className={`premium-interaction px-3.5 py-1.5 rounded-xl border border-transparent text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 active:translate-y-0.5 ${theme.btnClass}`}
        >
          <span>View Details</span>
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}
