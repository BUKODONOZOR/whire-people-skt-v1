"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { authService } from "@/features/auth/services/auth.service";
import { UnknownObject } from "@/types/common";

export default function DebugTokenPage() {
  const [token, setToken] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<UnknownObject | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentToken = authService.getToken();
    setToken(currentToken);
  }, []);

  const testDirectFetch = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      const currentToken = authService.getToken();
      if (!currentToken) {
        setTestResult({ error: "No token found in localStorage" });
        return;
      }

      const url = "http://localhost:5162/api/v1/processes?PageNumber=1&PageSize=5";
      
      console.log("Testing with URL:", url);
      console.log("Token:", currentToken.substring(0, 50) + "...");

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentToken}`,
        },
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      const data = await response.json();
      console.log("Response data:", data);

      setTestResult({
        status: response.status,
        statusText: response.statusText,
        data: data,
        success: response.ok,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Test failed:", error);
      setTestResult({
        error: errorMessage,
        details: error,
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = () => {
    const newToken = authService.getToken();
    setToken(newToken);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Debug Token & API</h1>
          
          <div className="space-y-4">
            {/* Token Status */}
            <div className="p-4 bg-gray-100 rounded">
              <h2 className="font-semibold mb-2">Current Token Status:</h2>
              {token ? (
                <div className="space-y-2">
                  <p className="text-green-600">✓ Token found</p>
                  <div className="p-2 bg-white rounded font-mono text-xs break-all">
                    {token.substring(0, 100)}...
                  </div>
                  <button
                    onClick={refreshToken}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Refresh Token Status
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-red-600">✗ No token found</p>
                  <Link href="/token" className="text-blue-600 hover:underline">
                    Go to Token Page to set one
                  </Link>
                </div>
              )}
            </div>

            {/* Test Button */}
            <div className="flex gap-4">
              <button
                onClick={testDirectFetch}
                disabled={loading || !token}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Testing..." : "Test API with Direct Fetch"}
              </button>
            </div>

            {/* Test Results */}
            {testResult && (
              <div className="p-4 bg-gray-100 rounded">
                <h2 className="font-semibold mb-2">Test Results:</h2>
                {testResult.success ? (
                  <div className="space-y-2">
                    <p className="text-green-600">✓ Success! Status: {testResult.status}</p>
                    <div className="p-2 bg-white rounded">
                      <pre className="text-xs overflow-auto">
                        {JSON.stringify(testResult.data, null, 2)}
                      </pre>
                    </div>
                  </div>
                ) : testResult.error ? (
                  <div className="space-y-2">
                    <p className="text-red-600">✗ Error: {testResult.error}</p>
                    {testResult.details && (
                      <div className="p-2 bg-white rounded">
                        <pre className="text-xs overflow-auto">
                          {JSON.stringify(testResult.details, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-yellow-600">⚠ Status: {testResult.status} - {testResult.statusText}</p>
                    <div className="p-2 bg-white rounded">
                      <pre className="text-xs overflow-auto">
                        {JSON.stringify(testResult.data, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Instructions */}
            <div className="p-4 bg-blue-50 rounded">
              <h3 className="font-semibold mb-2">Instructions:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Make sure the backend is running on http://localhost:5162</li>
                <li>Check that you have a valid token (green status above)</li>
                <li>Click &quot;Test API with Direct Fetch&quot; to test the connection</li>
                <li>Check the browser console (F12) for detailed logs</li>
                <li>If you get a 401, the token might be expired or invalid</li>
              </ol>
            </div>

            {/* Quick Actions */}
            <div className="p-4 bg-yellow-50 rounded">
              <h3 className="font-semibold mb-2">Quick Actions:</h3>
              <div className="space-x-4">
                <Link href="/token" className="text-blue-600 hover:underline">
                  Go to Token Page
                </Link>
                <Link href="/processes" className="text-blue-600 hover:underline">
                  Go to Processes
                </Link>
                <Link href="/talent" className="text-blue-600 hover:underline">
                  Go to Talent
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
