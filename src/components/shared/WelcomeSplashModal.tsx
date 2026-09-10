'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Quote,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  GraduationCap,
  Users,
  HeartHandshake,
  Shield,
  X,
  BookOpen,
  CheckCircle2,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { useStore } from '@/store/useStore';

const INSPIRATIONAL_QUOTES = [
  {
    quote: 'Education is the most powerful weapon which you can use to change the world.',
    author: 'Nelson Mandela',
    role: 'Global Leader & Nobel Laureate',
    tag: 'Empowerment',
  },
  {
    quote: 'The beautiful thing about learning is that no one can take it away from you.',
    author: 'B.B. King',
    role: 'Legendary Musician',
    tag: 'Lifelong Learning',
  },
  {
    quote: 'Education is not the learning of facts, but the training of the mind to think.',
    author: 'Albert Einstein',
    role: 'Theoretical Physicist',
    tag: 'Critical Thinking',
  },
  {
    quote: 'Smart learning adapts to every mind, uniting students, teachers, and parents with the shared power of AI.',
    author: 'SmartLearn Vision',
    role: 'AI Education Ecosystem',
    tag: 'Future of Learning',
  },
  {
    quote: 'Tell me and I forget. Teach me and I remember. Involve me and I learn.',
    author: 'Benjamin Franklin',
    role: 'Polymath & Statesman',
    tag: 'Adaptive Pedagogy',
  },
];

export function WelcomeSplashModal() {
  const router = useRouter();
  const welcomeSplashOpen = useStore((state) => state.welcomeSplashOpen);
  const setWelcomeSplashOpen = useStore((state) => state.setWelcomeSplashOpen);
  const triggerConfetti = useStore((state) => state.triggerConfetti);

  const setLoginWelcomeSeen = useStore((state) => state.setLoginWelcomeSeen);

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Auto cycle quotes every 6 seconds
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % INSPIRATIONAL_QUOTES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted || !welcomeSplashOpen) return null;

  const currentQuote = INSPIRATIONAL_QUOTES[currentQuoteIndex];

  const handleNextQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentQuoteIndex((prev) => (prev + 1) % INSPIRATIONAL_QUOTES.length);
  };

  const handlePrevQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentQuoteIndex((prev) => (prev - 1 + INSPIRATIONAL_QUOTES.length) % INSPIRATIONAL_QUOTES.length);
  };

  const handleGoToLogin = (signup = false) => {
    setLoginWelcomeSeen();
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('sl_login_welcome_shown', 'true');
    }
    setWelcomeSplashOpen(false);
    triggerConfetti();
    if (signup) {
      router.push('/login?mode=signup');
    } else {
      router.push('/login');
    }
  };

  const handleDismiss = () => {
    setLoginWelcomeSeen();
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('sl_login_welcome_shown', 'true');
    }
    setWelcomeSplashOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      {/* Container */}
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-[#1a1e24] text-white border border-[#283038] shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Crimson Brand Banner & Close */}
        <div className="relative bg-gradient-to-r from-[#d82a4e] via-[#a81c39] to-[#1a1e24] p-6 sm:p-8 flex items-center justify-between border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-3xl sm:text-4xl tracking-tight text-white">
                Smart<span className="text-white drop-shadow-md">Learn</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm border border-white/30">
                AI Ecosystem
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/90 font-medium tracking-wide">
              Learn Smarter. Grow Faster. • Smart Education for Students, Teachers &amp; Parents
            </p>
          </div>

          <button
            onClick={handleDismiss}
            className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white transition-all cursor-pointer"
            title="Close welcome screen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Quote Showcase Card */}
          <div className="relative p-6 sm:p-7 rounded-xl bg-[#20252b] border border-[#283038] shadow-inner text-center space-y-4">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#d82a4e]/20 text-[#d82a4e]">
              <Quote className="w-5 h-5" />
            </div>

            <div className="min-h-[90px] flex flex-col items-center justify-center space-y-2">
              <p className="text-base sm:text-lg font-serif italic text-slate-100 leading-relaxed max-w-xl transition-all duration-300">
                &ldquo;{currentQuote.quote}&rdquo;
              </p>
              <div className="pt-2">
                <span className="font-bold text-sm text-[#d82a4e] tracking-wide">
                  — {currentQuote.author}
                </span>
                <span className="text-xs text-slate-400 block font-normal">
                  {currentQuote.role}
                </span>
              </div>
            </div>

            {/* Quote Carousel Navigation */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <button
                onClick={handlePrevQuote}
                className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous Quote</span>
              </button>

              {/* Dots Indicator */}
              <div className="flex items-center gap-1.5">
                {INSPIRATIONAL_QUOTES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuoteIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === currentQuoteIndex ? 'w-6 bg-[#d82a4e]' : 'w-1.5 bg-slate-600 hover:bg-slate-400'
                    }`}
                    aria-label={`Jump to quote ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNextQuote}
                className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
              >
                <span className="hidden sm:inline">Next Quote</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Four Core Portals Showcase Grid */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Select from our 4 Unified Portals:
              </span>
              <span className="text-[10px] text-[#d82a4e] font-bold">
                1 Shared AI Brain
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-lg bg-[#13171b] border border-[#283038] hover:border-blue-500/50 transition-all text-center space-y-1">
                <div className="w-7 h-7 rounded-md bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-white">Student Hub</div>
                <div className="text-[10px] text-slate-400 leading-tight">Adaptive Tests &amp; AI Derivations</div>
              </div>

              <div className="p-3 rounded-lg bg-[#13171b] border border-[#283038] hover:border-[#d82a4e]/50 transition-all text-center space-y-1">
                <div className="w-7 h-7 rounded-md bg-[#d82a4e]/20 text-[#d82a4e] mx-auto flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-white">Teacher Hub</div>
                <div className="text-[10px] text-slate-400 leading-tight">AI Exam Papers &amp; Analytics</div>
              </div>

              <div className="p-3 rounded-lg bg-[#13171b] border border-[#283038] hover:border-emerald-500/50 transition-all text-center space-y-1">
                <div className="w-7 h-7 rounded-md bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-white">Parent Hub</div>
                <div className="text-[10px] text-slate-400 leading-tight">Audio Digest &amp; Child Growth</div>
              </div>

              <div className="p-3 rounded-lg bg-[#13171b] border border-[#283038] hover:border-amber-500/50 transition-all text-center space-y-1">
                <div className="w-7 h-7 rounded-md bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-white">Admin Hub</div>
                <div className="text-[10px] text-slate-400 leading-tight">Live Telemetry &amp; Directory</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons Footer */}
        <div className="p-6 bg-[#13171b] border-t border-[#283038] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleDismiss}
            className="w-full sm:w-auto px-4 py-2.5 rounded-sm text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Explore Website as Guest
          </button>

          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2.5">
            <button
              onClick={() => handleGoToLogin(true)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-sm bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#d82a4e]" />
              <span>Create Account (OTP)</span>
            </button>

            <button
              onClick={() => handleGoToLogin(false)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-sm btn-crimson text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login &amp; Open Portals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
