import { getToken, logout, type AccountRole } from "./auth";

export type { AccountRole };

interface AuthResponse {
  name: string;
  email: string;
  role: AccountRole;
  token: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Para endpoints que requieren sesión: agrega el token y, si el servidor lo rechaza, cierra la sesión
async function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (response.status === 401) {
    logout();
    window.location.replace("/login");
    throw new Error("Your session expired. Please sign in again.");
  }
  return response;
}

export async function login(data: any): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to sign in.");
  }
  return response.json();
}

export async function register(data: any): Promise<any> {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Server error 500");
  }
  return response.json();
}

export async function forgotPassword(data: { email: string; role: AccountRole }): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to send reset link.");
  }
  return response.json();
}

export async function resetPassword(data: { token: string; newPassword: string }): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to reset password.");
  }
  return response.json();
}

export async function completeOnboarding(data: any): Promise<any> {
  const response = await authFetch("/api/auth/complete-onboarding", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to complete onboarding.");
  }
  return response.json();
}

export async function completeOrgOnboarding(data: any): Promise<any> {
  const response = await authFetch("/api/auth/complete-org-onboarding", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to complete organization onboarding.");
  }
  return response.json();
}