import React, { useState } from "react";
import { useDashboard } from "../contexts/DashboardContext.tsx";

const DashboardSidebar: React.FC = () => {
  const {
    dashboards,
    currentDashboard,
    loading,
    error,
    createDashboard,
    deleteDashboard,
    setCurrentDashboard,
  } = useDashboard();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDashboardTitle, setNewDashboardTitle] = useState("");
  const [newDashboardDescription, setNewDashboardDescription] = useState("");
  const [newDashboardSheetId, setNewDashboardSheetId] = useState(
    "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
  );
  const [createLoading, setCreateLoading] = useState(false);

  const handleCreateDashboard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDashboardTitle.trim() || !newDashboardSheetId.trim()) return;

    setCreateLoading(true);
    try {
      const dashboard = await createDashboard(
        newDashboardTitle.trim(),
        newDashboardDescription.trim(),
        newDashboardSheetId.trim(),
        "Sheet1"
      );

      setCurrentDashboard(dashboard);
      setShowCreateForm(false);
      setNewDashboardTitle("");
      setNewDashboardDescription("");
      setNewDashboardSheetId("1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms");
    } catch (err) {
      console.error("Failed to create dashboard:", err);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteDashboard = async (
    dashboardId: string,
    dashboardTitle: string
  ) => {
    if (
      window.confirm(`Are you sure you want to delete "${dashboardTitle}"?`)
    ) {
      try {
        await deleteDashboard(dashboardId);
      } catch (err) {
        console.error("Failed to delete dashboard:", err);
      }
    }
  };

  return (
    <div className="w-80 bg-white shadow-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">My Dashboards</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="mt-2 w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          + Create New Dashboard
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <form onSubmit={handleCreateDashboard} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={newDashboardTitle}
                onChange={(e) => setNewDashboardTitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="My Dashboard"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={newDashboardDescription}
                onChange={(e) => setNewDashboardDescription(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Dashboard description..."
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Google Sheet ID
              </label>
              <input
                type="text"
                value={newDashboardSheetId}
                onChange={(e) => setNewDashboardSheetId(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Sheet ID"
                required
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={createLoading}
                className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {createLoading ? "Creating..." : "Create"}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Dashboard List */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="p-4 text-center text-gray-500">
            Loading dashboards...
          </div>
        )}

        {error && <div className="p-4 text-center text-red-600">{error}</div>}

        {!loading && dashboards.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No dashboards yet. Create your first one!
          </div>
        )}

        {dashboards.map((dashboard) => (
          <div
            key={dashboard.id}
            className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
              currentDashboard?.id === dashboard.id
                ? "bg-indigo-50 border-l-4 border-l-indigo-600"
                : ""
            }`}
            onClick={() => setCurrentDashboard(dashboard)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 truncate">
                  {dashboard.title}
                </h3>
                {dashboard.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {dashboard.description}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Updated {new Date(dashboard.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteDashboard(dashboard.id, dashboard.title);
                }}
                className="ml-2 text-red-600 hover:text-red-800 text-sm"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSidebar;
