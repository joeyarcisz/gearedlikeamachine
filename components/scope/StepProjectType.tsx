import type { StepProjectTypeData, ProjectType, ScopeFormat } from "@/lib/scope-types";
import { PROJECT_TYPES, SCOPE_FORMATS } from "@/lib/scope-pricing";

interface Props {
  data: StepProjectTypeData;
  onChange: (data: StepProjectTypeData) => void;
}

export default function StepProjectType({ data, onChange }: Props) {
  return (
    <div className="space-y-10">
      {/* Project Type */}
      <div>
        <h2 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-bold uppercase tracking-widest mb-2">
          What type of project?
        </h2>
        <p className="text-muted text-sm mb-6">Select the category that best describes your project.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {PROJECT_TYPES.map((pt) => (
            <button
              key={pt.value}
              onClick={() => onChange({ ...data, projectType: pt.value })}
              className={`p-4 border text-left text-sm transition-colors ${
                data.projectType === pt.value
                  ? "bg-steel text-black border-steel font-semibold"
                  : "bg-navy/50 border-card-border text-muted hover:text-white hover:border-steel/50"
              }`}
            >
              {pt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scope Format */}
      <div>
        <h2 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-bold uppercase tracking-widest mb-2">
          Scope Format
        </h2>
        <p className="text-muted text-sm mb-6">How is this project structured?</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {SCOPE_FORMATS.map((sf) => (
            <button
              key={sf.value}
              onClick={() => onChange({ ...data, scopeFormat: sf.value })}
              className={`p-4 border text-left transition-colors ${
                data.scopeFormat === sf.value
                  ? "bg-steel text-black border-steel"
                  : "bg-navy/50 border-card-border text-muted hover:text-white hover:border-steel/50"
              }`}
            >
              <span className={`block text-sm font-semibold ${data.scopeFormat === sf.value ? "text-black" : "text-white"}`}>
                {sf.label}
              </span>
              <span className={`block text-xs mt-1 ${data.scopeFormat === sf.value ? "text-black/70" : "text-muted"}`}>
                {sf.description}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
