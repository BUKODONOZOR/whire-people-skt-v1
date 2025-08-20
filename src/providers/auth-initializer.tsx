"use client";

import { useEffect, useState } from "react";
import { authService } from "@/features/auth/services/auth.service";
import { httpClient } from "@/infrastructure/http/http-client";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize auth token from localStorage if available
    const initializeAuth = () => {
      const token = authService.getToken();
      
      if (token) {
        console.log("[AuthInitializer] Token found, setting in HTTP client");
        httpClient.setAuthToken(token);
      } else {
        console.log("[AuthInitializer] No token found in localStorage");
      }
      
      setIsInitialized(true);
    };

    // Initialize immediately
    initializeAuth();

    // Listen for storage changes (when token is set from another tab/window)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        const newToken = e.newValue;
        if (newToken) {
          console.log("[AuthInitializer] Token updated from storage event");
          httpClient.setAuthToken(newToken);
        } else {
          console.log("[AuthInitializer] Token removed from storage event");
          httpClient.removeAuthToken();
        }
      }
    };
    
    // Listen for custom event when token is set in the same tab
    const handleTokenChange = () => {
      const token = authService.getToken();
      if (token) {
        console.log("[AuthInitializer] Token updated");
        httpClient.setAuthToken(token);
      } else {
        console.log("[AuthInitializer] Token removed");
        httpClient.removeAuthToken();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('tokenChanged', handleTokenChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tokenChanged', handleTokenChange);
    };
  }, []);

  // Don't render children until auth is initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
