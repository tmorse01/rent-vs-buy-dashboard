/**
 * Formatting utilities for consistent number and currency display
 */

/**
 * Formats a currency value with appropriate abbreviations (K, M)
 * @param value - The numeric value to format
 * @param options - Formatting options
 * @returns Formatted currency string (e.g., "$1.5K", "$2.3M", "$500")
 */
export function formatCurrency(
  value: number,
  options: {
    showCents?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string {
  const {
    showCents = false,
    minimumFractionDigits = 0,
    maximumFractionDigits = 1,
  } = options;

  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (absValue >= 1000000) {
    const millions = absValue / 1000000;
    return `${sign}$${millions.toFixed(maximumFractionDigits)}M`;
  }

  if (absValue >= 1000) {
    const thousands = absValue / 1000;
    // For values >= 100K, show no decimals; otherwise show 1 decimal
    const decimals = absValue >= 100000 ? 0 : maximumFractionDigits;
    return `${sign}$${thousands.toFixed(decimals)}K`;
  }

  // For values < 1000, use standard locale formatting
  if (showCents) {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits,
    maximumFractionDigits: 0,
  });
}

/**
 * Formats a currency value for chart axes (compact format)
 * @param value - The numeric value to format
 * @returns Formatted currency string optimized for chart display
 */
export function formatCurrencyCompact(value: number): string {
  return formatCurrency(value, { maximumFractionDigits: 1 });
}

/**
 * Formats a currency value for tooltips (with more detail)
 * @param value - The numeric value to format
 * @returns Formatted currency string with appropriate precision
 */
export function formatCurrencyTooltip(value: number): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (absValue >= 1000000) {
    return `${sign}$${(absValue / 1000000).toFixed(1)}M`;
  }

  if (absValue >= 1000) {
    return `${sign}$${(absValue / 1000).toFixed(absValue >= 100000 ? 0 : 1)}K`;
  }

  return `${sign}$${absValue.toLocaleString()}`;
}

/**
 * Formats a number as a percentage
 * @param value - The numeric value (e.g., 3.5 for 3.5%)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string (e.g., "3.5%")
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formats a number with thousand separators
 * @param value - The numeric value
 * @returns Formatted number string (e.g., "1,234,567")
 */
export function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

/**
 * Formats a metric value (currency or string) for display in metric cards
 * @param value - The value to format (number, string, or null)
 * @returns Formatted string for display
 */
export function formatMetricValue(
  value: string | number | null
): string {
  if (value === null) return "N/A";
  if (typeof value === "string") return value;
  return formatCurrency(value);
}

