'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  BookOpen,
  BrainCircuit,
  Clock,
  Sparkles,
  Share2,
  FileQuestion,
  HelpCircle,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { db } from '@/lib/db';

export default function CourseDetailClient() {
  const params = useParams();
  const courseId = params?.id as string;
  const course = db.getCourseById(courseId) || db.courses[0];
  const addXP = useStore((state) => state.addXP);
  const triggerConfetti = useStore((state) => state.triggerConfetti);

  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Record<number, boolean>>({
    0: true,
  });
  const [showAiSummary, setShowAiSummary] = useState(false);

  const lessons =
    course.modules.length > 0 && course.modules[0].lessons.length > 0
      ? course.modules.flatMap((m) => m.lessons)
      : [
          { id: 'les-1', title: '1. Foundations & Intuition', durationMinutes: 15, type: 'video' },
          { id: 'les-2', title: '2. Deep Dive & Core Axioms', durationMinutes: 25, type: 'video' },
          { id: 'les-3', title: '3. Real-World Applications & Edge Cases', durationMinutes: 20, type: 'reading' },
          { id: 'les-4', title: '4. Module Mastery Check Quiz', durationMinutes: 15, type: 'quiz' },
        ];

  const currentLesson = lessons[activeLessonIndex] || lessons[0];

  const handleCompleteLesson = () => {
    if (!completedLessons[activeLessonIndex]) {
      setCompletedLessons((prev) => ({ ...prev, [activeLessonIndex]: true }));
      addXP(50, `Completed: ${currentLesson.title}`);
      triggerConfetti();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/student/courses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Course Library
        </Link>
        <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-bold">
          {course.subject} · {course.difficulty}
        </span>
      </div>

      {/* Main Grid: Player + Syllabus */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Video / Content Player */}
        <div className="lg:col-span-2 space-y-4">
          {/* Mock Video Container */}
          <div className="relative aspect-video rounded-3xl bg-slate-900 overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center group">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="absolute inset-0 w-full h-full object-cover opacity-35"
            />
            <div className="relative z-10 flex flex-col items-center text-center p-4">
              <button
                className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-xl shadow-blue-500/30 group-hover:scale-110 transition-transform mb-3 focus:outline-none"
                onClick={handleCompleteLesson}
                title="Play Lesson"
              >
                <Play className="w-7 h-7 fill-white translate-x-0.5" />
              </button>
              <h4 className="text-white font-bold text-base sm:text-lg">{currentLesson.title}</h4>
              <p className="text-xs text-slate-300 mt-1">
                {currentLesson.durationMinutes} mins · High Definition Lecture with AI Interactive Prompts
              </p>
            </div>
          </div>

          {/* Lesson Action Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{course.title}</h2>
              <p className="text-xs text-slate-500">Taught by {course.instructorName} · {course.instructorRole}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAiSummary(!showAiSummary)}
                className="px-3.5 py-2 rounded-xl border border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI Key Takeaways
              </button>

              <button
                onClick={handleCompleteLesson}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                  completedLessons[activeLessonIndex]
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {completedLessons[activeLessonIndex] ? 'Completed (+50 XP)' : 'Mark Complete'}
              </button>
            </div>
          </div>

          {/* AI Summary Dropdown Panel */}
          {showAiSummary && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-blue-500/10 border border-purple-300/60 dark:border-purple-800/60 animate-in fade-in duration-150">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4" />
                  SmartLearn AI Automated Lesson Summary
                </span>
                <span className="text-[10px] text-slate-400">Generated in 0.4s</span>
              </div>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>Core Principle: Differentiation measures instantaneous rate of change as secant lines approach tangent lines.</li>
                <li>Chain Rule Formula: d/dx [f(g(x))] = f&apos;(g(x)) * g&apos;(x). Always multiply the outer derivative by the inner derivative.</li>
                <li>Common Exam Mistake: Forgetting to take the derivative of the inside polynomial term.</li>
              </ul>
            </div>
          )}

          {/* Lesson Notes & Text Content */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Lesson Study Notes</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              In this module, we construct the foundation of continuous mathematical models. Whenever you encounter
              physics kinematics problems involving displacement, velocity is the first derivative with respect to time,
              and acceleration is the second derivative. Keep your notebook handy or use SmartLearn&apos;s AI revision
              generator to create flashcards directly from these lecture points.
            </p>
          </div>
        </div>

        {/* Right: Course Syllabus & Module Outline */}
        <div className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Course Syllabus</h3>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">
              {Object.keys(completedLessons).length} of {lessons.length} done
            </span>
          </div>

          <div className="space-y-2">
            {lessons.map((les, idx) => {
              const isActive = activeLessonIndex === idx;
              const isDone = completedLessons[idx];
              return (
                <div
                  key={les.id}
                  onClick={() => setActiveLessonIndex(idx)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 shadow-xs'
                      : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCompletedLessons((prev) => ({ ...prev, [idx]: !prev[idx] }));
                      }}
                      className="focus:outline-none"
                    >
                      <CheckCircle2
                        className={`w-4 h-4 flex-shrink-0 ${
                          isDone ? 'text-emerald-500 fill-emerald-500/20' : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold truncate ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {les.title}
                      </p>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {les.durationMinutes}m · {les.type.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {isActive && <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">Playing</span>}
                </div>
              );
            })}
          </div>

          {/* Quick AI Tutor Help trigger */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <Link
              href={`/student/tutor?q=I%20have%20a%20doubt%20on%20${encodeURIComponent(course.title)}`}
              className="inline-flex items-center justify-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Ask AI Tutor about this lesson
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
