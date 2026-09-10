"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { AlertTriangle, HelpCircle, X } from "lucide-react";

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "primary";
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function AdminConfirmProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null);

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts);
    setIsOpen(true);
    setIsLoading(false);

    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const handleClose = useCallback((result: boolean) => {
    setIsOpen(false);
    if (resolverRef.current) {
      resolverRef.current(result);
      resolverRef.current = null;
    }
  }, []);

  // Keyboard shortcut listener: ESC to cancel
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Autofocus confirm button
    setTimeout(() => {
      confirmButtonRef.current?.focus();
    }, 50);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  const variant = options?.variant || "primary";
  const isDanger = variant === "danger";
  const isWarning = variant === "warning";

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {isOpen && options && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-charcoal-950/80 backdrop-blur-sm transition-opacity animate-in fade-in"
            onClick={() => !isLoading && handleClose(false)}
          />

          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-bronze-border bg-charcoal-900 p-6 shadow-card-luxury animate-in zoom-in-95 fade-in duration-200">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                  isDanger
                    ? "border-red-500/30 bg-red-500/10 text-red-400"
                    : isWarning
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                    : "border-gold-500/30 bg-gold-500/10 text-gold-400"
                }`}
              >
                {isDanger || isWarning ? (
                  <AlertTriangle size={22} />
                ) : (
                  <HelpCircle size={22} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  id="confirm-dialog-title"
                  className="font-display text-lg font-medium text-ivory-100"
                >
                  {options.title}
                </h3>
                <p className="mt-1.5 text-xs text-sand-400 font-light leading-relaxed">
                  {options.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleClose(false)}
                disabled={isLoading}
                className="shrink-0 rounded-lg p-1 text-sand-500 hover:text-ivory-100 hover:bg-charcoal-800 transition-colors"
                aria-label="Close dialog"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-bronze-border/40">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleClose(false)}
                className="rounded-xl border border-bronze-border bg-charcoal-850 px-4 py-2 text-xs font-medium uppercase tracking-editorial text-sand-300 hover:bg-charcoal-800 hover:text-ivory-100 transition-colors disabled:opacity-50"
              >
                {options.cancelText || "Cancel"}
              </button>

              <button
                ref={confirmButtonRef}
                type="button"
                disabled={isLoading}
                onClick={() => handleClose(true)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-editorial transition-all shadow-md disabled:opacity-50 ${
                  isDanger
                    ? "bg-red-600 text-white hover:bg-red-500 shadow-red-950/50"
                    : isWarning
                    ? "bg-amber-600 text-white hover:bg-amber-500 shadow-amber-950/50"
                    : "bg-gold-500 text-charcoal-950 hover:bg-gold-400 shadow-gold-subtle"
                }`}
              >
                {options.confirmText || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useAdminConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useAdminConfirm must be used within an AdminConfirmProvider");
  }
  return context.confirm;
}
