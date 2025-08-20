/**
 * Metrics API Client
 * Handles API communication for metrics with explicit token passing
 */

import { env } from "@/config/env.config";

class MetricsApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = env.API_URL;
  }

  private async makeRequest<T = any>(
    method: string,
    endpoint: string,
    options: {
      body?: any;
      params?: Record<string, any>;
      token?: string;
    } = {}
  ): Promise<T> {
    // Token must be provided as parameter in Server Actions context
    const token = options.token;
    
    if (!token) {
      console.error("[MetricsApiClient] No token provided!");
      throw new Error("Authentication token must be provided");
    }

    // Build URL with params
    let url = `${this.baseURL}${endpoint}`;
    if (options.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      url += `?${searchParams.toString()}`;
    }

    console.log(`[MetricsApiClient] ${method} ${url}`);
    console.log(`[MetricsApiClient] Token provided: ${token.substring(0, 30)}...`);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        cache: 'no-store', // Disable caching for metrics data
      });

      console.log(`[MetricsApiClient] Response status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("[MetricsApiClient] Error response:", errorData);
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      // Handle blob responses for exports
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/octet-stream')) {
        return await response.blob() as T;
      }

      const data = await response.json();
      console.log("[MetricsApiClient] Response received successfully");
      return data;
    } catch (error) {
      console.error("[MetricsApiClient] Request failed:", error);
      throw error;
    }
  }

  async get<T = any>(endpoint: string, params?: Record<string, any>, token?: string): Promise<T> {
    return this.makeRequest<T>('GET', endpoint, { params, token });
  }

  async post<T = any>(endpoint: string, body?: any, token?: string): Promise<T> {
    return this.makeRequest<T>('POST', endpoint, { body, token });
  }
}

export const metricsApiClient = new MetricsApiClient();
