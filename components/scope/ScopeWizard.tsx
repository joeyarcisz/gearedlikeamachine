"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  LeadInfo,
  ScopeInput,
  StepProjectTypeData,
  StepDeliverablesData,
  StepProductionData,
  StepPostProductionData,
  StepTimelineData,
  EstimateBreakdown,
  ScopeSummary,
} from "@/lib/scope-types";
import { CREW_PACKAGES } from "@/lib/scope-pricing";
import { calculateEstimate } from "@/lib/scope-calculations";
import { generateSummary } from "@/lib/scope-summary";
import LeadGate from "./LeadGate";
import WizardNav from "./WizardNav";
import StepProjectType from "./StepProjectType";
import StepDeliverables from "./StepDeliverables";
import StepProduction from "./StepProduction";
import StepPostProduction from "./StepPostProduction";
import StepTimeline from "./StepTimeline";
import EstimateOutput from "./EstimateOutput";
import PrintableEstimate from "./PrintableEstimate";

const STORAGE_KEY = "glam_scope_lead";
const TOTAL_STEPS = 5;

function getDefaultProjectType(): StepProjectTypeData {
  return { projectType: null, scopeFormat: null };
}

function getDefaultDeliverables(): StepDeliverablesData {
  return {
    videoCount: 1,
    duration: "1-2min",
    platforms: [],
    aspectRatios: ["16:9"],
    cutdownsPerVideo: 0,
  };
}

function getDefaultProduction(): StepProductionData {
  return {
    shootDays: 1,
    locations: 1,
    travelRequired: false,
    travelDays: 0,
    crewPackage: "lean",
    crewRoles: [...CREW_PACKAGES.lean.roles],
    gear: {
      camera: "standard",
      lenses: "standard",
      lighting: "basic",
      audio: "basic-lav",
      grip: "none",
      drone: "none",
    },
    specializedGear: [],
    talentNeeded: false,
    talentCount: 0,
  };
}

function getDefaultPostProduction(): StepPostProductionData {
  return {
    editingComplexity: "standard",
    colorGrade: "basic",
    soundDesign: "basic",
    motionGraphics: "none",
    musicLicense: "stock",
    captions: false,
    captionLanguages: 0,
    revisionRounds: 2,
  };
}

function getDefaultTimeline(): StepTimelineData {
  return {
    startDate: "",
    deliveryDate: "",
    urgency: "standard",
  };
}

export default function ScopeWizard() {
  const [hasLead, setHasLead] = useState(false);
  const [leadChecked, setLeadChecked] = useState(false);
  const [step, setStep] = useState(1);
  const [showEstimate, setShowEstimate] = useState(false);

  const [projectType, setProjectType] = useState<StepProjectTypeData>(getDefaultProjectType);
  const [deliverables, setDeliverables] = useState<StepDeliverablesData>(getDefaultDeliverables);
  const [production, setProduction] = useState<StepProductionData>(getDefaultProduction);
  const [postProduction, setPostProduction] = useState<StepPostProductionData>(getDefaultPostProduction);
  const [timeline, setTimeline] = useState<StepTimelineData>(getDefaultTimeline);

  const [estimate, setEstimate] = useState<EstimateBreakdown | null>(null);
  const [summary, setSummary] = useState<ScopeSummary | null>(null);

  // Check localStorage for returning visitors
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHasLead(true);
      }
    } catch {
      // localStorage unavailable
    }
    setLeadChecked(true);
  }, []);

  const handleLeadSubmit = useCallback((lead: LeadInfo) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lead));
    } catch {
      // localStorage unavailable
    }
    setHasLead(true);
  }, []);

  function canAdvance(): boolean {
    switch (step) {
      case 1:
        return projectType.projectType !== null && projectType.scopeFormat !== null;
      case 2:
        return deliverables.platforms.length > 0 && deliverables.aspectRatios.length > 0;
      case 3:
        return production.crewRoles.length > 0;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  }

  function handleNext() {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Generate estimate
      const input: ScopeInput = {
        projectType,
        deliverables,
        production,
        postProduction,
        timeline,
      };
      setEstimate(calculateEstimate(input));
      setSummary(generateSummary(input));
      setShowEstimate(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleBack() {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleStartOver() {
    setStep(1);
    setShowEstimate(false);
    setEstimate(null);
    setSummary(null);
    setProjectType(getDefaultProjectType());
    setDeliverables(getDefaultDeliverables());
    setProduction(getDefaultProduction());
    setPostProduction(getDefaultPostProduction());
    setTimeline(getDefaultTimeline());
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Wait for hydration
  if (!leadChecked) {
    return null;
  }

  // Lead gate
  if (!hasLead) {
    return <LeadGate onSubmit={handleLeadSubmit} />;
  }

  // Show estimate
  if (showEstimate && estimate && summary) {
    return (
      <>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 print:hidden">
          <EstimateOutput
            summary={summary}
            estimate={estimate}
            onStartOver={handleStartOver}
          />
        </div>
        <PrintableEstimate summary={summary} estimate={estimate} />
      </>
    );
  }

  // Wizard steps
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <WizardNav
        currentStep={step}
        totalSteps={TOTAL_STEPS}
        onBack={handleBack}
        onNext={handleNext}
        canAdvance={canAdvance()}
        isLastStep={step === TOTAL_STEPS}
      />

      <div className="mt-10">
        {step === 1 && (
          <StepProjectType data={projectType} onChange={setProjectType} />
        )}
        {step === 2 && (
          <StepDeliverables data={deliverables} onChange={setDeliverables} />
        )}
        {step === 3 && (
          <StepProduction data={production} onChange={setProduction} />
        )}
        {step === 4 && (
          <StepPostProduction data={postProduction} onChange={setPostProduction} />
        )}
        {step === 5 && (
          <StepTimeline data={timeline} onChange={setTimeline} />
        )}
      </div>

      {/* Bottom nav repeat for long steps */}
      <div className="mt-12 pt-8 border-t border-card-border">
        <div className="flex items-center gap-4">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-2.5 text-sm uppercase tracking-widest text-muted border border-card-border hover:text-white hover:border-steel transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canAdvance()}
            className="px-6 py-2.5 text-sm uppercase tracking-widest font-semibold bg-steel text-black hover:bg-steel/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {step === TOTAL_STEPS ? "Generate Estimate" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
