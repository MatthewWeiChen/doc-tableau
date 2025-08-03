import React, { useState } from "react";
import { ChartConfig } from "../types/charts.ts";

interface ChartConfiguratorProps {
  headers: string[];
  charts: ChartConfig[];
  onChartsChange: (charts: ChartConfig[]) => void;
}

const ChartConfigurator: React.FC<ChartConfiguratorProps> = ({
  headers,
  charts,
  onChartsChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingChart, setEditingChart] = useState<ChartConfig | null>(null);

  const chartTypes = [
    {
      value: "bar",
      label: "📊 Bar Chart",
      description: "Compare values across categories",
    },
    {
      value: "line",
      label: "📈 Line Chart",
      description: "Show trends over time",
    },
    {
      value: "area",
      label: "📉 Area Chart",
      description: "Show cumulative values",
    },
    { value: "pie", label: "🥧 Pie Chart", description: "Show proportions" },
    {
      value: "scatter",
      label: "⚫ Scatter Plot",
      description: "Show relationships",
    },
    {
      value: "bubble",
      label: "🫧 Bubble Chart",
      description: "Show 3D relationships",
    },
    {
      value: "streamgraph",
      label: "🌊 Stream Graph",
      description: "Show flow of data",
    },
    {
      value: "spiral",
      label: "🌀 Spiral Plot",
      description: "Show data in spiral pattern",
    },
    {
      value: "heatmap",
      label: "🔥 Heatmap",
      description: "Show data intensity",
    },
    {
      value: "treemap",
      label: "🌳 Treemap",
      description: "Show hierarchical data",
    },
  ];

  const addChart = () => {
    const newChart: ChartConfig = {
      id: Date.now().toString(),
      title: `Chart ${charts.length + 1}`,
      type: "bar",
      xKey: headers[0] || "",
      yKey: headers[1] || "",
      zKey: headers[2] || "",
    };
    setEditingChart(newChart);
    setIsOpen(true);
  };

  const editChart = (chart: ChartConfig) => {
    setEditingChart({ ...chart });
    setIsOpen(true);
  };

  const saveChart = () => {
    if (!editingChart) return;

    const existingIndex = charts.findIndex((c) => c.id === editingChart.id);
    if (existingIndex >= 0) {
      const updatedCharts = [...charts];
      updatedCharts[existingIndex] = editingChart;
      onChartsChange(updatedCharts);
    } else {
      onChartsChange([...charts, editingChart]);
    }

    setEditingChart(null);
    setIsOpen(false);
  };

  const deleteChart = (chartId: string) => {
    onChartsChange(charts.filter((c) => c.id !== chartId));
  };

  // Rest of your component remains the same...
  // (keeping the JSX part exactly as it was)

  if (headers.length === 0) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900 mb-2 sm:mb-0">
          Chart Configuration
        </h2>
        <button
          onClick={addChart}
          className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          + Add Chart
        </button>
      </div>

      {/* Chart List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {charts.map((chart) => (
          <div key={chart.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900 truncate">
                {chart.title}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => editChart(chart)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  ✏️
                </button>
                <button
                  onClick={() => deleteChart(chart.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  🗑️
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {chartTypes.find((t) => t.value === chart.type)?.label}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              X: {chart.xKey} | Y: {chart.yKey}
            </p>
          </div>
        ))}
      </div>

      {/* Chart Editor Modal */}
      {isOpen && editingChart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {charts.find((c) => c.id === editingChart.id)
                ? "Edit Chart"
                : "Add Chart"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chart Title
                </label>
                <input
                  type="text"
                  value={editingChart.title}
                  onChange={(e) =>
                    setEditingChart({ ...editingChart, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chart Type
                </label>
                <select
                  value={editingChart.type}
                  onChange={(e) =>
                    setEditingChart({
                      ...editingChart,
                      type: e.target.value as ChartConfig["type"],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {chartTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {
                    chartTypes.find((t) => t.value === editingChart.type)
                      ?.description
                  }
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  X-Axis (Categories)
                </label>
                <select
                  value={editingChart.xKey}
                  onChange={(e) =>
                    setEditingChart({ ...editingChart, xKey: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {headers.map((header) => (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Y-Axis (Values)
                </label>
                <select
                  value={editingChart.yKey}
                  onChange={(e) =>
                    setEditingChart({ ...editingChart, yKey: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {headers.map((header) => (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </div>

              {editingChart.type === "bubble" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size (Z-Axis)
                  </label>
                  <select
                    value={editingChart.zKey || ""}
                    onChange={(e) =>
                      setEditingChart({ ...editingChart, zKey: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select size column</option>
                    {headers.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={saveChart}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Save Chart
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setEditingChart(null);
                }}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartConfigurator;
