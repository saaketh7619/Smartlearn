'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  AlertTriangle,
  BarChart3,
  PlusCircle,
  Wand2,
  MessageSquare,
  Printer,
  ArrowRight,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  FileQuestion,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { db } from '@/lib/db';

export default function TeacherDashboardPage() {
  const weakTopics = db.weakTopics;
  const students = db.users.filter((u) => u.role === 'STUDENT').slice(0, 5);

  const weakTopicsChartData = [
    { topic: 'Quadratic Curves', studentsStruggling: 18, fill: '#ef4444' },
    { topic: 'Wave Optics', studentsStruggling: 14, fill: '#f97316' },
    { topic: 'Organic Reactions', studentsStruggling: 11, fill: '#f59e0b' },
    { topic: 'Combinatorics', studentsStruggling: 22, fill: '#dc2626' },
    { topic: 'Projectile Range', studentsStruggling: 8, fill: '#3b82f6' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. TEACHER WELCOME & QUICK ACTIONS HEADER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-900 text-white shadow-xl shadow-purple-500/15">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-purple-200">
              Department of Mathematics & STEM · Class 10-A
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">
              Welcome back, Dr. Sarah Jenkins 👋
            </h1>
            <p className="text-purple-200 text-xs sm:text-sm max-w-xl leading-relaxed">
              Your class average is sitting strong at <strong className="text-white font-bold">78.4%</strong>.
              18 students are struggling with Quadratic Equations — review recommendations below.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/teacher/tests/create/"
              prefetch={true}
              className="px-4 py-2.5 rounded-2xl bg-white text-purple-900 text-xs font-black hover:bg-purple-50 transition-all shadow-md flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-purple-600" />
              Create Test
            </Link>
            <Link
              href="/teacher/generator/"
              prefetch={true}
              className="px-4 py-2.5 rounded-2xl bg-purple-600/80 hover:bg-purple-600 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-2"
            >
              <Wand2 className="w-4 h-4" />
              AI Paper Gen
            </Link>
            <Link
              href="/teacher/messages/"
              prefetch={true}
              className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Broadcast
            </Link>
          </div>
        </div>
      </div>

      {/* 2. STAT CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] text-slate-400">Class Average Score</span>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">78.4%</div>
          <span className="text-[10px] text-emerald-500 font-bold">+3.8% from last month</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] text-slate-400">Enrolled Students</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">32</div>
          <span className="text-[10px] text-slate-400 font-medium">Class 10-A (Grade 10)</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] text-slate-400">Average Attendance</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">94.2%</div>
          <span className="text-[10px] text-emerald-500 font-bold">Excellent presence</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] text-slate-400">Active Test Submissions</span>
          <div className="text-2xl font-black text-amber-500 mt-1">29 / 32</div>
          <span className="text-[10px] text-amber-500 font-bold">3 pending submissions</span>
        </div>
      </div>

      {/* 3. COMMON WEAK TOPICS BAR CHART & ATTENTION LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weak Topics Bar Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-500" />
                  Class Common Weak Topics
                </h3>
                <p className="text-xs text-slate-500">Number of students requiring revision drills</p>
              </div>
              <span className="text-[11px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-full">
                18 on Quadratics
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weakTopicsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="topic" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 25]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      borderColor: '#334155',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="studentsStruggling" radius={[8, 8, 0, 0]}>
                    {weakTopicsChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">Recommended: Schedule automated quadratic drill</span>
            <Link
              href="/teacher/analytics/"
              prefetch={true}
              className="font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              Full Breakdown →
            </Link>
          </div>
        </div>

        {/* Students Needing Attention Panel */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-rose-500 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Students Needing Attention (3)
                </h3>
                <p className="text-xs text-slate-500">Flagged due to test scores below 60% or attendance drop</p>
              </div>
              <Link
                href="/teacher/roster/"
                prefetch={true}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
              >
                View Roster →
              </Link>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Noah Patel', roll: 'SJA-2026-1002', issue: 'Scored 54% in Quadratics Diagnostic', action: 'Assign Drill' },
                { name: 'Lucas Silva', roll: 'SJA-2026-1006', issue: 'Scored 58% in Wave Optics & 2 absences', action: 'Message Parent' },
                { name: 'Mason Takahashi', roll: 'SJA-2026-1008', issue: 'Missed Calculus Lesson 2.2 homework', action: 'Send Reminder' },
              ].map((std) => (
                <div
                  key={std.name}
                  className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">{std.name}</h4>
                    <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-0.5">{std.issue}</p>
                  </div>
                  <Link
                    href={`/teacher/roster/?student=${encodeURIComponent(std.name)}`}
                    prefetch={true}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-purple-600 hover:text-white transition-colors"
                  >
                    Inspect
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Automated interventions enabled</span>
            <Link href="/teacher/messages/" prefetch={true} className="text-purple-600 dark:text-purple-400 font-bold hover:underline">
              Send Group Message →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
