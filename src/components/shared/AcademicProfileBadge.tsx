'use client';

import React from 'react';
import Link from 'next/link';
import { GraduationCap, ChevronRight } from 'lucide-react';
import { StudentAcademicProfile } from '@/types';

interface AcademicProfileBadgeProps {
  profile: StudentAcademicProfile;
  compact?: boolean;
  linkToProfile?: boolean;
  className?: string;
}

export function AcademicProfileBadge({
  profile,
  compact = false,
  linkToProfile = true,
  className = '',
}: AcademicProfileBadgeProps) {
  const content = compact ? (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 ${className}`}>
      <GraduationCap className="w-3 h-3" />
      {profile.classLevel}
      {profile.board && <span className="text-blue-400 dark:text-blue-500">· {profile.board}</span>}
    </span>
  ) : (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 ${className}`}>
      <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
        <GraduationCap className="w-4 h-4 text-white" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-bold text-blue-700 dark:text-blue-300 truncate">
          {profile.educationalLevel} · {profile.stream} · {profile.classLevel}
        </div>
        <div className="text-[10px] text-blue-500 dark:text-blue-400 truncate">
          {profile.board}{profile.subjects.length > 0 && ` · ${profile.subjects.slice(0, 3).join(', ')}${profile.subjects.length > 3 ? ` +${profile.subjects.length - 3}` : ''}`}
        </div>
      </div>
      {linkToProfile && (
        <ChevronRight className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
      )}
    </div>
  );

  if (!linkToProfile) return content;

  return (
    <Link href="/student/profile/" prefetch={true} className="block hover:opacity-80 transition-opacity">
      {content}
    </Link>
  );
}
