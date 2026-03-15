import type { StepTimelineData } from "@/lib/scope-types";
import { URGENCY_TIERS } from "@/lib/scope-pricing";

interface Props {
  data: StepTimelineData;
  onChange: (data: StepTimelineData) => void;
}

function getPlaceholderDates() {
  const now = new Date();
  const startMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const endMonth = new Date(now.getFullYear(), now.getMonth() + 3, 1);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  return { start: `e.g. Mid-${fmt(startMonth)}`, end: `e.g. End of ${fmt(endMonth)}` };
}

export default function StepTimeline({ data, onChange }: Props) {
  const placeholders = getPlaceholderDates();
  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-bold uppercase tracking-widest">
          Timeline
        </h2>
        <p className="text-muted text-xs mt-2">All fields on this step are optional.</p>
      </div>

      {/* Dates */}
      <div className="space-y-4 max-w-lg">
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-1.5">
            Approximate Start Date
          </label>
          <input
            type="text"
            value={data.startDate}
            onChange={(e) => onChange({ ...data, startDate: e.target.value })}
            placeholder={placeholders.start}
            className="w-full bg-navy/50 border border-card-border text-white text-sm px-4 py-3 placeholder:text-muted/50 focus:outline-none focus:border-steel transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-1.5">
            Target Delivery Date
          </label>
          <input
            type="text"
            value={data.deliveryDate}
            onChange={(e) => onChange({ ...data, deliveryDate: e.target.value })}
            placeholder={placeholders.end}
            className="w-full bg-navy/50 border border-card-border text-white text-sm px-4 py-3 placeholder:text-muted/50 focus:outline-none focus:border-steel transition-colors"
          />
        </div>
      </div>

      {/* Urgency */}
      <div>
        <h3 className="text-xs uppercase tracking-widest text-muted mb-3">
          Urgency
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
          {URGENCY_TIERS.map((tier) => (
            <button
              key={tier.value}
              onClick={() => onChange({ ...data, urgency: tier.value })}
              className={`p-4 border text-left transition-colors cursor-pointer ${
                data.urgency === tier.value
                  ? "bg-steel text-black border-steel"
                  : "bg-navy/50 border-card-border text-muted hover:text-white hover:border-steel/50"
              }`}
            >
              <span
                className={`block text-sm font-semibold ${
                  data.urgency === tier.value ? "text-black" : "text-white"
                }`}
              >
                {tier.label}
              </span>
              <span
                className={`block text-xs mt-1 ${
                  data.urgency === tier.value ? "text-black/70" : "text-muted"
                }`}
              >
                {tier.description}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
