import { siteConfig } from "@/lib/data";

export default function CTAPanel() {
  return (
    <div
      className="dashboard-card relative overflow-hidden"
      style={{ "--card-delay": "400ms" } as React.CSSProperties}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 grayscale opacity-30 bg-cover bg-center"
        style={{ backgroundImage: "url('/dashboard/stadium.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

      <div className="relative z-10 p-5 flex flex-col items-center justify-center text-center h-full min-h-[180px]">
        <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold uppercase tracking-wide mb-2 text-white">
          Start Here
        </h3>
        <p className="text-muted text-xs mb-4 max-w-[200px]">
          Tell us about your vision and we&apos;ll engineer the solution.
        </p>
        <a
          href={`mailto:${siteConfig.email}`}
          className="group inline-flex items-center gap-2 bg-steel text-black px-6 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors"
        >
          Launch Brief
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </a>
        <p className="text-muted text-[10px] uppercase tracking-widest mt-3">
          {siteConfig.location}, {siteConfig.availability}
        </p>
      </div>
    </div>
  );
}
