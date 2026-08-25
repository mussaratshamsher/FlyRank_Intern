import Link from 'next/link';

export function CTASection() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-24 mb-12">
      <div className="cta-card glass rounded-3xl p-12 text-center relative overflow-hidden animate-fade-up">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at top, rgba(124,58,237,0.2), transparent 70%)' }} />
        <div className="relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Ready to <span className="gradient-text">automate</span> your lead flow?
          </h2>
          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Join thousands of modern teams capturing and qualifying leads 24/7 with LeadForge AI.
          </p>
          <Link href="/register">
            <button className="btn-brand px-8 py-4 text-lg rounded-2xl font-bold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow">
              Get Started for Free
            </button>
          </Link>
          <p className="text-sm mt-5" style={{ color: 'var(--text-muted)' }}>No credit card required · 3-minute setup</p>
        </div>
      </div>
    </section>
  );
}
