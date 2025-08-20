'use client';

import { useState, useCallback } from 'react';
import { httpClient } from '@/infrastructure/http/http-client';

/**
 * Hook para manejar tokens temporales durante desarrollo
 * TODO: Remover cuando se implemente sistema de autenticación real
 */
export const useTempAuth = () => {
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const [isTokenSet, setIsTokenSet] = useState(false);

  /**
   * Establece un token temporal
   */
  const setToken = useCallback((token: string) => {
    httpClient.setAuthToken(token);
    setCurrentToken(token);
    setIsTokenSet(true);
    localStorage.setItem('temp_token', token);
    console.log('🔐 Token temporal configurado');
  }, []);

  /**
   * Remueve el token temporal
   */
  const removeToken = useCallback(() => {
    httpClient.removeAuthToken();
    setCurrentToken(null);
    setIsTokenSet(false);
    localStorage.removeItem('temp_token');
    console.log('🔓 Token temporal removido');
  }, []);

  /**
   * Carga el token desde localStorage si existe
   */
  const loadStoredToken = useCallback(() => {
    const storedToken = localStorage.getItem('temp_token');
    if (storedToken) {
      setToken(storedToken);
      return true;
    }
    return false;
  }, [setToken]);

  /**
   * Obtiene el token actual (enmascarado por seguridad)
   */
  const getMaskedToken = useCallback(() => {
    if (!currentToken) return null;
    return currentToken.substring(0, 10) + '...' + currentToken.substring(currentToken.length - 4);
  }, [currentToken]);

  return {
    setToken,
    removeToken,
    loadStoredToken,
    getMaskedToken,
    isTokenSet,
    hasToken: Boolean(currentToken)
  };
};
