/**
 * HTTP Interceptors Configuration
 * Path: src/config/http-interceptors.ts
 */

import { httpClient } from "@/infrastructure/http/http-client";
import { authService } from "@/features/auth/services/auth.service";

/**
 * Setup HTTP interceptors
 * This should be called once when the app initializes
 */
export function setupHttpInterceptors() {
  // Request interceptor to add auth token
  httpClient.addRequestInterceptor((config) => {
    const token = authService.getToken();
    
    if (token) {
      // Ensure headers object exists
      if (!config.headers) {
        config.headers = {};
      }
      
      // Add authorization header
      (config.headers as any)['Authorization'] = `Bearer ${token}`;
      console.log("[Interceptor] Added token to request");
    } else {
      console.log("[Interceptor] No token available");
    }
    
    return config;
  });

  // Response interceptor for handling common errors
  httpClient.addResponseInterceptor((response) => {
    // Log successful responses
    console.log(`[Response] ${response.status} - ${response.statusText}`);
    return response;
  });

  // Error interceptor for handling auth errors
  httpClient.addErrorInterceptor((error) => {
    if (error.response?.status === 401) {
      console.error("[Auth Error] Unauthorized - Token might be invalid or expired");
      // Could redirect to login or token page here
      // window.location.href = '/token';
    }
    return error;
  });

  console.log("[HTTP Interceptors] Setup complete");
}

// Export a flag to check if interceptors are set up
let interceptorsInitialized = false;

export function initializeInterceptors() {
  if (!interceptorsInitialized) {
    setupHttpInterceptors();
    interceptorsInitialized = true;
  }
}

export function isInterceptorsInitialized() {
  return interceptorsInitialized;
}
