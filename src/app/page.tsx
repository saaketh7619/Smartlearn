'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ArrowUpRight,
  Play,
  Star,
  GraduationCap,
  BookOpen,
  Globe,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Layout,
  BarChart2,
  Code,
  Laptop,
  ShieldAlert,
  Flame,
  Lightbulb,
  Award,
  Compass,
  Check,
  LogOut,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Role } from '@/types';

export default function LandingPage() {
  const router = useRouter();
  const currentUser = useStore((state) => state.currentUser);
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const logoutUser = useStore((state) => state.logoutUser);
  const switchDemoRole = useStore((state) => state.switchDemoRole);
  const setWelcomeSplashOpen = useStore((state) => state.setWelcomeSplashOpen);
  const triggerConfetti = useStore((state) => state.triggerConfetti);

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupSubmitted, setSignupSubmitted] = useState(false);
  const [activeCourseTab, setActiveCourseTab] = useState('All');
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  const [courseSearchCategory, setCourseSearchCategory] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPhone, setTeacherPhone] = useState('');
  const [teacherSubmitted, setTeacherSubmitted] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const courseCategories = [
    {
      title: 'IT Development',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      count: '120 Courses',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&h=300&fit=crop&q=80',
      isHighlight: false,
    },
    {
      title: 'Web Design',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      count: '70 Courses',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=300&fit=crop&q=80',
      isHighlight: true, // Shown highlighted in red in the video
    },
    {
      title: 'Illustration & Drawing',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      count: '55 Courses',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=300&fit=crop&q=80',
      isHighlight: false,
    },
    {
      title: 'Social Media',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      count: '40 Courses',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&h=300&fit=crop&q=80',
      isHighlight: false,
    },
    {
      title: 'Photoshop',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      count: '220 Courses',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&h=300&fit=crop&q=80',
      isHighlight: true, // Shown highlighted in red in the video
    },
    {
      title: 'Cryptocurrencies',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      count: '25 Courses',
      image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=500&h=300&fit=crop&q=80',
      isHighlight: false,
    },
  ];

  const featuredCoursesList = [
    {
      id: 'fc-1',
      title: 'Art & Crafts',
      tab: 'Design',
      price: '$15',
      students: '120 Students',
      instructor: 'William Parker',
      role: 'Developer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=350&fit=crop&q=80',
    },
    {
      id: 'fc-2',
      title: 'IT Development',
      tab: 'Web Development',
      price: '$15',
      students: '120 Students',
      instructor: 'William Parker',
      role: 'Developer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=350&fit=crop&q=80',
    },
    {
      id: 'fc-3',
      title: 'Graphic Design',
      tab: 'Design',
      price: '$15',
      students: '120 Students',
      instructor: 'William Parker',
      role: 'Developer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=500&h=350&fit=crop&q=80',
    },
    {
      id: 'fc-4',
      title: 'Financial Markets',
      tab: 'Finance',
      price: '$15',
      students: '120 Students',
      instructor: 'William Parker',
      role: 'Developer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=350&fit=crop&q=80',
    },
  ];

  const filteredCourses = activeCourseTab === 'All'
    ? featuredCoursesList
    : featuredCoursesList.filter((c) => c.tab.toLowerCase().includes(activeCourseTab.toLowerCase()));

  const handleHeroSignup = (e: React.FormEvent) => {
    e.preventDefault();
    triggerConfetti();
    setSignupSubmitted(true);
    setTimeout(() => {
      switchDemoRole('STUDENT');
      router.push('/student');
    }, 1200);
  };

  const handleSearchCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    switchDemoRole('STUDENT');
    router.push(`/student/courses?q=${encodeURIComponent(courseSearchTerm)}`);
  };

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerConfetti();
    setTeacherSubmitted(true);
    setTimeout(() => {
      switchDemoRole('TEACHER');
      router.push('/teacher');
    }, 1500);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerConfetti();
    setNewsletterSubscribed(true);
  };

  const handleLaunchDemo = (role: Role) => {
    switchDemoRole(role);
    triggerConfetti();
    const roleRoutes: Record<Role, string> = {
      STUDENT: '/student',
      TEACHER: '/teacher',
      PARENT: '/parent',
      ADMIN: '/admin',
    };
    router.push(roleRoutes[role]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#ffffff] dark:bg-[#121519] text-slate-900 dark:text-slate-100">

      {/* 0.1 AUTHENTICATED ACTIVE SESSION BANNER (Changes dynamically after login) */}
      {isLoggedIn && currentUser && (
        <div className="bg-[#1a1e24] text-white border-b border-[#283038] py-3.5 px-4 sm:px-8 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full border-2 border-[#d82a4e] object-cover shadow-xs"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base text-white">
                    Welcome back, {currentUser.name}!
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-sm bg-[#d82a4e] text-white uppercase tracking-wider">
                    {currentUser.role} Portal Active
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Demo OTP Verified
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  You are authenticated into WebUni SmartLearn. Your personal tools &amp; data are ready.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => handleLaunchDemo(currentUser.role)}
                className="btn-crimson px-5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>Go to My {currentUser.role} Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  logoutUser();
                  triggerConfetti();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-sm bg-white/10 hover:bg-[#d82a4e]/20 text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer"
                title="Logout and reset session"
              >
                <LogOut className="w-3.5 h-3.5 text-[#d82a4e]" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (WebUni Dark Slate Chalkboard with Pencils & Hand)        */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-webuni-hero text-white py-20 sm:py-28 md:py-36 px-4 sm:px-8 border-b border-[#283038]">
        {/* Soft dark vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/75 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6 z-10">
          {/* Centered Main Headline matching uploaded video */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.12]">
            Get The Best Free Online Courses
          </h1>

          {/* Centered Subtitle matching uploaded video text style */}
          <p className="text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl mx-auto font-normal leading-relaxed opacity-90 italic">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec malesuada lorem maximus mauris scelerisque, at rutrum nulla dictum. Ut ac ligula sapien. Suspendisse cursus faucibus finibus.
          </p>

          {/* Interactive Object Fields & Button Form (Adapts when logged in) */}
          <div className="pt-4 max-w-3xl mx-auto">
            {isLoggedIn && currentUser ? (
              <div className="bg-black/40 backdrop-blur-md p-6 rounded-sm border border-white/20 shadow-2xl max-w-2xl mx-auto space-y-4 text-center animate-in fade-in">
                <div className="space-y-1">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#d82a4e]">
                    Authenticated Session: {currentUser.name}
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white">
                    Continue to your {currentUser.role.toLowerCase()} workspace
                  </h3>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => handleLaunchDemo(currentUser.role)}
                    className="btn-crimson px-7 py-3 rounded-sm text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <span>Launch {currentUser.role} Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setWelcomeSplashOpen(true)}
                    className="px-4 py-3 rounded-sm bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>View Quotes &amp; Mission</span>
                  </button>
                </div>
              </div>
            ) : signupSubmitted ? (
              <div className="bg-emerald-600/90 backdrop-blur-md text-white p-4 rounded-sm shadow-2xl border border-emerald-400 animate-in fade-in">
                <p className="font-bold text-base">🎉 Welcome to WebUni! Launching student workspace...</p>
              </div>
            ) : (
              <form
                onSubmit={handleHeroSignup}
                className="bg-black/30 backdrop-blur-md p-2.5 sm:p-3 rounded-sm border border-white/20 shadow-2xl grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-2.5 items-center"
              >
                {/* Field 1: Name */}
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="Name"
                    className="w-full px-4 py-3 rounded-sm text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d82a4e] font-medium shadow-inner italic"
                  />
                </div>

                {/* Field 2: E-mail */}
                <div className="sm:col-span-5">
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="E-mail"
                    className="w-full px-4 py-3 rounded-sm text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d82a4e] font-medium shadow-inner italic"
                  />
                </div>

                {/* Action Button: Sign Up Now in WebUni Crimson */}
                <div className="sm:col-span-3">
                  <button
                    type="submit"
                    className="btn-crimson w-full py-3 px-4 rounded-sm text-sm font-bold tracking-wide uppercase shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Sign Up Now</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Quick Demo Persona Chips */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 text-xs">
            <span className="text-slate-300 font-medium">Or explore demo portals directly:</span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => handleLaunchDemo('STUDENT')}
                className="px-3.5 py-1.5 rounded-sm bg-white/10 hover:bg-[#d82a4e] text-white border border-white/20 transition-all font-semibold flex items-center gap-1.5"
              >
                <span>🎓 Student (Alex)</span>
              </button>
              <button
                onClick={() => handleLaunchDemo('TEACHER')}
                className="px-3.5 py-1.5 rounded-sm bg-white/10 hover:bg-[#d82a4e] text-white border border-white/20 transition-all font-semibold flex items-center gap-1.5"
              >
                <span>👩‍🏫 Teacher (Sarah)</span>
              </button>
              <button
                onClick={() => handleLaunchDemo('PARENT')}
                className="px-3.5 py-1.5 rounded-sm bg-white/10 hover:bg-[#d82a4e] text-white border border-white/20 transition-all font-semibold flex items-center gap-1.5"
              >
                <span>👨‍👩‍👧 Parent (Priya)</span>
              </button>
              <button
                onClick={() => handleLaunchDemo('ADMIN')}
                className="px-3.5 py-1.5 rounded-sm bg-white/10 hover:bg-[#d82a4e] text-white border border-white/20 transition-all font-semibold flex items-center gap-1.5"
              >
                <span>⚡ Admin (Marcus)</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. OUR COURSE CATEGORIES (3x2 Grid matching video 00:02 - 00:06)         */}
      {/* ========================================================================= */}
      <section id="categories-section" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Our Course Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed italic">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec malesuada lorem maximus mauris scelerisque, at rutrum nulla dictum. Ut ac ligula sapien. Suspendisse cursus faucibus finibus.
          </p>
        </div>

        {/* 6 Category Cards Grid (3 columns, 2 rows) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courseCategories.map((cat, idx) => {
            const isRedCard = cat.isHighlight;
            return (
              <div
                key={idx}
                onClick={() => {
                  switchDemoRole('STUDENT');
                  router.push('/student/courses');
                }}
                className="group cursor-pointer rounded-sm overflow-hidden border border-slate-200 dark:border-[#283038] shadow-sm hover:shadow-2xl transition-all duration-300"
              >
                {/* Card Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Card Content (Switches to crimson #d82a4e on highlight or hover, exactly like the video!) */}
                <div
                  className={`p-6 transition-colors duration-300 ${
                    isRedCard
                      ? 'bg-[#d82a4e] text-white'
                      : 'bg-white dark:bg-[#1a1e24] text-slate-800 dark:text-slate-100 group-hover:bg-[#d82a4e] group-hover:text-white'
                  }`}
                >
                  <h3 className="font-extrabold text-base mb-1">{cat.title}</h3>
                  <p
                    className={`text-xs mb-4 leading-relaxed line-clamp-2 ${
                      isRedCard ? 'text-white/85' : 'text-slate-500 dark:text-slate-400 group-hover:text-white/85'
                    }`}
                  >
                    {cat.desc}
                  </p>
                  <span
                    className={`text-xs font-bold ${
                      isRedCard ? 'text-white' : 'text-[#d82a4e] group-hover:text-white'
                    }`}
                  >
                    {cat.count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SEARCH YOUR COURSE CRIMSON BANNER (matching video 00:06 - 00:07)       */}
      {/* ========================================================================= */}
      <section className="bg-[#d82a4e] text-white py-14 px-4 sm:px-8 shadow-lg">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Search your course</h2>

          <form
            onSubmit={handleSearchCourseSubmit}
            className="grid grid-cols-1 sm:grid-cols-12 gap-3 max-w-4xl mx-auto"
          >
            <div className="sm:col-span-5">
              <input
                type="text"
                value={courseSearchTerm}
                onChange={(e) => setCourseSearchTerm(e.target.value)}
                placeholder="Course"
                className="w-full px-4 py-3 rounded-sm text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none font-medium shadow-inner italic"
              />
            </div>
            <div className="sm:col-span-4">
              <input
                type="text"
                value={courseSearchCategory}
                onChange={(e) => setCourseSearchCategory(e.target.value)}
                placeholder="Category"
                className="w-full px-4 py-3 rounded-sm text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none font-medium shadow-inner italic"
              />
            </div>
            <div className="sm:col-span-3">
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-sm bg-[#1a1e24] hover:bg-black text-white text-xs sm:text-sm font-bold tracking-wide uppercase shadow-md transition-all cursor-pointer"
              >
                Search Course
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FEATURED COURSES WITH TABS (matching video 00:07 - 00:11)              */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Featured Courses
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed italic">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec malesuada lorem maximus mauris scelerisque, at rutrum nulla dictum. Ut ac ligula sapien. Suspendisse cursus faucibus finibus.
          </p>

          {/* Filter Tabs matching video */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs sm:text-sm font-bold">
            {['All', 'Finance', 'Design', 'Web Development', 'Photography'].map((tab) => {
              const isSelected = activeCourseTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveCourseTab(tab)}
                  className={`pb-1 transition-all cursor-pointer ${
                    isSelected
                      ? 'text-[#d82a4e] border-b-2 border-[#d82a4e]'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4-Column Courses Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCourses.map((c) => (
            <div
              key={c.id}
              onClick={() => {
                switchDemoRole('STUDENT');
                router.push('/student/courses');
              }}
              className="bg-white dark:bg-[#1a1e24] rounded-sm overflow-hidden border border-slate-200 dark:border-[#283038] shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Course Image with Price Badge */}
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#d82a4e] text-white text-[11px] font-bold px-2.5 py-1 rounded-sm shadow-md">
                    Price: {c.price}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white mb-1 group-hover:text-[#d82a4e] transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                    {c.desc}
                  </p>
                  <p className="text-xs font-bold text-[#d82a4e] mb-4">{c.students}</p>

                  {/* Instructor Row */}
                  <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100 dark:border-[#283038]">
                    <img
                      src={c.avatar}
                      alt={c.instructor}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        {c.instructor}
                      </p>
                      <p className="text-[10px] text-slate-400">{c.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SIGN UP TO BECOME A TEACHER SPLIT (matching video 00:11 - 00:13)       */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-sm overflow-hidden shadow-2xl">
          {/* Left: Crimson Red Signup Box */}
          <div className="lg:col-span-5 bg-[#d82a4e] text-white p-8 sm:p-12 flex flex-col justify-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Sign up to become a teacher
            </h2>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed italic">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec malesuada lorem maximus mauris scelerisque, at rutrum nulla dictum. Ut ac ligula sapien. Suspendisse cursus faucibus finibus.
            </p>

            {teacherSubmitted ? (
              <div className="bg-white/20 p-4 rounded-sm">
                <p className="font-bold text-sm">🎉 Application submitted! Redirecting to Teacher Hub...</p>
              </div>
            ) : (
              <form onSubmit={handleTeacherSubmit} className="space-y-3 max-w-sm">
                <input
                  type="text"
                  required
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-sm text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none italic"
                />
                <input
                  type="email"
                  required
                  value={teacherEmail}
                  onChange={(e) => setTeacherEmail(e.target.value)}
                  placeholder="Your E-mail"
                  className="w-full px-4 py-3 rounded-sm text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none italic"
                />
                <input
                  type="tel"
                  required
                  value={teacherPhone}
                  onChange={(e) => setTeacherPhone(e.target.value)}
                  placeholder="Your Phone"
                  className="w-full px-4 py-3 rounded-sm text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none italic"
                />

                <div className="pt-1 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => triggerConfetti()}
                    className="w-fit px-4 py-2.5 rounded-sm bg-[#1a1e24] hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Upload Course
                  </button>

                  <button
                    type="submit"
                    className="w-fit px-6 py-3 rounded-sm bg-[#1a1e24] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right: Thoughtful Young Man with Headphones Looking at Laptop */}
          <div className="lg:col-span-7 relative min-h-[380px] lg:min-h-full">
            <img
              src="/images/teacher_signup.jpg"
              alt="Educator studying with headphones and laptop"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FOUR SMARTLEARN PORTALS (Unified Role Architecture)                    */}
      {/* ========================================================================= */}
      <section id="portals-section" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full border-t border-slate-200 dark:border-[#283038]">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d82a4e]/10 text-[#d82a4e] text-xs font-extrabold uppercase tracking-wider">
            <span>Unified Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Four Role Portals with One Intelligent Core
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed italic">
            Seamlessly integrating personalized student AI, automated teacher workflows, real-time parent clarity, and administrative governance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Student Hub Card */}
          <div className="p-6 rounded-sm bg-white dark:bg-[#1a1e24] border border-slate-200 dark:border-[#283038] hover:border-blue-500 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-blue-500/10 px-2 py-0.5 rounded-sm">
                Student Hub
              </span>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-2 mb-1.5">
                Adaptive Learning &amp; AI Tutor
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Live countdown mock tests, dynamic difficulty scaling, and instant AI math derivation solver.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleLaunchDemo('STUDENT')}
                className="w-full py-2.5 rounded-sm bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Launch Student Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <Link
                href="/login?role=STUDENT"
                className="block text-center text-[11px] font-semibold text-slate-500 hover:text-blue-600 transition-colors"
              >
                Sign in with OTP ➔
              </Link>
            </div>
          </div>

          {/* 2. Teacher Hub Card */}
          <div className="p-6 rounded-sm bg-white dark:bg-[#1a1e24] border border-slate-200 dark:border-[#283038] hover:border-[#d82a4e] shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-extrabold text-[#d82a4e] uppercase tracking-wider bg-[#d82a4e]/10 px-2 py-0.5 rounded-sm">
                Teacher Hub
              </span>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-2 mb-1.5">
                Workload Reduction &amp; AI Gen
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Automated exam question paper creator, class mistake classifier, and printable report cards.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleLaunchDemo('TEACHER')}
                className="w-full py-2.5 rounded-sm btn-crimson text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Launch Teacher Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <Link
                href="/login?role=TEACHER"
                className="block text-center text-[11px] font-semibold text-slate-500 hover:text-[#d82a4e] transition-colors"
              >
                Sign in with OTP ➔
              </Link>
            </div>
          </div>

          {/* 3. Parent Hub Card */}
          <div className="p-6 rounded-sm bg-white dark:bg-[#1a1e24] border border-slate-200 dark:border-[#283038] hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-sm">
                Parent Hub
              </span>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-2 mb-1.5">
                Reassurance &amp; Read Aloud
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Multi-child switcher, weekly progress ring, and Web Speech native voice digest reader.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleLaunchDemo('PARENT')}
                className="w-full py-2.5 rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Launch Parent Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <Link
                href="/login?role=PARENT"
                className="block text-center text-[11px] font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
              >
                Sign in with OTP ➔
              </Link>
            </div>
          </div>

          {/* 4. Admin Hub Card */}
          <div className="p-6 rounded-sm bg-white dark:bg-[#1a1e24] border border-slate-200 dark:border-[#283038] hover:border-amber-500 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded-sm">
                Admin Hub
              </span>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-2 mb-1.5">
                Nerve Center &amp; RBAC
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                System telemetry, user directory, content moderation, and anti-cheat strictness configs.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleLaunchDemo('ADMIN')}
                className="w-full py-2.5 rounded-sm bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Launch Admin Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <Link
                href="/login?role=ADMIN"
                className="block text-center text-[11px] font-semibold text-slate-500 hover:text-amber-600 transition-colors"
              >
                Sign in with OTP ➔
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. INSPIRATIONAL EDUCATIONAL QUOTES & PHILOSOPHY                          */}
      {/* ========================================================================= */}
      <section id="quotes-section" className="bg-slate-50 dark:bg-[#161a20] border-t border-b border-slate-200 dark:border-[#283038] py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d82a4e]/10 text-[#d82a4e] text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inspiring Minds • The WebUni Philosophy</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Words That Power Every Academic Breakthrough
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Guiding principles behind our AI-driven student learning, teacher automation, and family collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quote Card 1 */}
            <div className="p-6 rounded-sm bg-white dark:bg-[#1a1e24] border border-slate-200 dark:border-[#283038] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#d82a4e] transition-all">
              <p className="text-sm italic text-slate-700 dark:text-slate-200 leading-relaxed font-serif">
                &ldquo;Education is the most powerful weapon which you can use to change the world.&rdquo;
              </p>
              <div className="pt-3 border-t border-slate-100 dark:border-[#283038] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Nelson Mandela</h4>
                  <span className="text-[10px] text-slate-400">Global Leader &amp; Nobel Laureate</span>
                </div>
                <span className="text-[10px] font-bold text-[#d82a4e] uppercase bg-[#d82a4e]/10 px-2 py-0.5 rounded-sm">Empowerment</span>
              </div>
            </div>

            {/* Quote Card 2 */}
            <div className="p-6 rounded-sm bg-white dark:bg-[#1a1e24] border border-slate-200 dark:border-[#283038] shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-500 transition-all">
              <p className="text-sm italic text-slate-700 dark:text-slate-200 leading-relaxed font-serif">
                &ldquo;The beautiful thing about learning is that no one can take it away from you.&rdquo;
              </p>
              <div className="pt-3 border-t border-slate-100 dark:border-[#283038] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">B.B. King</h4>
                  <span className="text-[10px] text-slate-400">Legendary Musician</span>
                </div>
                <span className="text-[10px] font-bold text-blue-500 uppercase bg-blue-500/10 px-2 py-0.5 rounded-sm">Lifelong Growth</span>
              </div>
            </div>

            {/* Quote Card 3 */}
            <div className="p-6 rounded-sm bg-white dark:bg-[#1a1e24] border border-slate-200 dark:border-[#283038] shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-500 transition-all">
              <p className="text-sm italic text-slate-700 dark:text-slate-200 leading-relaxed font-serif">
                &ldquo;Smart learning adapts to every mind, uniting students, teachers, and parents with the shared power of AI.&rdquo;
              </p>
              <div className="pt-3 border-t border-slate-100 dark:border-[#283038] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">WebUni Vision</h4>
                  <span className="text-[10px] text-slate-400">AI Education Ecosystem</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 uppercase bg-emerald-500/10 px-2 py-0.5 rounded-sm">Future of EdTech</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. JOIN OUR COMMUNITY NOW BANNER (matching video 00:13 - 00:14)           */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-8 text-center max-w-4xl mx-auto w-full space-y-5">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Join Our Community Now!
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed italic">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec malesuada lorem maximus mauris scelerisque, at rutrum nulla dictum. Ut ac ligula sapien. Suspendisse cursus faucibus finibus.
        </p>
        <div className="pt-2">
          <Link
            href="/login?mode=signup"
            className="btn-crimson px-9 py-3.5 rounded-sm text-sm font-bold uppercase tracking-wide shadow-lg cursor-pointer inline-flex items-center gap-2"
          >
            <span>Register Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. MULTI-COLUMN FOOTER (matching video 00:14 & 00:31)                      */}
      {/* ========================================================================= */}
      <footer className="mt-auto border-t border-slate-200 dark:border-[#283038] bg-white dark:bg-[#13171b] pt-16 pb-10 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-100 dark:border-[#283038]">
          {/* Col 1: Contact Info */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Contact Info</h4>
            <p className="leading-relaxed">1481 Creekside Lane<br />Avila Beach, CA 931</p>
            <p>+53 345 7953 37453</p>
            <p>yourmail@gmail.com</p>
          </div>

          {/* Col 2: Engineering */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Engineering</h4>
            <ul className="space-y-1.5">
              <li><Link href="/student/courses" className="hover:text-[#d82a4e]">Applied Studies</Link></li>
              <li><Link href="/student/courses" className="hover:text-[#d82a4e]">Computer Engineering</Link></li>
              <li><Link href="/student/courses" className="hover:text-[#d82a4e]">Software Engineering</Link></li>
              <li><Link href="/student/courses" className="hover:text-[#d82a4e]">Informational Engineering</Link></li>
              <li><Link href="/student/courses" className="hover:text-[#d82a4e]">System Engineering</Link></li>
            </ul>
          </div>

          {/* Col 3: Graphic Design */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Graphic Design</h4>
            <ul className="space-y-1.5">
              <li><Link href="/student/courses" className="hover:text-[#d82a4e]">Applied Studies</Link></li>
              <li><Link href="/student/courses" className="hover:text-[#d82a4e]">Computer Engineering</Link></li>
              <li><Link href="/student/courses" className="hover:text-[#d82a4e]">Software Engineering</Link></li>
              <li><Link href="/student/courses" className="hover:text-[#d82a4e]">Informational Engineering</Link></li>
              <li><Link href="/student/courses" className="hover:text-[#d82a4e]">System Engineering</Link></li>
            </ul>
          </div>

          {/* Col 4: Development */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Development</h4>
            <ul className="space-y-1.5">
              <li><Link href="/student/courses" className="hover:text-[#d82a4e]">Applied Studies</Link></li>
              <li><Link href="/student/courses" className="hover:text-[#d82a4e]">Computer Engineering</Link></li>
              <li><Link href="/student/courses" className="hover:text-[#d82a4e]">Software Engineering</Link></li>
              <li><Link href="/student/courses" className="hover:text-[#d82a4e]">Informational Engineering</Link></li>
              <li><Link href="/student/courses" className="hover:text-[#d82a4e]">System Engineering</Link></li>
            </ul>
          </div>

          {/* Col 5: Newsletter */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Newsletter</h4>
            {newsletterSubscribed ? (
              <p className="text-emerald-600 font-bold">✓ Subscribed successfully!</p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="E-mail"
                  className="w-full px-3.5 py-2 rounded-sm text-xs text-slate-900 bg-slate-100 dark:bg-[#20252b] dark:text-white placeholder-slate-400 focus:outline-none italic border border-slate-200 dark:border-[#283038]"
                />
                <button
                  type="submit"
                  className="w-full py-2 px-4 rounded-sm btn-crimson text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Subscribe
                </button>
                <p className="text-[10px] text-slate-400 italic">*We don't spam</p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>Copyright ©2026 All rights reserved | This template is made with ❤️ by Colorlib &amp; SmartLearn</p>
          <div className="flex items-center gap-5 font-semibold text-slate-600 dark:text-slate-400">
            <Link href="/" className="hover:text-[#d82a4e]">Terms &amp; Conditions</Link>
            <Link href="/" className="hover:text-[#d82a4e]">Register</Link>
            <Link href="/" className="hover:text-[#d82a4e]">Privacy</Link>
          </div>
        </div>
      </footer>

      {/* 1-Click Demo Modal (Triggered by "View Demo ▶") */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Choose a Demo Role to Experience</h3>
              <button
                onClick={() => setDemoModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleLaunchDemo('STUDENT')}
                className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100 text-left transition-all"
              >
                <span className="text-2xl mb-1 block">🎓</span>
                <span className="text-xs font-bold text-blue-900 block">Demo Student</span>
                <span className="text-[10px] text-blue-600">Alex Rivera (Grade 10)</span>
              </button>

              <button
                onClick={() => handleLaunchDemo('TEACHER')}
                className="p-4 rounded-2xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100 text-left transition-all"
              >
                <span className="text-2xl mb-1 block">👩‍🏫</span>
                <span className="text-xs font-bold text-purple-900 block">Demo Teacher</span>
                <span className="text-[10px] text-purple-600">Dr. Sarah Jenkins</span>
              </button>

              <button
                onClick={() => handleLaunchDemo('PARENT')}
                className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100 text-left transition-all"
              >
                <span className="text-2xl mb-1 block">👨‍👩‍👧</span>
                <span className="text-xs font-bold text-emerald-900 block">Demo Parent</span>
                <span className="text-[10px] text-emerald-600">Priya Sharma</span>
              </button>

              <button
                onClick={() => handleLaunchDemo('ADMIN')}
                className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100 text-left transition-all"
              >
                <span className="text-2xl mb-1 block">⚡</span>
                <span className="text-xs font-bold text-amber-900 block">Demo Admin</span>
                <span className="text-[10px] text-amber-600">Marcus Vance</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
