'use client';

import React from 'react';

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-900/60 animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
        <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
      </div>
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
      <div className="space-y-2 pt-2">
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
      </div>
    </div>
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900/60 animate-pulse">
      <div className="h-40 bg-slate-200 dark:bg-slate-800 w-full"></div>
      <div className="p-5 space-y-3">
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-4/5"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
}
