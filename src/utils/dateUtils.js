/**
 * India Standard Time (IST, Asia/Kolkata) date/time formatting helpers.
 * Backend stores UTC timestamps without trailing 'Z', so we normalize to UTC first.
 */

function parseUtcDate(value) {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  const str = String(value).trim();
  if (!str) return null;
  // Append 'Z' if ISO datetime has no timezone offset so JS parses it as UTC
  const hasZone = /([Zz]|[+-]\d{2}:?\d{2})$/.test(str);
  const normalized = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(str) && !hasZone
    ? `${str.replace(' ', 'T')}Z`
    : str;
  const d = new Date(normalized);
  return isNaN(d.getTime()) ? null : d;
}

export function formatISTTime(value) {
  const d = parseUtcDate(value);
  if (!d) return 'Just now';
  return d.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatISTDate(value) {
  const d = parseUtcDate(value);
  if (!d) return 'N/A';
  return d.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatISTDateTime(value) {
  const d = parseUtcDate(value);
  if (!d) return 'N/A';
  return d.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }) + ' IST';
}
