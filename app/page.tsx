import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ServicesTicker from "@/components/ServicesTicker";
import Showreel from "@/components/Showreel";
import PortfolioGrid from "@/components/PortfolioGrid";
import FeaturedWork from "@/components/FeaturedWork";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import Process from "@/components/Process";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { MechanicalDivider } from "@/components/icons";
import GalleryPanel from "@/components/dashboard/GalleryPanel";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ServicesTicker />
        <Showreel />
        <PortfolioGrid />
        <FeaturedWork />
        <div className="bg-black py-6">
          <div className="max-w-4xl mx-auto px-4">
            <MechanicalDivider className="w-full h-10 text-steel" />
          </div>
        </div>
        <Stats />
        <Services />
        <Process />
        <div className="bg-black py-6">
          <div className="max-w-4xl mx-auto px-4">
            <MechanicalDivider className="w-full h-10 text-steel" />
          </div>
        </div>
        <WhyChooseUs />
        <Testimonials />
        <div className="bg-black py-6">
          <div className="max-w-4xl mx-auto px-4">
            <MechanicalDivider className="w-full h-10 text-steel" />
          </div>
        </div>
        {/* Gallery */}
        <section className="py-20 sm:py-28 bg-black">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <GalleryPanel />
          </div>
        </section>
        <CTA />
      </main>
      <Footer />
    </>
  );
}
