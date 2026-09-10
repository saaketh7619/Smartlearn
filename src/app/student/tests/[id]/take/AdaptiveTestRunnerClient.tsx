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
} from 'lucide-react';
import { db } from '@/lib/db';
import { useStore } from '@/store/useStore';
import { Question, TestSubmission } from '@/types';

export default function AdaptiveTestRunnerClient() {
  const params = useParams();
  const router = useRouter();
  const testId = params?.id as string;
  const test = db.getTestById(testId) || db.tests[0];
  const currentUser = useStore((state) => state.currentUser);
  const addXP = useStore((state) => state.addXP);
  const triggerConfetti = useStore((state) => state.triggerConfetti);

  // Active Questions State (can dynamically append/replace based on difficulty)
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>(test.questions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [currentDifficulty, setCurrentDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Olympiad'>('Medium');
  const [correctStreak, setCorrectStreak] = useState(0);

  // Timer: 20 minutes (1200 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState(test.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<TestSubmission | null>(null);

  // Tab switch anti-cheating state (using Page Visibility API)
  const [tabSwitches, setTabSwitches] = useState(0);
  const [showTabSwitchWarning, setShowTabSwitchWarning] = useState(false);

  // 1. Countdown Timer
  useEffect(() => {
    if (isSubmitted || secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted, secondsRemaining]);

  // 2. Real HTML5 Page Visibility API Listener
  useEffect(() => {
    if (isSubmitted) return;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches((prev) => prev + 1);
        setShowTabSwitchWarning(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isSubmitted]);

  // 3. Adaptive Difficulty Adjuster
  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestionIndex]: optionIndex }));

    // Evaluate live for adaptive difficulty scaling
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

  const handleSubmitTest = useCallback(() => {
    if (isSubmitted) return;

    let score = 0;
    let easyCorrect = 0;
    let mediumCorrect = 0;
    let hardCorrect = 0;
    let conceptualErrors = 0;
    let carelessErrors = 0;

    currentQuestions.forEach((q, idx) => {
      const selected = selectedAnswers[idx];
      if (selected === q.correctAnswerIndex) {
        score += 10;
        if (q.difficulty === 'Easy') easyCorrect++;
        else if (q.difficulty === 'Medium') mediumCorrect++;
        else hardCorrect++;
      } else if (selected !== undefined) {
        if (q.difficulty === 'Hard' || q.difficulty === 'Olympiad') {
          conceptualErrors++;
        } else {
          carelessErrors++;
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
    triggerConfetti();
    addXP(Math.round(score * 2.5), `Completed: ${test.title}`);
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

  // SUBMITTED SCORE REPORT VIEW
  if (isSubmitted && submissionResult) {
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
            {submissionResult.score} / {submissionResult.maxScore} marks · Time Taken: {Math.round(submissionResult.timeTakenSeconds / 60)} mins
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
                {submissionResult.difficultyBreakdown.hardCorrect} Hard / {submissionResult.difficultyBreakdown.mediumCorrect} Med
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
              <span className={`font-bold text-xs ${submissionResult.tabSwitchesDetected > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                {submissionResult.tabSwitchesDetected} (Integrity Log)
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setSecondsRemaining(test.durationMinutes * 60);
                setSelectedAnswers({});
                setCurrentQuestionIndex(0);
              }}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Diagnostic
            </button>
            <Link
              href="/student/tests"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              Back to Tests Hub
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Question by Question Review */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Detailed Answer Review</h3>
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
                  <span className="font-bold text-slate-400">Question {idx + 1} ({q.difficulty})</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-md ${
                      isCorrect
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                    }`}
                  >
                    {isCorrect ? 'Correct (+10 marks)' : 'Incorrect (0 marks)'}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 mb-3">{q.text}</p>

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
                      {oIdx === q.correctAnswerIndex && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                      {oIdx === chosen && oIdx !== q.correctAnswerIndex && <XCircle className="w-3.5 h-3.5 text-rose-500" />}
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

  // ACTIVE TEST RUNNER VIEW
  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-in fade-in duration-200">
      {/* Tab Switch Alert Banner */}
      {showTabSwitchWarning && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500 text-rose-600 dark:text-rose-400 flex items-center justify-between text-xs animate-bounce-subtle">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <span>
              <strong>Warning:</strong> Page Visibility change detected! Tab switch count: <strong>{tabSwitches}</strong>.
              Please stay focused on the exam.
            </span>
          </div>
          <button
            onClick={() => setShowTabSwitchWarning(false)}
            className="px-2 py-1 bg-rose-600 text-white rounded-lg font-bold text-[10px]"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Top Runner Bar: Title, Dynamic Difficulty, Countdown Timer */}
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
              Adaptive Tier: {currentDifficulty}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Countdown Timer */}
          <div
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl border font-mono font-bold text-sm shadow-inner ${
              secondsRemaining < 180
                ? 'bg-rose-500/10 border-rose-500 text-rose-500 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>

          <button
            onClick={handleSubmitTest}
            className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md"
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
          <span className="font-semibold">Marks: +10 / -0</span>
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
                className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
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

        {/* Navigation & Question Palette */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-30 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Previous
          </button>

          {/* Mini Palette dots */}
          <div className="hidden sm:flex items-center gap-1.5">
            {currentQuestions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQuestionIndex(i)}
                className={`w-7 h-7 rounded-xl text-xs font-bold transition-all ${
                  currentQuestionIndex === i
                    ? 'ring-2 ring-blue-600 bg-blue-600 text-white'
                    : selectedAnswers[i] !== undefined
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {currentQuestionIndex < currentQuestions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            >
              Next Question
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmitTest}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            >
              Submit & Review
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
