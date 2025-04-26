"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  CardContent,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type SalesData = {
  month: string;
  sales: number | null;
};

// Months
const allMonths = [
  { month: "January", sales: 0 },
  { month: "February", sales: 0 },
  { month: "March", sales: 0 },
  { month: "April", sales: 0 },
  { month: "May", sales: 0 },
  { month: "June", sales: 0 },
  { month: "July", sales: 0 },
  { month: "August", sales: 0 },
  { month: "September", sales: 0 },
  { month: "October", sales: 0 },
  { month: "November", sales: 0 },
  { month: "December", sales: 0 },
];

// Chart configuration
const chartConfig: ChartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
};

const SalesLineChart = () => {
  const [chartData, setChartData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get<SalesData[]>("https://api.alitaptap.me/api/v1/dashboard/sales");
        const fetchedData = response.data;
  
        // Merge fetched data with default months, setting sales to null if missing
        const updatedChartData: SalesData[] = allMonths.map((monthData) => {
          const found = fetchedData.find((data) => data.month === monthData.month);
          return found ? found : { ...monthData, sales: null }; // Use null to break the line
        });
  
        setChartData(updatedChartData);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSalesData();
  }, []);

  return (
    <CardContent>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
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
              domain={[0, "auto"]} // Auto adjust Y-axis
              tickFormatter={(value) => `₱${value.toLocaleString()}`} // Format currency
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
              type="monotone"
              stroke="#FDDF05"
              strokeWidth={2}
              dot={false}
              connectNulls={false} // This ensures missing months create a gap in the line
            />
          </LineChart>
        </ChartContainer>
      )}
    </CardContent>
  );
};

export default SalesLineChart;
