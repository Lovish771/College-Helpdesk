import { useEffect, useState, useCallback } from 'react';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';

export function useAsync(fn, deps = []) {
  const [s, setS] = useState({ data: null, loading: true, error: null });
  const load = useCallback(() => {
    setS(x => ({ ...x, loading: true, error: null }));
    fn().then(data => setS({ data, loading: false, error: null }))
       .catch(e  => setS({ data: null, loading: false, error: e.message }));
  }, [fn, ...deps]); // eslint-disable-line
  useEffect(load, [load]);
  return { ...s, reload: load };
}

/** Skeleton loader row with diagonal shimmer */
export function SkeletonRow({ rows = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="relative overflow-hidden h-5 rounded-lg bg-slate-200/80 dark:bg-slate-800/80 before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/30 dark:before:via-white/10 before:to-transparent"
          style={{ width: `${70 + (i % 3) * 10}%` }}
        />
      ))}
    </div>
  );
}

/** Generic async renderer */
export function Async({ state, children, skeletonRows }) {
  if (state.loading) {
    if (skeletonRows) return <SkeletonRow rows={skeletonRows} />;
    return (
      <div className="flex items-center justify-center gap-3 py-16" role="status">
        <Loader2 size={22} className="animate-spin text-orange-600" />
        <span className="text-sm font-medium text-slate-500">Loading university data…</span>
      </div>
    );
  }
  if (state.error) {
    return (
      <div className="rounded-2xl p-8 text-center bg-red-50 border border-red-200" role="alert">
        <AlertCircle size={30} className="mx-auto mb-3 text-red-600" />
        <p className="font-bold text-sm text-red-900">Could not load this content.</p>
        <p className="text-xs mt-1 text-slate-600">{state.error}</p>
        <button
          className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-all shadow-sm"
          onClick={state.reload}
        >
          <RefreshCw size={14} /> Try again
        </button>
      </div>
    );
  }
  if (!state.data) {
    return (
      <div className="rounded-2xl p-8 text-center bg-slate-50 border border-slate-200" role="status">
        <AlertCircle size={28} className="mx-auto mb-3 text-slate-400" />
        <p className="font-bold text-sm text-slate-700">No data available</p>
        <p className="text-xs mt-1 text-slate-500">This content is currently unavailable.</p>
      </div>
    );
  }
  return children(state.data);
}

/** Page header */
export function PageHead({ title, text, badge, children }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
          {title}
        </h1>
        {text && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">{text}</p>}
      </div>
      <div className="flex items-center gap-3">
        {badge && (
          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400">
            {badge}
          </span>
        )}
        {children}
      </div>
    </div>
  );
}
