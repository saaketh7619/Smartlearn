'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export default function ParentProgressPage() {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const progressTrends = [
    { period: 'Mon', score: 78, attendance: 100 },
    { period: 'Tue', score: 82, attendance: 100 },
    { period: 'Wed', score: 80, attendance: 100 },
    { period: 'Thu', score: 88, attendance: 100 },
    { period: 'Fri', score: 84, attendance: 100 },
    { period: 'Sat', score: 89, attendance: 100 },
    { period: 'Sun', score: 91, attendance: 100 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Child Progress & Learning Trends
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tracking Alex Rivera&apos;s daily, weekly, and monthly growth curve across subjects.
          </p>
        </div>

        {/* Time Selector */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setTimeRange('daily')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              timeRange === 'daily' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setTimeRange('weekly')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              timeRange === 'weekly' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeRange('monthly')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              timeRange === 'monthly' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Diagnostic Score Progression ({timeRange.toUpperCase()})
            </h3>
            <p className="text-xs text-slate-500">Consistent upward trajectory (+13% overall gain)</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
            Top 10% Cohort
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressTrends} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
              <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={[60, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  borderColor: '#334155',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                name="Diagnostic %"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, fill: '#10b981' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
