import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, ShieldCheck, FileText, BookOpen, ExternalLink, Scale, CheckCircle2 } from 'lucide-react';

export default function LegalModal({ isOpen, onClose, initialTab = 'disclaimer' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 id="legal-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
                Legal, Privacy & Transparency Information
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lovely Professional University Student Helpdesk • Student-Developed Unofficial Project
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-orange-500"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 gap-2 bg-white dark:bg-slate-900 overflow-x-auto text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('disclaimer')}
            className={`py-3.5 px-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'disclaimer'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            Unofficial Disclaimer
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3.5 px-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`py-3.5 px-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'terms'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Terms of Use
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`py-3.5 px-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'sources'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Data Sources & Verification
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-h-[calc(90vh-140px)]">
          {activeTab === 'disclaimer' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200">
                <p className="font-semibold text-sm sm:text-base leading-snug">
                  "This is a student-developed, unofficial helpdesk project. It is not affiliated with, endorsed by, or an official website or chatbot of Lovely Professional University. Information is compiled from publicly available sources and may not always be current. Please verify important information through official university channels."
                </p>
              </div>

              <h4 className="font-bold text-slate-900 dark:text-white text-base pt-2">
                Verification Guidelines
              </h4>
              <p>
                All course curriculums, scholarship cutoffs, hostel tariffs, and examination protocols provided on this site are collated by university students for peer convenience and guidance. While every reasonable effort is made to mirror official publications:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                <li>University fee structures, admission criteria, and seat availability are subject to periodic revision by university statutory bodies.</li>
                <li>This portal does not issue official admissions, admit cards, or degree certificates.</li>
                <li>Prospective students should complete registration and official financial transactions exclusively on official LPU portals.</li>
              </ul>

              <div className="pt-3">
                <h5 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2">
                  Official University Portals & Helplines
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <a
                    href="https://admission.lpu.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:text-orange-600 transition-colors"
                  >
                    <span>LPU Official Admissions Portal</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                  <a
                    href="https://www.lpu.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:text-orange-600 transition-colors"
                  >
                    <span>LPU Main Website (lpu.in)</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                  <a
                    href="https://ums.lpu.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:text-orange-600 transition-colors"
                  >
                    <span>University Management System (UMS)</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                    <span>Admissions Helpline (Toll-Free)</span>
                    <span className="font-bold text-slate-900 dark:text-white">1800 102 4431</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white text-base">
                Privacy Policy & Data Protection
              </h4>
              <p>
                We believe in zero-friction privacy and minimal data collection. Here is how your data is handled:
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                  <h5 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Anonymous Chat Queries by Default
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    You can use the AI chatbot without creating an account or providing any personal details. Queries are processed in real-time to answer your academic and campus questions.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                  <h5 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Email OTP Verification & Storage
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    When registering or logging in, 6-digit cryptographic verification codes are sent to your email. OTPs expire in 10 minutes, have a 30-second cooldown, and are hashed in the database.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                  <h5 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Right to Permanent Erasure
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    You have total control over your chat history. You can permanently delete individual chats or clear all chat records from the database with a single click. Once deleted, data cannot be recovered.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                  <h5 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    No Advertising or Third-Party Monetization
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    We do not sell, rent, or share your contact data with coaching centers, marketers, or third-party commercial syndicates.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white text-base">
                Terms of Use & Fair Usage
              </h4>
              <p>
                By accessing this application, you acknowledge and agree to the following conditions:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                <li>
                  <strong className="text-slate-800 dark:text-slate-200">Informational Purpose:</strong> The content, calculators, and automated responses are provided solely for educational reference and general guidance. They do not constitute an official offer of admission or scholarship guarantee.
                </li>
                <li>
                  <strong className="text-slate-800 dark:text-slate-200">Rate Limiting & Anti-Abuse:</strong> To ensure reliable service for all students, a rate limit of 30 requests per minute per IP address is actively enforced. Automated scraping, DDoS attempts, or injection testing are strictly prohibited.
                </li>
                <li>
                  <strong className="text-slate-800 dark:text-slate-200">Content Integrity:</strong> Program descriptions and fee estimates are updated based on published brochures. Always cross-check with official university notices prior to making fee payments or academic commitments.
                </li>
                <li>
                  <strong className="text-slate-800 dark:text-slate-200">Limitation of Liability:</strong> Under no circumstances will the student maintainers or contributors be liable for any direct or indirect decision, loss, or outcome resulting from reliance on unofficial data.
                </li>
              </ol>
            </div>
          )}

          {activeTab === 'sources' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white text-base">
                Public Data Sources & Verification Records
              </h4>
              <p>
                All data on this portal is drawn from publicly accessible University circulars, prospectus releases, and government publications:
              </p>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">LPU Admissions Prospectus & Program Fee Matrix</span>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">Published for Academic Batch 2026-27 (Verified Oct 2026)</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">VERIFIED</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">LPU Residential Services & Hostel Handbook</span>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">Hostel tiers, 10-month academic tenure, free electricity allowances (Verified Oct 2026)</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">VERIFIED</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">PSPCL Institutional/Residential Electricity Tariffs</span>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">Punjab State Power Corporation commercial slab rates (~₹10.50/unit) for excess units</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">VERIFIED</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">LPUNEST Phase-1 Scholarship Cutoffs</span>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">Category I (30%), Category II (25%), Category III (20%) fee waivers for eligible programs</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">VERIFIED</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Questions? Contact <a href="mailto:admissions@lpu.co.in" className="text-orange-600 dark:text-orange-400 font-medium underline">official university desk</a>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
