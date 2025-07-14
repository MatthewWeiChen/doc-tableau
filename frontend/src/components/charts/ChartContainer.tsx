import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartContainerProps {
  title: string;
  data: any[];
  chartType: "bar" | "line" | "pie";
  xKey?: string;
  yKey?: string;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  data,
  chartType,
  xKey,
  yKey,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Auto-detect keys if not provided
  const keys = Object.keys(data[0]);
  const autoXKey = xKey || keys[0];
  const autoYKey =
    yKey || keys.find((key) => !isNaN(Number(data[0][key]))) || keys[1];

  const processedData = data.slice(0, 10); // Limit for better visualization

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <BarChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={autoXKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={autoYKey} fill="#8884d8" />
          </BarChart>
        );

      case "line":
        return (
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={autoXKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={autoYKey}
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        );

      case "pie":
        return (
          <PieChart>
            <Pie
              data={processedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey={autoYKey}
              nameKey={autoXKey}
            >
              {processedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );

      default:
        return <div>Chart type not supported</div>;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
