import { useEffect, useState } from "react";

export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void, boolean] => {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve from localStorage
    const item = window.localStorage.getItem(key);
    if (item && item !== "undefined") {
      setStoredValue(JSON.parse(item));
    }
    setLoading(false);
  }, [key]);

  const setValue = (value: T) => {
    // Save state
    setStoredValue(value);
    // Save to localStorage
    window.localStorage.setItem(key, JSON.stringify(value));
  };
  return [storedValue, setValue, loading];
};
