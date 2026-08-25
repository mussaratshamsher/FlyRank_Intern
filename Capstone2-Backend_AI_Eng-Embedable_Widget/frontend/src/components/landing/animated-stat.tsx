'use client';

import { useState, useEffect } from 'react';

export function AnimatedStat({ target, suffix = '', label }: { target: number; suffix?: string; label: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 25);
    return () => clearInterval(timer);
  }, [target]);
  
  return (
    <div className="text-center">
      <div className="text-3xl font-bold gradient-text" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
    </div>
  );
}
