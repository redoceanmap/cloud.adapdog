import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AIPlannerSection from "@/components/AIPlannerSection";
import AIVoiceEmergencySection from "@/components/AIVoiceEmergencySection";
import HackathonScenariosSection from "@/components/HackathonScenariosSection";
import DifferentiatorsSection from "@/components/DifferentiatorsSection";
import AppStoreCTA from "@/components/AppStoreCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <AIPlannerSection />
        <AIVoiceEmergencySection />
        <HackathonScenariosSection />
        <DifferentiatorsSection />
        <AppStoreCTA />
      </main>
      <Footer />
    </>
  );
}
