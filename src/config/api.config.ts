// src/config/api.config.ts
export const API_CONFIG = {
  // Para desarrollo local
  LOCAL: {
    baseURL: 'http://localhost:5162/api'
  },
  
  // Para desarrollo con ngrok
  NGROK: {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://tu-ngrok-url.ngrok.io/api'
  },
  
  // Para producción (cuando despliegues el backend)
  PRODUCTION: {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://tu-api-produccion.com/api'
  }
};

// Detectar entorno automáticamente
export const getApiConfig = () => {
  // Si estás en Vercel/producción
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return API_CONFIG.NGROK;
  }
  
  // Si estás en desarrollo local
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return API_CONFIG.LOCAL;
  }
  
  return API_CONFIG.NGROK;
};
