/**
 * ARCHIVO DE CONFIGURACIÓN RÁPIDA PARA DEBUGGING
 * 
 * Pasos para configurar tu token:
 * 
 * 1. REEMPLAZA "TU_TOKEN_AQUI" con tu token JWT real
 * 2. Descomenta la línea del token
 * 3. Guarda el archivo
 * 4. Reinicia el servidor (npm run dev)
 * 
 * NOTA: Este archivo es temporal, no lo subas a git con tokens reales
 */

// ============================================
// CONFIGURACIÓN RÁPIDA - DESCOMENTA Y USA:
// ============================================

// Opción 1: Token directo (rápido pero menos seguro)
export const QUICK_TOKEN = "TU_TOKEN_AQUI"; // <-- REEMPLAZA "TU_TOKEN_AQUI" CON TU TOKEN REAL

// Opción 2: Deja null para usar variables de entorno
// export const QUICK_TOKEN = null;

// ============================================
// INFORMACIÓN DE DEBUG
// ============================================

export const DEBUG_INFO = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  hasEnvToken: !!process.env.NEXT_PUBLIC_TEMP_TOKEN,
  quickTokenSet: !!QUICK_TOKEN,
  timestamp: new Date().toISOString()
};

// ============================================
// FUNCIÓN PARA APLICAR TOKEN RÁPIDAMENTE
// ============================================

import { httpClient } from '@/infrastructure/http/http-client';

export const applyQuickToken = () => {
  const token = QUICK_TOKEN || process.env.NEXT_PUBLIC_TEMP_TOKEN;
  
  if (token) {
    httpClient.setAuthToken(token);
    console.log('🚀 QUICK TOKEN aplicado:', token.substring(0, 15) + '...');
    return true;
  } else {
    console.warn('⚠️ QUICK TOKEN no configurado. Edita /src/config/quick-token.ts');
    return false;
  }
};
