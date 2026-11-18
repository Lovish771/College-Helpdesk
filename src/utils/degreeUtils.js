/**
 * Degree detection and color theme utility
 * Maps degree identifiers and names to standard Main Degree labels (e.g. B.Tech, B.Sc, BCA, MBA)
 * and provides premium color palettes, glowing borders, and shining gradient styling.
 */

export const getMainDegree = (p) => {
  if (!p) return 'Degree';
  const name = (p.name || '').toUpperCase();
  const short = (p.short || '').toUpperCase();
  const id = (p.id || '').toLowerCase();

  // Engineering & Tech
  if (name.includes('B.TECH') || short.includes('B.TECH') || id.startsWith('btech')) return 'B.Tech';
  if (name.includes('M.TECH') || short.includes('M.TECH') || id.startsWith('mtech')) return 'M.Tech';
  if (name.includes('BCA') || short.includes('BCA') || id.startsWith('bca')) return 'BCA';
  if (name.includes('MCA') || short.includes('MCA') || id.startsWith('mca')) return 'MCA';

  // Law programmes must be resolved before BBA because BBA LL.B IDs start with "bba".
  if (name.includes('LL.M') || id.includes('llm')) return 'LL.M';
  if (name.includes('LL.B') || name.includes('BA LLB') || name.includes('BBA LLB') || id.includes('llb')) return 'BA/BBA LL.B';

  // Business & Management
  if (name.includes('MBA') || short.includes('MBA') || id.startsWith('mba')) return 'MBA';
  if (name.includes('BBA') || short.includes('BBA') || id.startsWith('bba')) return 'BBA';
  if (name.includes('B.COM') || short.includes('B.COM') || id.startsWith('bcom')) return 'B.Com';
  if (name.includes('M.COM') || short.includes('M.COM') || id.startsWith('mcom')) return 'M.Com';

  // Sciences & Agriculture
  if (name.includes('B.SC') || short.includes('B.SC') || id.startsWith('bsc')) return 'B.Sc';
  if (name.includes('M.SC') || short.includes('M.SC') || id.startsWith('msc')) return 'M.Sc';

  // Healthcare & Pharmacy
  if (name.includes('B.PHARM') || id.startsWith('bpharm')) return 'B.Pharm';
  if (name.includes('M.PHARM') || id.startsWith('mpharm')) return 'M.Pharm';
  if (name.includes('PHYSIOTHERAPY') || id.includes('bpt')) return 'BPT';

  // Design & Architecture
  if (name.includes('DESIGN') || name.includes('B.DES') || id.includes('bdes')) return 'B.Des';
  if (name.includes('B.ARCH') || id.includes('barch')) return 'B.Arch';
  if (name.includes('BHMCT') || id.startsWith('bhmct')) return 'BHMCT';
  if (name.includes('JOURNALISM') || id.startsWith('ba-jmc')) return 'B.A. JMC';

  // Education
  if (name.includes('B.ED') || id.startsWith('bed')) return 'B.Ed';

  // Fallbacks
  if (p.degree === 'Undergraduate') return 'UG Degree';
  if (p.degree === 'Postgraduate') return 'PG Degree';
  return p.degree || 'Degree';
};

/**
 * Clean up redundant degree acronym prefixes in the title
 * (e.g., if badge already says "MBA", don't repeat "MBA - " in title)
 */
