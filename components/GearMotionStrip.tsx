"use client";

import { MechanicalDivider } from "./icons";

interface GearMotionStripProps {
  video: string;
  side?: "left" | "right";
}

export default function GearMotionStrip({ video, side = "left" }: GearMotionStripProps) {
  return (
    <div className="hidden lg:block relative bg-black overflow-hidden" style={{ height: "320px" }}>
      {/* Center divider */}
      <div className="max-w-4xl mx-auto px-4 relative h-full">
        <MechanicalDivider className="w-full h-10 text-steel absolute top-1/2 left-0 right-0 -translate-y-1/2 px-4" />
      </div>

      {/* Looping gear motion video */}
      <div
        className={`absolute top-0 ${side === "left" ? "left-0" : "right-0"} w-[240px] xl:w-[320px] h-full pointer-events-none`}
        style={{
          maskImage: side === "left"
            ? "linear-gradient(to right, black 25%, transparent 80%)"
            : "linear-gradient(to left, black 25%, transparent 80%)",
          WebkitMaskImage: side === "left"
            ? "linear-gradient(to right, black 25%, transparent 80%)"
            : "linear-gradient(to left, black 25%, transparent 80%)",
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover grayscale opacity-30"
        >
          <source src={video} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
