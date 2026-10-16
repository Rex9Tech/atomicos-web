// src/helpers/money.helper.ts

/** Currencies stored as WHOLE units (no minor unit) — displayed without /100. */
export const ZERO_DECIMAL_CURRENCIES = ["mmk", "jpy", "krw", "vnd"] as const;

export function isZeroDecimalCurrency(currency?: string | null): boolean {
  return ZERO_DECIMAL_CURRENCIES.includes(
    (currency || "").toLowerCase() as (typeof ZERO_DECIMAL_CURRENCIES)[number],
  );
}

/**
 * Format a payment amount for display.
 *
 * Amounts in the payment tables follow the store convention: USD/SGD are in
 * minor units (divide by 100 for display); zero-decimal currencies such as
 * MMK are stored as whole units (the MMQR gateway expects whole kyats too).
 */
export function formatMoney(
  amount: number,
  currency: string = "usd",
  locale?: string,
): string {
  const lower = (currency || "usd").toLowerCase();
  const zeroDecimal = isZeroDecimalCurrency(lower);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: lower.toUpperCase(),
    minimumFractionDigits: zeroDecimal ? 0 : 2,
    maximumFractionDigits: zeroDecimal ? 0 : 2,
  }).format(zeroDecimal ? amount : amount / 100);
}
