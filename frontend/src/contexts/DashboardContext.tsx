import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext.tsx";

interface Dashboard {
  id: string;
  title: string;
  description: string;
  sheetId: string;
  sheetName: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardContextType {
  dashboards: Dashboard[];
  currentDashboard: Dashboard | null;
  loading: boolean;
  error: string | null;
  loadDashboards: () => Promise<void>;
  createDashboard: (
    title: string,
    description: string,
    sheetId: string,
    sheetName?: string
  ) => Promise<Dashboard>;
  updateDashboard: (id: string, updates: Partial<Dashboard>) => Promise<void>;
  deleteDashboard: (id: string) => Promise<void>;
  setCurrentDashboard: (dashboard: Dashboard | null) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({
  children,
}) => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [currentDashboard, setCurrentDashboard] = useState<Dashboard | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const makeAuthenticatedRequest = async (
    url: string,
    options: RequestInit = {}
  ) => {
    if (!token) throw new Error("No authentication token");

    return fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
  };

  const loadDashboards = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await makeAuthenticatedRequest("/api/dashboard");

      if (!response.ok) {
        throw new Error("Failed to load dashboards");
      }

      const data = await response.json();
      setDashboards(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load dashboards"
      );
    } finally {
      setLoading(false);
    }
  };

  const createDashboard = async (
    title: string,
    description: string,
    sheetId: string,
    sheetName = ""
  ) => {
    const response = await makeAuthenticatedRequest("/api/dashboard", {
      method: "POST",
      body: JSON.stringify({ title, description, sheetId, sheetName }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create dashboard");
    }

    const newDashboard = await response.json();
    setDashboards((prev) => [newDashboard, ...prev]);
    return newDashboard;
  };

  const updateDashboard = async (id: string, updates: Partial<Dashboard>) => {
    const response = await makeAuthenticatedRequest(`/api/dashboard/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update dashboard");
    }

    const updatedDashboard = await response.json();
    setDashboards((prev) =>
      prev.map((d) => (d.id === id ? updatedDashboard : d))
    );

    if (currentDashboard?.id === id) {
      setCurrentDashboard(updatedDashboard);
    }
  };

  const deleteDashboard = async (id: string) => {
    const response = await makeAuthenticatedRequest(`/api/dashboard/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete dashboard");
    }

    setDashboards((prev) => prev.filter((d) => d.id !== id));

    if (currentDashboard?.id === id) {
      setCurrentDashboard(null);
    }
  };

  // Load dashboards when token is available
  useEffect(() => {
    if (token) {
      loadDashboards();
    }
  }, [token]);

  const value = {
    dashboards,
    currentDashboard,
    loading,
    error,
    loadDashboards,
    createDashboard,
    updateDashboard,
    deleteDashboard,
    setCurrentDashboard,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
