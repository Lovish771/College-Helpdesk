export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // One primary colour, drawn from the university's own palette.
        // Everything else is a neutral slate or a status colour.
        lpu: {
          orange: '#EA580C',
          'orange-light': '#F97316',
          'orange-dark': '#C2410C',
          'orange-50': '#FFF7ED',
          'orange-100': '#FFEDD5',
          navy: '#0F172A',
          'navy-light': '#1E293B',
          'navy-subtle': '#334155',
          slate: '#64748B',
          card: '#FFFFFF',
          bg: '#F8FAFC',
        },
        navy: {
          950: '#020817',
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
          500: '#64748B',
        },
      },

      fontFamily: {
        // Deliberate pairing: Inter for text, Plus Jakarta Sans for headings.
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        accent: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },

      // A fixed scale: 14 / 16 / 20 / 28 / 40.
      fontSize: {
        small: ['0.875rem', { lineHeight: '1.5' }],
        body: ['1rem', { lineHeight: '1.6' }],
        h3: ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
        h2: ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.015em' }],
        h1: ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        display: ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
      },

      // 8px spacing grid; the container caps at 1200px.
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      maxWidth: {
        content: '1200px',
      },

      // Radii sit in the 6-10px band. The old 2xl/3xl utilities are mapped
      // down so older markup cannot reintroduce pill-shaped bubbles.
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
        lg: '10px',
        xl: '10px',
        '2xl': '10px',
        '3xl': '10px',
      },

      // Shadows are barely-there. Depth comes from a 1px border instead.
      boxShadow: {
        none: 'none',
        xs: '0 1px 2px rgba(15, 23, 42, 0.04)',
        sm: '0 1px 2px rgba(15, 23, 42, 0.05)',
        DEFAULT: '0 1px 3px rgba(15, 23, 42, 0.06)',
        md: '0 2px 6px rgba(15, 23, 42, 0.06)',
        lg: '0 4px 12px rgba(15, 23, 42, 0.07)',
        xl: '0 6px 16px rgba(15, 23, 42, 0.08)',
        '2xl': '0 8px 24px rgba(15, 23, 42, 0.10)',
        inner: 'inset 0 1px 2px rgba(15, 23, 42, 0.05)',
        'lpu-card': '0 1px 2px rgba(15, 23, 42, 0.04)',
        'lpu-hover': '0 2px 8px rgba(15, 23, 42, 0.07)',
        'lpu-orange': '0 2px 6px rgba(234, 88, 12, 0.18)',
      },

      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },

      // Motion is limited to opacity and small offsets. No bouncing, no lifts.
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out both',
        'fade-up': 'fadeUp 0.2s ease-out both',
        'slide-in': 'slideIn 0.2s ease-out both',
        'page-enter': 'fadeIn 0.2s ease-out both',
        'scale-up': 'fadeIn 0.18s ease-out both',
        shimmer: 'shimmer 2.2s infinite linear',
      },
      keyframes: {
        fadeUp: { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'none' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideIn: { from: { opacity: '0', transform: 'translateX(-6px)' }, to: { opacity: '1', transform: 'none' } },
        shimmer: { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(100%)' } },
      },
    },
  },
  plugins: [],
};