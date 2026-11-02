/**
 * Degree detection and color theme utility
 * Maps degree identifiers and names to standard Main Degree labels (e.g. B.Tech, B.Sc, BCA)
 * and provides premium color palettes and shining gradient styling.
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

  // Sciences
  if (name.includes('B.SC') || short.includes('B.SC') || id.startsWith('bsc')) return 'B.Sc';
  if (name.includes('M.SC') || short.includes('M.SC') || id.startsWith('msc')) return 'M.Sc';

  // Business & Management
  if (name.includes('BBA') || short.includes('BBA') || id.startsWith('bba')) return 'BBA';
  if (name.includes('MBA') || short.includes('MBA') || id.startsWith('mba')) return 'MBA';
  if (name.includes('B.COM') || short.includes('B.COM') || id.startsWith('bcom')) return 'B.Com';
  if (name.includes('M.COM') || short.includes('M.COM') || id.startsWith('mcom')) return 'M.Com';

  // Healthcare & Pharmacy
  if (name.includes('B.PHARM') || id.startsWith('bpharm')) return 'B.Pharm';
  if (name.includes('M.PHARM') || id.startsWith('mpharm')) return 'M.Pharm';
  if (name.includes('PHYSIOTHERAPY') || id.includes('bpt')) return 'BPT';

  // Law
  if (name.includes('LL.B') || name.includes('BA LLB') || name.includes('BBA LLB') || id.includes('llb')) return 'BA/BBA LL.B';
  if (name.includes('LL.M') || id.includes('llm')) return 'LL.M';

  // Design & Architecture
  if (name.includes('DESIGN') || name.includes('B.DES') || id.includes('bdes')) return 'B.Des';
  if (name.includes('B.ARCH') || id.includes('barch')) return 'B.Arch';

  // Fallbacks
  if (p.degree === 'Undergraduate') return 'Undergraduate';
  if (p.degree === 'Postgraduate') return 'Postgraduate';
  return p.degree || 'Degree';
};

/**
 * Returns premium theme styling, gradients, glows, and borders for each main degree
 */
