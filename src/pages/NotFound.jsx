import React from 'react';
import { Compass, Home as HomeIcon, MessageSquare } from 'lucide-react';

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'chat', label: 'Ask the helpdesk' },
  { id: 'programs', label: 'Programmes' },
  { id: 'fees', label: 'Fees' },
  { id: 'hostel', label: 'Hostel' },
  { id: 'contact', label: 'Contact' },
];

export default function NotFound({ go }) {
  return (
    <div className="container-page section">
      <div className="mx-auto max-w-xl">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <Compass className="h-4 w-4" aria-hidden="true" />
          <span className="text-xs font-medium uppercase tracking-wide">Error 404</span>
        </div>

        <h1 className="mt-3 text-h1 sm:text-display text-slate-900 dark:text-white">
          That page doesn&rsquo;t exist
        </h1>
        <p className="mt-3 text-body leading-relaxed text-slate-600 dark:text-slate-400">
          The link may be out of date, or the address may have a typo. Nothing on this site is
          lost &mdash; pick a destination below, or ask the helpdesk a question directly.
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button type="button" onClick={() => go('home')} className="btn-primary">
            <HomeIcon className="h-4 w-4" aria-hidden="true" />
            Back to home
          </button>
          <button type="button" onClick={() => go('chat')} className="btn-secondary">
            <MessageSquare className="h-4 w-4" aria-hidden="true" />
            Ask a question
          </button>
        </div>

        <div className="card mt-8 p-5">
          <h2 className="text-h3 text-slate-900 dark:text-white">Popular pages</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {LINKS.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => go(l.id)}
                  className="chip hover:border-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
