import type { CSSProperties } from "react";

export const CHART_TOOLTIP_CONTENT_STYLE: CSSProperties = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  color: "hsl(var(--foreground))",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
};

export const CHART_TOOLTIP_LABEL_STYLE: CSSProperties = {
  color: "#8DA3B9",
  fontWeight: "bold",
};

export const CHART_GRID_STROKE = "hsl(var(--border))";
export const CHART_GRID_STROKE_OPACITY = 0.4;

export const CHART_AXIS_STROKE = "hsl(var(--muted-foreground))";
