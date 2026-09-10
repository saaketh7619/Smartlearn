'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Clock, ArrowRight, Sparkles } from 'lucide-react';

interface EmptyCurriculumStateProps {
  className?: string;
  levelName?: string;
  streamName?: string;
  isAdmin?: boolean;
}

export function EmptyCurriculumState({
  className = 'Class',
  levelName,
  streamName,
  isAdmin = false,
}: EmptyCurriculumStateProps) {
  const displayName = [levelName, streamName, className].filter(Boolean).join(' › ');

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-6">
      {/* Icon */}
      <div className="relative">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center shadow-inner">
          <BookOpen className="w-9 h-9 text-blue-400" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center">
          <Clock className="w-3.5 h-3.5 text-white" />
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2 max-w-md">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Content Coming Soon
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          <span className="font-semibold text-slate-700 dark:text-slate-300">{displayName}</span> content is being
          carefully prepared by our curriculum team. Check back soon!
        </p>
      </div>

      {/* Timeline chips */}
      <div className="flex flex-wrap gap-2 justify-center">
        {['Syllabus', 'Chapters', 'Textbooks', 'Practice Tests', 'Notes'].map((item) => (
          <span
            key={item}
            className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
          >
            {item} · Pending
          </span>
        ))}
      </div>

      {/* CTA */}
      {isAdmin ? (
        <Link
          href="/admin/curriculum/upload"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm shadow-blue-500/20 hover:shadow-md"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Upload Curriculum Content
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      ) : (
        <p className="text-xs text-slate-400 dark:text-slate-500 italic">
          Your administrator will upload content soon. You will be notified when it is ready.
        </p>
      )}
    </div>
  );
}
