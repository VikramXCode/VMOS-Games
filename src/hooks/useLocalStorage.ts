import { useCallback, useEffect, useState } from "react";

// Simple typed wrapper around localStorage with JSON serialization.
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        setValue(JSON.parse(raw) as T);
      } else {
        window.localStorage.setItem(key, JSON.stringify(defaultValue));
      }
    } catch (error) {
      console.error("useLocalStorage read error", error);
      setValue(defaultValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch (error) {
          console.error("useLocalStorage write error", error);
        }
        return resolved;
      });
    },
    [key]
  );

  return [value, update] as const;
}
