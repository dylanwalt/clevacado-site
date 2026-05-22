import CinematicPitch from "@/components/CinematicPitch";
import Navigation from "@/components/Navigation";
import ScrollProgress from "@/components/ScrollProgress";

export default function Home() {
  return (
    <main>
      <Navigation />
      <ScrollProgress />
      <CinematicPitch />
    </main>
  );
}
