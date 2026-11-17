import React, { useState, useMemo } from 'react';
import {
  Mail, Phone, Clock, MapPin, Building2, MessageCircle, ArrowRight,
  ShieldCheck, HelpCircle, Users, AlertCircle, Sparkles, Search,
  Headset, HeartPulse, Laptop, Home as HomeIcon, Award, ExternalLink
} from 'lucide-react';
import { PageHead } from '../utils/useAsync';

export default function Contact({ go, ask }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const departments = [
    {
      id: 'admissions',
      category: 'Admissions',
      title: 'Central Admissions & Counselling',
      block: 'Block 30 (Chancellery, 1st Floor)',
      desc: 'Guidance for LPUNEST registration, eligibility evaluation, document verification, merit scholarship slabs, and fee payment desks.',
      timing: 'Mon - Sat: 9:00 AM - 6:00 PM',
      contacts: [
        { label: 'Toll-Free Helpline', value: '1800 102 4431', href: 'tel:18001024431', isCall: true },
        { label: 'Alternate Helpline', value: '1800 274 0615', href: 'tel:18002740615', isCall: true },
        { label: 'Email', value: 'admissions@lpu.co.in', href: 'mailto:admissions@lpu.co.in', isMail: true },
        { label: 'WhatsApp Query', value: '+91 98762 98762', href: 'https://wa.me/919876298762', isExt: true },
      ],
      tag: 'Admissions & Scholarships',
      borderClass: 'border-orange-200 dark:border-orange-900/50 hover:border-orange-400',
      badgeClass: 'bg-orange-600 text-white',
      icon: Building2,
    },
    {
      id: 'dsr',
      category: 'Academic',
      title: 'Division of Student Relations (DSR)',
      block: 'Block 29, Rooms 102 & 104',
      desc: 'Central point for student grievances, ID card issuance, bonafide & character certificates, hostel outpass authorization, and academic mentorship.',
      timing: 'Mon - Fri: 9:30 AM - 4:30 PM',
      contacts: [
        { label: 'Direct Helpline', value: '+91 1824 517000', href: 'tel:01824517000', isCall: true },
        { label: 'Internal Extension', value: 'Ext 2901 / 2902 / 2915', href: 'tel:01824517000', isCall: true },
        { label: 'Email', value: 'dsr@lpu.co.in', href: 'mailto:dsr@lpu.co.in', isMail: true },
        { label: 'Student Welfare Cell', value: 'welfare@lpu.co.in', href: 'mailto:welfare@lpu.co.in', isMail: true },
      ],
      tag: 'Student Affairs & Mentorship',
      borderClass: 'border-emerald-200 dark:border-emerald-900/50 hover:border-emerald-400',
      badgeClass: 'bg-emerald-600 text-white',
      icon: Users,
    },
    {
      id: 'hostel',
      category: 'Accommodation',
      title: 'Hostel & Residential Services',
      block: 'Block 34, Central Residential Office',
      desc: 'Room allocation queries, 10-month tenure verification, free electricity allowance monitoring, mess dining packages, and laundry desk support.',
      timing: 'Mon - Sun: 8:00 AM - 8:00 PM',
      contacts: [
        { label: 'Hostel Warden Desk', value: '+91 1824 517045', href: 'tel:01824517045', isCall: true },
        { label: 'Mess & Catering Helpline', value: '+91 1824 517046', href: 'tel:01824517046', isCall: true },
        { label: 'Residential Email', value: 'hostels@lpu.co.in', href: 'mailto:hostels@lpu.co.in', isMail: true },
        { label: 'Maintenance Hotline', value: 'Ext 3401 / 3402', href: 'tel:01824517000', isCall: true },
      ],
      tag: 'Hostel & Dining',
      borderClass: 'border-amber-200 dark:border-amber-900/50 hover:border-amber-400',
      badgeClass: 'bg-amber-600 text-white',
      icon: HomeIcon,
    },
    {
      id: 'exam',
      category: 'Examinations',
      title: 'Examination & Evaluation Wing',
      block: 'Block 32, Ground Floor',
      desc: 'End-term datesheets, official grade transcripts, re-evaluation applications, degree certificate dispatch, and UMS marks discrepancy resolution.',
      timing: 'Mon - Sat: 9:00 AM - 5:00 PM',
      contacts: [
        { label: 'Controller of Examination', value: '+91 1824 517040', href: 'tel:01824517040', isCall: true },
        { label: 'Transcripts Desk', value: '+91 1824 517041', href: 'tel:01824517041', isCall: true },
        { label: 'Email', value: 'exam@lpu.co.in', href: 'mailto:exam@lpu.co.in', isMail: true },
        { label: 'UMS Dispute Portal', value: 'ums.lpu.in', href: 'https://ums.lpu.in', isExt: true },
      ],
      tag: 'Controller of Examinations',
      borderClass: 'border-blue-200 dark:border-blue-900/50 hover:border-blue-400',
      badgeClass: 'bg-blue-600 text-white',
      icon: Award,
    },
    {
      id: 'it',
      category: 'Technical Support',
      title: 'IT & UMS Technical Support Cell',
      block: 'Block 36, IT Data Center',
      desc: 'University Management System (UMS) login resets, student email credentials, campus Wi-Fi registration, LMS classroom portal, and mobile app errors.',
      timing: 'Mon - Sat: 8:30 AM - 7:00 PM',
      contacts: [
        { label: 'IT Helpdesk Helpline', value: '+91 1824 517050', href: 'tel:01824517050', isCall: true },
        { label: 'UMS Password Recovery', value: 'Ext 3601 / 3602', href: 'tel:01824517000', isCall: true },
        { label: 'Technical Email', value: 'ums.support@lpu.co.in', href: 'mailto:ums.support@lpu.co.in', isMail: true },
        { label: 'Wi-Fi NOC Desk', value: 'noc@lpu.co.in', href: 'mailto:noc@lpu.co.in', isMail: true },
      ],
      tag: 'UMS & IT Infrastructure',
      borderClass: 'border-purple-200 dark:border-purple-900/50 hover:border-purple-400',
      badgeClass: 'bg-purple-600 text-white',
      icon: Laptop,
    },
    {
      id: 'hospital',
      category: 'Emergency',
      title: 'Uni-Hospital & Emergency Services',
      block: 'Uni-Hospital Complex (Near Block 34)',
      desc: 'Round-the-clock multispecialty medical care, resident medical doctors on duty, clinical diagnostic lab, 24/7 medical store, and emergency ambulance dispatch.',
      timing: '24 Hours / 7 Days a Week (Emergency)',
      contacts: [
        { label: 'Hospital Emergency Desk', value: 'Ext 1000 / 1001', href: 'tel:01824517000', isCall: true },
        { label: 'Direct Ambulance Hotline', value: '+91 1824 517111', href: 'tel:01824517111', isCall: true },
        { label: 'Chief Medical Officer', value: 'hospital@lpu.co.in', href: 'mailto:hospital@lpu.co.in', isMail: true },
        { label: 'Pharmacy Desk', value: '24/7 On Campus', href: 'tel:01824517111', isCall: true },
      ],
      tag: '24/7 Medical Care',
      borderClass: 'border-rose-200 dark:border-rose-900/50 hover:border-rose-400',
      badgeClass: 'bg-rose-600 text-white',
      icon: HeartPulse,
    },
  ];

  const categories = [
    { id: 'all', label: 'All Helplines' },
    { id: 'Admissions', label: 'Admissions & Scholarships' },
    { id: 'Academic', label: 'Academic Support (DSR)' },
    { id: 'Accommodation', label: 'Hostel & Living' },
    { id: 'Examinations', label: 'Examinations' },
    { id: 'Technical Support', label: 'IT & UMS Support' },
    { id: 'Emergency', label: '24/7 Medical' },
  ];

  const filteredDepartments = useMemo(() => {
    return departments.filter((d) => {
      const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        d.title.toLowerCase().includes(q) ||
        d.block.toLowerCase().includes(q) ||
        d.desc.toLowerCase().includes(q) ||
        d.tag.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-10 sm:py-12">
        <PageHead
          title="Verified University Helplines & Departmental Directory"
          text="Direct contact numbers, email desks, and office locations for Lovely Professional University. Click any phone number or email to connect immediately."
          badge="University Helpdesk Directory"
        >
          <button
            className="btn-primary"
            onClick={() => ask('How do I contact Admissions Block 30 or DSR for urgent assistance?')}
          >
            <Sparkles size={14} />
            Ask AI Assistant
          </button>
        </PageHead>

        {/* Search & Category Filter Controls */}
        <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search office by name, block (e.g. Block 30), or purpose..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 shadow-xs"
            />
          </div>

          {/* Quick status banner */}
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Showing <strong>{filteredDepartments.length}</strong> verified departmental desks</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 ${
                selectedCategory === c.id
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* 6 Departmental Directory Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {filteredDepartments.map((office) => {
            const Icon = office.icon;
            return (
              <div
                key={office.id}
                className={`rounded-3xl p-6 border shadow-xs hover:shadow-lg transition-all duration-200 bg-white dark:bg-slate-900 ${office.borderClass} flex flex-col justify-between hover:-translate-y-1`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${office.badgeClass}`}>
                      {office.tag}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Building2 size={13} className="text-orange-500 shrink-0" />
                      <span className="truncate max-w-[140px]">{office.block}</span>
                    </span>
                  </div>

                  <div className="flex items-start gap-3 mt-2">
                    <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display leading-snug">
                        {office.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{office.timing}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                    {office.desc}
                  </p>

                  {/* Verified Clickable Contacts */}
                  <div className="mt-5 space-y-2.5 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                    {office.contacts.map((c) => (
                      <div key={c.label} className="flex items-center justify-between text-xs py-0.5">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">{c.label}</span>
                        {c.isCall ? (
                          <a
                            href={c.href}
                            className="font-bold text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1 transition-colors underline-offset-2 hover:underline"
                            title={`Call ${c.value}`}
                          >
                            <Phone className="w-3 h-3 text-emerald-500" />
                            <span>{c.value}</span>
                          </a>
                        ) : c.isMail ? (
                          <a
                            href={c.href}
                            className="font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 flex items-center gap-1 transition-colors underline-offset-2 hover:underline"
                            title={`Send email to ${c.value}`}
                          >
                            <Mail className="w-3 h-3 text-orange-500" />
                            <span className="truncate max-w-[150px]">{c.value}</span>
                          </a>
                        ) : c.isExt ? (
                          <a
                            href={c.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1 transition-colors"
                          >
                            <span>{c.value}</span>
                            <ExternalLink className="w-3 h-3 opacity-60" />
                          </a>
                        ) : (
                          <span className="font-bold text-slate-800 dark:text-slate-200">{c.value}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => ask(`How can I get assistance from ${office.title} in ${office.block}?`)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 active:scale-95 transition-all"
                  >
                    <span>Inquire via AI Helpdesk</span>
                    <ArrowRight size={13} />
                  </button>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Verified Desk</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Campus Map & Visiting Details */}
        <div className="mt-12 rounded-3xl bg-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/30 border border-orange-500/40 text-orange-400 text-xs font-bold">
              <MapPin size={13} />
              <span>Campus Location &amp; Physical Visiting Guide</span>
            </div>
            <h3 className="text-2xl font-extrabold font-display">
              Visiting Lovely Professional University Campus
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              LPU is situated on the Jalandhar-Delhi G.T. Road (NH-1), Phagwara, Punjab (144411). Easily accessible via Phagwara Railway Station (5 km) or Jalandhar City Station (22 km). On arrival, report to the Central Welcome Center at Main Gate 1 for immediate guided electric buggy shuttles to Admissions Block 30.
            </p>
          </div>

          <div className="shrink-0 space-y-2 w-full sm:w-auto">
            <button
              onClick={() => ask('What is the nearest railway station or airport and how do I reach LPU campus?')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 transition-colors active:scale-95 cursor-pointer shadow-md"
            >
              <span>Get Transit &amp; Shuttle Guide</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
