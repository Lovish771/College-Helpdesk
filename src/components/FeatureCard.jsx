import { ArrowRight } from 'lucide-react';

export default function FeatureCard({ icon: Icon, title, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group rounded-2xl p-5 text-left transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent w-full"
      style={{ background: 'linear-gradient(135deg,#152238 0%,#0D1526 100%)', border: '1px solid rgba(56,189,248,0.08)' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(56,189,248,0.25)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4),0 0 0 1px rgba(56,189,248,0.15)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(56,189,248,0.08)'; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ background: 'linear-gradient(135deg,rgba(37,99,235,0.2) 0%,rgba(13,21,38,0.8) 100%)', border: '1px solid rgba(56,189,248,0.15)' }}>
        <Icon size={20} style={{ color: '#38BDF8' }} />
      </span>
      <h3 className="mt-4 text-base font-semibold" style={{ color: '#F8FAFC' }}>{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed" style={{ color: '#64748B' }}>{text}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold" style={{ color: '#38BDF8' }}>
        Ask Assistant <ArrowRight size={12} />
      </span>
    </button>
  );
}
