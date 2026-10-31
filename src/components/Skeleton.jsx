import React from 'react';

/**
 * Base shimmering block with fluid diagonal light sheen
 */
export function SkeletonBlock({ className = '' }) {
  return (
    <div
      className={`relative overflow-hidden bg-slate-200/80 dark:bg-slate-800/80 rounded-lg before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/30 dark:before:via-white/10 before:to-transparent ${className}`}
      aria-hidden="true"
    />
  );
}

/**
 * Skeleton matching ProgramCard layout
 */
export function CourseCardSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-4">
      {/* Top Badges Row Placeholder */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <SkeletonBlock className="h-6 w-24 rounded-lg" />
          <SkeletonBlock className="h-6 w-20 rounded-lg" />
        </div>
        <SkeletonBlock className="h-4 w-16" />
      </div>

      {/* Card Body */}
      <div className="flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Code & Title Placeholder */}
          <SkeletonBlock className="h-4 w-16 rounded" />
          <SkeletonBlock className="h-6 w-3/4 rounded-md" />
          <SkeletonBlock className="h-4 w-full rounded-md" />

          {/* Quick info grid */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
              <SkeletonBlock className="h-3 w-20" />
              <SkeletonBlock className="h-3 w-24" />
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
              <SkeletonBlock className="h-3 w-28" />
              <SkeletonBlock className="h-3 w-20" />
            </div>
            <div className="flex justify-between py-1">
              <SkeletonBlock className="h-3 w-24" />
              <SkeletonBlock className="h-3 w-20" />
            </div>
          </div>
        </div>

        {/* Buttons footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <SkeletonBlock className="h-9 rounded-xl" />
            <SkeletonBlock className="h-9 rounded-xl" />
          </div>
          <div className="flex justify-between pt-1">
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="h-3 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Grid of Course Card Skeletons
 */
export function CourseGridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton for Fee Table / Planner
 */
export function FeeTableSkeleton() {
  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-6">
      <div className="space-y-2">
        <SkeletonBlock className="h-6 w-48 rounded-md" />
        <SkeletonBlock className="h-4 w-96 rounded-md" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-3">
            <SkeletonBlock className="h-4 w-20" />
            <SkeletonBlock className="h-8 w-28" />
            <SkeletonBlock className="h-3 w-32" />
          </div>
        ))}
      </div>
      <div className="space-y-3 pt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

/**
 * Full page fallback skeleton
 */
export default function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 pb-20 animate-fade-in" role="status" aria-label="Loading page content">
      {/* Hero placeholder */}
      <div className="bg-slate-900 py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="flex justify-center">
            <SkeletonBlock className="h-6 w-44 rounded-full" />
          </div>
          <div className="flex justify-center">
            <SkeletonBlock className="h-10 sm:h-12 w-3/4 rounded-xl" />
          </div>
          <div className="flex justify-center">
            <SkeletonBlock className="h-4 w-1/2 rounded-md" />
          </div>
          <div className="flex justify-center pt-2">
            <SkeletonBlock className="h-12 w-full max-w-xl rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <SkeletonBlock className="h-8 w-24 rounded-full" />
          <SkeletonBlock className="h-8 w-28 rounded-full" />
          <SkeletonBlock className="h-8 w-32 rounded-full" />
        </div>
        <CourseGridSkeleton count={6} />
      </div>
    </div>
  );
}
