import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Users,
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  UserPlus,
  LogIn,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  BookOpen,
  Zap,
} from 'lucide-react';

export const metadata = {
  title: 'Get Started — Choose Your Role | SmartLearn',
  description:
    'Choose how you want to use SmartLearn. Dedicated portals and AI tools for Students, Teachers, Parents, and Administrators.',
};

interface RoleOption {
  id: 'student' | 'teacher' | 'parent' | 'admin';
  title: string;
  badge: string;
  tagline: string;
  icon: React.ReactNode;
  accentBorder: string;
  accentBg: string;
  accentText: string;
  buttonColor: string;
  features: string[];
}

export default function GetStartedPage() {
  const roles: RoleOption[] = [
    {
      id: 'student',
      title: 'Student Portal',
      badge: 'Learner & Scholar',
      tagline: 'Personalized courses, AI doubt solving, adaptive practice tests, and gamified progress tracking.',
      icon: <GraduationCap className="w-7 h-7" />,
      accentBorder: 'hover:border-blue-500/80 border-blue-500/30',
      accentBg: 'bg-blue-50/50 dark:bg-blue-950/20',
      accentText: 'text-blue-600 dark:text-blue-400',
      buttonColor: 'bg-blue-600 hover:bg-blue-700 text-white',
      features: [
        'Personalized AI study assistant & step-by-step formula derivations',
        'Adaptive mock tests with real-time scoring and timed practice',
        'Gamified XP streaks, badges, flashcards & daily quests',
        'Comprehensive subject analytics and knowledge-gap identification',
      ],
    },
    {
      id: 'teacher',
      title: 'Teacher Portal',
      badge: 'Educator & Mentor',
      tagline: 'AI lesson planning, automated question generators, class diagnostics, and gradebook management.',
      icon: <Users className="w-7 h-7" />,
      accentBorder: 'hover:border-[#d82a4e]/80 border-[#d82a4e]/30',
      accentBg: 'bg-[#d82a4e]/5 dark:bg-[#d82a4e]/10',
      accentText: 'text-[#d82a4e]',
      buttonColor: 'bg-[#d82a4e] hover:bg-[#b81d3d] text-white',
      features: [
        'AI exam paper & quiz generator aligned to syllabus rubrics',
        'Automated class mistake analysis and intervention alerts',
        'Full gradebook, assignment grading, and submission review',
        'Course syllabus manager with video, slides, and code attachments',
      ],
    },
    {
      id: 'parent',
      title: 'Parent Portal',
      badge: 'Guardian & Family',
      tagline: 'Real-time visibility into academic growth, daily attendance, grade reports, and teacher messaging.',
      icon: <HeartHandshake className="w-7 h-7" />,
      accentBorder: 'hover:border-emerald-500/80 border-emerald-500/30',
      accentBg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
      accentText: 'text-emerald-600 dark:text-emerald-400',
      buttonColor: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      features: [
        'Multi-child progress overview with subject-level drill-downs',
        'Text-to-speech audio daily digest summaries of student activities',
        'Direct secure messaging with verified teachers and advisors',
        'Instant alerts for pending homework, exam dates, and attendance',
      ],
    },
    {
      id: 'admin',
      title: 'Admin Console',
      badge: 'Institution & IT',
      tagline: 'Institutional user lifecycle management, role-based access control, security logs, and telemetry.',
      icon: <ShieldCheck className="w-7 h-7" />,
      accentBorder: 'hover:border-amber-500/80 border-amber-500/30',
      accentBg: 'bg-amber-50/50 dark:bg-amber-950/20',
      accentText: 'text-amber-600 dark:text-amber-400',
      buttonColor: 'bg-amber-600 hover:bg-amber-700 text-white',
      features: [
        'Role-based access governance and bulk student/teacher enrollment',
        'System uptime telemetry, audit logs, and security controls',
        'Institution-wide performance KPIs and department benchmarks',
        'Exportable compliance reports and platform-wide announcements',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#121519] text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to SmartLearn Home</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#d82a4e]/10 text-[#d82a4e] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Select Your Educational Workspace</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Choose how you want to use SmartLearn.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Every learning journey is unique. Select your role to get access to custom workflows, AI tools, and dedicated dashboards.
          </p>
        </div>

        {/* 4 Role Selection Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role) => (
            <div
              key={role.id}
              className={`flex flex-col justify-between bg-white dark:bg-[#1a1e24] rounded-sm border p-6 shadow-sm hover:shadow-xl transition-all duration-300 ${role.accentBorder}`}
            >
              {/* Card Header & Content */}
              <div className="space-y-4">
                {/* Icon & Badge */}
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-sm ${role.accentBg} ${role.accentText}`}>
                    {role.icon}
                  </div>
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-sm ${role.accentBg} ${role.accentText}`}
                  >
                    {role.badge}
                  </span>
                </div>

                {/* Title & Tagline */}
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {role.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    {role.tagline}
                  </p>
                </div>

                {/* Feature Bullets */}
                <div className="pt-2 border-t border-slate-100 dark:border-[#283038] space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Key Capabilities:
                  </span>
                  <ul className="space-y-1.5">
                    {role.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300"
                      >
                        <CheckCircle2
                          className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${role.accentText}`}
                        />
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons (Explicit Selection: Create Account & Log In) */}
              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-[#283038] space-y-2.5">
                {/* Primary Button: Create Account */}
                <Link
                  href={`/login?role=${role.id}&mode=signup`}
                  className={`w-full py-2.5 px-4 rounded-sm text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${role.buttonColor}`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create {role.id === 'admin' ? 'Admin' : role.id.charAt(0).toUpperCase() + role.id.slice(1)} Account</span>
                </Link>

                {/* Secondary Button: Log In */}
                <Link
                  href={`/login?role=${role.id}&mode=signin`}
                  className="w-full py-2 px-4 rounded-sm text-xs font-bold flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-[#20252b] hover:bg-slate-200 dark:hover:bg-[#283038] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#283038] transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In to {role.id === 'admin' ? 'Admin' : role.id.charAt(0).toUpperCase() + role.id.slice(1)}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Demo Launch Notice / Evaluator Support */}
        <div className="p-6 rounded-sm bg-white dark:bg-[#1a1e24] border border-slate-200 dark:border-[#283038] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-sm bg-[#d82a4e]/10 text-[#d82a4e]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                Evaluating SmartLearn for your School or University?
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                You can try out preloaded mock profiles for Student (Alex), Teacher (Sarah), Parent (Priya), and Admin (Marcus).
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 rounded-sm bg-[#d82a4e] hover:bg-[#b81d3d] text-white text-xs font-bold transition-all inline-flex items-center gap-1.5"
            >
              <span>Explore Instant Demo Mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
