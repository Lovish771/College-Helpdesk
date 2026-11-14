import React, { useCallback, useEffect, useState, useRef, Suspense, lazy } from 'react';
import { flushSync } from 'react-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingAiAssistant from './components/FloatingAiAssistant';
import CustomCursor from './components/CustomCursor';
import ErrorBoundary from './components/ErrorBoundary';
import PageSkeleton from './components/Skeleton';
import useChat from './hooks/useChat';
import { AuthProvider } from './hooks/useAuth';
import { getStoredItem, setStoredItem } from './utils/storage';

// Core entry views loaded synchronously for instant first-paint
import Home from './pages/Home';
import Chatbot from './pages/Chatbot';
import Programs from './pages/Programs';
import Eligibility from './pages/Eligibility';
import Contact from './pages/Contact';

// Heavy secondary routes dynamically chunked
const Curriculum = lazy(() => import('./pages/Curriculum'));
const KnowledgeBase = lazy(() => import('./pages/KnowledgeBase'));
const Admissions = lazy(() => import('./pages/Admissions'));
const Fees = lazy(() => import('./pages/Fees'));
const Hostel = lazy(() => import('./pages/Hostel'));
const Analytics = lazy(() => import('./pages/Analytics'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Heavy overlay modals dynamically loaded on demand
const SearchModal = lazy(() => import('./components/SearchModal'));
const DegreeComparisonModal = lazy(() => import('./components/DegreeComparisonModal'));
const LegalModal = lazy(() => import('./components/LegalModal'));
const AuthModal = lazy(() => import('./components/AuthModal'));

const read = () => window.location.hash.replace('#/', '') || 'home';

function AppContent() {
  const [page, setPage] = useState(read);
  const [pending, setPending] = useState(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [comparePrograms, setComparePrograms] = useState(() => getStoredItem('lpu_compare_programs'));

  // Legal and Auth Modal states
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalInitialTab, setLegalInitialTab] = useState('disclaimer');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Dark / Light Theme management with schema-validated persistence
  const [theme, setTheme] = useState(() => getStoredItem('lpu_theme'));
  const isThemeChangingRef = useRef(false);

  // Keep DOM root, body, and storage strictly synchronized with active theme
  useEffect(() => {
    const isDark = theme === 'dark';
    try {
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
      document.documentElement.setAttribute('data-theme', theme);
      setStoredItem('lpu_theme', theme);
    } catch {}
  }, [theme]);

  const toggleTheme = useCallback((event) => {
    if (isThemeChangingRef.current) return;
    const isDark = theme === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';

    // Bidirectional circular view transition if supported
    if (typeof document !== 'undefined' && document.startViewTransition) {
      try {
        isThemeChangingRef.current = true;
        const rect = event?.currentTarget?.getBoundingClientRect?.() || event?.target?.getBoundingClientRect?.();
        const x = (event && typeof event.clientX === 'number' && event.clientX > 0)
          ? event.clientX
          : (rect ? Math.round(rect.left + rect.width / 2) : (window.innerWidth - 80));
        const y = (event && typeof event.clientY === 'number' && event.clientY > 0)
          ? event.clientY
          : (rect ? Math.round(rect.top + rect.height / 2) : 30);
        const endRadius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y)
        );

        // Set CSS custom properties for GPU-accelerated circle reveal / shrink
        document.documentElement.style.setProperty('--click-x', `${x}px`);
        document.documentElement.style.setProperty('--click-y', `${y}px`);
        document.documentElement.style.setProperty('--click-r', `${endRadius}px`);

        // Disable CSS transitions during DOM mutation so clean, instant snapshot is taken
        document.documentElement.classList.add('disable-transitions');

        const transition = document.startViewTransition(() => {
          flushSync(() => {
            setTheme(nextTheme);
          });
          if (nextTheme === 'dark') {
            document.documentElement.classList.add('dark');
            document.body.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
            document.body.classList.remove('dark');
          }
          document.documentElement.setAttribute('data-theme', nextTheme);
        });

        transition.ready.then(() => {
          try {
            const isDarkNext = nextTheme === 'dark';
            document.documentElement.animate(
              {
                clipPath: isDarkNext
                  ? [
                      `circle(${endRadius}px at ${x}px ${y}px)`,
                      `circle(0px at ${x}px ${y}px)`,
                    ]
                  : [
                      `circle(0px at ${x}px ${y}px)`,
                      `circle(${endRadius}px at ${x}px ${y}px)`,
                    ],
              },
              {
                duration: 450,
                easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                pseudoElement: isDarkNext
                  ? '::view-transition-old(root)'
                  : '::view-transition-new(root)',
              }
            );
          } catch (_) {}
        }).catch(() => {});

        transition.finished.finally(() => {
          document.documentElement.classList.remove('disable-transitions');
          isThemeChangingRef.current = false;
        });
        return;
      } catch {
        document.documentElement.classList.remove('disable-transitions');
        isThemeChangingRef.current = false;
      }
    }

    // Smooth fallback with global transition class
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('theme-transitioning');
      setTheme(nextTheme);
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
      }, 400);
    } else {
      setTheme(nextTheme);
    }
  }, [theme]);

  // Clean document title matching page name
  useEffect(() => {
    const PAGE_TITLES = {
      home: 'Home',
      chat: 'AI Assistant',
      programs: 'Programmes',
      curriculum: 'Curriculum',
      knowledge: 'Knowledge Base',
      admissions: 'Admissions',
      fees: 'Fees & Slabs',
      hostel: 'Hostel & Living',
      eligibility: 'Eligibility',
      contact: 'Contact',
      analytics: 'Analytics',
      admin: 'Admin Dashboard',
    };
    document.title = PAGE_TITLES[page] || 'Home';
  }, [page]);

  const chat = useChat();

  useEffect(() => {
    const f = () => {
      setPage(read());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', f);
    return () => window.removeEventListener('hashchange', f);
  }, []);

  const go = useCallback((p) => {
    window.location.hash = `#/${p}`;
  }, []);

  const ask = useCallback((q) => {
    setPending(q);
    go('chat');
  }, [go]);

  const handleOpenCompare = useCallback((programIds) => {
    if (programIds && programIds.length > 0) {
      setComparePrograms(programIds);
      setStoredItem('lpu_compare_programs', programIds);
    }
    setCompareModalOpen(true);
  }, []);

  const handleOpenLegal = useCallback((tab = 'disclaimer') => {
    setLegalInitialTab(tab);
    setLegalModalOpen(true);
  }, []);

  const handleOpenAuth = useCallback(() => {
    setAuthModalOpen(true);
  }, []);

  const props = {
    go,
    ask,
    onOpenCompare: handleOpenCompare,
    onOpenLegal: handleOpenLegal,
    onOpenAuth: handleOpenAuth,
    theme,
    onToggleTheme: toggleTheme
  };

  const pages = {
    home: Home,
    chat: Chatbot,
    programs: Programs,
    curriculum: Curriculum,
    knowledge: KnowledgeBase,
    admissions: Admissions,
    fees: Fees,
    hostel: Hostel,
    eligibility: Eligibility,
    contact: Contact,
    analytics: Analytics,
    admin: AdminDashboard,
  };

  const Page = pages[page] || Home;

  return (
    <div className="flex min-h-screen flex-col font-sans antialiased transition-colors duration-300 selection:bg-orange-100 dark:selection:bg-orange-950 selection:text-orange-900 dark:selection:text-orange-200 bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <CustomCursor />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:p-3 focus:bg-orange-600 focus:text-white focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-xl focus-visible:ring-2 focus-visible:ring-orange-500"
      >
        Skip to content
      </a>

      <Navbar
        page={page}
        go={go}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenCompare={() => handleOpenCompare()}
        onOpenAuth={handleOpenAuth}
        onOpenLegal={handleOpenLegal}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main
        id="main"
        key={page}
        className={`flex flex-1 flex-col animate-fade-in ${page === 'chat' ? 'overflow-hidden max-h-[100dvh]' : ''}`}
      >
        <ErrorBoundary onReset={() => go('home')}>
          <Suspense fallback={<PageSkeleton />}>
            {page === 'chat' ? (
              <Chatbot chat={chat} go={go} pending={pending} clearPending={() => setPending(null)} />
            ) : (
              <Page {...props} />
            )}
          </Suspense>
        </ErrorBoundary>
      </main>

      {page !== 'chat' && (
        <Footer
          go={go}
          onOpenCompare={() => handleOpenCompare()}
          onOpenLegal={handleOpenLegal}
        />
      )}

      {/* Global Spotlight Search Modal - Lazy loaded on trigger */}
      {searchModalOpen && (
        <Suspense fallback={null}>
          <SearchModal
            isOpen={searchModalOpen}
            onClose={() => setSearchModalOpen(false)}
            go={go}
            ask={ask}
          />
        </Suspense>
      )}

      {/* Global Degree Comparison Modal - Lazy loaded on trigger */}
      {compareModalOpen && (
        <Suspense fallback={null}>
          <DegreeComparisonModal
            isOpen={compareModalOpen}
            onClose={() => setCompareModalOpen(false)}
            initialPrograms={comparePrograms}
            ask={ask}
          />
        </Suspense>
      )}

      {/* Legal & Unofficial Disclaimer Modal */}
      {legalModalOpen && (
        <Suspense fallback={null}>
          <LegalModal
            isOpen={legalModalOpen}
            onClose={() => setLegalModalOpen(false)}
            initialTab={legalInitialTab}
          />
        </Suspense>
      )}

      {/* Authentication & Email OTP Modal */}
      {authModalOpen && (
        <Suspense fallback={null}>
          <AuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            onOpenLegal={handleOpenLegal}
            onLoginSuccess={() => {
              if (page === 'admin') {
                window.location.reload();
              }
            }}
          />
        </Suspense>
      )}

      {/* Draggable Floating AI Assistant Button */}
      <FloatingAiAssistant go={go} page={page} ask={ask} chat={chat} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
