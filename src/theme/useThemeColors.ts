import { useComputedColorScheme } from "@mantine/core";
import {
  COLORS,
  DARK_COLORS,
  getChartColors,
  getDataColors,
  type ThemeNeutralColors,
} from "./colors";

function mapDarkNeutrals(): ThemeNeutralColors {
  return {
    bgPrimary: DARK_COLORS.bg.primary,
    bgSecondary: DARK_COLORS.bg.secondary,
    bgTertiary: DARK_COLORS.bg.tertiary,
    borderLight: DARK_COLORS.border.light,
    borderMedium: DARK_COLORS.border.medium,
    borderDark: DARK_COLORS.border.dark,
    textPrimary: DARK_COLORS.text.primary,
    textSecondary: DARK_COLORS.text.secondary,
    textTertiary: DARK_COLORS.text.tertiary,
    textDisabled: DARK_COLORS.text.tertiary,
  };
}

export function useThemeColors() {
  const scheme = useComputedColorScheme("light");
  const isDark = scheme === "dark";

  return {
    isDark,
    neutral: isDark ? mapDarkNeutrals() : COLORS.neutral,
    data: getDataColors(isDark),
    chart: getChartColors(isDark),
    brand: COLORS.brand,
  };
}
