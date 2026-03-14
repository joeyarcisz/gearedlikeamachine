"use client";

type LineItemData = {
  id?: string;
  name: string;
  category: string;
  department: string | null;
  rateType: string;
  unitRate: number;
  quantity: number;
  days: number;
  lineTotal: number;
  isOwnerLabor?: boolean;
  notes: string | null;
};

interface LineItemRowProps {
  item: LineItemData;
  onChange: (updated: LineItemData) => void;
  onRemove: () => void;
}

function computeLineTotal(unitRate: number, quantity: number, days: number, rateType: string) {
  if (rateType === "PER_MILE") return Math.round((unitRate / 100) * quantity * days);
  return Math.round(unitRate * quantity * days);
}

function rateSuffix(rateType: string) {
  if (rateType === "DAY") return "/day";
  if (rateType === "HOUR") return "/hr";
  if (rateType === "PER_MILE") return "/mi";
  return "";
}

export default function LineItemRow({ item, onChange, onRemove }: LineItemRowProps) {
  function handleChange(field: string, value: string | number) {
    const updated = { ...item, [field]: value };
    updated.lineTotal = computeLineTotal(updated.unitRate, updated.quantity, updated.days, updated.rateType);
    onChange(updated);
  }

  return (
    <tr className="border-b border-card-border/50 hover:bg-white/[0.02] transition-colors">
      <td className="py-2 px-2 text-xs text-white">
        <div className="flex items-center gap-1">
          {item.isOwnerLabor && <span className="text-yellow-400 text-[10px]">&#9733;</span>}
          <span className="truncate max-w-[200px]">{item.name}</span>
        </div>
      </td>
      <td className="py-2 px-2">
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={item.unitRate}
            onChange={(e) => handleChange("unitRate", Number(e.target.value))}
            className="w-20 bg-transparent border border-card-border/50 rounded px-2 py-1 text-xs text-white text-right focus:outline-none focus:border-steel/50"
          />
          <span className="text-[9px] text-muted">{rateSuffix(item.rateType)}</span>
        </div>
      </td>
      <td className="py-2 px-2">
        <input
          type="number"
          value={item.quantity}
          step={item.rateType === "PER_MILE" ? 0.1 : 1}
          onChange={(e) => handleChange("quantity", Number(e.target.value))}
          className="w-16 bg-transparent border border-card-border/50 rounded px-2 py-1 text-xs text-white text-center focus:outline-none focus:border-steel/50"
        />
      </td>
      <td className="py-2 px-2">
        <input
          type="number"
          value={item.days}
          onChange={(e) => handleChange("days", Number(e.target.value))}
          className="w-14 bg-transparent border border-card-border/50 rounded px-2 py-1 text-xs text-white text-center focus:outline-none focus:border-steel/50"
        />
      </td>
      <td className="py-2 px-2 text-xs text-white text-right font-mono">
        ${item.lineTotal.toLocaleString()}
      </td>
      <td className="py-2 px-1">
        <button
          onClick={onRemove}
          className="text-muted hover:text-red-400 transition-colors text-sm px-1"
          title="Remove item"
        >
          &times;
        </button>
      </td>
    </tr>
  );
}
