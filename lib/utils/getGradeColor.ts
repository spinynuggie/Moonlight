const gradeColors: Record<string, string> = {
  XH: "sky-200",
  X: "yellow-300",
  SH: "sky-200",
  S: "yellow-300",
  A: "green-300",
  B: "blue-300",
  C: "pink-300",
  D: "red-400",
  F: "red-400",
};

const gradeHexColors: Record<string, string> = {
  XH: "#bae6fd",
  X: "#fde047",
  SH: "#bae6fd",
  S: "#fde047",
  A: "#86efac",
  B: "#93c5fd",
  C: "#f9a8d4",
  D: "#f87171",
  F: "#f87171",
};

const gradeDisplayNames: Record<string, string> = {
  XH: "SS",
  X: "SS",
  SH: "S",
  S: "S",
  A: "A",
  B: "B",
  C: "C",
  D: "D",
  F: "F",
};

export function getGradeColor(grade: string, prefix: "text" | "bg" = "text") {
  return `${prefix}-${gradeColors[grade] || "gray-400"}`;
}

export function getGradeHexColor(grade: string): string {
  return gradeHexColors[grade] || "#9ca3af";
}

export function getGradeDisplayName(grade: string): string {
  return gradeDisplayNames[grade] || grade;
}
