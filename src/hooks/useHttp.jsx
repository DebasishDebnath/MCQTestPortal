import { useState, useCallback } from "react";

// Global backend URL (environment or fallback)
export const mainURL =
  import.meta.env.VITE_BACKEND_URL || "https://example-backend.com";

export const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (path, method = "GET", body = null, headers = {}) => {
      setLoading(true);
      setError(null);

      // Safe URL builder
      const cleanPath = path.startsWith("/") ? path : `/${path}`;
      const finalURL = `${mainURL}${cleanPath}`;

      try {
        const options = { method, headers: { ...headers } };

        // Auto JSON unless FormData
        if (body) {
          if (body instanceof FormData) {
            options.body = body;
          } else {
            options.body = JSON.stringify(body);
            options.headers["Content-Type"] = "application/json";
          }
        }

        const response = await fetch(finalURL, options);

        const contentType = response.headers.get("content-type");
        const data =
          contentType?.includes("application/json")
            ? await response.json()
            : await response.text();

        if (!response.ok) {
          throw new Error(data?.message || "Request failed");
        }

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

  return {
    loading,
    error,
    get: (path, headers = {}) => request(path, "GET", null, headers),
    post: (path, body, headers = {}) => request(path, "POST", body, headers),
    put: (path, body, headers = {}) => request(path, "PUT", body, headers),
    del: (path, headers = {}) => request(path, "DELETE", null, headers),
  };
};
