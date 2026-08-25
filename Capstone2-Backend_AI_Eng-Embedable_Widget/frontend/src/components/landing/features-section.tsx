import { FeatureCard } from './feature-card';

export function FeaturesSection() {
  const features = [
    {
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.002 4.002 0 01-3.09-3.09L2.25 12l2.846-.813a4.002 4.002 0 013.09-3.09L9 5.25l.813 2.846a4.002 4.002 0 013.09 3.09L15.75 12l-2.846.813a4.002 4.002 0 01-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>,
      title: 'AI-Powered Conversations',
      description: 'GPT-4 driven chatbots that understand context, qualify leads naturally, and adapt to your brand voice and industry.',
      delay: 100,
    },
    {
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>,
      title: 'Smart Lead Scoring',
      description: 'Automatically score and rank leads by intent signals, engagement depth, and custom qualification criteria you define.',
      delay: 200,
    },
    {
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
      title: 'Real-Time Analytics',
      description: 'Live dashboard with conversion funnels, heatmaps, and AI-generated insights that tell you exactly where to improve.',
      delay: 300,
    },
    {
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>,
      title: 'One-Line Embed',
      description: 'Paste a single `<script>` tag on any website. Works with React, Vue, WordPress, Shopify, and plain HTML.',
      delay: 400,
    },
    {
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>,
      title: 'CRM Integrations',
      description: 'Auto-sync qualified leads to HubSpot, Salesforce, Notion, or any CRM via webhooks and native integrations.',
      delay: 500,
    },
    {
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
      title: 'Enterprise Security',
      description: 'SOC 2 compliant, end-to-end encrypted conversations, GDPR-ready with full data residency controls.',
      delay: 600,
    },
  ];

  return (
    <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-5 lg:px-8 lg:py-24">
      <div className="text-center mb-14 animate-fade-up">
        <div className="hero-badge inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4">
          Features
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Everything you need to
          <span className="gradient-text block mt-1">convert visitors</span>
        </h2>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          A complete AI lead generation stack — from widget deployment to CRM integration — in one powerful platform.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => <FeatureCard key={i} {...f} />)}
      </div>
    </section>
  );
}
