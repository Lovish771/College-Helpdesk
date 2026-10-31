import React, { useState, useEffect, useRef } from 'react';
import {
  Menu, X, Search, ChevronDown, Moon, Sun,
  Home, GraduationCap, BookOpen, HelpCircle, Sparkles,
  UserCheck, Wallet, BedDouble, Scale, PhoneCall,
  User as UserIcon, LogOut, ShieldCheck, KeyRound
} from 'lucide-react';
import LpuLogo from './LpuLogo';
import useAuth from '../hooks/useAuth';

// Primary Core Links
const PRIMARY_NAV = [
  ['home', 'Home', Home],
  ['programs', 'Programmes', GraduationCap],
  ['fees', 'Fees & Slabs', Wallet],
  ['hostel', 'Hostel & Living', BedDouble],
];

export default function Navbar({
  page,
  go,
  onOpenSearch,
  onOpenCompare,
  onOpenAuth,
  onOpenLegal,
  theme = 'light',
  onToggleTheme,
}) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  const lastScrollY = useRef(0);
  const moreRef = useRef(null);
  const userRef = useRef(null);

  const isChat = page === 'chat';

  // Unified Resources & Tools Dropdown
  const moreNavItems = [
    ['compare', 'Compare Degrees', Scale, 'Side-by-side comparison of 2-4 degrees', true],
    ['admissions', 'Admissions & LPUNEST', UserCheck, 'Application process, eligibility & dates'],
    ['curriculum', 'Curriculum & Syllabi', BookOpen, 'Semester courses & lab outlines'],
    ['knowledge', 'Knowledge Base & FAQs', HelpCircle, 'UMS, 75% attendance rule & guidelines'],
    ['contact', 'DSR & Admissions Desk', PhoneCall, 'Block 29 and Block 30 contacts'],
    ...(isAdmin ? [
      ['admin', 'Admin Dashboard', ShieldCheck, 'Real-time metrics, users & security logs']
    ] : []),
  ];

  // Auto-hide navbar on scroll down on standard pages with rAF throttling for 60fps smoothness
  useEffect(() => {
    if (isChat) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setScrolled(currentScrollY > 15);

          if (!open && !moreOpen && !userDropdownOpen) {
            if (currentScrollY > 90 && currentScrollY > lastScrollY.current + 6) {
              setHidden(true);
            } else if (currentScrollY < lastScrollY.current - 6 || currentScrollY <= 40) {
              setHidden(false);
            }
          }
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [open, moreOpen, userDropdownOpen, isChat]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const to = (p, isSpecial) => {
    if (isSpecial && onOpenCompare) {
      onOpenCompare();
    } else {
      go(p);
    }
    setOpen(false);
    setMoreOpen(false);
    setUserDropdownOpen(false);
  };

  const isDark = theme === 'dark';
  const isMoreActive = moreNavItems.some(([id]) => page === id);

  return (
    <>
      <header
        role="banner"
        className={`${
          isChat
            ? 'relative w-full z-40 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200/90 dark:border-white/10 shrink-0'
            : 'fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 pt-2 sm:pt-3 transition-transform duration-300'
        } ${hidden && !isChat ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <nav
          aria-label="Main Navigation"
          className={`mx-auto max-w-7xl flex items-center justify-between gap-2 px-3.5 sm:px-5 py-2 rounded-full border transition-all duration-300 backdrop-blur-2xl ${
            isChat
              ? 'border-transparent bg-transparent shadow-none max-w-full'
              : scrolled
              ? 'bg-white/85 dark:bg-slate-900/85 border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white shadow-[0_12px_40px_-8px_rgba(15,23,42,0.12),inset_0_1px_0_0_rgba(255,255,255,0.8)] dark:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)]'
              : 'bg-white/75 dark:bg-slate-900/75 border-slate-200/60 dark:border-white/[0.06] text-slate-900 dark:text-white shadow-[0_8px_30px_rgba(15,23,42,0.05),inset_0_1px_0_0_rgba(255,255,255,0.9)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.06)]'
          }`}
        >
          {/* Brand: Mascot Logo + Title */}
          <button
            onClick={() => to('home')}
            aria-label="Student Helpdesk"
            className="flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-2xl group transition-transform active:scale-95 shrink-0 cursor-pointer text-left pr-2"
          >
            <div className="shrink-0 transition-transform duration-300 group-hover:scale-105">
              <LpuLogo variant={isDark ? 'dark' : 'light'} size={38} />
            </div>
            <div className="flex flex-col justify-center leading-none">
              <span className="font-display font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                Student Helpdesk
              </span>
            </div>
          </button>

          {/* Primary Navigation Menu (Desktop) */}
          <ul className="hidden xl:flex items-center gap-1 shrink-0" role="list">
            {PRIMARY_NAV.map(([id, label, Icon]) => {
              const active = page === id;
              return (
                <li key={id}>
                  <button
                    onClick={() => to(id)}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer group active:scale-95 ${
                      active
                        ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 shadow-2xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <Icon
                      size={13}
                      className={`transition-colors ${
                        active
                          ? 'text-orange-600 dark:text-orange-400'
                          : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                      }`}
                    />
                    <span>{label}</span>
                  </button>
                </li>
              );
            })}

            {/* Resources & Academic Tools Dropdown */}
            <li className="relative" ref={moreRef}>
              <button
                type="button"
                onClick={() => setMoreOpen(!moreOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95 ${
                  isMoreActive
                    ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
                }`}
                aria-expanded={moreOpen}
              >
                <span>Resources &amp; Tools</span>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${moreOpen ? 'rotate-180 text-orange-500' : 'text-slate-400'}`}
                />
              </button>

              {/* Dropdown Panel */}
              {moreOpen && (
                <div
                  className={`absolute right-0 top-full mt-2 w-72 rounded-2xl border shadow-2xl p-2 animate-fade-in z-50 backdrop-blur-2xl transition-colors ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.7)]'
                      : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
                  }`}
                >
                  <div className="space-y-1">
                    {moreNavItems.map(([id, label, Icon, desc, isSpecial]) => {
                      const active = page === id;
                      return (
                        <button
                          type="button"
                          key={id}
                          onClick={() => to(id, isSpecial)}
                          className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                            active
                              ? isDark
                                ? 'bg-orange-950/60 text-orange-400'
                                : 'bg-orange-50 text-orange-600'
                              : isDark
                              ? 'hover:bg-slate-800 text-slate-200 hover:text-white'
                              : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                          }`}
                        >
                          <span
                            className={`p-2 rounded-lg shrink-0 mt-0.5 transition-colors ${
                              active
                                ? isDark
                                  ? 'bg-orange-900/60 text-orange-400'
                                  : 'bg-orange-100 text-orange-600'
                                : isDark
                                ? 'bg-slate-800 text-slate-300'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            <Icon size={14} />
                          </span>
                          <div>
                            <p
                              className={`text-xs font-bold leading-none ${
                                active
                                  ? isDark ? 'text-orange-400' : 'text-orange-600'
                                  : isDark ? 'text-white' : 'text-slate-900'
                              }`}
                            >
                              {label}
                            </p>
                            <p
                              className={`text-[11px] mt-1 leading-tight ${
                                isDark ? 'text-slate-400' : 'text-slate-500'
                              }`}
                            >
                              {desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </li>
          </ul>

          {/* Right Action Elements */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Spotlight Search Modal Button */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="flex h-8 sm:h-9 items-center justify-center gap-1.5 px-2.5 sm:px-3 rounded-full text-xs font-semibold border transition-all duration-200 active:scale-95 cursor-pointer shadow-2xs shrink-0 bg-slate-100/90 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700"
              title="Search programmes, fees, hostels & rules (Ctrl+K)"
            >
              <Search size={14} className="text-orange-500 shrink-0" />
              <span className="hidden md:inline">Search</span>
              <kbd className="hidden 2xl:inline text-[9px] font-semibold px-1.5 py-0.5 rounded text-slate-400 dark:text-slate-400 bg-slate-200/80 dark:bg-slate-700">
                ⌘K
              </kbd>
            </button>

            {/* Dark / Light Theme Toggler */}
            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                className="flex h-8 sm:h-9 items-center justify-center gap-1.5 px-2.5 sm:px-3 rounded-full border transition-all duration-200 active:scale-95 cursor-pointer shadow-2xs shrink-0 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 border-slate-200 dark:border-slate-700"
                title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              >
                {isDark ? (
                  <>
                    <Sun size={15} className="text-amber-400 shrink-0" />
                    <span className="hidden sm:inline text-xs font-bold text-amber-300">Light</span>
                  </>
                ) : (
                  <>
                    <Moon size={15} className="text-slate-700 shrink-0" />
                    <span className="hidden sm:inline text-xs font-bold text-slate-800">Dark</span>
                  </>
                )}
              </button>
            )}

            {/* Authentication Button / User Dropdown */}
            {isAuthenticated ? (
              <div className="relative" ref={userRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-200 dark:border-orange-900/60 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 text-xs font-bold shadow-2xs hover:bg-orange-100 active:scale-95 transition-all cursor-pointer"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px] font-extrabold uppercase">
                    {(user.name || user.email || 'U')[0]}
                  </div>
                  <span className="hidden md:inline max-w-[100px] truncate">{user.name || user.email}</span>
                  <ChevronDown size={11} className={`transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {userDropdownOpen && (
                  <div
                    className={`absolute right-0 top-full mt-2 w-56 rounded-2xl border shadow-2xl p-2 z-50 text-xs animate-fade-in backdrop-blur-2xl transition-colors ${
                      isDark
                        ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.7)]'
                        : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
                    }`}
                  >
                    <div className="p-2.5 border-b border-slate-100 dark:border-slate-800/80 mb-1">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono truncate">{user.email}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        isAdmin ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}>
                        {isAdmin ? 'Administrator' : 'Student (Verified)'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => to('chat')}
                      className="w-full flex items-center gap-2 p-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      <Sparkles size={14} className="text-orange-500" />
                      <span>My Saved Chats</span>
                    </button>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => to('admin')}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-left hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold"
                      >
                        <ShieldCheck size={14} className="text-purple-600" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (onOpenLegal) onOpenLegal('privacy');
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      <BookOpen size={14} className="text-slate-400" />
                      <span>Privacy &amp; Data Rights</span>
                    </button>

                    <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-left text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold transition-colors"
                      >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onOpenAuth && onOpenAuth()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors cursor-pointer"
              >
                <UserIcon size={13} className="text-orange-500" />
                <span>Sign In</span>
              </button>
            )}

            {/* AI Assistant Pill Button */}
            <button
              type="button"
              onClick={() => to('chat')}
              className={`hidden md:inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 text-xs font-medium bg-orange-600 hover:bg-orange-700 text-white transition-colors cursor-pointer shrink-0 ${
                page === 'chat'
                  ? 'ring-2 ring-orange-500 ring-offset-2 dark:ring-offset-slate-900'
                  : ''
              }`}
            >
              <Sparkles size={13} className="shrink-0" />
              <span>AI Assistant</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className="p-1.5 sm:p-2 rounded-full xl:hidden transition-colors active:scale-95 cursor-pointer shrink-0 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label={open ? 'Close navigation' : 'Open navigation'}
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile Drawer */}
        {open && (
          <div className="xl:hidden mt-2 p-4 rounded-3xl backdrop-blur-2xl shadow-2xl animate-fade-in border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Navigation Menu
              </span>
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="text-xs font-bold text-rose-600 flex items-center gap-1"
                >
                  <LogOut size={12} />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    if (onOpenAuth) onOpenAuth();
                  }}
                  className="text-xs font-bold text-orange-600 flex items-center gap-1"
                >
                  <UserIcon size={12} />
                  <span>Sign In / Register</span>
                </button>
              )}
            </div>

            <ul className="space-y-1">
              {[
                ['chat', 'AI Assistant (24/7 Chat)', Sparkles],
                ...PRIMARY_NAV,
                ...moreNavItems.map(([id, label, icon, , isSpecial]) => [id, label, icon, isSpecial]),
              ].map(([id, label, Icon, isSpecial]) => {
                const active = page === id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => to(id, isSpecial)}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                        active
                          ? 'bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 font-bold'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon size={16} className={active ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400 dark:text-slate-500'} />
                      <span>{label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </header>
    </>
  );
}
