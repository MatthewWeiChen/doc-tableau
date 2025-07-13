import React, { useState, useEffect } from "react";
import { ChartContainer } from "../charts/ChartContainer";
import { DataTable } from "../charts/DataTable";
import { useData } from "../../hooks/useData";

export interface DashboardData {
  headers: string[];
  data: any[];
}

const Dashboard: React.FC = () => {
  const [sheetId, setSheetId] = useState("");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const { fetchSheetData, loading, error } = useData();

  const handleLoadData = async () => {
    if (!sheetId) return;

    try {
      const data = await fetchSheetData(sheetId);
      setDashboardData(data);
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Analytics Dashboard
          </h1>

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
                onClick={handleLoadData}
                disabled={loading || !sheetId}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load Data"}
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          {/* Dashboard Content */}
          {dashboardData && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <ChartContainer
                  title="Bar Chart"
                  data={dashboardData.data}
                  chartType="bar"
                />
                <ChartContainer
                  title="Line Chart"
                  data={dashboardData.data}
                  chartType="line"
                />
                <ChartContainer
                  title="Pie Chart"
                  data={dashboardData.data}
                  chartType="pie"
                />
                <ChartContainer
                  title="Area Chart"
                  data={dashboardData.data}
                  chartType="area"
                />
              </div>

              <DataTable
                data={dashboardData.data}
                headers={dashboardData.headers}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
