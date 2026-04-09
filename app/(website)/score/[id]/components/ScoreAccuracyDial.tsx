import type { PieArcDatum } from "d3-shape";
import { arc, pie } from "d3-shape";

import { GameMode } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import { gameModeToVanilla } from "@/lib/utils/gameMode.util";
import { getGradeColor } from "@/lib/utils/getGradeColor";

interface ScoreAccuracyDialProps {
  accuracy: number;
  grade: string;
  gameMode: GameMode;
}

const SEGMENT_COLORS = [
  "#ff5a5a",
  "#ff8e5d",
  "#e3b130",
  "#88da20",
  "#02b5c3",
  "#de31ae",
];

const RANK_CUTOFFS: Record<string, number[]> = {
  default: [0.7, 0.1, 0.1, 0.05, 0.04, 0.01],
  catch: [0.85, 0.05, 0.04, 0.04, 0.01, 0.01],
};

function getCutoffs(gameMode: GameMode): number[] {
  const vanilla = gameModeToVanilla(gameMode);
  if (vanilla === GameMode.CATCH_THE_BEAT)
    return RANK_CUTOFFS.catch;
  return RANK_CUTOFFS.default;
}

function gradeDisplayLabel(grade: string): string {
  switch (grade) {
    case "X":
    case "XH":
      return "SS";
    case "SH":
      return "S";
    default:
      return grade;
  }
}

export function ScoreAccuracyDial({
  accuracy,
  grade,
  gameMode,
}: ScoreAccuracyDialProps) {
  const normalizedAccuracy = Math.min(Math.max(accuracy / 100, 0), 1);
  const cutoffs = getCutoffs(gameMode);

  const pieGen = pie<number>().sort(null).padAngle(0.02);
  const innerArcs = pieGen(cutoffs);
  const innerArcGen = arc<PieArcDatum<number>>().innerRadius(68).outerRadius(73);

  const outerPieGen = pie<number>().sort(null).padAngle(0);
  const outerData = [
    normalizedAccuracy,
    Math.max(0, 1 - normalizedAccuracy),
  ];
  const outerArcs = outerPieGen(outerData);
  const outerArcGen = arc<PieArcDatum<number>>()
    .innerRadius(75)
    .outerRadius(100)
    .cornerRadius(2);

  return (
    <div className="relative flex items-center justify-center">
      <svg
        viewBox="0 0 200 200"
        width={200}
        height={200}
        className="block"
      >
        <defs>
          <linearGradient
            id="score-dial-gradient"
            gradientTransform="rotate(90)"
          >
            <stop offset="0%" stopColor="hsl(200, 100%, 70%)" />
            <stop offset="100%" stopColor="hsl(90, 100%, 70%)" />
          </linearGradient>
        </defs>
        <g transform="translate(100,100)">
          {innerArcs.map((d, i) => (
            <path
              key={`inner-${i}`}
              d={innerArcGen(d) ?? ""}
              fill={SEGMENT_COLORS[i]}
              opacity={0.75}
            />
          ))}
          {outerArcs.map((d, i) => (
            <path
              key={`outer-${i}`}
              d={outerArcGen(d) ?? ""}
              fill={
                i === 0
                  ? "url(#score-dial-gradient)"
                  : "hsl(var(--secondary))"
              }
            />
          ))}
        </g>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={cn(
            "text-7xl font-bold",
            getGradeColor(grade),
          )}
          style={{
            textShadow: "0 0 8px currentColor",
            paddingTop: "0.1em",
          }}
        >
          {gradeDisplayLabel(grade)}
        </span>
      </div>
    </div>
  );
}
