import React from 'react';
import {
  MapPin, Award, TrendingUp, ChevronRight, ExternalLink,
  Building2, PhoneCall, MessageCircle, Mail, Users, Headset, HeartPulse,
  Landmark, ShieldAlert, ShieldCheck, Sparkles, BookOpen
} from 'lucide-react';
import LpuLogo from './LpuLogo';

export default function Footer({ go, onOpenCompare, onOpenLegal }) {
  const handleLegal = (tab) => {
    if (onOpenLegal) {
      onOpenLegal(tab);
    }
  };

  return (
    <footer className="bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 pt-12 pb-8 border-t border-slate-200 dark:border-slate-800 font-sans relative overflow-hidden transition-colors duration-300">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 dark:bg-orange-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* MANDATORY PROMINENT DISCLAIMER BANNER */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Student-Developed Project (Unofficial Helpdesk)
              </h4>
              <p className="text-xs sm:text-sm text-amber-800/90 dark:text-amber-300/90 mt-1 leading-relaxed">
                This is a student-developed, unofficial helpdesk project. It is not affiliated with, endorsed by, or an official website or chatbot of Lovely Professional University. Information is compiled from publicly available sources and verified for Academic Session 2026-27.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleLegal('disclaimer')}
            className="shrink-0 text-xs font-bold text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 underline flex items-center gap-1 self-end md:self-center cursor-pointer"
          >
            <span>Read Full Disclaimer</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1: Brand & Identity (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <div className="shrink-0">
                <LpuLogo size={42} />
              </div>
              <div className="flex flex-col justify-center leading-none">
                <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white">
                  Student Helpdesk
                </span>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  Admissions, Courses &amp; Living Guide
                </span>
              </div>
            </div>

            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold tracking-wide">
              Academic Session 2026-27 • Phagwara, Punjab
            </p>

            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-3.5 leading-relaxed pr-2">
              Comprehensive student guidance portal covering 44 accredited programs, LPUNEST scholarship slabs, residential accommodations, and campus resources.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/70 dark:bg-orange-950/60 border border-orange-300/60 dark:border-orange-800 text-orange-700 dark:text-orange-300 text-xs font-bold shadow-2xs">
                <Award className="w-3.5 h-3.5" />
                <span>NAAC A++ (3.68/4)</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 dark:bg-blue-950/60 border border-blue-300/60 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold shadow-2xs">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>NIRF Top 30</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2.5 mt-5">
              <button
                onClick={() => go && go('chat')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Ask AI Assistant</span>
              </button>
              {onOpenCompare && (
                <button
                  onClick={() => onOpenCompare()}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-transform active:scale-95 cursor-pointer"
                >
                  <Landmark className="w-3.5 h-3.5" />
                  <span>Compare Degrees</span>
                </button>
              )}
            </div>
          </div>

          {/* Column 2: Academics (2 Cols) */}
          <div className="lg:col-span-2">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3.5">
              Academics
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => go && go('programs')}
                  className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-orange-500 shrink-0" />
                  <span>44 Degree Programs</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => go && go('fees')}
                  className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-orange-500 shrink-0" />
                  <span>Fee Calculator</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => go && go('admissions')}
                  className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-orange-500 shrink-0" />
                  <span>LPUNEST 2026-27</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => go && go('curriculum')}
                  className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-orange-500 shrink-0" />
                  <span>Syllabi &amp; Modules</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => go && go('eligibility')}
                  className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-orange-500 shrink-0" />
                  <span>Eligibility Check</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Campus & Living (2 Cols) */}
          <div className="lg:col-span-2">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3.5">
              Campus Life
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => go && go('hostel')}
                  className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-orange-500 shrink-0" />
                  <span>Hostels &amp; Living</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => go && go('contact')}
                  className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-orange-500 shrink-0" />
                  <span>Campus Helpdesk</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => go && go('knowledge')}
                  className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-orange-500 shrink-0" />
                  <span>Knowledge Base</span>
                </button>
              </li>
              <li>
                <a
                  href="https://ums.lpu.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-orange-500 shrink-0" />
                  <span>Official UMS Portal</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-50" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Campus contacts (4 Cols) */}
          <div className="lg:col-span-4">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3.5">
              Verified Contacts
            </h3>

            <div className="space-y-3">
              {/* Admissions Block 30 */}
              <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                  <Building2 className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 shrink-0" />
                  <span>Division of Admissions (Block 30)</span>
                </h4>
                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>Toll-Free: <a href="tel:18001024431" className="font-bold text-slate-900 dark:text-white hover:text-orange-600">1800 102 4431</a></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>Email: <a href="mailto:admissions@lpu.co.in" className="hover:text-orange-600 underline font-medium">admissions@lpu.co.in</a></span>
                  </div>
                </div>
              </div>

              {/* Student Relations Block 29 */}
              <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                  <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Div. of Student Relations (Block 29)</span>
                </h4>
                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Headset className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>DSR Desk: <strong className="text-slate-900 dark:text-white">Ext 2901 / 2902</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>Email: <a href="mailto:dsr@lpu.co.in" className="hover:text-emerald-600 underline font-medium">dsr@lpu.co.in</a></span>
                  </div>
                </div>
              </div>

              {/* Emergency Uni-Hospital */}
              <div className="flex justify-between items-center bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 rounded-xl p-2.5 px-3.5 text-xs">
                <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-medium">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>Uni-Hospital 24/7 Helpline</span>
                </div>
                <a href="tel:01824517000" className="font-extrabold text-slate-900 dark:text-white hover:text-rose-600">
                  Ext 1000 / 1001
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Structured Bottom Navigation & Legal Bar */}
        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <p>© {new Date().getFullYear()} Lovely Professional University Student Helpdesk.</p>
            <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span className="text-amber-600 dark:text-amber-400 font-semibold">Student-Led Open Initiative</span>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2">
            <button
              onClick={() => handleLegal('disclaimer')}
              className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer"
            >
              Disclaimer
            </button>
            <button
              onClick={() => handleLegal('privacy')}
              className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleLegal('terms')}
              className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer"
            >
              Terms &amp; Conditions
            </button>
            <button
              onClick={() => handleLegal('sources')}
              className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer"
            >
              Data Sources
            </button>
            <a
              href="https://www.lpu.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300"
            >
              <span>Official University Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
