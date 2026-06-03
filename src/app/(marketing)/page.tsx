import dynamic from 'next/dynamic';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { HeroSection } from '@/components/marketing/HeroSection';
import { FeatureBento } from '@/components/marketing/FeatureBento';
import { Testimonials } from '@/components/marketing/Testimonials';
import { Footer } from '@/components/marketing/Footer';

// Lazy load below-the-fold interactive components to optimize LCP
const InteractiveMockup = dynamic(
  () => import('@/components/marketing/InteractiveMockup').then((mod) => mod.InteractiveMockup),
  {
    loading: () => (
      <div className="h-96 w-full flex items-center justify-center text-muted-foreground text-sm font-medium">
        Loading interactive sandbox...
      </div>
    ),
  }
);

const ContactForm = dynamic(
  () => import('@/components/marketing/ContactForm').then((mod) => mod.ContactForm),
  {
    loading: () => (
      <div className="h-[400px] w-full flex items-center justify-center text-muted-foreground text-sm font-medium">
        Loading contact request form...
      </div>
    ),
  }
);

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
      {/* Dynamic Header with Theme Toggle */}
      <MarketingHeader />

      {/* Main Content Sections */}
      <main className="flex-grow">
        <HeroSection />
        <FeatureBento />
        <InteractiveMockup />
        <Testimonials />
        <ContactForm />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
