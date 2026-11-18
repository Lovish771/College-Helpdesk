import { Clock, GraduationCap, ArrowRight, Scale, CheckCircle2 } from 'lucide-react';
import { fees } from '../data/mockData';
import { cleanProgramTitle, getDegreeTheme, getMainDegree } from '../utils/degreeUtils';

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

export default function ProgramCard({ p, onView, onAsk, onCompare, isCompared = false, isSelected = false }) {
  const mainDegree = getMainDegree(p);
  const degreeTheme = getDegreeTheme(mainDegree);
  const title = cleanProgramTitle(p.name, mainDegree);
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
      onKeyDown={(event) => {
        if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          onView?.(p);
        }
      }}
      className={`group relative flex flex-col justify-between rounded-3xl bg-white dark:bg-[#0D131F] border border-slate-200/90 dark:border-slate-800/80 shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl ${degreeTheme.glowBorder} ${degreeTheme.glowShadow} active:scale-[0.99] overflow-hidden cursor-pointer select-none ${
        inCompare ? `ring-2 ${degreeTheme.ringColor} border-transparent shadow-md` : ''
      }`}
      tabIndex={0}
      role="article"
      aria-label={`${title} - Click to view complete details`}
    >
      {/* ── CARD TOP BAR (STRICT SPEC: Top-left Main Degree, Top-right Duration) ── */}
      <div className={`relative p-4 pb-3 flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/70 ${degreeTheme.accentBg}`}>
        <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${degreeTheme.gradient}`} aria-hidden="true" />
        {/* Top-Left: Main Degree with Shimmer Sweep */}
        <span
          className={`relative overflow-hidden inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider shadow-xs select-none bg-gradient-to-r ${degreeTheme.gradient} text-white`}
        >
          <GraduationCap size={13} className="shrink-0" />
          <span>{degreeTheme.label}</span>
          <span
            aria-hidden="true"
            className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
          />
        </span>

        {/* Top-Right: Strictly "X Year Programme" without semesters */}
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-white dark:bg-slate-800 px-3 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
          <Clock size={12} className={degreeTheme.textAccent + ' shrink-0'} />
          <span>{durationText}</span>
        </span>
      </div>

      {/* ── CARD BODY (CLEAN PADDING & HIERARCHY) ── */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {isHighDemand && (
            <div className="mb-2 flex items-center justify-end gap-2">
              <span className={`rounded-full border px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${degreeTheme.badgeBg}`}>
                Popular
              </span>
            </div>
          )}
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug font-display transition-colors line-clamp-2">
            {title}
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
                className={`premium-interaction px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer ${
                  inCompare
                    ? `bg-gradient-to-r ${degreeTheme.gradient} text-white border-transparent shadow-sm`
                    : `border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 ${degreeTheme.textAccent}`
                }`}
                title={inCompare ? 'Remove from Comparison' : 'Add to Compare'}
              >
                <Scale size={12} className={inCompare ? 'text-white' : degreeTheme.textAccent} />
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
              className={`premium-interaction px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 bg-gradient-to-r ${degreeTheme.gradient} text-white border border-transparent transition-all cursor-pointer shadow-sm`}
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