export const cleanProgramTitle = (fullName, mainDegree) => {
  if (!fullName) return '';
  const cleaned = fullName.trim()
    .replace(/^(?:Master of Business Administration|MBA)\s*(?:[-–:]|in\b|with\b)?\s*/i, '')
    .replace(/^(?:Bachelor of Business Administration|BBA)\s*(?:[-–:]|in\b|with\b)?\s*/i, '')
    .replace(/^(?:Master of Computer Applications|MCA)\s*(?:[-–:]|in\b|with\b)?\s*/i, '')
    .replace(/^(?:Bachelor of Computer Applications|BCA)\s*(?:[-–:]|in\b|with\b)?\s*/i, '')
    .replace(/^(?:B\.?\s*Tech|M\.?\s*Tech)\s*(?:[-–:]|in\b|with\b)?\s*/i, '')
    .replace(/^(?:B\.?\s*Sc|M\.?\s*Sc|Bachelor of Science|Master of Science)\s*(?:[-–:]|in\b|with\b)?\s*/i, '')
    .replace(/^(?:Bachelor of Commerce|B\.?\s*Com|M\.?\s*Com)\s*(?:[-–:]|in\b|with\b)?\s*/i, '')
    .replace(/^(?:Bachelor of Pharmacy|Master of Pharmacy|B\.?\s*Pharm|M\.?\s*Pharm)\s*(?:[-–:]|in\b|with\b)?\s*/i, '')
    .replace(/^(?:Bachelor of Physiotherapy|BPT)\s*(?:[-–:]|in\b|with\b)?\s*/i, '')
    .replace(/^(?:Bachelor of Laws|Master of Laws|B\.?A\.?\s+LL\.?B\.?|B\.?B\.?A\.?\s+LL\.?B\.?|LL\.?B|LL\.?M)\s*(?:[-–:]|in\b|with\b)?\s*/i, '')
    .replace(/^(?:Bachelor of Design|B\.?\s*Des)\s*(?:[-–:]|in\b|with\b)?\s*/i, '')
    .replace(/^(?:Bachelor of Architecture|B\.?\s*Arch)\s*(?:[-–:]|in\b|with\b)?\s*/i, '')
    .replace(/^(?:Bachelor of Education|B\.?\s*Ed)\s*(?:[-–:]|in\b|with\b)?\s*/i, '')
    .replace(/^(?:Bachelor of Hotel Management and Catering Technology|BHMCT)\s*(?:[-–:]|in\b|with\b)?\s*/i, '')
    .replace(/^B\.?A\.?\s*\(?Journalism and Mass Communication\)?\s*/i, '')
    .replace(/\s*\((?:B\.?\s*Pharm|M\.?\s*Pharm|BPT|B\.?\s*Des|B\.?\s*Arch|B\.?\s*Ed|BHMCT|LL\.?B|LL\.?M)\)\s*/gi, ' ')
    .replace(/^\(?Hons?\.?\)?\s*/i, '')
    .replace(/^\s*[-–:|]+\s*/, '')
    .replace(/^\((.*)\)$/, '$1')
    .trim();

  if (/^with specialization$/i.test(cleaned)) {
    return mainDegree === 'BCA' ? 'Computer Applications (Honours)' : 'Honours Programme';
  }

  if (cleaned && !/^\(?Hons?\.?\)?$/i.test(cleaned)) return cleaned;

  return {
    MBA: 'Business Administration',
    BBA: 'Business Administration',
    BCA: 'Computer Applications',
    MCA: 'Computer Applications',
    'B.Tech': 'Engineering',
    'M.Tech': 'Engineering',
    'B.Sc': 'Science',
    'M.Sc': 'Science',
    'B.Com': 'Commerce',
    'M.Com': 'Commerce',
    'B.Pharm': 'Pharmacy',
    'M.Pharm': 'Pharmacy',
    BPT: 'Physiotherapy',
    'BA/BBA LL.B': 'Law',
    'LL.M': 'Law',
    'B.Des': 'Design',
    'B.Arch': 'Architecture',
    'B.Ed': 'Education',
    BHMCT: 'Hospitality',
    'B.A. JMC': 'Journalism & Mass Communication',
  }[mainDegree] || fullName.trim();
};

/**
 * Returns distinct theme styling, gradients, glowing borders, and shadows per degree.
 */
