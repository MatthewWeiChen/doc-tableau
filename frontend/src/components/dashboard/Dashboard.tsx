import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { useDashboard } from "../../contexts/DashboardContext.tsx";
import { ChartContainer } from "../charts/ChartContainer.tsx";
import DashboardSidebar from "../DashboardSidebar.tsx";
import SheetSelector from "../SheetSelector.tsx";
import ChartConfigurator from "../ChartConfigurator.tsx";
import { AdvancedCharts } from "../AdvancedCharts.tsx";
import { ChartConfig } from "../../types/charts.ts";
import PaginatedDataTable from "../PaginatedDataTable.tsx";

interface SheetData {
  headers: string[];
  data: any[];
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { currentDashboard } = useDashboard();
  const [data, setData] = useState<SheetData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSheet, setSelectedSheet] = useState("");
  const [charts, setCharts] = useState<ChartConfig[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Default charts when data loads
  useEffect(() => {
    if (data && data.headers.length > 0 && charts.length === 0) {
      const defaultCharts: ChartConfig[] = [
        {
          id: "1",
          title: "Overview Bar Chart",
          type: "bar",
          xKey: data.headers[0],
          yKey: data.headers[1] || data.headers[0],
        },
        {
          id: "2",
          title: "Trend Line Chart",
          type: "line",
          xKey: data.headers[0],
          yKey: data.headers[1] || data.headers[0],
        },
      ];
      setCharts(defaultCharts);
    }
  }, [charts.length, data]);

  // Load data when currentDashboard or selectedSheet changes
  useEffect(() => {
    if (currentDashboard && selectedSheet) {
      fetchDataForDashboard(currentDashboard.sheetId, selectedSheet);
    }
  }, [currentDashboard, selectedSheet]);

  // Reset selected sheet when dashboard changes
  useEffect(() => {
    if (currentDashboard) {
      setSelectedSheet("");
      setCharts([]); // Reset charts when switching dashboards
    }
  }, [currentDashboard]);

  const fetchDataForDashboard = async (sheetId: string, sheetName: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/data/sheet/${sheetId}?sheetName=${encodeURIComponent(sheetName)}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch data");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshData = () => {
    if (currentDashboard && selectedSheet) {
      fetchDataForDashboard(currentDashboard.sheetId, selectedSheet);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-30 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <DashboardSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <h1 className="ml-2 lg:ml-0 text-lg sm:text-xl font-semibold text-gray-900 truncate">
                  📊{" "}
                  {currentDashboard
                    ? currentDashboard.title
                    : "Analytics Dashboard"}
                </h1>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <span className="hidden sm:block text-sm text-gray-600">
                  Welcome, {user?.name}!
                </span>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Dashboard Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-hidden">
          {!currentDashboard ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to Your Analytics Dashboard! 🚀
              </h2>
              <p className="text-gray-600 mb-8">
                Create your first dashboard to get started with data
                visualization.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Sheet Selection */}
              <div className="bg-white shadow rounded-lg p-4 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Data Source Configuration
                </h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Sheet ID
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="text"
                      value={currentDashboard.sheetId}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 text-sm"
                    />
                    <button
                      onClick={handleRefreshData}
                      disabled={loading || !selectedSheet}
                      className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors whitespace-nowrap"
                    >
                      {loading ? "Loading..." : "🔄 Refresh"}
                    </button>
                  </div>
                </div>

                <SheetSelector
                  sheetId={currentDashboard.sheetId}
                  selectedSheet={selectedSheet}
                  onSheetChange={setSelectedSheet}
                  disabled={loading}
                />

                {selectedSheet && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-700">
                      ✅ Currently viewing: <strong>{selectedSheet}</strong>
                    </p>
                  </div>
                )}
              </div>

              {/* Chart Configuration */}
              {data && data.headers.length > 0 && (
                <ChartConfigurator
                  headers={data.headers}
                  charts={charts}
                  onChartsChange={setCharts}
                />
              )}

              {/* Loading State */}
              {loading && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">
                    Loading data from "{selectedSheet}"...
                  </p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="text-center py-12">
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={handleRefreshData}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Dashboard Data Display */}
              {data && !loading && (
                <div className="space-y-6">
                  {/* Stats Overview */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-4 sm:p-5">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <span className="text-white text-sm">📊</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-500">
                              Records
                            </p>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">
                              {data.data.length}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-4 sm:p-5">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <span className="text-white text-sm">📈</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-500">
                              Columns
                            </p>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">
                              {data.headers.length}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-4 sm:p-5">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <span className="text-white text-sm">📋</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-500">
                              Sheet
                            </p>
                            <p className="text-sm sm:text-lg font-bold text-gray-900 truncate">
                              {selectedSheet}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-4 sm:p-5">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <span className="text-white text-sm">📊</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-500">
                              Charts
                            </p>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">
                              {charts.length}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Charts Grid - Responsive */}

                  {charts.length > 0 && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      {charts.map((chart) => {
                        // Use AdvancedCharts for special chart types
                        if (
                          [
                            "streamgraph",
                            "spiral",
                            "heatmap",
                            "treemap",
                          ].includes(chart.type)
                        ) {
                          return (
                            <AdvancedCharts
                              key={chart.id}
                              title={chart.title}
                              data={data.data}
                              chartType={
                                chart.type as
                                  | "streamgraph"
                                  | "spiral"
                                  | "heatmap"
                                  | "treemap"
                              }
                              xKey={chart.xKey}
                              yKey={chart.yKey}
                              className="w-full"
                            />
                          );
                        }

                        // Use regular ChartContainer for standard charts
                        return (
                          <ChartContainer
                            key={chart.id}
                            title={chart.title}
                            data={data.data}
                            chartType={
                              chart.type as
                                | "bar"
                                | "line"
                                | "pie"
                                | "area"
                                | "scatter"
                                | "bubble"
                            }
                            xKey={chart.xKey}
                            yKey={chart.yKey}
                            zKey={chart.zKey}
                            className="w-full"
                          />
                        );
                      })}
                    </div>
                  )}
                  {/* Data Table - Responsive */}
                  {data && !loading && (
                    <PaginatedDataTable
                      data={data.data}
                      headers={data.headers}
                      title={`${selectedSheet} - Data Table`}
                      itemsPerPage={25}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
