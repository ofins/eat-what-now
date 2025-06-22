/**
 * Custom HTTP client with automatic authentication
 * No memory leaks, always fresh tokens, proper error handling
 */

interface RequestOptions extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
  skipAuth?: boolean;
}

class HttpClient {
  private baseURL: string;
  private signature: string;

  constructor(baseURL = "", signature = "") {
    this.baseURL = baseURL;
    this.signature = signature;
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem("token") || "";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    if (this.signature) {
      headers["x-signature"] = this.signature;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { skipAuth = false, headers = {}, ...requestOptions } = options;

    const url = endpoint.startsWith("http")
      ? endpoint
      : `${this.baseURL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    const requestHeaders = skipAuth
      ? { ...headers }
      : { ...this.getAuthHeaders(), ...headers };

    const response = await fetch(url, {
      ...requestOptions,
      headers: requestHeaders,
    });

    if (!response.ok) {
      // Handle auth errors
      if (response.status === 401) {
        localStorage.removeItem("token");
        window.dispatchEvent(new CustomEvent("auth-change"));
        throw new Error("Authentication failed");
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Handle empty responses
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }

    return response.text() as T;
  }
  // Convenience methods
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T = Response>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Create and export singleton instance
export const httpClient = new HttpClient(
  import.meta.env.VITE_API_BASE_URL || "",
  import.meta.env.VITE_SIGNATURE || ""
);

// Export class for custom instances if needed
export { HttpClient };
