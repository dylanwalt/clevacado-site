import AudienceSection from "@/components/AudienceSection";
import DashboardSection from "@/components/DashboardSection";
import FinalCTA from "@/components/FinalCTA";
import HeroProductReveal from "@/components/HeroProductReveal";
import HowItWorksSection from "@/components/HowItWorksSection";
import ImpactSection from "@/components/ImpactSection";
import JourneyScrollytelling from "@/components/JourneyScrollytelling";
import Navigation from "@/components/Navigation";
import ProblemSection from "@/components/ProblemSection";
import ScrollProgress from "@/components/ScrollProgress";
import SensorSection from "@/components/SensorSection";

export default function Home() {
  return (
    <main>
      <ScrollProgress />
      <Navigation />
      <HeroProductReveal />
      <HowItWorksSection />
      <ProblemSection />
      <JourneyScrollytelling />
      <SensorSection />
      <DashboardSection />
      <AudienceSection />
      <ImpactSection />
      <FinalCTA />
    </main>
  );
}
