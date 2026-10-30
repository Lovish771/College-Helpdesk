import { useState, useMemo } from 'react';
import {
  ChevronRight, ChevronDown, BookOpen, Sparkles, Layers,
  Calendar, CheckCircle2, Award, ArrowRight, Laptop, FlaskConical,
  GraduationCap, FileText
} from 'lucide-react';
import { programs, curriculum } from '../data/mockData';

export default function Curriculum({ ask, go }) {
  const [selectedProgramId, setSelectedProgramId] = useState('btech-cse');
  const [selectedSemester, setSelectedSemester] = useState('Semester 1');
  const [termFilter, setTermFilter] = useState('all'); // 'all' | 'Autumn' | 'Spring'

  const semesters = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'];

  // Current semester number (1 - 8)
  const semNumber = selectedSemester.replace('Semester ', '');

  // Term metadata
  const termInfo = curriculum.terms?.[semNumber] || {
    name: Number(semNumber) % 2 === 1 ? 'Autumn Term' : 'Spring Term',
    period: Number(semNumber) % 2 === 1 ? 'August - December' : 'January - June',
    type: Number(semNumber) % 2 === 1 ? 'Autumn' : 'Spring',
  };

  // Lookup course data
  const courseList = useMemo(() => {
    return (
      curriculum.courses?.[selectedProgramId]?.[semNumber] ||
      curriculum.courses?.['btech-cse']?.[semNumber] ||
      []
    );
  }, [selectedProgramId, semNumber]);

  // Overall credits across all 8 semesters for this program
  const totalDegreeCredits = useMemo(() => {
    const progCourses = curriculum.courses?.[selectedProgramId] || curriculum.courses?.['btech-cse'] || {};
    let sum = 0;
    Object.values(progCourses).forEach((termCourses) => {
      if (Array.isArray(termCourses)) {
        sum += termCourses.reduce((acc, c) => acc + (c.credits || 0), 0);
      }
    });
    return sum || 160;
  }, [selectedProgramId]);

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

  const activeProgram = programs.find((p) => p.id === selectedProgramId) || programs[0];

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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Title Header with Academic Hierarchy */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
              <GraduationCap size={14} />
              <span>LPU Academic Framework • Choice Based Credit System (CBCS)</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
              Curriculum &amp; Course Structure
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Semester-wise curriculum partitioned into <strong>Autumn Term</strong> (Odd Semesters) and <strong>Spring Term</strong> (Even Semesters), compliant with AICTE / UGC academic standards.
            </p>
          </div>

          <button
            onClick={() => ask && ask(`Can you give an overview of the curriculum, total credits, and semester roadmap for ${activeProgram.name}?`)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-500/30 transition-all shadow-xs cursor-pointer shrink-0"
          >
            <Sparkles size={14} className="text-orange-500" />
            <span>AI Curriculum Advisory</span>
          </button>
        </div>

        {/* Programme Selection & Term Filter Controls */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Program Select */}
          <div className="w-full md:w-auto flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0">
              Select Programme:
            </label>
            <div className="relative flex-1 max-w-md">
              <select
                value={selectedProgramId}
                onChange={(e) => setSelectedProgramId(e.target.value)}
                className="w-full appearance-none rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 py-2.5 pl-4 pr-10 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-950/40 cursor-pointer"
              >
                {programs.map((p) => (
                  <option key={p.id} value={p.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {p.name} ({p.short})
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Academic Term Segmentation Switcher (Autumn vs Spring) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full md:w-auto justify-center">
            <button
              onClick={() => setTermFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                termFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All 8 Semesters
            </button>
            <button
              onClick={() => setTermFilter('Autumn')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                termFilter === 'Autumn'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400'
              }`}
            >
              <span>Autumn Term (Odd Sems)</span>
            </button>
            <button
              onClick={() => setTermFilter('Spring')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                termFilter === 'Spring'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400'
              }`}
            >
              <span>Spring Term (Even Sems)</span>
            </button>
          </div>
        </div>

        {/* Academic Calendar Notice Banner */}
        <div className="rounded-lg p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-orange-500 text-white shadow-xs shrink-0">
              <Calendar size={18} />
            </span>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">
                Academic Term Partition: <span className="text-orange-600 dark:text-orange-400">{termInfo.name}</span> ({termInfo.period})
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                Mid-Term Examinations (MTE) are held in middle of term; End-Term Examinations (ETE) are conducted at completion.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              Total Degree Requirement:
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 font-extrabold text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900/60 shadow-xs">
              {totalDegreeCredits} Total Credits
            </span>
          </div>
        </div>

        {/* Main Grid: Semester Navigator (Left) + Detailed Courses (Right) */}
        <div className="grid lg:grid-cols-4 gap-6 items-start">
          
          {/* Left Semester Picker */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-2">
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Select Semester ({filteredSemesters.length})
              </span>
            </div>

            <div className="space-y-1.5">
              {filteredSemesters.map((s) => {
                const active = selectedSemester === s;
                const num = parseInt(s.replace('Semester ', ''), 10);
                const isOdd = num % 2 === 1;
                const termName = isOdd ? 'Autumn Term' : 'Spring Term';
                const semCourses = curriculum.courses?.[selectedProgramId]?.[num] || curriculum.courses?.['btech-cse']?.[num] || [];
                const cr = semCourses.reduce((acc, c) => acc + (c.credits || 0), 0);

                return (
                  <button
                    key={s}
                    onClick={() => setSelectedSemester(s)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 active:scale-98 cursor-pointer ${
                      active
                        ? 'bg-orange-600 text-white'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:translate-x-1'
                    }`}
                  >
                    <div className="flex flex-col text-left">
                      <span className="text-sm">{s}</span>
                      <span className={`text-[10px] font-semibold mt-0.5 ${active ? 'text-orange-100' : 'text-slate-400 dark:text-slate-500'}`}>
                        {termName} • {semCourses.length} Subjects
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${active ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                        {cr} Cr
                      </span>
                      {active && <ChevronRight size={14} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Courses Table + Semester Breakdown */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Semester Header Card with Breakdown Stats */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
                      {selectedSemester}
                    </span>
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                      termInfo.type === 'Autumn'
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                        : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400'
                    }`}>
                      {termInfo.name} ({termInfo.period})
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display">
                    {activeProgram.short} • {selectedSemester} Curriculum
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Semester Weightage</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-orange-600 dark:text-orange-400 font-display">
                    {semesterCredits} <span className="text-sm font-semibold text-slate-500">Credits</span>
                  </span>
                </div>
              </div>

              {/* Breakdown Metric Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                    <Laptop size={15} />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Theory &amp; Core</span>
                  </div>
                  <p className="text-lg font-extrabold text-slate-900 dark:text-white font-display">
                    {coreCourses.length} <span className="text-xs font-normal text-slate-500">Courses</span>
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                    <FlaskConical size={15} />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Practicals &amp; Labs</span>
                  </div>
                  <p className="text-lg font-extrabold text-slate-900 dark:text-white font-display">
                    {labCourses.length} <span className="text-xs font-normal text-slate-500">Labs</span>
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
                    <Award size={15} />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Soft Skills &amp; PEA</span>
                  </div>
                  <p className="text-lg font-extrabold text-slate-900 dark:text-white font-display">
                    {skillCourses.length} <span className="text-xs font-normal text-slate-500">Modules</span>
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
                    <Layers size={15} />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Electives &amp; Capstone</span>
                  </div>
                  <p className="text-lg font-extrabold text-slate-900 dark:text-white font-display">
                    {projectCourses.length} <span className="text-xs font-normal text-slate-500">Units</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Courses Table Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-orange-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Prescribed Course Roster ({courseList.length} Subjects)
                  </h3>
                </div>
                <span className="text-xs text-slate-400">
                  Term: <strong className="text-slate-700 dark:text-slate-300">{termInfo.name}</strong>
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#F8FAFC] dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <tr>
                      <th className="py-3.5 px-5">Course Code</th>
                      <th className="py-3.5 px-5">Course Title &amp; Syllabus</th>
                      <th className="py-3.5 px-5 text-center">Type</th>
                      <th className="py-3.5 px-5 text-center">Term</th>
                      <th className="py-3.5 px-5 text-right">Credits</th>
                      <th className="py-3.5 px-5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {courseList.map((course, i) => (
                      <tr
                        key={course.code || i}
                        className="hover:bg-orange-50/40 dark:hover:bg-orange-950/20 transition-colors group"
                      >
                        {/* Course Code */}
                        <td className="py-4 px-5 font-mono text-xs font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors whitespace-nowrap">
                          {course.code}
                        </td>

                        {/* Title */}
                        <td className="py-4 px-5">
                          <div className="font-semibold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-snug">
                            {course.name}
                          </div>
                        </td>

                        {/* Type Badge */}
                        <td className="py-4 px-5 text-center whitespace-nowrap">
                          <span className={`inline-block rounded-md border px-2.5 py-1 text-[11px] font-bold ${getTypeBadgeStyle(course.type)}`}>
                            {course.type || 'Core'}
                          </span>
                        </td>

                        {/* Term Badge */}
                        <td className="py-4 px-5 text-center whitespace-nowrap">
                          <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            course.term === 'Autumn'
                              ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                              : 'bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300'
                          }`}>
                            {course.term || termInfo.type}
                          </span>
                        </td>

                        {/* Credits */}
                        <td className="py-4 px-5 text-right font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
                          {course.credits} Cr
                        </td>

                        {/* Quick AI Action */}
                        <td className="py-4 px-5 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleAskSyllabus(course.name, course.code)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                            title="Ask AI for syllabus & study material"
                          >
                            <Sparkles size={12} />
                            <span>Syllabus</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer Summary */}
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-4">
                  <span>Courses: <strong className="text-slate-900 dark:text-white">{courseList.length}</strong></span>
                  <span>Total Semester Load: <strong className="text-orange-600 dark:text-orange-400 font-bold">{semesterCredits} Credits</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>Approved by LPU Academic Council</span>
                </div>
              </div>
            </div>

            {/* Bottom Helpful Card */}
            <div className="bg-slate-900 text-white rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="space-y-1">
                <h4 className="text-base font-extrabold font-display">Need subject-wise course handouts or previous papers?</h4>
                <p className="text-xs text-slate-300 max-w-xl">
                  Ask our AI Student Helpdesk for detailed module objectives, marks distribution (MTE/ETE/CA), or reference textbooks on LPU University Management System (UMS).
                </p>
              </div>

              <button
                onClick={() => ask && ask(`What are the continuous assessment (CA) components and marks distribution for ${selectedSemester} in ${activeProgram.short}?`)}
                className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer shrink-0"
              >
                <span>Ask AI About CA &amp; Exams</span>
                <ArrowRight size={14} />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
