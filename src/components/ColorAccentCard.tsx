import { Paper } from "@mantine/core";
import type { PaperProps } from "@mantine/core";
import type { ReactNode } from "react";

interface ColorAccentCardProps extends Omit<PaperProps, "style"> {
  gradient: string;
  accentColor: string;
  children: ReactNode;
  style?: React.CSSProperties;
}

/**
 * Reusable card component with color accent highlights
 * Top bar and left border use consistent colors, content can vary
 */
export function ColorAccentCard({
  gradient,
  accentColor,
  children,
  ...paperProps
}: ColorAccentCardProps) {
  return (
    <Paper
      {...paperProps}
      style={{
        position: "relative",
        height: "100%",
        background: "#ffffff",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        ...paperProps.style,
      }}
    >
      {/* Top color accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: gradient,
          zIndex: 1,
        }}
      />
      {/* Subtle left border accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: "3px",
          background: accentColor,
          opacity: 0.3,
          zIndex: 1,
        }}
      />
      {/* Content wrapper */}
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </Paper>
  );
}

