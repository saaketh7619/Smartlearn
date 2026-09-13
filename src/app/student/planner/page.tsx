'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  BrainCircuit,
  ArrowRight,
  Plus,
  Trash2,
  RotateCcw,
  Bell,
  Check,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useToast } from '@/components/shared/ToastContext';

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

const DEFAULT_SESSIONS: StudySession[] = [
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
];

export default function StudyPlannerPage() {
  const addXP = useStore((state) => state.addXP);
  const triggerConfetti = useStore((state) => state.triggerConfetti);
  const toast = useToast();

  const [isGenerating, setIsGenerating] = useState(false);
  const [filterReason, setFilterReason] = useState<string>('All');
  const [sessions, setSessions] = useState<StudySession[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('smartlearn_planner_sessions');
        return saved ? JSON.parse(saved) : DEFAULT_SESSIONS;
      } catch {
        return DEFAULT_SESSIONS;
      }
    }
    return DEFAULT_SESSIONS;
  });

  // Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newDay, setNewDay] = useState('Monday');
  const [newSubject, setNewSubject] = useState('Mathematics');
  const [newTopic, setNewTopic] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('04:00 PM - 05:00 PM');
  const [newReason, setNewReason] = useState<'Weak Topic Drill' | 'Exam Prep' | 'Course Catchup' | 'Revision Quiz'>('Weak Topic Drill');
  const [newDuration, setNewDuration] = useState(60);

  // Sync to LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('smartlearn_planner_sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  // Check for tasks sent from AdaptiveTestRunnerClient
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const testTasks = JSON.parse(localStorage.getItem('smartlearn_planner_tasks') || '[]');
        if (testTasks.length > 0) {
          const mapped: StudySession[] = testTasks.map((t: any) => ({
            id: t.id,
            day: 'Thursday',
            timeSlot: '05:00 PM - 05:30 PM',
            subject: t.subject || 'STEM',
            topic: t.title.replace('Diagnostic Review: ', ''),
            durationMinutes: t.duration || 30,
            reason: 'Weak Topic Drill',
            completed: false,
          }));
          setSessions((prev) => {
            const existingIds = new Set(prev.map((s) => s.id));
            const fresh = mapped.filter((m) => !existingIds.has(m.id));
            if (fresh.length > 0) {
              setTimeout(() => {
                toast.info('Test Remediation Synced', `${fresh.length} weak topic sessions imported into your schedule.`);
              }, 0);
              return [...prev, ...fresh];
            }
            return prev;
          });
          // clear imported tasks
          localStorage.removeItem('smartlearn_planner_tasks');
        }
      } catch {
        // ignore
      }
    }
  }, [toast]);

  const handleToggleComplete = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const next = !s.completed;
          if (next) {
            addXP(35, `Completed study session: ${s.topic}`);
            triggerConfetti();
            toast.success('Session Completed! (+35 XP)', `Great job finishing "${s.topic}".`);
          }
          return { ...s, completed: next };
        }
        return s;
      })
    );
  };

  const handleDeleteSession = (id: string, topic: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    toast.info('Session Removed', `"${topic}" was removed from your timetable.`);
  };

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;

    const newSession: StudySession = {
      id: `s-${Date.now()}`,
      day: newDay,
      timeSlot: newTimeSlot,
      subject: newSubject,
      topic: newTopic.trim(),
      durationMinutes: Number(newDuration),
      reason: newReason,
      completed: false,
    };

    setSessions((prev) => [...prev, newSession]);
    setNewTopic('');
    setAddModalOpen(false);
    toast.success('Session Scheduled', `Added "${newSession.topic}" on ${newSession.day}.`);
  };

  const handleRegenerateWithAi = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Rebalance schedule
      const weakTopics = (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('smartlearn_weak_topics') || '[]')) || [];
      const updated = DEFAULT_SESSIONS.map((s) => ({
        ...s,
        completed: false,
        topic: weakTopics.length > 0 && s.reason === 'Weak Topic Drill' ? `${weakTopics[0]} Deep Drill` : s.topic,
      }));
      setSessions(updated);
      setIsGenerating(false);
      triggerConfetti();
      addXP(15, 'Generated Optimized AI Timetable');
      toast.success('Schedule Synthesized', 'Generated an updated study plan targeting current weak areas.');
    }, 1200);
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const filteredSessions = filterReason === 'All'
    ? sessions
    : sessions.filter((s) => s.reason === filterReason);

  const completedCount = sessions.filter((s) => s.completed).length;
  const completionPercentage = Math.round((completedCount / (sessions.length || 1)) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Algorithmic Spaced Repetition</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Study Planner &amp; Timetable
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dynamic weekly schedule synthesized from your diagnostic weak areas and upcoming test dates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer hover:opacity-90"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Session</span>
          </button>

          <button
            onClick={handleRegenerateWithAi}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Synthesizing...' : 'Regenerate with AI'}</span>
          </button>
        </div>
      </div>

      {/* Progress & AI Rationale Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Weekly Completion Card */}
        <div className="md:col-span-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 dark:text-white">Weekly Schedule Progress</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{completedCount}/{sessions.length} Done</span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{completionPercentage}% Target Met</span>
            <span>+{completedCount * 35} XP Earned</span>
          </div>
        </div>

        {/* AI Rationale Summary Banner */}
        <div className="md:col-span-8 p-5 rounded-3xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 flex items-start gap-3.5">
          <div className="p-2.5 rounded-2xl bg-blue-600 text-white flex-shrink-0 mt-0.5 shadow-sm">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <span className="font-bold text-blue-950 dark:text-blue-200 block mb-0.5 text-xs sm:text-sm">
              AI Timetable Rationale &amp; Spaced Intervals:
            </span>
            Based on your recent diagnostic error analysis, the planner has reinforced <strong>Quadratic Equations</strong> and <strong>Chain Rule</strong> with scheduled 60-minute review drills. Optimal cognitive spacing ensures 92% retention before your Saturday test.
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
          <span className="text-slate-400 text-[11px] mr-1 hidden sm:inline">Filter:</span>
          {['All', 'Weak Topic Drill', 'Exam Prep', 'Course Catchup', 'Revision Quiz'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterReason(f)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                filterReason === f
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <span className="text-[11px] text-slate-400 font-medium">
          Showing {filteredSessions.length} sessions
        </span>
      </div>

      {/* Visual Timetable 7-Day Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {daysOfWeek.map((day) => {
          const daySessions = filteredSessions.filter((s) => s.day === day);
          return (
            <div
              key={day}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-blue-500" />
                    {day}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {daySessions.length} {daySessions.length === 1 ? 'session' : 'sessions'}
                  </span>
                </div>

                {daySessions.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                    Rest &amp; Recharge Day 🍃
                  </div>
                ) : (
                  <div className="space-y-3">
                    {daySessions.map((ses) => (
                      <div
                        key={ses.id}
                        className={`p-3.5 rounded-2xl border transition-all relative group ${
                          ses.completed
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/70 hover:border-blue-500'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] mb-1">
                          <span className="font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            {ses.subject}
                          </span>
                          <div className="flex items-center gap-1">
                            <span
                              className={`px-1.5 py-0.5 rounded font-semibold ${
                                ses.reason === 'Weak Topic Drill'
                                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                                  : 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400'
                              }`}
                            >
                              {ses.reason}
                            </span>
                            <button
                              onClick={() => handleDeleteSession(ses.id, ses.topic)}
                              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity p-0.5"
                              title="Delete Session"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <h4
                          onClick={() => handleToggleComplete(ses.id)}
                          className={`font-bold text-xs leading-snug cursor-pointer hover:text-blue-600 transition-colors ${
                            ses.completed
                              ? 'line-through text-slate-400 dark:text-slate-500'
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
                          <button
                            onClick={() => handleToggleComplete(ses.id)}
                            className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 cursor-pointer text-[11px]"
                          >
                            <CheckCircle2
                              className={`w-3.5 h-3.5 ${
                                ses.completed ? 'fill-emerald-500 text-white' : 'text-slate-300'
                              }`}
                            />
                            <span>{ses.completed ? 'Done (+35 XP)' : 'Mark Done'}</span>
                          </button>
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

      {/* ADD STUDY SESSION MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Add Study Session</h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSession} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Topic / Chapter</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Newton's 2nd Law Problem Set"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Day of Week</label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    {daysOfWeek.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Subject</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Biology">Biology</option>
                    <option value="Literature">Literature</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Reason / Type</label>
                  <select
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Weak Topic Drill">Weak Topic Drill</option>
                    <option value="Exam Prep">Exam Prep</option>
                    <option value="Course Catchup">Course Catchup</option>
                    <option value="Revision Quiz">Revision Quiz</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