export const getDegreeTheme = (mainDegree) => {
  switch (mainDegree) {
    case 'MBA':
      return {
        label: 'MBA',
        gradient: 'from-amber-500 via-orange-500 to-yellow-500',
        glow: 'shadow-amber-500/25',
        glowBorder: 'hover:border-amber-500 dark:hover:border-amber-400',
        glowShadow: 'hover:shadow-[0_0_30px_-3px_rgba(245,158,11,0.5),0_12px_30px_-10px_rgba(245,158,11,0.3)]',
        badgeBg: 'bg-amber-500/15 dark:bg-amber-950/50 border-amber-500/40 text-amber-700 dark:text-amber-300',
        textAccent: 'text-amber-600 dark:text-amber-400',
        btnClass: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/25',
        haloGradient: 'from-amber-500 via-yellow-500 to-orange-500',
        haloShadow: 'drop-shadow-[0_20px_40px_rgba(245,158,11,0.35)]',
        accentBg: 'bg-amber-500/5 dark:bg-amber-950/20',
        ringColor: 'ring-amber-500',
      };
    case 'BBA':
      return {
        label: 'BBA',
        gradient: 'from-orange-500 via-amber-500 to-yellow-600',
        glow: 'shadow-orange-500/25',
        glowBorder: 'hover:border-orange-500 dark:hover:border-orange-400',
        glowShadow: 'hover:shadow-[0_0_30px_-3px_rgba(249,115,22,0.5),0_12px_30px_-10px_rgba(249,115,22,0.3)]',
        badgeBg: 'bg-orange-500/15 dark:bg-orange-950/50 border-orange-500/40 text-orange-700 dark:text-orange-300',
        textAccent: 'text-orange-600 dark:text-orange-400',
        btnClass: 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-orange-500/25',
        haloGradient: 'from-orange-500 via-amber-500 to-yellow-500',
        haloShadow: 'drop-shadow-[0_20px_40px_rgba(249,115,22,0.35)]',
        accentBg: 'bg-orange-500/5 dark:bg-orange-950/20',
        ringColor: 'ring-orange-500',
      };
    case 'B.Tech':
      return {
        label: 'B.Tech',
        gradient: 'from-blue-600 via-indigo-600 to-cyan-500',
        glow: 'shadow-blue-500/25',
        glowBorder: 'hover:border-blue-500 dark:hover:border-blue-400',
        glowShadow: 'hover:shadow-[0_0_30px_-3px_rgba(59,130,246,0.5),0_12px_30px_-10px_rgba(59,130,246,0.3)]',
        badgeBg: 'bg-blue-500/15 dark:bg-blue-950/50 border-blue-500/40 text-blue-700 dark:text-blue-300',
        textAccent: 'text-blue-600 dark:text-blue-400',
        btnClass: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25',
        haloGradient: 'from-blue-600 via-indigo-500 to-cyan-500',
        haloShadow: 'drop-shadow-[0_20px_40px_rgba(59,130,246,0.35)]',
        accentBg: 'bg-blue-500/5 dark:bg-blue-950/20',
        ringColor: 'ring-blue-500',
      };
    case 'M.Tech':
      return {
        label: 'M.Tech',
        gradient: 'from-purple-600 via-indigo-600 to-violet-500',
        glow: 'shadow-purple-500/25',
        glowBorder: 'hover:border-purple-500 dark:hover:border-purple-400',
        glowShadow: 'hover:shadow-[0_0_30px_-3px_rgba(168,85,247,0.5),0_12px_30px_-10px_rgba(168,85,247,0.3)]',
        badgeBg: 'bg-purple-500/15 dark:bg-purple-950/50 border-purple-500/40 text-purple-700 dark:text-purple-300',
        textAccent: 'text-purple-600 dark:text-purple-400',
        btnClass: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-purple-500/25',
        haloGradient: 'from-purple-600 via-indigo-600 to-violet-500',
        haloShadow: 'drop-shadow-[0_20px_40px_rgba(168,85,247,0.35)]',
        accentBg: 'bg-purple-500/5 dark:bg-purple-950/20',
        ringColor: 'ring-purple-500',
      };
    case 'BCA':
    case 'MCA':
      return {
        label: mainDegree,
        gradient: 'from-cyan-600 via-teal-600 to-blue-500',
        glow: 'shadow-cyan-500/25',
        glowBorder: 'hover:border-cyan-500 dark:hover:border-cyan-400',
        glowShadow: 'hover:shadow-[0_0_30px_-3px_rgba(6,182,212,0.5),0_12px_30px_-10px_rgba(6,182,212,0.3)]',
        badgeBg: 'bg-cyan-500/15 dark:bg-cyan-950/50 border-cyan-500/40 text-cyan-700 dark:text-cyan-300',
        textAccent: 'text-cyan-600 dark:text-cyan-400',
        btnClass: 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white shadow-cyan-500/25',
        haloGradient: 'from-cyan-600 via-teal-500 to-blue-500',
        haloShadow: 'drop-shadow-[0_20px_40px_rgba(6,182,212,0.35)]',
        accentBg: 'bg-cyan-500/5 dark:bg-cyan-950/20',
        ringColor: 'ring-cyan-500',
      };
    case 'B.Sc':
    case 'M.Sc':
      return {
        label: mainDegree,
        gradient: 'from-emerald-600 via-green-600 to-teal-500',
        glow: 'shadow-emerald-500/25',
        glowBorder: 'hover:border-emerald-500 dark:hover:border-emerald-400',
        glowShadow: 'hover:shadow-[0_0_30px_-3px_rgba(16,185,129,0.5),0_12px_30px_-10px_rgba(16,185,129,0.3)]',
        badgeBg: 'bg-emerald-500/15 dark:bg-emerald-950/50 border-emerald-500/40 text-emerald-700 dark:text-emerald-300',
        textAccent: 'text-emerald-600 dark:text-emerald-400',
        btnClass: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-500/25',
        haloGradient: 'from-emerald-600 via-green-500 to-teal-500',
        haloShadow: 'drop-shadow-[0_20px_40px_rgba(16,185,129,0.35)]',
        accentBg: 'bg-emerald-500/5 dark:bg-emerald-950/20',
        ringColor: 'ring-emerald-500',
      };
    case 'B.Com':
    case 'M.Com':
      return {
        label: mainDegree,
        gradient: 'from-indigo-600 via-blue-600 to-sky-500',
        glow: 'shadow-indigo-500/25',
        glowBorder: 'hover:border-indigo-500 dark:hover:border-indigo-400',
        glowShadow: 'hover:shadow-[0_0_30px_-3px_rgba(79,70,229,0.5),0_12px_30px_-10px_rgba(79,70,229,0.3)]',
        badgeBg: 'bg-indigo-500/15 dark:bg-indigo-950/50 border-indigo-500/40 text-indigo-700 dark:text-indigo-300',
        textAccent: 'text-indigo-600 dark:text-indigo-400',
        btnClass: 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-indigo-500/25',
        haloGradient: 'from-indigo-600 via-blue-500 to-sky-500',
        haloShadow: 'drop-shadow-[0_20px_40px_rgba(79,70,229,0.35)]',
        accentBg: 'bg-indigo-500/5 dark:bg-indigo-950/20',
        ringColor: 'ring-indigo-500',
      };
    case 'B.Pharm':
    case 'M.Pharm':
    case 'BPT':
      return {
        label: mainDegree,
        gradient: 'from-fuchsia-600 via-pink-600 to-rose-500',
        glow: 'shadow-fuchsia-500/25',
        glowBorder: 'hover:border-fuchsia-500 dark:hover:border-fuchsia-400',
        glowShadow: 'hover:shadow-[0_0_30px_-3px_rgba(217,70,239,0.5),0_12px_30px_-10px_rgba(217,70,239,0.3)]',
        badgeBg: 'bg-fuchsia-500/15 dark:bg-fuchsia-950/50 border-fuchsia-500/40 text-fuchsia-700 dark:text-fuchsia-300',
        textAccent: 'text-fuchsia-600 dark:text-fuchsia-400',
        btnClass: 'bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white shadow-fuchsia-500/25',
        haloGradient: 'from-fuchsia-600 via-pink-500 to-rose-500',
        haloShadow: 'drop-shadow-[0_20px_40px_rgba(217,70,239,0.35)]',
        accentBg: 'bg-fuchsia-500/5 dark:bg-fuchsia-950/20',
        ringColor: 'ring-fuchsia-500',
      };
    case 'BA/BBA LL.B':
    case 'LL.M':
      return {
        label: mainDegree,
        gradient: 'from-rose-700 via-red-600 to-amber-600',
        glow: 'shadow-rose-600/25',
        glowBorder: 'hover:border-rose-500 dark:hover:border-rose-400',
        glowShadow: 'hover:shadow-[0_0_30px_-3px_rgba(225,29,72,0.5),0_12px_30px_-10px_rgba(225,29,72,0.3)]',
        badgeBg: 'bg-rose-500/15 dark:bg-rose-950/50 border-rose-500/40 text-rose-700 dark:text-rose-300',
        textAccent: 'text-rose-600 dark:text-rose-400',
        btnClass: 'bg-gradient-to-r from-rose-700 to-red-600 hover:from-rose-800 hover:to-red-700 text-white shadow-rose-600/25',
        haloGradient: 'from-rose-700 via-red-600 to-amber-600',
        haloShadow: 'drop-shadow-[0_20px_40px_rgba(225,29,72,0.35)]',
        accentBg: 'bg-rose-500/5 dark:bg-rose-950/20',
        ringColor: 'ring-rose-600',
      };
    case 'B.Des':
    case 'B.Arch':
    case 'B.Ed':
    case 'BHMCT':
    case 'B.A. JMC':
      return {
        label: mainDegree,
        gradient: 'from-violet-600 via-fuchsia-600 to-pink-500',
        glow: 'shadow-violet-500/25',
        glowBorder: 'hover:border-violet-500 dark:hover:border-violet-400',
        glowShadow: 'hover:shadow-[0_0_30px_-3px_rgba(139,92,246,0.5),0_12px_30px_-10px_rgba(139,92,246,0.3)]',
        badgeBg: 'bg-violet-500/15 dark:bg-violet-950/50 border-violet-500/40 text-violet-700 dark:text-violet-300',
        textAccent: 'text-violet-600 dark:text-violet-400',
        btnClass: 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white shadow-violet-500/25',
        haloGradient: 'from-violet-600 via-fuchsia-500 to-pink-500',
        haloShadow: 'drop-shadow-[0_20px_40px_rgba(139,92,246,0.35)]',
        accentBg: 'bg-violet-500/5 dark:bg-violet-950/20',
        ringColor: 'ring-violet-500',
      };
    default:
      return {
        label: mainDegree,
        gradient: 'from-orange-500 via-amber-500 to-orange-600',
        glow: 'shadow-orange-500/25',
        glowBorder: 'hover:border-orange-500 dark:hover:border-orange-400',
        glowShadow: 'hover:shadow-[0_0_30px_-3px_rgba(249,115,22,0.5),0_12px_30px_-10px_rgba(249,115,22,0.3)]',
        badgeBg: 'bg-orange-500/15 dark:bg-orange-950/50 border-orange-500/40 text-orange-700 dark:text-orange-300',
        textAccent: 'text-orange-600 dark:text-orange-400',
        btnClass: 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-orange-500/25',
        haloGradient: 'from-orange-500 via-amber-500 to-orange-600',
        haloShadow: 'drop-shadow-[0_20px_40px_rgba(249,115,22,0.35)]',
        accentBg: 'bg-orange-500/5 dark:bg-orange-950/20',
        ringColor: 'ring-orange-500',
      };
  }
};
