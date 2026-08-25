

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
            Seamless Integrations
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Connect LeadForge with your favorite tools and supercharge your workflow.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['Salesforce', 'HubSpot', 'Zapier', 'Slack', 'Mailchimp', 'Google Analytics', 'Intercom', 'Stripe'].map((integration, i) => (
            <div key={i} className="p-6 rounded-2xl border flex items-center justify-center text-lg font-medium" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}>
              {integration}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
