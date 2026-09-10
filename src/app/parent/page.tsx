'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HeartHandshake,
  Volume2,
  VolumeX,
  Users,
  Award,
  Sparkles,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  BellRing,
  Globe,
  Flame,
  MessageSquare,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useStore } from '@/store/useStore';

export default function ParentDashboardPage() {
  const language = useStore((state) => state.language);
  const setLanguage = useStore((state) => state.setLanguage);

  const [activeChild, setActiveChild] = useState<'alex' | 'maya'>('alex');
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);

  const childData = {
    alex: {
      name: 'Alex Rivera',
      grade: 'Grade 10 · St. Jude International Academy',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      overallScore: 84,
      coursesCompleted: 2,
      coursesInProgress: 3,
      streak: 7,
      badgesCount: 4,
      encouragingSummary:
        'Alex is performing exceptionally well this week! He demonstrated 92% mastery in Differential Calculus and maintained an unbroken 7-day study streak. His teacher Dr. Jenkins noted excellent classroom participation.',
      recentActivities: [
        { title: 'Scored 84% in Math Olympiad Prep Diagnostic', time: 'Yesterday at 2:30 PM', type: 'test' },
        { title: 'Unlocked the "Streak Titan" Badge (7 unbroken days)', time: 'Yesterday morning', type: 'badge' },
        { title: 'Completed Lesson 2.2: The Chain Rule in Calculus', time: '2 days ago', type: 'course' },
        { title: 'Attended 100% of classes this week', time: '3 days ago', type: 'attendance' },
      ],
    },
    maya: {
      name: 'Maya Rivera',
      grade: 'Grade 7 · St. Jude International Academy',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
      overallScore: 78,
      coursesCompleted: 1,
      coursesInProgress: 2,
      streak: 4,
      badgesCount: 2,
      encouragingSummary:
        'Maya is steadily progressing in Life Sciences and Critical Reading! She completed her genetics cell division reading and has been diligently reviewing science vocabulary every evening.',
      recentActivities: [
        { title: 'Completed Molecular Genetics Reading Module', time: 'Yesterday at 5:00 PM', type: 'course' },
        { title: 'Earned "Bookworm" Achievement Badge', time: '3 days ago', type: 'badge' },
        { title: 'Scored 78% in Weekly Science Diagnostic', time: '4 days ago', type: 'test' },
      ],
    },
  };

  const child = childData[activeChild];

  // Circular progress ring data
  const pieData = [
    { name: 'Mastery', value: child.overallScore, color: '#10b981' },
    { name: 'Remaining', value: 100 - child.overallScore, color: '#e2e8f0' },
  ];

  // Web Speech API Read Aloud
  const handleReadAloud = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isPlayingSpeech) {
        window.speechSynthesis.cancel();
        setIsPlayingSpeech(false);
      } else {
        const text = `${child.name}'s weekly summary: ${child.encouragingSummary}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.onend = () => setIsPlayingSpeech(false);
        utterance.onerror = () => setIsPlayingSpeech(false);
        setIsPlayingSpeech(true);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      alert('Speech synthesis is not supported on this browser window.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. PARENT WELCOME & CHILD SWITCHER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 text-white shadow-xl shadow-emerald-500/15">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-emerald-100">
                Parent Overview · Priya Sharma
              </span>
              <span className="text-xs text-emerald-100 font-semibold">2 Children Enrolled</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              {language === 'hi' ? 'नमस्ते, प्रिया शर्मा' : language === 'es' ? 'Bienvenida, Priya Sharma' : 'Welcome, Priya Sharma 👋'}
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              Here is an honest, comforting summary of how your children are learning this week. No confusing acronyms, just clear growth.
            </p>
          </div>

          {/* Sibling Switcher Buttons */}
          <div className="flex items-center gap-2 p-1.5 bg-black/25 backdrop-blur-md rounded-2xl border border-white/20">
            <button
              onClick={() => setActiveChild('alex')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeChild === 'alex' ? 'bg-white text-emerald-900 shadow-md scale-105' : 'text-white/80 hover:text-white'
              }`}
            >
              <img
                src={childData.alex.avatar}
                alt="Alex"
                className="w-5 h-5 rounded-full object-cover"
              />
              <span>Alex (Grade 10)</span>
            </button>

            <button
              onClick={() => setActiveChild('maya')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeChild === 'maya' ? 'bg-white text-emerald-900 shadow-md scale-105' : 'text-white/80 hover:text-white'
              }`}
            >
              <img
                src={childData.maya.avatar}
                alt="Maya"
                className="w-5 h-5 rounded-full object-cover"
              />
              <span>Maya (Grade 7)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. REASSURING SUMMARY WITH READ ALOUD VOICE ASSISTANT */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {child.name}&apos;s Weekly Audio & Plain-Language Digest
              </h3>
              <p className="text-[11px] text-slate-400">{child.grade}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Read Aloud Button */}
            <button
              onClick={handleReadAloud}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isPlayingSpeech
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
              }`}
              title="Listen to Spoken Audio Digest"
            >
              {isPlayingSpeech ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isPlayingSpeech ? 'Stop Reading' : 'Read Aloud'}</span>
            </button>

            {/* Regional Language Switcher */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-bold">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-md ${language === 'en' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs' : 'text-slate-400'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 rounded-md ${language === 'hi' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs' : 'text-slate-400'}`}
              >
                हिं
              </button>
              <button
                onClick={() => setLanguage('es')}
                className={`px-2 py-1 rounded-md ${language === 'es' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs' : 'text-slate-400'}`}
              >
                ES
              </button>
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
          &ldquo;{child.encouragingSummary}&rdquo;
        </p>
      </div>

      {/* 3. PROGRESS RING CHART & STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Ring */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Overall Mastery</span>
          <div className="relative w-44 h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={75}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#f1f5f9" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{child.overallScore}%</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                Exceeding Goals
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Ranked in top 10% of class cohort</p>
        </div>

        {/* Quick Highlights */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">Academic Highlights</h3>
            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300">Courses Completed</span>
                <span className="font-bold text-slate-900 dark:text-white">{child.coursesCompleted} Finished</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300">Active Daily Streak</span>
                <span className="font-bold text-amber-500 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" />
                  {child.streak} Days
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300">Badges Unlocked</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{child.badgesCount} Trophies</span>
              </div>
            </div>
          </div>

          <Link
            href="/parent/progress"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            View Full Progress Trends →
          </Link>
        </div>

        {/* Actionable Alerts & Message Teacher */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <BellRing className="w-4 h-4 text-emerald-600" />
                Urgent Parent Alerts
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600">
                1 Notice
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 text-xs space-y-1">
              <span className="font-bold text-emerald-900 dark:text-emerald-200 block">
                Math Olympiad Final Next Saturday
              </span>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                Alex is signed up for the 10:00 AM session. Review session scheduled on Thursday.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/parent/messages"
              className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold text-center transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Message Class Teacher
            </Link>
          </div>
        </div>
      </div>

      {/* 4. ENCOURAGING RECENT ACTIVITY FEED */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent Activity Log</h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {child.recentActivities.map((act, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{act.title}</p>
                  <span className="text-[10px] text-slate-400">{act.time}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                Logged
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
