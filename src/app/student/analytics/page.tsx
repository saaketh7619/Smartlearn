'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  Sparkles,
  Table,
  LineChart,
  ArrowRight,
  Download,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
} from 'recharts';
import { db } from '@/lib/db';
import { useStore } from '@/store/useStore';
import { useToast } from '@/components/shared/ToastContext';

export default function StudentAnalyticsPage() {
  const currentUser = useStore((state) => state.currentUser);
  const toast = useToast();
  const [viewMode, setViewMode] = useState<'visual' | 'table'>('visual');

  const submissions = db.submissions;

  // Compute dynamic stats from submissions
  const totalSubmissions = submissions.length;
  const avgScore = totalSubmissions > 0
    ? Math.round(submissions.reduce((acc, s) => acc + s.percentage, 0) / totalSubmissions)
    : 84;

  const topicAccuracyData = [
    { topic: 'Differentiation', accuracy: 92, fill: '#3b82f6', subject: 'Mathematics' },
    { topic: 'Kinematics', accuracy: 85, fill: '#60a5fa', subject: 'Physics' },
    { topic: 'Limits & Calc', accuracy: 88, fill: '#3b82f6', subject: 'Mathematics' },
    { topic: 'Equilibrium', accuracy: 72, fill: '#10b981', subject: 'Chemistry' },
    { topic: 'NumPy / Python', accuracy: 94, fill: '#8b5cf6', subject: 'CompSci' },
    { topic: 'Quadratics', accuracy: 54, fill: '#f43f5e', subject: 'Mathematics' },
    { topic: 'Combinatorics', accuracy: 48, fill: '#f43f5e', subject: 'Mathematics' },
  ];

  const radarData = [
    { subject: 'Math', score: 88 },
    { subject: 'Physics', score: 82 },
    { subject: 'Chemistry', score: 72 },
    { subject: 'CompSci', score: 94 },
    { subject: 'Biology', score: 78 },
    { subject: 'Humanities', score: 80 },
  ];

  const handleExportReport = () => {
    const reportData = {
      student: currentUser?.name || 'Alex Rivera',
      grade: currentUser?.studentProfile?.grade || 'Grade 10',
      averageAccuracy: `${avgScore}%`,
      testsCompleted: totalSubmissions,
      generatedAt: new Date().toISOString(),
      topicScores: topicAccuracyData,
      subjectAverages: radarData,
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smartlearn-analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Report Exported', 'Downloaded performance analytics JSON summary.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real-Time Diagnostic Metrics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Performance Analytics &amp; Mastery
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Detailed cognitive breakdown of topic competencies, adaptive test accuracy, and wellness metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Visual / Accessible Table */}
          <button
            onClick={() => setViewMode(viewMode === 'visual' ? 'table' : 'visual')}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            {viewMode === 'visual' ? <Table className="w-3.5 h-3.5" /> : <LineChart className="w-3.5 h-3.5" />}
            <span>{viewMode === 'visual' ? 'Table View (A11y)' : 'Chart View'}</span>
          </button>

          <button
            onClick={handleExportReport}
            className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer hover:opacity-90"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] text-slate-400 block">Cumulative Accuracy</span>
          <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {avgScore}%
          </div>
          <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            +5.2% this month
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] text-slate-400 block">Tests Completed</span>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 mt-1">
            {totalSubmissions}
          </div>
          <span className="text-[10px] text-purple-500 font-bold">100% integrity rate</span>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] text-slate-400 block">Weak Topics Flagged</span>
          <div className="text-2xl sm:text-3xl font-black text-rose-500 mt-1">2</div>
          <span className="text-[10px] text-rose-400 font-bold truncate block">Quadratics, Combinatorics</span>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] text-slate-400 block">Active Study Time</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-500 mt-1">24.5 hrs</div>
          <span className="text-[10px] text-emerald-400 font-bold">7-day streak maintained</span>
        </div>
      </div>

      {viewMode === 'visual' ? (
        /* Main Charts Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Topic Accuracy Bar Chart */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  Topic Accuracy (% Correct)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Blue/Purple = High Competency, Red = Needs Practice Drill
                </p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topicAccuracyData}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
                >
                  <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                  <YAxis type="category" dataKey="topic" stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      borderColor: '#334155',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="accuracy" radius={[0, 8, 8, 0]}>
                    {topicAccuracyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cross-Subject Radar */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-500" />
                  Interdisciplinary Subject Competency
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Balanced performance across STEM &amp; Humanities
                </p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#94a3b8" strokeOpacity={0.25} />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" fontSize={9} />
                  <Radar
                    name="Proficiency"
                    dataKey="score"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        /* Accessible Table View (WCAG 2.1 AA) */
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Tabular Performance Metrics
            </h3>
            <span className="text-xs text-slate-400">Screen-reader accessible table view</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3 font-bold">Topic Name</th>
                  <th className="p-3 font-bold">Academic Subject</th>
                  <th className="p-3 font-bold text-right">Mastery Score</th>
                  <th className="p-3 font-bold">Status Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {topicAccuracyData.map((row) => (
                  <tr key={row.topic} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{row.topic}</td>
                    <td className="p-3 text-slate-500">{row.subject}</td>
                    <td className="p-3 text-right font-mono font-bold">
                      <span
                        className={
                          row.accuracy >= 80
                            ? 'text-emerald-500'
                            : row.accuracy >= 60
                            ? 'text-amber-500'
                            : 'text-rose-500'
                        }
                      >
                        {row.accuracy}%
                      </span>
                    </td>
                    <td className="p-3">
                      {row.accuracy < 60 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-semibold text-[10px]">
                          ⚠️ Scheduled in AI Planner
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
                          ✓ Mastered
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Submissions Feed */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Recent Assessment History
          </h3>
          <Link
            href="/student/tests/"
            prefetch={true}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>All Tests</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {submissions.map((sub) => (
            <div key={sub.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">{sub.testTitle}</h4>
                <p className="text-[11px] text-slate-400">
                  {new Date(sub.completedAt).toLocaleDateString()} · {Math.round(sub.timeTakenSeconds / 60)} mins taken
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-blue-600 dark:text-blue-400">
                  {sub.percentage}%
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
                  Graded
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
