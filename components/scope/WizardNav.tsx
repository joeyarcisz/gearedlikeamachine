const STEP_LABELS = [
  "Project Type",
  "Deliverables",
  "Production",
  "Post-Production",
  "Timeline",
];

interface WizardNavProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  canAdvance: boolean;
  isLastStep: boolean;
}

export default function WizardNav({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  canAdvance,
  isLastStep,
}: WizardNavProps) {
  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="flex items-center gap-1.5 sm:gap-2">
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i + 1 === currentStep
                  ? "bg-steel text-black"
                  : i + 1 < currentStep
                  ? "bg-steel/30 text-steel"
                  : "bg-navy/50 border border-card-border text-muted"
              }`}
            >
              {i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div
                className={`hidden sm:block w-8 lg:w-16 h-px ${
                  i + 1 < currentStep ? "bg-steel/30" : "bg-card-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step label */}
      <p className="text-xs uppercase tracking-widest text-muted">
        Step {currentStep} of {totalSteps} — {STEP_LABELS[currentStep - 1]}
      </p>

      {/* Navigation buttons */}
      <div className="flex items-center gap-4">
        {currentStep > 1 && (
          <button
            onClick={onBack}
            className="px-6 py-2.5 text-sm uppercase tracking-widest text-muted border border-card-border hover:text-white hover:border-steel transition-colors"
          >
            Back
          </button>
        )}
        <button
          onClick={onNext}
          disabled={!canAdvance}
          className="px-6 py-2.5 text-sm uppercase tracking-widest font-semibold bg-steel text-black hover:bg-steel/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isLastStep ? "Generate Estimate" : "Next"}
        </button>
      </div>
    </div>
  );
}
