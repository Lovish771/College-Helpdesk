// Switch to the Flask backend by setting VITE_USE_MOCK=false and VITE_API_URL in .env
export const API_URL = (() => {
  // If running in browser and not on localhost, always use relative path '' so requests hit the live serverless backend (/api/...)
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '';
  }
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl !== undefined && envUrl !== '') {
    if (import.meta.env.PROD && (envUrl.includes('localhost') || envUrl.includes('127.0.0.1'))) {
      return '';
    }
    return envUrl;
  }
  return import.meta.env.PROD ? '' : 'http://localhost:5000';
})();

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
export const wait = (ms = 400) => new Promise((r) => setTimeout(r, ms));

// Every endpoint goes through here: mock() while USE_MOCK, otherwise a real fetch with seamless offline fallback.
export async function request(path, mock, options = {}) {
  if (USE_MOCK) {
    await wait(200);
    return typeof mock === 'function' ? mock() : mock;
  }

  // Normalize clean path if API_URL already includes /api and path starts with /api
  const cleanBase = API_URL.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const fullUrl = cleanBase.endsWith('/api') && cleanPath.startsWith('/api/')
    ? `${cleanBase}${cleanPath.substring(4)}`
    : `${cleanBase}${cleanPath}`;

  // Attach JWT Bearer token if available in storage
  let token = null;
  try {
    const raw = localStorage.getItem('lpu_auth_token');
    if (raw) token = JSON.parse(raw);
  } catch {
    token = localStorage.getItem('lpu_auth_token');
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(fullUrl, { ...options, headers });
    if (!res.ok) {
      if (res.status === 401) {
        const errorData = await res.json().catch(() => ({}));
        const err = new Error(errorData.error || 'Login required. Please verify your email.');
        err.status = 401;
        err.requires_login = true;
        throw err;
      }
      console.warn(`[API] Endpoint ${path} returned status ${res.status}. Falling back to cached client knowledge.`);
      return typeof mock === 'function' ? mock() : mock;
    }
    return await res.json();
  } catch (e) {
    if (e.requires_login) throw e;
    console.warn(`[API] Network failure on ${path}:`, e.message, 'Using client knowledge base.');
    return typeof mock === 'function' ? mock() : mock;
  }
}
