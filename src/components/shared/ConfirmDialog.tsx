'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'destructive' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
  /** Optional icon override */
  icon?: React.ReactNode;
}

/**
 * Accessible confirmation dialog.
 * - Focus is trapped inside while open.
 * - Pressing Escape calls onCancel.
 * - Focus is restored to the trigger element on close.
 * - No browser alert() calls.
 * - Fully keyboard and screen-reader accessible.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'info',
  onConfirm,
  onCancel,
  icon,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Save and restore focus
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Delay to ensure dialog is rendered
      requestAnimationFrame(() => cancelButtonRef.current?.focus());
    } else {
      previousFocusRef.current?.focus();
    }
  }, [open]);

  // Escape key handler
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  // Focus trap
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !dialogRef.current) return;
    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute('disabled'));

    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, []);

  if (!open) return null;

  const isDestructive = variant === 'destructive';
  const defaultIcon = isDestructive ? (
    <Trash2 className="w-6 h-6 text-rose-600 dark:text-rose-400" />
  ) : (
    <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby={description ? 'confirm-dialog-desc' : undefined}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog panel */}
      <div
        ref={dialogRef}
        onKeyDown={handleKeyDown}
        className="relative z-10 w-full max-w-sm bg-white dark:bg-[#1a1e24] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#283038] p-6 space-y-5 animate-in zoom-in-95 duration-200"
      >
        {/* Close × */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon + Title */}
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              isDestructive ? 'bg-rose-100 dark:bg-rose-950/50' : 'bg-amber-100 dark:bg-amber-950/50'
            }`}
          >
            {icon ?? defaultIcon}
          </div>
          <div>
            <h2 id="confirm-dialog-title" className="font-extrabold text-sm text-slate-900 dark:text-white">
              {title}
            </h2>
            {description && (
              <p id="confirm-dialog-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-1">
          <button
            ref={cancelButtonRef}
            onClick={onCancel}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-colors ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-[#d82a4e] hover:bg-[#c32646]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to manage a single ConfirmDialog's open state and callbacks.
 * Usage:
 *   const { dialogProps, confirm } = useConfirmDialog();
 *   const doDelete = async () => { const ok = await confirm({ title: '...', ... }); if (ok) { ... } };
 *   return <ConfirmDialog {...dialogProps} />;
 */
export function useConfirmDialog() {
  const [state, setState] = React.useState<{
    open: boolean;
    props: Omit<ConfirmDialogProps, 'open' | 'onConfirm' | 'onCancel'>;
    resolve?: (result: boolean) => void;
  }>({ open: false, props: { title: '' } });

  const confirm = (props: Omit<ConfirmDialogProps, 'open' | 'onConfirm' | 'onCancel'>): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({ open: true, props, resolve });
    });
  };

  const handleConfirm = () => {
    setState((s) => ({ ...s, open: false }));
    state.resolve?.(true);
  };

  const handleCancel = () => {
    setState((s) => ({ ...s, open: false }));
    state.resolve?.(false);
  };

  return {
    confirm,
    dialogProps: {
      open: state.open,
      ...state.props,
      onConfirm: handleConfirm,
      onCancel: handleCancel,
    } as ConfirmDialogProps,
  };
}
