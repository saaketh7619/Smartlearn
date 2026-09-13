'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileQuestion,
  Trophy,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Flame,
  Award,
  Sparkles,
} from 'lucide-react';
import { db } from '@/lib/db';
import { useStore } from '@/store/useStore';

export default function TestsHubPage() {
  const [activeTab, setActiveTab] = useState<'tests' | 'leaderboard' | 'history'>('tests');
  const currentUser = useStore((state) => state.currentUser);

  const tests = db.tests;
  const submissions = db.submissions;
  const leaderboard = db.leaderboard;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Mock Tests & Bi-Weekly Contests
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Take adaptive diagnostics, compete in regional leaderboards, and monitor exam readiness.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex p-1 bg-slate-200/70 dark:bg-slate-800 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('tests')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              activeTab === 'tests' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Available Tests
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              activeTab === 'leaderboard' ? 'bg-white dark:bg-slate-900 text-amber-500 shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            🏆 Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              activeTab === 'history' ? 'bg-white dark:bg-slate-900 text-emerald-500 shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            My Submissions
          </button>
        </div>
      </div>

      {/* 1. AVAILABLE TESTS TAB */}
      {activeTab === 'tests' && (
        <div className="space-y-6">
          {/* Featured Bi-Weekly Contest Banner */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-xl shadow-orange-500/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
                Live Bi-Weekly Olympiad
              </span>
              <h2 className="text-xl sm:text-2xl font-black">All-India Mathematics Olympiad Diagnostic</h2>
              <p className="text-xs text-orange-100 leading-relaxed">
                Adaptive 20-minute test. Features real-time difficulty scaling and Page Visibility anti-cheating controls.
                Top 5% unlock the Diamond League tier!
              </p>
            </div>
            <Link
              href="/student/tests/test-adaptive-math-1/take/"
              prefetch={true}
              className="px-6 py-3 rounded-2xl bg-white text-slate-900 text-xs font-black shadow-lg hover:scale-105 transition-transform flex items-center gap-2 whitespace-nowrap"
            >
              <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
              Start Adaptive Test
            </Link>
          </div>

          {/* Test Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tests.map((t) => (
              <div
                key={t.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800">
                      {t.subject}
                    </span>
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Adaptive Scaling
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{t.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {t.durationMinutes} mins
                    </span>
                    <span>{t.questions.length} Questions</span>
                    <span>{t.totalMarks} Total Marks</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Anti-Cheat Enabled
                  </span>
                  <Link
                    href={`/student/tests/${t.id}/take/`}
                    prefetch={true}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                  >
                    Take Test
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. GLOBAL LEADERBOARD TAB */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            {/* Rank 2 */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center order-2 sm:order-1">
              <span className="text-2xl mb-1">🥈</span>
              <img
                src={leaderboard[1].avatar}
                alt={leaderboard[1].name}
                className="w-14 h-14 rounded-full object-cover ring-4 ring-slate-300 dark:ring-slate-700 mb-2"
              />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">{leaderboard[1].name}</h3>
              <p className="text-[10px] text-slate-400">{leaderboard[1].school}</p>
              <div className="mt-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200">
                {leaderboard[1].xp} XP
              </div>
            </div>

            {/* Rank 1 (Podium Center) */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-amber-500/15 to-transparent dark:from-amber-500/10 border-2 border-amber-500/40 text-center flex flex-col items-center justify-center order-1 sm:order-2 shadow-lg scale-105">
              <span className="text-3xl mb-1 animate-bounce">👑</span>
              <img
                src={leaderboard[0].avatar}
                alt={leaderboard[0].name}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-amber-400 mb-2"
              />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{leaderboard[0].name}</h3>
              <p className="text-[10px] text-slate-400">{leaderboard[0].school}</p>
              <div className="mt-2 px-3.5 py-1 rounded-full bg-amber-500 text-white text-xs font-black shadow-sm">
                {leaderboard[0].xp} XP · Diamond
              </div>
            </div>

            {/* Rank 3 (Alex Rivera / Current User) */}
            <div className="p-5 rounded-3xl bg-blue-50/50 dark:bg-blue-950/20 border-2 border-blue-500/40 text-center flex flex-col items-center justify-center order-3">
              <span className="text-2xl mb-1">🥉</span>
              <img
                src={leaderboard[2].avatar}
                alt={leaderboard[2].name}
                className="w-14 h-14 rounded-full object-cover ring-4 ring-blue-400 mb-2"
              />
              <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400">{leaderboard[2].name}</h3>
              <p className="text-[10px] text-slate-400">{leaderboard[2].school}</p>
              <div className="mt-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-xs font-bold text-blue-600 dark:text-blue-300">
                {leaderboard[2].xp} XP · Platinum
              </div>
            </div>
          </div>

          {/* Full Table */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-bold text-xs text-slate-500 uppercase tracking-wider">
              Top 10 Global Competitors
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {leaderboard.map((entry) => (
                <div
                  key={entry.studentId}
                  className={`p-3.5 flex items-center justify-between text-xs transition-colors ${
                    entry.studentId === 'user-student-alex'
                      ? 'bg-blue-50/70 dark:bg-blue-950/40 font-bold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-mono font-bold text-slate-400">
                      #{entry.rank}
                    </span>
                    <img
                      src={entry.avatar}
                      alt={entry.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                    />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{entry.name}</p>
                      <p className="text-[10px] text-slate-400">{entry.school}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-amber-500 text-[11px] font-semibold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-amber-500" />
                      {entry.streakDays}d
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 font-mono font-bold">
                      {entry.xp} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. TEST HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{sub.testTitle}</h3>
                  <p className="text-xs text-slate-500">
                    Completed on {new Date(sub.completedAt).toLocaleDateString()} · Time taken: {Math.round(sub.timeTakenSeconds / 60)} mins
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{sub.percentage}%</span>
                    <span className="text-[10px] text-slate-400 block">{sub.score} / {sub.maxScore} marks</span>
                  </div>
                </div>
              </div>

              {/* Sub-breakdowns */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-[10px] text-slate-400 block">Adaptive Difficulty Correct</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {sub.difficultyBreakdown.hardCorrect} Hard / {sub.difficultyBreakdown.mediumCorrect} Med
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-[10px] text-slate-400 block">Conceptual Gaps</span>
                  <span className="font-bold text-amber-500">{sub.conceptualErrors} detected</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-[10px] text-slate-400 block">Careless Errors</span>
                  <span className="font-bold text-blue-500">{sub.carelessErrors} detected</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-[10px] text-slate-400 block">Tab Switches Detected</span>
                  <span className={`font-bold ${sub.tabSwitchesDetected > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {sub.tabSwitchesDetected} (Clean test)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
