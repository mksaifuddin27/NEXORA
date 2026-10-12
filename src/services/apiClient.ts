/**
 * Centralized typed API client for NEXORA frontend
 * Connects to Spring Boot REST backend on http://localhost:8080/api
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
export const DATA_MODE = import.meta.env.VITE_DATA_MODE || 'live';

export interface ApiResponseEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
  errors?: Record<string, string>;
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string>;

  constructor(message: string, status: number, errors?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('nexora_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const result: ApiResponseEnvelope<T> | null = isJson ? await response.json() : null;

    if (!response.ok) {
      if (response.status === 401) {
        // Clear expired token on unauthorized
        localStorage.removeItem('nexora_token');
        localStorage.removeItem('nexora_user');
      }

      const errorMessage =
        result?.message ||
        (result?.errors ? Object.values(result.errors).join(', ') : `HTTP ${response.status}: Request failed`);

      throw new ApiError(errorMessage, response.status, result?.errors);
    }

    if (result && typeof result.data !== 'undefined') {
      return result.data;
    }

    return (result as unknown) as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network failures / connection refused
    throw new ApiError(
      error.message || 'Unable to connect to backend server. Please verify Spring Boot is running on port 8080.',
      0
    );
  }
}
