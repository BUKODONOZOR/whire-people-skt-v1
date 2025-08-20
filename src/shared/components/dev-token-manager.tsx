'use client';

import { useState, useEffect } from 'react';
import { useTempAuth } from '@/shared/hooks/use-temp-auth';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card } from '@/shared/components/ui/card';

/**
 * Componente de desarrollo para configurar tokens temporalmente
 * Solo aparece en desarrollo y debe ser removido en producción
 */
export default function DevTokenManager() {
  const { setToken, removeToken, loadStoredToken, getMaskedToken, isTokenSet } = useTempAuth();
  const [tokenInput, setTokenInput] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Solo mostrar en desarrollo
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
      // Intentar cargar token almacenado
      loadStoredToken();
    }
  }, [loadStoredToken]);

  const handleSetToken = () => {
    if (tokenInput.trim()) {
      setToken(tokenInput.trim());
      setTokenInput('');
    }
  };

  const handleRemoveToken = () => {
    removeToken();
    setTokenInput('');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="p-4 w-80 bg-yellow-50 border-yellow-200">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-yellow-800">
              🚧 Dev: Configurar Token
            </h3>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-yellow-600 hover:text-yellow-800"
            >
              ✕
            </button>
          </div>
          
          {isTokenSet ? (
            <div className="space-y-2">
              <p className="text-xs text-yellow-700">
                Token activo: {getMaskedToken()}
              </p>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleRemoveToken}
                className="w-full"
              >
                Remover Token
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Pegar token JWT aquí"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="text-xs"
              />
              <Button 
                onClick={handleSetToken}
                disabled={!tokenInput.trim()}
                className="w-full"
                size="sm"
              >
                Configurar Token
              </Button>
            </div>
          )}
          
          <p className="text-xs text-yellow-600">
            Este panel solo aparece en desarrollo
          </p>
        </div>
      </Card>
    </div>
  );
}
