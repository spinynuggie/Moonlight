import Cookies from "js-cookie";
import { useRef, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Customized,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  CHART_AXIS_STROKE,
  CHART_GRID_STROKE,
  CHART_GRID_STROKE_OPACITY,
  CHART_TOOLTIP_CONTENT_STYLE,
  CHART_TOOLTIP_LABEL_STYLE,
} from "@/app/(website)/user/[id]/lib/chartStyles";
import { useT } from "@/lib/i18n/utils";
import type {
  GetUserByUserIdPlayHistoryGraphResponse,
} from "@/lib/types/api";

interface Props {
  data: GetUserByUserIdPlayHistoryGraphResponse;
}

interface SpikedPoint {
  date: string;
  label: string;
  play_count: number;
  tooltipValue: number;
}

export default function UserPlayHistoryChart({ data }: Props) {
  const t = useT("pages.user.components.statsChart");
  const locale = Cookies.get("locale") || "en";

  const [cursorPos, setCursorPos] = useState({ x: 0, active: false });
  const lastPointRef = useRef<SpikedPoint | null>(null);
  const dotYRef = useRef(0);

  if (data.snapshots.length < 2) {
    return (
      <div className="flex h-52 items-center justify-center">
        <p className="text-sm text-muted-foreground">{t("noHistoricalData")}</p>
      </div>
    );
  }

  const firstDate = new Date(data.snapshots[0].saved_at);
  const lastDate = new Date(data.snapshots.at(-1)!.saved_at);

  let { snapshots } = data;

  for (
    let date = firstDate;
    date <= lastDate;
    date.setMonth(date.getMonth() + 1)
  ) {
    const dateString = date.toLocaleString(locale, {
      year: "numeric",
      month: "short",
    });

    if (
      !snapshots.some(
        s =>
          new Date(s.saved_at).toLocaleString(locale, {
            year: "numeric",
            month: "short",
          }) === dateString,
      )
    ) {
      snapshots.push({
        saved_at: date.toISOString(),
        play_count: 0,
      });
    }
  }

  snapshots = snapshots.sort(
    (b, a) =>
      new Date(b.saved_at).getTime()
        - new Date(a.saved_at).getTime(),
  );

  const chartData = snapshots.map((s) => {
    return {
      date: new Date(s.saved_at).toLocaleString(locale, {
        year: "numeric",
        month: "short",
      }),
      play_count: s.play_count,
    };
  });

  const spikedData: SpikedPoint[] = [];

  for (const point of chartData) {
    spikedData.push({
      date: "",
      label: point.date,
      play_count: 0,
      tooltipValue: point.play_count,
    }, {
      date: point.date,
      label: point.date,
      play_count: point.play_count,
      tooltipValue: point.play_count,
    });
  }

  const last = chartData.at(-1);

  if (last) {
    spikedData.push({
      date: "",
      label: last.date,
      play_count: 0,
      tooltipValue: last.play_count,
    });
  }

  const leewayForDomain = 10;
  const displayPoint = lastPointRef.current;

  return (
    <div className="relative h-52 max-h-52 min-h-52">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={spikedData}
          margin={{ top: 5, right: 20, bottom: 40, left: 0 }}
          onMouseMove={(state) => {
            const coord = (state as Record<string, unknown>)
              ?.activeCoordinate as { x: number; y: number } | undefined;
            const payload = (state as Record<string, unknown>)
              ?.activePayload as
              | Array<{ payload: SpikedPoint }>
              | undefined;

            if (coord) {
              const point = payload?.[0]?.payload;

              if (point?.date) {
                lastPointRef.current = point;
                setCursorPos({ x: coord.x, active: true });
              }
              else {
                setCursorPos(prev => ({
                  ...prev,
                  active: !!lastPointRef.current,
                }));
              }
            }
          }}
          onMouseLeave={() =>
            setCursorPos(prev => ({ ...prev, active: false }))}
        >
          <defs>
            <linearGradient
              id="playCountGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#8DA3B9" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#8DA3B9" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke={CHART_GRID_STROKE}
            strokeOpacity={CHART_GRID_STROKE_OPACITY}
            vertical={false}
          />

          <XAxis
            dataKey="date"
            tick={({ x, y, payload }: { x: number; y: number; payload: { value: string } }) => {
              if (!payload.value)
                return <g />;

              return (
                <g transform={`translate(${x},${y})`}>
                  <text
                    x={0}
                    y={0}
                    dy={12}
                    textAnchor="end"
                    fill={CHART_AXIS_STROKE}
                    fontSize={12}
                    transform="rotate(-45)"
                  >
                    {payload.value}
                  </text>
                </g>
              );
            }}
            height={60}
            stroke={CHART_AXIS_STROKE}
            tickLine={false}
          />

          <YAxis
            type="number"
            tickFormatter={(value: number) => {
              return (Math.round(value / 10) * 10).toString();
            }}
            domain={[
              0,
              (dataMax: number) =>
                Math.ceil((dataMax + leewayForDomain) / 10) * 10,
            ]}
            stroke={CHART_AXIS_STROKE}
            tick={{ fontSize: 12 }}
          />

          <Area
            type="linear"
            dataKey="play_count"
            stroke="#8DA3B9"
            strokeWidth={2}
            fill="url(#playCountGradient)"
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />

          <Customized
            component={(props: Record<string, unknown>) => {
              const offset = props.offset as
                | { top: number; height: number }
                | undefined;

              const yAxisMap = props.yAxisMap as
                | Record<string, { scale: (v: number) => number }>
                | undefined;

              if (!offset)
                return <g />;

              const yScale = yAxisMap?.["0"]?.scale;
              const activePoint = lastPointRef.current;

              if (yScale && activePoint) {
                dotYRef.current = yScale(activePoint.play_count);
              }

              return (
                <g
                  style={{
                    opacity: cursorPos.active ? 1 : 0,
                    transition: "opacity 150ms ease-in-out",
                  }}
                >
                  <line
                    x1={0}
                    y1={offset.top}
                    x2={0}
                    y2={offset.top + offset.height}
                    stroke="hsl(var(--muted-foreground))"
                    strokeOpacity={0.3}
                    style={{
                      transform: `translateX(${cursorPos.x}px)`,
                      transition: "transform 150ms ease-out",
                    }}
                  />

                  <circle
                    cx={0}
                    cy={0}
                    r={4}
                    fill="#8DA3B9"
                    style={{
                      transform: `translate(${cursorPos.x}px, ${dotYRef.current}px)`,
                      transition: "transform 150ms ease-out",
                    }}
                  />
                </g>
              );
            }}
          />

          <Tooltip cursor={false} content={() => null} />
        </AreaChart>
      </ResponsiveContainer>

      <div
        className="pointer-events-none absolute left-0 top-0 z-10"
        style={{
          transform: `translate(${cursorPos.x}px, ${dotYRef.current - 8}px)`,
          opacity: cursorPos.active && displayPoint ? 1 : 0,
          transition:
            "transform 150ms ease-out, opacity 150ms ease-in-out",
        }}
      >
        <div
          style={{
            ...CHART_TOOLTIP_CONTENT_STYLE,
            padding: "8px 12px",
            whiteSpace: "nowrap",
            transform: "translate(-50%, -100%)",
          }}
        >
          {displayPoint && (
            <>
              <p style={CHART_TOOLTIP_LABEL_STYLE}>
                {displayPoint.label}
              </p>
              <p>
                {t("tooltip", {
                  value: displayPoint.tooltipValue,
                  type: t("types.plays"),
                })}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
