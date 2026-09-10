'use client';

import React, { useState } from 'react';
import {
  Compass,
  Award,
  HeartHandshake,
  ExternalLink,
  Sparkles,
  Smile,
  GraduationCap,
  Briefcase,
  Share2,
  CheckCircle2,
  Clock,
  Check,
} from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function CareerWellnessPage() {
  const currentUser = useStore((state) => state.currentUser);
  const [selectedCareer, setSelectedCareer] = useState<'ai_eng' | 'aerospace' | 'biotech'>('ai_eng');
  const [copiedPortfolio, setCopiedPortfolio] = useState(false);

  const careerData = {
    ai_eng: {
      title: 'AI & Machine Learning Research Engineer',
      matchScore: 94,
      requiredSkills: [
        { skill: 'Multivariate Calculus & Linear Algebra', current: 90, target: 95 },
        { skill: 'Python, NumPy & PyTorch Data Structures', current: 88, target: 90 },
        { skill: 'Statistical Probability & Optimization', current: 72, target: 85 },
      ],
      suggestedScholarship: 'National STEM Excellence Tech Grant ($15,000)',
      recommendedStep: 'Focus 2 weekly study sessions on Combinatorics & Probability to close the 13% statistical gap.',
    },
    aerospace: {
      title: 'Aerospace Dynamics & Propulsion Specialist',
      matchScore: 86,
      requiredSkills: [
        { skill: 'Kinematics & Classical Mechanics', current: 85, target: 90 },
        { skill: 'Differential Equations & Fluid Dynamics', current: 80, target: 92 },
        { skill: 'Thermodynamics & Materials Science', current: 65, target: 80 },
      ],
      suggestedScholarship: 'Future Astronautics Young Scholar Fellowship ($20,000)',
      recommendedStep: 'Enroll in the Advanced Vector Mechanics elective to boost thermodynamics fundamentals.',
    },
    biotech: {
      title: 'Computational Biology & Genomics Specialist',
      matchScore: 82,
      requiredSkills: [
        { skill: 'Molecular Genetics & CRISPR Protocols', current: 76, target: 88 },
        { skill: 'Organic Reaction Mechanisms', current: 62, target: 85 },
        { skill: 'Algorithmic Sequence Alignment', current: 85, target: 90 },
      ],
      suggestedScholarship: 'Life Sciences Discovery Award ($12,000)',
      recommendedStep: 'Use AI Revision generator for Organic Chemistry reaction pathways.',
    },
  };

  const activePath = careerData[selectedCareer];

  const handleCopyPortfolio = () => {
    navigator.clipboard.writeText(`https://smartlearn.edu/portfolio/alex-rivera-2026`);
    setCopiedPortfolio(true);
    setTimeout(() => setCopiedPortfolio(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Career Guidance, Portfolio & Wellness
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Aptitude-based roadmap recommendations, skill-gap analysis, verifiable digital portfolio, and study-life harmony.
        </p>
      </div>

      {/* 1. CAREER PATH SELECTOR & SKILL GAP ANALYZER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              Aptitude-Driven Career Explorer
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">Skill-Gap Analyzer</h2>
          </div>

          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => setSelectedCareer('ai_eng')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                selectedCareer === 'ai_eng' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              AI Engineer (94%)
            </button>
            <button
              onClick={() => setSelectedCareer('aerospace')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                selectedCareer === 'aerospace' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Aerospace (86%)
            </button>
            <button
              onClick={() => setSelectedCareer('biotech')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                selectedCareer === 'biotech' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Biotech (82%)
            </button>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-sm text-blue-950 dark:text-blue-200">{activePath.title}</h3>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
              Recommended Next Step: {activePath.recommendedStep}
            </p>
          </div>
          <div className="text-center sm:text-right">
            <span className="text-3xl font-black text-blue-600 dark:text-blue-400">{activePath.matchScore}%</span>
            <span className="text-[10px] text-slate-400 block font-semibold">Aptitude Match</span>
          </div>
        </div>

        {/* Skill Progress Bars */}
        <div className="space-y-4 pt-2">
          {activePath.requiredSkills.map((sk) => (
            <div key={sk.skill} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-800 dark:text-slate-200">{sk.skill}</span>
                <span className="text-slate-500">
                  Current: <strong className="text-blue-600 dark:text-blue-400">{sk.current}%</strong> (Target: {sk.target}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                  style={{ width: `${sk.current}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Scholarship Match Pill */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500">Matched Scholarship Opportunity:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Award className="w-4 h-4" />
            {activePath.suggestedScholarship}
          </span>
        </div>
      </div>

      {/* 2. SHAREABLE DIGITAL PORTFOLIO CARD */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-blue-500/10 border border-purple-200 dark:border-purple-800/50 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
            <Share2 className="w-4 h-4" />
            Digital Verified Portfolio
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Alex Rivera&apos;s Verified Credential Showcase
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
            A public, verifiable link showcasing your Olympiad diagnostic test scores, 7-day streak certifications,
            completed Calculus and Python projects, and teacher recommendations.
          </p>
        </div>

        <button
          onClick={handleCopyPortfolio}
          className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 whitespace-nowrap"
        >
          {copiedPortfolio ? <Check className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
          {copiedPortfolio ? 'Link Copied!' : 'Copy Shareable Link'}
        </button>
      </div>
    </div>
  );
}
