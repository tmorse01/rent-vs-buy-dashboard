import { rgba, useMantineTheme } from "@mantine/core";

export function useAppTheme() {
  const theme = useMantineTheme();

  const gradients = {
    owner: `linear-gradient(135deg, ${theme.colors.blue[6]} 0%, ${theme.colors.blue[8]} 100%)`,
    renter: `linear-gradient(135deg, ${theme.colors.cyan[6]} 0%, ${theme.colors.cyan[8]} 100%)`,
    warning: `linear-gradient(135deg, ${theme.colors.yellow[5]} 0%, ${theme.colors.orange[6]} 100%)`,
    teal: `linear-gradient(135deg, ${theme.colors.teal[5]} 0%, ${theme.colors.teal[7]} 100%)`,
    positive: `linear-gradient(135deg, ${theme.colors.green[6]} 0%, ${theme.colors.green[8]} 100%)`,
    purple: `linear-gradient(135deg, ${theme.colors.grape[5]} 0%, ${theme.colors.violet[7]} 100%)`,
  } as const;

  const palette = {
    negativeAccent: theme.colors.red[7],
  } as const;

  const shadows = {
    pillPositive: [
      `inset 0 1px 0 ${rgba(theme.white, 0.14)}`,
      `0 1px 2px ${rgba(theme.black, 0.45)}`,
      `0 6px 16px ${rgba(theme.black, 0.35)}`,
    ].join(", "),
    pill: [
      `inset 0 1px 0 ${rgba(theme.white, 0.92)}`,
      `0 1px 2px ${rgba(theme.black, 0.04)}`,
      `0 4px 12px ${rgba(theme.black, 0.1)}`,
      `0 10px 28px ${rgba(theme.black, 0.08)}`,
    ].join(", "),
    pillNegative: [
      `inset 0 1px 0 ${rgba(theme.white, 0.22)}`,
      `inset 0 0 0 1px ${rgba(theme.colors.red[9], 0.45)}`,
      `0 2px 6px ${rgba(theme.colors.red[9], 0.22)}`,
      `0 10px 24px ${rgba(theme.black, 0.14)}`,
    ].join(", "),
    textShadow: `0 1px 2px ${rgba(theme.black, 0.35)}`,
  } as const;

  const borders = {
    subtleLight: `1px solid ${rgba(theme.white, 0.2)}`,
    subtleDark: `1px solid ${rgba(theme.black, 0.08)}`,
  } as const;

  return {
    theme,
    gradients,
    palette,
    shadows,
    borders,
  };
}
