import type {
  StepProductionData,
  CrewPackage,
  CrewRole,
  GearSelections,
  SpecializedGear,
} from "@/lib/scope-types";
import {
  CREW_ROLES,
  CREW_PACKAGES,
  CREW_DAY_RATES,
  GEAR_OPTIONS,
  GEAR_CATEGORY_LABELS,
  SPECIALIZED_GEAR,
} from "@/lib/scope-pricing";

interface Props {
  data: StepProductionData;
  onChange: (data: StepProductionData) => void;
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
  helper,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  helper?: string;
}) {
  return (
    <div className="bg-navy/50 border border-card-border p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-white">{label}</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onChange(Math.max(min, value - 1))}
            disabled={value <= min}
            className="w-10 h-10 min-h-[44px] min-w-[44px] flex items-center justify-center bg-card text-steel border border-card-border text-sm hover:border-steel disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            -
          </button>
          <span className="w-8 text-center text-sm font-semibold text-white">{value}</span>
          <button
            onClick={() => onChange(Math.min(max, value + 1))}
            disabled={value >= max}
            className="w-10 h-10 min-h-[44px] min-w-[44px] flex items-center justify-center bg-card text-steel border border-card-border text-sm hover:border-steel disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            +
          </button>
        </div>
      </div>
      {helper && <p className="text-xs text-muted mt-1">{helper}</p>}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 bg-navy/50 border border-card-border p-3 w-full text-left cursor-pointer"
    >
      <div
        className={`w-10 h-5 rounded-full relative transition-colors ${
          checked ? "bg-steel" : "bg-card-border"
        }`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
            checked ? "left-[1.375rem]" : "left-0.5"
          }`}
        />
      </div>
      <span className="text-sm text-white">{label}</span>
    </button>
  );
}

export default function StepProduction({ data, onChange }: Props) {
  function setCrewPackage(pkg: CrewPackage) {
    onChange({
      ...data,
      crewPackage: pkg,
      crewRoles: [...CREW_PACKAGES[pkg].roles],
    });
  }

  function toggleRole(role: CrewRole) {
    const next = data.crewRoles.includes(role)
      ? data.crewRoles.filter((r) => r !== role)
      : [...data.crewRoles, role];
    onChange({ ...data, crewRoles: next });
  }

  function setGear<K extends keyof GearSelections>(key: K, value: GearSelections[K]) {
    onChange({ ...data, gear: { ...data.gear, [key]: value } });
  }

  function toggleSpecGear(sg: SpecializedGear) {
    const next = data.specializedGear.includes(sg)
      ? data.specializedGear.filter((v) => v !== sg)
      : [...data.specializedGear, sg];
    onChange({ ...data, specializedGear: next });
  }

  return (
    <div className="space-y-10">
      <h2 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-bold uppercase tracking-widest">
        Production Needs
      </h2>

      {/* Shoot days & Locations */}
      <div className="space-y-4 max-w-lg">
        <Stepper
          label="Shoot days"
          value={data.shootDays}
          min={1}
          max={30}
          onChange={(v) => onChange({ ...data, shootDays: v })}
          helper="Include setup and wrap days"
        />
        <Stepper
          label="Locations"
          value={data.locations}
          min={1}
          max={20}
          onChange={(v) => onChange({ ...data, locations: v })}
        />
      </div>

      {/* Travel */}
      <div className="space-y-4 max-w-lg">
        <Toggle
          label="Travel required?"
          checked={data.travelRequired}
          onChange={(v) => onChange({ ...data, travelRequired: v, travelDays: v ? Math.max(1, data.travelDays) : 0 })}
        />
        {data.travelRequired && (
          <Stepper
            label="Travel days"
            value={data.travelDays}
            min={1}
            max={30}
            onChange={(v) => onChange({ ...data, travelDays: v })}
          />
        )}
      </div>

      {/* Crew Packages */}
      <div>
        <h3 className="text-xs uppercase tracking-widest text-muted mb-3">
          Crew Package
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mb-4">
          {(Object.keys(CREW_PACKAGES) as CrewPackage[]).map((pkg) => (
            <button
              key={pkg}
              onClick={() => setCrewPackage(pkg)}
              className={`p-3 border text-left text-sm transition-colors cursor-pointer ${
                data.crewPackage === pkg
                  ? "bg-steel text-black border-steel font-semibold"
                  : "bg-navy/50 border-card-border text-muted hover:text-white hover:border-steel/50"
              }`}
            >
              <span className="block font-semibold">{CREW_PACKAGES[pkg].label}</span>
              <span className={`block text-[10px] mt-0.5 ${data.crewPackage === pkg ? "text-black/60" : "text-muted/70"}`}>
                {CREW_PACKAGES[pkg].roles.length} positions
              </span>
            </button>
          ))}
        </div>

        <h3 className="text-xs uppercase tracking-widest text-muted mb-3">
          Individual Roles (toggle on/off)
        </h3>
        <div className="flex flex-wrap gap-2">
          {CREW_ROLES.map((role) => (
            <button
              key={role.value}
              onClick={() => toggleRole(role.value)}
              className={`px-3 py-2 min-h-[44px] border text-xs transition-colors cursor-pointer ${
                data.crewRoles.includes(role.value)
                  ? "bg-steel text-black border-steel font-semibold"
                  : "bg-navy/50 border-card-border text-muted hover:text-white hover:border-steel/50"
              }`}
            >
              {role.label} <span className="opacity-70">${CREW_DAY_RATES[role.value].toLocaleString()}/day</span>
            </button>
          ))}
        </div>
      </div>

      {/* Gear */}
      <div>
        <h3 className="text-xs uppercase tracking-widest text-muted mb-3">
          Gear Packages
        </h3>
        <div className="space-y-3">
          {(Object.keys(GEAR_OPTIONS) as (keyof GearSelections)[]).map((key) => (
            <div key={key}>
              <p className="text-xs text-chrome mb-1.5">{GEAR_CATEGORY_LABELS[key]}</p>
              <div className="flex flex-wrap gap-2">
                {GEAR_OPTIONS[key].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setGear(key, opt.value as GearSelections[typeof key])}
                    className={`px-3 py-2 min-h-[44px] border text-xs transition-colors text-left cursor-pointer ${
                      data.gear[key] === opt.value
                        ? "bg-steel text-black border-steel font-semibold"
                        : "bg-navy/50 border-card-border text-muted hover:text-white hover:border-steel/50"
                    }`}
                  >
                    <span className="block">{opt.label}{opt.rate > 0 && <span className="opacity-70"> ${opt.rate}/day</span>}</span>
                    {opt.description && <span className={`block text-[10px] mt-0.5 ${data.gear[key] === opt.value ? "text-black/60" : "text-muted/70"}`}>{opt.description}</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Specialized Gear */}
      <div>
        <h3 className="text-xs uppercase tracking-widest text-muted mb-3">
          Specialized Gear (select all that apply)
        </h3>
        <div className="flex flex-wrap gap-2">
          {SPECIALIZED_GEAR.map((sg) => (
            <button
              key={sg.value}
              onClick={() => toggleSpecGear(sg.value)}
              className={`px-3 py-2 min-h-[44px] border text-xs transition-colors cursor-pointer ${
                data.specializedGear.includes(sg.value)
                  ? "bg-steel text-black border-steel font-semibold"
                  : "bg-navy/50 border-card-border text-muted hover:text-white hover:border-steel/50"
              }`}
            >
              {sg.label} <span className="opacity-70">${sg.rate}/day</span>
            </button>
          ))}
        </div>
      </div>

      {/* Talent */}
      <div className="space-y-4 max-w-lg">
        <Toggle
          label="On-camera talent needed?"
          checked={data.talentNeeded}
          onChange={(v) => onChange({ ...data, talentNeeded: v, talentCount: v ? Math.max(1, data.talentCount) : 0 })}
        />
        {data.talentNeeded && (
          <Stepper
            label="Number of talent"
            value={data.talentCount}
            min={1}
            max={20}
            onChange={(v) => onChange({ ...data, talentCount: v })}
          />
        )}
      </div>
    </div>
  );
}
