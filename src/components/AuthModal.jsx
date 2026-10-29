import React, { useState, useEffect, useRef } from 'react';
import {
  X, Mail, Lock, KeyRound, ShieldCheck, ArrowRight,
  RefreshCw, CheckCircle2, AlertCircle, Sparkles, User as UserIcon,
  AlertTriangle
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

export default function AuthModal({ isOpen, onClose, onOpenLegal, onLoginSuccess }) {
  const { sendOtp, verifyOtp, adminLogin } = useAuth();

  const [mode, setMode] = useState('otp'); // 'otp' | 'admin'
  const [step, setStep] = useState(1); // 1: Email entry, 2: OTP verification

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  // Admin credentials
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [dispatchInfo, setDispatchInfo] = useState(null);

  const otpInputRef = useRef(null);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // Focus management and ESC key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Auto focus OTP input on step 2
  useEffect(() => {
    if (step === 2 && otpInputRef.current) {
      setTimeout(() => otpInputRef.current?.focus(), 150);
    }
  }, [step]);

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!acceptedTerms) {
      setError('Please accept the Terms and Conditions and Privacy Policy to continue.');
      return;
    }

    setLoading(true);
    try {
      const data = await sendOtp(email);
      setDispatchInfo(data);
      setStep(2);
      setCooldown(data.cooldownSeconds || 30);
      if (data.devOtp) {
        setOtp(data.devOtp);
      }
    } catch (err) {
      setError(err.message || 'Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!otp || otp.trim().length !== 6) {
      setError('Please enter the 6-digit numeric verification code.');
      return;
    }

    setLoading(true);
    try {
      await verifyOtp({
        email,
        otp: otp.trim(),
        name: name.trim() || 'Student',
        acceptedTerms
      });
      if (onLoginSuccess) onLoginSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Incorrect or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!adminUsername || !adminPassword) {
      setError('Both username and password are required.');
      return;
    }

    setLoading(true);
    try {
      await adminLogin(adminUsername, adminPassword);
      if (onLoginSuccess) onLoginSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-orange-500"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 id="auth-modal-title" className="text-lg font-bold text-slate-900 dark:text-white font-display">
              {mode === 'otp' ? 'Student Sign In / Register' : 'Administrator Portal'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Lovely Professional University Student Helpdesk
            </p>
          </div>
        </div>

        {/* Mode Switcher Pills */}
        <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('otp');
              setError('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'otp'
                ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Email OTP Sign-In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('admin');
              setError('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'admin'
                ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Admin Sign-In
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            role="alert"
            className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-shake"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* ── MODE 1: EMAIL OTP ── */}
        {mode === 'otp' && (
          <div>
            {step === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Name (Optional)
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Aman Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    We will send a 6-digit cryptographic code valid for 10 minutes.
                  </p>
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="leading-tight">
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={() => onOpenLegal && onOpenLegal('terms')}
                        className="text-orange-600 dark:text-orange-400 underline font-medium hover:text-orange-700"
                      >
                        Terms and Conditions
                      </button>{' '}
                      and{' '}
                      <button
                        type="button"
                        onClick={() => onOpenLegal && onOpenLegal('privacy')}
                        className="text-orange-600 dark:text-orange-400 underline font-medium hover:text-orange-700"
                      >
                        Privacy Policy
                      </button>
                      .
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending Verification Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Send 6-Digit Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in">
                {dispatchInfo?.deliveredOnline ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Real Online Email Dispatched!</p>
                      <p className="text-[11px] text-emerald-800/90 dark:text-emerald-300/90 mt-0.5 leading-relaxed">
                        Verification code successfully sent to <strong>{email}</strong> via {dispatchInfo.provider}. Please check your inbox and spam folder.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Online Email Service Not Configured</p>
                        <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90 mt-0.5 leading-snug">
                          No SMTP or Resend credentials are added to <code className="px-1 py-0.5 bg-amber-200/60 dark:bg-amber-900/60 rounded font-mono">.env</code> yet.
                        </p>
                      </div>
                    </div>
                    {dispatchInfo?.devOtp && (
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700/60 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Test Verification Code:</span>
                          <div className="font-mono text-lg font-black text-amber-600 dark:text-amber-400 tracking-widest">
                            {dispatchInfo.devOtp}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setOtp(dispatchInfo.devOtp)}
                          className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 font-bold text-[11px] hover:bg-amber-200 transition-colors"
                        >
                          Auto-Filled ✓
                        </button>
                      </div>
                    )}
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      💡 To receive emails directly in your inbox, add <code className="font-mono">RESEND_API_KEY</code> or Gmail SMTP in <code className="font-mono">.env</code>.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Enter 6-Digit Code
                  </label>
                  <input
                    ref={otpInputRef}
                    type="text"
                    maxLength={6}
                    required
                    placeholder="••••••"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full text-center tracking-[0.5em] font-mono text-xl py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 font-bold"
                  />
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-slate-500 dark:text-slate-400 hover:underline"
                    >
                      Change email
                    </button>
                    {cooldown > 0 ? (
                      <span className="text-slate-400 font-medium">Resend in {cooldown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={loading}
                        className="text-orange-600 dark:text-orange-400 font-bold hover:underline"
                      >
                        Resend Code
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify &amp; Continue</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ── MODE 2: ADMINISTRATOR LOGIN ── */}
        {mode === 'admin' && (
          <form onSubmit={handleAdminLogin} className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Admin Username or Email
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-50 text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Access Admin Dashboard</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            Student Helpdesk • Encrypted Session &amp; OWASP Zero-Trust Shield
          </p>
        </div>
      </div>
    </div>
  );
}
