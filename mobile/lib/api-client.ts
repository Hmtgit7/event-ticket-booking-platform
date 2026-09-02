/**
 * Factory, not a single instance: no API gateway in this architecture - each
 * backend service is called directly, so one client per base URL. Mirrors
 * client/lib/api-client.ts exactly except tokenStorage reads are
 * synchronous-from-memory here (see lib/token-storage.ts) rather than
 * synchronous-from-cookie.
 */
import { env } from "@/lib/env";
import { refreshAccessToken } from "@/lib/refresh-token";
import { tokenStorage } from "@/lib/token-storage";

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Skip attaching the Authorization header - for signup/login/etc before a token exists. */
  skipAuth?: boolean;
}

function shouldSerializeAsJson(body: unknown) {
  return (
    body !== undefined &&
    !(body instanceof FormData) &&
    !(body instanceof URLSearchParams) &&
    !(body instanceof Blob) &&
    !(body instanceof ArrayBuffer) &&
    !ArrayBuffer.isView(body)
  );
}

function createApiClient(baseUrl: string) {
  async function request<T>(path: string, options: RequestOptions = {}, isRetry = false): Promise<T> {
    const { body, headers, skipAuth, ...rest } = options;
    const serializeAsJson = shouldSerializeAsJson(body);
    const accessToken = skipAuth ? null : tokenStorage.getAccessToken();

    const res = await fetch(`${baseUrl}${path}`, {
      ...rest,
      headers: {
        ...(serializeAsJson ? { "Content-Type": "application/json" } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
      body:
        body !== undefined ? (serializeAsJson ? JSON.stringify(body) : (body as BodyInit)) : undefined,
    });

    if (res.status === 401 && !skipAuth && !isRetry) {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        return request<T>(path, options, true);
      }
    }

    if (!res.ok) {
      let parsedBody: unknown;
      try {
        parsedBody = await res.json();
      } catch {
        // response wasn't JSON, ignore
      }
      throw new ApiError(res.status, `${options.method ?? "GET"} ${path} failed`, parsedBody);
    }

    if (res.status === 204) {
      return undefined as T;
    }

    return res.json() as Promise<T>;
  }

  return {
    get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "GET" }),
    post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
      request<T>(path, { ...options, method: "POST", body }),
    put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
      request<T>(path, { ...options, method: "PUT", body }),
    patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
      request<T>(path, { ...options, method: "PATCH", body }),
    delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "DELETE" }),
  };
}

export const authApiClient = createApiClient(env.authApiUrl);
export const eventApiClient = createApiClient(env.eventApiUrl);
export const bookingApiClient = createApiClient(env.bookingApiUrl);
export const paymentApiClient = createApiClient(env.paymentApiUrl);
export const notificationApiClient = createApiClient(env.notificationApiUrl);
