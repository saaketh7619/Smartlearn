'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Sparkles,
  Search,
  Moon,
  Sun,
  ChevronDown,
  UserCheck,
  LogOut,
  Shield,
  GraduationCap,
  Users,
  HeartHandshake,
  ArrowUpRight,
  Menu,
  X,
  ArrowRight,
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
  const switchDemoRole = useStore((state) => state.switchDemoRole);
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);
  const setCommandPaletteOpen = useStore((state) => state.setCommandPaletteOpen);

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentRole = currentUser?.role || 'STUDENT';
  const isLandingPage = pathname === '/' || pathname === '';

  const roleStyles = {
    STUDENT: {
      name: 'Student Portal',
      badgeClass: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
      icon: <GraduationCap className="w-3.5 h-3.5 mr-1 text-blue-500" />,
      dashboard: '/student/',
    },
    TEACHER: {
      name: 'Teacher Portal',
      badgeClass: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
      icon: <Users className="w-3.5 h-3.5 mr-1 text-purple-500" />,
      dashboard: '/teacher/',
    },
    PARENT: {
      name: 'Parent Portal',
      badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      icon: <HeartHandshake className="w-3.5 h-3.5 mr-1 text-emerald-500" />,
      dashboard: '/parent/',
    },
    ADMIN: {
      name: 'Admin Console',
      badgeClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
      icon: <Shield className="w-3.5 h-3.5 mr-1 text-amber-500" />,
      dashboard: '/admin/',
    },
  };

  // Proactively prefetch all navbar and portal routes on mount for instantaneous (0ms) clicks
  useEffect(() => {
    const routesToPreload = [
      '/',
      '/about/',
      '/student/courses/',
      '/blog/',
      '/contact/',
      '/get-started/',
      '/login/',
      '/student/',
      '/teacher/',
      '/parent/',
      '/admin/',
    ];
    routesToPreload.forEach((r) => {
      try {
        router.prefetch(r);
      } catch {
        // ignore
      }
    });
  }, [router]);

  const handleSwitchRole = (role: Role) => {
    switchDemoRole(role);
    setRoleDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push(roleStyles[role].dashboard);
  };

  const handleLogout = () => {
    logoutUser();
    setMobileMenuOpen(false);
    router.push('/');
  };

  const isNavActive = (path: string) => {
    if (path === '/') return pathname === '/' || pathname === '';
    return pathname === path || pathname === `${path}/` || pathname.startsWith(`${path}/`);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-200 border-b bg-white/95 dark:bg-[#1a1e24]/95 text-slate-900 dark:text-white border-slate-200 dark:border-[#283038] backdrop-blur-md shadow-xs">
      <div className="flex h-16 sm:h-20 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Left: SmartLearn Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" prefetch={true} className="flex flex-col group">
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-2xl sm:text-3xl tracking-tight text-slate-900 dark:text-white">
                Smart<span className="text-[#d82a4e]">Learn</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide -mt-1">
              AI-Powered Learning Ecosystem
            </span>
          </Link>

          {/* Active Portal Badge (Only shown when authenticated) */}
          {isLoggedIn && currentUser && !isLandingPage && (
            <div
              className={`hidden md:flex items-center px-2.5 py-1 text-xs font-bold rounded-md border ${roleStyles[currentRole].badgeClass}`}
            >
              {roleStyles[currentRole].icon}
              {roleStyles[currentRole].name}
            </div>
          )}
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <Link
            href="/"
            prefetch={true}
            className={`transition-colors hover:text-[#d82a4e] dark:hover:text-[#d82a4e] ${
              isNavActive('/') ? 'text-[#d82a4e] font-bold' : ''
            }`}
          >
            Home
          </Link>
          <Link
            href="/about/"
            prefetch={true}
            className={`transition-colors hover:text-[#d82a4e] dark:hover:text-[#d82a4e] ${
              isNavActive('/about') ? 'text-[#d82a4e] font-bold' : ''
            }`}
          >
            About
          </Link>
          <Link
            href="/student/courses/"
            prefetch={true}
            className={`transition-colors hover:text-[#d82a4e] dark:hover:text-[#d82a4e] ${
              isNavActive('/student/courses') ? 'text-[#d82a4e] font-bold' : ''
            }`}
          >
            Courses
          </Link>

          {/* Portals Dropdown */}
          <div className="relative group cursor-pointer flex items-center gap-1 hover:text-[#d82a4e] transition-colors py-2">
            <span>Portals</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            <div className="absolute top-full left-0 mt-1 w-56 py-2 bg-white dark:bg-[#1a1e24] rounded-xl shadow-2xl border border-slate-200 dark:border-[#283038] text-slate-800 dark:text-slate-100 hidden group-hover:block transition-all z-50">
              <Link
                href="/get-started/"
                prefetch={true}
                className="w-full text-left px-4 py-2 text-xs font-bold text-[#d82a4e] hover:bg-slate-50 dark:hover:bg-[#20252b] flex items-center justify-between border-b border-slate-100 dark:border-[#283038]"
              >
                <span>🚀 Choose Portal / Onboarding</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/student/"
                prefetch={true}
                onClick={() => switchDemoRole('STUDENT')}
                className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-[#20252b] flex items-center justify-between cursor-pointer"
              >
                <span>🎓 Student Workspace</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-blue-500" />
              </Link>
              <Link
                href="/teacher/"
                prefetch={true}
                onClick={() => switchDemoRole('TEACHER')}
                className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-[#20252b] flex items-center justify-between cursor-pointer"
              >
                <span>👩‍🏫 Teacher Hub</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-purple-500" />
              </Link>
              <Link
                href="/parent/"
                prefetch={true}
                onClick={() => switchDemoRole('PARENT')}
                className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-[#20252b] flex items-center justify-between cursor-pointer"
              >
                <span>👨‍👩‍👧 Parent Portal</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
              </Link>
              <Link
                href="/admin/"
                prefetch={true}
                onClick={() => switchDemoRole('ADMIN')}
                className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-[#20252b] flex items-center justify-between cursor-pointer"
              >
                <span>⚡ Admin Console</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" />
              </Link>
            </div>
          </div>

          <Link
            href="/blog/"
            prefetch={true}
            className={`transition-colors hover:text-[#d82a4e] dark:hover:text-[#d82a4e] ${
              isNavActive('/blog') ? 'text-[#d82a4e] font-bold' : ''
            }`}
          >
            Blog
          </Link>
          <Link
            href="/contact/"
            prefetch={true}
            className={`transition-colors hover:text-[#d82a4e] dark:hover:text-[#d82a4e] ${
              isNavActive('/contact') ? 'text-[#d82a4e] font-bold' : ''
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Right Section: Theme Toggle, Auth / Action Buttons, Mobile Hamburger */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Theme Toggle Button */}
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

          {/* Logged in controls: Role Switcher, Notifications, Dashboard shortcut, Logout */}
          {isLoggedIn && currentUser ? (
            <div className="flex items-center gap-2">
              {/* Persona Switcher (Only when logged in) */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-md border border-slate-200 dark:border-[#283038] bg-slate-100 dark:bg-[#20252b] text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-[#283038] transition-all cursor-pointer"
                  title="Switch active role"
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#d82a4e]" />
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
                      <Link
                        href="/student/"
                        prefetch={true}
                        onClick={() => handleSwitchRole('STUDENT')}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left hover:bg-slate-100 dark:hover:bg-[#20252b]"
                      >
                        <span>🎓 Student (Alex)</span>
                        {currentRole === 'STUDENT' && <span className="text-[#d82a4e] text-[10px] font-bold">Active</span>}
                      </Link>
                      <Link
                        href="/teacher/"
                        prefetch={true}
                        onClick={() => handleSwitchRole('TEACHER')}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left hover:bg-slate-100 dark:hover:bg-[#20252b]"
                      >
                        <span>👩‍🏫 Teacher (Sarah)</span>
                        {currentRole === 'TEACHER' && <span className="text-[#d82a4e] text-[10px] font-bold">Active</span>}
                      </Link>
                      <Link
                        href="/parent/"
                        prefetch={true}
                        onClick={() => handleSwitchRole('PARENT')}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left hover:bg-slate-100 dark:hover:bg-[#20252b]"
                      >
                        <span>👨‍👩‍👧 Parent (Priya)</span>
                        {currentRole === 'PARENT' && <span className="text-emerald-500 text-[10px] font-bold">Active</span>}
                      </Link>
                      <Link
                        href="/admin/"
                        prefetch={true}
                        onClick={() => handleSwitchRole('ADMIN')}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left hover:bg-slate-100 dark:hover:bg-[#20252b]"
                      >
                        <span>⚡ Admin (Marcus)</span>
                        {currentRole === 'ADMIN' && <span className="text-amber-500 text-[10px] font-bold">Active</span>}
                      </Link>
                    </div>
                  </>
                )}
              </div>

              {/* User Notifications */}
              <NotificationCenter />

              {/* Direct Dashboard Shortcut */}
              <Link
                href={roleStyles[currentRole].dashboard}
                prefetch={true}
                className="btn-crimson inline-flex items-center justify-center px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-bold shadow-sm gap-1"
              >
                <span>Dashboard</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md bg-slate-100 hover:bg-[#d82a4e]/10 text-slate-700 dark:text-slate-300 dark:bg-[#20252b] dark:hover:bg-[#d82a4e]/20 hover:text-[#d82a4e] dark:hover:text-[#d82a4e] text-xs font-bold border border-slate-200 dark:border-[#283038] transition-all cursor-pointer shadow-xs"
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut className="w-3.5 h-3.5 text-[#d82a4e]" />
                <span className="hidden lg:inline">Log Out</span>
              </button>
            </div>
          ) : (
            /* Unauthenticated state: Clean Login & Get Started buttons */
            <div className="flex items-center gap-2">
              <Link
                href="/login/"
                prefetch={true}
                className="px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-[#d82a4e] dark:hover:text-[#d82a4e] transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/get-started/"
                prefetch={true}
                className="btn-crimson inline-flex items-center justify-center px-4 sm:px-5 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-bold shadow-md hover:scale-[1.02] transition-transform"
              >
                <span>Get Started</span>
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button for Public Pages */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md border border-slate-200 dark:border-[#283038] bg-slate-100 dark:bg-[#20252b] text-slate-700 dark:text-slate-200 hover:text-[#d82a4e] transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Out Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-[#283038] bg-white dark:bg-[#1a1e24] px-4 py-5 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-3 text-sm font-bold text-slate-800 dark:text-slate-100">
            <Link
              href="/"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#d82a4e] transition-colors flex items-center justify-between"
            >
              <span>Home</span>
            </Link>
            <Link
              href="/about/"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#d82a4e] transition-colors flex items-center justify-between"
            >
              <span>About Us</span>
            </Link>
            <Link
              href="/student/courses/"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#d82a4e] transition-colors flex items-center justify-between"
            >
              <span>Course Library</span>
            </Link>
            <Link
              href="/get-started/"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-[#d82a4e] hover:underline flex items-center justify-between font-extrabold"
            >
              <span>🚀 Choose Portal / Onboarding</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/blog/"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#d82a4e] transition-colors flex items-center justify-between"
            >
              <span>Academic Blog</span>
            </Link>
            <Link
              href="/contact/"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#d82a4e] transition-colors flex items-center justify-between"
            >
              <span>Contact Us</span>
            </Link>
          </nav>

          <div className="pt-4 border-t border-slate-100 dark:border-[#283038] flex flex-col gap-2">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/get-started/"
                  prefetch={true}
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-crimson w-full py-2.5 rounded-md text-center text-xs font-bold uppercase tracking-wider"
                >
                  Get Started
                </Link>
                <Link
                  href="/login/"
                  prefetch={true}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-md border border-slate-200 dark:border-[#283038] text-center text-xs font-bold text-slate-700 dark:text-slate-200"
                >
                  Log In
                </Link>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  href={roleStyles[currentRole].dashboard}
                  prefetch={true}
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-crimson w-full py-2.5 rounded-md text-center text-xs font-bold uppercase tracking-wider block"
                >
                  Open {roleStyles[currentRole].name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 rounded-md border border-slate-200 dark:border-[#283038] text-center text-xs font-bold text-rose-600 dark:text-rose-400 block cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
