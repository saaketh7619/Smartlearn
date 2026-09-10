'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  BrainCircuit,
  Send,
  Mic,
  Image as ImageIcon,
  Sparkles,
  Bot,
  User as UserIcon,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  RotateCcw,
  WifiOff,
  RefreshCw,
  AlertTriangle,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import Link from 'next/link';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  steps?: string[];
  equation?: string;
  timestamp: string;
}

// ─── Heuristic AI Response Engine ──────────────────────────────────────────
function generateAIResponse(query: string): { text: string; steps?: string[]; equation?: string } {
  const lower = query.toLowerCase();

  if (lower.includes('quadratic') || lower.includes('2x^2') || lower.includes('2x²')) {
    return {
      text: 'Great problem! Let me solve 2x² - 7x + 3 = 0 step-by-step using both factorization and the quadratic formula:',
      equation: 'x = [-b ± √(b² - 4ac)] / (2a)',
      steps: [
        'Identify coefficients: a = 2, b = -7, c = 3.',
        'Calculate discriminant Δ = b² - 4ac: (-7)² - 4(2)(3) = 49 - 24 = 25.',
        'Since Δ = 25 is a perfect square, roots are real and rational.',
        'Substitute into formula: x = [7 ± √25] / 4 = [7 ± 5] / 4.',
        'Root 1: x = (7 + 5) / 4 = 12 / 4 = 3.',
        'Root 2: x = (7 - 5) / 4 = 2 / 4 = 1/2.',
        'Final Answer: x = 3 and x = 0.5. Both satisfy the equation!',
      ],
    };
  } else if (lower.includes('chain rule')) {
    return {
      text: 'The Chain Rule is used whenever you have a composite function f(g(x)) — a function nested inside another:',
      equation: "d/dx [f(g(x))] = f'(g(x)) · g'(x)",
      steps: [
        'Intuition: Think of nested Russian dolls. To reach the inner doll, you open the outer one first.',
        'Step 1: Differentiate the exterior function f, leaving the interior g(x) intact.',
        'Step 2: Multiply by the derivative of the interior function g\'(x).',
        'Example: For y = (3x² + 5)⁴, let outer = u⁴ and inner = u = 3x² + 5.',
        'dy/dx = 4(3x² + 5)³ · (6x) = 24x(3x² + 5)³.',
      ],
    };
  } else if (lower.includes('projectile') || lower.includes('parabolic')) {
    return {
      text: 'A projectile follows a parabolic path because horizontal and vertical motion are completely independent:',
      equation: 'y(x) = x·tan(θ) - [g·x²] / [2·v₀²·cos²(θ)]',
      steps: [
        'Horizontal: constant velocity (a_x = 0) → x(t) = v₀·cos(θ)·t.',
        'Vertical: gravitational acceleration (a_y = -g) → y(t) = v₀·sin(θ)·t - 0.5·g·t².',
        'Eliminate time: t = x / (v₀·cos(θ)) and substitute into y(t).',
        'Result is a quadratic in x with negative leading coefficient → downward parabola.',
        'Range = v₀²·sin(2θ)/g is maximized at θ = 45°.',
      ],
    };
  } else if (lower.includes('newton') || lower.includes('third law') || lower.includes('action-reaction')) {
    return {
      text: "Newton's Third Law: Every action force has an equal and opposite reaction force, acting on different objects:",
      equation: 'F₁₂ = -F₂₁  (equal magnitude, opposite direction)',
      steps: [
        'Action: Earth pulls you down with gravitational force mg.',
        'Reaction: You pull Earth upward with exactly the same force mg.',
        'Key: The forces act on DIFFERENT objects — they never cancel each other.',
        'Example: Rocket expels gas downward (action) → gas pushes rocket upward (reaction).',
        'Misconception: These forces cannot cancel because they act on different systems.',
      ],
    };
  } else if (lower.includes('derivative') || lower.includes('differentiation') || lower.includes('d/dx')) {
    return {
      text: "Differentiation gives the instantaneous rate of change of a function:",
      equation: "f'(x) = lim(h→0) [f(x+h) - f(x)] / h",
      steps: [
        'Power Rule: d/dx[xⁿ] = n·xⁿ⁻¹ — the most used derivative rule.',
        'Product Rule: d/dx[u·v] = u\'·v + u·v\'.',
        "Quotient Rule: d/dx[u/v] = (u'v - uv') / v².",
        "Chain Rule for composites: d/dx[f(g(x))] = f'(g(x))·g'(x).",
        'Geometric meaning: derivative = slope of the tangent line at that point.',
      ],
    };
  } else if (lower.includes('quicksort') || lower.includes('sorting') || lower.includes('o(n log n)')) {
    return {
      text: 'QuickSort achieves O(n log n) average time through divide-and-conquer partitioning:',
      equation: 'T(n) = 2T(n/2) + O(n)  →  O(n log n) by Master Theorem',
      steps: [
        'Step 1: Choose a pivot element (commonly last, first, or median).',
        'Step 2: Partition array — all elements < pivot move left, > pivot move right.',
        'Step 3: Recursively apply QuickSort to left and right sub-arrays.',
        'Average: log n levels of recursion × O(n) partitioning work = O(n log n).',
        'Worst case: O(n²) when pivot is always min/max (use randomized pivot to avoid).',
      ],
    };
  } else {
    return {
      text: `Here is a structured breakdown for "${query}":`,
      steps: [
        'Core Principle: Break complex problems into foundational first principles.',
        'Step 1: Identify given variables, constraints, and target quantity.',
        'Step 2: Apply the governing physical law or mathematical theorem.',
        'Step 3: Solve algebraically, verify units and dimensional consistency.',
        'Step 4: Sanity-check with limiting cases (e.g., does the answer make sense at extreme values?).',
        'Pro Tip: Practice related problems in the Tests section for adaptive drilling on this topic!',
      ],
    };
  }
}

