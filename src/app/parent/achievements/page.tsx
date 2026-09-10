'use client';

import React from 'react';
import {
  Award,
  Sparkles,
  Trophy,
  Download,
  Share2,
  Calendar,
} from 'lucide-react';
import { db } from '@/lib/db';

export default function ParentAchievementsPage() {
  const badges = db.badges;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Child Achievements & Trophy Cabinet
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Celebrating Alex Rivera&apos;s verified milestones, badges, and academic accomplishments.
        </p>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-3 hover:scale-105 transition-transform"
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center text-3xl shadow-inner">
              {badge.icon}
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">{badge.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{badge.description}</p>
            <div className="pt-2">
              <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-bold text-xs">
                +{badge.xpReward} XP Awarded
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
