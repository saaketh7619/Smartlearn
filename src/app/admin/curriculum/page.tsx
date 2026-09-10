'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen, Upload, Search, Filter, CheckCircle2, Clock, Archive,
  Layers, FileText, BarChart3, Users, PlusCircle, Eye, Edit3,
  Trash2, Globe, ChevronDown, ChevronRight, RefreshCw, X,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { db } from '@/lib/db';
import { EDUCATIONAL_LEVELS, getClassAncestors } from '@/lib/curriculumData';
import { Subject, ContentStatus, EducationalLevel } from '@/types';

type StatusFilter = 'all' | ContentStatus;

export default function AdminCurriculumPage() {
  const { currentUser } = useStore();
  const [stats, setStats] = useState(db.getCurriculumStats());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [expandedLevel, setExpandedLevel] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ subjectId: string; action: ContentStatus } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Collect all subjects matching filters
  const allSubjects: (Subject & { levelName: string; streamName: string; classId: string; className: string })[] = [];
  for (const level of db.curriculum) {
    if (levelFilter !== 'all' && level.id !== levelFilter) continue;
    for (const stream of level.streams) {
      for (const cls of stream.classes) {
        for (const sub of cls.subjects) {
          const matches =
            (statusFilter === 'all' || sub.status === statusFilter) &&
            (!search || sub.name.toLowerCase().includes(search.toLowerCase()) ||
              cls.name.toLowerCase().includes(search.toLowerCase()));
          if (matches) {
            allSubjects.push({
              ...sub,
              levelName: level.name,
              streamName: stream.name,
              classId: cls.id,
              className: cls.name,
            });
          }
        }
      }
    }
  }

  const handleStatusChange = (subjectId: string, newStatus: ContentStatus) => {
    db.updateSubjectStatus(subjectId, newStatus, currentUser?.name ?? 'Admin');
    setStats(db.getCurriculumStats());
    setRefreshKey((k) => k + 1);
    setConfirmDialog(null);
  };

  const statusIcon = (status: ContentStatus) => {
    if (status === 'published') return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
    if (status === 'draft') return <Clock className="w-3.5 h-3.5 text-amber-500" />;
    return <Archive className="w-3.5 h-3.5 text-slate-400" />;
  };

  const statusBadge = (status: ContentStatus) => {
    if (status === 'published') return 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40';
    if (status === 'draft') return 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/40';
    return 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Curriculum Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage, publish, and monitor all educational content across levels, streams, and classes.
          </p>
        </div>
        <Link
          href="/admin/curriculum/upload"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#d82a4e] hover:bg-[#c32646] text-white text-xs font-bold transition-all shadow-sm shadow-rose-500/20 hover:shadow-md flex-shrink-0"
        >
          <Upload className="w-3.5 h-3.5" />
          Upload Content
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Educational Levels', val: stats.totalLevels, icon: <Layers className="w-4 h-4 text-blue-500" />, color: 'blue' },
          { label: 'Published', val: stats.publishedSubjects, icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />, color: 'emerald' },
          { label: 'Draft', val: stats.draftSubjects, icon: <Clock className="w-4 h-4 text-amber-500" />, color: 'amber' },
          { label: 'Archived', val: stats.archivedSubjects, icon: <Archive className="w-4 h-4 text-slate-400" />, color: 'slate' },
          { label: 'Total Chapters', val: stats.totalChapters, icon: <BookOpen className="w-4 h-4 text-indigo-500" />, color: 'indigo' },
          { label: 'Total Resources', val: stats.totalResources, icon: <FileText className="w-4 h-4 text-purple-500" />, color: 'purple' },
        ].map(({ label, val, icon }) => (
          <div key={label} className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {icon}
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{val}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="search"
            placeholder="Search subjects, classes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          {/* Level filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
          >
            <option value="all">All Levels</option>
            {db.curriculum.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
        <span className="text-xs text-slate-400 ml-auto">{allSubjects.length} subjects found</span>
      </div>

      {/* Hierarchy Tree Browser */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-bold text-slate-900 dark:text-white">Curriculum Hierarchy</span>
        </div>

        {db.curriculum.map((level) => (
          <div key={level.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
            {/* Level Header */}
            <button
              onClick={() => setExpandedLevel(expandedLevel === level.id ? null : level.id)}
              className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-left cursor-pointer"
            >
              <span className="text-lg">{level.icon || '📚'}</span>
              <div className="flex-1">
                <div className="font-bold text-sm text-slate-900 dark:text-white">{level.name}</div>
                <div className="text-[10px] text-slate-400">{level.streams.length} streams</div>
              </div>
              <div className="flex items-center gap-2">
                {(() => {
                  let pub = 0, draft = 0;
                  for (const s of level.streams) for (const c of s.classes) for (const sub of c.subjects) {
                    if (sub.status === 'published') pub++;
                    else if (sub.status === 'draft') draft++;
                  }
                  return (
                    <>
                      {pub > 0 && <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">{pub} live</span>}
                      {draft > 0 && <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold">{draft} draft</span>}
                    </>
                  );
                })()}
                {expandedLevel === level.id
                  ? <ChevronDown className="w-4 h-4 text-slate-400" />
                  : <ChevronRight className="w-4 h-4 text-slate-400" />}
              </div>
            </button>

            {/* Streams & Classes */}
            {expandedLevel === level.id && (
              <div className="border-t border-slate-100 dark:border-slate-800">
                {level.streams.map((stream) => (
                  <div key={stream.id} className="pl-6">
                    <div className="py-2 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                      {stream.name}
                    </div>
                    {stream.classes.map((cls) => (
                      <div key={cls.id} className="border-b border-slate-100/60 dark:border-slate-800/60 last:border-0">
                        <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-colors">
                          <BookOpen className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex-1">{cls.name}</span>
                          <span className="text-[10px] text-slate-400">{cls.subjects.length} subjects</span>
                          <Link
                            href={`/admin/curriculum/upload?classId=${cls.id}`}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold hover:bg-blue-100 transition-colors flex items-center gap-1"
                          >
                            <PlusCircle className="w-3 h-3" /> Add Subject
                          </Link>
                        </div>
                        {/* Subjects */}
                        {cls.subjects.map((sub) => (
                          <div
                            key={sub.id}
                            className="flex items-center gap-3 pl-10 pr-4 py-2 hover:bg-slate-50/40 dark:hover:bg-slate-800/10 transition-colors"
                          >
                            {statusIcon(sub.status)}
                            <span className="text-xs text-slate-700 dark:text-slate-300 flex-1">{sub.name}</span>
                            {sub.board && <span className="text-[10px] text-slate-400">{sub.board}</span>}
                            <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${statusBadge(sub.status)}`}>
                              {sub.status}
                            </span>
                            <div className="flex items-center gap-1">
                              {sub.status === 'draft' && (
                                <button
                                  onClick={() => handleStatusChange(sub.id, 'published')}
                                  title="Publish"
                                  className="p-1 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-500 transition-colors cursor-pointer"
                                >
                                  <Globe className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {sub.status === 'published' && (
                                <button
                                  onClick={() => handleStatusChange(sub.id, 'draft')}
                                  title="Unpublish"
                                  className="p-1 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-500 transition-colors cursor-pointer"
                                >
                                  <Clock className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {sub.status !== 'archived' && (
                                <button
                                  onClick={() => handleStatusChange(sub.id, 'archived')}
                                  title="Archive"
                                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors cursor-pointer"
                                >
                                  <Archive className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Subject List Grid */}
      {allSubjects.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            {statusFilter === 'all' ? 'All Subjects' : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Subjects`}
            <span className="ml-2 text-slate-400 font-normal text-xs">({allSubjects.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allSubjects.map((sub) => (
              <div key={sub.id} className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      {sub.levelName} · {sub.streamName}
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">{sub.name}</h3>
                    <div className="text-xs text-slate-500 mt-0.5">{sub.className}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold flex-shrink-0 flex items-center gap-1 ${statusBadge(sub.status)}`}>
                    {statusIcon(sub.status)}{sub.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {sub.chapters.length} chapters</span>
                  {sub.board && <span>{sub.board}</span>}
                  {sub.academicYear && <span>{sub.academicYear}</span>}
                </div>

                {sub.audit.uploadedBy !== 'system' && (
                  <div className="text-[10px] text-slate-400">
                    By {sub.audit.uploadedBy} · {new Date(sub.audit.uploadedAt).toLocaleDateString()}
                    {sub.audit.editedBy && ` · Edited by ${sub.audit.editedBy}`}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  {sub.status === 'draft' && (
                    <button
                      onClick={() => handleStatusChange(sub.id, 'published')}
                      className="flex-1 py-1.5 rounded-xl text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 hover:bg-emerald-100 transition-colors cursor-pointer"
                    >
                      Publish
                    </button>
                  )}
                  {sub.status === 'published' && (
                    <button
                      onClick={() => handleStatusChange(sub.id, 'draft')}
                      className="flex-1 py-1.5 rounded-xl text-[10px] font-bold bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 hover:bg-amber-100 transition-colors cursor-pointer"
                    >
                      Unpublish
                    </button>
                  )}
                  {sub.status !== 'archived' && (
                    <button
                      onClick={() => handleStatusChange(sub.id, 'archived')}
                      className="py-1.5 px-3 rounded-xl text-[10px] font-bold text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Archive
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {allSubjects.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm font-semibold">No subjects match your filters</p>
          <p className="text-xs mt-1">Try changing the status or level filter, or upload new content.</p>
        </div>
      )}
    </div>
  );
}
