/**
 * Simple API client for processes
 * This is a solution for Server Actions where localStorage is not available
 */

import { env } from "@/config/env.config";

class ProcessApiClient {
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
      console.error("[ProcessApiClient] No token provided!");
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

    console.log(`[ProcessApiClient] ${method} ${url}`);
    console.log(`[ProcessApiClient] Token provided: ${token.substring(0, 30)}...`);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      console.log(`[ProcessApiClient] Response status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("[ProcessApiClient] Error response:", errorData);
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("[ProcessApiClient] Response received successfully");
      return data;
    } catch (error) {
      console.error("[ProcessApiClient] Request failed:", error);
      throw error;
    }
  }

  async get<T = any>(endpoint: string, params?: Record<string, any>, token?: string): Promise<T> {
    return this.makeRequest<T>('GET', endpoint, { params, token });
  }

  async post<T = any>(endpoint: string, body?: any, token?: string): Promise<T> {
    return this.makeRequest<T>('POST', endpoint, { body, token });
  }

  async patch<T = any>(endpoint: string, body?: any, token?: string): Promise<T> {
    return this.makeRequest<T>('PATCH', endpoint, { body, token });
  }

  async delete<T = any>(endpoint: string, token?: string): Promise<T> {
    return this.makeRequest<T>('DELETE', endpoint, { token });
  }
}

export const processApiClient = new ProcessApiClient();
