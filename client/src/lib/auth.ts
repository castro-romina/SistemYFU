export type AccountRole = "volunteer" | "organization";

export interface StoredUser {
  name: string;
  email: string;
  role: AccountRole;
  token: string;
  [key: string]: unknown;
}

const KEY = "matchvol-user";

const isExpired = (token: string): boolean => {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return typeof payload.exp === "number" && payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// Devuelve el usuario solo si hay un token vigente
export const getUser = (): StoredUser | null => {
  try {
    const user = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!user?.token || isExpired(user.token)) return null;
    return user;
  } catch {
    return null;
  }
};

export const getToken = (): string | null => getUser()?.token ?? null;

export const saveUser = (user: StoredUser) => localStorage.setItem(KEY, JSON.stringify(user));

// Cierra la sesión y borra también los datos a medio cargar del onboarding
export const logout = () => {
  localStorage.removeItem(KEY);
  Object.keys(localStorage)
    .filter((k) => k.startsWith("onboarding-"))
    .forEach((k) => localStorage.removeItem(k));
};

// Por ahora todos aterrizan en /InProgress
export const homeFor = (_user: StoredUser): string => "/InProgress";