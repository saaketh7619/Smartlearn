'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Layers,
  Sparkles,
  RotateCw,
  CheckCircle2,
  BrainCircuit,
  ArrowRight,
  BookOpen,
  Plus,
  Zap,
  Clock,
  ThumbsUp,
  RotateCcw,
  Check,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useToast } from '@/components/shared/ToastContext';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint: string;
  mastery?: 'learning' | 'review' | 'mastered';
}

interface Deck {
  id: string;
  title: string;
  subject: string;
  cards: Flashcard[];
}

const PRESET_DECKS: Deck[] = [
  {
    id: 'deck-math',
    title: 'Quadratic Equations & Complex Roots',
    subject: 'Mathematics',
    cards: [
      {
        id: 'fc-m1',
        front: 'What does the sign of the discriminant (Δ = b² - 4ac) signify about quadratic roots?',
        back: '• Δ > 0: Two distinct real roots\n• Δ = 0: One repeated real root (tangent to x-axis)\n• Δ < 0: Two complex conjugate roots (no real intercepts)',
        hint: 'Think of where the parabola intersects the horizontal axis.',
      },
      {
        id: 'fc-m2',
        front: 'What is the sum and product of roots for ax² + bx + c = 0 (Vieta\'s Formulas)?',
        back: '• Sum of roots (α + β) = -b / a\n• Product of roots (α · β) = c / a',
        hint: 'Derived directly from expanding a(x - α)(x - β).',
      },
      {
        id: 'fc-m3',
        front: 'How do you find the vertex (turning point) of a parabola y = ax² + bx + c?',
        back: '• x-coordinate: x_v = -b / (2a)\n• y-coordinate: y_v = f(-b / 2a) = -(b² - 4ac) / (4a)',
        hint: 'Set the first derivative dy/dx = 2ax + b to zero.',
      },
    ],
  },
  {
    id: 'deck-phys',
    title: 'Kinematics & Newtonian Mechanics',
    subject: 'Physics',
    cards: [
      {
        id: 'fc-p1',
        front: 'State the 3 Kinematic Equations for constant acceleration (a).',
        back: '1. v = u + at\n2. s = ut + ½at²\n3. v² = u² + 2as\n(where u = initial velocity, v = final, s = displacement).',
        hint: 'Derived by integrating acceleration twice over time.',
      },
      {
        id: 'fc-p2',
        front: 'What is the condition for an elastic vs inelastic collision?',
        back: '• Elastic: Both momentum AND kinetic energy are conserved (e = 1).\n• Inelastic: Momentum is conserved, but kinetic energy is lost as heat/deformation (0 ≤ e < 1).',
        hint: 'Coefficient of restitution determines the ratio of relative speeds.',
      },
      {
        id: 'fc-p3',
        front: 'How is centripetal acceleration defined for uniform circular motion of radius r?',
        back: 'a_c = v² / r = ω²r\nAlways points radially inward toward the center of the orbit.',
        hint: 'Direction changes continuously even if tangential speed is constant.',
      },
    ],
  },
  {
    id: 'deck-chem',
    title: 'Chemical Equilibrium & Kinetics',
    subject: 'Chemistry',
    cards: [
      {
        id: 'fc-c1',
        front: 'What is Le Chatelier’s principle regarding pressure changes in gaseous reactions?',
        back: 'Increasing pressure shifts equilibrium toward the side with FEWER moles of gas to relieve the stress. Decreasing pressure shifts toward MORE moles of gas.',
        hint: 'Count the stoichiometric coefficients of gases on reactants vs products.',
      },
      {
        id: 'fc-c2',
        front: 'How does temperature affect the rate constant k in the Arrhenius Equation?',
        back: 'k = A · e^(-E_a / RT)\nAs temperature (T) increases, e^(-E_a/RT) increases exponentially, rapidly speeding up reaction rate.',
        hint: 'E_a is the activation energy barrier; R is universal gas constant.',
      },
    ],
  },
];

