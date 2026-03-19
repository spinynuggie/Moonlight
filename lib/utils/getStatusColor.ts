export function getStatusColor(
  status: string,
  variant: "text" | "bg" = "text",
) {
  const s = status.trim();

  if (variant === "bg") {
    if (s === "Offline")
      return "bg-muted-foreground";
    if (s === "Idle" || s === "Afk")
      return "bg-yellow-500";
    return "bg-[#8C977D]";
  }

  if (s === "Offline")
    return "text-muted-foreground";
  if (s === "Idle" || s === "Afk")
    return "text-[#D9BC8C]"; // FIXME: Make everything variables instead of raw values site-wide
  return "text-[#8C977D]";
}
