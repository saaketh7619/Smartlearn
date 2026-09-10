'use client';

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  BrainCircuit,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { useStore } from '@/store/useStore';

interface StudySession {
  id: string;
  day: string;
  timeSlot: string;
  subject: string;
  topic: string;
  durationMinutes: number;
  reason: 'Weak Topic Drill' | 'Exam Prep' | 'Course Catchup' | 'Revision Quiz';
  completed: boolean;
}

export default function StudyPlannerPage() {
  const addXP = useStore((state) => state.addXP);
  const triggerConfetti = useStore((state) => state.triggerConfetti);

  const [isGenerating, setIsGenerating] = useState(false);
  const [sessions, setSessions] = useState<StudySession[]>([
    {
      id: 's-1',
      day: 'Monday',
      timeSlot: '04:30 PM - 05:30 PM',
      subject: 'Mathematics',
      topic: 'Quadratic Equations & Discriminant Drill',
      durationMinutes: 60,
      reason: 'Weak Topic Drill',
      completed: true,
    },
    {
      id: 's-2',
      day: 'Tuesday',
      timeSlot: '05:00 PM - 06:15 PM',
      subject: 'Physics',
      topic: 'Wave Optics & Double Slit Interference',
      durationMinutes: 75,
      reason: 'Exam Prep',
      completed: false,
    },
    {
      id: 's-3',
      day: 'Wednesday',
      timeSlot: '04:00 PM - 05:00 PM',
      subject: 'Mathematics',
      topic: 'Calculus: Chain Rule Applications',
      durationMinutes: 60,
      reason: 'Course Catchup',
      completed: false,
    },
    {
      id: 's-4',
      day: 'Thursday',
      timeSlot: '05:30 PM - 06:30 PM',
      subject: 'Chemistry',
      topic: 'Electrophilic Substitution Reactions',
      durationMinutes: 60,
      reason: 'Weak Topic Drill',
      completed: false,
    },
    {
      id: 's-5',
      day: 'Friday',
      timeSlot: '04:30 PM - 05:30 PM',
      subject: 'Computer Science',
      topic: 'NumPy Vectorization & Array Slicing',
      durationMinutes: 60,
      reason: 'Revision Quiz',
      completed: false,
    },
    {
      id: 's-6',
      day: 'Saturday',
      timeSlot: '10:00 AM - 11:30 AM',
      subject: 'Mathematics',
      topic: 'Full Math Olympiad Adaptive Mock Exam',
      durationMinutes: 90,
      reason: 'Exam Prep',
      completed: false,
    },
  ]);

  const handleToggleComplete = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const next = !s.completed;
          if (next) {
            addXP(35, `Completed study session: ${s.topic}`);
            triggerConfetti();
          }
          return { ...s, completed: next };
        }
        return s;
      })
    );
  };

  const handleRegenerateWithAi = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      triggerConfetti();
      addXP(15, 'Generated Optimized AI Timetable');
    }, 1200);
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Study Planner & Timetable
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic schedule synthesized from your diagnostic weak areas and upcoming school test dates.
          </p>
        </div>

        <button
          onClick={handleRegenerateWithAi}
          disabled={isGenerating}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {isGenerating ? 'Analyzing Weak Areas...' : 'Regenerate with AI'}
        </button>
      </div>

      {/* AI Rationale Summary Banner */}
      <div className="p-4 rounded-3xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-blue-600 text-white flex-shrink-0 mt-0.5">
          <BrainCircuit className="w-4 h-4" />
        </div>
        <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <span className="font-bold text-blue-900 dark:text-blue-200 block mb-0.5">
            AI Timetable Rationale:
          </span>
          Based on your latest 54% score in Quadratic Equations, the planner allocated 2 dedicated 60-minute revision drills
          before your upcoming district Math Midterm on Saturday. Spaced repetition intervals have been enforced.
        </div>
      </div>

      {/* Visual Timetable Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {daysOfWeek.map((day) => {
          const daySessions = sessions.filter((s) => s.day === day);
          return (
            <div
              key={day}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{day}</h3>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {daySessions.length} {daySessions.length === 1 ? 'session' : 'sessions'}
                  </span>
                </div>

                {daySessions.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                    Rest & Recharge Day 🍃
                  </div>
                ) : (
                  <div className="space-y-3">
                    {daySessions.map((ses) => (
                      <div
                        key={ses.id}
                        onClick={() => handleToggleComplete(ses.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          ses.completed
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/70 hover:border-blue-500'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] mb-1">
                          <span className="font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            {ses.subject}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded font-semibold ${
                              ses.reason === 'Weak Topic Drill'
                                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                                : 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400'
                            }`}
                          >
                            {ses.reason}
                          </span>
                        </div>

                        <h4
                          className={`font-bold text-xs leading-snug ${
                            ses.completed
                              ? 'line-through text-slate-400'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {ses.topic}
                        </h4>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2.5 pt-1.5 border-t border-slate-200/50 dark:border-slate-700/40">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {ses.timeSlot}
                          </span>
                          <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2
                              className={`w-3.5 h-3.5 ${
                                ses.completed ? 'fill-emerald-500 text-white' : 'text-slate-300'
                              }`}
                            />
                            {ses.completed ? 'Done (+35 XP)' : 'Mark Done'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
