const API_BASE_URL =
  typeof window === "undefined"
    ? process.env.API_HOST_URL || "http://localhost:3000"
    : "";

type RequestOptions = RequestInit & {
  params?: Record<string, string>;
};

export async function apiClient<T>(
  endpoint: string,
  { params, ...options }: RequestOptions = {},
): Promise<T> {
  const base =
    API_BASE_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000");
  const url = new URL(endpoint, base);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const headers = new Headers(options.headers);
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url.toString(), {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Handle token refresh logic here if needed
    // For now, just clear token and redirect
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      document.cookie =
        "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      // window.location.href = "/login";
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message);
  }

  return response.json();
}
