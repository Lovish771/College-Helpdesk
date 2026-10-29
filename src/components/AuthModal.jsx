import React, { useState, useEffect, useRef } from 'react';
import {
  X, Mail, KeyRound, ArrowRight,
  RefreshCw, CheckCircle2, AlertCircle, User as UserIcon,
  ShieldCheck, Lock, Sparkles, Send
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

export default function AuthModal({ isOpen, onClose, onOpenLegal, onLoginSuccess }) {
  const { sendOtp, verifyOtp } = useAuth();

  // Mode: 'signin' | 'register'
  const [tab, setTab] = useState('signin');
  const [step, setStep] = useState(1); // 1: Email entry, 2: OTP verification

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  // UI States
  const [loading, setLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);

  const otpInputRef = useRef(null);

  // 30-Second Countdown Timer for Resend OTP
  useEffect(() => {
    if (step !== 2 || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step, timer]);

  // Focus and Escape key listeners
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

  // Auto focus OTP input on entering step 2
  useEffect(() => {
    if (step === 2 && otpInputRef.current) {
      setTimeout(() => otpInputRef.current?.focus(), 150);
    }
  }, [step]);

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!acceptedTerms) {
      setError('Please accept the Terms and Conditions to continue.');
      return;
    }

    setLoading(true);
    try {
      await sendOtp(cleanEmail);
      setStep(2);
      setTimer(30); // 30 seconds timer
      setOtp('');
    } catch (err) {
      setError(err.message || 'Failed to dispatch verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0 || loading) return;
    setError('');
    setLoading(true);
    try {
      await sendOtp(email.trim().toLowerCase());
      setTimer(30);
      setOtp('');
    } catch (err) {
      setError(err.message || 'Unable to resend OTP at this time.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');

    const cleanOtp = otp.trim().replace(/[^0-9]/g, '');
    if (cleanOtp.length !== 6) {
      setError('Please enter the complete 6-digit numeric verification code.');
      return;
    }

    setIsVerifying(true);
    try {
      await verifyOtp({
        email: email.trim().toLowerCase(),
        otp: cleanOtp,
        name: name.trim() || (tab === 'register' ? 'New Member' : 'User'),
        acceptedTerms
      });
      setVerifiedSuccess(true);
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess();
        onClose();
      }, 700);
    } catch (err) {
      setError(err.message || 'Incorrect or expired code. Please try again.');
      setIsVerifying(false);
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
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-orange-500/10 dark:bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-orange-500 cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon + University Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/20">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 id="auth-modal-title" className="text-lg font-bold text-slate-900 dark:text-white font-display">
              {tab === 'signin' ? 'Sign In to Helpdesk' : 'Register New Account'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Lovely Professional University Helpdesk
            </p>
          </div>
        </div>

        {/* Tab Switcher: Sign In vs Register */}
        {step === 1 && (
          <div className="grid grid-cols-2 p-1 mb-5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => {
                setTab('signin');
                setError('');
              }}
              className={`py-2 px-3 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                tab === 'signin'
                  ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('register');
                setError('');
              }}
              className={`py-2 px-3 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                tab === 'register'
                  ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Register
            </button>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div
            role="alert"
            className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-shake"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* ── STEP 1: EMAIL ENTRY ── */}
        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name
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
            )}

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
                {tab === 'signin'
                  ? 'We will send a 6-digit one-time password (OTP) to your registered email.'
                  : 'A 6-digit verification code will be sent to confirm your email.'}
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
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Dispatching OTP Code...</span>
                </>
              ) : (
                <>
                  <span>{tab === 'signin' ? 'Send Login OTP' : 'Send Registration OTP'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* ── STEP 2: ENTER OTP AREA WITH 30S TIMER ── */
          <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in">
            {/* Elegant OTP Dispatched Banner */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-3 shadow-2xs animate-scale-up">
              <div className="p-1 rounded-lg bg-emerald-500 text-white shrink-0 mt-0.5 shadow-sm">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-emerald-900 dark:text-emerald-100">OTP Sent Successfully!</p>
                <p className="text-[11px] text-emerald-800/90 dark:text-emerald-300/90 mt-0.5 leading-relaxed break-all">
                  Verification code has been dispatched to <strong>{email}</strong>.
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Enter 6-Digit Code
                </label>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[11px] text-orange-600 dark:text-orange-400 hover:underline font-semibold cursor-pointer"
                >
                  Change Email
                </button>
              </div>
              <input
                ref={otpInputRef}
                type="text"
                maxLength={6}
                required
                placeholder="••••••"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full text-center tracking-[0.55em] font-mono text-2xl py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 font-bold transition-all shadow-inner"
              />

              {/* Resend OTP with 30s Countdown Timer */}
              <div className="flex items-center justify-between mt-2.5 text-xs">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Didn't receive the code?
                </span>
                {timer > 0 ? (
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 tabular-nums">
                    Resend OTP in <strong className="text-orange-600 dark:text-orange-400">{timer}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Resend OTP Now</span>
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifying || otp.length !== 6 || verifiedSuccess}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {verifiedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200 animate-bounce" />
                  <span>Authenticated! Entering Helpdesk...</span>
                </>
              ) : isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{tab === 'signin' ? 'Verify & Sign In' : 'Verify & Complete Registration'}</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Professional Encrypted Security Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>256-Bit SSL Encrypted Verification • Official Academic Gateway</span>
        </div>
      </div>
    </div>
  );
}
