import type { EstimateBreakdown, ScopeSummary, LineItemCategory } from "@/lib/scope-types";

interface Props {
  summary: ScopeSummary;
  estimate: EstimateBreakdown;
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

export default function PrintableEstimate({ summary, estimate }: Props) {
  const groupedItems = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: estimate.lineItems.filter((li) => li.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="hidden print:block bg-white text-black p-8 print-estimate">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-black">
        <div>
          <h1 className="text-2xl font-bold tracking-wide uppercase">
            Geared Like A Machine
          </h1>
          <p className="text-sm text-gray-800 mt-1">Video Production & Equipment Rentals</p>
        </div>
        <div className="text-right text-sm text-gray-800">
          <p>hello@gearedlikeamachine.com</p>
          <p>gearedlikeamachine.com</p>
        </div>
      </div>

      <h2 className="text-xl font-bold uppercase tracking-wide mb-6">
        Project Scope & Estimate
      </h2>

      {/* Summary Sections */}
      <div className="space-y-4 mb-8">
        {[
          { title: "Overview", text: summary.overview },
          { title: "Deliverables", text: summary.deliverables },
          { title: "Production Approach", text: summary.production },
          { title: "Post-Production", text: summary.postProduction },
          { title: "Timeline", text: summary.timeline },
        ].map((section) => (
          <div key={section.title}>
            <h3 className="text-sm font-bold uppercase tracking-wide mb-1">
              {section.title}
            </h3>
            <p className="text-sm leading-relaxed text-gray-900">{section.text}</p>
          </div>
        ))}
      </div>

      {/* Cost Table */}
      <h2 className="text-xl font-bold uppercase tracking-wide mb-4 mt-8 pt-4 border-t-2 border-black">
        Cost Estimate
      </h2>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="text-left text-xs uppercase tracking-wide font-bold pb-2 pr-4">
              Item
            </th>
            <th className="text-right text-xs uppercase tracking-wide font-bold pb-2 pr-4">
              Qty
            </th>
            <th className="text-right text-xs uppercase tracking-wide font-bold pb-2 pr-4">
              Unit Price
            </th>
            <th className="text-right text-xs uppercase tracking-wide font-bold pb-2">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {groupedItems.map((group) => {
            const catTotal = group.items.reduce((s, i) => s + i.total, 0);
            return (
              <PrintGroup key={group.category} group={group} categoryTotal={catTotal} />
            );
          })}
        </tbody>
      </table>

      {/* Totals */}
      <div className="mt-6 pt-4 border-t-2 border-black space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatCurrency(estimate.subtotal)}</span>
        </div>
        {estimate.urgencyPremium > 0 && (
          <div className="flex justify-between text-sm">
            <span>
              Urgency Premium ({Math.round((estimate.urgencyMultiplier - 1) * 100)}%)
            </span>
            <span>+{formatCurrency(estimate.urgencyPremium)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span>Contingency (10%)</span>
          <span>+{formatCurrency(estimate.contingency)}</span>
        </div>
        <div className="flex justify-between text-base font-bold pt-2 border-t border-black">
          <span className="uppercase tracking-wide">Estimated Total</span>
          <span>{formatCurrency(estimate.total)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Deposit (50%)</span>
          <span className="font-semibold">{formatCurrency(estimate.deposit)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-400 text-xs text-gray-700">
        <p>
          This is an automated estimate. Actual costs may vary based on specific requirements.
          Valid for 30 days. Contact hello@gearedlikeamachine.com with questions.
        </p>
        <p className="mt-2">
          &copy; {new Date().getFullYear()} Geared Like A Machine. All rights reserved.
        </p>
      </div>
    </div>
  );
}

function PrintGroup({
  group,
  categoryTotal,
}: {
  group: { category: string; items: EstimateBreakdown["lineItems"] };
  categoryTotal: number;
}) {
  return (
    <>
      <tr>
        <td
          colSpan={4}
          className="pt-4 pb-1 text-xs font-bold uppercase tracking-wide"
        >
          {group.category}
        </td>
      </tr>
      {group.items.map((item, idx) => (
        <tr key={idx} className="border-b border-gray-200">
          <td className="py-1.5 pr-4">{item.name}</td>
          <td className="py-1.5 pr-4 text-right text-gray-800">
            {item.quantity} {item.unit}
          </td>
          <td className="py-1.5 pr-4 text-right text-gray-800">
            {formatCurrency(item.unitPrice)}
          </td>
          <td className="py-1.5 text-right">{formatCurrency(item.total)}</td>
        </tr>
      ))}
      <tr className="border-b border-gray-400">
        <td colSpan={3} className="py-1.5 text-right text-xs uppercase tracking-wide text-gray-800">
          {group.category} Total
        </td>
        <td className="py-1.5 text-right font-semibold">
          {formatCurrency(categoryTotal)}
        </td>
      </tr>
    </>
  );
}
