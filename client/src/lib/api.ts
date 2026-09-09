export type AccountRole = "volunteer" | "organization";
export type AuthUser = { id: string; name: string; email: string; role: AccountRole };
type AuthResponse = { user: AuthUser; message?: string };

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

async function requestAuth(path: string, payload: Record<string, string>): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/auth/${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const data = (await response.json().catch(() => ({}))) as AuthResponse;
  if (!response.ok || !data.user) throw new Error(data.message ?? "Ocurrio un error inesperado.");
  return data.user;
}

export function register(payload: { name: string; email: string; password: string; role: AccountRole }) { return requestAuth("register", payload); }
export function login(payload: { email: string; password: string; role: AccountRole }) { return requestAuth("login", payload); }
