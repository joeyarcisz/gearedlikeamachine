import type { StepDeliverablesData, VideoDuration, Platform, AspectRatio } from "@/lib/scope-types";
import { DURATIONS, PLATFORMS, ASPECT_RATIOS } from "@/lib/scope-pricing";

interface Props {
  data: StepDeliverablesData;
  onChange: (data: StepDeliverablesData) => void;
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between bg-navy/50 border border-card-border p-3">
      <span className="text-sm text-white">{label}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 flex items-center justify-center bg-card text-steel border border-card-border text-sm hover:border-steel disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          -
        </button>
        <span className="w-8 text-center text-sm font-semibold text-white">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 flex items-center justify-center bg-card text-steel border border-card-border text-sm hover:border-steel disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function StepDeliverables({ data, onChange }: Props) {
  function togglePlatform(p: Platform) {
    const next = data.platforms.includes(p)
      ? data.platforms.filter((v) => v !== p)
      : [...data.platforms, p];
    onChange({ ...data, platforms: next });
  }

  function toggleRatio(r: AspectRatio) {
    const next = data.aspectRatios.includes(r)
      ? data.aspectRatios.filter((v) => v !== r)
      : [...data.aspectRatios, r];
    onChange({ ...data, aspectRatios: next });
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-bold uppercase tracking-widest mb-6">
          Deliverables
        </h2>

        <div className="space-y-4 max-w-lg">
          <Stepper
            label="Number of finished videos"
            value={data.videoCount}
            min={1}
            max={50}
            onChange={(v) => onChange({ ...data, videoCount: v })}
          />
        </div>
      </div>

      {/* Duration */}
      <div>
        <h3 className="text-xs uppercase tracking-widest text-muted mb-3">
          Average duration per video
        </h3>
        <div className="flex flex-wrap gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d.value}
              onClick={() => onChange({ ...data, duration: d.value })}
              className={`px-4 py-2 border text-xs transition-colors ${
                data.duration === d.value
                  ? "bg-steel text-black border-steel font-semibold"
                  : "bg-navy/50 border-card-border text-muted hover:text-white hover:border-steel/50"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Platforms */}
      <div>
        <h3 className="text-xs uppercase tracking-widest text-muted mb-3">
          Platforms (select all that apply)
        </h3>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => (
            <button
              key={p.value}
              onClick={() => togglePlatform(p.value)}
              className={`px-4 py-2 border text-xs transition-colors ${
                data.platforms.includes(p.value)
                  ? "bg-steel text-black border-steel font-semibold"
                  : "bg-navy/50 border-card-border text-muted hover:text-white hover:border-steel/50"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Aspect Ratios */}
      <div>
        <h3 className="text-xs uppercase tracking-widest text-muted mb-3">
          Aspect Ratios (select all that apply)
        </h3>
        <div className="flex flex-wrap gap-2">
          {ASPECT_RATIOS.map((r) => (
            <button
              key={r.value}
              onClick={() => toggleRatio(r.value)}
              className={`px-4 py-2 border text-xs transition-colors ${
                data.aspectRatios.includes(r.value)
                  ? "bg-steel text-black border-steel font-semibold"
                  : "bg-navy/50 border-card-border text-muted hover:text-white hover:border-steel/50"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cutdowns */}
      <div className="max-w-lg">
        <Stepper
          label="Social cutdowns per video"
          value={data.cutdownsPerVideo}
          min={0}
          max={20}
          onChange={(v) => onChange({ ...data, cutdownsPerVideo: v })}
        />
      </div>
    </div>
  );
}
