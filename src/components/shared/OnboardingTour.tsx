'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Sparkles, ArrowRight, Check, X, BookOpen, BrainCircuit, FileQuestion, Users, BarChart3, HeartHandshake, Shield } from 'lucide-react';

export function OnboardingTour() {
  const currentUser = useStore((state) => state.currentUser);
  const onboardingSeen = useStore((state) => state.onboardingSeen);
  const setOnboardingSeen = useStore((state) => state.setOnboardingSeen);

  const [mounted, setMounted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const role = currentUser?.role || 'STUDENT';
  const hasSeen =
    !mounted ||
    onboardingSeen[role] ||
    (typeof window !== 'undefined' && !!sessionStorage.getItem(`sl_onboarding_seen_${role}`));

  if (hasSeen) return null;

  const tours = {
    STUDENT: [
      {
        title: 'Welcome to SmartLearn, Alex!',
        description: 'Your AI-powered personal learning ecosystem is ready. Here are the 4 superpowers crafted for you.',
        icon: <Sparkles className="w-6 h-6 text-blue-500" />,
      },
      {
        title: 'Adaptive Mock Tests',
        description: 'Tests dynamically adjust their difficulty in real-time based on your answers, helping you conquer your weak spots.',
        icon: <FileQuestion className="w-6 h-6 text-indigo-500" />,
      },
      {
        title: 'AI Doubt-Solving Tutor',
        description: 'Stuck on a tricky problem? Ask our AI tutor for step-by-step explanations with equations and conceptual breakdowns anytime.',
        icon: <BrainCircuit className="w-6 h-6 text-purple-500" />,
      },
      {
        title: 'Level Up & Earn Rewards',
        description: 'Maintain daily streaks, unlock badges, earn coins, and climb the school and national leaderboard as you learn.',
        icon: <BarChart3 className="w-6 h-6 text-amber-500" />,
      },
    ],
    TEACHER: [
      {
        title: 'Welcome to the Teacher Command Hub, Dr. Jenkins!',
        description: 'Designed to cut grading and prep time by 70% so you can focus on inspiring your students.',
        icon: <Users className="w-6 h-6 text-purple-500" />,
      },
      {
        title: 'Class Weakness Radar',
        description: 'Instantly view common student bottlenecks (like quadratic equations) in visual bar charts without digging through spreadsheets.',
        icon: <BarChart3 className="w-6 h-6 text-indigo-500" />,
      },
      {
        title: 'AI Question Paper & Lesson Plan Generator',
        description: 'Specify topic, marks distribution, and difficulty to generate ready-to-print question papers and 5E lesson plans in seconds.',
        icon: <Sparkles className="w-6 h-6 text-purple-500" />,
      },
      {
        title: 'Anti-Cheating Test Monitoring',
        description: 'Enable live tab-switch detection via the browser Page Visibility API to protect academic integrity.',
        icon: <Shield className="w-6 h-6 text-rose-500" />,
      },
    ],
    PARENT: [
      {
        title: 'Welcome, Priya!',
        description: 'A clear, reassuring window into Alex and Maya’s educational journey without overwhelming academic jargon.',
        icon: <HeartHandshake className="w-6 h-6 text-emerald-500" />,
      },
      {
        title: 'One-Click Child Switcher',
        description: 'Effortlessly toggle between Alex (Grade 10) and Maya (Grade 7) to inspect progress and test scores.',
        icon: <Users className="w-6 h-6 text-blue-500" />,
      },
      {
        title: 'Actionable Smart Alerts',
        description: 'Receive proactive alerts for upcoming exams, missing assignments, and celebratory achievement moments.',
        icon: <Sparkles className="w-6 h-6 text-amber-500" />,
      },
      {
        title: 'Accessibility & Read Aloud',
        description: 'Click "Read Aloud" on any summary to hear a comforting spoken audio briefing in English, Hindi, or Spanish.',
        icon: <BookOpen className="w-6 h-6 text-emerald-500" />,
      },
    ],
    ADMIN: [
      {
        title: 'Welcome to School Administration, Marcus!',
        description: 'Complete operational visibility over students, faculty, course catalogs, and academic performance.',
        icon: <Shield className="w-6 h-6 text-amber-500" />,
      },
      {
        title: 'User Management with RBAC',
        description: 'Manage 1,200+ students and teachers with granular role permissions and quick password reset tools.',
        icon: <Users className="w-6 h-6 text-blue-500" />,
      },
      {
        title: 'Content Moderation Queue',
        description: 'Review and approve flagged student forum posts and shared notes to ensure a safe learning environment.',
        icon: <FileQuestion className="w-6 h-6 text-rose-500" />,
      },
      {
        title: 'Platform Analytics & Settings',
        description: 'Track daily platform engagement, active test sessions, and configure school-wide security policies.',
        icon: <BarChart3 className="w-6 h-6 text-amber-500" />,
      },
    ],
  };

  const currentSteps = tours[role] || tours.STUDENT;
  const step = currentSteps[stepIndex];

  const handleNext = () => {
    if (stepIndex < currentSteps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      setOnboardingSeen(role);
    }
  };

  const handleSkip = () => {
    setOnboardingSeen(role);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl" />

        {/* Close Button */}
        <button
          onClick={handleSkip}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center shadow-inner mb-5">
            {step.icon}
          </div>

          {/* Step Progress Dots */}
          <div className="flex items-center gap-1.5 mb-4">
            {currentSteps.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === stepIndex
                    ? 'w-6 bg-blue-600 dark:bg-blue-400'
                    : 'w-2 bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {step.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed mb-8">
            {step.description}
          </p>

          <div className="flex items-center justify-between w-full pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleSkip}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              Skip Tour
            </button>
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              {stepIndex === currentSteps.length - 1 ? (
                <>
                  <Check className="w-4 h-4" />
                  Get Started
                </>
              ) : (
                <>
                  Next Feature
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
