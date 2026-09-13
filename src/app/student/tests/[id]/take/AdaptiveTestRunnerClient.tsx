'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Zap,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  Award,
  RotateCcw,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  CalendarPlus,
  Layers,
  Bot,
  LogOut,
  HelpCircle as QuestionIcon,
} from 'lucide-react';
import { db } from '@/lib/db';
import { useStore } from '@/store/useStore';
import { Question, TestSubmission } from '@/types';
import { useToast } from '@/components/shared/ToastContext';

export default function AdaptiveTestRunnerClient() {
  const params = useParams();
  const router = useRouter();
  const testId = params?.id as string;
  const test = db.getTestById(testId) || db.tests[0];
  const currentUser = useStore((state) => state.currentUser);
  const addXP = useStore((state) => state.addXP);
  const triggerConfetti = useStore((state) => state.triggerConfetti);
  const toast = useToast();

  // Test Lifecycle States
  const [testStarted, setTestStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<TestSubmission | null>(null);

  // Question & Navigation State
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>(test.questions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [currentDifficulty, setCurrentDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Olympiad'>('Medium');
  const [correctStreak, setCorrectStreak] = useState(0);

  // Timer: test.durationMinutes in seconds
  const [secondsRemaining, setSecondsRemaining] = useState(test.durationMinutes * 60);

  // Anti-cheating state
  const [tabSwitches, setTabSwitches] = useState(0);
  const [showTabSwitchWarning, setShowTabSwitchWarning] = useState(false);

  // Modals
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  // 1. Countdown Timer (Only runs once testStarted = true)
  useEffect(() => {
    if (!testStarted || isSubmitted || secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          executeSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [testStarted, isSubmitted, secondsRemaining]);

  // 2. HTML5 Page Visibility API Listener
  useEffect(() => {
    if (!testStarted || isSubmitted) return;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches((prev) => prev + 1);
        setShowTabSwitchWarning(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [testStarted, isSubmitted]);

  // 3. Option Selection with Adaptive Difficulty adjustment
  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestionIndex]: optionIndex }));

    const question = currentQuestions[currentQuestionIndex];
    const isCorrect = optionIndex === question.correctAnswerIndex;

    if (isCorrect) {
      const nextStreak = correctStreak + 1;
      setCorrectStreak(nextStreak);
      if (nextStreak >= 2) {
        if (currentDifficulty === 'Easy') setCurrentDifficulty('Medium');
        else if (currentDifficulty === 'Medium') setCurrentDifficulty('Hard');
        else if (currentDifficulty === 'Hard') setCurrentDifficulty('Olympiad');
      }
    } else {
      setCorrectStreak(0);
      if (currentDifficulty === 'Olympiad') setCurrentDifficulty('Hard');
      else if (currentDifficulty === 'Hard') setCurrentDifficulty('Medium');
      else if (currentDifficulty === 'Medium') setCurrentDifficulty('Easy');
    }
  };

  const toggleMarkForReview = (index: number) => {
    setMarkedForReview((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // 4. Submission Logic
  const executeSubmit = useCallback(() => {
    if (isSubmitted) return;

    let score = 0;
    let easyCorrect = 0;
    let mediumCorrect = 0;
    let hardCorrect = 0;
    let conceptualErrors = 0;
    let carelessErrors = 0;

    const weakTopicsList: string[] = [];

    currentQuestions.forEach((q, idx) => {
      const selected = selectedAnswers[idx];
      if (selected === q.correctAnswerIndex) {
        score += 10;
        if (q.difficulty === 'Easy') easyCorrect++;
        else if (q.difficulty === 'Medium') mediumCorrect++;
        else hardCorrect++;
      } else {
        weakTopicsList.push(q.topic);
        if (selected !== undefined) {
          if (q.difficulty === 'Hard' || q.difficulty === 'Olympiad') {
            conceptualErrors++;
          } else {
            carelessErrors++;
          }
        } else {
          conceptualErrors++;
        }
      }
    });

    const maxScore = currentQuestions.length * 10;
    const percentage = Math.round((score / maxScore) * 100);

    const submission: TestSubmission = {
      id: `sub-${Date.now()}`,
      testId: test.id,
      testTitle: test.title,
      studentId: currentUser?.id || 'user-student-alex',
      score,
      maxScore,
      percentage,
      completedAt: new Date().toISOString(),
      timeTakenSeconds: test.durationMinutes * 60 - secondsRemaining,
      difficultyBreakdown: { easyCorrect, mediumCorrect, hardCorrect },
      conceptualErrors,
      timeManagementErrors: secondsRemaining < 60 ? 1 : 0,
      carelessErrors,
      tabSwitchesDetected: tabSwitches,
      topicScores: currentQuestions.map((q) => ({
        topic: q.topic,
        score: selectedAnswers[currentQuestions.indexOf(q)] === q.correctAnswerIndex ? 10 : 0,
        maxScore: 10,
      })),
    };

    db.addSubmission(submission);
    setSubmissionResult(submission);
    setIsSubmitted(true);
    setShowSubmitModal(false);
    triggerConfetti();
    addXP(Math.round(score * 2.5), `Completed: ${test.title}`);

    // Persist learning loop weak topics in localStorage
    if (typeof window !== 'undefined' && weakTopicsList.length > 0) {
      try {
        const existing = JSON.parse(localStorage.getItem('smartlearn_weak_topics') || '[]');
        const updated = Array.from(new Set([...existing, ...weakTopicsList]));
        localStorage.setItem('smartlearn_weak_topics', JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
  }, [
    isSubmitted,
    currentQuestions,
    selectedAnswers,
    test,
    currentUser,
    secondsRemaining,
    tabSwitches,
    triggerConfetti,
    addXP,
  ]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const activeQ = currentQuestions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const unansweredCount = currentQuestions.length - answeredCount;
  const markedCount = Object.values(markedForReview).filter(Boolean).length;

  // Learning Loop Action Handlers
  const handleAddToPlanner = (topics: string[]) => {
    if (typeof window !== 'undefined') {
      try {
        const existing = JSON.parse(localStorage.getItem('smartlearn_planner_tasks') || '[]');
        const newTasks = topics.map((t) => ({
          id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          title: `Diagnostic Review: ${t}`,
          subject: test.subject,
          duration: 30,
          completed: false,
          date: new Date().toISOString().split('T')[0],
          priority: 'High',
        }));
        localStorage.setItem('smartlearn_planner_tasks', JSON.stringify([...existing, ...newTasks]));
        toast.success(
          'Study Plan Updated',
          `Added ${topics.length} targeted revision sessions for ${topics.join(', ')}.`
        );
      } catch {
        toast.error('Error', 'Unable to update study plan.');
      }
    }
  };

  const handleGenerateFlashcards = (topics: string[]) => {
    if (typeof window !== 'undefined') {
      try {
        const existingDecks = JSON.parse(localStorage.getItem('smartlearn_custom_decks') || '[]');
        const newDeck = {
          id: `deck-${Date.now()}`,
          title: `${test.subject}: ${topics[0]} Mastery`,
          subject: test.subject,
          cardCount: topics.length * 3,
          dueCount: topics.length * 3,
          createdDate: 'Just now',
          cards: topics.flatMap((t, idx) => [
            { id: `c-${idx}-1`, question: `Key conceptual definition for ${t}?`, answer: `Standard formula and derivation steps relevant to ${t}.` },
            { id: `c-${idx}-2`, question: `Common diagnostic pitfall in ${t}?`, answer: `Watch out for boundary conditions and unit cancellations.` },
          ]),
        };
        localStorage.setItem('smartlearn_custom_decks', JSON.stringify([...existingDecks, newDeck]));
        toast.success(
          'Flashcards Created',
          `Generated a spaced repetition deck for ${topics.join(', ')} in AI Revision.`
        );
      } catch {
        toast.error('Error', 'Unable to create flashcard deck.');
      }
    }
  };

  // =========================================================================
  // 1. PRE-TEST INSTRUCTIONS VIEW
  // =========================================================================
  if (!testStarted && !isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 py-6 animate-in fade-in duration-200">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-xs">
              {test.subject} · {test.grade}
            </span>
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {test.durationMinutes} Minutes
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {test.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              This diagnostic assessment uses machine learning to adapt question difficulty in real time based on your accuracy streak.
            </p>
          </div>

          {/* Test Meta Info Badges */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-medium block">Total Questions</span>
              <span className="text-base font-black text-slate-900 dark:text-white">
                {currentQuestions.length}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-medium block">Maximum Marks</span>
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                {test.totalMarks}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-medium block">Anti-Cheat Mode</span>
              <span className="text-base font-black text-rose-500">Active</span>
            </div>
          </div>

          {/* Important Rules List */}
          <div className="space-y-2.5 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-900 dark:text-amber-300">
            <h4 className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Diagnostic Test Instructions &amp; Integrity Guidelines:
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-[11px] opacity-90">
              <li>The timer begins automatically the moment you click <strong>Start Assessment</strong>.</li>
              <li>Page Visibility monitoring is enabled: leaving this browser tab logs an integrity flag.</li>
              <li>You can mark questions for review and jump to any question using the navigation palette.</li>
              <li>No negative marking is applied; try your best on every question.</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <Link
              href="/student/tests/"
              prefetch={true}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-center transition-colors"
            >
              Cancel &amp; Return
            </Link>

            <button
              onClick={() => setTestStarted(true)}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Start Assessment Now</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. SUBMITTED SCORE REPORT VIEW (With Learning Loop Integrations)
  // =========================================================================
  if (isSubmitted && submissionResult) {
    const weakTopics = submissionResult.topicScores
      .filter((ts) => ts.score < ts.maxScore)
      .map((ts) => ts.topic);

    return (
      <div className="max-w-3xl mx-auto space-y-6 py-6 animate-in zoom-in-95 duration-200">
        <div className="text-center p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-3xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center text-3xl mb-4">
            🏆
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            Test Submitted Successfully
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-2 mb-1">
            {submissionResult.percentage}% Score
          </h1>
          <p className="text-xs text-slate-500">
            {submissionResult.score} / {submissionResult.maxScore} marks · Time Taken:{' '}
            {Math.round(submissionResult.timeTakenSeconds / 60)} mins
          </p>

          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs mt-3">
            <Sparkles className="w-4 h-4" />
            <span>+{submissionResult.score * 2} XP Added to Profile!</span>
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 text-left">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">Adaptive Correct</span>
              <span className="font-bold text-slate-900 dark:text-white text-xs">
                {submissionResult.difficultyBreakdown.hardCorrect} Hard /{' '}
                {submissionResult.difficultyBreakdown.mediumCorrect} Med
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">Conceptual Gaps</span>
              <span className="font-bold text-amber-500 text-xs">
                {submissionResult.conceptualErrors} to review
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">Careless Errors</span>
              <span className="font-bold text-blue-500 text-xs">
                {submissionResult.carelessErrors} detected
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">Tab Switches</span>
              <span
                className={`font-bold text-xs ${
                  submissionResult.tabSwitchesDetected > 0 ? 'text-rose-500' : 'text-emerald-500'
                }`}
              >
                {submissionResult.tabSwitchesDetected} (Integrity Log)
              </span>
            </div>
          </div>

          {/* LEARNING LOOP: Automated Remediation Hub */}
          {weakTopics.length > 0 && (
            <div className="mt-8 p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-left space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    AI Remediation &amp; Adaptive Learning Loop
                  </h3>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    We detected knowledge gaps in:{' '}
                    <strong>{weakTopics.join(', ')}</strong>.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {/* Action 1: Add to Planner */}
                <button
                  onClick={() => handleAddToPlanner(weakTopics)}
                  className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800/80 hover:border-blue-500 transition-all text-left space-y-1 shadow-xs cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                    <CalendarPlus className="w-4 h-4" />
                    <span>Add to Study Planner</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Schedule 30-min targeted study blocks on your calendar.
                  </p>
                </button>

                {/* Action 2: Generate Flashcards */}
                <button
                  onClick={() => handleGenerateFlashcards(weakTopics)}
                  className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800/80 hover:border-blue-500 transition-all text-left space-y-1 shadow-xs cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400">
                    <Layers className="w-4 h-4" />
                    <span>Create Flashcard Deck</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Master key formulas using active recall &amp; spaced repetition.
                  </p>
                </button>

                {/* Action 3: Ask AI Tutor */}
                <Link
                  href={`/student/tutor/?topic=${encodeURIComponent(weakTopics[0])}`}
                  prefetch={true}
                  className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800/80 hover:border-blue-500 transition-all text-left space-y-1 shadow-xs block group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <Bot className="w-4 h-4" />
                    <span>Ask AI Tutor</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Get step-by-step Socratic walkthroughs for {weakTopics[0]}.
                  </p>
                </Link>
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setTestStarted(false);
                setSecondsRemaining(test.durationMinutes * 60);
                setSelectedAnswers({});
                setMarkedForReview({});
                setCurrentQuestionIndex(0);
              }}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Diagnostic
            </button>
            <Link
              href="/student/tests/"
              prefetch={true}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              Back to Tests Hub
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Detailed Question Review */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Detailed Question &amp; Answer Review
          </h3>
          {currentQuestions.map((q, idx) => {
            const chosen = selectedAnswers[idx];
            const isCorrect = chosen === q.correctAnswerIndex;
            return (
              <div
                key={q.id}
                className={`p-5 rounded-3xl border bg-white dark:bg-slate-900 ${
                  isCorrect ? 'border-emerald-500/40' : 'border-rose-500/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-400">
                    Question {idx + 1} ({q.difficulty}) · {q.topic}
                  </span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-md ${
                      isCorrect
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                    }`}
                  >
                    {isCorrect ? 'Correct (+10 marks)' : chosen === undefined ? 'Unanswered (0 marks)' : 'Incorrect (0 marks)'}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 mb-3">
                  {q.text}
                </p>

                <div className="space-y-1.5 mb-3">
                  {q.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className={`p-2.5 rounded-xl text-xs flex items-center justify-between ${
                        oIdx === q.correctAnswerIndex
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800'
                          : oIdx === chosen
                          ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 font-bold border border-rose-300 dark:border-rose-800'
                          : 'bg-slate-50 dark:bg-slate-800/40 text-slate-500'
                      }`}
                    >
                      <span>{opt}</span>
                      {oIdx === q.correctAnswerIndex && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      )}
                      {oIdx === chosen && oIdx !== q.correctAnswerIndex && (
                        <XCircle className="w-3.5 h-3.5 text-rose-500" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-300">
                  <span className="font-bold block mb-0.5">Explanation:</span>
                  {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. ACTIVE TEST RUNNER VIEW
  // =========================================================================
  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-in fade-in duration-200">
      {/* Tab Switch Alert Banner */}
      {showTabSwitchWarning && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500 text-rose-600 dark:text-rose-400 flex items-center justify-between text-xs animate-bounce-subtle">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <span>
              <strong>Warning:</strong> Page Visibility change detected! Tab switch count:{' '}
              <strong>{tabSwitches}</strong>. Please stay focused on the exam.
            </span>
          </div>
          <button
            onClick={() => setShowTabSwitchWarning(false)}
            className="px-2 py-1 bg-rose-600 text-white rounded-lg font-bold text-[10px] cursor-pointer"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Top Bar: Title, Dynamic Difficulty, Countdown Timer, Exit, Submit */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate max-w-md">
            {test.title}
          </h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-400">
              Question {currentQuestionIndex + 1} of {currentQuestions.length}
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            {/* Dynamic Adaptive Difficulty Pill */}
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <Zap className="w-3 h-3 fill-purple-500" />
              Adaptive: {currentDifficulty}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Live Countdown Timer */}
          <div
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-xs shadow-inner ${
              secondsRemaining < 180
                ? 'bg-rose-500/10 border-rose-500 text-rose-500 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>

          <button
            onClick={() => setShowExitModal(true)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-rose-600 hover:border-rose-300 transition-colors flex items-center gap-1 cursor-pointer"
            title="Quit Assessment"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit</span>
          </button>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Topic: {activeQ.topic}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleMarkForReview(currentQuestionIndex)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                markedForReview[currentQuestionIndex]
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-amber-600'
              }`}
            >
              {markedForReview[currentQuestionIndex] ? (
                <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" />
              ) : (
                <Bookmark className="w-3.5 h-3.5" />
              )}
              <span>{markedForReview[currentQuestionIndex] ? 'Marked for Review' : 'Mark for Review'}</span>
            </button>
            <span className="font-semibold text-slate-400">Marks: +10 / -0</span>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
          {activeQ.text}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {activeQ.options.map((option, oIdx) => {
            const isSelected = selectedAnswers[currentQuestionIndex] === oIdx;
            return (
              <button
                key={oIdx}
                onClick={() => handleSelectOption(oIdx)}
                className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 shadow-xs font-bold'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                  <span>{option}</span>
                </div>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
              </button>
            );
          })}
        </div>

        {/* Navigation & Question Palette Controls */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-30 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Previous
            </button>

            {currentQuestionIndex < currentQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                Next
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                Review &amp; Submit
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Question Palette Row */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {currentQuestions.map((_, i) => {
              const isCurrent = currentQuestionIndex === i;
              const isAnswered = selectedAnswers[i] !== undefined;
              const isMarked = markedForReview[i];

              return (
                <button
                  key={i}
                  onClick={() => setCurrentQuestionIndex(i)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold relative transition-all cursor-pointer ${
                    isCurrent
                      ? 'ring-2 ring-blue-600 bg-blue-600 text-white shadow-md'
                      : isMarked
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300'
                      : isAnswered
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200'
                  }`}
                  title={`Question ${i + 1}: ${
                    isMarked ? 'Marked for review' : isAnswered ? 'Answered' : 'Unanswered'
                  }`}
                >
                  {i + 1}
                  {isMarked && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 border border-white dark:border-slate-900" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Palette Legend */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-400 inline-block" />
            Answered ({answeredCount})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-amber-100 dark:bg-amber-950/60 border border-amber-400 inline-block" />
            Marked for Review ({markedCount})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 inline-block" />
            Unanswered ({unansweredCount})
          </span>
        </div>
      </div>

      {/* SUBMIT CONFIRMATION MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Submit Test?</h3>
                <p className="text-xs text-slate-500">Review your status before final grading.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Answered Questions:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{answeredCount} of {currentQuestions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Unanswered Questions:</span>
                <span className={`font-bold ${unansweredCount > 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                  {unansweredCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Marked for Review:</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{markedCount}</span>
              </div>
            </div>

            {unansweredCount > 0 && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800/50">
                ⚠️ You still have {unansweredCount} unanswered questions. Unanswered questions will receive 0 marks.
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Keep Reviewing
              </button>
              <button
                onClick={executeSubmit}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Confirm &amp; Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEAVE / EXIT CONFIRMATION MODAL */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Exit Without Submitting?</h3>
                <p className="text-xs text-slate-500">Your test progress will not be graded.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Are you sure you want to exit? Any answered questions in this session will be lost and your score will not be recorded on the leaderboard.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowExitModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Stay in Test
              </button>
              <button
                onClick={() => router.push('/student/tests/')}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Yes, Quit Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
