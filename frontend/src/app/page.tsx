import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import VisualHooks from "@/components/VisualHooks";
import SensoryMap from "@/components/SensoryMap";
import FlowSection from "@/components/FlowSection";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <VisualHooks />
        <SensoryMap />
        <FlowSection />
        <Features />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
