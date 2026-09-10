'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  BrainCircuit,
  FileQuestion,
  Calendar,
  Layers,
  FileText,
  Clock,
  BarChart3,
  Compass,
  Users,
  Wand2,
  PlusCircle,
  MessageSquare,
  Printer,
  ShieldCheck,
  Award,
  BellRing,
  Settings,
  HelpCircle,
  Menu,
  X,
  Flame,
  LogOut,
  GraduationCap,
} from 'lucide-react';
import { useStore } from '@/store/useStore';

interface NavLinkItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const currentUser = useStore((state) => state.currentUser);
  const logoutUser = useStore((state) => state.logoutUser);
  const triggerConfetti = useStore((state) => state.triggerConfetti);
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = currentUser?.role || 'STUDENT';

  const studentNav: NavLinkItem[] = [
    { title: 'Dashboard', href: '/student', icon: <LayoutDashboard className="w-4 h-4" /> },
    { title: 'My Profile & Class', href: '/student/profile', icon: <GraduationCap className="w-4 h-4 text-emerald-500" /> },
    { title: 'Course Library', href: '/student/courses', icon: <BookOpen className="w-4 h-4" /> },
    { title: 'AI Tutor', href: '/student/tutor', icon: <BrainCircuit className="w-4 h-4 text-blue-500" />, badge: 'AI' },
    { title: 'Tests & Contests', href: '/student/tests', icon: <FileQuestion className="w-4 h-4" />, badge: 'Live' },
    { title: 'AI Study Planner', href: '/student/planner', icon: <Calendar className="w-4 h-4 text-indigo-500" /> },
    { title: 'AI Revision', href: '/student/revision', icon: <Layers className="w-4 h-4 text-purple-500" /> },
    { title: 'Notebook', href: '/student/notebook', icon: <FileText className="w-4 h-4" /> },
    { title: 'Focus Mode', href: '/student/focus', icon: <Clock className="w-4 h-4 text-emerald-500" /> },
    { title: 'Analytics', href: '/student/analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { title: 'Career & Wellness', href: '/student/career-wellness', icon: <Compass className="w-4 h-4 text-amber-500" /> },
  ];

  const teacherNav: NavLinkItem[] = [
    { title: 'Class Dashboard', href: '/teacher', icon: <LayoutDashboard className="w-4 h-4" /> },
    { title: 'Student Roster', href: '/teacher/roster', icon: <Users className="w-4 h-4" /> },
    { title: 'AI Paper & Plan Gen', href: '/teacher/generator', icon: <Wand2 className="w-4 h-4 text-purple-500" />, badge: 'AI' },
    { title: 'Create Test', href: '/teacher/tests/create', icon: <PlusCircle className="w-4 h-4" /> },
    { title: 'Weakness Analytics', href: '/teacher/analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { title: 'Messages', href: '/teacher/messages', icon: <MessageSquare className="w-4 h-4" /> },
    { title: 'Report Cards', href: '/teacher/reports', icon: <Printer className="w-4 h-4" /> },
  ];

  const parentNav: NavLinkItem[] = [
    { title: 'Child Overview', href: '/parent', icon: <LayoutDashboard className="w-4 h-4" /> },
    { title: 'Progress Trends', href: '/parent/progress', icon: <BarChart3 className="w-4 h-4" /> },
    { title: 'Smart Alerts', href: '/parent/alerts', icon: <BellRing className="w-4 h-4 text-rose-500" />, badge: '1 Action' },
    { title: 'Achievements', href: '/parent/achievements', icon: <Award className="w-4 h-4 text-amber-500" /> },
    { title: 'Teacher Messages', href: '/parent/messages', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  const adminNav: NavLinkItem[] = [
    { title: 'Command Center', href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { title: 'Curriculum Manager', href: '/admin/curriculum', icon: <Layers className="w-4 h-4 text-indigo-500" />, badge: 'CMS' },
    { title: 'User Management', href: '/admin/users', icon: <Users className="w-4 h-4" /> },
    { title: 'Course Catalog', href: '/admin/courses', icon: <BookOpen className="w-4 h-4" /> },
    { title: 'Moderation Queue', href: '/admin/moderation', icon: <ShieldCheck className="w-4 h-4 text-amber-500" />, badge: '2 Flagged' },
    { title: 'Support Tickets', href: '/admin/tickets', icon: <HelpCircle className="w-4 h-4" /> },
    { title: 'Settings & Security', href: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  let currentNav = studentNav;
  if (role === 'TEACHER') currentNav = teacherNav;
  if (role === 'PARENT') currentNav = parentNav;
  if (role === 'ADMIN') currentNav = adminNav;

  const NavContent = () => (
    <div className="flex flex-col h-full justify-between p-3.5">
      <div className="space-y-1">
        {/* Portal title */}
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
          <span>{role} Portal</span>
          {role === 'STUDENT' && currentUser?.studentProfile && (
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-extrabold normal-case text-xs">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              {currentUser.studentProfile.streakDays}d
            </span>
          )}
        </div>

        {/* Links */}
        <div className="space-y-0.5">
          {currentNav.map((item) => {
            const isActive = pathname === item.href || (item.href !== `/${role.toLowerCase()}` && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-md text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#d82a4e] text-white font-bold shadow-md shadow-red-900/25'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#20252b]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400 group-hover:text-[#d82a4e]'}>{item.icon}</span>
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-red-50 text-[#d82a4e] dark:bg-red-950/40 dark:text-rose-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Role-specific bottom micro-card */}
      {role === 'STUDENT' && currentUser?.studentProfile && (
        <div className="p-3 rounded-lg bg-rose-50/50 dark:bg-[#20252b] border border-rose-100 dark:border-[#283038] mt-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
            <span>Level {currentUser.studentProfile.level}</span>
            <span className="text-[#d82a4e] font-mono">{currentUser.studentProfile.xp} XP</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-[#d82a4e] rounded-full"
              style={{ width: `${(currentUser.studentProfile.xp % 200) / 2}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 flex items-center justify-between">
            <span>🪙 {currentUser.studentProfile.coins} Coins</span>
            <span className="text-[#d82a4e] font-semibold">Keep Learning!</span>
          </p>
        </div>
      )}

      {role === 'TEACHER' && (
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#20252b] border border-slate-200 dark:border-[#283038] text-xs mt-4">
          <p className="font-bold text-slate-900 dark:text-slate-200">Dr. Sarah Jenkins</p>
          <p className="text-[11px] text-[#d82a4e]">Class 10-A (32 students)</p>
        </div>
      )}

      {role === 'PARENT' && (
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#20252b] border border-slate-200 dark:border-[#283038] text-xs mt-4">
          <p className="font-bold text-slate-900 dark:text-slate-200">Active Child</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400">Alex Rivera (Grade 10)</p>
        </div>
      )}

      {role === 'ADMIN' && (
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#20252b] border border-slate-200 dark:border-[#283038] text-xs mt-4">
          <p className="font-bold text-slate-900 dark:text-slate-200">System Healthy</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400">99.98% uptime</p>
        </div>
      )}

      {/* Logout & Return Home Button */}
      <div className="pt-3 mt-3 border-t border-slate-200 dark:border-[#283038]">
        <button
          onClick={() => {
            logoutUser();
            triggerConfetti();
            setMobileOpen(false);
            router.push('/');
          }}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#d82a4e] dark:hover:text-[#d82a4e] hover:bg-slate-100 dark:hover:bg-[#20252b] transition-all cursor-pointer group"
          title="Logout and return to Home Page"
        >
          <div className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4 text-[#d82a4e] group-hover:scale-110 transition-transform" />
            <span>Log Out</span>
          </div>
          <span className="text-[10px] text-slate-400 font-normal">Home ➔</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#1a1e24]/95 backdrop-blur-md border-t border-slate-200 dark:border-[#283038] px-2 py-1.5 flex items-center justify-around shadow-lg"
      >
        <Link
          href={role === 'STUDENT' ? '/student' : role === 'TEACHER' ? '/teacher' : role === 'PARENT' ? '/parent' : '/admin'}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-semibold transition-colors ${
            pathname === '/student' || pathname === '/teacher' || pathname === '/parent' || pathname === '/admin'
              ? 'text-[#d82a4e] font-bold'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Home</span>
        </Link>

        {role === 'STUDENT' && (
          <>
            <Link
              href="/student/courses"
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-semibold transition-colors ${
                pathname.startsWith('/student/courses')
                  ? 'text-[#d82a4e] font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Courses</span>
            </Link>

            <Link
              href="/student/tutor"
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-semibold transition-colors ${
                pathname.startsWith('/student/tutor')
                  ? 'text-blue-500 font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BrainCircuit className="w-4 h-4" />
              <span>AI Tutor</span>
            </Link>

            <Link
              href="/student/tests"
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-semibold transition-colors ${
                pathname.startsWith('/student/tests')
                  ? 'text-[#d82a4e] font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileQuestion className="w-4 h-4" />
              <span>Tests</span>
            </Link>
          </>
        )}

        <button
          onClick={() => setMobileOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          aria-label="Open Full Menu"
        >
          <Menu className="w-4 h-4" />
          <span>More</span>
        </button>
      </nav>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200 dark:border-[#283038] bg-white dark:bg-[#1a1e24] sticky top-16 sm:top-20 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] overflow-y-auto">
        <NavContent />
      </aside>

      {/* Mobile Slide-over Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 shadow-2xl z-10 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">Navigation</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pb-16">
              <NavContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
