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

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url.toString(), {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message);
  }

  return response.json();
}
