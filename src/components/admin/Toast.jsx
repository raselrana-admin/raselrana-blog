"use client";

import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(() => {});

/** const toast = useToast(); toast("Saved"); */
export function useToast() {
  return useContext(ToastContext);
}

/**
 * Small pop-up messages at the bottom of the admin (the main site's dashboard has the
 * same). Only for successes: errors stay inline (role="alert") so they are not missed.
 * The live region is always present, so screen readers announce each new message.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[120] flex flex-col items-center gap-2 px-6"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="rise flex max-w-xl items-center gap-2 rounded-full bg-[var(--ink)] px-4 py-2.5 text-sm font-medium text-[var(--paper)] shadow-lg"
          >
            <span aria-hidden>✓</span>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
