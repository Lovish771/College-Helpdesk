import { useState } from 'react';
import {
  Clock, GraduationCap, ArrowRight, Sparkles, BookOpen,
  Wallet, Award, Scale, ChevronDown, ChevronUp, Briefcase, Trophy
} from 'lucide-react';
import { fees } from '../data/mockData';
import { getProgramEnrichment } from '../data/programDetails';
import SpotlightCard from './SpotlightCard';

export default function ProgramCard({ p, onView, onAsk, onCompare, isCenter = true }) {
  const [showQuickGlimpse, setShowQuickGlimpse] = useState(false);
  const enrichment = getProgramEnrichment(p.id);

  const programFee = fees[p.id] || {
    tuition: '₹1,60,000 / semester (Base)',
    other: '₹5,000 / semester (Examination Fee)',
    scholarship: 'Category I: up to 50% waiver',
  };

  return (
    <div className="group relative w-full isolate">
      {/* ── Background Layer 3 (Deepest card in stack) ── */}
      <div
        aria-hidden="true"
        className={`pointer-events-none select-none absolute inset-0 rounded-3xl bg-slate-100/80 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/60 shadow-xs
          transform-gpu transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isCenter ? 'translate-x-2.5 sm:translate-x-3.5 translate-y-1.5 opacity-40 dark:opacity-30' : 'translate-x-1 translate-y-0.5 opacity-20 dark:opacity-10'}
          group-hover:translate-x-5 sm:group-hover:translate-x-6 group-hover:-translate-y-0.5 group-hover:scale-[0.99] group-hover:opacity-70 dark:group-hover:opacity-50
          group-hover:border-orange-500/25 dark:group-hover:border-orange-500/20 group-hover:shadow-[0_8px_20px_-6px_rgba(234,88,12,0.12)]
          z-0`}
      >
        {/* Subtle top header replica */}
        <div className="h-9 w-full rounded-t-3xl bg-slate-200/40 dark:bg-slate-800/40 border-b border-slate-200/40 dark:border-slate-800/40" />
      </div>

      {/* ── Background Layer 2 (Middle card in stack) ── */}
      <div
        aria-hidden="true"
        className={`pointer-events-none select-none absolute inset-0 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800/80 shadow-sm
          transform-gpu transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isCenter ? 'translate-x-1.5 sm:translate-x-2 translate-y-0.5 opacity-75 dark:opacity-60' : 'translate-x-0.5 translate-y-0 opacity-40 dark:opacity-30'}
          group-hover:translate-x-3 sm:group-hover:translate-x-3.5 group-hover:-translate-y-1 group-hover:opacity-95 dark:group-hover:opacity-85
          group-hover:border-orange-500/40 dark:group-hover:border-orange-500/35 group-hover:shadow-[0_12px_28px_-8px_rgba(234,88,12,0.16)]
          z-[1]`}
      >
        {/* Subtle top badge mimic */}
        <div className="h-10 w-full rounded-t-3xl bg-slate-100/60 dark:bg-slate-800/50 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center px-4 gap-2">
          <div className="w-14 h-2.5 rounded-md bg-orange-100/70 dark:bg-orange-950/40 border border-orange-200/40 dark:border-orange-900/30" />
          <div className="w-16 h-2.5 rounded-md bg-slate-200/70 dark:bg-slate-700/50" />
        </div>
      </div>

      {/* ── Active Degree Card (Front layer) ── */}
      <SpotlightCard
        className={`relative z-10 flex flex-col justify-between p-6 rounded-3xl
          transform-gpu transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${
            isCenter
              ? 'border-orange-500/90 dark:border-orange-500 ring-2 ring-orange-500/25 shadow-[0_20px_50px_-10px_rgba(234,88,12,0.28)] dark:shadow-[0_22px_55px_-12px_rgba(0,0,0,0.92),0_0_30px_-3px_rgba(249,115,22,0.35)]'
              : 'border-slate-200/90 dark:border-slate-800 shadow-sm'
          }
          group-hover:-translate-y-2 group-hover:-translate-x-1
          group-hover:border-orange-500/60 dark:group-hover:border-orange-500/50
          group-hover:shadow-[0_20px_45px_-12px_rgba(234,88,12,0.22)] dark:group-hover:shadow-[0_22px_45px_-12px_rgba(0,0,0,0.85),0_0_20px_-2px_rgba(249,115,22,0.2)]
          active:scale-[0.985] cursor-default`}
        tabIndex={0}
        aria-label={`${p.name} program card`}
      >
      <div>
        {/* Top Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 font-bold text-[11px] border border-orange-200/60 dark:border-orange-900/50">
              <GraduationCap size={13} />
              <span>{p.degree}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-[11px] border border-slate-200/60 dark:border-slate-700/60">
              <Clock size={12} className="text-orange-500" />
              <span>{p.duration}</span>
            </span>
          </div>

          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {p.tags?.[0] || 'Academic'}
          </span>
        </div>

        {/* Programme Identifier & Title */}
        <div className="pt-4">
          <span className="inline-block px-2.5 py-0.5 rounded-md bg-orange-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-xs mb-2">
            {p.short}
          </span>

          <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg leading-snug font-display group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
            {p.name}
          </h3>

          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-sans">
            {p.description}
          </p>
        </div>

        {/* Academic & Fee Metrics Grid */}
        <div className="mt-4 p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-2.5 text-xs font-sans">
          {/* Tuition Fee */}
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
              <Wallet size={13} className="text-slate-400" />
              <span>Semester Fee</span>
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {programFee.tuition.split(' ')[0]} / sem
            </span>
          </div>

          {/* Scholarship */}
          <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
              <Award size={13} className="text-amber-500" />
              <span>LPUNEST Scholarship</span>
            </span>
            <span className="font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded text-[11px] border border-amber-200 dark:border-amber-900/60">
              Up to 50% Off
            </span>
          </div>

          {/* Eligibility */}
          <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Min Eligibility</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {p.minPercent}% in {p.accepts?.[0] || '10+2'}
            </span>
          </div>
        </div>

        {/* Expandable "Quick Glimpse" Accordion */}
        {showQuickGlimpse && (
          <div
            id={`quick-glimpse-${p.id}`}
            className="mt-3.5 p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-200 animate-scale-up space-y-3"
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
                <span>Semester 1 Subjects:</span>
              </p>
              <div className="space-y-1">
                {enrichment.semester1Subjects.slice(0, 4).map((subj) => (
                  <div
                    key={subj.code}
                    className="flex items-center justify-between text-[11px] py-0.5 border-b border-slate-200/50 dark:border-slate-700/50 last:border-0"
                  >
                    <span className="truncate max-w-[170px] text-slate-800 dark:text-slate-200">
                      <strong className="text-slate-900 dark:text-white font-mono mr-1">{subj.code}:</strong>
                      {subj.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700 font-bold shrink-0 text-slate-700 dark:text-slate-300">
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
                <span>Key Career Tracks:</span>
              </p>
              <div className="flex flex-wrap gap-1">
                {enrichment.careerTracks.map((role) => (
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
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onView(p)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-3 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:brightness-105 active:scale-[0.98] cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500"
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
            onClick={() => onAsk(`Tell me about admission, fees, and eligibility for ${p.short}`)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 active:scale-[0.98] cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500"
            aria-label={`Ask AI about ${p.short}`}
          >
            <Sparkles size={12} className="text-orange-500" />
            <span>Ask AI</span>
          </button>
        </div>

        <div className="flex items-center justify-between pt-1">
          {onCompare && (
            <button
              type="button"
              onClick={() => onCompare(p.id)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors py-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
              aria-label={`Add ${p.short} to comparison matrix`}
            >
              <Scale size={12} />
              <span>+ Compare Degree</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowQuickGlimpse((prev) => !prev)}
            aria-expanded={showQuickGlimpse}
            aria-controls={`quick-glimpse-${p.id}`}
            className="inline-flex items-center gap-1 text-right text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors py-1 cursor-pointer ml-auto focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
          >
            <span>{showQuickGlimpse ? 'Hide Glimpse' : 'Quick Glimpse'}</span>
            {showQuickGlimpse ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      </div>
    </SpotlightCard>
    </div>
  );
}
