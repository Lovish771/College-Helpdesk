/**
 * Schema-validated LocalStorage persistence utility with silent fallback.
 * Prevents application crashes from corrupted or unexpected client state.
 */

const STORAGE_SCHEMAS = {
  lpu_theme: {
    validate: (val) => val === 'dark' || val === 'light',
    default: () => {
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    },
  },
  lpu_fee_preferences: {
    validate: (val) => {
      return (
        val &&
        typeof val === 'object' &&
        typeof val.selectedCourseId === 'string' &&
        ['none', 'cat1', 'cat2', 'cat3', 'custom'].includes(val.calcSlab) &&
        typeof val.yearPlans === 'object'
      );
    },
    default: () => ({
      selectedCourseId: 'btech-cse',
      calcSlab: 'cat1',
      customPercent: 50,
      applyDefense: false,
      applyTeacher: false,
      yearPlans: {
        1: { hostel: 'standard-4', mess: 'std-4', laundry: true },
        2: { hostel: 'standard-4', mess: 'none', laundry: true },
        3: { hostel: 'none', mess: 'none', laundry: false },
        4: { hostel: 'none', mess: 'none', laundry: false },
        5: { hostel: 'none', mess: 'none', laundry: false },
      },
    }),
  },
  lpu_hostel_preferences: {
    validate: (val) => {
      return val && typeof val === 'object' && typeof val.roomType === 'string';
    },
    default: () => ({
      roomType: 'standard-4',
      messPlan: 'std-4',
      laundry: true,
    }),
  },
  lpu_compare_programs: {
    validate: (val) => Array.isArray(val) && val.every((id) => typeof id === 'string'),
    default: () => ['btech-cse', 'btech-aiml'],
  },
};

/**
 * Safely retrieve a validated item from localStorage
 * @param {string} key
 * @returns {any}
 */
export function getStoredItem(key) {
  const schema = STORAGE_SCHEMAS[key];
  if (!schema) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return schema.default();

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // In case the stored value was a plain string like "dark"
      parsed = raw;
    }

    if (schema.validate(parsed)) {
      return parsed;
    }
    // Validation failed: fall back silently to schema default
    return schema.default();
  } catch (err) {
    return schema.default();
  }
}

/**
 * Safely persist an item to localStorage with validation
 * @param {string} key
 * @param {any} value
 */
export function setStoredItem(key, value) {
  try {
    const schema = STORAGE_SCHEMAS[key];
    if (schema && !schema.validate(value)) {
      console.warn(`[storage] Attempted to store invalid payload for key "${key}"`);
      return;
    }
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (err) {
    // Silent fail if quota exceeded or private browsing restrictions
  }
}

/**
 * Remove an item from localStorage safely
 * @param {string} key
 */
export function removeStoredItem(key) {
  try {
    localStorage.removeItem(key);
  } catch {}
}
