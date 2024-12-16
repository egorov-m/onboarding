import React from "react";
import {
  FunnelChart,
  Funnel,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import * as styles from "./FunnelChart.styles";

interface FunnelChartProps {
  data: {
    name: string;
    value: number;
    percentage: number;
  }[];
}

export const CustomFunnelChart: React.FC<FunnelChartProps> = ({ data }) => {
  const chartData = data
    .map((item, index) => ({
      ...item,
      percentage: Math.round(item.percentage * 10) / 10,
      fill: `hsl(${Math.round((item.percentage / 100) * 120)}, 70%, 50%)`,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  return (
    <ResponsiveContainer width='100%' height={200}>
      <FunnelChart>
        <Tooltip
          formatter={(value: number) => `${value} users`}
          contentStyle={{
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />
        <Funnel
          dataKey='value'
          data={chartData}
          isAnimationActive
          animationDuration={1000}
          animationBegin={300}
        >
          <LabelList
            dataKey='percentage'
            position='right'
            content={({ value, x, y }) => (
              <styles.StyledLabel x={x} y={typeof y === "number" ? y + 20 : 0}>
                {value}%
              </styles.StyledLabel>
            )}
          />
        </Funnel>
      </FunnelChart>
    </ResponsiveContainer>
  );
};
