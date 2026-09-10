'use client';

import React from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Clock,
  HelpCircle,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

export default function TeacherAnalyticsPage() {
  // Stacked Bar Data: Conceptual Gaps vs Poor Time Management vs Careless Errors
  const mistakeTypeData = [
    { chapter: 'Quadratic Curves', conceptualGaps: 54, carelessErrors: 18, timeManagement: 28 },
    { chapter: 'Limits & Continuity', conceptualGaps: 22, carelessErrors: 15, timeManagement: 63 },
    { chapter: 'Differential Chain Rule', conceptualGaps: 30, carelessErrors: 45, timeManagement: 25 },
    { chapter: 'Kinematics Vectors', conceptualGaps: 35, carelessErrors: 20, timeManagement: 45 },
    { chapter: 'Combinatorics', conceptualGaps: 65, carelessErrors: 15, timeManagement: 20 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Exam Weakness & Mistake Classification Analyzer
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Cognitive breakdown analyzing whether student errors stem from fundamental conceptual misunderstandings, careless calculations, or poor pacing.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Conceptual Gaps (41%)
          </span>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Highest in Combinatorics and Quadratic curves. Students struggle with algebraic formulation rather than calculation.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Poor Time Management (36%)
          </span>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Highest in Limits and Kinematics. 14 students ran out of time on multi-step derivation questions.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Careless Errors (23%)
          </span>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Negative sign slips and basic arithmetic oversights. Can be mitigated through self-checking drills.
          </p>
        </div>
      </div>

      {/* Stacked Bar Chart */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              Class Mistake Classification by Chapter (% Distribution)
            </h3>
            <p className="text-xs text-slate-500">Stacked view of student error vectors across assessments</p>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mistakeTypeData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
              <XAxis dataKey="chapter" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  borderColor: '#334155',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="conceptualGaps" name="Conceptual Gaps (%)" stackId="a" fill="#ef4444" />
              <Bar dataKey="timeManagement" name="Time Management (%)" stackId="a" fill="#f59e0b" />
              <Bar dataKey="carelessErrors" name="Careless Errors (%)" stackId="a" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
