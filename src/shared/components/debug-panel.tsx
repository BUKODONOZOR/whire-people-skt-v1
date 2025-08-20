'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { httpClient } from '@/infrastructure/http/http-client';

/**
 * Componente de debugging para verificar tokens y peticiones HTTP
 */
export default function DebugPanel() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
      updateDebugInfo();
    }
  }, []);

  const updateDebugInfo = () => {
    const info = {
      envToken: process.env.NEXT_PUBLIC_TEMP_TOKEN ? 'Set' : 'Not Set',
      localStorageToken: typeof window !== 'undefined' 
        ? (localStorage.getItem('temp_token') ? 'Set' : 'Not Set') 
        : 'N/A (SSR)',
      currentTime: new Date().toISOString(),
      apiUrl: process.env.NEXT_PUBLIC_API_URL || 'Not configured'
    };
    setDebugInfo(info);
  };

  const testEndpoint = async (endpoint: string, method: string = 'GET') => {
    const startTime = Date.now();
    try {
      let result;
      if (method === 'GET') {
        result = await httpClient.get(endpoint);
      } else {
        result = await httpClient.post(endpoint, {});
      }
      
      const endTime = Date.now();
      setTestResults(prev => [...prev, {
        endpoint,
        method,
        status: 'SUCCESS',
        time: endTime - startTime,
        data: result,
        timestamp: new Date().toISOString()
      }]);
    } catch (error: any) {
      const endTime = Date.now();
      setTestResults(prev => [...prev, {
        endpoint,
        method,
        status: 'ERROR',
        time: endTime - startTime,
        error: {
          status: error.response?.status,
          statusText: error.response?.statusText,
          message: error.message,
          data: error.response?.data
        },
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-4 z-50 max-w-md">
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-blue-800">
              🔍 Debug Panel
            </h3>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-blue-700">Token Status:</h4>
            <div className="text-xs space-y-1">
              <p>ENV Token: <span className="font-mono">{debugInfo.envToken}</span></p>
              <p>LocalStorage: <span className="font-mono">{debugInfo.localStorageToken}</span></p>
              <p>API URL: <span className="font-mono text-xs">{debugInfo.apiUrl}</span></p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-blue-700">Test Endpoints:</h4>
            <div className="flex flex-wrap gap-1">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => testEndpoint('/v1/students')}
                className="text-xs h-6"
              >
                Students
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => testEndpoint('/v1/students?pageSize=5')}
                className="text-xs h-6"
              >
                5 Students
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => testEndpoint('/v1/students/statistics')}
                className="text-xs h-6"
              >
                Stats
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => testEndpoint('/health')}
                className="text-xs h-6"
              >
                Health
              </Button>
            </div>
          </div>

          <div className="flex gap-1">
            <Button size="sm" onClick={updateDebugInfo} className="text-xs">
              Refresh
            </Button>
            <Button size="sm" variant="outline" onClick={clearResults} className="text-xs">
              Clear
            </Button>
          </div>

          {testResults.length > 0 && (
            <div className="space-y-1 max-h-40 overflow-y-auto">
              <h4 className="text-xs font-semibold text-blue-700">Recent Tests:</h4>
              {testResults.slice(-5).map((result, index) => (
                <div key={index} className={`text-xs p-2 rounded border ${
                  result.status === 'SUCCESS' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <p className="font-mono">
                    {result.method} {result.endpoint} - {result.status}
                  </p>
                  {result.error && (
                    <p className="text-red-600">
                      {result.error.status}: {result.error.message}
                    </p>
                  )}
                  <p className="text-gray-500">{result.time}ms</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
