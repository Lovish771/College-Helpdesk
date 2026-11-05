import { useState } from 'react';
import {
  Clock, GraduationCap, ArrowRight, Sparkles, BookOpen,
  Wallet, Award, Scale, ChevronDown, ChevronUp, Briefcase, Trophy
} from 'lucide-react';
import { PROGRAM_IMAGES } from '../data/programImages';
import { fees } from '../data/mockData';
import { getProgramEnrichment } from '../data/programDetails';

export default function ProgramCard({ p, onView, onAsk, onCompare }) {
  const [showQuickGlimpse, setShowQuickGlimpse] = useState(false);
  const image = PROGRAM_IMAGES[p.id] || PROGRAM_IMAGES['btech-cse'];
  const enrichment = getProgramEnrichment(p.id);

  const programFee = fees[p.id] || {
    tuition: '₹1,60,000 / semester (Base)',
    other: '₹5,000 / semester (Examination Fee)',
    scholarship: 'Category I: up to 50% waiver',
  };

  return (
    <div
      className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:-translate-y-1 hover:shadow-xl hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-200 active:scale-[0.99] overflow-hidden"
      tabIndex={0}
      aria-label={`${p.name} program card`}
    >
      {/* Top Banner Image with Overlay */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={image}
          alt={p.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />

        {/* Floating Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-orange-600 dark:text-orange-400 shadow-sm border border-slate-200/50 dark:border-slate-700">
            <GraduationCap size={13} />
            {p.degree}
          </span>

          <span className="inline-flex items-center gap-1 rounded-lg bg-slate-900/85 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white border border-white/20">
            <Clock size={12} className="text-orange-400" />
            {p.duration}
          </span>
        </div>

        {/* Stream / Tag Pill on bottom of image */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between">
          <span className="rounded-md bg-orange-600/95 backdrop-blur-sm text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-xs">
            {p.short}
          </span>
          <span className="text-[11px] font-medium text-slate-200 drop-shadow-sm truncate max-w-[150px]">
            {p.tags?.[0] || 'Engineering'}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Programme Full Title */}
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug font-display group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
            {p.name}
          </h3>

          {/* Quick Info Grid */}
          <div className="mt-3.5 space-y-2 text-xs font-sans">
            {/* Tuition Fee */}
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1 font-medium">
                <Wallet size={12} className="text-slate-500" />
                Semester Fee
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {programFee.tuition.split(' ')[0]} / sem
              </span>
            </div>

            {/* Scholarship */}
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1 font-medium">
                <Award size={12} className="text-amber-500" />
                LPUNEST Scholarship
              </span>
              <span className="font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded text-[11px] border border-amber-200 dark:border-amber-900/60">
                Up to 50% Off
              </span>
            </div>

            {/* Eligibility */}
            <div className="flex items-center justify-between py-1 text-slate-600 dark:text-slate-300 font-medium">
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
              className="mt-3.5 p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-200 animate-fade-in space-y-3"
            >
              {/* NIRF Rank Badge */}
              <div className="flex items-center gap-2 p-2 rounded-lg bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/50 text-orange-800 dark:text-orange-300 font-semibold text-[11px]">
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
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onView(p)}
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
              onClick={() => onAsk(`Tell me about admission, fees, and eligibility for ${p.short}`)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 active:scale-[0.98] cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
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
              className="inline-flex items-center gap-1 text-right text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors py-1 cursor-pointer ml-auto focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
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

