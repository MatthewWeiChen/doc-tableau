import React from "react";
import { ResponsiveContainer } from "recharts";

interface AdvancedChartsProps {
  title: string;
  data: any[];
  chartType: "streamgraph" | "spiral" | "heatmap" | "treemap";
  xKey?: string;
  yKey?: string;
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

export const AdvancedCharts: React.FC<AdvancedChartsProps> = ({
  title,
  data,
  chartType,
  xKey,
  yKey,
  className = "",
}) => {
  // ... rest of the component stays exactly the same
  const keys = Object.keys(data[0] || {});
  const autoXKey = xKey || keys[0];
  const autoYKey =
    yKey || keys.find((key) => !isNaN(Number(data[0][key]))) || keys[1];

  const processedData = data
    .slice(0, Math.min(100, data.length))
    .map((item, index) => ({
      ...item,
      index,
      value: isNaN(Number(item[autoYKey]))
        ? Math.random() * 100
        : Number(item[autoYKey]),
      category: item[autoXKey],
    }));

  // ... rest of the render methods stay the same

  const renderStreamGraph = () => {
    const maxValue = Math.max(...processedData.map((d) => d.value));

    return (
      <div className="relative h-full w-full overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 400 300">
          {processedData.map((item, index) => {
            const height = (item.value / maxValue) * 200;
            const y = 150 - height / 2;
            const x = (index / processedData.length) * 380 + 10;
            const width = 380 / processedData.length - 2;

            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={COLORS[index % COLORS.length]}
                  opacity={0.7}
                  rx={2}
                />
                <text
                  x={x + width / 2}
                  y={280}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#666"
                  transform={`rotate(-45 ${x + width / 2} 280)`}
                >
                  {item.category}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  const renderSpiralPlot = () => {
    const centerX = 200;
    const centerY = 150;
    const maxRadius = 120;

    return (
      <div className="relative h-full w-full overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 400 300">
          {processedData.map((item, index) => {
            const angle = (index / processedData.length) * Math.PI * 4; // 2 full rotations
            const radius = (index / processedData.length) * maxRadius;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            const size = Math.max(
              3,
              (item.value / Math.max(...processedData.map((d) => d.value))) * 15
            );

            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r={size}
                  fill={COLORS[index % COLORS.length]}
                  opacity={0.8}
                />
                <text
                  x={x}
                  y={y - size - 5}
                  textAnchor="middle"
                  fontSize="8"
                  fill="#666"
                >
                  {item.value.toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* Spiral guide line */}
          <path
            d={`M ${centerX} ${centerY} ${Array.from(
              { length: 100 },
              (_, i) => {
                const angle = (i / 100) * Math.PI * 4;
                const radius = (i / 100) * maxRadius;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                return `L ${x} ${y}`;
              }
            ).join(" ")}`}
            fill="none"
            stroke="#ddd"
            strokeWidth="1"
            opacity={0.5}
          />
        </svg>
      </div>
    );
  };

  const renderHeatmap = () => {
    const rows = Math.ceil(Math.sqrt(processedData.length));
    const cols = Math.ceil(processedData.length / rows);
    const cellWidth = 380 / cols;
    const cellHeight = 280 / rows;
    const maxValue = Math.max(...processedData.map((d) => d.value));

    return (
      <div className="relative h-full w-full overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 400 300">
          {processedData.map((item, index) => {
            const row = Math.floor(index / cols);
            const col = index % cols;
            const x = col * cellWidth + 10;
            const y = row * cellHeight + 10;
            const intensity = item.value / maxValue;
            const color = `hsl(${240 - intensity * 120}, 70%, ${
              50 + intensity * 30
            }%)`;

            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={cellWidth - 2}
                  height={cellHeight - 2}
                  fill={color}
                  stroke="#fff"
                  strokeWidth="1"
                />
                <text
                  x={x + cellWidth / 2}
                  y={y + cellHeight / 2}
                  textAnchor="middle"
                  fontSize="8"
                  fill={intensity > 0.5 ? "white" : "black"}
                  dominantBaseline="middle"
                >
                  {item.value.toFixed(0)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  const renderTreemap = () => {
    // Simple treemap implementation
    let totalValue = processedData.reduce((sum, item) => sum + item.value, 0);
    let currentX = 10;
    let currentY = 10;
    let remainingWidth = 380;
    let remainingHeight = 280;

    const rects = processedData.map((item, index) => {
      const proportion = item.value / totalValue;
      const area = proportion * (380 * 280);

      // Simple layout algorithm
      let width, height;
      if (remainingWidth > remainingHeight) {
        width = Math.min(
          remainingWidth,
          Math.sqrt(area * (remainingWidth / remainingHeight))
        );
        height = area / width;
      } else {
        height = Math.min(
          remainingHeight,
          Math.sqrt(area * (remainingHeight / remainingWidth))
        );
        width = area / height;
      }

      const rect = {
        x: currentX,
        y: currentY,
        width: Math.max(20, width),
        height: Math.max(20, height),
        value: item.value,
        category: item.category,
        color: COLORS[index % COLORS.length],
      };

      // Update position for next rectangle
      if (currentX + width < 380) {
        currentX += width;
        remainingWidth -= width;
      } else {
        currentY += height;
        currentX = 10;
        remainingHeight -= height;
        remainingWidth = 380;
      }

      return rect;
    });

    return (
      <div className="relative h-full w-full overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 400 300">
          {rects.map((rect, index) => (
            <g key={index}>
              <rect
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={rect.height}
                fill={rect.color}
                stroke="#fff"
                strokeWidth="1"
                opacity={0.8}
              />
              {rect.width > 30 && rect.height > 20 && (
                <text
                  x={rect.x + rect.width / 2}
                  y={rect.y + rect.height / 2}
                  textAnchor="middle"
                  fontSize="10"
                  fill="white"
                  dominantBaseline="middle"
                >
                  {rect.category.length > 8
                    ? rect.category.substring(0, 8) + "..."
                    : rect.category}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    );
  };

  const renderChart = () => {
    switch (chartType) {
      case "streamgraph":
        return renderStreamGraph();
      case "spiral":
        return renderSpiralPlot();
      case "heatmap":
        return renderHeatmap();
      case "treemap":
        return renderTreemap();
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            Chart type not supported
          </div>
        );
    }
  };

  return (
    <div
      className={`bg-white shadow-lg rounded-lg overflow-hidden ${className}`}
    >
      <div className="px-4 py-3 sm:px-6 border-b border-gray-200">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate">
          {title}
        </h3>
      </div>
      <div className="p-4">
        <div className="h-64 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
