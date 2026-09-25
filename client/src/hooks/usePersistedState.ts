import { useState, useEffect } from "react";

/**
 * Igual que useState, pero persiste el valor en sessionStorage
 * bajo la key indicada. Se recupera solo al montar el componente.
 */
export function usePersistedState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = sessionStorage.getItem(key);
      return stored !== null ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      // sessionStorage lleno o deshabilitado: se ignora, no rompe el form
    }
  }, [key, value]);

  return [value, setValue] as const;
}

/** Limpia todas las keys de un step (llamar al terminar el flujo con éxito) */
export function clearPersistedKeys(keys: string[]) {
  keys.forEach((k) => sessionStorage.removeItem(k));
}