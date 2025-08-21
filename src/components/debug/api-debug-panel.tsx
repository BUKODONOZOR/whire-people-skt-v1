"use client";

import { useState } from "react";
import { env } from "@/config/env.config";

export function ApiDebugPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const testConnection = async () => {
    try {
      const response = await fetch(`${env.API_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setTestResult({
        success: response.ok,
        status: response.status,
        url: env.API_URL,
        message: response.ok ? 'Connection successful!' : 'Connection failed'
      });
    } catch (error) {
      setTestResult({
        success: false,
        status: 'Error',
        url: env.API_URL,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Solo mostrar en desarrollo
  if (env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-500 text-white px-3 py-2 rounded-full text-sm font-mono"
      >
        API Debug
      </button>
      
      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-white border shadow-lg rounded-lg p-4 w-80 max-h-96 overflow-auto">
          <div className="space-y-3">
            <h3 className="font-bold text-sm">API Configuration Debug</h3>
            
            <div className="text-xs space-y-1">
              <div><strong>Environment:</strong> {env.NODE_ENV}</div>
              <div><strong>API URL:</strong> {env.API_URL}</div>
              <div><strong>Is Production:</strong> {env.IS_PRODUCTION.toString()}</div>
              <div><strong>Window Location:</strong> {typeof window !== 'undefined' ? window.location.hostname : 'SSR'}</div>
            </div>
            
            <button
              onClick={testConnection}
              className="w-full bg-green-500 text-white py-2 px-3 rounded text-sm"
            >
              Test Connection
            </button>
            
            {testResult && (
              <div className={`p-2 rounded text-xs ${testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <div><strong>Status:</strong> {testResult.status}</div>
                <div><strong>URL:</strong> {testResult.url}</div>
                <div><strong>Message:</strong> {testResult.message}</div>
              </div>
            )}
            
            <div className="text-xs text-gray-600">
              <strong>Quick Setup:</strong>
              <ol className="list-decimal list-inside space-y-1 mt-1">
                <li>Run: <code>ngrok http 5162</code></li>
                <li>Copy ngrok URL</li>
                <li>Set in Vercel env: <code>NEXT_PUBLIC_API_URL</code></li>
                <li>Redeploy</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
