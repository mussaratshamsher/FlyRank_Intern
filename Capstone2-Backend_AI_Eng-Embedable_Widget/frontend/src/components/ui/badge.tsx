'use client';

import { type ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'violet';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  const styles: Record<string, React.CSSProperties> = {
    default: {
      background: 'rgba(139,92,246,0.1)',
      border: '1px solid rgba(139,92,246,0.25)',
      color: '#c4b5fd',
    },
    success: {
      background: 'rgba(59,130,246,0.12)',
      border: '1px solid rgba(59,130,246,0.3)',
      color: '#93c5fd',
    },
    warning: {
      background: 'rgba(251,191,36,0.1)',
      border: '1px solid rgba(251,191,36,0.3)',
      color: '#fcd34d',
    },
    danger: {
      background: 'rgba(220,38,38,0.1)',
      border: '1px solid rgba(220,38,38,0.3)',
      color: '#fca5a5',
    },
    info: {
      background: 'rgba(6,182,212,0.1)',
      border: '1px solid rgba(6,182,212,0.25)',
      color: '#67e8f9',
    },
    violet: {
      background: 'rgba(124,58,237,0.15)',
      border: '1px solid rgba(167,139,250,0.4)',
      color: '#c4b5fd',
    },
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '2px 8px', fontSize: '11px' },
    md: { padding: '4px 10px', fontSize: '13px' },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontWeight: 500,
        borderRadius: '999px',
        fontFamily: 'var(--font-space-grotesk), sans-serif',
        ...styles[variant],
        ...sizeStyles[size],
      }}
    >
      {children}
    </span>
  );
}