export default function RevisionGeneratorPage() {
  const addXP = useStore((state) => state.addXP);
  const triggerConfetti = useStore((state) => state.triggerConfetti);
  const toast = useToast();

  const [decks, setDecks] = useState<Deck[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCustom = JSON.parse(localStorage.getItem('smartlearn_custom_decks') || '[]');
        if (savedCustom.length > 0) {
          return [...PRESET_DECKS, ...savedCustom];
        }
      } catch {
        // ignore
      }
    }
    return PRESET_DECKS;
  });

  const [activeDeckId, setActiveDeckId] = useState<string>('deck-math');
  const [inputTopic, setInputTopic] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteryScores, setMasteryScores] = useState<Record<string, 'again' | 'hard' | 'good' | 'easy'>>({});

  const currentDeck = decks.find((d) => d.id === activeDeckId) || decks[0];
  const flashcards = currentDeck.cards;
  const currentCard = flashcards[activeCardIndex] || flashcards[0];

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) return;

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setIsFlipped(false);
        setActiveCardIndex((prev) => Math.min(flashcards.length - 1, prev + 1));
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setIsFlipped(false);
        setActiveCardIndex((prev) => Math.max(0, prev - 1));
      }
    },
    [flashcards.length]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleRateMastery = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    setMasteryScores((prev) => ({ ...prev, [currentCard.id]: rating }));

    let xpGained = 10;
    if (rating === 'good') xpGained = 20;
    if (rating === 'easy') xpGained = 30;

    addXP(xpGained, `Active Recall: ${currentDeck.title}`);
    toast.success(`Recall Recorded (+${xpGained} XP)`, `Marked as "${rating.toUpperCase()}". Next repetition interval updated.`);

    // Move to next card if available
    if (activeCardIndex < flashcards.length - 1) {
      setTimeout(() => {
        setIsFlipped(false);
        setActiveCardIndex((prev) => prev + 1);
      }, 300);
    } else {
      triggerConfetti();
      toast.success('Deck Completed! 🎉', 'You reviewed all cards in this active recall session.');
    }
  };

  const handleSynthesize = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputTopic.trim()) return;

    setIsSynthesizing(true);
    setTimeout(() => {
      const newDeck: Deck = {
        id: `deck-${Date.now()}`,
        title: inputTopic.trim(),
        subject: 'Adaptive Revision',
        cards: [
          {
            id: `gen-1-${Date.now()}`,
            front: `What is the foundational core definition of ${inputTopic.trim()}?`,
            back: `• Primary physical/mathematical model:\nGoverned by the standard conservation laws and boundary relations.\n• Practical applications:\nFrequently tested in mock diagnostics and real-world engineering simulations.`,
            hint: 'Review the base definitions and standard SI units.',
          },
          {
            id: `gen-2-${Date.now()}`,
            front: `What is the most common conceptual mistake in ${inputTopic.trim()}?`,
            back: `Neglecting initial boundary constraints or failing to account for sign conventions.\nAlways verify units via dimensional analysis.`,
            hint: 'Recall diagnostic test question breakdowns.',
          },
          {
            id: `gen-3-${Date.now()}`,
            front: `How do you derive the main governing formula for ${inputTopic.trim()}?`,
            back: `1. Formulate the state equation.\n2. Isolate unknown variables via algebraic substitutions.\n3. Integrate across the specified boundary limits.`,
            hint: 'Look for symmetry and rate-of-change relationships.',
          },
        ],
      };

      setDecks((prev) => [newDeck, ...prev]);
      setActiveDeckId(newDeck.id);
      setActiveCardIndex(0);
      setIsFlipped(false);
      setInputTopic('');
      setIsSynthesizing(false);
      triggerConfetti();
      addXP(40, `Generated Revision Flashcards for ${newDeck.title}`);
      toast.success('Deck Synthesized', `Generated 3 active recall cards for "${newDeck.title}".`);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Active Recall &amp; Leitner System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Revision &amp; Flashcards
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review adaptive spaced repetition decks, test recall with timed intervals, or generate custom decks from any topic.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
          {decks.length} Active Decks Available
        </span>
      </div>

      {/* Input Generator Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <form onSubmit={handleSynthesize}>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Generate Flashcard Deck on Demand
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={inputTopic}
              onChange={(e) => setInputTopic(e.target.value)}
              placeholder="Enter any topic (e.g. Wave Optics, DNA Replication, Binary Trees)..."
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner"
            />
            <button
              type="submit"
              disabled={isSynthesizing || !inputTopic.trim()}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSynthesizing ? 'Synthesizing...' : 'Generate Deck'}</span>
            </button>
          </div>
        </form>

        {/* Quick Topic Chips */}
        <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400 flex-wrap">
          <span>Popular topics:</span>
          <button
            type="button"
            onClick={() => setInputTopic("Calculus: L'Hôpital's Rule & Limits")}
            className="text-purple-600 dark:text-purple-400 hover:underline font-medium cursor-pointer"
          >
            L&apos;Hôpital&apos;s Rule
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => setInputTopic('Physics: Kepler Laws of Planetary Motion')}
            className="text-purple-600 dark:text-purple-400 hover:underline font-medium cursor-pointer"
          >
            Kepler&apos;s Laws
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => setInputTopic('Computer Science: Big-O Sorting Complexity')}
            className="text-purple-600 dark:text-purple-400 hover:underline font-medium cursor-pointer"
          >
            Big-O Complexity
          </button>
        </div>
      </div>

      {/* Deck Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {decks.map((d) => (
          <button
            key={d.id}
            onClick={() => {
              setActiveDeckId(d.id);
              setActiveCardIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeDeckId === d.id
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span>{d.title}</span>
            <span className="ml-1.5 opacity-75 text-[10px]">({d.cards.length})</span>
          </button>
        ))}
      </div>

      {/* Interactive 3D Flip Flashcard */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            {currentDeck.title} ({activeCardIndex + 1} of {flashcards.length})
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Use <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">Space</kbd> to flip, <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">→</kbd> to navigate
          </span>
        </div>

        {/* The Card Container */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="cursor-pointer select-none perspective-1000 min-h-[280px] sm:min-h-[300px] rounded-3xl p-8 bg-gradient-to-br from-slate-900 via-[#161a22] to-slate-950 text-white border border-slate-800 shadow-2xl flex flex-col justify-between transition-all hover:border-purple-500/50 relative overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
              <span className="font-mono font-bold text-purple-300">CARD #{activeCardIndex + 1} OF {flashcards.length}</span>
              <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-[10px] flex items-center gap-1">
                <RotateCw className="w-3 h-3" />
                {isFlipped ? 'Answer & Explanation (Click to flip)' : 'Prompt / Question (Click to flip)'}
              </span>
            </div>

            {!isFlipped ? (
              <div className="space-y-3 py-4">
                <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                  {currentCard.front}
                </h3>
                {currentCard.hint && (
                  <p className="text-xs text-purple-300/80 italic pt-2">💡 Hint: {currentCard.hint}</p>
                )}
              </div>
            ) : (
              <div className="space-y-3 py-4 animate-in fade-in duration-150">
                <div className="text-sm sm:text-base font-medium text-purple-100 leading-relaxed whitespace-pre-line">
                  {currentCard.back}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Bar inside Card */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-4 border-t border-slate-800/80">
            <span>{isFlipped ? 'Rate your recall below' : 'Click card to reveal answer'}</span>
            <span className="font-semibold text-purple-400">SmartLearn Active Recall</span>
          </div>
        </div>

        {/* Spaced Repetition Mastery Rating Buttons (Shown when flipped) */}
        {isFlipped && (
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              <span>How well did you remember this?</span>
              <span className="text-[10px]">Sets interval for your next revision cycle</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRateMastery('again');
                }}
                className="py-2.5 px-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 font-bold text-xs hover:bg-rose-100 transition-colors flex flex-col items-center cursor-pointer"
              >
                <span>Again</span>
                <span className="text-[10px] font-normal opacity-75">&lt; 1 min</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRateMastery('hard');
                }}
                className="py-2.5 px-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900 font-bold text-xs hover:bg-amber-100 transition-colors flex flex-col items-center cursor-pointer"
              >
                <span>Hard</span>
                <span className="text-[10px] font-normal opacity-75">10 mins</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRateMastery('good');
                }}
                className="py-2.5 px-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 font-bold text-xs hover:bg-blue-100 transition-colors flex flex-col items-center cursor-pointer"
              >
                <span>Good</span>
                <span className="text-[10px] font-normal opacity-75">1 day</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRateMastery('easy');
                }}
                className="py-2.5 px-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 font-bold text-xs hover:bg-emerald-100 transition-colors flex flex-col items-center cursor-pointer"
              >
                <span>Easy</span>
                <span className="text-[10px] font-normal opacity-75">4 days</span>
              </button>
            </div>
          </div>
        )}

        {/* Card Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => {
              setIsFlipped(false);
              setActiveCardIndex((prev) => Math.max(0, prev - 1));
            }}
            disabled={activeCardIndex === 0}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-30 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            ← Previous Card
          </button>

          <div className="flex gap-1.5 items-center">
            {flashcards.map((card, i) => (
              <button
                key={card.id || i}
                onClick={() => {
                  setIsFlipped(false);
                  setActiveCardIndex(i);
                }}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  activeCardIndex === i
                    ? 'w-6 bg-purple-600'
                    : masteryScores[card.id] === 'easy' || masteryScores[card.id] === 'good'
                    ? 'w-2.5 bg-emerald-500'
                    : masteryScores[card.id] === 'again'
                    ? 'w-2.5 bg-rose-500'
                    : 'w-2.5 bg-slate-300 dark:bg-slate-700'
                }`}
                title={`Card ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              setIsFlipped(false);
              setActiveCardIndex((prev) => Math.min(flashcards.length - 1, prev + 1));
            }}
            disabled={activeCardIndex === flashcards.length - 1}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-30 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            Next Card →
          </button>
        </div>
      </div>
    </div>
  );
}
