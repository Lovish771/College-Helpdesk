import React from 'react';
import {
  Clock, ArrowRight, Wallet, Flame, Star, Sparkles,
  Code, Cpu, Wifi, TrendingUp, HeartPulse, Layers, GraduationCap, CheckCircle2, Scale
} from 'lucide-react';
import { fees } from '../data/mockData';
import { cleanProgramTitle, getMainDegree, getDegreeTheme } from '../utils/degreeUtils';

/**
 * Determine dynamic category badge & emblem based on specialization
 */
const getProgramMeta = (p) => {
  const id = (p.id || '').toLowerCase();

  if (id.includes('aiml') || id.includes('ds') || id.includes('ai') || id.includes('data')) {
    return {
      badgeText: 'High Demand',
      badgeIcon: Flame,
      emblemIcon: Cpu,
      emblemColor: 'text-purple-500 dark:text-purple-400',
      emblemBg: 'bg-purple-500/10 dark:bg-purple-950/40 border-purple-500/30'
    };
  }
  if (id.includes('iot') || id.includes('cloud') || id.includes('cyber') || id.includes('devops')) {
    return {
      badgeText: 'Innovative Program',
      badgeIcon: Sparkles,
      emblemIcon: Wifi,
      emblemColor: 'text-cyan-600 dark:text-cyan-400',
      emblemBg: 'bg-cyan-500/10 dark:bg-cyan-950/40 border-cyan-500/30'
    };
  }
  if (id.includes('fullstack') || id.includes('spe') || id.includes('cse') || id.includes('bca') || id.includes('mca')) {
    return {
      badgeText: id.includes('fullstack') ? 'Most Popular' : 'High Demand',
      badgeIcon: id.includes('fullstack') ? Star : Flame,
      emblemIcon: Code,
      emblemColor: 'text-indigo-600 dark:text-indigo-400',
      emblemBg: 'bg-indigo-500/10 dark:bg-indigo-950/40 border-indigo-500/30'
    };
  }
  if (id.includes('bba') || id.includes('mba') || id.includes('bcom')) {
    return {
      badgeText: 'Most Popular',
      badgeIcon: Star,
      emblemIcon: TrendingUp,
      emblemColor: 'text-amber-600 dark:text-amber-400',
      emblemBg: 'bg-amber-500/10 dark:bg-amber-950/40 border-amber-500/30'
    };
  }
  if (id.includes('bpharm') || id.includes('bpt') || id.includes('health') || id.includes('pharm')) {
    return {
      badgeText: 'Innovative Program',
      badgeIcon: Sparkles,
      emblemIcon: HeartPulse,
      emblemColor: 'text-rose-600 dark:text-rose-400',
      emblemBg: 'bg-rose-500/10 dark:bg-rose-950/40 border-rose-500/30'
    };
  }
  if (id.includes('ece') || id.includes('me') || id.includes('civil') || id.includes('aero') || id.includes('biotech')) {
    return {
      badgeText: 'High Demand',
      badgeIcon: Flame,
      emblemIcon: Layers,
      emblemColor: 'text-emerald-600 dark:text-emerald-400',
      emblemBg: 'bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-500/30'
    };
  }

  return {
    badgeText: 'Innovative Program',
    badgeIcon: Sparkles,
    emblemIcon: GraduationCap,
    emblemColor: 'text-orange-600 dark:text-orange-400',
    emblemBg: 'bg-orange-500/10 dark:bg-orange-950/40 border-orange-500/30'
  };
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
  const { badgeText, badgeIcon: BadgeIcon, emblemIcon: EmblemIcon } = getProgramMeta(p);
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
      className={`group relative flex flex-col rounded-[28px] p-5 sm:p-6 transition-all duration-300 ease-out cursor-pointer border select-none overflow-hidden
        bg-white dark:bg-[#0D131F]
        border-slate-200/90 dark:border-slate-800/90
        shadow-[0_10px_30px_-20px_rgba(15,23,42,0.35)] dark:shadow-[0_16px_40px_-26px_rgba(0,0,0,0.85)]
        hover:-translate-y-1.5 hover:scale-[1.01]
        ${theme.glowBorder}
        ${theme.glowShadow}
        ${
          isSelected
            ? `ring-2 ${theme.ringColor} border-transparent shadow-xl scale-[1.02]`
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
      <div aria-hidden="true" className={`absolute -right-12 -top-14 h-36 w-36 rounded-full bg-gradient-to-br ${theme.gradient} opacity-[0.08] blur-2xl transition-all duration-500 group-hover:scale-125 group-hover:opacity-[0.14]`} />
      <div aria-hidden="true" className={`absolute inset-x-6 top-0 h-0.5 bg-gradient-to-r ${theme.gradient} opacity-70`} />

      {/* Degree family emblem, programme highlights and duration */}
      <div className="relative z-10 flex items-start justify-between gap-3 mb-5">
        {/* Emblem Squircle with glowing icon */}
        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-xs transition-transform duration-300 group-hover:scale-110 ${theme.badgeBg}`}>
          <EmblemIcon size={22} className={theme.textAccent} />
        </div>

        {/* Top Floating Badges */}
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 shadow-2xs">
            <BadgeIcon size={11} className={`${theme.textAccent} shrink-0`} />
            <span>{badgeText}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-sm">
            <Clock size={11} className={`${theme.textAccent} shrink-0`} />
            <span>{p.duration || '4 Years'}</span>
          </span>
        </div>
      </div>

      {/* ── PREMIER MAIN DEGREE BAR (SHINING SHIMMER EFFECT + VIBRANT GRADIENT) ── */}
      <div className="relative z-10 flex items-center gap-2 mb-3">
        <div className={`relative inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider overflow-hidden shadow-sm ${theme.glow} select-none transition-transform duration-300 group-hover:scale-105`}>
          {/* Vibrant Gradient Background */}
          <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} opacity-95 group-hover:opacity-100 transition-opacity`} />

          {/* Continuous Ambient Shimmer Light Beam */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-shimmer pointer-events-none" />

          {/* Interactive Hover Sweep */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

          {/* Degree Icon & Bold Label */}
          <GraduationCap size={13} className="relative z-10 text-white drop-shadow-xs" />
          <span className="relative z-10 text-white font-extrabold tracking-wide drop-shadow-xs">
            {mainDegree}
          </span>
        </div>

        <span className="text-slate-300 dark:text-slate-700 text-xs">•</span>
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide">
          {p.degree || 'Degree Program'}
        </span>
      </div>

      {/* Title */}
      <h3 className="relative z-10 text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-100 transition-colors line-clamp-2 leading-snug min-h-[3.25rem]">
        {title}
      </h3>

      {/* Description */}
      <p className="relative z-10 text-slate-600 dark:text-slate-400 text-xs sm:text-sm line-clamp-3 leading-relaxed mt-2.5 font-sans flex-1">
        {p.description}
      </p>

      {/* Highlights row if available */}
      {p.eligibility && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
          <span className="truncate">Min. {p.minPercent || 60}% in Qualifying Exam</span>
        </div>
      )}

      {/* Footer Row: Semester Fee + Action Buttons (Compare & View Details) */}
      <div className="mt-4 pt-4 flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-100 dark:border-slate-800/90 gap-3">
        <div className="flex flex-col rounded-2xl px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium flex items-center gap-1">
            <Wallet size={12} className="text-slate-400 dark:text-slate-500" />
            <span>Semester Fee</span>
          </span>
          <span className="text-slate-900 dark:text-white font-extrabold text-sm sm:text-base tracking-tight mt-0.5">
            {formattedFee}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Functional Compare Toggle Button */}
          {onCompare && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCompare(p.id);
              }}
              className={`premium-interaction px-3 py-2 rounded-full border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                isSelected
                  ? `${theme.btnClass} border-transparent`
                  : `border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/70 ${theme.textAccent} hover:bg-slate-50 dark:hover:bg-slate-800`
              }`}
              title={isSelected ? 'Remove from Comparison' : 'Add to Compare'}
              aria-label={isSelected ? `Remove ${p.name} from comparison` : `Add ${p.name} to comparison`}
            >
              <Scale size={13} className={isSelected ? 'text-white' : theme.textAccent} />
              <span>{isSelected ? 'In Compare' : 'Compare'}</span>
            </button>
          )}

          {/* View Details Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onView) onView(p);
            }}
            className={`premium-interaction px-4 py-2.5 rounded-full border border-transparent text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${theme.btnClass}`}
          >
            <span>View Details</span>
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
