'use client';

import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  Sparkles,
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function StudentAnalyticsPage() {
  const topicAccuracyData = [
    { topic: 'Differentiation', accuracy: 92, fill: '#3b82f6' },
    { topic: 'Kinematics', accuracy: 85, fill: '#60a5fa' },
    { topic: 'Limits', accuracy: 88, fill: '#3b82f6' },
    { topic: 'Organic Chem', accuracy: 62, fill: '#f59e0b' },
    { topic: 'Quadratics', accuracy: 54, fill: '#f43f5e' },
    { topic: 'Combinatorics', accuracy: 48, fill: '#f43f5e' },
  ];

  const radarData = [
    { subject: 'Math', score: 88 },
    { subject: 'Physics', score: 82 },
    { subject: 'Chemistry', score: 68 },
    { subject: 'CompSci', score: 94 },
    { subject: 'Biology', score: 76 },
    { subject: 'Humanities', score: 80 },
  ];

  const studyBreakData = [
    { name: 'Active Study Hours', value: 72, color: '#3b82f6' },
    { name: 'Mindful Breaks', value: 28, color: '#10b981' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Performance Analytics & Mastery
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Detailed cognitive breakdown of topic competencies, test accuracy, and wellness metrics.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] text-slate-400">Cumulative Accuracy</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">82.4%</div>
          <span className="text-[10px] text-emerald-500 font-bold">+5.2% this month</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] text-slate-400">Tests Completed</span>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">14</div>
          <span className="text-[10px] text-purple-500 font-bold">100% submission rate</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] text-slate-400">Weak Topics Identified</span>
          <div className="text-2xl font-black text-rose-500 mt-1">2</div>
          <span className="text-[10px] text-rose-400 font-bold">Quadratics, Combinatorics</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] text-slate-400">Study / Break Balance</span>
          <div className="text-2xl font-black text-emerald-500 mt-1">72 / 28</div>
          <span className="text-[10px] text-emerald-400 font-bold">Optimal wellness zone</span>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic Accuracy Bar Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                Topic Accuracy (% Correct)
              </h3>
              <p className="text-xs text-slate-500">Green/Blue = Strong, Red = Requires Revision</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicAccuracyData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
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
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-500" />
                Interdisciplinary Subject Balance
              </h3>
              <p className="text-xs text-slate-500">Holistic STEM vs Humanities profile</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#94a3b8" strokeOpacity={0.25} />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" fontSize={9} />
                <Radar name="Proficiency" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
