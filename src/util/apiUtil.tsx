import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/auth.context.tsx";

export const useApi = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 403) {
        navigate("/dashboard");
        throw new Error("Permission denied");
      }

      if (response.status === 401) {
        logout();
        navigate("/login");
        throw new Error("Authentication required");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "API request failed");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      throw error;
    }
  };

  return { fetchWithAuth, error, setError };
};
