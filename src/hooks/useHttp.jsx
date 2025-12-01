// src/hooks/useHttp.jsx
import { useState, useCallback } from "react";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
// Example .env value:
// VITE_BACKEND_URL="https://your-backend-url.com/api"

export const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (endpoint, method = "GET", body = null, headers = {}) => {
      setLoading(true);
      setError(null);

      try {
        const config = {
          method,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
        };

        if (body) {
          config.body = JSON.stringify(body);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (err) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const get = useCallback(
    (endpoint, headers) => request(endpoint, "GET", null, headers),
    [request]
  );
  const post = useCallback(
    (endpoint, body, headers) => request(endpoint, "POST", body, headers),
    [request]
  );
  const put = useCallback(
    (endpoint, body, headers) => request(endpoint, "PUT", body, headers),
    [request]
  );
  const del = useCallback(
    (endpoint, headers) => request(endpoint, "DELETE", null, headers),
    [request]
  );

  return { get, post, put, del, loading, error };
};
