"use client";

import { useState } from "react";
import Link from "next/link";
import { authService } from "@/features/auth/services/auth.service";
import { UnknownObject } from "@/types/common";

interface ProcessItem {
  id: string;
  name: string;
  companyId: string;
  companyName: string;
  statusName: string;
}

interface ApiResponse {
  totalCount?: number;
  pageNumber?: number;
  items?: ProcessItem[];
}

export default function TestApiPage() {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testDirectApi = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No token found. Please set a token first at /token");
      }

      console.log("Testing API with token:", token.substring(0, 50) + "...");
      
      // Test direct API call
      const apiUrl = "https://riwittalentapi.somee.com/api/v1/processes";
      console.log("Calling:", apiUrl);
      
      const res = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);
      
      setResponse(data);

      // Check for company ID
      if (data.items && Array.isArray(data.items)) {
        const companyId = "166c4bfc-1c2b-4ddd-866c-fbdfed07d6a3";
        const ourProcesses = data.items.filter((item: ProcessItem) => item.companyId === companyId);
        console.log(`Found ${ourProcesses.length} processes for company ${companyId}`);
        console.log("Our processes:", ourProcesses);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error("Error:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const testWithCompanyFilter = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No token found. Please set a token first at /token");
      }

      const companyId = "166c4bfc-1c2b-4ddd-866c-fbdfed07d6a3";
      
      // Test with CompanyId filter
      const apiUrl = `https://riwittalentapi.somee.com/api/v1/processes?CompanyId=${companyId}&PageNumber=1&PageSize=20`;
      console.log("Calling with filter:", apiUrl);
      
      const res = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);
      
      setResponse(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error("Error:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">API Test Page</h1>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={testDirectApi}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Test Direct API Call (No Filter)
            </button>
            
            <button
              onClick={testWithCompanyFilter}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              Test with Company Filter
            </button>
          </div>

          {loading && (
            <div className="p-4 bg-blue-50 rounded">
              Loading...
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded">
              Error: {error}
            </div>
          )}

          {response && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded">
                <h2 className="font-semibold mb-2">Response Summary:</h2>
                <p>Total Count: {response.totalCount || 0}</p>
                <p>Page: {response.pageNumber || 0}</p>
                <p>Items: {response.items?.length || 0}</p>
              </div>

              <div className="p-4 bg-gray-100 rounded">
                <h2 className="font-semibold mb-2">Raw Response:</h2>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>

              {response.items && response.items.length > 0 && (
                <div className="p-4 bg-green-50 rounded">
                  <h2 className="font-semibold mb-2">Processes for Company 166c4bfc-1c2b-4ddd-866c-fbdfed07d6a3:</h2>
                  {response.items
                    .filter((item: ProcessItem) => item.companyId === "166c4bfc-1c2b-4ddd-866c-fbdfed07d6a3")
                    .map((item: ProcessItem) => (
                      <div key={item.id} className="p-2 mb-2 bg-white rounded">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Company: {item.companyName}</p>
                        <p className="text-sm text-gray-600">Status: {item.statusName}</p>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-yellow-50 rounded">
          <h3 className="font-semibold mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>First, go to <Link href="/token" className="text-blue-500 underline">/token</Link> and set a valid JWT token</li>
            <li>Come back here and click &quot;Test Direct API Call&quot; to see all processes</li>
            <li>Click &quot;Test with Company Filter&quot; to test filtering by company ID</li>
            <li>Check the browser console for detailed logs</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
