'use client';

import React, { useState } from 'react';
import {
  Printer,
  FileText,
  Download,
  Award,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { db } from '@/lib/db';

export default function TeacherReportsPage() {
  const [selectedStudentName, setSelectedStudentName] = useState('Alex Rivera');
  const students = db.users.filter((u) => u.role === 'STUDENT');

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Print-Friendly Performance Report Cards
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate formal academic progress certificates and report cards formatted for parents and student portfolios.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedStudentName}
            onChange={(e) => setSelectedStudentName(e.target.value)}
            className="px-3.5 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-semibold"
          >
            {students.slice(0, 8).map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report Card
          </button>
        </div>
      </div>

      {/* Official Report Card Printable Canvas */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white text-slate-900 border-2 border-slate-300 shadow-xl space-y-8 print:border-none print:shadow-none print:p-0">
        {/* School Crest & Header */}
        <div className="text-center pb-6 border-b-2 border-slate-900 space-y-1">
          <div className="text-2xl font-black uppercase tracking-widest text-slate-900">
            ST. JUDE INTERNATIONAL ACADEMY
          </div>
          <p className="text-xs text-slate-600 uppercase tracking-wider font-semibold">
            DEPARTMENT OF STEM & ACADEMIC RIGOR · SEMESTER I EVALUATION
          </p>
          <p className="text-[11px] text-slate-500">Accredited by International Baccalaureate & STEM Education Board</p>
        </div>

        {/* Student Metadata Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Student Name</span>
            <span className="font-bold text-sm text-slate-900">{selectedStudentName}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Roll Number</span>
            <span className="font-bold text-sm text-slate-900 font-mono">SJA-2026-1042</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Class & Section</span>
            <span className="font-bold text-sm text-slate-900">Grade 10 - Section A</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Class Teacher</span>
            <span className="font-bold text-sm text-slate-900">Dr. Sarah Jenkins</span>
          </div>
        </div>

        {/* Subject Score Breakdown Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-300">
            <thead className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-[10px] text-slate-700">
              <tr>
                <th className="p-3 border-r border-slate-300">Subject</th>
                <th className="p-3 border-r border-slate-300 text-center">Max Marks</th>
                <th className="p-3 border-r border-slate-300 text-center">Marks Obtained</th>
                <th className="p-3 border-r border-slate-300 text-center">Percentage</th>
                <th className="p-3 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-3 border-r border-slate-200 font-bold">Differential Calculus & Geometry</td>
                <td className="p-3 border-r border-slate-200 text-center">100</td>
                <td className="p-3 border-r border-slate-200 text-center font-bold">92</td>
                <td className="p-3 border-r border-slate-200 text-center">92%</td>
                <td className="p-3 text-center font-black text-emerald-700">A+</td>
              </tr>
              <tr>
                <td className="p-3 border-r border-slate-200 font-bold">Kinematics & Newtonian Mechanics</td>
                <td className="p-3 border-r border-slate-200 text-center">100</td>
                <td className="p-3 border-r border-slate-200 text-center font-bold">85</td>
                <td className="p-3 border-r border-slate-200 text-center">85%</td>
                <td className="p-3 text-center font-black text-emerald-700">A</td>
              </tr>
              <tr>
                <td className="p-3 border-r border-slate-200 font-bold">Python for Artificial Intelligence</td>
                <td className="p-3 border-r border-slate-200 text-center">100</td>
                <td className="p-3 border-r border-slate-200 text-center font-bold">96</td>
                <td className="p-3 border-r border-slate-200 text-center">96%</td>
                <td className="p-3 text-center font-black text-emerald-700">A+</td>
              </tr>
              <tr>
                <td className="p-3 border-r border-slate-200 font-bold">Molecular Genetics & Biology</td>
                <td className="p-3 border-r border-slate-200 text-center">100</td>
                <td className="p-3 border-r border-slate-200 text-center font-bold">78</td>
                <td className="p-3 border-r border-slate-200 text-center">78%</td>
                <td className="p-3 text-center font-black text-blue-700">B+</td>
              </tr>
              <tr className="bg-slate-50 font-bold">
                <td className="p-3 border-r border-slate-300">CUMULATIVE SEMESTER TOTAL</td>
                <td className="p-3 border-r border-slate-300 text-center">400</td>
                <td className="p-3 border-r border-slate-300 text-center">351</td>
                <td className="p-3 border-r border-slate-300 text-center">87.75%</td>
                <td className="p-3 text-center font-black text-emerald-700">DISTINCTION</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Teacher Qualitative Comments */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 leading-relaxed">
          <span className="font-bold uppercase tracking-wider text-slate-700 block">
            Faculty Remarks & Recommendations:
          </span>
          <p className="text-slate-700">
            {selectedStudentName} demonstrates exceptional analytical rigor in mathematical modeling and programming.
            Participation in the district Olympiad preparation has yielded noticeable gains. We recommend focused practice
            on quadratic discriminant proofs and combinatorics problem sets over the mid-term break.
          </p>
        </div>

        {/* Signatures */}
        <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
          <div className="space-y-1 border-t border-slate-900 pt-2">
            <p className="font-bold">Dr. Sarah Jenkins</p>
            <p className="text-[10px] text-slate-500">Head of Department / Class Teacher</p>
          </div>
          <div className="space-y-1 border-t border-slate-900 pt-2">
            <p className="font-bold">Marcus Vance</p>
            <p className="text-[10px] text-slate-500">Principal Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}
