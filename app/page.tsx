import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ServicesTicker from "@/components/ServicesTicker";
import Showreel from "@/components/Showreel";
import PortfolioGrid from "@/components/PortfolioGrid";
import FeaturedWork from "@/components/FeaturedWork";

import Services from "@/components/Services";
import Process from "@/components/Process";
import WhyChooseUs from "@/components/WhyChooseUs";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { MechanicalDivider } from "@/components/icons";
import GearMotionStrip from "@/components/GearMotionStrip";

function TextureDividerMobile() {
  return (
    <div className="lg:hidden bg-black py-6">
      <div className="max-w-4xl mx-auto px-4">
        <MechanicalDivider className="w-full h-10 text-steel" />
      </div>
    </div>
  );
}

function SideTexture({ src, side, invert = true }: { src: string; side: "left" | "right"; invert?: boolean }) {
  return (
    <div
      className={`hidden lg:block absolute top-1/2 -translate-y-1/2 ${side === "left" ? "left-0" : "right-0"} w-[220px] xl:w-[300px] h-[80%] opacity-[0.12] pointer-events-none`}
      style={{
        backgroundImage: `url('${src}')`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: side === "left" ? "left center" : "right center",
        filter: invert ? "invert(1) grayscale(1)" : "grayscale(1)",
        maskImage: side === "left"
          ? "linear-gradient(to right, black 20%, transparent 75%)"
          : "linear-gradient(to left, black 20%, transparent 75%)",
        WebkitMaskImage: side === "left"
          ? "linear-gradient(to right, black 20%, transparent 75%)"
          : "linear-gradient(to left, black 20%, transparent 75%)",
      }}
    />
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Showreel />

        {/* Divider 1 — gear motion video */}
        <GearMotionStrip video="/gear-motion-1.mp4" side="left" />
        <TextureDividerMobile />

        <div className="relative overflow-hidden">
          <SideTexture src="/texture-5.jpg" side="left" />
          <Services />
        </div>

        <PortfolioGrid />
        <FeaturedWork />

        {/* Divider 2 — gear motion video */}
        <GearMotionStrip video="/gear-motion-2.mp4" side="right" />
        <TextureDividerMobile />

        <div className="relative overflow-hidden">
          <SideTexture src="/texture-6.jpg" side="right" />
          <Process />
        </div>

        <div className="relative overflow-hidden">
          <div
            className="hidden lg:block absolute top-1/2 -translate-y-1/2 left-0 w-[220px] xl:w-[300px] h-[80%] pointer-events-none"
            style={{
              maskImage: "linear-gradient(to right, black 20%, transparent 75%)",
              WebkitMaskImage: "linear-gradient(to right, black 20%, transparent 75%)",
            }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover grayscale opacity-20"
            >
              <source src="/gears-texture.mp4" type="video/mp4" />
            </video>
          </div>
          <WhyChooseUs />
        </div>

        {/* Divider 3 — gear motion video */}
        <GearMotionStrip video="/gear-motion-3.mp4" side="left" />
        <TextureDividerMobile />

        <CTA />
        <ServicesTicker />
      </main>
      <Footer />
    </>
  );
}
