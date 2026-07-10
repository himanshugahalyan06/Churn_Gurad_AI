import React, { createContext, useContext, useState, useCallback } from 'react';

const HistoryContext = createContext(null);

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState([]);

  const addEntry = useCallback((formData, prediction, shapData) => {
    const entry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      formData,
      prediction,
      shapData,
    };
    setHistory((prev) => [entry, ...prev].slice(0, 50)); // keep last 50
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  return (
    <HistoryContext.Provider value={{ history, addEntry, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export const useHistory = () => {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error('useHistory must be used within HistoryProvider');
  return ctx;
};
