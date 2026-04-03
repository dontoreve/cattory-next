"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface ToastItem {
  id: number;
  message: string;
  type: "error" | "success";
}

interface ToastContextValue {
  showToast: (message: string, type?: "error" | "success") => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(
    (message: string, type: "error" | "success" = "error") => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container — slides down from top */}
      <div className="fixed top-6 left-1/2 z-[9999] flex flex-col items-center gap-2 pointer-events-none -translate-x-1/2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold backdrop-blur-xl border animate-[slide-down_0.4s_cubic-bezier(0.34,1.56,0.64,1)] ${
              toast.type === "error"
                ? "bg-red-500/90 text-white border-red-400/30"
                : "bg-emerald-500/90 text-white border-emerald-400/30"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
