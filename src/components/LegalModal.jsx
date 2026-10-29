import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldAlert,
  ShieldCheck,
  FileText,
  BookOpen,
  ExternalLink,
  Scale,
  CheckCircle2,
  Lock,
  Calendar,
  AlertTriangle,
  Award
} from 'lucide-react';

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

  // Determine whether this modal is opened in dedicated single-topic mode
  const isDedicatedTerms = initialTab === 'terms';
  const isDedicatedPrivacy = initialTab === 'privacy';
  const isDedicatedMode = isDedicatedTerms || isDedicatedPrivacy;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
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
            <div className={`p-2.5 rounded-2xl ${
              isDedicatedTerms
                ? 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'
                : isDedicatedPrivacy
                ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'
            }`}>
              {isDedicatedTerms ? (
                <Scale className="w-5 h-5" />
              ) : isDedicatedPrivacy ? (
                <ShieldCheck className="w-5 h-5" />
              ) : (
                <Scale className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 id="legal-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
                {isDedicatedTerms
                  ? 'Terms and Conditions'
                  : isDedicatedPrivacy
                  ? 'Privacy Policy & Student Data Rights'
                  : 'Legal, Privacy & Transparency Information'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isDedicatedTerms
                  ? 'Lovely Professional University Student Helpdesk • Official User Agreement (Session 2026-27)'
                  : isDedicatedPrivacy
                  ? 'Lovely Professional University Student Helpdesk • Data Protection & Rights (Session 2026-27)'
                  : 'Lovely Professional University Student Helpdesk • Student-Developed Unofficial Project'}
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

        {/* Tab Navigation - Rendered ONLY if NOT in dedicated mode */}
        {!isDedicatedMode && (
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
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
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
              Terms and Conditions
            </button>
            <button
              onClick={() => setActiveTab('sources')}
              className={`py-3.5 px-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'sources'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Data Sources &amp; Verification
            </button>
          </div>
        )}

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-h-[calc(90vh-140px)]">
          {/* ========================================================================= */}
          {/* DEDICATED TERMS OR TERMS TAB */}
          {/* ========================================================================= */}
          {(isDedicatedTerms || (!isDedicatedMode && activeTab === 'terms')) && (
            <div className="space-y-6 text-xs sm:text-sm">
              {/* Preamble Banner */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200">
                <div className="flex items-start gap-3">
                  <Scale className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-amber-900 dark:text-amber-100">
                      User Agreement &amp; Campus Service Terms (Academic Batch 2026-27)
                    </h3>
                    <p className="text-xs sm:text-sm text-amber-800/90 dark:text-amber-300/90 mt-1 leading-relaxed">
                      Please read these Terms and Conditions carefully. By accessing this platform, requesting email OTP verification, submitting queries to the AI chatbot, or utilizing fee estimation calculators, you enter into an explicit peer agreement under the terms set forth below.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 1 */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-black">
                    1
                  </span>
                  Acceptance of Terms &amp; Scope of Service
                </h4>
                <p className="text-slate-600 dark:text-slate-400 pl-8 leading-relaxed">
                  This web application (&ldquo;Portal&rdquo;, &ldquo;Service&rdquo;, or &ldquo;LPU Student Helpdesk&rdquo;) is an independent, student-developed guidance tool designed to assist prospective applicants, admitted freshmen, and guardians in navigating educational programs, fee structures, residential accommodations, and admissions procedures for Lovely Professional University (LPU), Phagwara, Punjab. By accessing, browsing, registering via Email One-Time Password (OTP), or interacting with any interactive services herein, you acknowledge that you have read, understood, and unequivocally agreed to be bound by these Terms and Conditions.
                </p>
              </div>

              {/* Section 2 */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-black">
                    2
                  </span>
                  Unofficial Advisory Character &amp; Non-Affiliation Disclaimer
                </h4>
                <div className="text-slate-600 dark:text-slate-400 pl-8 space-y-2 leading-relaxed">
                  <p>
                    <strong>Strict Independence:</strong> This portal is a peer-to-peer student project and is NOT an official website, admissions portal, or representative administrative organ of Lovely Professional University (LPU), its statutory bodies, trust, or affiliates.
                  </p>
                  <p>
                    <strong>Non-Binding Information:</strong> All curricular syllabi, subject credits, fee computations, scholarship slabs (LPUNEST Categories I, II, III), hostel tariffs, laundry costs, and examination schedules are compiled from publicly accessible university prospectuses and circulars for Session 2026-27. Such figures are estimates provided solely for comparative and educational planning. Under no circumstances does any content herein constitute an official contractual offer of admission, fee quotation, or scholarship sanction.
                  </p>
                  <p>
                    <strong>Official University Channels:</strong> Formal registration, fee disbursements, seat allotments, and official counseling must be conducted exclusively via verified university portals:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                    <a
                      href="https://admission.lpu.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between hover:text-orange-600 transition-colors"
                    >
                      <span className="font-medium">Admissions Portal</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                    <a
                      href="https://www.lpu.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between hover:text-orange-600 transition-colors"
                    >
                      <span className="font-medium">Main LPU Website</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                    <a
                      href="https://ums.lpu.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between hover:text-orange-600 transition-colors"
                    >
                      <span className="font-medium">UMS Student Portal</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-black">
                    3
                  </span>
                  User Authentication, OTP Security &amp; Access Integrity
                </h4>
                <div className="text-slate-600 dark:text-slate-400 pl-8 space-y-2 leading-relaxed">
                  <p>
                    In order to protect system resources and track interactive conversational sessions, students and visitors authenticate via cryptographic 6-digit One-Time Passwords (OTPs) dispatched to their designated electronic mail addresses.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                    <li>OTPs expire precisely 10 minutes following dispatch and are cryptographically hashed upon storage in the database.</li>
                    <li>A mandatory rate-limiting cooldown of 30 seconds is enforced between successive dispatch requests.</li>
                    <li>Users are strictly forbidden from submitting temporary, disposable, spoofed, or third-party email addresses. Submitting fraudulent credentials will lead to immediate electronic IP blacklisting.</li>
                    <li>You remain solely responsible for maintaining the confidentiality of your credentials and session cookies.</li>
                  </ul>
                </div>
              </div>

              {/* Section 4 */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-black">
                    4
                  </span>
                  Fair Usage, Platform Security &amp; Prohibited Conduct
                </h4>
                <div className="text-slate-600 dark:text-slate-400 pl-8 space-y-2 leading-relaxed">
                  <p>
                    To guarantee stable availability for genuine student applicants, our infrastructure enforces strict automated security monitors. By using this platform, you expressly covenant that you will NOT:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                    <li>Exceed the rate limit threshold of <strong>30 requests per minute</strong> per IP address.</li>
                    <li>Deploy automated bots, spiders, scrapers, data-mining scripts, or automated extractors to harvest program data, fees, or curriculum syllabi.</li>
                    <li>Launch or assist in Denial of Service (DoS/DDoS) attacks, buffer overflow payloads, or resource exhaustion attacks against our application servers.</li>
                    <li>Attempt SQL injection, Cross-Site Scripting (XSS), token tampering, or unauthorized administrative privilege escalation.</li>
                    <li>Tamper with, alter, or attempt to falsify telemetric server logs, student audit records, or administrative telemetry tables.</li>
                  </ul>
                </div>
              </div>

              {/* Section 5 */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-black">
                    5
                  </span>
                  Curriculum Breakdowns &amp; Multi-Year Fee Calculations
                </h4>
                <div className="text-slate-600 dark:text-slate-400 pl-8 space-y-2 leading-relaxed">
                  <p>
                    The interactive Multi-Year Fee &amp; Scholarship Calculator computes estimated tenures based on published <strong>Session 2026-27</strong> standards:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                    <li><strong>Examination Fees:</strong> Formal university examination charges are scheduled at ₹4,500 annually, assessed strictly in the even (second) semester of each respective academic year.</li>
                    <li><strong>Residential Accommodations:</strong> Hostel fee structures for Standard, Apartment, and Studio accommodations are based on a 10-month academic tenure. Electricity allowances are subject to fixed monthly kilowatt-hour allocations; excess consumption is billed according to commercial institutional tariff slabs set by the Punjab State Power Corporation Limited (PSPCL).</li>
                    <li><strong>Add-On Services:</strong> Optional laundry charges (₹5,400 standard yearly allowance) and mess dining plans (Standard, Special, South Indian) reflect published base options and are subject to official mess vendor contracts.</li>
                    <li><strong>Scholarship Deductions:</strong> Projections derived from LPUNEST Phase-1 cutoffs (Categories I, II, III), Defense concessions, and sports quotas are non-binding until certified in person by the LPU Admissions Directorate.</li>
                  </ul>
                </div>
              </div>

              {/* Section 6 */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-black">
                    6
                  </span>
                  Intellectual Property, Trademarks &amp; Fair Use
                </h4>
                <p className="text-slate-600 dark:text-slate-400 pl-8 leading-relaxed">
                  &ldquo;Lovely Professional University&rdquo;, &ldquo;LPU&rdquo;, &ldquo;LPUNEST&rdquo;, and affiliated insignias, logos, and emblems are registered trademarks of Lovely Professional University. Their inclusion on this portal is strictly descriptive and nominative fair use for public educational identification, academic review, and student navigation. All software architecture, customized algorithms, calculation scripts, graphical interface designs, and responsive layouts authored by the student developers are protected under intellectual property legislation.
                </p>
              </div>

              {/* Section 7 */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-black">
                    7
                  </span>
                  Limitation of Liability &amp; Indemnification
                </h4>
                <div className="text-slate-600 dark:text-slate-400 pl-8 space-y-2 leading-relaxed">
                  <p>
                    <strong>Zero Commercial Liability:</strong> In no event shall the student creators, maintainers, peer contributors, or hosting providers be held liable for any direct, indirect, incidental, special, exemplary, or consequential damages (including, but not limited to, academic forfeiture, lost registration opportunities, financial variances, or travel costs) arising out of the use, inability to use, or reliance on data provided by this portal.
                  </p>
                  <p>
                    <strong>Student Indemnification:</strong> You agree to defend, indemnify, and hold harmless the maintainers against any and all claims, liabilities, damages, or costs (including legal fees) arising from your breach of these Terms, unauthorized data scraping, or malicious platform conduct.
                  </p>
                </div>
              </div>

              {/* Section 8 */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-black">
                    8
                  </span>
                  Governing Law &amp; Territorial Jurisdiction
                </h4>
                <p className="text-slate-600 dark:text-slate-400 pl-8 leading-relaxed">
                  These Terms and Conditions shall be governed by, construed, and enforced in accordance with the substantive laws of the Republic of India. In the event of any legal dispute, claim, or proceedings arising out of or related to this platform, you agree to submit to the exclusive personal jurisdiction of the competent civil courts situated at Phagwara / Jalandhar, Punjab, India.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* DEDICATED PRIVACY OR PRIVACY TAB */}
          {/* ========================================================================= */}
          {(isDedicatedPrivacy || (!isDedicatedMode && activeTab === 'privacy')) && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-emerald-900 dark:text-emerald-100">
                      Privacy Policy &amp; Student Data Protection (Session 2026-27)
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-800/90 dark:text-emerald-300/90 mt-1 leading-relaxed">
                      We believe in zero-friction privacy and ethical data hygiene. Your academic questions and contact information remain strictly guarded.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                  <h5 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Cryptographic Email OTP Verification
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    When registering or logging in, 6-digit cryptographic verification codes are sent to your verified email. OTPs automatically expire in 10 minutes, have a 30-second cooldown, and are hashed in the database.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                  <h5 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Right to Permanent Erasure &amp; Chat Deletion
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    You have total control over your conversational history. You can permanently delete individual chats or purge all chat records from the database with a single click. Once deleted, data cannot be recovered.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                  <h5 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    No Advertising or Third-Party Commercial Monetization
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    We do not sell, rent, or share your contact data with coaching centers, lead brokers, or marketing syndicates.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                  <h5 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Admin-Only Telemetry &amp; System Audits
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Application telemetry and security audit logs are strictly protected by role-based authentication and restricted solely to verified system administrators.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* DISCLAIMER TAB (Only in multi-tab mode) */}
          {/* ========================================================================= */}
          {!isDedicatedMode && activeTab === 'disclaimer' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200">
                <p className="font-semibold text-sm sm:text-base leading-snug">
                  &ldquo;This is a student-developed, unofficial helpdesk project. It is not affiliated with, endorsed by, or an official website or chatbot of Lovely Professional University. Information is compiled from publicly available sources and may not always be current. Please verify important information through official university channels.&rdquo;
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
                  Official University Portals &amp; Helplines
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

          {/* ========================================================================= */}
          {/* DATA SOURCES TAB (Only in multi-tab mode) */}
          {/* ========================================================================= */}
          {!isDedicatedMode && activeTab === 'sources' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white text-base">
                Public Data Sources &amp; Verification Records
              </h4>
              <p>
                All data on this portal is drawn from publicly accessible University circulars, prospectus releases, and government publications:
              </p>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">LPU Admissions Prospectus &amp; Program Fee Matrix</span>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">Published for Academic Batch 2026-27 (Verified Session 2026-27)</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">VERIFIED</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">LPU Residential Services &amp; Hostel Handbook</span>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">Hostel tiers, 10-month academic tenure, laundry services (₹5,400), free electricity allowances (Verified Session 2026-27)</p>
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
            {isDedicatedTerms ? (
              <span className="inline-flex items-center gap-1.5 font-medium text-amber-700 dark:text-amber-400">
                <Scale className="w-3.5 h-3.5" />
                <span>Session 2026-27 • Legally Binding Terms</span>
              </span>
            ) : isDedicatedPrivacy ? (
              <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Data Protection &amp; Student Privacy Protected</span>
              </span>
            ) : (
              <span>
                Questions? Contact <a href="mailto:admissions@lpu.co.in" className="text-orange-600 dark:text-orange-400 font-medium underline">official university desk</a>
              </span>
            )}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-md active:scale-95 focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            {isDedicatedTerms ? 'I Have Read & Agree to the Terms' : 'I Understand'}
          </button>
        </div>
      </div>
    </div>
  );
}
