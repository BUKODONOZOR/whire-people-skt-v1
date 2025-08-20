/**
 * Configuración centralizada de variables de entorno
 * Este archivo valida y exporta todas las variables de entorno
 */

const getEnvVariable = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  
  return value;
};

export const env = {
  // App
  NODE_ENV: process.env.NODE_ENV || "development",
  APP_URL: getEnvVariable("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  
  // API - Using Riwi Talent Backend
  // Using local backend
  API_URL: getEnvVariable("NEXT_PUBLIC_API_URL", "http://localhost:5162/api"),
  BACKEND_API_URL: getEnvVariable("NEXT_PUBLIC_BACKEND_API_URL", "http://localhost:5162/api"),
  API_TIMEOUT: parseInt(getEnvVariable("NEXT_PUBLIC_API_TIMEOUT", "30000")),
  
  // Authentication
  AUTH_SECRET: process.env.AUTH_SECRET || "development-secret",
  JWT_SECRET: process.env.JWT_SECRET || "jwt-secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  
  // Database (if needed)
  DATABASE_URL: process.env.DATABASE_URL || "",
  
  // External Services
  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: parseInt(process.env.SMTP_PORT || "587"),
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || "",
  
  // Features Flags
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
  ENABLE_SENTRY: process.env.NEXT_PUBLIC_ENABLE_SENTRY === "true",
  
  // Third Party Services
  GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "",
  SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN || "",
} as const;

export type EnvConfig = typeof env;