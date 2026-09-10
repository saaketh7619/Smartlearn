'use client';

import React from 'react';
import Link from 'next/link';
import {
  BellRing,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function ParentAlertsPage() {
  const alerts = [
    {
      id: 'alt-1',
      title: 'District Math Olympiad Diagnostic Scheduled',
      severity: 'Urgent Action',
      date: 'Next Saturday at 10:00 AM',
      description: 'Alex has been enrolled by Dr. Sarah Jenkins. 2 revision sessions have been scheduled in his AI study planner.',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900',
    },
    {
      id: 'alt-2',
      title: 'Physics Homework #4 Due Reminder',
      severity: 'Upcoming',
      date: 'Tomorrow at 11:59 PM',
      description: 'Module on Newton\'s Laws is 65% complete. Alex has 2 remaining practice problems.',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900',
    },
    {
      id: 'alt-3',
      title: 'Commendable Attendance & Streak Titan Milestone',
      severity: 'Celebration',
      date: 'Achieved Yesterday',
      description: 'Alex unlocked 7 days of consecutive study, placing his streak in the top 5% of St. Jude Academy.',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Parent Smart Alerts
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Surfacing only what genuinely needs your attention without overwhelming you with noise.
        </p>
      </div>

      <div className="space-y-4">
        {alerts.map((a) => (
          <div
            key={a.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border w-fit ${a.badgeColor}`}>
                {a.severity}
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {a.date}
              </span>
            </div>

            <h3 className="font-bold text-base text-slate-900 dark:text-white">{a.title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{a.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
