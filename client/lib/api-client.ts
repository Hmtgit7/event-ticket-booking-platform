/**
 * Single entry point for all API calls. Points at one base URL — currently
 * the nginx gateway, later a Spring Cloud Gateway service registered in
 * Eureka — so the client never needs to know about individual service
 * ports (8081-8084).
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

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

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;
  const serializeAsJson = shouldSerializeAsJson(body);

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...(serializeAsJson ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body:
      body !== undefined
        ? serializeAsJson
          ? JSON.stringify(body)
          : (body as BodyInit)
        : undefined,
    credentials: "include", // send auth cookies once auth-service is wired up
  });

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

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
