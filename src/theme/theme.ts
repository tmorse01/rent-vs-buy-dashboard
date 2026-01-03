import { createTheme } from "@mantine/core";

/**
 * Custom Mantine theme for Rent vs Buy Dashboard
 *
 * Color philosophy:
 * - Owner: Blue (trust, stability, investment)
 * - Renter: Cyan/Teal (distinct but professional)
 * - Brand: Blue with violet accent (professional, modern)
 */
export const theme = createTheme({
  // Primary color - used for buttons, links, focus states
  primaryColor: "blue",

  // Custom color scales (10 shades from lightest to darkest)
  colors: {
    // Blue - Owner scenario, primary brand color
    blue: [
      "#eff6ff", // 0 - Lightest (backgrounds)
      "#dbeafe", // 1
      "#bfdbfe", // 2
      "#93c5fd", // 3 - Light fills
      "#60a5fa", // 4
      "#3b82f6", // 5
      "#2563eb", // 6 - PRIMARY (main owner color)
      "#1d4ed8", // 7
      "#1e40af", // 8 - Dark variant
      "#1e3a8a", // 9 - Darkest
    ],

    // Cyan - Renter scenario (distinct from blue)
    cyan: [
      "#ecfeff", // 0
      "#cffafe", // 1
      "#a5f3fc", // 2
      "#67e8f9", // 3 - Light fills
      "#22d3ee", // 4
      "#06b6d4", // 5
      "#0891b2", // 6 - PRIMARY (main renter color)
      "#0e7490", // 7
      "#155e75", // 8
      "#164e63", // 9
    ],

    // Violet - Accent color for highlights
    violet: [
      "#f5f3ff", // 0
      "#ede9fe", // 1
      "#ddd6fe", // 2
      "#c4b5fd", // 3
      "#a78bfa", // 4
      "#8b5cf6", // 5
      "#7c3aed", // 6 - PRIMARY (accent)
      "#6d28d9", // 7
      "#5b21b6", // 8
      "#4c1d95", // 9
    ],
  },

  // Typography
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',

  headings: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: "600",
    sizes: {
      h1: { fontSize: "2.5rem", lineHeight: "1.2" },
      h2: { fontSize: "2rem", lineHeight: "1.3" },
      h3: { fontSize: "1.5rem", lineHeight: "1.4" },
      h4: { fontSize: "1.25rem", lineHeight: "1.4" },
    },
  },

  // Spacing & Radius
  defaultRadius: "md",
  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },

  // Shadows (subtle, professional)
  shadows: {
    xs: "0 1px 2px rgba(0, 0, 0, 0.05)",
    sm: "0 1px 3px rgba(0, 0, 0, 0.1)",
    md: "0 4px 6px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px rgba(0, 0, 0, 0.1)",
  },

  // Other defaults
  cursorType: "pointer",
  respectReducedMotion: true,
});
