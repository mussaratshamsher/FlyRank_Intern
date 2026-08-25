'use client';

import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', style, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-space-grotesk), sans-serif' }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full h-11 px-4 rounded-xl text-sm transition-all duration-200 input-brand ${
            error ? 'border-red-500/50 focus:ring-red-500/20' : ''
          } ${className}`}
          style={{
            background: 'rgba(10, 10, 34, 0.8)',
            border: error ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(139,92,246,0.25)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-inter), sans-serif',
            ...style,
          }}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs" style={{ color: '#fca5a5' }}>{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export { Input };

