import Link from 'next/link';
import { AnimatedStat } from './animated-stat';
import { TypingText } from './typing-text';

export function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24 lg:pt-20 lg:pb-32">
      <div className="max-w-4xl mx-auto text-center">
        <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8 animate-fade-up">
          <span className="status-live" />
          AI-Powered Lead Capture 
        </div>
        <h1 className="text-4xl sm:text-4xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-fade-up delay-100">
          <span className="block" style={{ color: 'var(--text-primary)' }}>Your AI widgets</span>
          <span className="block mt-1"><TypingText /></span>
          <span className="block mt-1" style={{ color: 'var(--text-primary)' }}>automatically</span>
        </h1>
        <p className="text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto animate-fade-up delay-200" style={{ color: 'var(--text-secondary)' }}>
          Deploy intelligent chatbots on any website in minutes. They engage visitors, qualify leads through natural conversation, and feed real-time insights straight to your dashboard.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up delay-300">
          <Link href="/register">
            <button className="btn-brand px-7 py-3.5 text-base rounded-xl font-semibold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Building Free
            </button>
          </Link>
          <Link href="/login">
            <button
              className="px-7 py-3.5 text-base rounded-xl font-semibold flex items-center gap-2 transition-all duration-200"
              style={{
                border: '1px solid var(--border-default)',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-space-grotesk), sans-serif',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
              </svg>
              View Dashboard
            </button>
          </Link>
        </div>
        <div className="animate-fade-up delay-400">
          <div className="glass rounded-2xl p-6 inline-flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
            <AnimatedStat target={5000} suffix="+" label="Widgets Deployed" />
            <div className="divider hidden sm:block" style={{ width: 1, height: 40, background: 'var(--border-default)' }} />
            <AnimatedStat target={180000} suffix="+" label="Leads Captured" />
            <div className="divider hidden sm:block" style={{ width: 1, height: 40, background: 'var(--border-default)' }} />
            <AnimatedStat target={94} suffix="%" label="Qualification Rate" />
          </div>
        </div>
      </div>
    </section>
  );
}
