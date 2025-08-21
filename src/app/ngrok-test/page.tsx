"use client";

import { useState, useEffect } from "react";
import { env } from "@/config/env.config";

export default function NgrokTestPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test: string, result: any) => {
    setTestResults(prev => [...prev, { test, result, timestamp: new Date().toLocaleTimeString() }]);
  };

  const testNgrokConnection = async () => {
    setLoading(true);
    setTestResults([]);

    // Test 1: Basic connection
    try {
      const response = await fetch(`${env.API_URL.replace('/api', '')}`);
      addResult("Basic Connection", {
        status: response.status,
        success: response.ok,
        url: env.API_URL.replace('/api', '')
      });
    } catch (error) {
      addResult("Basic Connection", {
        status: "ERROR",
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 2: API Health check
    try {
      const response = await fetch(`${env.API_URL}/health`);
      addResult("API Health", {
        status: response.status,
        success: response.ok,
        url: `${env.API_URL}/health`
      });
    } catch (error) {
      addResult("API Health", {
        status: "ERROR",
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 3: Students endpoint
    try {
      const response = await fetch(`${env.API_URL}/v1/students?PageNumber=1&PageSize=5`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = response.ok ? await response.json() : null;
      
      addResult("Students API", {
        status: response.status,
        success: response.ok,
        url: `${env.API_URL}/v1/students`,
        data: data ? { totalCount: data.totalCount, itemsLength: data.items?.length } : null
      });
    } catch (error) {
      addResult("Students API", {
        status: "ERROR",
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">🔗 ngrok Connection Test</h1>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h2 className="font-semibold mb-2">Current Configuration:</h2>
              <div className="text-sm space-y-1">
                <p><strong>Environment:</strong> {env.NODE_ENV}</p>
                <p><strong>API URL:</strong> {env.API_URL}</p>
                <p><strong>ngrok URL:</strong> https://1e0689e09dab.ngrok-free.app</p>
                <p><strong>Window Location:</strong> {typeof window !== 'undefined' ? window.location.origin : 'SSR'}</p>
              </div>
            </div>

            <button
              onClick={testNgrokConnection}
              disabled={loading}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Testing ngrok Connection..." : "🧪 Test ngrok Connection"}
            </button>

            {testResults.length > 0 && (
              <div className="space-y-3">
                <h2 className="font-semibold">Test Results:</h2>
                {testResults.map((result, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg border ${
                      result.result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{result.test}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        result.result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {result.result.status}
                      </span>
                    </div>
                    
                    <div className="text-sm space-y-1">
                      {result.result.url && (
                        <p><strong>URL:</strong> {result.result.url}</p>
                      )}
                      {result.result.error && (
                        <p className="text-red-600"><strong>Error:</strong> {result.result.error}</p>
                      )}
                      {result.result.data && (
                        <p><strong>Data:</strong> {JSON.stringify(result.result.data)}</p>
                      )}
                      <p className="text-gray-500"><strong>Time:</strong> {result.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">📝 Next Steps:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>If tests pass locally, configure the same URL in Vercel environment variables</li>
            <li>Set <code>NEXT_PUBLIC_API_URL=https://1e0689e09dab.ngrok-free.app/api</code> in Vercel</li>
            <li>Redeploy your Vercel project</li>
            <li>Test from the live Vercel URL</li>
            <li>Monitor requests in ngrok web interface: <a href="http://127.0.0.1:4040" target="_blank" className="text-blue-600 underline">http://127.0.0.1:4040</a></li>
          </ol>
        </div>
      </div>
    </div>
  );
}
