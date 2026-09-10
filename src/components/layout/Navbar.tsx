'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Sparkles,
  Search,
  Moon,
  Sun,
  Globe,
  ChevronDown,
  UserCheck,
  LogOut,
  ExternalLink,
  Shield,
  GraduationCap,
  Users,
  HeartHandshake,
  ArrowUpRight,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { NotificationCenter } from '@/components/shared/NotificationCenter';
import { Role } from '@/types';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const currentUser = useStore((state) => state.currentUser);
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const logoutUser = useStore((state) => state.logoutUser);
  const setWelcomeSplashOpen = useStore((state) => state.setWelcomeSplashOpen);
  const switchDemoRole = useStore((state) => state.switchDemoRole);
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);
  const language = useStore((state) => state.language);
  const setLanguage = useStore((state) => state.setLanguage);
  const setCommandPaletteOpen = useStore((state) => state.setCommandPaletteOpen);
  const triggerConfetti = useStore((state) => state.triggerConfetti);

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const currentRole = currentUser?.role || 'STUDENT';
  const isLandingPage = pathname === '/';

  const roleStyles = {
    STUDENT: {
      name: 'Student Portal',
      badgeClass: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      icon: <GraduationCap className="w-3.5 h-3.5 mr-1" />,
    },
    TEACHER: {
      name: 'Teacher Portal',
      badgeClass: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      icon: <Users className="w-3.5 h-3.5 mr-1" />,
    },
    PARENT: {
      name: 'Parent Portal',
      badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      icon: <HeartHandshake className="w-3.5 h-3.5 mr-1" />,
    },
    ADMIN: {
      name: 'Admin Console',
      badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      icon: <Shield className="w-3.5 h-3.5 mr-1" />,
    },
  };

  const handleSwitchRole = (role: Role) => {
    switchDemoRole(role);
    setRoleDropdownOpen(false);
    triggerConfetti();
    if (role === 'STUDENT') router.push('/student');
    if (role === 'TEACHER') router.push('/teacher');
    if (role === 'PARENT') router.push('/parent');
    if (role === 'ADMIN') router.push('/admin');
  };

  const handleLogout = () => {
    logoutUser();
    triggerConfetti();
    router.push('/');
  };

  return (
    <header
      className="sticky top-0 z-40 w-full transition-colors duration-200 border-b bg-white/95 dark:bg-[#1a1e24]/95 text-slate-900 dark:text-white border-slate-200 dark:border-[#283038] backdrop-blur-md shadow-xs"
    >
      <div className="flex h-16 sm:h-20 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Left: WebUni Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex flex-col group">
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-2xl sm:text-3xl tracking-tight text-slate-900 dark:text-white">
                Web<span className="text-[#d82a4e]">Uni</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide -mt-1">
              Learn From the Best
            </span>
          </Link>

          {/* Current Portal Active Badge */}
          {!isLandingPage && (
            <div className={`hidden md:flex items-center px-2.5 py-1 text-xs font-bold rounded-md border ${roleStyles[currentRole].badgeClass}`}>
              {roleStyles[currentRole].icon}
              {roleStyles[currentRole].name}
            </div>
          )}
        </div>

        {/* Center: Clean Nav Links matching WebUni */}
        {isLandingPage ? (
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <Link href="/" className="text-slate-900 dark:text-white hover:text-[#d82a4e] dark:hover:text-[#d82a4e] transition-colors">
              Home
            </Link>
            <button
              onClick={() => {
                document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#d82a4e] transition-colors cursor-pointer"
            >
              About us
            </button>
            <Link href="/student/courses" className="hover:text-[#d82a4e] transition-colors">
              Courses
            </Link>
            <div className="relative group cursor-pointer flex items-center gap-1 hover:text-[#d82a4e] transition-colors">
              <span>Portals</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-2 w-52 py-2 bg-white dark:bg-[#1a1e24] rounded-xl shadow-2xl border border-slate-200 dark:border-[#283038] text-slate-800 dark:text-slate-100 hidden group-hover:block transition-all z-50">
                <button
                  onClick={() => handleSwitchRole('STUDENT')}
                  className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-slate-50 dark:hover:bg-[#20252b] flex items-center justify-between"
                >
                  <span>🎓 Student Portal</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-blue-500" />
                </button>
                <button
                  onClick={() => handleSwitchRole('TEACHER')}
                  className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-slate-50 dark:hover:bg-[#20252b] flex items-center justify-between"
                >
                  <span>👩‍🏫 Teacher Portal</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#d82a4e]" />
                </button>
                <button
                  onClick={() => handleSwitchRole('PARENT')}
                  className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-slate-50 dark:hover:bg-[#20252b] flex items-center justify-between"
                >
                  <span>👨‍👩‍👧 Parent Portal</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                </button>
                <button
                  onClick={() => handleSwitchRole('ADMIN')}
                  className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-slate-50 dark:hover:bg-[#20252b] flex items-center justify-between"
                >
                  <span>⚡ Admin Console</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" />
                </button>
              </div>
            </div>
            <Link href="/blog" className="hover:text-[#d82a4e] transition-colors">
              News
            </Link>
            <button
              onClick={() => {
                document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#d82a4e] transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>
        ) : (
          <div className="hidden lg:flex items-center max-w-md w-full mx-6">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="w-full flex items-center justify-between px-4 py-2 text-xs text-slate-400 dark:text-slate-400 bg-slate-100 dark:bg-[#20252b] hover:bg-slate-200/70 dark:hover:bg-[#283038] rounded-md border border-slate-200 dark:border-[#283038] transition-all shadow-inner"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-[#d82a4e]" />
                <span>Search courses, adaptive tests, topics, or AI tools...</span>
              </div>
              <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-medium rounded bg-white dark:bg-[#1a1e24] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#283038]">
                Ctrl+K
              </kbd>
            </button>
          </div>
        )}

        {/* Right: Quick Demo Selector, Language, Theme, and WebUni Crimson Login Button */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick 1-Click Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md border border-slate-200 dark:border-[#283038] bg-slate-100 dark:bg-[#20252b] text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-[#283038] transition-all cursor-pointer"
              title="Switch demo persona"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#d82a4e]" />
              <span className="hidden sm:inline">Role:</span>
              <span className="capitalize">{currentRole.toLowerCase()}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setRoleDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-[#1a1e24] border border-slate-200 dark:border-[#283038] shadow-2xl z-40 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150 text-slate-800 dark:text-slate-100">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Active Portal
                  </div>
                  <button
                    onClick={() => handleSwitchRole('STUDENT')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left hover:bg-slate-100 dark:hover:bg-[#20252b]"
                  >
                    <span>🎓 Demo Student (Alex)</span>
                    {currentRole === 'STUDENT' && <span className="text-[#d82a4e] text-[10px] font-bold">Active</span>}
                  </button>
                  <button
                    onClick={() => handleSwitchRole('TEACHER')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left hover:bg-slate-100 dark:hover:bg-[#20252b]"
                  >
                    <span>👩‍🏫 Demo Teacher (Sarah)</span>
                    {currentRole === 'TEACHER' && <span className="text-[#d82a4e] text-[10px] font-bold">Active</span>}
                  </button>
                  <button
                    onClick={() => handleSwitchRole('PARENT')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left hover:bg-slate-100 dark:hover:bg-[#20252b]"
                  >
                    <span>👨‍👩‍👧 Demo Parent (Priya)</span>
                    {currentRole === 'PARENT' && <span className="text-emerald-500 text-[10px] font-bold">Active</span>}
                  </button>
                  <button
                    onClick={() => handleSwitchRole('ADMIN')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left hover:bg-slate-100 dark:hover:bg-[#20252b]"
                  >
                    <span>⚡ Demo Admin (Marcus)</span>
                    {currentRole === 'ADMIN' && <span className="text-amber-500 text-[10px] font-bold">Active</span>}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Theme Toggle Button (Light & Dark) */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 dark:border-[#283038] bg-slate-100 dark:bg-[#20252b] text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-[#283038] transition-all text-xs font-semibold cursor-pointer shadow-xs"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
            aria-label="Toggle dark and light theme"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline text-xs">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-[#d82a4e]" />
                <span className="hidden sm:inline text-xs">Dark</span>
              </>
            )}
          </button>

          {/* Inspirational Quotes & Mission Button */}
          <button
            onClick={() => {
              if (pathname === '/') {
                document.getElementById('quotes-section')?.scrollIntoView({ behavior: 'smooth' });
              } else {
                router.push('/#quotes-section');
              }
            }}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-sm border border-slate-200 dark:border-[#283038] bg-slate-100 dark:bg-[#20252b] text-slate-700 dark:text-slate-300 hover:text-[#d82a4e] text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all shadow-xs"
            title="Inspirational Educational Quotes"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d82a4e]" />
            <span className="hidden lg:inline">Quotes</span>
          </button>

          {/* Global Notifications Bell */}
          <NotificationCenter />

          {/* Authenticated Dashboard button OR WebUni Crimson Login Button */}
          {isLoggedIn && currentUser ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href={
                  currentRole === 'STUDENT'
                    ? '/student'
                    : currentRole === 'TEACHER'
                    ? '/teacher'
                    : currentRole === 'PARENT'
                    ? '/parent'
                    : '/admin'
                }
                className="btn-crimson inline-flex items-center justify-center px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-sm text-xs sm:text-sm font-bold shadow-sm gap-1"
              >
                <span>My Dashboard</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-sm bg-slate-100 hover:bg-[#d82a4e]/10 text-slate-700 dark:text-slate-300 dark:bg-[#20252b] dark:hover:bg-[#d82a4e]/20 hover:text-[#d82a4e] dark:hover:text-[#d82a4e] text-xs font-bold border border-slate-200 dark:border-[#283038] transition-all cursor-pointer shadow-xs"
                title="Logout and return to Home Page"
              >
                <LogOut className="w-3.5 h-3.5 text-[#d82a4e]" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="btn-crimson inline-flex items-center justify-center px-5 sm:px-6 py-1.5 sm:py-2.5 rounded-sm sm:rounded-md text-xs sm:text-sm font-bold shadow-sm"
            >
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
