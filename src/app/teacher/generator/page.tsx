'use client';

import React, { useState } from 'react';
import {
  Wand2,
  FileQuestion,
  BookOpen,
  Printer,
  Copy,
  Sparkles,
  CheckCircle2,
  Download,
  Share2,
  Check,
} from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function TeacherGeneratorPage() {
  const triggerConfetti = useStore((state) => state.triggerConfetti);
  const [activeTab, setActiveTab] = useState<'paper' | 'plan'>('paper');

  // Question paper form state
  const [subject, setSubject] = useState('Mathematics');
  const [syllabus, setSyllabus] = useState('Quadratic Equations & Polynomials');
  const [totalMarks, setTotalMarks] = useState('50');
  const [difficulty, setDifficulty] = useState('Balanced (40% Medium, 30% Hard, 30% Olympiad)');
  const [isGeneratingPaper, setIsGeneratingPaper] = useState(false);
  const [generatedPaper, setGeneratedPaper] = useState<string | null>(null);

  // Lesson plan form state
  const [planSubject, setPlanSubject] = useState('Mathematics');
  const [planTopic, setPlanTopic] = useState('Deriving and Applying the Chain Rule');
  const [duration, setDuration] = useState('60 Minutes');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);

  const handleGeneratePaper = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingPaper(true);
    setTimeout(() => {
      setIsGeneratingPaper(false);
      triggerConfetti();
      setGeneratedPaper(`========================================================================
             ST. JUDE INTERNATIONAL ACADEMY — STEM EXAMINATION
Subject: ${subject}
Chapter: ${syllabus}
Time Allowed: 90 Minutes                                Total Marks: ${totalMarks}
Difficulty Level: ${difficulty}
========================================================================

SECTION A: MULTIPLE CHOICE QUESTIONS (10 Marks — 1 Mark Each)
1. If the discriminant Δ = b² - 4ac is negative, the roots of the quadratic equation are:
   (A) Real and equal             (B) Real and unequal
   (C) Non-real complex roots      (D) Zero
   [Answer: C]

2. The maximum or minimum of y = ax² + bx + c occurs at x = :
   (A) -b / 2a                    (B) -b / a
   (C) c / a                      (D) b² / 4a
   [Answer: A]

SECTION B: SHORT ANSWER CONCEPTUAL QUESTIONS (20 Marks — 4 Marks Each)
3. Derive the quadratic formula x = [-b ± √(b² - 4ac)] / (2a) by completing the square for ax² + bx + c = 0.
4. If one root of 2x² - kx + 8 = 0 is three times the other, determine all possible real values of k.
5. Prove that the vertex of the parabola always lies on the axis of symmetry x = -b / (2a).

SECTION C: COMPREHENSIVE DERIVATION & OLYMPIAD APPLICATION (20 Marks — 10 Marks Each)
6. A projectile fired with initial velocity v₀ at angle θ follows path y = x·tan(θ) - (g·x²)/(2v₀²cos²θ).
   (a) Express horizontal range R by setting y = 0. (4 Marks)
   (b) Using calculus or discriminant analysis, prove maximum range occurs at θ = 45°. (6 Marks)

========================================================================
[CONFIDENTIAL TEACHER ANSWER KEY & RUBRIC ATTACHED]`);
    }, 1200);
  };

  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingPlan(true);
    setTimeout(() => {
      setIsGeneratingPlan(false);
      triggerConfetti();
      setGeneratedPlan(`========================================================================
                  5E PEDAGOGICAL LESSON PLAN
Subject: ${planSubject}
Topic: ${planTopic}
Target Class: Grade 10-A                               Duration: ${duration}
Teacher: Dr. Sarah Jenkins
========================================================================

1. LEARNING OBJECTIVES (Bloom's Taxonomy)
• Understand: Conceptualize composite functions as nested machines.
• Apply: Compute derivatives of functions f(g(x)) using d/dx[f(g(x))] = f'(g(x)) · g'(x).
• Analyze: Distinguish between the product rule and chain rule in mixed algebraic terms.

2. 5E INSTRUCTIONAL PHASES
[Phase 1: ENGAGE — 10 Mins]
• Hook: Show a conveyor belt speed ratio puzzle. How does acceleration multiply through gears?
• Diagnostic Question: "What is the derivative of (2x + 1)²? What about (2x + 1)¹⁰⁰?"

[Phase 2: EXPLORE — 15 Mins]
• Student Activity: Break into pairs with SmartLearn Notebooks. Expand (x² + 1)² and compare with power rule.

[Phase 3: EXPLAIN — 15 Mins]
• Formal Derivation: Proof of the Chain Rule using limit definitions Δu and Δx.
• Common Pitfall Warning: Failing to multiply by the internal derivative g'(x).

[Phase 4: ELABORATE — 10 Mins]
• Real-world STEM Modeling: Physics kinematics problem with displacement dependent on cosine angle.

[Phase 5: EVALUATE — 10 Mins]
• Exit Ticket: 3-question live SmartLearn adaptive quiz on tablets.

3. HOMEWORK ASSIGNMENT
• Complete Lesson 2.2 exercises in SmartLearn Course Library and log in to tomorrow's diagnostic drill.`);
    }, 1200);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Question Paper & Lesson Plan Generator
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Produce structured, ready-to-print examination papers and pedagogical 5E lesson plans in seconds.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('paper')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'paper' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-500'
            }`}
          >
            Exam Question Paper
          </button>
          <button
            onClick={() => setActiveTab('plan')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'plan' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-500'
            }`}
          >
            5E Lesson Plan
          </button>
        </div>
      </div>

      {activeTab === 'paper' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <form onSubmit={handleGeneratePaper} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <FileQuestion className="w-4 h-4 text-purple-600" />
              Question Paper Parameters
            </h3>

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

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Chapters / Syllabus</label>
              <input
                type="text"
                value={syllabus}
                onChange={(e) => setSyllabus(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Total Marks</label>
                <select
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <option>25 Marks (Diagnostic)</option>
                  <option>50 Marks (Midterm)</option>
                  <option>100 Marks (Final Exam)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Difficulty Distribution</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <option>Balanced (40% Med, 30% Hard, 30% Olympiad)</option>
                  <option>Foundational (60% Easy, 40% Med)</option>
                  <option>Olympiad Challenge (50% Hard, 50% Olympiad)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isGeneratingPaper}
              className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 mt-2"
            >
              <Sparkles className="w-4 h-4" />
              {isGeneratingPaper ? 'Generating Paper...' : 'Generate Structured Question Paper'}
            </button>
          </form>

          {/* Generated Paper Preview */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
                Output Examination Paper
              </h3>
              {generatedPaper && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(generatedPaper)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 text-xs flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 text-xs font-bold flex items-center gap-1 hover:bg-purple-100"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 bg-slate-950 text-slate-100 rounded-2xl p-4 font-mono text-[11px] overflow-y-auto max-h-[420px] whitespace-pre-wrap leading-relaxed shadow-inner">
              {generatedPaper ||
                'Fill out the parameters on the left and click "Generate Structured Question Paper" to synthesize an exam paper with marking rubrics.'}
            </div>
          </div>
        </div>
      ) : (
        /* LESSON PLAN VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form onSubmit={handleGeneratePlan} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-600" />
              Lesson Plan Parameters
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
              <select
                value={planSubject}
                onChange={(e) => setPlanSubject(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option>Mathematics</option>
                <option>Physics</option>
                <option>Chemistry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Lesson Topic</label>
              <input
                type="text"
                value={planTopic}
                onChange={(e) => setPlanTopic(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Class Period Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option>45 Minutes</option>
                <option>60 Minutes</option>
                <option>90 Minutes (Block Period)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isGeneratingPlan}
              className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 mt-2"
            >
              <Sparkles className="w-4 h-4" />
              {isGeneratingPlan ? 'Synthesizing Plan...' : 'Generate 5E Lesson Plan'}
            </button>
          </form>

          {/* Generated Plan Preview */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
                5E Pedagogical Plan Preview
              </h3>
              {generatedPlan && (
                <button
                  onClick={() => window.print()}
                  className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 text-xs font-bold flex items-center gap-1 hover:bg-purple-100"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Lesson Plan
                </button>
              )}
            </div>

            <div className="flex-1 bg-slate-950 text-slate-100 rounded-2xl p-4 font-mono text-[11px] overflow-y-auto max-h-[420px] whitespace-pre-wrap leading-relaxed shadow-inner">
              {generatedPlan ||
                'Configure your lesson topic on the left and click "Generate 5E Lesson Plan" to receive an instructional plan with Engage, Explore, Explain, Elaborate, and Evaluate steps.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
