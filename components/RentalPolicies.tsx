"use client";

import { useState } from "react";

const policies = [
  {
    title: "Rates & Duration",
    content:
      "Day rate equals 24 hours from pickup. Weekend special: pickup Friday after 2PM, return Monday by 11AM counts as one day rate. Weekly rate: 3x the daily rate.",
  },
  {
    title: "Insurance & Deposits",
    content:
      "A Certificate of Insurance (COI) is required for rentals with a total replacement value over $5,000. For rentals under $5,000, a credit card hold is accepted in lieu of a COI.",
  },
  {
    title: "Cancellation",
    content:
      "Cancellations made before pickup are free of charge. Cancellations within 24 hours of scheduled pickup are charged 50% of the rental total. No-shows are charged 100%.",
  },
  {
    title: "Damage, Loss & Late Returns",
    content:
      "Damage is charged at repair cost or replacement cost, whichever is less. Lost or stolen gear is charged at full market replacement value. Late returns are charged 25% of the daily rate per day overdue.",
  },
  {
    title: "Delivery",
    content:
      "Delivery and pickup service is available within the DFW area. A delivery fee applies. Contact us for rates based on location.",
  },
];

export default function RentalPolicies() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index));
  }

  return (
    <div className="dashboard-card mb-4" style={{ "--card-delay": "300ms" } as React.CSSProperties}>
      <div className="dashboard-card-header">
        <span className="text-muted text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)]">
          Rental Policies
        </span>
      </div>
      <div className="dashboard-card-body">
        <div className="divide-y divide-card-border border border-card-border">
          {policies.map((policy, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={policy.title} className="bg-card">
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-navy/50 transition-colors duration-200 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-[family-name:var(--font-heading)] text-sm font-bold uppercase tracking-wide text-white">
                    {policy.title}
                  </span>
                  <span
                    className={`text-steel text-xs transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  >
                    ▾
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4">
                    <p className="text-chrome text-sm leading-relaxed">
                      {policy.content}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
