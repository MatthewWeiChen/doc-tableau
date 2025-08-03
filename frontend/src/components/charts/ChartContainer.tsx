import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Brush,
} from "recharts";
import ChartControls, { ChartSettings } from "../ChartControls.tsx";

interface ChartContainerProps {
  title: string;
  data: any[];
  chartType: "bar" | "line" | "pie" | "area" | "scatter" | "bubble";
  xKey?: string;
  yKey?: string;
  zKey?: string;
  className?: string;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF7C7C",
];

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  data,
  chartType,
  xKey,
  yKey,
  zKey,
  className = "",
}) => {
  const keys = Object.keys(data[0] || {});
  const autoXKey = xKey || keys[0];
  const autoYKey =
    yKey || keys.find((key) => !isNaN(Number(data[0][key]))) || keys[1];

  const [chartSettings, setChartSettings] = useState<ChartSettings>({
    viewMode: data.length > 100 ? "sample" : "all",
    sampleSize: 100,
    aggregateBy: autoXKey,
    aggregateFunction: "sum",
    showTrendline: false,
    enableZoom: data.length > 200,
  });

  // Smart data processing based on settings
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    let result = [...data];

    switch (chartSettings.viewMode) {
      case "sample":
        if (data.length > chartSettings.sampleSize) {
          // Intelligent sampling - keep first, last, and evenly distributed points
          const step = Math.floor(data.length / (chartSettings.sampleSize - 2));
          result = [
            data[0], // Always include first
            ...data.filter(
              (_, index) =>
                index % step === 0 && index !== 0 && index !== data.length - 1
            ),
            data[data.length - 1], // Always include last
          ].slice(0, chartSettings.sampleSize);
        }
        break;

      case "aggregate":
        // Group by specified column and aggregate
        const grouped = data.reduce((acc, item) => {
          const key = String(item[chartSettings.aggregateBy]);
          if (!acc[key]) {
            acc[key] = {
              [chartSettings.aggregateBy]: key,
              values: [],
              count: 0,
            };
          }
          acc[key].values.push(Number(item[autoYKey]) || 0);
          acc[key].count++;
          return acc;
        }, {} as Record<string, any>);

        result = Object.values(grouped).map((group: any) => {
          let aggregatedValue;
          switch (chartSettings.aggregateFunction) {
            case "sum":
              aggregatedValue = group.values.reduce(
                (sum: number, val: number) => sum + val,
                0
              );
              break;
            case "avg":
              aggregatedValue =
                group.values.reduce(
                  (sum: number, val: number) => sum + val,
                  0
                ) / group.values.length;
              break;
            case "count":
              aggregatedValue = group.count;
              break;
            case "max":
              aggregatedValue = Math.max(...group.values);
              break;
            case "min":
              aggregatedValue = Math.min(...group.values);
              break;
            default:
              aggregatedValue = group.values.reduce(
                (sum: number, val: number) => sum + val,
                0
              );
          }

          return {
            [chartSettings.aggregateBy]: group[chartSettings.aggregateBy],
            [autoYKey]: aggregatedValue,
            _count: group.count,
            _originalValues: group.values,
          };
        });
        break;

      case "all":
        // Use all data - may impact performance but user requested it
        result = data;
        break;
    }

    // Ensure numeric values
    return result.map((item, index) => ({
      ...item,
      index,
      [autoYKey]: isNaN(Number(item[autoYKey])) ? 0 : Number(item[autoYKey]),
    }));
  }, [data, chartSettings, autoXKey, autoYKey]);

  // Calculate trendline if enabled
  const trendlineData = useMemo(() => {
    if (!chartSettings.showTrendline || chartType === "pie") return null;

    const validData = processedData.filter((item) => !isNaN(item[autoYKey]));
    if (validData.length < 2) return null;

    // Simple linear regression
    const n = validData.length;
    const sumX = validData.reduce((sum, _, i) => sum + i, 0);
    const sumY = validData.reduce((sum, item) => sum + item[autoYKey], 0);
    const sumXY = validData.reduce(
      (sum, item, i) => sum + i * item[autoYKey],
      0
    );
    const sumXX = validData.reduce((sum, _, i) => sum + i * i, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return validData.map((_, i) => ({
      index: i,
      trendValue: slope * i + intercept,
    }));
  }, [processedData, chartSettings.showTrendline, autoYKey, chartType]);

  const renderChart = () => {
    const commonProps = {
      data: processedData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    // Fix XAxis props - remove conflicting properties
    const getXAxisProps = () => {
      const baseProps = {
        dataKey: autoXKey,
        tick: { fontSize: 12 },
      };

      // Only add interval for charts with many data points
      if (chartSettings.viewMode === "all" && processedData.length > 50) {
        return {
          ...baseProps,
          interval: Math.ceil(processedData.length / 20),
          angle: -45,
          textAnchor: "end" as const,
          height: 60,
        };
      }

      return baseProps;
    };

    const customTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
          <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
            <p className="font-medium">{`${autoXKey}: ${label}`}</p>
            <p className="text-indigo-600">{`${autoYKey}: ${payload[0].value}`}</p>
            {data._count && (
              <p className="text-sm text-gray-500">{`Count: ${data._count}`}</p>
            )}
            {chartSettings.viewMode === "aggregate" && data._originalValues && (
              <p className="text-xs text-gray-400">
                Raw values: {data._originalValues.slice(0, 3).join(", ")}
                {data._originalValues.length > 3 && "..."}
              </p>
            )}
          </div>
        );
      }
      return null;
    };

    switch (chartType) {
      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis {...getXAxisProps()} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={customTooltip} />
            <Legend />
            <Bar dataKey={autoYKey} fill="#3B82F6" radius={[2, 2, 0, 0]} />
            {chartSettings.enableZoom && processedData.length > 20 && (
              <Brush dataKey={autoXKey} height={30} stroke="#8884d8" />
            )}
          </BarChart>
        );

      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis {...getXAxisProps()} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={customTooltip} />
            <Legend />
            <Line
              type="monotone"
              dataKey={autoYKey}
              stroke="#10B981"
              strokeWidth={2}
              dot={
                processedData.length <= 50
                  ? { fill: "#10B981", strokeWidth: 2, r: 3 }
                  : false
              }
              connectNulls={false}
            />
            {chartSettings.showTrendline && trendlineData && (
              <Line
                data={trendlineData}
                type="monotone"
                dataKey="trendValue"
                stroke="#EF4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            )}
            {chartSettings.enableZoom && processedData.length > 20 && (
              <Brush dataKey={autoXKey} height={30} stroke="#8884d8" />
            )}
          </LineChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis {...getXAxisProps()} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={customTooltip} />
            <Legend />
            <Area
              type="monotone"
              dataKey={autoYKey}
              stroke="#8B5CF6"
              fill="#8B5CF6"
              fillOpacity={0.3}
            />
            {chartSettings.enableZoom && processedData.length > 20 && (
              <Brush dataKey={autoXKey} height={30} stroke="#8884d8" />
            )}
          </AreaChart>
        );

      case "scatter":
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={autoXKey} tick={{ fontSize: 12 }} type="category" />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={customTooltip} />
            <Legend />
            <Scatter dataKey={autoYKey} fill="#F59E0B" />
          </ScatterChart>
        );

      case "bubble":
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={autoXKey} tick={{ fontSize: 12 }} type="category" />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={customTooltip} />
            <Legend />
            <Scatter dataKey={autoYKey} fill="#EF4444" />
          </ScatterChart>
        );

      case "pie":
        // For pie charts, limit to top categories
        const topData = processedData
          .sort((a, b) => Number(b[autoYKey]) - Number(a[autoYKey]))
          .slice(0, 15);

        return (
          <PieChart>
            <Pie
              data={topData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(1)}%`
              }
              outerRadius="80%"
              fill="#8884d8"
              dataKey={autoYKey}
              nameKey={autoXKey}
            >
              {topData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={customTooltip} />
          </PieChart>
        );

      default:
        return <div>Chart type not supported</div>;
    }
  };
  const getDataSummary = () => {
    const original = data.length;
    const displayed = processedData.length;

    switch (chartSettings.viewMode) {
      case "sample":
        return `Showing ${displayed} sampled points from ${original.toLocaleString()} total`;
      case "aggregate":
        return `Showing ${displayed} groups aggregated from ${original.toLocaleString()} rows`;
      case "all":
        return `Showing all ${original.toLocaleString()} data points`;
      default:
        return `${displayed} points`;
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className={`bg-white shadow rounded-lg p-4 sm:p-6 ${className}`}>
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white shadow-lg rounded-lg overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="px-4 py-3 sm:px-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate">
            {title}
          </h3>
          <span className="text-xs text-gray-500">{getDataSummary()}</span>
        </div>
      </div>

      {/* Chart Controls */}
      <ChartControls
        totalRows={data.length}
        onSettingsChange={setChartSettings}
        headers={Object.keys(data[0] || {})}
        currentSettings={chartSettings}
      />

      {/* Chart */}
      <div className="p-4">
        <div className="h-64 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Warning */}
      {chartSettings.viewMode === "all" && data.length > 500 && (
        <div className="px-4 py-2 bg-yellow-50 border-t border-yellow-200">
          <p className="text-xs text-yellow-800">
            ⚠️ Displaying all {data.length.toLocaleString()} points may impact
            performance. Consider using "Smart Sample" or "Aggregate" modes for
            better performance.
          </p>
        </div>
      )}
    </div>
  );
};
