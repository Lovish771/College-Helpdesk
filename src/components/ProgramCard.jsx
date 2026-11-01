import React from 'react';
import {
  Clock, ArrowRight, Wallet, Flame, Star, Sparkles,
  Code, Cpu, Wifi, TrendingUp, HeartPulse, Layers, GraduationCap, CheckCircle2
} from 'lucide-react';
import { fees } from '../data/mockData';

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
      emblemColor: 'text-orange-600 dark:text-orange-400',
      emblemBg: 'bg-orange-500/10 dark:bg-orange-950/40 border-orange-500/30'
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
  const { badgeText, badgeIcon: BadgeIcon, emblemIcon: EmblemIcon, emblemColor, emblemBg } = getProgramMeta(p);
  const formattedFee = getFormattedFee(p);

  return (
    <div
      onClick={() => {
        if (onSelect) onSelect(p);
        else if (onView) onView(p);
      }}
      className={`group relative flex flex-col rounded-3xl p-6 transition-all duration-300 cursor-pointer border select-none
        bg-white dark:bg-[#0D131F] border-slate-200/90 dark:border-slate-800/90
        shadow-sm dark:shadow-md
        hover:-translate-y-2.5 hover:scale-[1.015] hover:border-orange-500/60
        hover:shadow-[0_20px_45px_-10px_rgba(249,115,22,0.22)] dark:hover:shadow-[0_25px_50px_-12px_rgba(249,115,22,0.28)]
        ${
          isSelected
            ? 'ring-2 ring-orange-500 border-orange-500 shadow-xl shadow-orange-500/20 scale-[1.02]'
            : ''
        }`}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Top Header: Emblem Squircle + Badges */}
      <div className="flex items-start justify-between gap-3 mb-4">
        {/* Emblem Squircle with glowing icon */}
        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-xs transition-transform duration-300 group-hover:scale-110 ${emblemBg}`}>
          <EmblemIcon size={22} className={emblemColor} />
        </div>

        {/* Top Floating Badges */}
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-500/40 text-orange-600 dark:text-orange-400 shadow-2xs">
            <BadgeIcon size={11} className="shrink-0" />
            <span>{badgeText}</span>
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-medium bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 shadow-2xs">
            <Clock size={11} className="text-orange-500 shrink-0" />
            <span>{p.duration || '4 Years'}</span>
          </span>
        </div>
      </div>

      {/* Program Code & Degree Eyebrow */}
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[11px] font-extrabold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
          {p.degree || 'Degree'}
        </span>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <span className="text-[11px] font-mono font-semibold text-slate-400 dark:text-slate-500">
          {p.short || p.id}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
        {p.name}
      </h3>

      {/* Description */}
      <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm line-clamp-3 leading-relaxed mt-2.5 font-sans flex-1">
        {p.description}
      </p>

      {/* Highlights row if available */}
      {p.eligibility && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
          <span className="truncate">Min. {p.minPercent || 60}% Aggregate in Qualifying Exam</span>
        </div>
      )}

      {/* Footer Row: Semester Fee + Action Button */}
      <div className="mt-4 pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/90 gap-2">
        <div className="flex flex-col">
          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium flex items-center gap-1">
            <Wallet size={12} className="text-slate-400 dark:text-slate-500" />
            <span>Semester Fee</span>
          </span>
          <span className="text-slate-900 dark:text-white font-extrabold text-sm sm:text-base tracking-tight mt-0.5">
            {formattedFee}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onView) onView(p);
          }}
          className="px-4 py-2 rounded-full border border-orange-500/70 hover:bg-orange-600 bg-orange-500/5 hover:text-white text-orange-600 dark:text-orange-400 hover:dark:text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
        >
          <span>View Details</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
