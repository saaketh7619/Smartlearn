'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, BookOpen, BrainCircuit, Search, ArrowRight } from 'lucide-react';
import { getGitHubPagesSpaRedirect } from '@/lib/basePath';

export default function NotFound() {
  const router = useRouter();

  // GitHub Pages SPA redirect: if we were redirected here via 404.html with ?p=..., navigate there
  useEffect(() => {
    const redirectPath = getGitHubPagesSpaRedirect();
    if (redirectPath) {
      // Remove the ?p= query by replacing the current history state
      const cleanUrl = redirectPath + window.location.hash;
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      router.replace(cleanUrl);
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#121519] flex flex-col items-center justify-center px-4 py-16 text-slate-900 dark:text-white">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="font-extrabold text-2xl tracking-tight">
            Smart<span className="text-[#d82a4e]">Learn</span>
          </span>
        </Link>

        {/* 404 Graphic */}
        <div className="space-y-4">
          <div className="text-8xl font-black text-slate-200 dark:text-slate-800 select-none">404</div>
          <div className="relative -mt-10">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-[#d82a4e] to-rose-400 flex items-center justify-center text-white text-4xl shadow-lg shadow-rose-500/20">
              🔍
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-4">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist, or the link may have moved. Try one of the quick links below.
          </p>
        </div>

        {/* Quick Action Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-[#1a1e24] border border-slate-200 dark:border-[#283038] hover:border-[#d82a4e]/40 hover:shadow-md transition-all group"
          >
            <Home className="w-5 h-5 text-[#d82a4e]" />
            <span className="text-xs font-bold">Home</span>
          </Link>
          <Link
            href="/student/courses"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-[#1a1e24] border border-slate-200 dark:border-[#283038] hover:border-blue-500/40 hover:shadow-md transition-all"
          >
            <BookOpen className="w-5 h-5 text-blue-500" />
            <span className="text-xs font-bold">Courses</span>
          </Link>
          <Link
            href="/student/tutor"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-[#1a1e24] border border-slate-200 dark:border-[#283038] hover:border-indigo-500/40 hover:shadow-md transition-all"
          >
            <BrainCircuit className="w-5 h-5 text-indigo-500" />
            <span className="text-xs font-bold">AI Tutor</span>
          </Link>
        </div>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#d82a4e] text-white text-sm font-bold hover:bg-[#c32646] transition-colors shadow-md shadow-rose-500/20"
        >
          <span>Go to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
