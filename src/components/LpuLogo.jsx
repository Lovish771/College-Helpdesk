export default function LpuLogo({
  variant = 'light',
  size = 36,
  className = '',
  showText = false,
}) {
  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* LPU Help Desk Mascot Logo - transparent, no background container */}
      <div
        className="shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        <img
          src="/images/lpu-mascot-logo.png"
          alt="LPU Help Desk Mascot Logo"
          width={size}
          height={size}
          className="w-full h-full object-contain filter drop-shadow-xs"
          loading="eager"
        />
      </div>

      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <span className="font-display font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
            Student Helpdesk
          </span>
        </div>
      )}
    </div>
  );
}
