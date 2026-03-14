import type { RateType } from "@prisma/client";

/**
 * Compute bill rate from base rate and markup.
 * - Owner labor: billRate = baseRate (no markup)
 * - PER_MILE: no $50 rounding (rates stored in cents)
 * - All others: round up to nearest $50
 */
export function computeBillRate(
  baseRate: number,
  markupPercent: number,
  isOwnerLabor: boolean,
  rateType: RateType
): number {
  if (isOwnerLabor || markupPercent === 0) return baseRate;
  const raw = baseRate * (1 + markupPercent / 100);
  if (rateType === "PER_MILE") return Math.ceil(raw);
  return Math.ceil(raw / 50) * 50;
}

/**
 * Compute line item total.
 * PER_MILE: unitRate is in cents, convert to dollars for total.
 */
export function computeLineTotal(
  unitRate: number,
  quantity: number,
  days: number,
  rateType: RateType
): number {
  if (rateType === "PER_MILE") {
    return Math.round((unitRate / 100) * quantity * days);
  }
  return Math.round(unitRate * quantity * days);
}
