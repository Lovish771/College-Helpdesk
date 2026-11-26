import { useState, useMemo, useEffect } from 'react';
import {
  Wallet, Award, BedDouble, ChevronRight, CheckCircle2,
  ArrowRight, Search, Filter, ShieldCheck, HelpCircle,
  Building2, Users, Info, Scale, Check, Plus, Calculator, Landmark,
  Calendar, Layers, Clock, Coffee, Shirt, X, GraduationCap
} from 'lucide-react';
import { programs, scholarships as mockScholarships, fees as mockFees } from '../data/mockData';
import { PageHead } from '../utils/useAsync';
import { getMainDegree, getDegreeTheme } from '../utils/degreeUtils';
import { getStoredItem, setStoredItem } from '../utils/storage';
import {
  RESIDENTIAL_SERVICES,
  HOSTEL_RATES,
  MESS_RATES,
  LAUNDRY_RATE,
  ANNUAL_EXAM_FEE,
} from '../data/feeConstants';

const DISCIPLINES = [
  'All Disciplines',
  'Computer Science & IT',
  'Engineering',
  'Management & Commerce',
  'Law',
  'Pharmacy & Healthcare',
  'Agriculture & Science',
  'Design & Architecture',
];

export default function Fees({ ask, onOpenCompare, go }) {
  const jumpCourseId = useMemo(() => {
    try {
      const id = sessionStorage.getItem('lpu_fee_jump_course');
      if (id) {
        sessionStorage.removeItem('lpu_fee_jump_course');
        return id;
      }
    } catch {}
    return null;
  }, []);

  const [activeTab, setActiveTab] = useState(jumpCourseId ? 'degree-planner' : 'program-fees');
  const initialPrefs = useMemo(() => getStoredItem('lpu_fee_preferences'), []);
  const [selectedCourseId, setSelectedCourseId] = useState(jumpCourseId || initialPrefs.selectedCourseId || 'btech-cse');
  const [calcSlab, setCalcSlab] = useState(initialPrefs.calcSlab || 'cat1'); // 'none' | 'cat1' | 'cat2' | 'cat3' | 'custom'
  const [customPercent, setCustomPercent] = useState(initialPrefs.customPercent ?? 50);
  const [applyDefense, setApplyDefense] = useState(initialPrefs.applyDefense ?? false); // Rakshak Samman (20% on remaining fee)
  const [applyTeacher, setApplyTeacher] = useState(initialPrefs.applyTeacher ?? false); // Shikshak Samman (20% on remaining fee)
  const [selectedDegree, setSelectedDegree] = useState('All');
  const [selectedDiscipline, setSelectedDiscipline] = useState('All Disciplines');
  const [query, setQuery] = useState('');

  // Year-by-year customized plan state initialized from schema-validated storage
  const [yearPlans, setYearPlans] = useState(
    initialPrefs.yearPlans || {
      1: { hostel: 'none', mess: 'none', laundry: false },
      2: { hostel: 'none', mess: 'none', laundry: false },
      3: { hostel: 'none', mess: 'none', laundry: false },
      4: { hostel: 'none', mess: 'none', laundry: false },
      5: { hostel: 'none', mess: 'none', laundry: false },
    }
  );

  // Sync state changes with schema-validated storage
  useEffect(() => {
    setStoredItem('lpu_fee_preferences', {
      selectedCourseId,
      calcSlab,
      customPercent,
      applyDefense,
      applyTeacher,
      yearPlans,
    });
  }, [selectedCourseId, calcSlab, customPercent, applyDefense, applyTeacher, yearPlans]);


  const updateYearPlan = (year, field, value) => {
    setYearPlans((prev) => ({
      ...prev,
      [year]: {
        ...(prev[year] || { hostel: 'none', mess: 'none', laundry: false }),
        [field]: value,
      },
    }));
  };

  const applyResidentialPreset = (preset) => {
    const template =
      preset === 'cooler-4'
        ? { hostel: 'standard-4', mess: 'std-4', laundry: true }
        : preset === 'ac-4'
          ? { hostel: 'ac-4', mess: 'std-4', laundry: true }
          : preset === 'copy-y1'
            ? { ...(yearPlans[1] || { hostel: 'none', mess: 'none', laundry: false }) }
            : { hostel: 'none', mess: 'none', laundry: false };

    setYearPlans({
      1: { ...template },
      2: { ...template },
      3: { ...template },
      4: { ...template },
      5: { ...template },
    });
  };

  const activeCourse = useMemo(() => {
    return programs.find((p) => p.id === selectedCourseId) || programs[0];
  }, [selectedCourseId]);

  const tenureYears = useMemo(() => {
    if (!activeCourse?.duration) return 4;
    const yearMatch = activeCourse.duration.match(/(\d+)\s*(?:year|yr)/i);
    if (yearMatch) {
      return parseInt(yearMatch[1], 10);
    }
    const semMatch = activeCourse.duration.match(/(\d+)\s*sem/i);
    if (semMatch) {
      return Math.max(1, Math.ceil(parseInt(semMatch[1], 10) / 2));
    }
    return 4;
  }, [activeCourse]);

  const activeFee = mockFees[activeCourse?.id || 'btech-cse'] || {
    tuition: '₹1,60,000 / semester (Base)',
    other: '₹5,000 / semester (Examination Fee)',
    scholarship: 'Category I: up to 50% waiver',
  };

  // Base tuition per semester
  const rawTuitionNum = parseInt(activeFee.tuition.replace(/[^0-9]/g, ''), 10) || 160000;
  const examFeeNum = 5000;

  // 1. Initial LPUNEST / Merit / Manual Scholarship waiver %
  let meritPercent = 0;
  if (calcSlab === 'cat1') meritPercent = 50;
  else if (calcSlab === 'cat2') meritPercent = 40;
  else if (calcSlab === 'cat3') meritPercent = 30;
  else if (calcSlab === 'custom') meritPercent = Math.min(Math.max(Number(customPercent) || 0, 0), 100);

  // Initial merit concession amount per semester
  const meritConcessionAmt = Math.round((rawTuitionNum * meritPercent) / 100);
  const remainingAfterMerit = Math.max(0, rawTuitionNum - meritConcessionAmt);

  // 2. Affirmative Stackable Concessions applied on the REMAINING fee
  // Wards of Defense Personnel (Rakshak Samman): 20% on remaining fee
  const defenseConcessionAmt = applyDefense ? Math.round(remainingAfterMerit * 0.20) : 0;
  const remainingAfterDefense = Math.max(0, remainingAfterMerit - defenseConcessionAmt);

  // Wards of Teachers / Educators (Shikshak Samman): 20% on remaining fee
  const teacherConcessionAmt = applyTeacher ? Math.round(remainingAfterDefense * 0.20) : 0;

  // Final Net Tuition
  const totalConcessionPerSem = meritConcessionAmt + defenseConcessionAmt + teacherConcessionAmt;
  const netTuitionPerSem = Math.max(0, rawTuitionNum - totalConcessionPerSem);
  const annualNetTuition = netTuitionPerSem * 2;
  const effectiveWaiverPercent = rawTuitionNum > 0 ? Math.round((totalConcessionPerSem / rawTuitionNum) * 100) : 0;

  // Calculate year-by-year and total tenure cost
  const {
    yearlyBreakdowns,
    totalTenureCost,
    totalTuitionOnly,
    totalExamCost,
    totalLivingCost,
    totalHostelCost,
    totalMessCost,
    totalLaundryCost,
  } = useMemo(() => {
    let tTenure = 0;
    let tTuitionOnly = 0;
    let tExam = 0;
    let tHostel = 0;
    let tMess = 0;
    let tLaundry = 0;

    const breakdowns = [];
    for (let y = 1; y <= tenureYears; y++) {
      const plan = yearPlans[y] || { hostel: 'none', mess: 'none', laundry: false };
      const hCost = HOSTEL_RATES[plan.hostel]?.cost || 0;
      const mCost = MESS_RATES[plan.mess]?.cost || 0;
      const lCost = plan.laundry ? LAUNDRY_RATE : 0;
      const tCost = annualNetTuition;
      const eCost = ANNUAL_EXAM_FEE;
      const yTotal = tCost + eCost + hCost + mCost + lCost;

      tTenure += yTotal;
      tTuitionOnly += tCost;
      tExam += eCost;
      tHostel += hCost;
      tMess += mCost;
      tLaundry += lCost;

      breakdowns.push({
        year: y,
        tuition: tCost,
        exam: eCost,
        hostel: hCost,
        hostelName: HOSTEL_RATES[plan.hostel]?.name || 'Day Scholar',
        mess: mCost,
        messName: MESS_RATES[plan.mess]?.name || 'No Mess',
        laundry: lCost,
        hasLaundry: plan.laundry,
        living: hCost + mCost + lCost,
        total: yTotal,
      });
    }

    return {
      yearlyBreakdowns: breakdowns,
      totalTenureCost: tTenure,
      totalTuitionOnly: tTuitionOnly,
      totalExamCost: tExam,
      totalLivingCost: tHostel + tMess + tLaundry,
      totalHostelCost: tHostel,
      totalMessCost: tMess,
      totalLaundryCost: tLaundry,
    };
  }, [tenureYears, yearPlans, annualNetTuition]);

  // Filtered courses for Catalog view
  const filteredCourses = useMemo(() => {
    return programs.filter((p) => {
      if (selectedDegree === 'UG' && p.degree !== 'Undergraduate') return false;
      if (selectedDegree === 'PG' && p.degree !== 'Postgraduate') return false;
      if (selectedDiscipline !== 'All Disciplines') {
        if (selectedDiscipline === 'Computer Science & IT' && !(p.tags?.includes('Computer Science') || p.id.startsWith('btech-cse') || p.id.startsWith('bca') || p.id.startsWith('mca'))) return false;
        if (selectedDiscipline === 'Engineering' && !p.tags?.includes('Engineering')) return false;
        if (selectedDiscipline === 'Management & Commerce' && !(p.tags?.includes('Management') || p.tags?.includes('Commerce') || p.id.startsWith('bba') || p.id.startsWith('mba') || p.id.startsWith('bcom'))) return false;
        if (selectedDiscipline === 'Law' && !(p.tags?.includes('Law') || p.id.includes('llb') || p.id.includes('llm'))) return false;
        if (selectedDiscipline === 'Pharmacy & Healthcare' && !(p.tags?.includes('Pharmacy') || p.tags?.includes('Healthcare') || p.tags?.includes('Medical') || p.id.startsWith('bpharm') || p.id.startsWith('bpt') || p.id.startsWith('mpharm'))) return false;
        if (selectedDiscipline === 'Agriculture & Science' && !(p.tags?.includes('Agriculture') || p.tags?.includes('Science') || p.id.startsWith('bsc-') || p.id.startsWith('msc-'))) return false;
        if (selectedDiscipline === 'Design & Architecture' && !(p.tags?.includes('Design') || p.tags?.includes('Architecture') || p.id.startsWith('bdes') || p.id.startsWith('barch') || p.id.startsWith('bsc-animation'))) return false;
      }
      if (query) {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.short.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [query, selectedDegree, selectedDiscipline]);

  const activeFeeFilterCount =
    (selectedDiscipline !== 'All Disciplines' ? 1 : 0) +
    (selectedDegree !== 'All' ? 1 : 0) +
    (query.trim() ? 1 : 0);

  const handleResetFeeFilters = () => {
    setQuery('');
    setSelectedDiscipline('All Disciplines');
    setSelectedDegree('All');
  };

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-10 sm:py-12 space-y-8">
        
        {/* Header */}
        <PageHead
          title="Tuition, Scholarships & Living Fee Planner"
          text="Complete financial transparency across 44 LPU degree programmes with customizable multi-year living calculators, scholarship fee concessions, and education loan assistance."
          badge="LPU fee structure · 2026-27"
        >
          <button
            onClick={() => ask(`Can you help me calculate the total ${tenureYears}-year expenditure and hostel fees for ${activeCourse.short}?`)}
            className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold cursor-pointer"
          >
            <Calculator size={14} />
            <span>Calculate with AI</span>
          </button>
        </PageHead>

        {/* ── Main Category Switcher (Strictly One Single Horizontal Line with Hover Transitions) ── */}
        <div className="w-full max-w-5xl overflow-x-auto scrollbar-none py-1">
          <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-200/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-2xs whitespace-nowrap">
            {[
              { id: 'program-fees', label: 'Programme Tuition & Directory', icon: Wallet },
              { id: 'degree-planner', label: 'Tenure Budget Calculator', icon: Calculator },
              { id: 'residential-fees', label: 'Hostel, Mess & Laundry Rates', icon: BedDouble },
              { id: 'scholarships', label: 'Scholarship Policies', icon: Award },
            ].map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`group relative inline-flex items-center gap-2 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer shrink-0 transition-all duration-300 ease-out active:scale-95 ${
                    active
                      ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-md ring-1 ring-orange-500/20 scale-[1.01]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-white/80 dark:hover:bg-slate-900/60 hover:-translate-y-0.5 hover:shadow-xs'
                  }`}
                >
                  <Icon size={14} className="shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:text-orange-500" />
                  <span className="whitespace-nowrap transition-colors">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════
            TAB 1: DEDICATED EXPECTED FEE CALCULATOR FOR DEGREE TENURE
        ════════════════════════════════════════════════════════════ */}
        {activeTab === 'degree-planner' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Top Config Card */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
                      {activeCourse.degree} • {activeCourse.short}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      Tenure: <strong>{activeCourse.duration}</strong>
                    </span>
                    <button
                      onClick={() => setActiveTab('program-fees')}
                      className="text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer ml-auto"
                    >
                      Browse All {programs.length} Programmes →
                    </button>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display mt-1">
                    {activeCourse.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                    {activeCourse.description}
                  </p>
                </div>

                {/* Course Selector Dropdown */}
                <div className="shrink-0 w-full md:w-auto">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Choose Degree Programme:
                  </label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full md:w-80 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none cursor-pointer focus:border-orange-500"
                  >
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.short})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Scholarship & Stackable Financial Aid Configuration */}
              <div className="space-y-4">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      1. Select LPUNEST / Merit Scholarship Bracket OR Enter Custom %:
                    </p>
                    <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-2.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-900/50">
                      Merit Deduction: {meritPercent}% (-₹{meritConcessionAmt.toLocaleString()} / sem)
                    </span>
                  </div>

                  {/* Standard Brackets + Custom Tab */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {[
                      { id: 'cat1', label: 'Category I (50%)', sub: 'LPUNEST 95%+ / 95% in 10+2' },
                      { id: 'cat2', label: 'Category II (40%)', sub: 'LPUNEST 90–94.9%' },
                      { id: 'cat3', label: 'Category III (30%)', sub: 'LPUNEST 80–89.9%' },
                      { id: 'none', label: 'Standard Base (0%)', sub: 'Full Fee / No LPUNEST' },
                      { id: 'custom', label: 'Custom Merit %', sub: 'Manual scholarship input' },
                    ].map((s) => {
                      const sel = calcSlab === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => setCalcSlab(s.id)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                            sel
                              ? 'bg-orange-600 text-white border-orange-500 shadow-md font-bold'
                              : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <p className="text-xs font-bold leading-tight">{s.label}</p>
                          <p className="text-[10px] mt-1 opacity-80">{s.sub}</p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Scholarship Slider / Manual Number Input */}
                  {calcSlab === 'custom' && (
                    <div className="mt-3 p-3.5 rounded-2xl bg-orange-50/70 dark:bg-slate-800/80 border border-orange-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-4 animate-fade-in">
                      <div className="flex-1 w-full space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                          <span>Manual Scholarship Percentage:</span>
                          <span className="text-orange-600 dark:text-orange-400 font-extrabold">{customPercent}% Fee Waiver</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={customPercent}
                          onChange={(e) => setCustomPercent(Number(e.target.value))}
                          className="w-full accent-orange-600 cursor-pointer"
                        />
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={customPercent}
                          onChange={(e) => setCustomPercent(Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                          className="w-20 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm font-extrabold text-center text-slate-800 dark:text-white outline-none focus:border-orange-500"
                        />
                        <span className="text-xs font-bold text-slate-500">%</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stackable Financial Aid (Defense & Teacher Wards) */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                      <Award size={14} className="text-orange-600" />
                      Add Stackable Concessions (Calculated on Remaining Fee):
                    </p>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Remaining fee after merit: <strong>₹{remainingAfterMerit.toLocaleString()} / sem</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {/* Defense Personnel Ward Concession */}
                    <label className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      applyDefense
                        ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/60'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}>
                      <input
                        type="checkbox"
                        checked={applyDefense}
                        onChange={(e) => setApplyDefense(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded accent-orange-600 cursor-pointer"
                      />
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                          <span>Wards of Defense Personnel (Rakshak Samman)</span>
                          <span className="text-amber-600 dark:text-amber-400 font-extrabold">+20% Concession</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Applies 20% on the remaining tuition fee. Saves <strong>₹{(applyDefense ? defenseConcessionAmt : Math.round(remainingAfterMerit * 0.20)).toLocaleString()} / sem</strong>.
                        </p>
                      </div>
                    </label>

                    {/* Teacher / Educator Ward Concession */}
                    <label className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      applyTeacher
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700/60'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}>
                      <input
                        type="checkbox"
                        checked={applyTeacher}
                        onChange={(e) => setApplyTeacher(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded accent-orange-600 cursor-pointer"
                      />
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                          <span>Wards of Teachers / Educators (Shikshak Samman)</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">+20% Concession</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Applies 20% on the remaining tuition fee. Saves <strong>₹{(applyTeacher ? teacherConcessionAmt : Math.round((remainingAfterMerit - (applyDefense ? defenseConcessionAmt : 0)) * 0.20)).toLocaleString()} / sem</strong>.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Summary Breakdown Pill */}
                  <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700/60">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Base Fee: ₹{rawTuitionNum.toLocaleString()}</span>
                      <span className="text-slate-400">→</span>
                      <span className="text-orange-600 font-semibold">Total Concession: -₹{totalConcessionPerSem.toLocaleString()}</span>
                      <span className="text-slate-400">→</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">Final Net Tuition: ₹{netTuitionPerSem.toLocaleString()} / sem</span>
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-200 bg-slate-200/60 dark:bg-slate-700/60 px-2.5 py-0.5 rounded-full">
                      Effective Waiver: {effectiveWaiverPercent}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Year-by-Year Interactive Plan Cards */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                      2. Customize Hostel, Mess &amp; Laundry Per Academic Year
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Tuition (<strong>₹{netTuitionPerSem.toLocaleString()} / sem</strong> = <strong>₹{annualNetTuition.toLocaleString()} / yr</strong>) + Exam (<strong>₹{ANNUAL_EXAM_FEE.toLocaleString()} / yr</strong>) are automatically included in every year below.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => applyResidentialPreset('none')}
                      className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    >
                      Tuition Only (Day Scholar)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyResidentialPreset('cooler-4')}
                      className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    >
                      4-Seater Cooler + 4-Meal
                    </button>
                    <button
                      type="button"
                      onClick={() => applyResidentialPreset('ac-4')}
                      className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    >
                      4-Seater AC + 4-Meal
                    </button>
                    <button
                      type="button"
                      onClick={() => applyResidentialPreset('copy-y1')}
                      className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-950/60 border border-orange-200 dark:border-orange-800/60 transition-colors cursor-pointer"
                    >
                      Copy Year 1 to All
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {yearlyBreakdowns.map((item) => {
                    const currentPlan = yearPlans[item.year] || { hostel: 'none', mess: 'none', laundry: false };
                    return (
                      <div
                        key={item.year}
                        className="rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 flex flex-col justify-between space-y-4 hover:border-orange-300 dark:hover:border-slate-700 transition-all"
                      >
                        <div>
                          {/* Year Header */}
                          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-700/70">
                            <div>
                              <span className="font-display font-extrabold text-sm sm:text-base text-slate-900 dark:text-white block">
                                Year {item.year}
                              </span>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                Sem {item.year * 2 - 1} &amp; Sem {item.year * 2}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="font-extrabold text-orange-600 dark:text-orange-400 text-base sm:text-lg font-display block">
                                ₹{item.total.toLocaleString()}
                              </span>
                              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Year {item.year} Combined</span>
                            </div>
                          </div>

                          {/* Controls: Hostel & Mess Side-by-Side */}
                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                                <BedDouble size={12} className="text-orange-500" />
                                Hostel Room:
                              </label>
                              <select
                                value={currentPlan.hostel}
                                onChange={(e) => updateYearPlan(item.year, 'hostel', e.target.value)}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-pointer focus:border-orange-500 truncate"
                              >
                                <option value="none">Day Scholar / None (₹0)</option>
                                <option value="studio-1">1-Seater Studio AC (₹1,90,000)</option>
                                <option value="studio-2">2-Seater Studio AC (₹1,40,000)</option>
                                <option value="studio-3">3-Seater Studio AC (₹1,20,000)</option>
                                <option value="studio-4">4-Seater Studio AC (₹1,00,000)</option>
                                <option value="ac-1">1-Seater Standard AC (₹1,53,000)</option>
                                <option value="ac-2">2-Seater Room AC (₹1,33,000)</option>
                                <option value="ac-3">3-Seater Room AC (₹1,13,000)</option>
                                <option value="ac-4">4-Seater Room AC (₹93,000)</option>
                                <option value="standard-2">2-Seater Cooler (₹1,13,000)</option>
                                <option value="standard-3">3-Seater Cooler (₹98,000)</option>
                                <option value="standard-4">4-Seater Cooler (₹83,000)</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                                <Coffee size={12} className="text-emerald-500" />
                                Mess Plan:
                              </label>
                              <select
                                value={currentPlan.mess}
                                onChange={(e) => updateYearPlan(item.year, 'mess', e.target.value)}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-pointer focus:border-orange-500 truncate"
                              >
                                <option value="none">No Mess / Food Court (₹0)</option>
                                <option value="std-4">4-Meal Mess (₹50,000)</option>
                                <option value="std-3">3-Meal Mess (₹46,000)</option>
                                <option value="std-2">2-Meal Mess (₹42,000)</option>
                                <option value="special">Special Mess (₹58,000)</option>
                              </select>
                            </div>
                          </div>

                          {/* Laundry Service Toggle */}
                          <div className="mt-2.5 flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer">
                              <Shirt size={12} className="text-blue-500" />
                              Automated Laundry (₹5,400 / yr)
                            </label>
                            <input
                              type="checkbox"
                              checked={currentPlan.laundry}
                              onChange={(e) => updateYearPlan(item.year, 'laundry', e.target.checked)}
                              className="h-4 w-4 rounded accent-orange-600 cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* Ordered itemized breakdown: Fee/Sem -> Hostel -> Mess -> Tuition & Exam */}
                        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                            <span>1. Fee per Sem (Tuition):</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">₹{netTuitionPerSem.toLocaleString()} / sem</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                            <span>2. Hostel Fee (Annual):</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">₹{item.hostel.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                            <span>3. Mess Fee (Annual):</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">₹{item.mess.toLocaleString()}</span>
                          </div>
                          {item.laundry > 0 && (
                            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                              <span>Laundry Service:</span>
                              <span className="font-semibold text-slate-800 dark:text-slate-200">₹{item.laundry.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                            <span>4. Tuition (2 Sems) + Exam:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">₹{item.tuition.toLocaleString()} + ₹{item.exam.toLocaleString()}</span>
                          </div>
                          <div className="pt-1.5 mt-1 border-t border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-between">
                            <span className="font-bold text-slate-800 dark:text-slate-200">Year {item.year} Total (All Included):</span>
                            <span className="font-extrabold text-orange-600 dark:text-orange-400">₹{item.total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Overall Total Tenure Expenditure Banner */}
              <div className="rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-orange-200/80 dark:border-orange-900/50 shadow-sm p-6 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-orange-600 text-white uppercase tracking-wider">
                      Grand Total Estimate
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Tuition + Exam + Hostel + Mess Included
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {tenureYears} Years ({activeCourse.short})
                    </span>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-2.5">
                    <span className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white">
                      ₹{totalTenureCost.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Academic (Tuition + Exam): <strong className="text-slate-700 dark:text-slate-200">₹{(totalTuitionOnly + totalExamCost).toLocaleString()}</strong> • Living: <strong className="text-slate-700 dark:text-slate-200">₹{totalLivingCost.toLocaleString()}</strong>
                    </span>
                  </div>
                  
                  {/* Ordered Metric Chips */}
                  <div className="flex flex-wrap gap-2 text-xs text-slate-700 dark:text-slate-200 pt-1">
                    <span className="bg-slate-100 dark:bg-white/10 px-2.5 py-1 rounded-lg font-medium">1. Fee / Sem: ₹{netTuitionPerSem.toLocaleString()}</span>
                    <span className="bg-slate-100 dark:bg-white/10 px-2.5 py-1 rounded-lg font-medium">2. Hostel ({tenureYears} Yrs): ₹{totalHostelCost.toLocaleString()}</span>
                    <span className="bg-slate-100 dark:bg-white/10 px-2.5 py-1 rounded-lg font-medium">3. Mess ({tenureYears} Yrs): ₹{totalMessCost.toLocaleString()}</span>
                    <span className="bg-slate-100 dark:bg-white/10 px-2.5 py-1 rounded-lg font-medium">4. Tuition ({tenureYears * 2} Sems): ₹{totalTuitionOnly.toLocaleString()}</span>
                    <span className="bg-slate-100 dark:bg-white/10 px-2.5 py-1 rounded-lg font-medium">Exam ({tenureYears} Yrs): ₹{totalExamCost.toLocaleString()}</span>
                    {totalLaundryCost > 0 && (
                      <span className="bg-slate-100 dark:bg-white/10 px-2.5 py-1 rounded-lg font-medium">Laundry: ₹{totalLaundryCost.toLocaleString()}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
                  <button
                    onClick={() => {
                      go('admissions');
                      setTimeout(() => {
                        const el = document.getElementById('education-loans');
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 120);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shadow-md"
                    title="View LPU Financial Aid & Education Loan Process"
                  >
                    <Landmark size={14} className="text-orange-600" />
                    <span>Apply for Education Loan</span>
                  </button>
                  <button
                    onClick={() => ask(`I planned my ${tenureYears}-year expenditure for ${activeCourse.name} at ₹${totalTenureCost.toLocaleString()}. What are the monthly EMI options and loan subsidy schemes available?`)}
                    className="btn-primary inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    <Calculator size={14} />
                    <span>Ask AI for EMI Breakdown</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            TAB 2: PROGRAMME TUITION & DEDICATED SEARCH/FILTER
        ════════════════════════════════════════════════════════════ */}
        {activeTab === 'program-fees' && (
          <div className="space-y-8 animate-fade-in">
            {/* Interactive Calculator Banner for Selected Course */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-6 sm:p-8 shadow-sm border border-slate-200/90 dark:border-slate-800 relative overflow-hidden transition-colors">
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                {/* Course Details Left */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wider">
                      Select Course by Category:
                    </span>
                    <select
                      value={selectedCourseId}
                      onChange={(e) => setSelectedCourseId(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:border-orange-500 max-w-full truncate cursor-pointer shadow-xs"
                    >
                      {programs.map((p) => (
                        <option key={p.id} value={p.id}>{p.short} - {p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/15 dark:bg-orange-600/30 border border-orange-500/30 text-orange-700 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
                    <span>{activeCourse.degree}</span>
                    <span>·</span>
                    <span>{activeCourse.duration}</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight text-slate-900 dark:text-white">
                    {activeCourse.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                    {activeCourse.description}
                  </p>

                  {/* Scholarship Slab Selector */}
                  <div className="pt-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                      Select Your LPUNEST / Merit Scholarship Bracket:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'cat1', label: 'Category I', sub: '50% Waiver (95%+)', off: '50%' },
                        { id: 'cat2', label: 'Category II', sub: '40% Waiver (90-94%)', off: '40%' },
                        { id: 'cat3', label: 'Category III', sub: '30% Waiver (80-89%)', off: '30%' },
                        { id: 'none', label: 'Standard Base', sub: 'No Scholarship', off: '0%' },
                      ].map((s) => {
                        const sel = calcSlab === s.id;
                        return (
                          <button
                            key={s.id}
                            onClick={() => setCalcSlab(s.id)}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              sel
                                ? 'bg-orange-600 text-white border-orange-500 shadow-md font-bold'
                                : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <p className="text-xs leading-none font-bold">{s.label}</p>
                            <p className="text-[10px] mt-1 opacity-80">{s.sub}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Live Calculated Fee Card Right */}
                <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Fee Breakdown ({activeCourse.short})
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {effectiveWaiverPercent}% Scholarship Applied
                    </span>
                  </div>

                  <div className="mt-4 space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Base Tuition Fee:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        ₹{rawTuitionNum.toLocaleString()} / sem
                      </span>
                    </div>

                    {effectiveWaiverPercent > 0 && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                        <span>Scholarship Concession ({effectiveWaiverPercent}%):</span>
                        <span className="font-bold">-₹{totalConcessionPerSem.toLocaleString()} / sem</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Net Tuition / Sem:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        ₹{netTuitionPerSem.toLocaleString()} / sem
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Annual Tuition (2 Sems):</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        ₹{annualNetTuition.toLocaleString()} / yr
                      </span>
                    </div>

                    <div className="space-y-1.5 border-t border-slate-200 dark:border-slate-700/60 pt-2 text-xs">
                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                        <span>Sem 1 Exam Fee (Odd Sem):</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">₹0</span>
                      </div>
                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                        <span>Sem 2 Exam Fee (Even Sem):</span>
                        <span className="font-semibold text-orange-600 dark:text-orange-400">+₹{examFeeNum.toLocaleString()} / yr</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Annual Academic Total (2 Sems + Exam)</span>
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-orange-600 dark:text-orange-400 font-display">
                          ₹{(annualNetTuition + examFeeNum).toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          (Sem 1: ₹{netTuitionPerSem.toLocaleString()} • Sem 2: ₹{(netTuitionPerSem + examFeeNum).toLocaleString()})
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('degree-planner')}
                      className="btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer shrink-0"
                    >
                      <span>Add Hostel &amp; Mess</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                  <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-700/70 rounded-xl px-3 py-2 flex items-center gap-1.5">
                    <Info size={13} className="text-orange-500 shrink-0" />
                    <span>Tuition &amp; Exam Fee only — Hostel &amp; Mess fees are separate (use <strong>Degree Budget Planner</strong> to combine both).</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Sticky Filter Drawer / Pill Bar */}
            <div className="sticky top-16 z-20 backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-md space-y-3 transition-colors">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={query}
                    maxLength={100}
                    onChange={(e) => setQuery(e.target.value.slice(0, 100))}
                    placeholder="Search by degree title, subject, or short code (e.g. B.Tech, CSE, MBA)..."
                    aria-label="Search programmes for fees"
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm font-sans text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-slate-400"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      aria-label="Clear fee search"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer rounded-full"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Filter Badges and Reset Button */}
                <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <span>
                      Showing <strong className="text-orange-600 dark:text-orange-400 font-bold">{filteredCourses.length}</strong> of {programs.length} Programmes
                    </span>
                    {activeFeeFilterCount > 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                        {activeFeeFilterCount} active
                      </span>
                    )}
                  </div>
                  {activeFeeFilterCount > 0 && (
                    <button
                      onClick={handleResetFeeFilters}
                      className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 underline underline-offset-2 cursor-pointer transition-colors"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Discipline and Degree Pills */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                {/* Degree Levels */}
                <div className="flex items-center gap-1 shrink-0 pb-1 sm:pb-0">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Level:</span>
                  {['All', 'UG', 'PG'].map((deg) => (
                    <button
                      key={deg}
                      onClick={() => setSelectedDegree(deg)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedDegree === deg
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {deg}
                    </button>
                  ))}
                </div>

                <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block mx-1" />

                {/* Disciplines Scrollable Pill Bar */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  {DISCIPLINES.map((disc) => (
                    <button
                      key={disc}
                      onClick={() => setSelectedDiscipline(disc)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        selectedDiscipline === disc
                          ? 'bg-orange-600 text-white font-bold shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {disc}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Catalog Grid View */}
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.map((p) => {
                  const f = mockFees[p.id] || { tuition: '₹1,60,000 / semester (Base)' };
                  const cardSemFee = parseInt(f.tuition.replace(/[^0-9]/g, ''), 10) || 160000;
                  const cardAnnualWithExam = cardSemFee * 2 + ANNUAL_EXAM_FEE;
                  const isSelected = selectedCourseId === p.id;
                  const mainDeg = getMainDegree(p);
                  const degTheme = getDegreeTheme(mainDeg);
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedCourseId(p.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border shadow-xs hover:shadow-xl hover:-translate-y-1 active:scale-[0.99] transition-all duration-300 flex flex-col justify-between group cursor-pointer ${
                        isSelected
                          ? `ring-2 ${degTheme.ringColor} border-transparent shadow-md`
                          : `border-slate-200/90 dark:border-slate-800 ${degTheme.glowBorder} ${degTheme.glow}`
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <div className={`relative inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider overflow-hidden shadow-xs ${degTheme.glow} select-none transition-transform duration-300 group-hover:scale-105`}>
                            <div className={`absolute inset-0 bg-gradient-to-r ${degTheme.gradient} opacity-95 group-hover:opacity-100 transition-opacity`} />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-shimmer pointer-events-none" />
                            <GraduationCap size={11} className="relative z-10 text-white drop-shadow-xs" />
                            <span className="relative z-10 text-white font-extrabold tracking-wide drop-shadow-xs">
                              {mainDeg}
                            </span>
                          </div>
                          <span className="text-[11px] font-medium text-slate-400">{p.duration}</span>
                        </div>
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          {p.name}
                        </h4>
                        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/60 space-y-1">
                          <div className="flex items-baseline justify-between">
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Base Fee / Sem:</span>
                            <strong className="text-sm font-extrabold text-slate-900 dark:text-white font-display">
                              ₹{cardSemFee.toLocaleString()}
                            </strong>
                          </div>
                          <div className="flex items-baseline justify-between">
                            <span className="text-[11px] text-slate-400">Annual (2 Sems + ₹5k Exam):</span>
                            <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                              ₹{cardAnnualWithExam.toLocaleString()} / yr
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCourseId(p.id);
                            setActiveTab('degree-planner');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 underline-offset-2 hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-lg px-1 py-0.5"
                        >
                          Calculate {p.short} Budget →
                        </button>
                        {onOpenCompare && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenCompare([p.id]);
                            }}
                            className="text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-lg px-1.5 py-0.5"
                          >
                            Compare
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredCourses.length === 0 && (
                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
                  <p className="text-base font-bold text-slate-800 dark:text-slate-200">No programmes matched your fee search</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Try adjusting your discipline filter or search terms</p>
                  <button
                    onClick={handleResetFeeFilters}
                    className="btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            TAB 3: HOSTEL, MESS & LAUNDRY RATES
        ════════════════════════════════════════════════════════════ */}
        {activeTab === 'residential-fees' && (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-2xl bg-orange-50/80 dark:bg-orange-950/30 border border-orange-200/80 dark:border-orange-900/50 px-4 py-3 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
              <Info size={15} className="text-orange-600 dark:text-orange-400 shrink-0" />
              <span><strong>Hostel, Mess &amp; Laundry rates only:</strong> Programme Tuition &amp; Examination fees are charged separately. Use the <strong>Degree Budget Planner</strong> tab to view your combined total.</span>
            </div>
            <div className="grid gap-8 lg:grid-cols-3">
              {RESIDENTIAL_SERVICES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.category}
                    className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start gap-3.5 mb-5">
                        <div
                          className="h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
                          style={{ background: cat.bg, color: cat.color }}
                        >
                          <Icon size={20} />
                        </div>
                        <div>
                          <h4 className="text-base font-bold font-display text-slate-900 dark:text-white">
                            {cat.category}
                          </h4>
                          <span className="inline-block mt-0.5 text-[11px] font-semibold text-slate-400">
                            {cat.duration}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        {cat.items.map((it) => (
                          <div
                            key={it.name}
                            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-slate-900 dark:text-white">{it.name}</span>
                              <span className="font-extrabold text-orange-600 dark:text-orange-400 whitespace-nowrap">
                                {it.fee}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{it.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => ask(`Tell me more about ${cat.category} facilities at LPU`)}
                      className="mt-5 w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-orange-500 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-orange-600 transition-colors cursor-pointer"
                    >
                      Inquire with AI
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            TAB 4: SCHOLARSHIPS & MERIT WAIVERS
        ════════════════════════════════════════════════════════════ */}
        {activeTab === 'scholarships' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {mockScholarships.map((s) => (
                <div
                  key={s.id}
                  className="group relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/70 p-6 shadow-xs hover:shadow-[0_18px_36px_-8px_rgba(234,88,12,0.16)] dark:hover:shadow-[0_18px_36px_-8px_rgba(234,88,12,0.28)] hover:border-orange-500/60 dark:hover:border-orange-500/50 hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 border border-orange-200/70 dark:border-orange-800/50 text-[11px] font-bold uppercase tracking-wider">
                        <Award size={13} />
                        <span>Scholarship</span>
                      </span>
                    </div>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white font-display group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {s.name}
                    </h4>
                    <p className="mt-2.5 text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      {s.text}
                    </p>
                  </div>

                  <button
                    onClick={() => ask(`Am I eligible for ${s.name}?`)}
                    className="mt-5 w-full py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 font-bold text-xs transition-all duration-200 cursor-pointer border border-slate-200/80 dark:border-slate-700 hover:border-transparent active:scale-98 flex items-center justify-center gap-1.5"
                  >
                    <span>Check Eligibility</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