// ─── Typing Indicator ───────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
        <Bot className="w-4 h-4" />
      </div>
      <div className="flex items-center gap-1.5 px-4 py-3 rounded-3xl rounded-tl-none bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Empty / Welcome State ─────────────────────────────────────────────────
function EmptyState({ onChipClick }: { onChipClick: (q: string) => void }) {
  const chips = [
    { label: 'Solve quadratic: 2x² - 7x + 3 = 0', icon: '📐' },
    { label: 'Explain the Chain Rule with an analogy', icon: '🔗' },
    { label: "Why does a projectile follow a parabolic path?", icon: '🚀' },
    { label: 'How does QuickSort achieve O(n log n)?', icon: '💻' },
    { label: 'Explain Newton\'s Third Law with examples', icon: '⚡' },
    { label: 'What is the derivative of f(x) = 3x⁴ - 5x² + 7?', icon: '∫' },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
        <BrainCircuit className="w-8 h-8" />
      </div>
      <div>
        <h2 className="font-extrabold text-base text-slate-900 dark:text-white">SmartLearn AI Doubt Tutor</h2>
        <p className="text-xs text-slate-500 mt-1">Supports Math, Physics, Chemistry &amp; Computer Science</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full">
        {chips.map((c) => (
          <button
            key={c.label}
            onClick={() => onChipClick(c.label)}
            className="text-left p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs hover:border-blue-400 hover:shadow-sm transition-all"
          >
            <span className="mr-1.5">{c.icon}</span>{c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Tutor Component ──────────────────────────────────────────────────
function DoubtTutorContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const currentUser = useStore((state) => state.currentUser);
  const addXP = useStore((state) => state.addXP);

  const [input, setInput] = useState(initialQuery);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-send initialQuery from search params (e.g., from weak topic in test results)
  useEffect(() => {
    if (initialQuery.trim()) {
      handleSend(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cancelCurrentRequest = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsTyping(false);
    setTimedOut(false);
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend ?? input;
    if (!query.trim() && !imagePreview) return;

    setTimedOut(false);
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: imagePreview ? `[Attached Handwritten Diagram] ${query}` : query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setImagePreview(null);
    setIsTyping(true);

    // 8-second timeout guard
    const tid = setTimeout(() => {
      setIsTyping(false);
      setTimedOut(true);
    }, 8000);
    setTimeoutId(tid);

    // Simulate AI response (~0.9s)
    const responseDelay = setTimeout(() => {
      clearTimeout(tid);
      setTimedOut(false);

      const response = generateAIResponse(query);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        equation: response.equation,
        steps: response.steps,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      addXP(20, 'Asked AI Tutor');
    }, 900);

    return () => {
      clearTimeout(responseDelay);
      clearTimeout(tid);
    };
  };

  const handleRetry = () => {
    setTimedOut(false);
    const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user');
    if (lastUserMsg) handleSend(lastUserMsg.text);
  };

  const handleSimulateVoice = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setInput("Explain Newton's Third Law and action-reaction pairs.");
      inputRef.current?.focus();
    }, 2000);
  };

  const handleImageAttach = () => {
    setImagePreview('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YxZjVmOSIvPjx0ZXh0IHg9IjEwMCIgeT0iNTUiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2NDc0OGIiPlNhbXBsZSBIYW5kd3JpdHRlbiBEaWFncmFtPC90ZXh0Pjwvc3ZnPg==');
    setInput('Solve problem #4 from my notebook diagram');
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const userName = currentUser?.name?.split(' ')[0] ?? 'there';
  const isEmpty = messages.length === 0;

  return (
    <div
      className="h-[calc(100vh-8rem)] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in duration-200"
      role="main"
      aria-label="AI Doubt Tutor"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm text-slate-900 dark:text-white">SmartLearn AI Doubt Tutor</h1>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                Step-by-Step AI
              </span>
              {isOffline && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-bold flex items-center gap-1">
                  <WifiOff className="w-2.5 h-2.5" /> Offline Mode
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">Supports Math, Physics, Chemistry &amp; Computer Science</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isEmpty && (
            <button
              onClick={() => setMessages([])}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Clear Chat History"
              aria-label="Clear chat history"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4" role="log" aria-live="polite" aria-label="Chat messages">
        {isEmpty && !isTyping ? (
          <EmptyState onChipClick={(q) => { setInput(q); handleSend(q); }} />
        ) : (
          <>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white ${
                    m.sender === 'user' ? 'bg-indigo-600' : 'bg-blue-600'
                  }`}
                  aria-hidden="true"
                >
                  {m.sender === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 text-xs shadow-xs ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>

                  {m.equation && (
                    <div className="my-3 p-3 rounded-2xl bg-black/80 text-emerald-400 font-mono text-center text-xs tracking-wide shadow-inner border border-emerald-500/20">
                      {m.equation}
                    </div>
                  )}

                  {m.steps && m.steps.length > 0 && (
                    <div className="mt-3 space-y-2 border-t border-slate-200 dark:border-slate-700/80 pt-3">
                      <span className="font-bold text-[11px] text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                        Step-by-Step Derivation
                      </span>
                      <ol className="space-y-1.5 pl-1">
                        {m.steps.map((st, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-2 leading-relaxed">
                            <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                              {sIdx + 1}
                            </span>
                            <span>{st}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2 pt-1 text-[10px] text-slate-400">
                    <span>{m.timestamp}</span>
                    {m.sender === 'ai' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyText(m.id, [m.text, m.equation, ...(m.steps ?? [])].filter(Boolean).join('\n'))}
                          className="hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
                          aria-label="Copy response"
                        >
                          {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                        <button className="hover:text-emerald-500 transition-colors" aria-label="Helpful"><ThumbsUp className="w-3 h-3" /></button>
                        <button className="hover:text-rose-500 transition-colors" aria-label="Not helpful"><ThumbsDown className="w-3 h-3" /></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && <TypingIndicator />}

            {/* Timeout state */}
            {timedOut && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <div className="max-w-sm p-4 rounded-3xl rounded-tl-none bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs">
                  <p className="font-bold text-amber-700 dark:text-amber-400 mb-1">AI Tutor is taking longer than expected</p>
                  <p className="text-amber-600 dark:text-amber-500">This may be a temporary delay. Click retry for an instant offline explanation.</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleRetry}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" /> Retry
                    </button>
                    <button
                      onClick={cancelCurrentRequest}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="px-4 pb-2 flex-shrink-0">
          <div className="relative inline-block">
            <img src={imagePreview} alt="Attached diagram" className="h-16 rounded-lg border border-slate-200 dark:border-slate-700 object-cover" />
            <button
              onClick={() => setImagePreview(null)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-700 text-white text-xs flex items-center justify-center hover:bg-rose-600 transition-colors"
              aria-label="Remove attached image"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-slate-50/50 dark:bg-slate-950/30 flex-shrink-0">
        <button
          type="button"
          onClick={handleSimulateVoice}
          disabled={isRecording}
          className={`p-2.5 rounded-2xl border transition-colors ${
            isRecording
              ? 'border-rose-400 bg-rose-500/10 text-rose-500 animate-pulse'
              : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Voice Input (Demo)"
          aria-label={isRecording ? 'Recording voice...' : 'Start voice input'}
        >
          <Mic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleImageAttach}
          className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Attach Handwritten Math / Diagram"
          aria-label="Attach diagram or image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder={isRecording ? 'Listening to your voice doubt...' : 'Type a math or science doubt (or attach diagram)...'}
          className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Type your question"
          disabled={isTyping}
        />

        <button
          type="button"
          onClick={() => handleSend()}
          disabled={(!input.trim() && !imagePreview) || isTyping}
          className="p-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-all shadow-md flex items-center justify-center"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Hidden file input for future real file attach */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" aria-hidden="true" />
    </div>
  );
}

// ─── Page Export with Robust Suspense ─────────────────────────────────────
export default function DoubtTutorPage() {
  return (
    <Suspense
      fallback={
        <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex flex-col items-center gap-4 text-center p-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 animate-pulse">
              <BrainCircuit className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <p className="font-bold text-sm text-slate-900 dark:text-white">Initializing AI Tutor...</p>
              <p className="text-xs text-slate-500">Ready in a moment — no API keys required.</p>
            </div>
            <Link
              href="/student"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors mt-2"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              Return to Dashboard
            </Link>
          </div>
        </div>
      }
    >
      <DoubtTutorContent />
    </Suspense>
  );
}
