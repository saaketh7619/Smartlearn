'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  X,
  TrendingUp,
  BarChart3,
  Flame,
  Award,
} from 'lucide-react';
import { db } from '@/lib/db';
import { User } from '@/types';

export default function TeacherRosterPage() {
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  const students = db.users.filter((u) => u.role === 'STUDENT');

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.studentProfile?.rollNumber || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Class 10-A Student Roster
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse 30 enrolled students, view diagnostic metrics, and launch 1-on-1 interventions.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 text-xs font-bold">
          {students.length} Total Students
        </span>
      </div>

      {/* Search Box */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by student name or roll number..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Student Roster Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Roll Number</th>
                <th className="p-4">Diagnostic Score</th>
                <th className="p-4">Attendance</th>
                <th className="p-4">Status / Alert</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredStudents.map((std, idx) => {
                const score = 65 + ((idx * 7) % 32);
                const attendance = 90 + ((idx * 3) % 10);
                const needsAttention = score < 60 || idx === 2 || idx === 6;

                return (
                  <tr
                    key={std.id}
                    onClick={() => setSelectedStudent(std)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={std.avatar}
                          alt={std.name}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100">{std.name}</p>
                          <p className="text-[10px] text-slate-400">{std.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-slate-600 dark:text-slate-400">
                      {std.studentProfile?.rollNumber || `SJA-2026-${1000 + idx}`}
                    </td>
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                      {score}%
                    </td>
                    <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {attendance}%
                    </td>
                    <td className="p-4">
                      {needsAttention ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-[10px] font-bold border border-rose-200 dark:border-rose-900">
                          <AlertCircle className="w-3 h-3" />
                          Needs Attention
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          On Track
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStudent(std);
                        }}
                        className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-bold hover:bg-purple-100 transition-colors"
                      >
                        Inspect Profile
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Deep-Dive Modal Drawer */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4">
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                className="w-14 h-14 rounded-full object-cover ring-4 ring-purple-500/20"
              />
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">{selectedStudent.name}</h3>
                <p className="text-xs text-slate-500">{selectedStudent.studentProfile?.rollNumber} · Grade 10-A</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">
                    Level {selectedStudent.studentProfile?.level || 12}
                  </span>
                  <span className="text-[11px] text-slate-400">·</span>
                  <span className="text-[11px] text-amber-500 font-bold">
                    🔥 {selectedStudent.studentProfile?.streakDays || 7}d Streak
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400">Diagnostic Avg</span>
                <p className="text-base font-black text-purple-600 dark:text-purple-400 mt-0.5">84%</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400">Attendance</span>
                <p className="text-base font-black text-emerald-500 mt-0.5">96%</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400">Tests Taken</span>
                <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">14</p>
              </div>
            </div>

            {/* Weak Topics */}
            <div>
              <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 mb-2">Identified Weak Areas:</h4>
              <div className="space-y-1.5 text-xs">
                <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 flex items-center justify-between">
                  <span>Quadratic Equations (54% accuracy)</span>
                  <span className="font-bold text-[10px]">Action Required</span>
                </div>
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 flex items-center justify-between">
                  <span>Wave Optics (62% accuracy)</span>
                  <span className="font-bold text-[10px]">Moderate</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <Link
                href={`/teacher/messages/?to=${encodeURIComponent(selectedStudent.name)}`}
                prefetch={true}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Direct Message Student & Parent
              </Link>
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
