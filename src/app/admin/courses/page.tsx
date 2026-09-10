'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Award,
} from 'lucide-react';
import { db } from '@/lib/db';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState(db.courses);
  const [search, setSearch] = useState('');

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.instructorName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Course Catalog & Question Bank Governance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervise published curriculum modules, syllabus alignments, and assessment question banks.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-xs font-bold">
          {courses.length} Approved Courses
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((course) => (
          <div
            key={course.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold">
                  {course.subject}
                </span>
                <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Published
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{course.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 mt-1">{course.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>{course.enrollmentCount} Enrolled</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{course.instructorName}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
