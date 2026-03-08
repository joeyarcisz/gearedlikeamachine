import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ClientLogoBar from "@/components/ClientLogoBar";
import ServicesTicker from "@/components/ServicesTicker";
import Showreel from "@/components/Showreel";
import PortfolioGrid from "@/components/PortfolioGrid";
import FeaturedWork from "@/components/FeaturedWork";
import ImageGalleryStrip from "@/components/ImageGalleryStrip";
import Services from "@/components/Services";
import Process from "@/components/Process";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
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

function SideVideoTexture({ src, side }: { src: string; side: "left" | "right" }) {
  return (
    <div
      className={`hidden lg:block absolute top-1/2 -translate-y-1/2 ${side === "left" ? "left-0" : "right-0"} w-[320px] xl:w-[450px] h-[90%] pointer-events-none`}
      style={{
        maskImage: side === "left"
          ? "linear-gradient(to right, black 20%, transparent 75%)"
          : "linear-gradient(to left, black 20%, transparent 75%)",
        WebkitMaskImage: side === "left"
          ? "linear-gradient(to right, black 20%, transparent 75%)"
          : "linear-gradient(to left, black 20%, transparent 75%)",
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover grayscale opacity-20"
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ClientLogoBar />
        <Showreel />

        {/* Divider 1 — gear motion video */}
        <GearMotionStrip video="/gear-motion-1.mp4" side="left" />
        <TextureDividerMobile />

        <div className="relative overflow-hidden">
          <SideTexture src="/texture-5.jpg" side="left" />
          <SideTexture src="/red-raptor-x.png" side="right" />
          <Services />
        </div>

        <div className="relative overflow-hidden">
          <SideVideoTexture src="/camera-gear-2.mp4" side="right" />
          <PortfolioGrid />
        </div>
        <div className="relative overflow-hidden">
          <SideVideoTexture src="/camera-gear-3.mp4" side="left" />
          <FeaturedWork />
        </div>

        <ImageGalleryStrip />

        {/* Divider 2 — gear motion video */}
        <GearMotionStrip video="/gear-motion-2.mp4" side="right" />
        <TextureDividerMobile />

        <div className="relative overflow-hidden">
          <SideTexture src="/texture-6.jpg" side="right" />
          <Process />
        </div>

        <div className="relative overflow-hidden">
          <SideVideoTexture src="/gears-texture.mp4" side="left" />
          <SideVideoTexture src="/camera-gear-4.mp4" side="right" />
          <WhyChooseUs />
        </div>

        <Testimonials />

        {/* Divider 3 — gear motion video */}
        <GearMotionStrip video="/gear-motion-3.mp4" side="left" />
        <TextureDividerMobile />

        <div className="relative overflow-hidden">
          <SideVideoTexture src="/camera-gear-5.mp4" side="right" />
          <CTA />
        </div>
        <ServicesTicker />
      </main>
      <Footer />
    </>
  );
}
