import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import {
  AiMatchingSection,
  BenefitsSection,
  CtaSection,
  FeaturesSection,
  HeroSection,
  HowItWorksSection,
  LiveTrackingSection,
  OfflineSyncSection,
  StatisticsSection,
} from "@/features/landing/components";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatisticsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <AiMatchingSection />
        <LiveTrackingSection />
        <OfflineSyncSection />
        <BenefitsSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
