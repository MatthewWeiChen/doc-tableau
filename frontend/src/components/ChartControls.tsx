import React, { useState } from "react";

interface ChartControlsProps {
  totalRows: number;
  onSettingsChange: (settings: ChartSettings) => void;
  headers: string[];
  currentSettings: ChartSettings;
}

export interface ChartSettings {
  viewMode: "sample" | "aggregate" | "all";
  sampleSize: number;
  aggregateBy: string;
  aggregateFunction: "sum" | "avg" | "count" | "max" | "min";
  timeRange?: { start: number; end: number };
  showTrendline: boolean;
  enableZoom: boolean;
}

const ChartControls: React.FC<ChartControlsProps> = ({
  totalRows,
  onSettingsChange,
  headers,
  currentSettings,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSettingChange = (key: keyof ChartSettings, value: any) => {
    onSettingsChange({
      ...currentSettings,
      [key]: value,
    });
  };

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Data View:</span>

          {/* View Mode Toggle */}
          <div className="flex rounded-md shadow-sm">
            {[
              { key: "sample", label: "Smart Sample", icon: "🎯" },
              { key: "aggregate", label: "Aggregate", icon: "📊" },
              { key: "all", label: "All Data", icon: "🔍" },
            ].map((mode) => (
              <button
                key={mode.key}
                onClick={() => handleSettingChange("viewMode", mode.key)}
                className={`px-3 py-2 text-xs font-medium border ${
                  currentSettings.viewMode === mode.key
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                } ${
                  mode.key === "sample"
                    ? "rounded-l-md"
                    : mode.key === "all"
                    ? "rounded-r-md"
                    : ""
                }`}
              >
                {mode.icon} {mode.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-gray-500">
            {totalRows.toLocaleString()} total rows
          </span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          {isExpanded ? "Less Options ▲" : "More Options ▼"}
        </button>
      </div>

      {/* Expanded Controls */}
      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Sample Size */}
          {currentSettings.viewMode === "sample" && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Sample Size
              </label>
              <select
                value={currentSettings.sampleSize}
                onChange={(e) =>
                  handleSettingChange("sampleSize", Number(e.target.value))
                }
                className="w-full text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value={50}>50 points</option>
                <option value={100}>100 points</option>
                <option value={200}>200 points</option>
                <option value={500}>500 points</option>
              </select>
            </div>
          )}

          {/* Aggregation Settings */}
          {currentSettings.viewMode === "aggregate" && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Group By
                </label>
                <select
                  value={currentSettings.aggregateBy}
                  onChange={(e) =>
                    handleSettingChange("aggregateBy", e.target.value)
                  }
                  className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                >
                  {headers.map((header) => (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Function
                </label>
                <select
                  value={currentSettings.aggregateFunction}
                  onChange={(e) =>
                    handleSettingChange("aggregateFunction", e.target.value)
                  }
                  className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="sum">Sum</option>
                  <option value="avg">Average</option>
                  <option value="count">Count</option>
                  <option value="max">Maximum</option>
                  <option value="min">Minimum</option>
                </select>
              </div>
            </>
          )}

          {/* Chart Enhancements */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Enhancements
            </label>
            <div className="space-y-1">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={currentSettings.showTrendline}
                  onChange={(e) =>
                    handleSettingChange("showTrendline", e.target.checked)
                  }
                  className="mr-2 text-indigo-600"
                />
                <span className="text-xs">Trendline</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={currentSettings.enableZoom}
                  onChange={(e) =>
                    handleSettingChange("enableZoom", e.target.checked)
                  }
                  className="mr-2 text-indigo-600"
                />
                <span className="text-xs">Enable Zoom</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartControls;
