// Switch to the Flask backend by setting VITE_USE_MOCK=false and VITE_API_URL in .env
export const API_URL = import.meta.env.VITE_API_URL !== undefined
  ? import.meta.env.VITE_API_URL
  : (import.meta.env.PROD ? '' : 'http://localhost:5000');

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
      console.warn(`[API] Endpoint ${path} returned status ${res.status}. Falling back to cached client knowledge.`);
      if (typeof mock === 'function') return mock();
      throw new Error(`Request failed (${res.status})`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[API] Backend unreachable for ${path}. Gracefully degrading to client-side knowledge cache.`);
    if (typeof mock === 'function') {
      await wait(150);
      return mock();
    }
    throw err;
  }
}
