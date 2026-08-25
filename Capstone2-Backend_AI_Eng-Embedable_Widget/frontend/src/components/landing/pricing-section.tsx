export function PricingSection() {
  return (
    <section id="pricing" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-24">
      <div className="text-center mb-16 animate-fade-up">
        <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Simple, <span className="gradient-text">transparent</span> pricing
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tier 1 */}
        <div className="glass rounded-3xl p-8 flex flex-col animate-fade-up delay-100" style={{ border: '1px solid var(--border-default)' }}>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-space-grotesk), sans-serif' }}>Starter</h3>
          <p className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-space-grotesk), sans-serif' }}>$0</p>
          <p className="text-sm mb-6 pb-6" style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>Forever free for individuals</p>
          <ul className="space-y-4 mb-8 flex-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <li className="flex items-center gap-3"><span style={{ color: '#a78bfa' }}>✓</span> 1 Project</li>
            <li className="flex items-center gap-3"><span style={{ color: '#a78bfa' }}>✓</span> 100 AI Conversations/mo</li>
            <li className="flex items-center gap-3"><span style={{ color: '#a78bfa' }}>✓</span> Basic Dashboard</li>
          </ul>
          <button className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all" style={{ background: 'rgba(139,92,246,0.1)', color: '#c4b5fd' }}>
            Get Started
          </button>
        </div>

        {/* Tier 2 */}
        <div className="glass rounded-3xl p-8 flex flex-col relative animate-fade-up delay-200 shadow-2xl" style={{ border: '1px solid var(--border-strong)', background: 'rgba(124,58,237,0.05)' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1 rounded-full text-xs font-bold text-white shadow-lg shadow-violet-500/30">
            MOST POPULAR
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-space-grotesk), sans-serif' }}>Pro</h3>
          <p className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-space-grotesk), sans-serif' }}>$49<span className="text-sm font-normal text-zinc-400">/mo</span></p>
          <p className="text-sm mb-6 pb-6" style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>For growing startups</p>
          <ul className="space-y-4 mb-8 flex-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <li className="flex items-center gap-3"><span style={{ color: '#a78bfa' }}>✓</span> 5 Projects</li>
            <li className="flex items-center gap-3"><span style={{ color: '#a78bfa' }}>✓</span> 2,000 AI Conversations/mo</li>
            <li className="flex items-center gap-3"><span style={{ color: '#a78bfa' }}>✓</span> Custom AI Training</li>
            <li className="flex items-center gap-3"><span style={{ color: '#a78bfa' }}>✓</span> CRM Integrations</li>
          </ul>
          <button className="btn-brand w-full py-2.5 rounded-xl text-sm font-semibold">
            Start Free Trial
          </button>
        </div>

        {/* Tier 3 */}
        <div className="glass rounded-3xl p-8 flex flex-col animate-fade-up delay-300" style={{ border: '1px solid var(--border-default)' }}>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-space-grotesk), sans-serif' }}>Enterprise</h3>
          <p className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-space-grotesk), sans-serif' }}>Custom</p>
          <p className="text-sm mb-6 pb-6" style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>For large organizations</p>
          <ul className="space-y-4 mb-8 flex-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <li className="flex items-center gap-3"><span style={{ color: '#a78bfa' }}>✓</span> Unlimited Projects</li>
            <li className="flex items-center gap-3"><span style={{ color: '#a78bfa' }}>✓</span> Unlimited Conversations</li>
            <li className="flex items-center gap-3"><span style={{ color: '#a78bfa' }}>✓</span> White-labeling</li>
            <li className="flex items-center gap-3"><span style={{ color: '#a78bfa' }}>✓</span> Dedicated Success Manager</li>
          </ul>
          <button className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all" style={{ background: 'rgba(139,92,246,0.1)', color: '#c4b5fd' }}>
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
}
