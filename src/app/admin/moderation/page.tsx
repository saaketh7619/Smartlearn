'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Check,
  X,
  MessageSquare,
  FileText,
  Clock,
  User,
} from 'lucide-react';
import { db } from '@/lib/db';
import { useStore } from '@/store/useStore';
import { ModerationItem } from '@/types';

export default function AdminModerationPage() {
  const triggerConfetti = useStore((state) => state.triggerConfetti);
  const [queue, setQueue] = useState<ModerationItem[]>(db.moderation);
  const [toast, setToast] = useState<string | null>(null);

  const handleAction = (id: string, action: 'Approved' | 'Rejected') => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: action } : item))
    );
    setToast(`Item ${action.toLowerCase()} successfully.`);
    setTimeout(() => setToast(null), 2500);
    if (action === 'Approved') triggerConfetti();
  };

  const pendingCount = queue.filter((i) => i.status === 'Pending').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white border border-slate-700 shadow-2xl text-xs font-bold animate-in slide-in-from-bottom-5">
          {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Content Moderation & Integrity Queue
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review community forum discussions, uploaded peer study guides, and flagged academic materials.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-xs font-bold">
          {pendingCount} Pending Review
        </span>
      </div>

      <div className="space-y-4">
        {queue.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {item.type}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500">Author: <strong>{item.authorName}</strong> ({item.authorRole})</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  item.status === 'Pending'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                    : item.status === 'Approved'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                }`}
              >
                {item.status}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 italic leading-relaxed">
              &ldquo;{item.contentSnippet}&rdquo;
            </div>

            <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 font-semibold">
              <AlertTriangle className="w-4 h-4" />
              <span>Flag Reason: {item.reasonFlagged}</span>
            </div>

            {item.status === 'Pending' && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleAction(item.id, 'Rejected')}
                  className="px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  Reject & Issue Warning
                </button>
                <button
                  onClick={() => handleAction(item.id, 'Approved')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Approve Content
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
