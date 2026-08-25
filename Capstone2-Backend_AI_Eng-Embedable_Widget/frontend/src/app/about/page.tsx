
import { Target, Zap, BarChart, Code } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      
      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto text-center mb-28 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-violet-600 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 relative z-10 tracking-tight" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
            Transforming <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-600">Lead Generation</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed relative z-10" style={{ color: 'var(--text-secondary)' }}>
            LeadForge is the premier AI-native lead capture platform for modern growth teams. 
            We bridge the gap between anonymous traffic and qualified sales opportunities, 
            equipping you with intelligent widgets and automated scoring to scale your revenue.
          </p>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto mb-32 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>Powerful Capabilities</h2>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Engineered to maximize conversions and simplify workflows.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Target, title: "Smart Targeting", desc: "Show the right form to the right user at the perfect moment." },
              { icon: Zap, title: "AI Qualification", desc: "Instantly evaluate and route leads using advanced AI models." },
              { icon: BarChart, title: "Deep Analytics", desc: "Gain actionable insights into your conversion funnel." },
              { icon: Code, title: "Seamless Embeds", desc: "Integrate anywhere with a single snippet of code." }
            ].map((feature, idx) => (
              <div key={idx} className="group p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(139,92,246,0.12)] relative overflow-hidden" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <feature.icon className="w-12 h-12 text-violet-500 mb-6 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p style={{ color: 'var(--text-secondary)' }} className="leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="max-w-4xl mx-auto relative z-10 mb-20">
           <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>How It Works</h2>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Four simple steps to predictable pipeline generation.</p>
          </div>

          <div className="space-y-12">
            {[
              { step: "01", title: "Create Your Widget", desc: "Design a high-converting lead form using our intuitive drag-and-drop builder. Customize every element to match your brand." },
              { step: "02", title: "Embed on Your Site", desc: "Copy the generated snippet and paste it into your website. LeadForge works seamlessly with Next.js, Webflow, WordPress, and more." },
              { step: "03", title: "Automate Qualification", desc: "Our AI immediately analyzes incoming submissions, enriches data, and scores the lead's buying intent." },
              { step: "04", title: "Close More Deals", desc: "Qualified leads are instantly routed to your CRM or directly to your sales team's Slack, enabling rapid follow-ups." }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12 group">
                <div className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold bg-violet-600/10 text-violet-400 border border-violet-500/30 group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-600 transition-all duration-300">
                  {item.step}
                </div>
                <div className="flex-grow text-center md:text-left p-6 md:p-8 rounded-2xl border transition-all duration-300 group-hover:border-violet-500/50 hover:shadow-[0_8px_30px_rgb(139,92,246,0.08)]" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
