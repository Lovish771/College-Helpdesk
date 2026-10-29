import { useState } from 'react';
import { CheckCircle2, XCircle, Check, Sparkles, FileText, ArrowRight } from 'lucide-react';
import { programs, qualifications } from '../data/mockData';
import { checkEligibility, getDocuments } from '../api/programsApi';
import { useAsync, Async, PageHead } from '../utils/useAsync';

export default function Eligibility({ ask }) {
  const [f, setF] = useState({ programId: programs[0].id, qualification: qualifications[0], percent: '' });
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [done, setDone] = useState({});
  const docs = useAsync(getDocuments);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const n = Number(f.percent);
    if (!(n >= 0 && n <= 100) || f.percent === '') {
      setErr('Please enter a valid percentage between 0 and 100.');
      return;
    }
    setErr('');
    setBusy(true);
    try {
      setRes(await checkEligibility(f));
    } catch {
      setErr('Could not check eligibility. Please try again.');
    }
    setBusy(false);
  };

  const selectClasses =
    'w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-950/40 cursor-pointer';

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-12">
        <PageHead
          title="Eligibility & Required Documents"
          text="Evaluate your academic qualifications against programme entry criteria and track your application document checklist."
          badge="Eligibility Checker"
        />

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Eligibility Form */}
          <form
            onSubmit={submit}
            className="flex flex-col justify-between rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm"
          >
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white font-display">
                  <Sparkles size={18} className="text-orange-600 dark:text-orange-400" />
                  Check Programme Eligibility
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Instant criteria validation based on LPU admission guidelines.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-700 dark:text-slate-300">
                  Desired Programme
                </label>
                <select
                  className={selectClasses}
                  value={f.programId}
                  onChange={set('programId')}
                >
                  {programs.map(p => (
                    <option key={p.id} value={p.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-700 dark:text-slate-300">
                  Qualifying Examination / Stream
                </label>
                <select
                  className={selectClasses}
                  value={f.qualification}
                  onChange={set('qualification')}
                >
                  {qualifications.map(q => (
                    <option key={q} value={q} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {q}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-700 dark:text-slate-300">
                  Percentage or Equivalent Grade (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={f.percent}
                  onChange={set('percent')}
                  placeholder="e.g. 78.5"
                  className="w-full rounded-xl px-4 py-2.5 text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-950/40"
                />
              </div>

              {err && (
                <p role="alert" className="text-xs font-semibold text-red-600 dark:text-red-400">
                  {err}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition-all hover:bg-orange-700 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                }}
              >
                {busy ? 'Evaluating Eligibility…' : 'Check Eligibility Now'}
              </button>

              {res && (
                <div
                  role="status"
                  className={`flex gap-3.5 rounded-xl p-4 text-sm animate-fade-in ${
                    res.eligible
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 border border-red-200 dark:border-red-800'
                  }`}
                >
                  {res.eligible ? (
                    <CheckCircle2 size={20} className="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <XCircle size={20} className="shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                  )}
                  <div>
                    <p className="font-semibold leading-relaxed">{res.message}</p>
                    <button
                      type="button"
                      className="mt-2 text-xs font-semibold underline flex items-center gap-1 text-orange-600 dark:text-orange-400 hover:text-orange-700 cursor-pointer"
                      onClick={() => ask('What are the eligibility criteria?')}
                    >
                      Ask the AI assistant for clarification <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Required Documents Checklist */}
          <div className="flex flex-col justify-between rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-orange-600 dark:text-orange-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                  Document Checklist
                </h2>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Keep these verified documents handy during online application or physical counselling.
              </p>

              <Async state={docs}>
                {list => (
                  <div className="mt-6 space-y-3">
                    {list.map(d => {
                      const isChecked = !!done[d];
                      return (
                        <label
                          key={d}
                          className={`flex cursor-pointer items-center gap-3.5 rounded-xl p-3.5 text-sm transition-all select-none border ${
                            isChecked
                              ? 'bg-orange-50/60 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800 text-slate-900 dark:text-white'
                              : 'bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={isChecked}
                            onChange={() => setDone({ ...done, [d]: !isChecked })}
                          />
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                              isChecked
                                ? 'bg-orange-600 border-orange-600 text-white'
                                : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'
                            }`}
                          >
                            {isChecked && <Check size={13} strokeWidth={3} />}
                          </span>
                          <span className={isChecked ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                            {d}
                          </span>
                        </label>
                      );
                    })}

                    <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>
                        <strong className="font-bold text-orange-600 dark:text-orange-400">
                          {Object.values(done).filter(Boolean).length}
                        </strong> of {list.length} documents ready
                      </span>
                      {Object.values(done).filter(Boolean).length === list.length && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">All documents ready!</span>
                      )}
                    </div>
                  </div>
                )}
              </Async>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
