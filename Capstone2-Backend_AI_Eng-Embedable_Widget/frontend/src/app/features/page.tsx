import { FeaturesSection } from '@/components/landing/features-section';


export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <main>
        <FeaturesSection />
        </main>
    </div>
  );
}
