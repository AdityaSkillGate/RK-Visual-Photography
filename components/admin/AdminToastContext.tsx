"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  toast: (options: Omit<Toast, "id">) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function AdminToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type, title, message, duration = 4000 }: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    [dismiss]
  );

  const success = useCallback(
    (message: string, title?: string) => toast({ type: "success", title, message }),
    [toast]
  );
  const error = useCallback(
    (message: string, title?: string) => toast({ type: "error", title, message }),
    [toast]
  );
  const warning = useCallback(
    (message: string, title?: string) => toast({ type: "warning", title, message }),
    [toast]
  );
  const info = useCallback(
    (message: string, title?: string) => toast({ type: "info", title, message }),
    [toast]
  );

  return (
    <ToastContext.Provider
      value={{ toasts, toast, success, error, warning, info, dismiss }}
    >
      {children}
      {/* Toast Notification Container */}
      <aside
        aria-label="Notifications"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((t) => {
          const isSuccess = t.type === "success";
          const isError = t.type === "error";
          const isWarning = t.type === "warning";

          return (
            <div
              key={t.id}
              role="status"
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
                isSuccess
                  ? "bg-charcoal-900/95 border-emerald-500/30 text-emerald-300"
                  : isError
                  ? "bg-charcoal-900/95 border-red-500/40 text-red-300"
                  : isWarning
                  ? "bg-charcoal-900/95 border-amber-500/30 text-amber-300"
                  : "bg-charcoal-900/95 border-gold-500/30 text-gold-300"
              }`}
            >
              <div className="shrink-0 pt-0.5">
                {isSuccess && <CheckCircle2 size={18} className="text-emerald-400" />}
                {isError && <AlertCircle size={18} className="text-red-400" />}
                {isWarning && <AlertTriangle size={18} className="text-amber-400" />}
                {t.type === "info" && <Info size={18} className="text-gold-400" />}
              </div>

              <div className="flex-1 min-w-0">
                {t.title && (
                  <p className="text-xs font-semibold uppercase tracking-wider text-ivory-100">
                    {t.title}
                  </p>
                )}
                <p className="text-xs text-sand-300 font-light leading-relaxed">
                  {t.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="shrink-0 rounded-lg p-1 text-sand-400 hover:text-ivory-100 hover:bg-charcoal-800 transition-colors"
                aria-label="Close notification"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </aside>
    </ToastContext.Provider>
  );
}

export function useAdminToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useAdminToast must be used within an AdminToastProvider");
  }
  return context;
}
