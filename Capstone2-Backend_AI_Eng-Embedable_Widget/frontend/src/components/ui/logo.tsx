export function LeadForgeLogo({ size = 36, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id="logoGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <filter id="logoGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Hexagonal background */}
      <path
        d="M20 2L35 10V30L20 38L5 30V10L20 2Z"
        fill="url(#logoGrad1)"
        opacity="0.15"
      />
      <path
        d="M20 2L35 10V30L20 38L5 30V10L20 2Z"
        stroke="url(#logoGrad1)"
        strokeWidth="1.2"
        fill="none"
      />
      {/* Lightning bolt — ForgeForge symbol */}
      <path
        d="M23 6L13 21H20L17 34L28 18H21L23 6Z"
        fill="url(#logoGrad2)"
        filter="url(#logoGlow)"
      />
    </svg>
  );
}
