import { httpClient } from "@/infrastructure/http/http-client";
import { z } from "zod";

// Schemas
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const AuthResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string().optional(),
    role: z.string().optional(),
  }).optional(),
});

export type LoginDto = z.infer<typeof LoginSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

class AuthService {
  private readonly TOKEN_KEY = "auth_token";
  private readonly USER_KEY = "auth_user";

  /**
   * Login with email and password
   */
  async login(credentials: LoginDto): Promise<AuthResponse> {
    try {
      // Call auth endpoint
      const response = await httpClient.post<any>("/auth", credentials);
      
      // Extract token from response
      const token = response.token || response.data?.token || response.accessToken;
      
      if (!token) {
        throw new Error("No token received from server");
      }

      // Store token
      this.setToken(token);
      
      // Store user info if available
      if (response.user || response.data?.user) {
        this.setUser(response.user || response.data.user);
      }
      
      // Set token in HTTP client for future requests
      httpClient.setAuthToken(token);
      
      return {
        token,
        user: response.user || response.data?.user,
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  /**
   * Logout
   */
  logout(): void {
    this.removeToken();
    this.removeUser();
    httpClient.removeAuthToken();
    
    // Redirect to login
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    
    // Try localStorage first with multiple keys
    const localToken = localStorage.getItem(this.TOKEN_KEY) || localStorage.getItem('token');
    if (localToken) return localToken;
    
    // Try cookie as fallback
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === this.TOKEN_KEY || name === 'token') {
        return decodeURIComponent(value);
      }
    }
    
    return null;
  }

  /**
   * Set token in both localStorage and cookie
   */
  setToken(token: string): void {
    if (typeof window === "undefined") return;
    
    // Set in localStorage
    localStorage.setItem(this.TOKEN_KEY, token);
    
    // Also store just 'token' key for compatibility
    localStorage.setItem('token', token);
    
    // Set in cookie for server-side access
    document.cookie = `${this.TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    
    // Set in HTTP client
    httpClient.setAuthToken(token);
    
    // Dispatch custom event to notify other parts of the app
    window.dispatchEvent(new Event('tokenChanged'));
  }

  /**
   * Remove token from both storage methods
   */
  removeToken(): void {
    if (typeof window === "undefined") return;
    
    // Remove from localStorage
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('token');
    
    // Remove cookie
    document.cookie = `${this.TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    
    // Remove from HTTP client
    httpClient.removeAuthToken();
    
    // Dispatch custom event
    window.dispatchEvent(new Event('tokenChanged'));
  }

  /**
   * Get stored user
   */
  getUser(): any {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Set user
   */
  setUser(user: any): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Remove user
   */
  removeUser(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Initialize auth on app load
   */
  initialize(): void {
    const token = this.getToken();
    if (token) {
      httpClient.setAuthToken(token);
    }
  }

  /**
   * Refresh token if needed
   */
  async refreshToken(): Promise<string | null> {
    // Implement if your backend supports token refresh
    return null;
  }
}

export const authService = new AuthService();