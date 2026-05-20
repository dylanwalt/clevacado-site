import Navigation from "@/components/Navigation";
import AppleHero from "@/components/AppleHero";
import AppleStorySection from "@/components/AppleStorySection";
import SensorSection from "@/components/SensorSection";
import DashboardSection from "@/components/DashboardSection";
import ImpactSection from "@/components/ImpactSection";
import FinalCTA from "@/components/FinalCTA";

export default function Home() {
  return (
    <main>
      <Navigation />
      <AppleHero />
      <AppleStorySection />
      <SensorSection />
      <DashboardSection />
      <ImpactSection />
      <FinalCTA />
    </main>
  );
}
