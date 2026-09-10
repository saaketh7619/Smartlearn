'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  ArrowLeft,
  ArrowRight,
  UserCheck,
  Lock,
  LogOut,
  Sparkles,
  GraduationCap,
  Users,
  HeartHandshake,
  Shield,
  RefreshCw,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Role } from '@/types';

interface RoleGuardProps {
  requiredRole: Role;
  children: React.ReactNode;
}

export function RoleGuard({ requiredRole, children }: RoleGuardProps) {
  const router = useRouter();
  const { currentUser, isLoggedIn, switchDemoRole, logoutUser } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Avoid hydration mismatch during initial mount
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="flex items-center gap-3 text-slate-400 text-xs font-semibold">
          <div className="w-4 h-4 border-2 border-[#d82a4e] border-t-transparent rounded-full animate-spin" />
          <span>Verifying role permissions...</span>
        </div>
      </div>
    );
  }

  const roleDashboardMap: Record<Role, string> = {
    STUDENT: '/student',
    TEACHER: '/teacher',
    PARENT: '/parent',
    ADMIN: '/admin',
  };

  const roleNameMap: Record<Role, string> = {
    STUDENT: 'Student',
    TEACHER: 'Teacher',
    PARENT: 'Parent',
    ADMIN: 'Administrator',
  };

  // 1. If unauthenticated, prompt to sign in or use demo
  if (!isLoggedIn || !currentUser) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-[#1a1e24] border border-slate-200 dark:border-[#283038] rounded-sm p-8 shadow-xl text-center space-y-6">
          <div className="mx-auto w-14 h-14 rounded-full bg-[#d82a4e]/10 text-[#d82a4e] flex items-center justify-center">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-sm bg-[#d82a4e]/10 text-[#d82a4e]">
              Authentication Required
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Sign In to {roleNameMap[requiredRole]} Portal
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              You must be signed in with a verified {roleNameMap[requiredRole]} account to access these tools and resources.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <Link
              href={`/login?role=${requiredRole.toLowerCase()}&mode=signin`}
              className="w-full py-2.5 px-4 rounded-sm bg-[#d82a4e] hover:bg-[#b81d3d] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Sign In as {roleNameMap[requiredRole]}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => switchDemoRole(requiredRole)}
              className="w-full py-2 px-4 rounded-sm bg-slate-100 dark:bg-[#20252b] hover:bg-slate-200 dark:hover:bg-[#283038] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#283038] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Instant 1-Click Demo ({roleNameMap[requiredRole]})</span>
            </button>

            <div className="pt-2">
              <Link
                href="/get-started"
                className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Choose a different portal</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. If authenticated but role does NOT match requiredRole
  if (currentUser.role !== requiredRole) {
    const userRoleName = roleNameMap[currentUser.role];
    const targetRoleName = roleNameMap[requiredRole];

    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white dark:bg-[#1a1e24] border border-amber-500/30 dark:border-amber-500/20 rounded-sm p-8 sm:p-10 shadow-xl space-y-6 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-extrabold uppercase tracking-wider">
              <span>Access Restricted</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Unauthorized Portal Access
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
              You are currently signed in as <span className="font-bold text-slate-900 dark:text-white">{currentUser.name}</span> with the <span className="font-bold text-amber-600 dark:text-amber-400">{userRoleName}</span> role. This section requires <span className="font-bold text-[#d82a4e]">{targetRoleName}</span> privileges.
            </p>
          </div>

          {/* Explicit User Action Options */}
          <div className="space-y-3 pt-2">
            {/* Action 1: Return to own dashboard */}
            <Link
              href={roleDashboardMap[currentUser.role]}
              className="w-full py-2.5 px-4 rounded-sm bg-[#d82a4e] hover:bg-[#b81d3d] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Return to My {userRoleName} Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Action 2: Switch accounts / Login with target role */}
            <Link
              href={`/login?role=${requiredRole.toLowerCase()}&mode=signin`}
              className="w-full py-2 px-4 rounded-sm bg-slate-100 dark:bg-[#20252b] hover:bg-slate-200 dark:hover:bg-[#283038] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#283038] text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Switch Account / Sign In as {targetRoleName}</span>
            </Link>

            {/* Action 3: Switch directly via demo toggle */}
            <button
              type="button"
              onClick={() => switchDemoRole(requiredRole)}
              className="w-full py-2 px-4 rounded-sm bg-transparent hover:bg-slate-50 dark:hover:bg-[#20252b] text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border border-dashed border-slate-300 dark:border-[#283038] text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
              <span>Switch to Demo {targetRoleName} Persona</span>
            </button>

            {/* Action 4: Logout or Back to Home */}
            <div className="flex items-center justify-center gap-4 pt-2 text-xs text-slate-500 dark:text-slate-400">
              <button
                type="button"
                onClick={() => logoutUser()}
                className="hover:text-rose-500 transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>Log Out</span>
              </button>
              <span>•</span>
              <Link href="/" className="hover:underline">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. User is authenticated and matches requiredRole -> Render children
  return <>{children}</>;
}
