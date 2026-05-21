import AppleHero from "@/components/AppleHero";
import AppleStorySection from "@/components/AppleStorySection";
import AudienceSection from "@/components/AudienceSection";
import DashboardSection from "@/components/DashboardSection";
import FinalCTA from "@/components/FinalCTA";
import HowItWorksSection from "@/components/HowItWorksSection";
import ImpactSection from "@/components/ImpactSection";
import Navigation from "@/components/Navigation";
import ProblemSection from "@/components/ProblemSection";
import ScrollProgress from "@/components/ScrollProgress";
import SensorSection from "@/components/SensorSection";

export default function Home() {
  return (
    <main>
      <ScrollProgress />
      <Navigation />
      <AppleHero />
      <HowItWorksSection />
      <ProblemSection />
      <AppleStorySection />
      <SensorSection />
      <DashboardSection />
      <AudienceSection />
      <ImpactSection />
      <FinalCTA />
    </main>
  );
}
