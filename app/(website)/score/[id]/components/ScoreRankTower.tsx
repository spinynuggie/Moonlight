import { cn } from "@/lib/utils";
import { getGradeColor } from "@/lib/utils/getGradeColor";

interface ScoreRankTowerProps {
  grade: string;
}

const TOWER_ENTRIES = [
  { display: "SS", rank: 5, colorGrade: "X" },
  { display: "S", rank: 4, colorGrade: "S" },
  { display: "A", rank: 3, colorGrade: "A" },
  { display: "B", rank: 2, colorGrade: "B" },
  { display: "C", rank: 1, colorGrade: "C" },
  { display: "D", rank: 0, colorGrade: "D" },
];

function gradeToRankIndex(grade: string): number {
  switch (grade) {
    case "X":
    case "XH":
      return 5;
    case "S":
    case "SH":
      return 4;
    case "A":
      return 3;
    case "B":
      return 2;
    case "C":
      return 1;
    default:
      return 0;
  }
}

export function ScoreRankTower({ grade }: ScoreRankTowerProps) {
  const currentRank = gradeToRankIndex(grade);

  return (
    <div className="flex flex-row-reverse items-center gap-1 md:flex-col md:gap-1.5">
      {TOWER_ENTRIES.map((entry) => {
        const isCurrent = entry.rank === currentRank;
        const isPassed = entry.rank < currentRank;
        const isMissed = entry.rank > currentRank;

        return (
          <div
            key={entry.display}
            className={cn(
              "flex size-9 items-center justify-center rounded text-xs font-bold leading-none md:size-10 md:text-sm",
              getGradeColor(entry.colorGrade),
              isCurrent && "scale-110",
              isPassed && "opacity-40",
              isMissed && "opacity-10 grayscale",
            )}
          >
            {entry.display}
          </div>
        );
      })}
    </div>
  );
}
