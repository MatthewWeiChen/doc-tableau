import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { useDashboard } from "../../contexts/DashboardContext.tsx";
import { ChartContainer } from "../charts/ChartContainer.tsx";
import DashboardSidebar from "../DashboardSidebar.tsx";

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

  // Load data when currentDashboard changes
  useEffect(() => {
    if (currentDashboard) {
      fetchDataForDashboard(currentDashboard.sheetId);
    }
  }, [currentDashboard]);

  const fetchDataForDashboard = async (sheetId: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/data/sheet/${sheetId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to fetch data");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-semibold text-gray-900">
                📊{" "}
                {currentDashboard
                  ? currentDashboard.title
                  : "Analytics Dashboard"}
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user?.name}!
                </span>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Dashboard Content */}
        <div className="flex-1 p-6">
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
          ) : loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading dashboard data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => fetchDataForDashboard(currentDashboard.sheetId)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Retry
              </button>
            </div>
          ) : data ? (
            <>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm">📊</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Total Records
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {data.data.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm">📈</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Columns
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {data.headers.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm">💰</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Data Quality
                        </p>
                        <p className="text-2xl font-bold text-gray-900">98%</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm">🔄</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Last Updated
                        </p>
                        <p className="text-2xl font-bold text-gray-900">Now</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <ChartContainer
                  title="Bar Chart Overview"
                  data={data.data}
                  chartType="bar"
                />
                <ChartContainer
                  title="Trend Analysis"
                  data={data.data}
                  chartType="line"
                />
                <ChartContainer
                  title="Distribution"
                  data={data.data}
                  chartType="pie"
                />
                <ChartContainer
                  title="Secondary Metrics"
                  data={data.data}
                  chartType="bar"
                  xKey={data.headers[2]}
                  yKey={data.headers[1]}
                />
              </div>

              {/* Data Table */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Data Table ({data.data.length} rows)
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {data.headers.map((header, index) => (
                          <th
                            key={index}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.data.slice(0, 10).map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {data.headers.map((header, colIndex) => (
                            <td
                              key={colIndex}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                            >
                              {row[header]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
