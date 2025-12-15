// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // Функция для безопасного получения данных
  const getStoredValue = () => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = localStorage.getItem(key);

      if (item === null) {
        // Если ключа нет, сохраняем начальное значение
        localStorage.setItem(key, JSON.stringify(initialValue));
        return initialValue;
      }

      const parsed = JSON.parse(item);

      if (parsed === null || parsed === undefined) {
        localStorage.setItem(key, JSON.stringify(initialValue));
        return initialValue;
      }

      return parsed;
    } catch (error) {
      console.error(`Ошибка чтения из localStorage:`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(getStoredValue);

  // Синхронизация с localStorage при изменении значения
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      if (storedValue !== undefined && storedValue !== null) {
        localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(`Ошибка записи в localStorage:`, error);
    }
  }, [key, storedValue]);

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      if (valueToStore === undefined) {
        console.warn('Попытка сохранить undefined в localStorage');
        return;
      }

      setStoredValue(valueToStore);
    } catch (error) {
      console.error(`Ошибка установки значения:`, error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;