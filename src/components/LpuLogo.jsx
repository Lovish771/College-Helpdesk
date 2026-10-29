export default function LpuLogo({
  variant = 'light',
  size = 36,
  className = '',
  showText = false,
}) {
  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* Real Official LPU University Logo with adaptive contrast container */}
      <div
        className="shrink-0 flex items-center justify-center rounded-lg bg-white/90 dark:bg-white p-0.5 shadow-2xs transition-transform duration-200 group-hover:scale-105"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        <img
          src="/images/lpu-logo.png"
          alt="Lovely Professional University Logo"
          width={size - 4}
          height={size - 4}
          className="w-full h-full object-contain"
          loading="eager"
        />
      </div>

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
