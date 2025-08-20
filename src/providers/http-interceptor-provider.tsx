"use client";

import { useEffect } from "react";
import { initializeInterceptors } from "@/config/http-interceptors";

export function HttpInterceptorProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize HTTP interceptors once when the app mounts
    initializeInterceptors();
  }, []);

  return <>{children}</>;
}
