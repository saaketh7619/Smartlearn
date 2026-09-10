'use client';

import React from 'react';
import Link from 'next/link';
import { RefreshCw, Home, AlertCircle } from 'lucide-react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/** Per-page error boundary rendered when a page/layout throws. */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-slate-900 dark:text-white">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-rose-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-extrabold">Something went wrong</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            An unexpected error occurred while loading this page. Your work has been preserved.
          </p>
          {process.env.NODE_ENV === 'development' && error?.message && (
            <pre className="mt-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-rose-500 text-left whitespace-pre-wrap break-all border border-slate-200 dark:border-slate-700">
              {error.message}
            </pre>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#d82a4e] text-white text-sm font-bold hover:bg-[#c32646] transition-colors shadow-md shadow-rose-500/20"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
