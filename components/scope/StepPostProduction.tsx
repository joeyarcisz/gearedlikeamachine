import type {
  StepPostProductionData,
  EditingComplexity,
  ColorGradeTier,
  SoundDesignTier,
  MotionGraphicsTier,
  MusicLicenseTier,
} from "@/lib/scope-types";
import {
  EDITING_TIERS,
  COLOR_TIERS,
  SOUND_TIERS,
  MOTION_TIERS,
  MUSIC_TIERS,
} from "@/lib/scope-pricing";

interface Props {
  data: StepPostProductionData;
  onChange: (data: StepPostProductionData) => void;
}

function TierSelector<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string; description?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-muted mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2 border text-xs transition-colors text-left ${
              value === opt.value
                ? "bg-steel text-black border-steel font-semibold"
                : "bg-navy/50 border-card-border text-muted hover:text-white hover:border-steel/50"
            }`}
          >
            <span className="block">{opt.label}</span>
            {opt.description && (
              <span className={`block text-[10px] mt-0.5 ${value === opt.value ? "text-black/60" : "text-muted/70"}`}>
                {opt.description}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function StepPostProduction({ data, onChange }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-bold uppercase tracking-widest">
          Post-Production
        </h2>
        <p className="text-muted text-xs mt-2">Adjust tiers to match your project needs. Defaults are pre-selected.</p>
      </div>

      <TierSelector
        label="Editing Complexity"
        options={EDITING_TIERS}
        value={data.editingComplexity}
        onChange={(v) => onChange({ ...data, editingComplexity: v })}
      />

      <TierSelector
        label="Color Grading"
        options={COLOR_TIERS}
        value={data.colorGrade}
        onChange={(v) => onChange({ ...data, colorGrade: v })}
      />

      <TierSelector
        label="Sound Design"
        options={SOUND_TIERS}
        value={data.soundDesign}
        onChange={(v) => onChange({ ...data, soundDesign: v })}
      />

      <TierSelector
        label="Motion Graphics"
        options={MOTION_TIERS}
        value={data.motionGraphics}
        onChange={(v) => onChange({ ...data, motionGraphics: v })}
      />

      <TierSelector
        label="Music Licensing"
        options={MUSIC_TIERS}
        value={data.musicLicense}
        onChange={(v) => onChange({ ...data, musicLicense: v })}
      />

      {/* Captions */}
      <div>
        <button
          onClick={() =>
            onChange({
              ...data,
              captions: !data.captions,
              captionLanguages: !data.captions ? Math.max(1, data.captionLanguages) : 0,
            })
          }
          className="flex items-center gap-3 bg-navy/50 border border-card-border p-3 w-full max-w-lg text-left"
        >
          <div
            className={`w-10 h-5 rounded-full relative transition-colors ${
              data.captions ? "bg-steel" : "bg-card-border"
            }`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                data.captions ? "left-5.5" : "left-0.5"
              }`}
            />
          </div>
          <span className="text-sm text-white">Include captions?</span>
        </button>

        {data.captions && (
          <div className="mt-3 max-w-lg">
            <div className="flex items-center justify-between bg-navy/50 border border-card-border p-3">
              <span className="text-sm text-white">Languages</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    onChange({ ...data, captionLanguages: Math.max(1, data.captionLanguages - 1) })
                  }
                  disabled={data.captionLanguages <= 1}
                  className="w-8 h-8 flex items-center justify-center bg-card text-steel border border-card-border text-sm hover:border-steel disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-semibold text-white">
                  {data.captionLanguages}
                </span>
                <button
                  onClick={() =>
                    onChange({ ...data, captionLanguages: Math.min(10, data.captionLanguages + 1) })
                  }
                  disabled={data.captionLanguages >= 10}
                  className="w-8 h-8 flex items-center justify-center bg-card text-steel border border-card-border text-sm hover:border-steel disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Revision Rounds */}
      <div className="max-w-lg">
        <div className="flex items-center justify-between bg-navy/50 border border-card-border p-3">
          <div>
            <span className="text-sm text-white">Revision rounds</span>
            <p className="text-xs text-muted mt-0.5">2 rounds included in base pricing</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                onChange({ ...data, revisionRounds: Math.max(1, data.revisionRounds - 1) })
              }
              disabled={data.revisionRounds <= 1}
              className="w-8 h-8 flex items-center justify-center bg-card text-steel border border-card-border text-sm hover:border-steel disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              -
            </button>
            <span className="w-8 text-center text-sm font-semibold text-white">
              {data.revisionRounds}
            </span>
            <button
              onClick={() =>
                onChange({ ...data, revisionRounds: Math.min(5, data.revisionRounds + 1) })
              }
              disabled={data.revisionRounds >= 5}
              className="w-8 h-8 flex items-center justify-center bg-card text-steel border border-card-border text-sm hover:border-steel disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
