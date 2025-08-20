import { cookies } from "next/headers";

/**
 * Get auth token from cookies (for server components)
 */
export async function getServerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");
  return token?.value || null;
}

/**
 * Check if user is authenticated on the server
 */
export async function isAuthenticatedServer(): Promise<boolean> {
  const token = await getServerToken();
  return !!token;
}