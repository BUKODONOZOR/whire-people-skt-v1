"use client";

import { useState, useEffect } from "react";
import { authService } from "@/features/auth/services/auth.service";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Key, CheckCircle, Copy } from "lucide-react";

export default function TokenDebugPage() {
  const [token, setToken] = useState("");
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // Default token for testing
  const DEFAULT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9zaWQiOiIxNTdlYTdlMi0wYjdkLTRmYTMtYTlmOC1iYzEwYWU2NjkyZWUiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjE1N2VhN2UyLTBiN2QtNGZhMy1hOWY4LWJjMTBhZTY2OTJlZSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImFkbWluQGV4YW1wbGUuY29tIiwiYXVkIjoiZGV2ZWxvcGVycyIsImlzcyI6InRhbGVudC1oZXhhZ29uYWwtYXJjaGl0ZWN0dXJlIiwiZXhwIjoxNzU0NjI0MjI2LCJpYXQiOjE3NTQ1MDQyMjYsIm5iZiI6MTc1NDUwNDIyNn0.yNK0E5-BuzmN_fvbgfcSMfXV2ka-inovBPjX9XOh5yU";

  useEffect(() => {
    // Check current token on mount
    const storedToken = authService.getToken();
    setCurrentToken(storedToken);
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleSetToken = () => {
    if (!token.trim()) {
      setMessage("Please enter a token");
      return;
    }

    // Set the token using authService which will handle everything
    authService.setToken(token);
    setCurrentToken(token);
    setMessage("Token set successfully! You can now navigate to /processes or /talent");
    
    // Redirect after 2 seconds
    setTimeout(() => {
      window.location.href = "/processes";
    }, 2000);
  };

  const handleUseDefaultToken = () => {
    setToken(DEFAULT_TOKEN);
    authService.setToken(DEFAULT_TOKEN);
    setCurrentToken(DEFAULT_TOKEN);
    setMessage("Default token set! Redirecting to /processes...");
    
    setTimeout(() => {
      window.location.href = "/processes";
    }, 1500);
  };

  const handleClearToken = () => {
    authService.removeToken();
    setCurrentToken(null);
    setToken("");
    setMessage("Token cleared");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(DEFAULT_TOKEN);
    setMessage("Token copied to clipboard!");
  };

  const decodeToken = (tokenString: string) => {
    try {
      const payload = tokenString.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch {
      return null;
    }
  };

  const tokenData = currentToken ? decodeToken(currentToken) : null;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Token Debug Tool
            </CardTitle>
            <CardDescription>
              Manually set JWT token for testing the API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quick Action */}
            <div className="p-4 bg-brand-primary/5 rounded-lg border border-brand-primary/20">
              <p className="text-sm font-medium mb-3">Quick Start:</p>
              <Button 
                onClick={handleUseDefaultToken}
                className="w-full"
                variant="default"
              >
                Use Default Admin Token (admin@example.com)
              </Button>
            </div>

            {/* Manual Token Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Or enter your token manually:</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Paste your JWT token here..."
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="font-mono text-xs"
                />
                <Button onClick={handleSetToken}>
                  Set Token
                </Button>
              </div>
            </div>

            {/* Current Token Status */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Token Status:</span>
                {currentToken ? (
                  <span className="flex items-center gap-1 text-success text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Active
                  </span>
                ) : (
                  <span className="text-muted-foreground text-sm">No token set</span>
                )}
              </div>
              
              {currentToken && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs font-mono break-all">
                    {currentToken.substring(0, 50)}...
                  </p>
                </div>
              )}
            </div>

            {/* Token Data */}
            {tokenData && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Token Information:</p>
                <div className="p-3 bg-muted rounded-lg space-y-1 text-sm">
                  <p><strong>Email:</strong> {tokenData["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || "N/A"}</p>
                  <p><strong>User ID:</strong> {tokenData["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid"] || "N/A"}</p>
                  <p><strong>Audience:</strong> {tokenData.aud || "N/A"}</p>
                  <p><strong>Issuer:</strong> {tokenData.iss || "N/A"}</p>
                  <p><strong>Expires:</strong> {tokenData.exp ? new Date(tokenData.exp * 1000).toLocaleString() : "N/A"}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button 
                onClick={handleClearToken}
                variant="outline"
                className="flex-1"
              >
                Clear Token
              </Button>
              <Button 
                onClick={copyToClipboard}
                variant="outline"
                className="flex-1"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Default Token
              </Button>
            </div>

            {/* Message */}
            {message && (
              <div className={`p-3 rounded-lg text-sm ${
                message.includes("success") || message.includes("Redirecting") 
                  ? "bg-success/10 text-success" 
                  : "bg-muted text-foreground"
              }`}>
                {message}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to use:</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>1. Click &quot;Use Default Admin Token&quot; to quickly set the admin token</p>
            <p>2. Or paste your own JWT token and click &quot;Set Token&quot;</p>
            <p>3. Once the token is set, you'll be redirected to /talent</p>
            <p>4. The token will be automatically included in all API requests</p>
            <div className="mt-4 p-3 bg-warning/10 rounded-lg">
              <p className="text-warning text-sm">
                <strong>Note:</strong> The default token expires on {new Date(1754624226 * 1000).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}