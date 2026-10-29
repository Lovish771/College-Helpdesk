export default function LpuLogo({
  variant = 'light',
  size = 36,
  className = '',
  showText = false,
}) {
  const isDark = variant === 'dark';

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* Real Official LPU University Logo */}
      <img
        src="/images/lpu-logo.png"
        alt="Lovely Professional University Logo"
        width={size}
        height={size}
        className="shrink-0 object-contain drop-shadow-2xs transition-transform duration-200 group-hover:scale-105 rounded-md"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
        loading="eager"
      />

      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <span className="font-display font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
            LPU
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mt-0.5">
            Student Helpdesk
          </span>
        </div>
      )}
    </div>
  );
}
