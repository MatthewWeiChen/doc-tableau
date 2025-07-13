import { useState, useCallback } from "react";
import axios from "axios";

export interface SheetData {
  headers: string[];
  data: any[];
}

export interface SheetInfo {
  title: string;
  sheets: Array<{
    id: number;
    title: string;
  }>;
}

export const useData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSheetData = useCallback(
    async (sheetId: string, range?: string): Promise<SheetData> => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/data/sheet/${sheetId}`,
          {
            params: range ? { range } : undefined,
          }
        );

        return response.data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || "Failed to fetch sheet data";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchSheetInfo = useCallback(
    async (sheetId: string): Promise<SheetInfo> => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/data/sheet-info/${sheetId}`
        );

        return response.data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || "Failed to fetch sheet info";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    fetchSheetData,
    fetchSheetInfo,
    clearError,
  };
};
