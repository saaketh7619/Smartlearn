'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Flame,
  Award,
  Play,
  ArrowRight,
  BrainCircuit,
  BookOpen,
  CheckCircle2,
  Calendar,
  Smile,
  Meh,
  Frown,
  Zap,
  TrendingUp,
  Clock,
  GraduationCap,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { useStore } from '@/store/useStore';
import { db } from '@/lib/db';

export default function StudentDashboard() {
  const router = useRouter();
  const currentUser = useStore((state) => state.currentUser);
  const academicProfile = useStore((state) => state.academicProfile);
  const recentlyViewed = useStore((state) => state.recentlyViewed);
  const addXP = useStore((state) => state.addXP);
  const triggerConfetti = useStore((state) => state.triggerConfetti);

  const [selectedMood, setSelectedMood] = useState<string | null>('happy');

  const student = currentUser?.studentProfile;
  const courses = db.courses;

  const lastViewed = recentlyViewed.length > 0 ? recentlyViewed[0] : null;

  // Chart 1: Mastery Over Time
  const masteryData = [
    { week: 'W1', score: 68 },
    { week: 'W2', score: 72 },
    { week: 'W3', score: 70 },
    { week: 'W4', score: 79 },
    { week: 'W5', score: 84 },
    { week: 'W6', score: 88 },
  ];

  // Chart 2: Weak vs Strong Topic Radar
  const radarData = [
    { topic: 'Differentiation', score: 92 },
    { topic: 'Quadratic Curves', score: 58 },
    { topic: 'Kinematics', score: 85 },
    { topic: 'Organic Reactions', score: 62 },
    { topic: 'Limits & Continuity', score: 88 },
    { topic: 'Combinatorics', score: 50 },
  ];

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    addXP(15, 'Daily Mood Check-in');
    triggerConfetti();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. GREETING & MOTIVATIONAL STREAK BANNER */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-blue-500/10">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white">
                {academicProfile ? `${academicProfile.classLevel} · ${academicProfile.board}` : 'Grade 10 · CBSE'}
              </span>
              {academicProfile?.learningGoals && academicProfile.learningGoals.length > 0 ? (
                <span className="text-xs text-blue-100 flex items-center gap-1 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  Goal: {academicProfile.learningGoals[0]}
                </span>
              ) : (
                <span className="text-xs text-blue-100 flex items-center gap-1 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  Goal: Board Exam Excellence
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              Good morning, {currentUser?.name || 'Alex'}! ☀️
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              You are on a <strong className="text-amber-300 font-bold">7-Day Study Streak</strong>! Keep the momentum
              going. Explore your curriculum materials or complete an adaptive test today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-center min-w-[80px]">
              <Flame className="w-6 h-6 fill-amber-300 text-amber-300 mx-auto mb-1" />
              <div className="text-lg font-black">{student?.streakDays || 7} Days</div>
              <div className="text-[10px] text-blue-100 uppercase tracking-wider">Streak</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-center min-w-[80px]">
              <Award className="w-6 h-6 text-amber-300 mx-auto mb-1" />
              <div className="text-lg font-black">Lvl {student?.level || 12}</div>
              <div className="text-[10px] text-blue-100 uppercase tracking-wider">{student?.xp || 2450} XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding invite if profile incomplete */}
      {!academicProfile?.onboardingCompleted && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Personalise your Academic Curriculum
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose your Educational Level, Class, Board, and Subjects for syllabus-aligned materials.
              </p>
            </div>
          </div>
          <Link
            href="/student/onboarding/"
            prefetch={true}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex-shrink-0"
          >
            Complete Profile &rarr;
          </Link>
        </div>
      )}

      {/* 2. CONTINUE LEARNING & AI COMPANION PROMPT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning Card */}
        <div className="lg:col-span-2 rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                Continue Learning
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {lastViewed ? 'Recently Studied' : 'Last active 12m ago'}
              </span>
            </div>

            {lastViewed ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase">
                    {lastViewed.subjectName} · {lastViewed.resourceType}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {lastViewed.resourceTitle}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Continue studying your curriculum material. Revisit concepts or solve practice questions to solidify your understanding.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Mastering Differential Calculus: Lesson 2.2 — The Chain Rule
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Learn how to differentiate composite functions f(g(x)) and apply it to real-world rate of change problems.
                </p>
              </>
            )}

            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-300">Curriculum Progress</span>
                <span className="text-blue-600 dark:text-blue-400">65% Completed</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full w-[65%]" />
              </div>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {academicProfile ? `${academicProfile.classLevel} Syllabus` : 'Module 2 of 4 · 2 lessons remaining'}
            </span>
            <Link
              href={lastViewed ? '/student/courses/' : '/student/courses/course-calc-1/'}
              prefetch={true}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              Resume Study
            </Link>
          </div>
        </div>

        {/* Persistent AI Agent Assistant */}
        <div className="rounded-3xl p-6 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-indigo-500/10 border border-blue-200/60 dark:border-blue-800/40 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">AI Tutor Companion</h4>
                <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online & Ready
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              &ldquo;I noticed you found <em>Quadratic Equations</em> challenging in your last diagnostic. Want me to walk through a 3-minute visual explanation?&rdquo;
            </p>

            <div className="space-y-1.5">
              <button
                onClick={() => router.push('/student/tutor/?q=Explain%20Quadratic%20discriminant%20simply')}
                className="w-full text-left p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors truncate"
              >
                💡 Explain discriminant (b² - 4ac) simply
              </button>
              <button
                onClick={() => router.push('/student/tutor/?q=Derive%20the%20Chain%20Rule%20step%20by%20step')}
                className="w-full text-left p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors truncate"
              >
                📐 Derive the Chain Rule with an analogy
              </button>
            </div>
          </div>

          <Link
            href="/student/tutor/"
            prefetch={true}
            className="mt-5 w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold text-center transition-all hover:opacity-95 shadow-xs flex items-center justify-center gap-1.5"
          >
            Open Full AI Tutor Chat
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 3. AI-SUGGESTED COURSES HORIZONTAL CAROUSEL */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">AI Suggested For You</h3>
            <p className="text-xs text-slate-500">Based on your Grade 10 curriculum and weak topic diagnostics</p>
          </div>
          <Link
            href="/student/courses/"
            prefetch={true}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            Explore All Courses →
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-thin">
          {courses.slice(0, 5).map((course) => (
            <div
              key={course.id}
              className="min-w-[280px] sm:min-w-[300px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-36 w-full overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                    {course.subject}
                  </span>
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold">
                    ★ {course.rating}
                  </span>
                </div>

                <div className="p-4">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                    {course.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {course.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800/60 mt-2 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">{course.durationHours}h total</span>
                <Link
                  href={`/student/courses/${course.id}/`}
                  prefetch={true}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  View Course
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. VISUAL ANALYTICS: MASTERY OVER TIME & TOPIC RADAR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                Mastery Over Time
              </h3>
              <p className="text-xs text-slate-500">Average weekly diagnostic score trend</p>
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
              +16% Growth
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={masteryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[50, 100]} />
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
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#3b82f6' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-500" />
                Topic Mastery Radar
              </h3>
              <p className="text-xs text-slate-500">Weak vs Strong areas across STEM</p>
            </div>
            <Link
              href="/student/analytics/"
              prefetch={true}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Full Analytics →
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#94a3b8" strokeOpacity={0.25} />
                <PolarAngleAxis dataKey="topic" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" fontSize={9} />
                <Radar
                  name="Mastery Score"
                  dataKey="score"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5. GAMIFICATION & WELLNESS QUICK BAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Badges Showcase */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Recent Achievements
            </h3>
            <span className="text-xs text-slate-400">{db.badges.length} Badges Unlocked</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {db.badges.slice(0, 3).map((badge) => (
              <div
                key={badge.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{badge.title}</h4>
                <p className="text-[10px] text-amber-500 font-bold mt-0.5">+{badge.xpReward} XP</p>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Wellness Mood Check-in */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-1">
              <Smile className="w-4 h-4 text-emerald-500" />
              Daily Study Wellness Check-in
            </h3>
            <p className="text-xs text-slate-500">How are you feeling about your workload today?</p>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <button
                onClick={() => handleMoodSelect('energized')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  selectedMood === 'energized'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span className="text-2xl block mb-1">🤩</span>
                <span className="text-xs font-bold">Energized</span>
              </button>

              <button
                onClick={() => handleMoodSelect('steady')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  selectedMood === 'steady'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span className="text-2xl block mb-1">😊</span>
                <span className="text-xs font-bold">Steady</span>
              </button>

              <button
                onClick={() => handleMoodSelect('tired')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  selectedMood === 'tired'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-600'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span className="text-2xl block mb-1">☕</span>
                <span className="text-xs font-bold">Need Break</span>
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-3 text-center">
            Checking in logs +15 XP towards your daily wellness goal.
          </p>
        </div>
      </div>
    </div>
  );
}
