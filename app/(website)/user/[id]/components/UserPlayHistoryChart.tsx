import Cookies from "js-cookie";
import {
  CartesianGrid,
  Line,
  LineChart,
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

export default function UserPlayHistoryChart({ data }: Props) {
  const t = useT("pages.user.components.statsChart");

  const locale = Cookies.get("locale") || "en";

  if (data.snapshots.length === 0)
    return null;

  const firstDate = new Date(data.snapshots[0].saved_at);
  const lastDate = new Date(data.snapshots.at(-1)!.saved_at);

  let { snapshots } = data;

  for (let date = firstDate; date <= lastDate; date.setMonth(date.getMonth() + 1)) {
    const dateString = date.toLocaleString(locale, { year: "numeric", month: "short" });
    if (!snapshots.some(s => new Date(s.saved_at).toLocaleString(locale, { year: "numeric", month: "short" }) === dateString)) {
      snapshots.push({
        saved_at: date.toISOString(),
        play_count: 0,
      });
    }
  }

  snapshots = snapshots.sort((b, a) => new Date(b.saved_at).getTime() - new Date(a.saved_at).getTime());

  const chartData = snapshots.map((s) => {
    return {
      date: new Date(s.saved_at).toLocaleString(locale, { year: "numeric", month: "short" }),
      play_count: s.play_count,
    };
  });

  const leewayForDomain = 10;

  const isSingleMonthDataPoint = chartData.length === 1;

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      className="h-52 max-h-52 min-h-52"
    >
      <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 40, left: 0 }}>
        <CartesianGrid stroke={CHART_GRID_STROKE} strokeOpacity={CHART_GRID_STROKE_OPACITY} vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={60}
          stroke={CHART_AXIS_STROKE}
        />
        <YAxis
          type="number"
          tickFormatter={(value: number) => {
            return (Math.round(value / 10) * 10).toString();
          }}
          domain={[
            (dataMin: number) => Math.floor(Math.max(0, dataMin - leewayForDomain) / 10) * 10,
            (dataMax: number) => Math.ceil((dataMax + leewayForDomain) / 10) * 10,
          ]}
          stroke={CHART_AXIS_STROKE}
          tick={{ fontSize: 12 }}
        />

        <Line
          dataKey="play_count"
          stroke="#8DA3B9"
          strokeWidth={2}
          dot={{ fill: "#8DA3B9", strokeWidth: 1, r: isSingleMonthDataPoint ? 2 : 0 }}
          activeDot={{ r: 6 }}
          isAnimationActive={false}
        />

        <Tooltip
          formatter={value => [
            t("tooltip", {
              value: Math.round(value as number),
              type: t("types.plays"),
            }),
          ]}
          contentStyle={CHART_TOOLTIP_CONTENT_STYLE}
          labelStyle={CHART_TOOLTIP_LABEL_STYLE}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
