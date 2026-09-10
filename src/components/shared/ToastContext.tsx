'use client';

import React, { createContext, useContext, useCallback, useState, useRef, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, WifiOff, X } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'info' | 'warning' | 'offline';

interface Toast {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (options: Omit<Toast, 'id'>) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_STYLES: Record<ToastVariant, { bg: string; icon: React.ReactNode; border: string }> = {
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/60',
    border: 'border-emerald-200 dark:border-emerald-800',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />,
  },
  error: {
    bg: 'bg-rose-50 dark:bg-rose-950/60',
    border: 'border-rose-200 dark:border-rose-800',
    icon: <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />,
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/60',
    border: 'border-amber-200 dark:border-amber-800',
    icon: <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />,
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950/60',
    border: 'border-blue-200 dark:border-blue-800',
    icon: <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />,
  },
  offline: {
    bg: 'bg-slate-100 dark:bg-slate-800',
    border: 'border-slate-300 dark:border-slate-700',
    icon: <WifiOff className="w-4 h-4 text-slate-600 dark:text-slate-400 flex-shrink-0 mt-0.5" />,
  },
};

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const styles = VARIANT_STYLES[toast.variant];
  const [paused, setPaused] = useState(false);
  const elapsed = useRef(0);
  const startTime = useRef(Date.now());
  const duration = toast.duration ?? 4000;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const schedule = (remaining: number) => {
      timerRef.current = setTimeout(() => onDismiss(toast.id), remaining);
    };
    schedule(duration);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePause = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    elapsed.current += Date.now() - startTime.current;
    setPaused(true);
  };

  const handleResume = () => {
    startTime.current = Date.now();
    const remaining = Math.max(0, duration - elapsed.current);
    timerRef.current = setTimeout(() => onDismiss(toast.id), remaining);
    setPaused(false);
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      className={`flex items-start gap-3 p-4 rounded-2xl border shadow-lg ${styles.bg} ${styles.border} animate-in slide-in-from-right-4 duration-300 max-w-sm w-full`}
    >
      {styles.icon}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-900 dark:text-white">{toast.title}</p>
        {toast.description && (
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{toast.description}</p>
        )}
        {/* Progress bar */}
        <div className="mt-2 h-0.5 rounded-full bg-current opacity-20 overflow-hidden">
          <div
            className="h-full bg-current"
            style={{
              animation: paused ? 'none' : `shrink ${duration}ms linear forwards`,
            }}
          />
        </div>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((options: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev.slice(-4), { ...options, id }]); // cap at 5
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {/* Toast container */}
      <div
        aria-label="Notifications"
        className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 items-end"
        style={{ maxWidth: '24rem' }}
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');

  return {
    toast: ctx.toast,
    dismiss: ctx.dismiss,
    success: (title: string, description?: string) => ctx.toast({ variant: 'success', title, description }),
    error: (title: string, description?: string) => ctx.toast({ variant: 'error', title, description }),
    info: (title: string, description?: string) => ctx.toast({ variant: 'info', title, description }),
    warning: (title: string, description?: string) => ctx.toast({ variant: 'warning', title, description }),
    offline: () => ctx.toast({ variant: 'offline', title: 'You\'re offline', description: 'Changes will sync when your connection is restored.', duration: 6000 }),
  };
}
