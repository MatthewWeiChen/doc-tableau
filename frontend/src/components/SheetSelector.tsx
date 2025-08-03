import React, { useState, useEffect } from "react";

interface Sheet {
  id: number;
  title: string;
  index: number;
}

interface SheetInfo {
  title: string;
  sheets: Sheet[];
}

interface SheetSelectorProps {
  sheetId: string;
  selectedSheet: string;
  onSheetChange: (sheetName: string) => void;
  disabled?: boolean;
}

const SheetSelector: React.FC<SheetSelectorProps> = ({
  sheetId,
  selectedSheet,
  onSheetChange,
  disabled = false,
}) => {
  const [sheetInfo, setSheetInfo] = useState<SheetInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sheetId) {
      fetchSheetInfo();
    }
  }, [sheetId]);

  const fetchSheetInfo = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/data/sheet-info/${sheetId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch sheet info");
      }

      const info = await response.json();
      setSheetInfo(info);

      // Auto-select first sheet if none selected
      if (!selectedSheet && info.sheets.length > 0) {
        onSheetChange(info.sheets[0].title);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sheets");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sheet Selection
        </label>
        <div className="flex items-center text-sm text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
          Loading sheets...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sheet Selection
        </label>
        <div className="text-sm text-red-600">{error}</div>
      </div>
    );
  }

  if (!sheetInfo || sheetInfo.sheets.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Sheet Tab
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {sheetInfo.sheets.map((sheet) => (
          <button
            key={sheet.id}
            onClick={() => onSheetChange(sheet.title)}
            disabled={disabled}
            className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
              selectedSheet === sheet.title
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            📋 {sheet.title}
          </button>
        ))}
      </div>
      {sheetInfo.title && (
        <p className="text-xs text-gray-500 mt-2">
          Spreadsheet: {sheetInfo.title}
        </p>
      )}
    </div>
  );
};

export default SheetSelector;
