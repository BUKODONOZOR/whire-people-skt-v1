"use client";

import { useEffect } from "react";
import { authService } from "@/features/auth/services/auth.service";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize auth on mount
    authService.initialize();
  }, []);

  return <>{children}</>;
}