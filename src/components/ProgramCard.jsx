import React from 'react';
import {
  Clock, ArrowRight, Wallet, Flame, Star, Sparkles,
  Code, Cpu, Wifi, TrendingUp, HeartPulse, Layers, GraduationCap
} from 'lucide-react';
import { fees } from '../data/mockData';
import { PROGRAM_IMAGES } from '../data/programImages';

/**
 * Determine dynamic category badge & emblem based on specialization
 * Matches new_design.png layout:
 * - Badge: ★ Most Popular | 🔥 High Demand | 💡 Innovative Program
 * - Emblem squircle floating at bottom-left of card image banner
 */
const getProgramMeta = (p) => {
  const id = (p.id || '').toLowerCase();

  if (id.includes('aiml') || id.includes('ds') || id.includes('ai') || id.includes('data')) {
    return {
      badgeText: 'High Demand',
      badgeIcon: Flame,
      emblemIcon: Cpu,
      emblemColor: 'text-purple-400'
    };
  }
  if (id.includes('iot') || id.includes('cloud') || id.includes('cyber') || id.includes('devops')) {
    return {
      badgeText: 'Innovative Program',
      badgeIcon: Sparkles,
      emblemIcon: Wifi,
      emblemColor: 'text-cyan-400'
    };
  }
  if (id.includes('fullstack') || id.includes('spe') || id.includes('cse') || id.includes('bca') || id.includes('mca')) {
    return {
      badgeText: id.includes('fullstack') ? 'Most Popular' : 'High Demand',
      badgeIcon: id.includes('fullstack') ? Star : Flame,
      emblemIcon: Code,
      emblemColor: 'text-cyan-400'
    };
  }
  if (id.includes('bba') || id.includes('mba') || id.includes('bcom')) {
    return {
      badgeText: 'Most Popular',
      badgeIcon: Star,
      emblemIcon: TrendingUp,
      emblemColor: 'text-amber-400'
    };
  }
  if (id.includes('bpharm') || id.includes('bpt') || id.includes('health') || id.includes('pharm')) {
    return {
      badgeText: 'Innovative Program',
      badgeIcon: Sparkles,
      emblemIcon: HeartPulse,
      emblemColor: 'text-rose-400'
    };
  }
  if (id.includes('ece') || id.includes('me') || id.includes('civil') || id.includes('aero') || id.includes('biotech')) {
    return {
      badgeText: 'High Demand',
      badgeIcon: Flame,
      emblemIcon: Layers,
      emblemColor: 'text-orange-400'
    };
  }

  return {
    badgeText: 'Innovative Program',
    badgeIcon: Sparkles,
    emblemIcon: GraduationCap,
    emblemColor: 'text-orange-400'
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
  const { badgeText, badgeIcon: BadgeIcon, emblemIcon: EmblemIcon, emblemColor } = getProgramMeta(p);
  const imageUrl = PROGRAM_IMAGES[p.id] || PROGRAM_IMAGES['btech-cse'] || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80';
  const formattedFee = getFormattedFee(p);

  return (
    <div
      onClick={() => {
        if (onSelect) onSelect(p);
        else if (onView) onView(p);
      }}
      className={`group relative flex flex-col rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer border select-none
        bg-[#0D131F] dark:bg-[#0D131F] border-slate-800/80 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10
        ${
          isSelected
            ? 'ring-2 ring-orange-500 border-orange-500 shadow-xl shadow-orange-500/20 scale-[1.02]'
            : 'hover:-translate-y-1'
        }`}
    >
      {/* Top Banner Image with Gradient & Floating Badges */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-900 shrink-0">
        <img
          src={imageUrl}
          alt={p.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D131F] via-[#0D131F]/30 to-black/60" />

        {/* Floating Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-orange-500/30 text-orange-400 text-[11px] font-bold shadow-md">
            <BadgeIcon size={12} className="text-orange-400 shrink-0" />
            <span>{badgeText}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-slate-300 text-[11px] font-medium shadow-md">
            <Clock size={12} className="text-orange-400 shrink-0" />
            <span>{p.duration || '4 Years (8 Semesters)'}</span>
          </span>
        </div>

        {/* Floating Emblem Squircle */}
        <div className="absolute -bottom-3 left-4 w-11 h-11 rounded-2xl bg-[#0B101D]/90 backdrop-blur-md border border-white/15 flex items-center justify-center shadow-xl z-10 group-hover:scale-105 transition-transform">
          <EmblemIcon size={19} className={emblemColor} />
        </div>
      </div>

      {/* Card Content */}
      <div className="pt-6 px-5 pb-5 flex-1 flex flex-col">
        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
          {p.name}
        </h3>

        <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 leading-relaxed mt-2 font-sans">
          {p.description}
        </p>

        {/* Footer Row */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-800/80">
          <div className="flex flex-col">
            <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
              <Wallet size={12} className="text-slate-400" />
              <span>Semester Fee</span>
            </span>
            <span className="text-white font-extrabold text-sm sm:text-base tracking-tight mt-0.5">
              {formattedFee}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onView) onView(p);
            }}
            className="px-4 py-2 rounded-full border border-orange-500/60 hover:bg-orange-600 text-orange-400 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            <span>View Details</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
