import { useState, useMemo, useEffect } from 'react';
import {
  ChevronRight, ChevronDown, BookOpen, Layers,
  Calendar, CheckCircle2, Award, ArrowRight, Laptop, FlaskConical,
  GraduationCap, FileText
} from 'lucide-react';
import { programs } from '../data/mockData';
import { getProgramCurriculum, LPU_TERMS } from '../data/curriculumData';

export default function Curriculum({ ask, go }) {
  const [selectedProgramId, setSelectedProgramId] = useState('btech-cse');
  const [selectedSemester, setSelectedSemester] = useState('Semester 1');
  const [termFilter, setTermFilter] = useState('all'); // 'all' | 'Autumn' | 'Spring'
  const [typeFilter, setTypeFilter] = useState('All'); // 'All' | 'Core' | 'Lab' | 'Skill' | 'Elective'

  const activeProgram = useMemo(() => {
    return programs.find((p) => p.id === selectedProgramId) || programs[0];
  }, [selectedProgramId]);

  // Calculate dynamic maximum semesters based on the actual degree duration
  const maxSemesters = useMemo(() => {
    if (!activeProgram?.duration) return 8;
    const semMatch = activeProgram.duration.match(/(\d+)\s*Sem/i);
    if (semMatch) return parseInt(semMatch[1], 10);
    const yrMatch = activeProgram.duration.match(/(\d+(?:\.\d+)?)\s*Year/i);
    if (yrMatch) return Math.round(parseFloat(yrMatch[1]) * 2);
    return 8;
  }, [activeProgram]);

  const semesters = useMemo(() => {
    return Array.from({ length: maxSemesters }, (_, i) => `Semester ${i + 1}`);
  }, [maxSemesters]);

  // Clamp selected semester if switching from e.g. 8-sem B.Tech to 4-sem MBA
  useEffect(() => {
    const cur = parseInt(selectedSemester.replace('Semester ', ''), 10) || 1;
    if (cur > maxSemesters) {
      setSelectedSemester('Semester 1');
    }
  }, [maxSemesters, selectedSemester]);

  // Current semester number
  const semNumber = selectedSemester.replace('Semester ', '');

  // Term metadata (Autumn vs Spring)
  const termInfo = LPU_TERMS[semNumber] || {
    name: Number(semNumber) % 2 === 1 ? 'Autumn Term' : 'Spring Term',
    period: Number(semNumber) % 2 === 1 ? 'August - December' : 'January - June',
    type: Number(semNumber) % 2 === 1 ? 'Autumn' : 'Spring',
  };

  // Lookup authentic discipline-specific course data
  const courseList = useMemo(() => {
    return getProgramCurriculum(selectedProgramId, semNumber, programs);
  }, [selectedProgramId, semNumber]);

  const displayedCourses = useMemo(() => {
    if (typeFilter === 'All') return courseList;
    return courseList.filter((c) => c.type === typeFilter);
  }, [courseList, typeFilter]);

  // Overall credits across all semesters for this specific program
  const totalDegreeCredits = useMemo(() => {
    let sum = 0;
    for (let s = 1; s <= maxSemesters; s++) {
      const list = getProgramCurriculum(selectedProgramId, s, programs);
      sum += list.reduce((acc, c) => acc + (c.credits || 0), 0);
    }
    return sum || 160;
  }, [selectedProgramId, maxSemesters]);

  // Metrics for current semester
  const semesterCredits = courseList.reduce((acc, c) => acc + (c.credits || 0), 0);
  const coreCourses = courseList.filter((c) => c.type === 'Core');
  const labCourses = courseList.filter((c) => c.type === 'Lab');
  const skillCourses = courseList.filter((c) => c.type === 'Skill');
  const projectCourses = courseList.filter((c) => c.type === 'Project' || c.type === 'Elective');

  const filteredSemesters = useMemo(() => {
    if (termFilter === 'all') return semesters;
    return semesters.filter((s) => {
      const num = parseInt(s.replace('Semester ', ''), 10);
      const isOdd = num % 2 === 1;
      return termFilter === 'Autumn' ? isOdd : !isOdd;
    });
  }, [termFilter, semesters]);

  const handleAskSyllabus = (courseName, courseCode) => {
    if (ask) {
      ask(`What is the detailed syllabus, recommended textbooks, and evaluation scheme for ${courseCode} (${courseName}) in LPU curriculum?`);
    }
  };

  const getTypeBadgeStyle = (type) => {
    switch (type) {
      case 'Core':
        return 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900/60';
      case 'Lab':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60';
      case 'Skill':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/60';
      case 'Project':
        return 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900/60';
      case 'Elective':
        return 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-900/60';
      default:
        return 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100/80 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-[11px] font-bold uppercase tracking-wider mb-1.5">
              <GraduationCap size={13} />
              <span>CBCS Academic Framework • LPU Prescribed Syllabus</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
              Curriculum &amp; Course Structure
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Authentic semester-wise course codes, contact hours, and credit distribution for Academic Session 2026-27.
            </p>
          </div>

          <button
            onClick={() => ask && ask(`Can you give an overview of the curriculum, total credits, and semester roadmap for ${activeProgram.name}?`)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-500/30 transition-all shadow-2xs cursor-pointer shrink-0"
          >
            <BookOpen size={14} className="text-orange-500" />
            <span>AI Curriculum Advisory</span>
          </button>
        </div>

        {/* Programme Selection & Term Switcher Toolbar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Program Select */}
          <div className="flex-1 flex items-center gap-2.5">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 hidden sm:inline">
              Degree:
            </span>
            <div className="relative flex-1 max-w-lg">
              <select
                value={selectedProgramId}
                onChange={(e) => setSelectedProgramId(e.target.value)}
                className="w-full appearance-none rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 py-2 pl-3.5 pr-9 text-xs sm:text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-orange-500 cursor-pointer"
              >
                {programs.map((p) => (
                  <option key={p.id} value={p.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {p.name} ({p.short})
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Academic Term Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl shrink-0">
            <button
              onClick={() => setTermFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                termFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All {maxSemesters} Sems
            </button>
            <button
              onClick={() => setTermFilter('Autumn')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                termFilter === 'Autumn'
                  ? 'bg-orange-600 text-white shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-orange-600'
              }`}
            >
              Autumn (Odd)
            </button>
            <button
              onClick={() => setTermFilter('Spring')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                termFilter === 'Spring'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-blue-500'
              }`}
            >
              Spring (Even)
            </button>
          </div>
        </div>

        {/* Main Grid: Compact Semester Navigator (Left) + Courses Table (Right) */}
        <div className="grid lg:grid-cols-4 gap-5 items-start">
          
          {/* Left Semester Picker */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl p-2.5 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1.5">
            <div className="px-2.5 py-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Semesters
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                {totalDegreeCredits} Total Cr
              </span>
            </div>

            <div className="space-y-1 max-h-[500px] overflow-y-auto">
              {filteredSemesters.map((s) => {
                const active = selectedSemester === s;
                const num = parseInt(s.replace('Semester ', ''), 10);
                const isOdd = num % 2 === 1;
                const termName = isOdd ? 'Autumn' : 'Spring';
                const semCourses = getProgramCurriculum(selectedProgramId, num, programs);
                const cr = semCourses.reduce((acc, c) => acc + (c.credits || 0), 0);

                return (
                  <button
                    key={s}
                    onClick={() => setSelectedSemester(s)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      active
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex flex-col text-left">
                      <span className="text-xs sm:text-[13px]">{s}</span>
                      <span className={`text-[10px] font-normal ${active ? 'text-orange-100' : 'text-slate-400'}`}>
                        {termName} • {semCourses.length} Subjects
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${active ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                        {cr} Cr
                      </span>
                      {active && <ChevronRight size={13} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Courses Table + Controls */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Top Bar for Current Semester: Title + Course Type Pills */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
                    {selectedSemester}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    termInfo.type === 'Autumn'
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                      : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400'
                  }`}>
                    {termInfo.name} ({termInfo.period})
                  </span>
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    {semesterCredits} Credits
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {activeProgram.short} • Prescribed Courses ({displayedCourses.length})
                </h2>
              </div>

              {/* Course Type Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs">
                {['All', 'Core', 'Lab', 'Skill', 'Elective'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setTypeFilter(tab)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      typeFilter === tab
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Courses Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#F8FAFC] dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <tr>
                      <th className="py-2.5 px-4 w-28">Code</th>
                      <th className="py-2.5 px-4">Subject Title</th>
                      <th className="py-2.5 px-3 text-center w-20">Type</th>
                      <th className="py-2.5 px-3 text-center w-20">Term</th>
                      <th className="py-2.5 px-4 text-right w-20">Credits</th>
                      <th className="py-2.5 px-4 text-center w-24">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {displayedCourses.map((course, i) => (
                      <tr
                        key={course.code || i}
                        className="hover:bg-orange-50/30 dark:hover:bg-orange-950/15 transition-colors group"
                      >
                        {/* Course Code */}
                        <td className="py-2.5 px-4 font-mono text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-orange-600 transition-colors whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                            {course.code}
                          </span>
                        </td>

                        {/* Title */}
                        <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors">
                          {course.name}
                        </td>

                        {/* Type Badge */}
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold border ${getTypeBadgeStyle(course.type)}`}>
                            {course.type || 'Core'}
                          </span>
                        </td>

                        {/* Term Badge */}
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                            course.term === 'Autumn'
                              ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                              : 'bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300'
                          }`}>
                            {course.term || termInfo.type}
                          </span>
                        </td>

                        {/* Credits */}
                        <td className="py-2.5 px-4 text-right font-black text-slate-900 dark:text-white whitespace-nowrap">
                          {course.credits} Cr
                        </td>

                        {/* Quick AI Action */}
                        <td className="py-2.5 px-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleAskSyllabus(course.name, course.code)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                            title="Ask AI for syllabus & study material"
                          >
                            <BookOpen size={11} />
                            <span>Syllabus</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <span>Courses: <strong className="text-slate-800 dark:text-slate-200">{displayedCourses.length}</strong></span>
                  <span>Semester Weightage: <strong className="text-orange-600 font-bold">{semesterCredits} Credits</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                  <CheckCircle2 size={13} />
                  <span>Approved by LPU Academic Council</span>
                </div>
              </div>
            </div>

            {/* Bottom AI CTA */}
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-2xs">
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">Need subject-wise course handouts or previous exam papers?</p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">Ask our AI Helpdesk for module objectives, marks distribution (MTE/ETE/CA), or reference textbooks.</p>
              </div>
              <button
                onClick={() => ask && ask(`What are the continuous assessment (CA) components and marks distribution for ${selectedSemester} in ${activeProgram.short}?`)}
                className="btn-primary inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer shrink-0"
              >
                <span>Ask AI About Exams</span>
                <ArrowRight size={13} />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
