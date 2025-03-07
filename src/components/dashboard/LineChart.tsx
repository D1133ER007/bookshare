import React from "react";
import {
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface LineChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

export const LineChart = ({ data }: LineChartProps) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f0f0f0"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B7280", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B7280", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              background: "white",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: "#3B82F6", strokeWidth: 2 }}
            activeDot={{ r: 8 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}; 