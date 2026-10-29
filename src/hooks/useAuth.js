import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { getStoredItem, setStoredItem } from '../utils/storage';

const AuthContext = createContext(null);

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
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user && isMounted) {
            setUser(data.user);
            setStoredItem('lpu_auth_user', data.user);
          } else if (isMounted) {
            // Token expired or invalid
            setToken(null);
            setUser(null);
            setStoredItem('lpu_auth_token', null);
            setStoredItem('lpu_auth_user', null);
          }
        }
      } catch (err) {
        console.error('Failed to verify session token:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMe();
    return () => { isMounted = false; };
  }, [token]);

  const sendOtp = useCallback(async (email) => {
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || data.message || 'Failed to send verification code');
    }
    return data;
  }, []);

  const verifyOtp = useCallback(async ({ email, otp, name, acceptedTerms }) => {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, name, acceptedTerms })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Invalid verification code');
    }
    setToken(data.token);
    setUser(data.user);
    setStoredItem('lpu_auth_token', data.token);
    setStoredItem('lpu_auth_user', data.user);
    return data;
  }, []);

  const adminLogin = useCallback(async (username, password) => {
    const res = await fetch('/api/auth/admin-login', {
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

  const logout = useCallback(async () => {
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch {}
    setToken(null);
    setUser(null);
    setStoredItem('lpu_auth_token', null);
    setStoredItem('lpu_auth_user', null);
  }, [token]);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(user && token),
    isAdmin: Boolean(user && (user.role === 'admin' || user.username === 'admin')),
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
    const token = getStoredItem('lpu_auth_token') || null;
    const user = getStoredItem('lpu_auth_user') || null;
    return {
      user,
      token,
      loading: false,
      isAuthenticated: Boolean(user && token),
      isAdmin: Boolean(user && (user.role === 'admin' || user.username === 'admin')),
      sendOtp: async () => {},
      verifyOtp: async () => {},
      adminLogin: async () => {},
      logout: () => {
        setStoredItem('lpu_auth_token', null);
        setStoredItem('lpu_auth_user', null);
        window.location.reload();
      }
    };
  }
  return context;
}
