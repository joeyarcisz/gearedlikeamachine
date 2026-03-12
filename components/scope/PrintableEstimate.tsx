import { formatCurrency, CATEGORY_ORDER } from "@/lib/scope-types";
import type { EstimateBreakdown, ScopeSummary } from "@/lib/scope-types";

interface Props {
  summary: ScopeSummary;
  estimate: EstimateBreakdown;
}

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

      <table className="w-full text-sm border-collapse table-fixed">
        <colgroup>
          <col style={{ width: "46%" }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "20%" }} />
        </colgroup>
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
      <div className="mt-8 pt-6 border-t-2 border-black break-inside-avoid">
        <div className="space-y-2 max-w-xs ml-auto">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatCurrency(estimate.subtotal)}</span>
          </div>
          {estimate.urgencyPremium !== 0 && (
            <div className="flex justify-between text-sm">
              <span>
                {estimate.urgencyPremium < 0 ? "Flexible Discount" : "Urgency Premium"} ({Math.round((estimate.urgencyMultiplier - 1) * 100)}%)
              </span>
              <span>{estimate.urgencyPremium < 0 ? "" : "+"}{formatCurrency(estimate.urgencyPremium)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>Contingency (10%)</span>
            <span>+{formatCurrency(estimate.contingency)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-3 mt-2 border-t-2 border-black">
            <span className="uppercase tracking-wide">Estimated Total</span>
            <span>{formatCurrency(estimate.total)}</span>
          </div>
          <div className="flex justify-between text-sm pt-1">
            <span>Deposit (50%)</span>
            <span className="font-semibold">{formatCurrency(estimate.deposit)}</span>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {estimate.warnings.length > 0 && (
        <div className="mt-4 border border-gray-400 p-3 space-y-1">
          {estimate.warnings.map((w, i) => (
            <p key={i} className="text-xs text-gray-800">&#9888; {w}</p>
          ))}
        </div>
      )}

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
      <tr className="break-inside-avoid">
        <td
          colSpan={4}
          className="pt-6 pb-2 text-[11px] font-bold uppercase tracking-widest border-b border-black"
        >
          {group.category}
        </td>
      </tr>
      {group.items.map((item) => (
        <tr key={item.name} className="border-b border-gray-200 break-inside-avoid">
          <td className="py-2 pr-4">{item.name}</td>
          <td className="py-2 pr-4 text-right text-gray-800">
            {item.quantity} {item.unit}
          </td>
          <td className="py-2 pr-4 text-right text-gray-800">
            {formatCurrency(item.unitPrice)}
          </td>
          <td className="py-2 text-right">{formatCurrency(item.total)}</td>
        </tr>
      ))}
      <tr className="border-b-2 border-gray-400 break-inside-avoid">
        <td colSpan={3} className="py-2 text-right text-xs font-bold uppercase tracking-wide text-gray-800 bg-gray-100">
          {group.category} Total
        </td>
        <td className="py-2 text-right font-bold bg-gray-100">
          {formatCurrency(categoryTotal)}
        </td>
      </tr>
    </>
  );
}
