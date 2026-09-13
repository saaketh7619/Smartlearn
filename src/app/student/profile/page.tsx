'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap, BookOpen, Target, Edit3, AlertTriangle, Check, Flame,
  Star, Coins, Zap, Clock, Bookmark, Eye, ChevronRight, ArrowRight,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { AcademicProfileBadge } from '@/components/shared/AcademicProfileBadge';

const GOAL_LABELS: Record<string, string> = {
  exam_prep: '📝 Exam Preparation',
  concept_learning: '💡 Concept Learning',
  practice: '🎯 Practice & Drill',
  revision: '🔄 Revision',
  competitive_exams: '🏆 Competitive Exams',
};

export default function StudentProfilePage() {
  const { currentUser, academicProfile, recentlyViewed, bookmarkedResourceIds } = useStore();

  if (!currentUser) return null;
  const sp = currentUser.studentProfile;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Profile
          </h1>
          <p className="text-xs text-slate-500 mt-1">Your academic identity and learning progress</p>
        </div>
        <Link
          href="/student/onboarding/"
          prefetch={true}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-950/60 transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
          Edit Academic Profile
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Identity Card */}
        <div className="lg:col-span-1 space-y-4">
          {/* User Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/20">
            <div className="flex items-center gap-4 mb-6">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'}
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl border-3 border-white/30 object-cover shadow-lg"
              />
              <div>
                <div className="font-extrabold text-lg leading-tight">{currentUser.name}</div>
                <div className="text-blue-200 text-xs font-medium">{currentUser.email}</div>
                <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/20 text-white text-[10px] font-bold">
                  <Star className="w-3 h-3" /> Student
                </div>
              </div>
            </div>

            {/* XP & Level */}
            {sp && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-200">Level {sp.level}</span>
                  <span className="text-blue-200">{sp.xp} XP</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${Math.min(((sp.xp % 200) / 200) * 100, 100)}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="text-center p-2 rounded-xl bg-white/10">
                    <div className="text-base font-extrabold">{sp.streakDays}</div>
                    <div className="text-[10px] text-blue-200 flex items-center justify-center gap-0.5"><Flame className="w-2.5 h-2.5" />Days</div>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-white/10">
                    <div className="text-base font-extrabold">{sp.coins}</div>
                    <div className="text-[10px] text-blue-200 flex items-center justify-center gap-0.5"><Coins className="w-2.5 h-2.5" />Coins</div>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-white/10">
                    <div className="text-base font-extrabold">{sp.badges.length}</div>
                    <div className="text-[10px] text-blue-200 flex items-center justify-center gap-0.5"><Star className="w-2.5 h-2.5" />Badges</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick stats */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Learning Stats</h3>
            {[
              { icon: <Eye className="w-3.5 h-3.5 text-blue-500" />, label: 'Resources Viewed', val: recentlyViewed.length },
              { icon: <Bookmark className="w-3.5 h-3.5 text-amber-500" />, label: 'Bookmarks', val: bookmarkedResourceIds.length },
              { icon: <Zap className="w-3.5 h-3.5 text-green-500" />, label: 'XP Earned', val: sp?.xp ?? 0 },
            ].map(({ icon, label, val }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  {icon}{label}
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Academic Profile + Recent */}
        <div className="lg:col-span-2 space-y-5">
          {/* Academic Profile */}
          {academicProfile ? (
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-500" />
                  Academic Profile
                </h3>
                <Link href="/student/onboarding/" prefetch={true} className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                  Update <Edit3 className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Level', value: academicProfile.educationalLevel },
                  { label: 'Stream', value: academicProfile.stream },
                  { label: 'Class', value: academicProfile.classLevel },
                  { label: 'Board', value: academicProfile.board },
                  { label: 'Subjects', value: `${academicProfile.subjects.length} enrolled` },
                  { label: 'Goals', value: `${academicProfile.learningGoals.length} selected` },
                ].map(({ label, value }) => (
                  <div key={label} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">{value}</div>
                  </div>
                ))}
              </div>

              {/* Subjects list */}
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Enrolled Subjects</div>
                <div className="flex flex-wrap gap-2">
                  {academicProfile.subjects.map((sub) => (
                    <span key={sub} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Goals */}
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Learning Goals</div>
                <div className="flex flex-wrap gap-2">
                  {academicProfile.learningGoals.map((goal) => (
                    <span key={goal} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                      {GOAL_LABELS[goal] ?? goal}
                    </span>
                  ))}
                </div>
              </div>

              {/* Go to courses CTA */}
              <Link
                href="/student/courses/"
                prefetch={true}
                className="flex items-center justify-between p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 text-xs font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors"
              >
                <span>View your personalised {academicProfile.classLevel} curriculum</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            /* No profile yet */
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-4">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Academic Profile Not Set</h3>
                <p className="text-xs text-slate-500 mt-1">Complete your profile to see personalised courses and resources.</p>
              </div>
              <Link
                href="/student/onboarding/"
                prefetch={true}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Set Up My Profile
              </Link>
            </div>
          )}

          {/* Recently Viewed */}
          {recentlyViewed.length > 0 && (
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Recently Viewed
                </h3>
                <Link href="/student/courses/" prefetch={true} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">View all →</Link>
              </div>
              <div className="space-y-2">
                {recentlyViewed.slice(0, 5).map((item) => (
                  <div key={item.resourceId} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">{item.resourceTitle}</div>
                      <div className="text-[10px] text-slate-400 truncate">{item.subjectName} · {item.chapterTitle}</div>
                    </div>
                    <div className="text-[10px] text-slate-400 flex-shrink-0">
                      {new Date(item.viewedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
