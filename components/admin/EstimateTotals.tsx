"use client";

type LineItemForTotals = {
  unitRate: number;
  quantity: number;
  days: number;
  rateType: string;
  isOwnerLabor?: boolean;
  catalogBaseRate?: number;
  catalogMarkupPercent?: number;
};

interface EstimateTotalsProps {
  lineItems: LineItemForTotals[];
  total: number;
}

export default function EstimateTotals({ lineItems, total }: EstimateTotalsProps) {
  // Compute margin: difference between bill rates and base rates for items with markup
  const margin = lineItems.reduce((sum, item) => {
    if (item.isOwnerLabor || !item.catalogBaseRate || !item.catalogMarkupPercent) return sum;
    const baseCost =
      item.rateType === "PER_MILE"
        ? (item.catalogBaseRate / 100) * item.quantity * item.days
        : item.catalogBaseRate * item.quantity * item.days;
    const billed =
      item.rateType === "PER_MILE"
        ? (item.unitRate / 100) * item.quantity * item.days
        : item.unitRate * item.quantity * item.days;
    return sum + Math.round(billed - baseCost);
  }, 0);

  return (
    <div className="bg-card border border-card-border rounded p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)]">
          Margin (admin-only, not on PDF)
        </span>
        <span className="text-xs text-green-400 font-mono">
          ${margin.toLocaleString()}
        </span>
      </div>
      <div className="border-t border-card-border pt-3 flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
          Estimate Total
        </span>
        <span className="text-lg text-white font-mono font-bold">
          ${total.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
