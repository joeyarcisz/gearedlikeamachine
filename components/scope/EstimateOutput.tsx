import type { EstimateBreakdown, ScopeSummary, LineItemCategory } from "@/lib/scope-types";

interface Props {
  summary: ScopeSummary;
  estimate: EstimateBreakdown;
  onStartOver: () => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const CATEGORY_ORDER: LineItemCategory[] = [
  "Pre-Production",
  "Crew",
  "Gear",
  "Post-Production",
  "Additional",
];

export default function EstimateOutput({ summary, estimate, onStartOver }: Props) {
  const groupedItems = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: estimate.lineItems.filter((li) => li.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-12">
      {/* Scope Summary */}
      <div>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold uppercase tracking-widest mb-8">
          Your Scope Summary
        </h2>

        <div className="space-y-6">
          {[
            { title: "Overview", text: summary.overview },
            { title: "Deliverables", text: summary.deliverables },
            { title: "Production Approach", text: summary.production },
            { title: "Post-Production", text: summary.postProduction },
            { title: "Timeline", text: summary.timeline },
          ].map((section) => (
            <div key={section.title}>
              <h3 className="font-[family-name:var(--font-heading)] text-sm font-semibold uppercase tracking-widest text-steel mb-2">
                {section.title}
              </h3>
              <p className="text-sm text-chrome leading-relaxed">{section.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-card-border" />

      {/* Cost Breakdown */}
      <div>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold uppercase tracking-widest mb-8">
          Cost Estimate
        </h2>

        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <table className="w-full text-sm min-w-[400px]">
            <thead>
              <tr className="border-b border-card-border text-left">
                <th className="text-xs uppercase tracking-widest text-muted font-normal pb-3 pr-4">
                  Item
                </th>
                <th className="text-xs uppercase tracking-widest text-muted font-normal pb-3 pr-4 text-right">
                  Qty
                </th>
                <th className="text-xs uppercase tracking-widest text-muted font-normal pb-3 pr-4 text-right">
                  Unit Price
                </th>
                <th className="text-xs uppercase tracking-widest text-muted font-normal pb-3 text-right">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {groupedItems.map((group) => (
                <GroupRows key={group.category} group={group} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mt-8 space-y-3 sm:max-w-sm sm:ml-auto">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Subtotal</span>
            <span className="text-white">{formatCurrency(estimate.subtotal)}</span>
          </div>

          {estimate.urgencyPremium !== 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted">
                {estimate.urgencyPremium < 0 ? "Flexible Discount" : "Urgency Premium"} ({Math.round((estimate.urgencyMultiplier - 1) * 100)}%)
              </span>
              <span className="text-white">
                {estimate.urgencyPremium < 0 ? "" : "+"}{formatCurrency(estimate.urgencyPremium)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-muted">Contingency (10%)</span>
            <span className="text-white">+{formatCurrency(estimate.contingency)}</span>
          </div>

          <div className="border-t border-card-border pt-3 flex justify-between">
            <span className="font-[family-name:var(--font-heading)] text-sm font-bold uppercase tracking-widest">
              Estimated Total
            </span>
            <span className="font-[family-name:var(--font-heading)] text-xl font-bold text-steel">
              {formatCurrency(estimate.total)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted">Deposit (50%)</span>
            <span className="text-steel font-semibold">
              {formatCurrency(estimate.deposit)}
            </span>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {estimate.warnings.length > 0 && (
        <div className="border border-yellow-600/40 bg-yellow-900/10 p-4 space-y-2">
          {estimate.warnings.map((w, i) => (
            <p key={i} className="text-xs text-yellow-400 leading-relaxed">
              &#9888; {w}
            </p>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="border border-card-border bg-navy/30 p-4">
        <p className="text-xs text-muted leading-relaxed">
          This is an automated estimate based on the parameters you selected. Actual project costs
          may vary based on specific requirements, revisions, and scope changes discussed during
          the discovery phase. This estimate is valid for 30 days.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={() => window.print()}
          className="px-6 py-2.5 text-sm uppercase tracking-widest font-semibold bg-steel text-black hover:bg-steel/80 transition-colors text-center"
        >
          Download PDF
        </button>
        <button
          onClick={onStartOver}
          className="px-6 py-2.5 text-sm uppercase tracking-widest text-muted border border-card-border hover:text-white hover:border-steel transition-colors text-center"
        >
          Start Over
        </button>
        <a
          href="mailto:hello@gearedlikeamachine.com?subject=Scope%20Estimate%20Question"
          className="px-6 py-2.5 text-sm uppercase tracking-widest text-steel border border-steel hover:bg-steel hover:text-black transition-colors text-center"
        >
          Questions? Reach Out
        </a>
      </div>
    </div>
  );
}

function GroupRows({
  group,
}: {
  group: { category: LineItemCategory; items: EstimateBreakdown["lineItems"] };
}) {
  const categoryTotal = group.items.reduce((sum, i) => sum + i.total, 0);
  return (
    <>
      <tr>
        <td
          colSpan={4}
          className="pt-6 pb-2 font-[family-name:var(--font-heading)] text-xs font-semibold uppercase tracking-widest text-steel"
        >
          {group.category}
        </td>
      </tr>
      {group.items.map((item, idx) => (
        <tr key={`${group.category}-${idx}`} className="border-b border-card-border/30">
          <td className="py-2 pr-4 text-chrome">{item.name}</td>
          <td className="py-2 pr-4 text-right text-muted">
            {item.quantity} {item.unit}
          </td>
          <td className="py-2 pr-4 text-right text-muted">
            {formatCurrency(item.unitPrice)}
          </td>
          <td className="py-2 text-right text-white">
            {formatCurrency(item.total)}
          </td>
        </tr>
      ))}
      <tr className="border-b border-card-border">
        <td colSpan={3} className="py-2 text-right text-xs uppercase tracking-widest text-muted">
          {group.category} Total
        </td>
        <td className="py-2 text-right text-white font-semibold">
          {formatCurrency(categoryTotal)}
        </td>
      </tr>
    </>
  );
}
