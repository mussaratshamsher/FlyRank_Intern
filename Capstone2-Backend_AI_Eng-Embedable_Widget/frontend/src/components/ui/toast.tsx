'use client';

import { useState, useEffect, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let addToastFn: ((toast: Omit<Toast, 'id'>) => void) | null = null;

export function toast(message: string, type: ToastType = 'info') {
  if (addToastFn) {
    addToastFn({ message, type });
  }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    addToastFn = (newToast) => {
      const id = Math.random().toString(36).substring(7);
      setToasts((prev) => [...prev, { ...newToast, id }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };
    return () => {
      addToastFn = null;
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`animate-in fade-in slide-in-from-bottom-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium border ${
            t.type === 'success'
              ? 'bg-[rgba(124,58,237,0.15)] border-[rgba(124,58,237,0.35)] text-[#c4b5fd]'
              : t.type === 'error'
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : t.type === 'warning'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-sky-500/10 border-sky-500/30 text-sky-400'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    toast(message, type);
  }, []);
  return { addToast };
}
