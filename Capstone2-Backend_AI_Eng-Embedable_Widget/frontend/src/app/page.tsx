'use client';

import { Header } from '@/components/landing/header';
import { HeroSection } from '@/components/landing/hero-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { PricingSection } from '@/components/landing/pricing-section';
import { CTASection } from '@/components/landing/cta-section';
import { Footer } from '@/components/landing/footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* ── Background Orbs ─────────────────────────── */}
      <div className="orb orb-violet" style={{ width: 700, height: 700, top: -200, left: '50%', transform: 'translateX(-50%)' }} />
      <div className="orb orb-blue" style={{ width: 500, height: 500, bottom: '20%', right: -100 }} />
      <div className="orb orb-indigo" style={{ width: 400, height: 400, bottom: '5%', left: -80 }} />

      {/* ── Dot Grid ────────────────────────────────── */}
      <div className="dot-grid absolute inset-0 opacity-40 pointer-events-none" />

      {/* ── Main Content ────────────────────────────── */}
      <main className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </main>

    </div>
  );
}
