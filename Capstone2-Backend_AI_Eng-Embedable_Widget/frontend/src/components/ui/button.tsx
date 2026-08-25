'use client';

import { type ReactNode, type ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, children, className = '', disabled, style, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';

    const variantStyles: Record<string, React.CSSProperties> = {
      primary: {
        background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
        border: '1px solid rgba(167,139,250,0.35)',
        color: '#fff',
        boxShadow: '0 4px 14px rgba(124,58,237,0.25)',
        fontFamily: 'var(--font-space-grotesk), sans-serif',
      },
      secondary: {
        background: 'rgba(139,92,246,0.1)',
        border: '1px solid rgba(139,92,246,0.25)',
        color: '#c4b5fd',
        fontFamily: 'var(--font-space-grotesk), sans-serif',
      },
      ghost: {
        background: 'transparent',
        border: '1px solid transparent',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-space-grotesk), sans-serif',
      },
      danger: {
        background: 'rgba(220,38,38,0.1)',
        border: '1px solid rgba(220,38,38,0.3)',
        color: '#fca5a5',
        fontFamily: 'var(--font-space-grotesk), sans-serif',
      },
      outline: {
        background: 'transparent',
        border: '1px solid rgba(139,92,246,0.25)',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-space-grotesk), sans-serif',
      },
    };

    const sizeClasses = {
      sm: 'h-8 px-3 text-xs rounded-lg',
      md: 'h-10 px-4 text-sm rounded-xl',
      lg: 'h-12 px-6 text-base rounded-xl',
    };

    const hoverClass =
      variant === 'primary' ? 'hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(124,58,237,0.4)]' :
      variant === 'ghost' ? 'hover:bg-[rgba(139,92,246,0.1)] hover:text-[#c4b5fd]' :
      variant === 'outline' ? 'hover:border-[rgba(139,92,246,0.5)] hover:text-[#c4b5fd]' :
      variant === 'secondary' ? 'hover:bg-[rgba(139,92,246,0.18)]' :
      'hover:bg-[rgba(220,38,38,0.18)]';

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${sizeClasses[size]} ${hoverClass} ${className}`}
        style={{ ...variantStyles[variant], ...style }}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export { Button };

