export function getStatusPillStyle(status: string): { bg: string; color: string } {
  const darkText = "hsl(220, 10%, 25%)";
  const styles: Record<string, { bg: string; color: string }> = {
    ranked: { bg: "hsl(90, 100%, 70%)", color: darkText },
    approved: { bg: "hsl(90, 100%, 70%)", color: darkText },
    loved: { bg: "hsl(333, 100%, 70%)", color: darkText },
    qualified: { bg: "hsl(200, 100%, 70%)", color: darkText },
    pending: { bg: "hsl(45, 100%, 70%)", color: darkText },
    wip: { bg: "hsl(20, 100%, 70%)", color: darkText },
    graveyard: { bg: "hsl(0, 0%, 0%)", color: "hsl(220, 10%, 40%)" },
  };
  return styles[status.toLowerCase()] ?? { bg: "hsl(0, 0%, 0%)", color: "hsl(220, 10%, 40%)" };
}
