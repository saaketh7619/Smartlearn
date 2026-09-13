import React from 'react';
import Link from 'next/link';
import { Sparkles, BrainCircuit, Shield, Users, GraduationCap, HeartHandshake, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'About SmartLearn — AI-Powered Education Ecosystem',
  description: 'Learn about SmartLearn\'s mission to transform education through adaptive AI, personalized learning, and a unified platform for students, teachers, and parents.',
};

export default function AboutPage() {
  const values = [
    {
      icon: <BrainCircuit className="w-6 h-6 text-blue-500" />,
      title: 'Adaptive Intelligence',
      description: 'Our AI engine continuously learns from each student\'s strengths and knowledge gaps to serve the right content at the right difficulty, maximizing learning efficiency.',
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-500" />,
      title: 'Privacy & Security First',
      description: 'Student data is never sold. We are FERPA and COPPA aligned, using encryption-at-rest, role-based access, and zero third-party data sharing.',
    },
    {
      icon: <Users className="w-6 h-6 text-purple-500" />,
      title: 'Unified Ecosystem',
      description: 'One platform connecting students, teachers, and parents with a shared data layer — enabling transparent progress tracking and collaborative learning.',
    },
  ];

  const portals = [
    { role: 'Student', icon: <GraduationCap className="w-5 h-5" />, color: 'blue', desc: 'Adaptive tests, AI doubt tutor, gamified XP, study planner, and analytics.', href: '/student/' },
    { role: 'Teacher', icon: <Users className="w-5 h-5" />, color: 'purple', desc: 'Class performance analytics, AI lesson planner, question paper generator.', href: '/teacher/' },
    { role: 'Parent', icon: <HeartHandshake className="w-5 h-5" />, color: 'emerald', desc: 'Multi-child progress view, smart alerts, and read-aloud activity summaries.', href: '/parent/' },
  ];

  const features = [
    'Real-time adaptive difficulty scaling during tests',
    'Step-by-step AI math and science derivations',
    'Spaced-repetition flashcard revision engine',
    'Comprehensive performance analytics with Recharts',
    'Page Visibility API anti-cheating for tests',
    'Web Speech API voice summaries for parents',
    'Dark mode with saved preference',
    'Offline-tolerant with graceful fallbacks',
    'WCAG 2.1 AA accessible interface',
    'GitHub Pages static deployment with SPA routing',
  ];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#121519] text-slate-900 dark:text-white">
      {/* Hero */}
      <section className="py-20 px-4 sm:px-8 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Our Mission
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
          Transforming Education with{' '}
          <span className="text-[#d82a4e]">Adaptive AI</span>
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          SmartLearn is an AI-powered education ecosystem that brings students, teachers, and parents together on one unified platform — with personalized learning, real-time analytics, and transparent progress tracking.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/login/" prefetch={true} className="btn-crimson px-8 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2">
            Explore the Platform <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/student/courses/" prefetch={true} className="px-8 py-3 rounded-xl bg-slate-100 dark:bg-[#1a1e24] border border-slate-200 dark:border-[#283038] text-sm font-semibold hover:bg-slate-200 dark:hover:bg-[#20252b] transition-colors">
            Browse Courses
          </Link>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 sm:px-8 max-w-5xl mx-auto">
        <h2 className="text-2xl font-extrabold text-center mb-10">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white dark:bg-[#1a1e24] border border-slate-200 dark:border-[#283038] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-[#20252b] flex items-center justify-center">
                {v.icon}
              </div>
              <h3 className="font-bold text-base">{v.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Portals */}
      <section className="py-16 px-4 sm:px-8 max-w-5xl mx-auto">
        <h2 className="text-2xl font-extrabold text-center mb-10">Four Specialized Portals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {portals.map((p) => (
            <Link
              key={p.role}
              href={p.href}
              prefetch={true}
              className="p-6 rounded-3xl bg-white dark:bg-[#1a1e24] border border-slate-200 dark:border-[#283038] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group space-y-3"
            >
              <div className={`w-10 h-10 rounded-2xl bg-${p.color}-500/10 text-${p.color}-500 flex items-center justify-center`}>
                {p.icon}
              </div>
              <h3 className="font-bold">{p.role} Portal</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{p.desc}</p>
              <span className={`text-xs font-bold text-${p.color}-600 dark:text-${p.color}-400 group-hover:underline`}>Open Portal →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Feature list */}
      <section className="py-16 px-4 sm:px-8 max-w-5xl mx-auto">
        <h2 className="text-2xl font-extrabold text-center mb-10">What&apos;s Genuinely Implemented</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-[#1a1e24] border border-slate-200 dark:border-[#283038]">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs leading-relaxed">{f}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-8 max-w-2xl mx-auto text-center space-y-4 border-t border-slate-200 dark:border-[#283038]">
        <h2 className="text-xl font-extrabold">Ready to get started?</h2>
        <p className="text-sm text-slate-500">Experience adaptive AI learning — no credit card required for demo access.</p>
        <Link href="/login/" prefetch={true} className="btn-crimson px-8 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2">
          Start Learning Free <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </main>
  );
}
