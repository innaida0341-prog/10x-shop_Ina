import { ApiError } from "./ApiError";

export class ApiClient {
  constructor(private readonly baseUrl: string) {}

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    let response: Response;

    try {
      response = await fetch(this.baseUrl + path, { ...init, headers });
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") throw error;
      throw new ApiError(0, "Network error — check your connection and try again.");
    }

    if (!response.ok) {
      const message =
        response.status === 404
          ? "We couldn't find what you were looking for."
          : `Request failed with status ${response.status}.`;
      throw new ApiError(response.status, message);
    }

    // The API boundary is typed by contract; persisted data is validated by guards.
    return (await response.json()) as T;
  }

  get<T>(path: string, signal?: AbortSignal): Promise<T> {
    return this.request<T>(path, { signal });
  }

  post<T, B>(path: string, body: B): Promise<T> {
    return this.request<T>(path, { method: "POST", body: JSON.stringify(body) });
  }
}