'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PlusCircle,
  Shield,
  Shuffle,
  Sparkles,
  CheckCircle2,
  Trash2,
  FileQuestion,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { db } from '@/lib/db';
import { Question, Test } from '@/types';

export default function CreateTestPage() {
  const router = useRouter();
  const triggerConfetti = useStore((state) => state.triggerConfetti);

  const [title, setTitle] = useState('Calculus & Kinematics Chapter Exam');
  const [subject, setSubject] = useState('Mathematics');
  const [grade, setGrade] = useState('Grade 10');
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [isAdaptive, setIsAdaptive] = useState(true);
  const [antiCheatEnabled, setAntiCheatEnabled] = useState(true);
  const [randomizeQuestions, setRandomizeQuestions] = useState(true);

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'q-custom-1',
      text: 'What is the limit of (x² - 9) / (x - 3) as x approaches 3?',
      options: ['0', '3', '6', 'Undefined'],
      correctAnswerIndex: 2,
      explanation: 'Factor the numerator: (x - 3)(x + 3) / (x - 3) = x + 3. As x -> 3, 3 + 3 = 6.',
      topic: 'Limits & Continuity',
      subject: 'Mathematics',
      difficulty: 'Easy',
    },
    {
      id: 'q-custom-2',
      text: 'Find the acceleration function if displacement is s(t) = 4t³ - 6t² + 2t.',
      options: ['24t - 12', '12t² - 12t + 2', '24t² - 12', '12t - 6'],
      correctAnswerIndex: 0,
      explanation: 'Velocity v(t) = s\'(t) = 12t² - 12t + 2. Acceleration a(t) = v\'(t) = 24t - 12.',
      topic: 'Kinematic Derivatives',
      subject: 'Mathematics',
      difficulty: 'Medium',
    },
  ]);

  const [newQuestionText, setNewQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctIndex, setCorrectIndex] = useState(0);
  const [questionDifficulty, setQuestionDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Olympiad'>('Medium');

  const handleAddQuestion = () => {
    if (!newQuestionText.trim() || !optionA.trim()) return;
    const newQ: Question = {
      id: `q-${Date.now()}`,
      text: newQuestionText,
      options: [optionA, optionB, optionC, optionD],
      correctAnswerIndex: correctIndex,
      explanation: 'Standard curriculum derivation.',
      topic: 'General STEM',
      subject,
      difficulty: questionDifficulty,
    };
    setQuestions([...questions, newQ]);
    setNewQuestionText('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
  };

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    const newTest: Test = {
      id: `test-${Date.now()}`,
      title,
      subject,
      grade,
      durationMinutes,
      totalMarks: questions.length * 10,
      questions,
      isAdaptive,
      antiCheatEnabled,
      createdAt: new Date().toISOString(),
    };
    db.tests.unshift(newTest);
    triggerConfetti();
    router.push('/teacher/');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Create New Adaptive Test
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Combine tagged question bank items, manual problem authoring, and active anti-cheating controls.
        </p>
      </div>

      <form onSubmit={handleCreateTest} className="space-y-6">
        {/* Basic Info */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Exam Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Test Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option>Mathematics</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Computer Science</option>
              </select>
            </div>
          </div>

          {/* Anti-Cheating & Adaptive Toggles */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer text-xs font-semibold">
              <input
                type="checkbox"
                checked={antiCheatEnabled}
                onChange={(e) => setAntiCheatEnabled(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                <Shield className="w-4 h-4" />
                <span>Page Visibility Anti-Cheat</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer text-xs font-semibold">
              <input
                type="checkbox"
                checked={isAdaptive}
                onChange={(e) => setIsAdaptive(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <Sparkles className="w-4 h-4" />
                <span>Adaptive Difficulty Scaling</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer text-xs font-semibold">
              <input
                type="checkbox"
                checked={randomizeQuestions}
                onChange={(e) => setRandomizeQuestions(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <Shuffle className="w-4 h-4" />
                <span>Randomize Question Order</span>
              </div>
            </label>
          </div>
        </div>

        {/* Existing Questions in Test */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Questions Selected ({questions.length})
            </h3>
            <span className="text-xs text-purple-600 dark:text-purple-400 font-bold">
              {questions.length * 10} Total Marks
            </span>
          </div>

          <div className="space-y-2">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-purple-600 mr-2">Q{idx + 1} ({q.difficulty}):</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{q.text}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setQuestions(questions.filter((_, i) => i !== idx))}
                  className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Question Sub-form */}
          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60 space-y-3 mt-4">
            <span className="font-bold text-xs text-purple-900 dark:text-purple-300 block">
              + Author New Question
            </span>
            <input
              type="text"
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="Question statement (e.g. Find roots of x² - 5x + 6 = 0)..."
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
                placeholder="Option A"
                className="px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
              />
              <input
                type="text"
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
                placeholder="Option B"
                className="px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
              />
              <input
                type="text"
                value={optionC}
                onChange={(e) => setOptionC(e.target.value)}
                placeholder="Option C"
                className="px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
              />
              <input
                type="text"
                value={optionD}
                onChange={(e) => setOptionD(e.target.value)}
                placeholder="Option D"
                className="px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Correct Option:</span>
                <select
                  value={correctIndex}
                  onChange={(e) => setCorrectIndex(Number(e.target.value))}
                  className="px-2 py-1 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                >
                  <option value={0}>Option A</option>
                  <option value={1}>Option B</option>
                  <option value={2}>Option C</option>
                  <option value={3}>Option D</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
              >
                Add to Test
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          Publish Test to Class 10-A
        </button>
      </form>
    </div>
  );
}
