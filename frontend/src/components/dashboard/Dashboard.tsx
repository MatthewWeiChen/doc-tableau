import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { ChartContainer } from "../charts/ChartContainer.tsx";

interface SheetData {
  headers: string[];
  data: any[];
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [sheetId, setSheetId] = useState(
    "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
  );
  const [data, setData] = useState<SheetData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    if (!sheetId) return;

    setLoading(true);
    setError("");

    try {
      console.log("🔍 Fetching data for sheet ID:", sheetId);

      const response = await fetch(`/api/data/sheet/${sheetId}`);

      console.log("📡 Response status:", response.status);
      console.log("📡 Response headers:", response.headers);

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response has content
      const text = await response.text();
      console.log("📡 Raw response:", text);

      if (!text) {
        throw new Error("Empty response from server");
      }

      // Try to parse JSON
      const result = JSON.parse(text);
      console.log("✅ Parsed data:", result);

      setData(result);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Add a simple test function
  const testBackend = async () => {
    try {
      console.log("🧪 Testing backend connection...");

      const response = await fetch("/api/data/test");
      console.log("Test response status:", response.status);

      const text = await response.text();
      console.log("Test raw response:", text);

      const data = JSON.parse(text);
      console.log("Test parsed data:", data);

      setData(data);
      setError("Backend test successful!");
    } catch (err) {
      console.error("Backend test failed:", err);
      setError(`Backend test failed: ${err}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with some user info*/}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              📊 Analytics Dashboard
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

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Data Source Input */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Data Source
          </h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter Google Sheet ID"
              value={sheetId}
              onChange={(e) => setSheetId(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={fetchData}
              disabled={loading || !sheetId}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load Data"}
            </button>
            <button
              onClick={testBackend}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Test Backend
            </button>
          </div>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() =>
                setSheetId("1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms")
              }
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Sample Sales Data
            </button>
            <button
              onClick={() => setSheetId("users-data-2024")}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              User Data
            </button>
            <button
              onClick={() => setSheetId("financial-q1-q2")}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Financial Data
            </button>
          </div>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>

        {/* Dashboard Content */}
        {data && (
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
        )}
      </div>
    </div>
  );
};

export default Dashboard;
