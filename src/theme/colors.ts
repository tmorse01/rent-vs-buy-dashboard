/**
 * Color Theme Constants
 *
 * Centralized color definitions for the Rent vs Buy Dashboard.
 * These colors are designed for professional financial data visualization
 * with excellent accessibility and readability.
 */

export const COLORS = {
  // Primary Brand Colors
  brand: {
    primary: "#2563eb", // Blue 600 - Primary actions, main brand
    primaryDark: "#1e40af", // Blue 800 - Darker variant
    primaryLight: "#93c5fd", // Blue 300 - Light accents
    accent: "#7c3aed", // Violet 600 - Accent highlights
    accentLight: "#a78bfa", // Violet 400 - Light accents
  },

  // Data Visualization - Owner vs Renter
  owner: {
    primary: "#2563eb", // Blue 600 - Main owner lines/bars
    light: "#93c5fd", // Blue 300 - Fills, backgrounds
    dark: "#1e3a8a", // Blue 900 - Emphasis, hover
  },

  renter: {
    primary: "#0891b2", // Cyan 600 - Main renter lines/bars
    light: "#67e8f9", // Cyan 300 - Fills, backgrounds
    dark: "#0e7490", // Cyan 800 - Emphasis, hover
  },

  // Semantic Colors
  success: {
    primary: "#10b981", // Emerald 500 - Positive metrics, gains
    light: "#6ee7b7", // Emerald 300 - Light backgrounds
    dark: "#059669", // Emerald 600 - Emphasis
  },

  warning: {
    primary: "#f59e0b", // Amber 500 - Warnings, important notices
    light: "#fcd34d", // Amber 300 - Light backgrounds
    dark: "#d97706", // Amber 600 - Emphasis
  },

  error: {
    primary: "#ef4444", // Red 500 - Errors, critical issues
    light: "#fca5a5", // Red 300 - Light backgrounds
    dark: "#dc2626", // Red 600 - Emphasis
  },

  info: {
    primary: "#6366f1", // Indigo 500 - Informational elements
    light: "#a5b4fc", // Indigo 300 - Light backgrounds
  },

  // Neutral Colors
  neutral: {
    bgPrimary: "#ffffff", // White - Main content background
    bgSecondary: "#f8fafc", // Slate 50 - Page background
    bgTertiary: "#f1f5f9", // Slate 100 - Card backgrounds
    borderLight: "#e2e8f0", // Slate 200 - Subtle borders
    borderMedium: "#cbd5e1", // Slate 300 - Standard borders
    borderDark: "#94a3b8", // Slate 400 - Emphasis borders
    textPrimary: "#0f172a", // Slate 900 - Main text
    textSecondary: "#475569", // Slate 600 - Secondary text
    textTertiary: "#64748b", // Slate 500 - Muted text
    textDisabled: "#94a3b8", // Slate 400 - Disabled text
  },

  // Chart-Specific Colors
  chart: {
    reference: "#64748b", // Slate 500 - Reference lines, markers
    grid: "#e2e8f0", // Slate 200 - Grid lines
    zeroLine: "#cbd5e1", // Slate 300 - Zero line
    principal: "#2563eb", // Blue 600 - Principal paid (wealth stack)
    appreciation: "#10b981", // Emerald 500 - Net appreciation
    interest: "#f59e0b", // Amber 500 - Interest paid (narrative)
  },
} as const;

/**
 * Solid Colors (replacing gradients where appropriate)
 */
export const SOLID_COLORS = {
  // Hero/Header - Solid blue, no gradient
  hero: "#2563eb", // Blue 600 - Professional, trustworthy
} as const;

/**
 * Gradient Definitions
 * Note: Avoiding blue-to-purple gradients. Using single-color gradients or different color combinations.
 */
export const GRADIENTS = {
  // Owner - Blue gradient (same color family)
  owner: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",

  // Renter - Cyan gradient (same color family)
  renter: "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)",

  // Metric Cards - Unique colors for each card
  breakEvenCash: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
  breakEvenNetWorth: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", // Indigo gradient
  positive: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  negative: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)", // Violet gradient (replaced slate)
  neutral: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  warning: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  // Additional unique gradients for metric cards
  teal: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
  rose: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
  emerald: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  sky: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
  purple: "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)",
  orange: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
  pink: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
  lime: "linear-gradient(135deg, #84cc16 0%, #65a30d 100%)",

  // Backgrounds
  subtle: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
  subtleBlue: "linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)",
} as const;

/**
 * Dark Mode Color Overrides
 */
export const DARK_COLORS = {
  owner: {
    primary: "#60a5fa", // Blue 400 - Lighter for dark backgrounds
  },
  renter: {
    primary: "#22d3ee", // Cyan 400 - Lighter for dark backgrounds
  },
  bg: {
    primary: "#0f172a", // Slate 900
    secondary: "#1e293b", // Slate 800
    tertiary: "#334155", // Slate 700
  },
  text: {
    primary: "#f1f5f9", // Slate 100
    secondary: "#cbd5e1", // Slate 300
    tertiary: "#94a3b8", // Slate 400
  },
  border: {
    light: "#334155", // Slate 700
    medium: "#475569", // Slate 600
    dark: "#64748b", // Slate 500
  },
} as const;

/**
 * Helper function to get owner/renter colors based on theme
 */
export function getDataColors(isDark = false) {
  return {
    owner: isDark ? DARK_COLORS.owner.primary : COLORS.owner.primary,
    renter: isDark ? DARK_COLORS.renter.primary : COLORS.renter.primary,
  };
}

/**
 * Mantine color scale mapping
 * Maps our custom colors to Mantine's color system
 */
export const MANTINE_COLORS = {
  blue: [
    "#eff6ff", // 0
    "#dbeafe", // 1
    "#bfdbfe", // 2
    "#93c5fd", // 3
    "#60a5fa", // 4
    "#3b82f6", // 5
    "#2563eb", // 6 - Primary
    "#1d4ed8", // 7
    "#1e40af", // 8
    "#1e3a8a", // 9
  ],
  cyan: [
    "#ecfeff", // 0
    "#cffafe", // 1
    "#a5f3fc", // 2
    "#67e8f9", // 3
    "#22d3ee", // 4
    "#06b6d4", // 5
    "#0891b2", // 6 - Primary
    "#0e7490", // 7
    "#155e75", // 8
    "#164e63", // 9
  ],
} as const;
