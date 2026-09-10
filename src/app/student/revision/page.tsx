'use client';

import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  UploadCloud,
  FileText,
  RotateCw,
  CheckCircle2,
  HelpCircle,
  BrainCircuit,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { useStore } from '@/store/useStore';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint: string;
}

export default function RevisionGeneratorPage() {
  const addXP = useStore((state) => state.addXP);
  const triggerConfetti = useStore((state) => state.triggerConfetti);

  const [inputTopic, setInputTopic] = useState('Quadratic Equations and Complex Roots');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    {
      id: 'fc-1',
      front: 'What does the sign of the discriminant (Δ = b² - 4ac) signify about quadratic roots?',
      back: '• Δ > 0: Two distinct real roots\n• Δ = 0: One repeated real root (tangent to x-axis)\n• Δ < 0: Two complex conjugate roots (no real intercepts)',
      hint: 'Think of where the parabola intersects the horizontal axis.',
    },
    {
      id: 'fc-2',
      front: 'What is the sum and product of roots for ax² + bx + c = 0 (Vieta\'s Formulas)?',
      back: '• Sum of roots (α + β) = -b / a\n• Product of roots (α · β) = c / a',
      hint: 'Derived directly from expanding a(x - α)(x - β).',
    },
    {
      id: 'fc-3',
      front: 'How do you find the vertex (turning point) of a parabola y = ax² + bx + c?',
      back: '• x-coordinate: x_v = -b / (2a)\n• y-coordinate: y_v = f(-b / 2a) = -(b² - 4ac) / (4a)',
      hint: 'Set the first derivative dy/dx = 2ax + b to zero.',
    },
  ]);

  const handleSynthesize = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      setIsSynthesizing(false);
      triggerConfetti();
      addXP(40, `Generated Revision Flashcards for ${inputTopic}`);
    }, 1200);
  };

  const currentCard = flashcards[activeCardIndex] || flashcards[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Revision & Flashcard Generator
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Paste lecture notes, syllabus chapters, or weak topics to generate concise summaries, active-recall flashcards, and quick quizzes.
        </p>
      </div>

      {/* Input Generator Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Topic or Paste Lecture Material
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputTopic}
              onChange={(e) => setInputTopic(e.target.value)}
              placeholder="e.g. Wave Optics, Photosynthesis, Newtonian Mechanics..."
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSynthesize}
              disabled={isSynthesizing}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isSynthesizing ? 'Synthesizing...' : 'Generate Flashcards'}
            </button>
          </div>
        </div>

        {/* Quick presets */}
        <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
          <span>Try quick topics:</span>
          <button
            onClick={() => setInputTopic('Calculus: Limits and L\'Hôpital\'s Rule')}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            L&apos;Hôpital&apos;s Rule
          </button>
          <span>·</span>
          <button
            onClick={() => setInputTopic('Organic Chemistry: Electrophilic Substitution')}
            className="text-purple-600 dark:text-purple-400 hover:underline"
          >
            Electrophilic Reactions
          </button>
        </div>
      </div>

      {/* 3D Flip Flashcard */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            Interactive Flashcard Deck ({activeCardIndex + 1} of {flashcards.length})
          </span>
          <span className="text-[11px] text-slate-400">Click card or press space to flip</span>
        </div>

        {/* The Card Container */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="cursor-pointer select-none perspective-1000 min-h-[260px] sm:min-h-[280px] rounded-3xl p-8 bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 shadow-2xl flex flex-col justify-between transition-all hover:scale-[1.01] hover:border-purple-500/50 relative overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
              <span className="font-mono font-bold">CARD #{activeCardIndex + 1}</span>
              <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-[10px] flex items-center gap-1">
                <RotateCw className="w-3 h-3" />
                {isFlipped ? 'Back (Explanation)' : 'Front (Question)'}
              </span>
            </div>

            {!isFlipped ? (
              <div className="space-y-3 py-4">
                <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                  {currentCard.front}
                </h3>
                <p className="text-xs text-purple-300/80 italic">💡 Hint: {currentCard.hint}</p>
              </div>
            ) : (
              <div className="space-y-3 py-4 animate-in fade-in duration-150">
                <div className="text-sm sm:text-base font-semibold text-purple-200 leading-relaxed whitespace-pre-line">
                  {currentCard.back}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-4 border-t border-slate-800">
            <span>Flip to reveal answer</span>
            <span className="font-semibold text-purple-400">SmartLearn Active Recall</span>
          </div>
        </div>

        {/* Card Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => {
              setIsFlipped(false);
              setActiveCardIndex((prev) => Math.max(0, prev - 1));
            }}
            disabled={activeCardIndex === 0}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-30 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ← Previous Card
          </button>

          <div className="flex gap-1.5">
            {flashcards.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIsFlipped(false);
                  setActiveCardIndex(i);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  activeCardIndex === i ? 'w-6 bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              setIsFlipped(false);
              setActiveCardIndex((prev) => Math.min(flashcards.length - 1, prev + 1));
            }}
            disabled={activeCardIndex === flashcards.length - 1}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-30 text-white text-xs font-bold shadow-xs"
          >
            Next Card →
          </button>
        </div>
      </div>
    </div>
  );
}
