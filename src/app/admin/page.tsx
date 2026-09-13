'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shield,
  Users,
  BookOpen,
  FileQuestion,
  TrendingUp,
  Activity,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Server,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { db } from '@/lib/db';

export default function AdminDashboardPage() {
  const usageData = [
    { day: 'Day 1', activeUsers: 480 },
    { day: 'Day 5', activeUsers: 620 },
    { day: 'Day 10', activeUsers: 850 },
    { day: 'Day 15', activeUsers: 910 },
    { day: 'Day 20', activeUsers: 1120 },
    { day: 'Day 25', activeUsers: 1190 },
    { day: 'Day 30', activeUsers: 1240 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. ADMIN COMMAND HEADER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-800 text-white shadow-xl shadow-amber-500/15">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-amber-100">
              Operational Nerve Center · Principal Console
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">
              Administrator Command Hub
            </h1>
            <p className="text-amber-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              Monitoring 1,240 active students, 85 faculty members, and real-time anti-cheat telemetry across the ecosystem.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-center">
              <span className="text-[10px] text-amber-100 uppercase tracking-wider block">Uptime</span>
              <span className="text-lg font-black">99.98%</span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-center">
              <span className="text-[10px] text-amber-100 uppercase tracking-wider block">AI Latency</span>
              <span className="text-lg font-black">320ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. KPI STAT CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Total Students</span>
            <Users className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">1,240</div>
          <span className="text-[10px] text-emerald-500 font-bold">+18 enrolled this week</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Faculty Members</span>
            <Users className="w-3.5 h-3.5 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">85</div>
          <span className="text-[10px] text-purple-400 font-bold">Across 6 STEM Depts</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Active Courses</span>
            <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">42</div>
          <span className="text-[10px] text-emerald-500 font-bold">All syllabus mapped</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Active Tests Running</span>
            <FileQuestion className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-500 mt-1">18 Live</div>
          <span className="text-[10px] text-amber-500 font-bold">Anti-cheat active</span>
        </div>
      </div>

      {/* 3. PLATFORM USAGE TREND CHART & QUICK OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Usage Trend Line Chart */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                Monthly Platform Engagement & Active Logins
              </h3>
              <p className="text-xs text-slate-500">Daily active student and teacher sessions over the last 30 days</p>
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
              +42% Growth
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageData} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[400, 1400]} />
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
                  dataKey="activeUsers"
                  name="Active Logins"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#f59e0b' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Queues Summary */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">Moderation & Support Queues</h3>
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-amber-900 dark:text-amber-200">Moderation Queue</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[10px]">
                    2 Flagged
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Student forum posts pending review</p>
                <Link
                  href="/admin/moderation/"
                  prefetch={true}
                  className="mt-2 text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline inline-block"
                >
                  Review Queue →
                </Link>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-blue-900 dark:text-blue-200">Support Tickets</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[10px]">
                    1 In Progress
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Audio playback ticket logged by Alex</p>
                <Link
                  href="/admin/tickets/"
                  prefetch={true}
                  className="mt-2 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline inline-block"
                >
                  Manage Tickets →
                </Link>
              </div>
            </div>
          </div>

          <Link
            href="/admin/users/"
            prefetch={true}
            className="w-full py-2.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold text-center transition-all hover:opacity-90 shadow-md flex items-center justify-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            Manage All Users & RBAC
          </Link>
        </div>
      </div>
    </div>
  );
}
