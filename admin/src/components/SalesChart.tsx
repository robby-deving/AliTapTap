"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Sample sales data
const chartData = [
  { month: "January", sales: 29618 },
  { month: "February", sales: 23407 },
  { month: "March", sales: 8384 },
  { month: "April", sales: 35684 },
  { month: "May", sales: 38524 },
  { month: "June", sales: 32408 },
  { month: "July", sales: 33322 },
  { month: "August", sales: 38842 },
  { month: "September", sales: 1249 },
  { month: "October", sales: 10657 },
  { month: "November", sales: 3767 },
  { month: "December", sales: 32058 },
];

// Chart configuration
const chartConfig: ChartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
};

const SalesLineChart = () => {
  return (
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
            domain={[0, 40000]} // Set Y-axis range
            tickFormatter={(value) => `₱${value.toLocaleString()}`} // Format as pesos
            tickMargin={8}
            axisLine={false}
            tickLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="sales"
              type="linear"
              stroke="#FDDF05"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
  );
};

export default SalesLineChart;
