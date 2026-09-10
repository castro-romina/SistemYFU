export type AccountRole = "volunteer" | "organization";

interface AuthResponse {
  name: string;
  email: string;
  role: AccountRole;
  token: string;
}

const API_URL = "http://localhost:4000/api";

export async function login(data: any): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
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
  const response = await fetch("http://localhost:4000/api/auth/register", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json" // 👈 Clave para que express.json() funcione
    },
    body: JSON.stringify(data), // 👈 Envía { name, email, password, role }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Server error 500");
  }
  return response.json();
}
