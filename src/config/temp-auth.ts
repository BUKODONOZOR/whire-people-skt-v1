import { httpClient } from '@/infrastructure/http/http-client';

/**
 * TEMPORAL: Configuración de token para desarrollo sin sistema de auth
 * TODO: Remover cuando se implemente el sistema de autenticación completo
 */

// Token desde variables de entorno (recomendado)
const TEMP_TOKEN = process.env.NEXT_PUBLIC_TEMP_TOKEN;

// O coloca aqui tu token directamente (menos seguro)
// const TEMP_TOKEN = 'tu-token-aqui';

/**
 * Inicializa el cliente HTTP con el token temporal
 */
export const initTempAuth = () => {
  if (TEMP_TOKEN && TEMP_TOKEN !== 'tu-token-jwt-aqui') {
    httpClient.setAuthToken(TEMP_TOKEN);
    console.warn('🔐 DESARROLLO: Usando token temporal');
  } else {
    console.warn('⚠️ No se encontró token temporal. Define NEXT_PUBLIC_TEMP_TOKEN en .env.local');
  }
};

/**
 * Permite cambiar el token en tiempo de ejecución
 */
export const setTempToken = (token: string) => {
  httpClient.setAuthToken(token);
  console.log('🔄 Token temporal actualizado');
};

/**
 * Remueve el token temporal
 */
export const removeTempToken = () => {
  httpClient.removeAuthToken();
  console.log('🔓 Token temporal removido');
};
