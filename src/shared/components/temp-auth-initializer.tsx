'use client';

import { useEffect } from 'react';
import { initTempAuth } from '@/config/temp-auth';
import { applyQuickToken } from '@/config/quick-token';
// Importar interceptores HTTP globales
import '@/config/http-interceptors';

/**
 * Componente que inicializa la autenticación temporal en el cliente
 * Solo se ejecuta en desarrollo y debe ser removido cuando se implemente auth real
 */
export default function TempAuthInitializer() {
  useEffect(() => {
    // Solo inicializar en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Inicializando autenticación temporal...');
      
      // Intentar configuración rápida primero
      const quickTokenApplied = applyQuickToken();
      
      // Si no hay quick token, usar método normal
      if (!quickTokenApplied) {
        initTempAuth();
      }
    }
  }, []);

  return null; // Este componente no renderiza nada
}
