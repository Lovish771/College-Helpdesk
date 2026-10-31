import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { getStoredItem, setStoredItem, removeStoredItem } from '../utils/storage';
import { resolveApiUrl as resolveAuthUrl } from '../api/client';

const AuthContext = createContext(null);

const ADMIN_EMAILS = [
  'anshulbadmosh2007@gmail.com',
  'lovishwork003@gmail.com',
  'admin@lpu.in',
  'admissions@lpu.co.in'
];

const checkIsAdmin = (u) => {
  if (!u) return false;
  if (u.isAdmin === true) return true;
  if (u.role === 'admin' || u.username === 'admin') return true;
  const email = (u.email || '').trim().toLowerCase();
  return Boolean(email) && ADMIN_EMAILS.includes(email);
};

/**
 * Read the stored session as one unit.
 *
 * A profile on its own proves nothing: it is plain JSON in localStorage and it
 * outlives the token that justified it. Trusting it independently is what let a
 * stale administrator profile keep the admin routes unlocked in a browser with
 * no session at all, so the two are only ever restored together.
 */
const readStoredSession = () => {
  const token = getStoredItem('lpu_auth_token');
  if (!token) return { token: null, user: null };
  return { token, user: getStoredItem('lpu_auth_user') };
};

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);
  const { token, user } = session;
  // Starts true only when there is a stored token to verify, so the admin route
  // guard waits for the server's answer instead of judging a cached profile.
  const [loading, setLoading] = useState(() => Boolean(session.token));

  const applySession = useCallback((nextToken, nextUser) => {
    setSession({ token: nextToken, user: nextUser });
    if (nextToken) {
      setStoredItem('lpu_auth_token', nextToken);
      setStoredItem('lpu_auth_user', nextUser);
    } else {
      removeStoredItem('lpu_auth_token');
      removeStoredItem('lpu_auth_user');
    }
  }, []);

  // Synchronize user profile on initial load or token change
  useEffect(() => {
    let isMounted = true;

    if (!token) {
      setLoading(false);
      return () => { isMounted = false; };
    }

    const fetchMe = async () => {
      try {
        const res = await fetch(resolveAuthUrl('/api/auth/me'), {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json().catch(() => null);
        if (data && data.success && data.user) {
          if (isMounted) {
            setSession({ token, user: data.user });
            setStoredItem('lpu_auth_user', data.user);
          }
        } else if (res.status === 401 && data && data.token_invalid) {
          // Only a token the server actively rejects ends the session.
          if (isMounted) applySession(null, null);
        }
        // Anything else (503, cold start, network) keeps the stored session;
        // signing the user out here was the refresh-loses-login bug.
      } catch (err) {
        console.error('Failed to verify session token:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMe();
    return () => { isMounted = false; };
  }, [token, applySession]);

  const extractError = (data, status, defaultMsg) => {
    if (data) {
      if (typeof data.error === 'string' && data.error.trim() && data.error.toLowerCase() !== 'true') {
        return data.error.trim();
      }
      if (typeof data.message === 'string' && data.message.trim() && data.message.toLowerCase() !== 'true') {
        return data.message.trim();
      }
    }
    return status ? `Server error (${status}). Please try again.` : defaultMsg;
  };

  const sendOtp = useCallback(async (email) => {
    const res = await fetch(resolveAuthUrl('/api/auth/send-otp'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || (data && data.success === false)) {
      throw new Error(extractError(data, res.status, 'Unable to send verification code.'));
    }
    return data;
  }, []);

  const verifyOtp = useCallback(async ({ email, otp, name, acceptedTerms }) => {
    const res = await fetch(resolveAuthUrl('/api/auth/verify-otp'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, name, acceptedTerms })
    });
    const data = await res.json().catch(() => null);
    if (res.ok && data?.success) {
      applySession(data.token, data.user);
      setLoading(false);
      return data;
    }
    if (data && data.error && typeof data.error === 'string' && data.error.toLowerCase() !== 'true') {
      throw new Error(data.error);
    }
    if (data && data.message && typeof data.message === 'string' && data.message.toLowerCase() !== 'true') {
      throw new Error(data.message);
    }
    throw new Error(`Verification failed (${res.status})`);
  }, [applySession]);

  const adminLogin = useCallback(async (username, password) => {
    const res = await fetch(resolveAuthUrl('/api/auth/admin-login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Invalid admin credentials');
    }
    applySession(data.token, data.user);
    setLoading(false);
    return data;
  }, [applySession]);

  const logout = useCallback(() => {
    applySession(null, null);
    setLoading(false);
  }, [applySession]);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token),
    // Admin UI requires a live session, not just a remembered profile.
    isAdmin: Boolean(token) && checkIsAdmin(user),
    sendOtp,
    verifyOtp,
    adminLogin,
    logout
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    const stored = readStoredSession();
    return {
      user: stored.user,
      token: stored.token,
      loading: false,
      isAuthenticated: Boolean(stored.token),
      isAdmin: Boolean(stored.token) && checkIsAdmin(stored.user),
      sendOtp: async () => {},
      verifyOtp: async () => {},
      adminLogin: async () => {},
      logout: () => {}
    };
  }
  return context;
}
