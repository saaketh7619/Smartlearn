'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home, BookOpen } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface CourseHierarchyBrowserProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function CourseHierarchyBrowser({ items, className = '' }: CourseHierarchyBrowserProps) {
  return (
    <nav
      aria-label="Course hierarchy breadcrumb"
      className={`flex items-center gap-1 flex-wrap text-xs font-medium text-slate-500 dark:text-slate-400 ${className}`}
    >
      <Link
        href="/student/courses"
        className="inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Courses</span>
      </Link>

      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600 flex-shrink-0" />
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate max-w-[140px] sm:max-w-none"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900 dark:text-white font-semibold truncate max-w-[140px] sm:max-w-none">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
