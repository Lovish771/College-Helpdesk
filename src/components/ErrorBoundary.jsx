import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('LPU Helpdesk UI Error Boundary caught an exception:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.hash = '#/home';
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex items-center justify-center p-6 text-slate-800 dark:text-slate-100 transition-colors"
        >
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center">
            <div className="h-14 w-14 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto mb-5 shadow-sm">
              <AlertTriangle size={28} />
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-2">
              Something went wrong — Reload Page
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              An unexpected display issue occurred in this section. You can reload the page or safely return to the home screen without losing saved preferences.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
              >
                <RotateCcw size={14} />
                <span>Reload Page</span>
              </button>
              <button
                onClick={() => {
                  window.location.hash = '#/home';
                  window.location.reload();
                }}
                className="btn-secondary inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
              >
                <Home size={14} />
                <span>Go to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
