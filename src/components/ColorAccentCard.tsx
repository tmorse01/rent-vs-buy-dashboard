import { Paper, rgba } from "@mantine/core";
import type { PaperProps } from "@mantine/core";
import type { ReactNode } from "react";
import { useAppTheme } from "../theme/useAppTheme";

interface ColorAccentCardProps extends Omit<PaperProps, "style"> {
  backgroundGradient: string;
  children: ReactNode;
  style?: React.CSSProperties;
}

/**
 * Reusable card component with color accent highlights
 * Top bar and left border use consistent colors, content can vary
 */
export function ColorAccentCard({
  backgroundGradient,
  children,
  ...paperProps
}: ColorAccentCardProps) {
  const { theme, shadows, borders } = useAppTheme();

  return (
    <Paper
      {...paperProps}
      style={{
        position: "relative",
        height: "100%",
        background: backgroundGradient,
        color: theme.white,
        ["--mantine-color-dimmed"]: rgba(theme.white, 0.72),
        ["--mantine-color-text"]: theme.white,
        textShadow: shadows.textShadow,
        border: borders.subtleDark,
        boxShadow: `0 1px 3px ${rgba(theme.black, 0.05)}, 0 1px 2px ${rgba(
          theme.black,
          0.1,
        )}`,
        overflow: "hidden",
        ...paperProps.style,
      }}
    >
      {/* Content wrapper */}
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </Paper>
  );
}
