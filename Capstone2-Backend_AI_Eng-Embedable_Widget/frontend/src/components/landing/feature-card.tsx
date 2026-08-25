'use client';

import React from 'react';

export function FeatureCard({
  icon, title, description, delay
}: { icon: React.ReactNode; title: string; description: string; delay: number }) {
  return (
    <div
      className={`glass glass-hover card-glow-hover animate-fade-up rounded-2xl p-7 delay-${delay}`}
    >
      <div className="feature-icon w-13 h-13 rounded-xl flex items-center justify-center mb-5 w-12 h-12">
        <span style={{ color: '#a78bfa' }}>{icon}</span>
      </div>
      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {description}
      </p>
    </div>
  );
}