export const getDegreeTheme = (mainDegree) => {
  switch (mainDegree) {
    case 'B.Tech':
      return {
        label: 'B.Tech',
        gradient: 'from-blue-600 via-indigo-600 to-violet-600',
        glow: 'shadow-indigo-500/25',
        hoverBorder: 'group-hover:border-indigo-500/60',
        hoverGlow: 'group-hover:shadow-[0_20px_45px_-10px_rgba(99,102,241,0.25)]',
        badgeBg: 'bg-indigo-500/10 dark:bg-indigo-950/40 border-indigo-500/30 text-indigo-600 dark:text-indigo-400',
        textAccent: 'text-indigo-600 dark:text-indigo-400',
        ringColor: 'ring-indigo-500',
      };
    case 'M.Tech':
      return {
        label: 'M.Tech',
        gradient: 'from-violet-600 via-purple-600 to-indigo-600',
        glow: 'shadow-purple-500/25',
        hoverBorder: 'group-hover:border-purple-500/60',
        hoverGlow: 'group-hover:shadow-[0_20px_45px_-10px_rgba(168,85,247,0.25)]',
        badgeBg: 'bg-purple-500/10 dark:bg-purple-950/40 border-purple-500/30 text-purple-600 dark:text-purple-400',
        textAccent: 'text-purple-600 dark:text-purple-400',
        ringColor: 'ring-purple-500',
      };
    case 'BCA':
    case 'MCA':
      return {
        label: mainDegree,
        gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
        glow: 'shadow-emerald-500/25',
        hoverBorder: 'group-hover:border-emerald-500/60',
        hoverGlow: 'group-hover:shadow-[0_20px_45px_-10px_rgba(16,185,129,0.25)]',
        badgeBg: 'bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
        textAccent: 'text-emerald-600 dark:text-emerald-400',
        ringColor: 'ring-emerald-500',
      };
    case 'B.Sc':
    case 'M.Sc':
      return {
        label: mainDegree,
        gradient: 'from-purple-600 via-fuchsia-600 to-pink-600',
        glow: 'shadow-fuchsia-500/25',
        hoverBorder: 'group-hover:border-fuchsia-500/60',
        hoverGlow: 'group-hover:shadow-[0_20px_45px_-10px_rgba(217,70,239,0.25)]',
        badgeBg: 'bg-fuchsia-500/10 dark:bg-fuchsia-950/40 border-fuchsia-500/30 text-fuchsia-600 dark:text-fuchsia-400',
        textAccent: 'text-fuchsia-600 dark:text-fuchsia-400',
        ringColor: 'ring-fuchsia-500',
      };
    case 'BBA':
    case 'MBA':
      return {
        label: mainDegree,
        gradient: 'from-amber-500 via-orange-500 to-red-500',
        glow: 'shadow-orange-500/25',
        hoverBorder: 'group-hover:border-orange-500/60',
        hoverGlow: 'group-hover:shadow-[0_20px_45px_-10px_rgba(249,115,22,0.25)]',
        badgeBg: 'bg-orange-500/10 dark:bg-orange-950/40 border-orange-500/30 text-orange-600 dark:text-orange-400',
        textAccent: 'text-orange-600 dark:text-orange-400',
        ringColor: 'ring-orange-500',
      };
    case 'B.Com':
    case 'M.Com':
      return {
        label: mainDegree,
        gradient: 'from-cyan-600 via-blue-600 to-indigo-600',
        glow: 'shadow-blue-500/25',
        hoverBorder: 'group-hover:border-blue-500/60',
        hoverGlow: 'group-hover:shadow-[0_20px_45px_-10px_rgba(59,130,246,0.25)]',
        badgeBg: 'bg-blue-500/10 dark:bg-blue-950/40 border-blue-500/30 text-blue-600 dark:text-blue-400',
        textAccent: 'text-blue-600 dark:text-blue-400',
        ringColor: 'ring-blue-500',
      };
    case 'B.Pharm':
    case 'M.Pharm':
    case 'BPT':
      return {
        label: mainDegree,
        gradient: 'from-rose-600 via-pink-600 to-red-600',
        glow: 'shadow-rose-500/25',
        hoverBorder: 'group-hover:border-rose-500/60',
        hoverGlow: 'group-hover:shadow-[0_20px_45px_-10px_rgba(244,63,94,0.25)]',
        badgeBg: 'bg-rose-500/10 dark:bg-rose-950/40 border-rose-500/30 text-rose-600 dark:text-rose-400',
        textAccent: 'text-rose-600 dark:text-rose-400',
        ringColor: 'ring-rose-500',
      };
    case 'BA/BBA LL.B':
    case 'LL.M':
      return {
        label: mainDegree,
        gradient: 'from-amber-700 via-amber-600 to-yellow-600',
        glow: 'shadow-amber-600/25',
        hoverBorder: 'group-hover:border-amber-600/60',
        hoverGlow: 'group-hover:shadow-[0_20px_45px_-10px_rgba(217,119,6,0.25)]',
        badgeBg: 'bg-amber-500/10 dark:bg-amber-950/40 border-amber-500/30 text-amber-700 dark:text-amber-300',
        textAccent: 'text-amber-700 dark:text-amber-300',
        ringColor: 'ring-amber-600',
      };
    case 'B.Des':
    case 'B.Arch':
      return {
        label: mainDegree,
        gradient: 'from-fuchsia-600 via-purple-600 to-pink-600',
        glow: 'shadow-fuchsia-500/25',
        hoverBorder: 'group-hover:border-fuchsia-500/60',
        hoverGlow: 'group-hover:shadow-[0_20px_45px_-10px_rgba(192,38,211,0.25)]',
        badgeBg: 'bg-fuchsia-500/10 dark:bg-fuchsia-950/40 border-fuchsia-500/30 text-fuchsia-600 dark:text-fuchsia-400',
        textAccent: 'text-fuchsia-600 dark:text-fuchsia-400',
        ringColor: 'ring-fuchsia-500',
      };
    default:
      return {
        label: mainDegree,
        gradient: 'from-orange-500 via-amber-500 to-orange-600',
        glow: 'shadow-orange-500/25',
        hoverBorder: 'group-hover:border-orange-500/60',
        hoverGlow: 'group-hover:shadow-[0_20px_45px_-10px_rgba(249,115,22,0.25)]',
        badgeBg: 'bg-orange-500/10 dark:bg-orange-950/40 border-orange-500/30 text-orange-600 dark:text-orange-400',
        textAccent: 'text-orange-600 dark:text-orange-400',
        ringColor: 'ring-orange-500',
      };
  }
};
