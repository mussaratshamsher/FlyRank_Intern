import { TestimonialCard } from './testimonial-card';

export function TestimonialsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-10 lg:py-24">
      <div className="text-center mb-16 animate-fade-up">
        <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Loved by <span className="gradient-text">growth teams</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TestimonialCard
          delay={100}
          quote="LeadForge increased our qualified pipeline by 40% in the first month. The AI conversations are indistinguishable from our best SDRs."
          author="Sarah Jenkins"
          role="VP of Marketing @ TechFlow"
        />
        <TestimonialCard
          delay={200}
          quote="Setup took literally 3 minutes. I pasted the script into Webflow, and we started getting scored leads the same afternoon."
          author="Marcus Chen"
          role="Founder @ LaunchPad"
        />
        <TestimonialCard
          delay={300}
          quote="The real-time dashboard is addictive. Seeing the AI qualify leads at 2 AM on a Sunday completely changes the game for our small team."
          author="Elena Rodriguez"
          role="Head of Sales @ CloudScale"
        />
      </div>
    </section>
  );
}
