'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  BookOpen,
  BrainCircuit,
  FileQuestion,
  Calendar,
  Layers,
  Sparkles,
  Users,
  ShieldCheck,
  Moon,
  Sun,
  X,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '@/store/useStore';

interface ActionItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Navigation' | 'AI Tools' | 'Role Switch' | 'Preferences';
  icon: React.ReactNode;
  perform: () => void;
}

export function CommandPalette() {
  const router = useRouter();
  const isOpen = useStore((state) => state.commandPaletteOpen);
  const setIsOpen = useStore((state) => state.setCommandPaletteOpen);
  const switchDemoRole = useStore((state) => state.switchDemoRole);
  const toggleTheme = useStore((state) => state.toggleTheme);
  const theme = useStore((state) => state.theme);

  const [query, setQuery] = useState('');

  // Listen for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  const actions: ActionItem[] = useMemo(
    () => [
      // Navigation
      {
        id: 'nav-student',
        title: 'Student Dashboard',
        subtitle: 'Personalized courses, streaks, and mastery charts',
        category: 'Navigation',
        icon: <BookOpen className="w-4 h-4 text-blue-500" />,
        perform: () => {
          switchDemoRole('STUDENT');
          router.push('/student');
        },
      },
      {
        id: 'nav-teacher',
        title: 'Teacher Dashboard',
        subtitle: 'Class weak topics, attention roster, and analytics',
        category: 'Navigation',
        icon: <Users className="w-4 h-4 text-purple-500" />,
        perform: () => {
          switchDemoRole('TEACHER');
          router.push('/teacher');
        },
      },
      {
        id: 'nav-parent',
        title: 'Parent Portal',
        subtitle: 'Progress ring, daily activity, and teacher messaging',
        category: 'Navigation',
        icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
        perform: () => {
          switchDemoRole('PARENT');
          router.push('/parent');
        },
      },
      {
        id: 'nav-admin',
        title: 'Admin Command Center',
        subtitle: 'User management, moderation queue, and audit logs',
        category: 'Navigation',
        icon: <Sparkles className="w-4 h-4 text-amber-500" />,
        perform: () => {
          switchDemoRole('ADMIN');
          router.push('/admin');
        },
      },
      // AI Tools
      {
        id: 'ai-tutor',
        title: 'AI Doubt-Solving Tutor',
        subtitle: 'Ask step-by-step questions with voice and image input',
        category: 'AI Tools',
        icon: <BrainCircuit className="w-4 h-4 text-blue-500" />,
        perform: () => {
          switchDemoRole('STUDENT');
          router.push('/student/tutor');
        },
      },
      {
        id: 'ai-test',
        title: 'Adaptive Mock Test Runner',
        subtitle: 'Real-time countdown with dynamic difficulty adjusting',
        category: 'AI Tools',
        icon: <FileQuestion className="w-4 h-4 text-blue-500" />,
        perform: () => {
          switchDemoRole('STUDENT');
          router.push('/student/tests/test-adaptive-math-1/take');
        },
      },
      {
        id: 'ai-planner',
        title: 'AI Study Planner & Timetable',
        subtitle: 'Generate visual timetable tailored to upcoming tests',
        category: 'AI Tools',
        icon: <Calendar className="w-4 h-4 text-indigo-500" />,
        perform: () => {
          switchDemoRole('STUDENT');
          router.push('/student/planner');
        },
      },
      {
        id: 'ai-revision',
        title: 'AI Revision & Flashcards',
        subtitle: 'Generate flip flashcards, summaries, and practice quizzes',
        category: 'AI Tools',
        icon: <Layers className="w-4 h-4 text-violet-500" />,
        perform: () => {
          switchDemoRole('STUDENT');
          router.push('/student/revision');
        },
      },
      {
        id: 'ai-paper',
        title: 'AI Question Paper Generator',
        subtitle: 'Generate structured syllabus test papers for teachers',
        category: 'AI Tools',
        icon: <FileQuestion className="w-4 h-4 text-purple-500" />,
        perform: () => {
          switchDemoRole('TEACHER');
          router.push('/teacher/generator');
        },
      },
      // Role Switch
      {
        id: 'role-student',
        title: 'Switch to Demo Student: Alex Rivera',
        subtitle: 'Grade 10 · 2450 XP · 7-Day Streak',
        category: 'Role Switch',
        icon: <span className="text-base">🎓</span>,
        perform: () => {
          switchDemoRole('STUDENT');
          router.push('/student');
        },
      },
      {
        id: 'role-teacher',
        title: 'Switch to Demo Teacher: Dr. Sarah Jenkins',
        subtitle: 'Head of Mathematics · 9 Yrs Experience',
        category: 'Role Switch',
        icon: <span className="text-base">👩‍🏫</span>,
        perform: () => {
          switchDemoRole('TEACHER');
          router.push('/teacher');
        },
      },
      {
        id: 'role-parent',
        title: 'Switch to Demo Parent: Priya Sharma',
        subtitle: 'Parent of Alex & Maya · Pediatric Specialist',
        category: 'Role Switch',
        icon: <span className="text-base">👨‍👩‍👧</span>,
        perform: () => {
          switchDemoRole('PARENT');
          router.push('/parent');
        },
      },
      {
        id: 'role-admin',
        title: 'Switch to Demo Admin: Marcus Vance',
        subtitle: 'Principal Operations & System Administrator',
        category: 'Role Switch',
        icon: <span className="text-base">⚡</span>,
        perform: () => {
          switchDemoRole('ADMIN');
          router.push('/admin');
        },
      },
      // Preferences
      {
        id: 'pref-theme',
        title: `Toggle Theme (Currently ${theme === 'dark' ? 'Dark' : 'Light'})`,
        subtitle: 'Switch between sleek dark mode and vibrant light mode',
        category: 'Preferences',
        icon: theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />,
        perform: () => toggleTheme(),
      },
    ],
    [router, switchDemoRole, toggleTheme, theme]
  );

  const filtered = actions.filter((a) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return a.title.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, tool, or persona (or press Esc to exit)..."
            autoFocus
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-medium rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/40">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No matching actions found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            filtered.map((action) => (
              <div
                key={action.id}
                onClick={() => {
                  action.perform();
                  setIsOpen(false);
                }}
                className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                    {action.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {action.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {action.subtitle}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                    {action.category}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>Navigate <kbd className="font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">↑↓</kbd></span>
            <span>Select <kbd className="font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">↵</kbd></span>
          </div>
          <span className="font-medium text-blue-600 dark:text-blue-400">SmartLearn OmniSearch</span>
        </div>
      </div>
    </div>
  );
}
