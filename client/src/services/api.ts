/**
 * Cliente HTTP base para comunicación con el backend.
 *
 * Incluye automáticamente el token JWT de localStorage en el encabezado
 * `Authorization: Bearer <token>` cuando el usuario está autenticado.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  ok: boolean;
}

/**
 * Realiza una petición HTTP al backend con token opcional.
 */
async function request<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers = {} } = options;

  const token = localStorage.getItem('auth_token');

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  return {
    data,
    status: response.status,
    ok: response.ok,
  };
}

export const apiClient = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', body }),
  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PUT', body }),
  patch: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PATCH', body }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
};
