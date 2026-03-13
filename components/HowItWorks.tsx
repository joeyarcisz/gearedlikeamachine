const steps = [
  {
    number: "01",
    title: "Browse",
    description: "Pick a package or build your own from inventory.",
  },
  {
    number: "02",
    title: "Request",
    description: "Submit your dates and gear list. We confirm availability.",
  },
  {
    number: "03",
    title: "Pickup",
    description: "Everything prepped, tested, and ready. Texas-based.",
  },
  {
    number: "04",
    title: "Return",
    description: "Bring it back. We handle inspection and turnover.",
  },
];

export default function HowItWorks() {
  return (
    <div className="dashboard-card mb-4" style={{ "--card-delay": "200ms" } as React.CSSProperties}>
      <div className="dashboard-card-header">
        <span className="text-muted text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)]">
          How It Works
        </span>
      </div>
      <div className="dashboard-card-body">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col gap-2">
              <span className="text-xl font-bold text-steel opacity-30 font-[family-name:var(--font-heading)]">
                {step.number}
              </span>
              <h3 className="font-[family-name:var(--font-heading)] text-sm font-bold uppercase tracking-wide text-white">
                {step.title}
              </h3>
              <p className="text-muted text-xs leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
