import { Box, rgba } from "@mantine/core";
import type { CSSProperties, ReactNode } from "react";
import { useAppTheme } from "../theme/useAppTheme";

export type InsightPillVariant = "positive" | "negative";

export type InsightPillSize = "default" | "compact" | "leader";

export interface InsightPillProps {
  variant: InsightPillVariant;
  /** @default default */
  size?: InsightPillSize;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * `positive`: white text on a near-black chip.
 * `negative`: white text on a red gradient chip.
 */
export function InsightPill({
  variant,
  size = "default",
  children,
  className,
  style,
}: InsightPillProps) {
  const { theme, shadows, palette } = useAppTheme();

  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    fontVariantNumeric: "tabular-nums",
    WebkitFontSmoothing: "antialiased",
    boxSizing: "border-box",
    maxWidth: "100%",
  };

  const sizeStyles: CSSProperties =
    size === "compact"
      ? {
          padding: "0.35rem 0.72rem",
          fontSize: theme.fontSizes.sm,
          fontWeight: 700,
          lineHeight: 1.25,
        }
      : size === "leader"
        ? {
            padding: "0.4rem 0.82rem",
            fontSize: theme.fontSizes.md,
            fontWeight: 700,
            lineHeight: 1.25,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }
        : {
            padding: "0.4rem 0.82rem",
            fontSize: theme.fontSizes.md,
            fontWeight: 700,
            lineHeight: 1.25,
          };

  const variantStyles: CSSProperties =
    variant === "positive"
      ? {
          color: theme.white,
          background: `linear-gradient(180deg, ${theme.colors.dark[7]} 0%, ${theme.black} 100%)`,
          border: `1px solid ${rgba(theme.white, 0.14)}`,
          boxShadow: shadows.pillPositive,
          textShadow: `0 1px 2px ${rgba(theme.black, 0.45)}`,
        }
      : {
          color: theme.white,
          background: `linear-gradient(180deg, ${theme.colors.red[6]} 0%, ${palette.negativeAccent} 100%)`,
          border: `1px solid ${rgba(theme.white, 0.22)}`,
          boxShadow: shadows.pillNegative,
          textShadow: shadows.textShadow,
        };

  return (
    <Box
      component="span"
      className={className}
      style={{ ...base, ...sizeStyles, ...variantStyles, ...style }}
    >
      {children}
    </Box>
  );
}
