import { env } from "@/config/env.config";

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestConfig extends RequestInit {
  params?: Record<string, any>;
  timeout?: number;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

class HttpClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;
  private interceptors: {
    request: Array<(config: RequestConfig) => RequestConfig | Promise<RequestConfig>>;
    response: Array<(response: ApiResponse) => ApiResponse | Promise<ApiResponse>>;
    error: Array<(error: any) => any>;
  };

  constructor(baseURL?: string) {
    this.baseURL = baseURL || env.API_URL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
    this.interceptors = {
      request: [],
      response: [],
      error: [],
    };
    
    console.log("HttpClient initialized with baseURL:", this.baseURL);
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(
    interceptor: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>
  ) {
    this.interceptors.request.push(interceptor);
    return this;
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(
    interceptor: (response: ApiResponse) => ApiResponse | Promise<ApiResponse>
  ) {
    this.interceptors.response.push(interceptor);
    return this;
  }

  /**
   * Add error interceptor
   */
  addErrorInterceptor(interceptor: (error: any) => any) {
    this.interceptors.error.push(interceptor);
    return this;
  }

  /**
   * Set authorization token
   */
  setAuthToken(token: string) {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      Authorization: `Bearer ${token}`,
    };
    // Also store in localStorage as backup
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('auth_token', token);
    }
    console.log("Token set in HttpClient and localStorage");
    return this;
  }

  /**
   * Remove authorization token
   */
  removeAuthToken() {
    const headers = { ...this.defaultHeaders };
    delete (headers as any).Authorization;
    this.defaultHeaders = headers;
    console.log("Token removed from HttpClient");
    return this;
  }

  /**
   * Build URL with params
   */
  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key].toString());
        }
      });
    }
    
    return url.toString();
  }

  /**
   * Execute request
   */
  private async request<T = any>(
    method: RequestMethod,
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    // Always check for token before making request
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || localStorage.getItem('auth_token') : null;
    
    let finalConfig: RequestConfig = {
      ...config,
      method,
      headers: {
        ...this.defaultHeaders,
        ...config.headers,
      },
    };
    
    // Add token if available
    if (token && finalConfig.headers) {
      (finalConfig.headers as any)['Authorization'] = `Bearer ${token}`;
      console.log("[HttpClient] Token added to request");
    } else if (!token) {
      console.log("[HttpClient] No token found in localStorage");
    }

    // Apply request interceptors
    for (const interceptor of this.interceptors.request) {
      finalConfig = await interceptor(finalConfig);
    }

    const url = this.buildURL(endpoint, finalConfig.params);
    
    // Log request details for debugging
    console.log(`[${method}] ${url}`);
    console.log("Headers:", finalConfig.headers);
    console.log("Has Authorization header:", !!(finalConfig.headers as any)?.Authorization);
    
    // Setup timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      finalConfig.timeout || env.API_TIMEOUT
    );

    try {
      const response = await fetch(url, {
        ...finalConfig,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Log response status
      console.log(`Response Status: ${response.status}`);

      // Parse response
      let data: T;
      const contentType = response.headers.get("content-type");
      
      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        data = (await response.text()) as any;
      }

      const apiResponse: ApiResponse<T> = {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };

      // Check if response is OK
      if (!response.ok) {
        console.error("Request failed:", {
          status: response.status,
          statusText: response.statusText,
          data
        });
        throw {
          response: apiResponse,
          message: `Request failed with status ${response.status}`,
        };
      }

      // Apply response interceptors
      let finalResponse = apiResponse;
      for (const interceptor of this.interceptors.response) {
        finalResponse = await interceptor(finalResponse);
      }

      return finalResponse;
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      console.error("Request error:", error);
      
      // Apply error interceptors
      let finalError = error;
      for (const interceptor of this.interceptors.error) {
        finalError = await interceptor(finalError);
      }
      
      throw finalError;
    }
  }

  /**
   * GET request
   */
  async get<T = any>(endpoint: string, config?: RequestConfig): Promise<T> {
    const response = await this.request<T>("GET", endpoint, config);
    return response.data;
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    const response = await this.request<T>("POST", endpoint, {
      ...config,
      body: data ? JSON.stringify(data) : undefined,
    });
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T = any>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    const response = await this.request<T>("PUT", endpoint, {
      ...config,
      body: data ? JSON.stringify(data) : undefined,
    });
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    const response = await this.request<T>("PATCH", endpoint, {
      ...config,
      body: data ? JSON.stringify(data) : undefined,
    });
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string, config?: RequestConfig): Promise<T> {
    const response = await this.request<T>("DELETE", endpoint, config);
    return response.data;
  }
}

// Create default instance
export const httpClient = new HttpClient();

// Export class for creating custom instances
export default HttpClient;