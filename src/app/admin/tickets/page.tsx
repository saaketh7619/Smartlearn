'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
} from 'lucide-react';
import { db } from '@/lib/db';
import { SupportTicket } from '@/types';

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(db.tickets);

  const handleStatusChange = (id: string, newStatus: 'Open' | 'In Progress' | 'Resolved') => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Help Desk & Support Tickets
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor and resolve technical, academic, and device accessibility tickets from users.
        </p>
      </div>

      <div className="space-y-3">
        {tickets.map((t) => (
          <div
            key={t.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-slate-400 font-bold">{t.id}</span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500">
                  {t.userName} ({t.userRole})
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    t.priority === 'High'
                      ? 'bg-rose-100 text-rose-700'
                      : t.priority === 'Medium'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {t.priority} Priority
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t.subject}</h3>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={t.status}
                onChange={(e) =>
                  handleStatusChange(t.id, e.target.value as 'Open' | 'In Progress' | 'Resolved')
                }
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                  t.status === 'Resolved'
                    ? 'border-emerald-300 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
                    : t.status === 'In Progress'
                    ? 'border-blue-300 text-blue-600 bg-blue-50 dark:bg-blue-950/40'
                    : 'border-amber-300 text-amber-600 bg-amber-50 dark:bg-amber-950/40'
                }`}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
