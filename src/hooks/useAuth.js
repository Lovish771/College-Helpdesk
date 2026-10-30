import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { getStoredItem, setStoredItem } from '../utils/storage';
import { API_URL } from '../api/client';

const resolveAuthUrl = (endpoint) => {
  const base = (API_URL || '').replace(/\/+$/, '');
  const clean = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!base) return clean;
  if (base.endsWith('/api') && clean.startsWith('/api/')) {
    return `${base}${clean.substring(4)}`;
  }
  return `${base}${clean}`;
};

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

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredItem('lpu_auth_token') || null);
  const [user, setUser] = useState(() => getStoredItem('lpu_auth_user') || null);
  const [loading, setLoading] = useState(true);

  // Synchronize user profile on initial load or token change
  useEffect(() => {
    let isMounted = true;
    const fetchMe = async () => {
      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }
      try {
        const res = await fetch(resolveAuthUrl('/api/auth/me'), {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json().catch(() => null);
        if (data && data.success && data.user) {
          if (isMounted) {
            setUser(data.user);
            setStoredItem('lpu_auth_user', data.user);
          }
        } else if (res.status === 401 && data && data.token_invalid) {
          // Only a token the server actively rejects ends the session.
          if (isMounted) {
            setToken(null);
            setUser(null);
            setStoredItem('lpu_auth_token', null);
            setStoredItem('lpu_auth_user', null);
          }
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
  }, [token]);

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
      setToken(data.token);
      setUser(data.user);
      setStoredItem('lpu_auth_token', data.token);
      setStoredItem('lpu_auth_user', data.user);
      return data;
    }
    if (data && data.error && typeof data.error === 'string' && data.error.toLowerCase() !== 'true') {
      throw new Error(data.error);
    }
    if (data && data.message && typeof data.message === 'string' && data.message.toLowerCase() !== 'true') {
      throw new Error(data.message);
    }
    throw new Error(`Verification failed (${res.status})`);
  }, []);

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
    setToken(data.token);
    setUser(data.user);
    setStoredItem('lpu_auth_token', data.token);
    setStoredItem('lpu_auth_user', data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setStoredItem('lpu_auth_token', null);
    setStoredItem('lpu_auth_user', null);
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token),
    isAdmin: checkIsAdmin(user),
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
    const rawToken = getStoredItem('lpu_auth_token');
    const rawUser = getStoredItem('lpu_auth_user');
    return {
      user: rawUser,
      token: rawToken,
      loading: false,
      isAuthenticated: Boolean(rawToken),
      isAdmin: checkIsAdmin(rawUser),
      sendOtp: async () => {},
      verifyOtp: async () => {},
      adminLogin: async () => {},
      logout: () => {}
    };
  }
  return context;
}
