'use client';

import { useState, useEffect } from 'react';

export function TypingText() {
  const phrases = ['qualify leads', 'book meetings', 'capture insights', 'grow revenue'];
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[idx];
    if (!deleting && displayed.length < current.length) {
      const t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
      return () => clearTimeout(t);
    } else if (!deleting && displayed.length === current.length) {
      const t = setTimeout(() => setDeleting(true), 1800);
      return () => clearTimeout(t);
    } else if (deleting && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), 45);
      return () => clearTimeout(t);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIdx((idx + 1) % phrases.length);
    }
  }, [displayed, deleting, idx, phrases]);

  return (
    <span className="gradient-text-animated">
      {displayed}
      <span style={{ animation: 'dotBlink 1s ease infinite', display: 'inline-block', marginLeft: '2px' }}>|</span>
    </span>
  );
}
