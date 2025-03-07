import React from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface BarChartProps {
  data: {
    month: string;
    borrows: number;
    returns: number;
  }[];
}

export const BarChart = ({ data }: BarChartProps) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f0f0f0"
          />
          <XAxis
            dataKey="month"
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
          <Bar
            dataKey="borrows"
            fill="#3B82F6"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
          <Bar
            dataKey="returns"
            fill="#F97316"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}; 