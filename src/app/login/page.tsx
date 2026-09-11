'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
  Check,
  AlertCircle,
  KeyRound,
  GraduationCap,
  Users,
  HeartHandshake,
  Shield,
  Zap,
  RefreshCw,
  UserCheck,
  Lock,
  ArrowLeft,
  Loader2,
  Settings,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { generateOTP, verifyOTP, DEMO_ACCOUNTS } from '@/lib/auth';
import { INITIAL_USERS } from '@/lib/db';
import { Role, User } from '@/types';
import { sendOtpEmail, getEmailJsConfig } from '@/lib/emailjs';
import EmailJsConfigModal from '@/components/EmailJsConfigModal';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const switchDemoRole = useStore((state) => state.switchDemoRole);
  const loginUser = useStore((state) => state.loginUser);
  const triggerConfetti = useStore((state) => state.triggerConfetti);

  const initialMode = searchParams?.get('mode') === 'signup' ? 'signup' : 'signin';
  const initialRole = (searchParams?.get('role')?.toUpperCase() as Role) || 'STUDENT';

  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [identifier, setIdentifier] = useState('student@smartlearn.edu');
  const [fullName, setFullName] = useState('Alex Rivera');
  const [selectedRole, setSelectedRole] = useState<Role>(initialRole);
  const [gradeOrDept, setGradeOrDept] = useState('Grade 10-A');
  const [otpStep, setOtpStep] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendSeconds, setResendSeconds] = useState(60);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isEmailJsConfigured, setIsEmailJsConfigured] = useState(false);
  const [emailDelivery, setEmailDelivery] = useState<{
    status: 'idle' | 'sent' | 'unconfigured' | 'error';
    message?: string;
  }>({ status: 'idle' });

  useEffect(() => {
    const config = getEmailJsConfig();
    setIsEmailJsConfigured(Boolean(config.serviceId && config.templateId && config.publicKey));
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpStep && resendSeconds > 0) {
      timer = setTimeout(() => setResendSeconds((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpStep, resendSeconds]);

  useEffect(() => {
    const roleParam = searchParams?.get('role')?.toUpperCase();
    if (roleParam && ['STUDENT', 'TEACHER', 'PARENT', 'ADMIN'].includes(roleParam)) {
      setSelectedRole(roleParam as Role);
      if (roleParam === 'STUDENT') {
        setIdentifier('student@smartlearn.edu');
        setFullName('Alex Rivera');
        setGradeOrDept('Grade 10-A');
      } else if (roleParam === 'TEACHER') {
        setIdentifier('sarah@smartlearn.edu');
        setFullName('Dr. Sarah Jenkins');
        setGradeOrDept('Advanced Mathematics');
      } else if (roleParam === 'PARENT') {
        setIdentifier('priya@smartlearn.edu');
        setFullName('Priya Sharma');
      } else if (roleParam === 'ADMIN') {
        setIdentifier('admin@smartlearn.edu');
        setFullName('Marcus Vance');
      }
    }
    const modeParam = searchParams?.get('mode');
    if (modeParam === 'signup' || modeParam === 'signin') {
      setMode(modeParam);
    }
  }, [searchParams]);

  // Handle direct 1-click Quick Launch into any portal
  const handleQuickPortalLaunch = (role: Role) => {
    switchDemoRole(role);
    triggerConfetti();
    const portalPaths: Record<Role, string> = {
      STUDENT: '/student/',
      TEACHER: '/teacher/',
      PARENT: '/parent/',
      ADMIN: '/admin/',
    };
    router.push(portalPaths[role]);
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!identifier.trim()) {
      setErrorMsg('Please enter your email address or phone number.');
      return;
    }

    const code = generateOTP(identifier);
    setGeneratedOtp(code);
    setOtpDigits(['', '', '', '', '', '']);
    setResendSeconds(60);

    if (authMethod === 'email' && identifier.includes('@')) {
      setIsSendingEmail(true);
      const res = await sendOtpEmail(identifier.trim(), code, mode === 'signup' ? fullName : undefined);
      setIsSendingEmail(false);

      if (res.success) {
        setEmailDelivery({
          status: 'sent',
          message: `Verification code dispatched to ${identifier} via EmailJS.`,
        });
      } else if (res.unconfigured) {
        setEmailDelivery({
          status: 'unconfigured',
          message: 'Instant OTP verification active.',
        });
      } else {
        setEmailDelivery({
          status: 'error',
          message: res.error || 'EmailJS delivery failed.',
        });
      }
    } else {
      setEmailDelivery({
        status: 'unconfigured',
        message: 'Simulated SMS OTP mode triggered.',
      });
    }

    setOtpStep(true);
  };

  const handleResendOtp = async () => {
    const newCode = generateOTP(identifier);
    setGeneratedOtp(newCode);
    setResendSeconds(60);
    setErrorMsg('');

    if (authMethod === 'email' && identifier.includes('@')) {
      setIsSendingEmail(true);
      const res = await sendOtpEmail(identifier.trim(), newCode, mode === 'signup' ? fullName : undefined);
      setIsSendingEmail(false);

      if (res.success) {
        setEmailDelivery({
          status: 'sent',
          message: `A new OTP has been delivered to ${identifier} via EmailJS.`,
        });
      } else if (res.unconfigured) {
        setEmailDelivery({
          status: 'unconfigured',
          message: 'Instant OTP verification active.',
        });
      } else {
        setEmailDelivery({
          status: 'error',
          message: res.error || 'EmailJS delivery failed.',
        });
      }
    }
  };

  const handleAutoFillOtp = () => {
    if (!generatedOtp) return;
    const digits = generatedOtp.split('').slice(0, 6);
    setOtpDigits(digits);
    setErrorMsg('');
  };

  const handleOtpDigitChange = (index: number, val: string) => {
    const clean = val.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = clean;
    setOtpDigits(newDigits);

    // Auto advance to next box
    if (clean && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const fullOtp = otpDigits.join('');

    if (fullOtp.length < 6) {
      setErrorMsg('Please enter the full 6-digit OTP code.');
      return;
    }

    const isValid = verifyOTP(identifier, fullOtp);

    if (isValid) {
      triggerConfetti();
      setSuccessMsg('Verification successful! Initializing portal workspace...');

      // Construct verified User session safely from base user
      const baseUser =
        selectedRole === 'STUDENT'
          ? INITIAL_USERS[0]
          : selectedRole === 'TEACHER'
          ? INITIAL_USERS[1]
          : selectedRole === 'PARENT'
          ? INITIAL_USERS[2]
          : INITIAL_USERS[3];

      const verifiedUser: User = {
        ...baseUser,
        id: `user-${selectedRole.toLowerCase()}-${Date.now()}`,
        name: mode === 'signup' && fullName ? fullName : baseUser.name,
        email: identifier.includes('@') ? identifier : baseUser.email,
        phone: !identifier.includes('@') ? identifier : baseUser.phone,
        role: selectedRole,
        studentProfile:
          selectedRole === 'STUDENT' && baseUser.studentProfile
            ? {
                ...baseUser.studentProfile,
                grade: gradeOrDept || baseUser.studentProfile.grade,
              }
            : baseUser.studentProfile,
        teacherProfile:
          selectedRole === 'TEACHER' && baseUser.teacherProfile
            ? {
                ...baseUser.teacherProfile,
                department: gradeOrDept || baseUser.teacherProfile.department,
              }
            : baseUser.teacherProfile,
      };

      loginUser(verifiedUser);

      // Directly open the respected dashboard page
      const roleDashboards: Record<Role, string> = {
        STUDENT: '/student',
        TEACHER: '/teacher',
        PARENT: '/parent',
        ADMIN: '/admin',
      };
      setTimeout(() => {
        router.push(roleDashboards[selectedRole]);
      }, 800);
    } else {
      setErrorMsg(`Invalid verification code. Please check your SMS code or click Auto-fill (${generatedOtp || '123456'}).`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#121519] text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-8 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        {/* Top Header with SmartLearn Branding */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group mb-2">
            <span className="font-extrabold text-3xl sm:text-4xl tracking-tight text-slate-900 dark:text-white">
              Smart<span className="text-[#d82a4e]">Learn</span>
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-sm bg-[#d82a4e]/15 text-[#d82a4e] font-extrabold uppercase tracking-wider">
              Education
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {otpStep
              ? 'Verify OTP Code'
              : mode === 'signin'
              ? 'Sign in to Your Educational Portal'
              : 'Create Your SmartLearn Account'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Choose your portal role below, or verify with our SMS/Email OTP verification system to unlock personalized learning.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 1. FOUR PORTALS QUICK LAUNCH GRID (Always Accessible for Frictionless Demo) */}
        {/* ========================================================================= */}
        {!otpStep && (
          <div className="bg-white dark:bg-[#1a1e24] p-6 rounded-sm border border-slate-200 dark:border-[#283038] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                ⚡ 1-Click Instant Portals (No Password Needed)
              </span>
              <span className="text-[11px] text-[#d82a4e] font-bold">
                Direct Role Access
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Student Portal */}
              <button
                type="button"
                onClick={() => handleQuickPortalLaunch('STUDENT')}
                className="p-3.5 rounded-sm border border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20 hover:border-blue-500 hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 mb-1.5">
                    <GraduationCap className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 px-1.5 py-0.5 rounded-sm">Student</span>
                  </div>
                  <div className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    Alex Rivera
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    Adaptive mock tests, AI formula tutor &amp; gamified XP.
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-blue-500/20 text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center justify-between">
                  <span>Enter Portal</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Teacher Portal */}
              <button
                type="button"
                onClick={() => handleQuickPortalLaunch('TEACHER')}
                className="p-3.5 rounded-sm border border-[#d82a4e]/30 bg-[#d82a4e]/5 dark:bg-[#d82a4e]/10 hover:border-[#d82a4e] hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-[#d82a4e] mb-1.5">
                    <Users className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#d82a4e]/10 px-1.5 py-0.5 rounded-sm">Teacher</span>
                  </div>
                  <div className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-[#d82a4e] transition-colors">
                    Dr. Sarah Jenkins
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    AI exam question generator &amp; class mistake diagnostics.
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-[#d82a4e]/20 text-[11px] font-bold text-[#d82a4e] flex items-center justify-between">
                  <span>Enter Portal</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Parent Portal */}
              <button
                type="button"
                onClick={() => handleQuickPortalLaunch('PARENT')}
                className="p-3.5 rounded-sm border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 hover:border-emerald-500 hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-1.5">
                    <HeartHandshake className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 px-1.5 py-0.5 rounded-sm">Parent</span>
                  </div>
                  <div className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                    Priya Sharma
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    Multi-child switcher, progress ring &amp; voice read-aloud digest.
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-emerald-500/20 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                  <span>Enter Portal</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Admin Portal */}
              <button
                type="button"
                onClick={() => handleQuickPortalLaunch('ADMIN')}
                className="p-3.5 rounded-sm border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 hover:border-amber-500 hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-1.5">
                    <Shield className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 px-1.5 py-0.5 rounded-sm">Admin</span>
                  </div>
                  <div className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                    Marcus Vance
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    Platform telemetry, user directory &amp; content moderation.
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-amber-500/20 text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center justify-between">
                  <span>Enter Portal</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. AUTHENTICATION & DEMO OTP VERIFICATION CONTAINER                       */}
        {/* ========================================================================= */}
        <div className="bg-white dark:bg-[#1a1e24] rounded-sm border border-slate-200 dark:border-[#283038] shadow-lg p-6 sm:p-10 max-w-2xl mx-auto w-full">
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-sm bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-3.5 rounded-sm bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {!otpStep ? (
            <>
              {/* Preselected Role Confirmation Banner */}
              <div className="mb-6 p-4 rounded-sm border bg-slate-50 dark:bg-[#121519] border-slate-200 dark:border-[#283038] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-sm ${
                      selectedRole === 'STUDENT'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : selectedRole === 'TEACHER'
                        ? 'bg-[#d82a4e]/10 text-[#d82a4e]'
                        : selectedRole === 'PARENT'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {selectedRole === 'STUDENT' && <GraduationCap className="w-5 h-5" />}
                    {selectedRole === 'TEACHER' && <Users className="w-5 h-5" />}
                    {selectedRole === 'PARENT' && <HeartHandshake className="w-5 h-5" />}
                    {selectedRole === 'ADMIN' && <Shield className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                      <span>Target Role:</span>
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-extrabold text-slate-700 dark:text-slate-300">
                        {selectedRole === 'ADMIN'
                          ? 'Administrator'
                          : selectedRole.charAt(0) + selectedRole.slice(1).toLowerCase()}
                      </span>
                    </div>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {mode === 'signup' ? 'New Account Registration' : 'Secure Portal Sign In'}
                    </div>
                  </div>
                </div>
                <Link
                  href="/get-started"
                  className="text-xs font-bold text-[#d82a4e] hover:underline inline-flex items-center gap-1 self-start sm:self-center"
                >
                  <span>Change Role</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Sign In vs Sign Up Tabs */}
              <div className="flex border-b border-slate-200 dark:border-[#283038] mb-6">
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setErrorMsg(''); }}
                  className={`flex-1 pb-3 text-sm font-extrabold text-center border-b-2 transition-colors cursor-pointer ${
                    mode === 'signin'
                      ? 'border-[#d82a4e] text-[#d82a4e]'
                      : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  Sign In (Existing Account)
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setErrorMsg(''); }}
                  className={`flex-1 pb-3 text-sm font-extrabold text-center border-b-2 transition-colors cursor-pointer ${
                    mode === 'signup'
                      ? 'border-[#d82a4e] text-[#d82a4e]'
                      : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  Create Account (New User)
                </button>
              </div>

              {/* Email vs Phone Toggle */}
              <div className="flex items-center justify-center gap-6 mb-6 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('email');
                    setIdentifier(selectedRole === 'STUDENT' ? 'student@smartlearn.edu' : 'sarah@smartlearn.edu');
                  }}
                  className={`flex items-center gap-1.5 pb-1 border-b-2 transition-all cursor-pointer ${
                    authMethod === 'email' ? 'border-[#d82a4e] text-[#d82a4e] font-bold' : 'border-transparent text-slate-400'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Verification</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('phone');
                    setIdentifier('+1 (555) 345-7890');
                  }}
                  className={`flex items-center gap-1.5 pb-1 border-b-2 transition-all cursor-pointer ${
                    authMethod === 'phone' ? 'border-[#d82a4e] text-[#d82a4e] font-bold' : 'border-transparent text-slate-400'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Mobile Phone (SMS OTP)</span>
                </button>
              </div>

              {/* Form Input Fields */}
              <form onSubmit={handleRequestOTP} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alex Rivera or Sarah Jenkins"
                      className="w-full px-4 py-2.5 rounded-sm text-xs bg-slate-50 dark:bg-[#20252b] border border-slate-200 dark:border-[#283038] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d82a4e]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {authMethod === 'email' ? 'Email Address' : 'Mobile Phone Number'}
                  </label>
                  <input
                    type={authMethod === 'email' ? 'email' : 'tel'}
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={authMethod === 'email' ? 'yourname@institution.edu' : '+1 (555) 000-0000'}
                    className="w-full px-4 py-2.5 rounded-sm text-xs bg-slate-50 dark:bg-[#20252b] border border-slate-200 dark:border-[#283038] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d82a4e]"
                  />
                </div>

                {/* Role Picker for Targeted Dashboard Access */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Assign Portal Role
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(
                      [
                        { role: 'STUDENT', label: 'Student', icon: <GraduationCap className="w-3.5 h-3.5" /> },
                        { role: 'TEACHER', label: 'Teacher', icon: <Users className="w-3.5 h-3.5" /> },
                        { role: 'PARENT', label: 'Parent', icon: <HeartHandshake className="w-3.5 h-3.5" /> },
                        { role: 'ADMIN', label: 'Admin', icon: <Shield className="w-3.5 h-3.5" /> },
                      ] as const
                    ).map((item) => (
                      <button
                        key={item.role}
                        type="button"
                        onClick={() => setSelectedRole(item.role)}
                        className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-sm border text-xs font-bold transition-all cursor-pointer ${
                          selectedRole === item.role
                            ? 'bg-[#d82a4e] text-white border-[#d82a4e] shadow-xs'
                            : 'bg-slate-50 dark:bg-[#20252b] border-slate-200 dark:border-[#283038] text-slate-600 dark:text-slate-400 hover:border-slate-400'
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {selectedRole === 'STUDENT'
                        ? 'Current Grade / Class'
                        : selectedRole === 'TEACHER'
                        ? 'Department / Subject'
                        : selectedRole === 'PARENT'
                        ? 'Child Name / ID'
                        : 'Administrative Office'}
                    </label>
                    <input
                      type="text"
                      value={gradeOrDept}
                      onChange={(e) => setGradeOrDept(e.target.value)}
                      placeholder={selectedRole === 'STUDENT' ? 'Grade 10-A' : 'Mathematics & Science'}
                      className="w-full px-4 py-2.5 rounded-sm text-xs bg-slate-50 dark:bg-[#20252b] border border-slate-200 dark:border-[#283038] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d82a4e]"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSendingEmail}
                  className="w-full mt-3 py-3 px-6 rounded-sm btn-crimson text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSendingEmail ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending OTP via EmailJS...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Send OTP Verification</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* ========================================================================= */
            /* 3. STEP 2: DEMO OTP PIN VERIFICATION SYSTEM                               */
            /* ========================================================================= */
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#283038]">
                <button
                  type="button"
                  onClick={() => { setOtpStep(false); setErrorMsg(''); }}
                  className="text-xs text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Email/Phone</span>
                </button>
                <span className="text-xs font-bold text-[#d82a4e]">
                  Role: {selectedRole}
                </span>
              </div>

              {/* Delivery Feedback Banner */}
              {emailDelivery.status === 'sent' ? (
                <div className="p-4 rounded-sm bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <Check className="w-4 h-4" />
                      <span>OTP Sent to Inbox via EmailJS!</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                      Real Email Delivery
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    A verification code has been dispatched to <strong>{identifier}</strong>. Please check your inbox and spam folder.
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-emerald-500/20">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Instant Access Code: <strong className="font-mono text-slate-800 dark:text-slate-200">{generatedOtp || '123456'}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={handleAutoFillOtp}
                      className="px-2.5 py-1 rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Auto-Fill Code</span>
                    </button>
                  </div>
                </div>
              ) : emailDelivery.status === 'error' ? (
                <div className="p-4 rounded-sm bg-rose-500/10 border border-rose-500/30 text-rose-900 dark:text-rose-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400">
                      <AlertCircle className="w-4 h-4" />
                      <span>EmailJS Delivery Alert</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsConfigModalOpen(true)}
                      className="text-[11px] font-bold text-[#d82a4e] hover:underline cursor-pointer"
                    >
                      Check Credentials
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {emailDelivery.message}
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-rose-500/20">
                    <span className="font-mono text-base font-extrabold tracking-wider bg-white dark:bg-[#13171b] px-3 py-1 rounded-sm border border-rose-500/40 text-[#d82a4e]">
                      {generatedOtp || '123456'}
                    </span>
                    <button
                      type="button"
                      onClick={handleAutoFillOtp}
                      className="px-3 py-1 rounded-sm bg-[#d82a4e] hover:bg-[#c32646] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Use Backup OTP ({generatedOtp || '123456'})</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-sm bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                      <Zap className="w-4 h-4" />
                      <span>Simulated Gateway Triggered:</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsConfigModalOpen(true)}
                      className="text-[11px] font-bold text-[#d82a4e] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Settings className="w-3 h-3" />
                      <span>Connect EmailJS</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Verification code generated for <strong>{identifier}</strong>:
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <span className="font-mono text-base font-extrabold tracking-wider bg-white dark:bg-[#13171b] px-3 py-1 rounded-sm border border-amber-500/40 text-[#d82a4e]">
                      {generatedOtp || '123456'}
                    </span>
                    <button
                      type="button"
                      onClick={handleAutoFillOtp}
                      className="px-3 py-1 rounded-sm bg-[#d82a4e] hover:bg-[#c32646] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Click to Auto-Fill OTP</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 6-Digit Individual PIN Boxes */}
              <div className="space-y-2">
                <label className="block text-center text-xs font-bold text-slate-700 dark:text-slate-300">
                  Enter 6-Digit OTP Verification Code
                </label>
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-input-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      autoFocus={index === 0}
                      className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold font-mono rounded-sm bg-slate-50 dark:bg-[#20252b] border border-slate-200 dark:border-[#283038] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d82a4e]"
                    />
                  ))}
                </div>
              </div>

              {/* Resend OTP & Verification Submit Button */}
              <div className="space-y-3">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-sm btn-crimson text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify OTP &amp; Complete Login</span>
                </button>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>
                    {resendSeconds > 0 ? (
                      `Resend available in ${resendSeconds}s`
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isSendingEmail}
                        className="text-[#d82a4e] hover:underline font-semibold cursor-pointer disabled:opacity-50"
                      >
                        {isSendingEmail ? 'Sending...' : 'Resend OTP'}
                      </button>
                    )}
                  </span>
                  <span className="text-[11px] italic">
                    Universal test code: <strong>123456</strong>
                  </span>
                </div>
              </div>
            </form>
          )}

          {/* Bottom Switch between Sign In and Sign Up */}
          {!otpStep && (
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-[#283038] text-center text-xs text-slate-500">
              {mode === 'signin' ? (
                <p>
                  Don&apos;t have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setErrorMsg(''); }}
                    className="text-[#d82a4e] font-bold hover:underline cursor-pointer"
                  >
                    Create Account with OTP Verification
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('signin'); setErrorMsg(''); }}
                    className="text-[#d82a4e] font-bold hover:underline cursor-pointer"
                  >
                    Sign In with Existing Account
                  </button>
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <EmailJsConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onSaved={() => {
          const config = getEmailJsConfig();
          setIsEmailJsConfigured(Boolean(config.serviceId && config.templateId && config.publicKey));
        }}
      />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1a1e24] flex items-center justify-center text-white">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-[#d82a4e] animate-spin" />
            <p className="text-sm text-gray-400 font-medium">Preparing sign-in...</p>
          </div>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
