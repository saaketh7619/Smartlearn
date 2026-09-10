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
  Camera,
} from 'lucide-react';
import { useStore } from '@/store/useStore';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  steps?: string[];
  equation?: string;
  timestamp: string;
}

function DoubtTutorContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const currentUser = useStore((state) => state.currentUser);
  const addXP = useStore((state) => state.addXP);
  const triggerConfetti = useStore((state) => state.triggerConfetti);

  const [input, setInput] = useState(initialQuery);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: 'Hello Alex! I am your SmartLearn AI Tutor. Ask me any STEM question, upload a photo of your handwritten problem, or speak your doubt. How can I help you excel today?',
      timestamp: 'Just now',
    },
  ]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const promptChips = [
    'Solve quadratic equation: 2x² - 7x + 3 = 0',
    'Explain the Chain Rule with an intuitive analogy',
    'Why does a projectile follow a parabolic path?',
    'How does QuickSort achieve O(n log n) time complexity?',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() && !imagePreview) return;

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

    // AI Heuristic Response Engine
    setTimeout(() => {
      let aiResponseText = '';
      let steps: string[] = [];
      let equation = '';

      const lower = query.toLowerCase();

      if (lower.includes('quadratic') || lower.includes('2x^2') || lower.includes('2x²')) {
        aiResponseText = 'Great problem! Let us solve 2x² - 7x + 3 = 0 step-by-step using both factorization and the quadratic formula:';
        equation = 'x = [-b ± √(b² - 4ac)] / (2a)';
        steps = [
          'Identify coefficients: a = 2, b = -7, c = 3.',
          'Calculate discriminant Δ = b² - 4ac: (-7)² - 4(2)(3) = 49 - 24 = 25.',
          'Since Δ = 25 is a perfect square, roots are real and rational.',
          'Substitute into formula: x = [7 ± √25] / 4 = [7 ± 5] / 4.',
          'Root 1: x = (7 + 5) / 4 = 12 / 4 = 3.',
          'Root 2: x = (7 - 5) / 4 = 2 / 4 = 1/2.',
          'Final Answer: x = 3 and x = 0.5 (or 1/2). Both solutions satisfy the equation!'
        ];
      } else if (lower.includes('chain rule')) {
        aiResponseText = 'The Chain Rule is used whenever you have a composite function — a function nested inside another function f(g(x)).';
        equation = 'd/dx [f(g(x))] = f\'(g(x)) · g\'(x)';
        steps = [
          'Intuition: Think of nested Russian dolls. To paint the inner doll, you must open the outer doll first.',
          'Step 1: Differentiate the exterior function f, leaving the interior g(x) intact.',
          'Step 2: Multiply by the derivative of that interior function g\'(x).',
          'Example: For y = (3x² + 5)⁴, let outer be u⁴ and inner be u = 3x² + 5.',
          'dy/dx = 4(3x² + 5)³ · (6x) = 24x(3x² + 5)³.'
        ];
      } else if (lower.includes('projectile') || lower.includes('parabolic')) {
        aiResponseText = 'A projectile follows a parabolic trajectory because horizontal and vertical components of motion are completely independent!';
        equation = 'y(x) = x·tan(θ) - [g·x²] / [2·v₀²·cos²(θ)]';
        steps = [
          'Horizontal motion: Constant velocity (a_x = 0) => x(t) = v₀·cos(θ)·t.',
          'Vertical motion: Constant downward gravitational acceleration (a_y = -g) => y(t) = v₀·sin(θ)·t - 0.5·g·t².',
          'Eliminating time t = x / (v₀·cos(θ)) yields a quadratic relation between y and x.',
          'Since the governing equation is quadratic in x with a negative coefficient, the geometry is strictly a downward parabola.'
        ];
      } else {
        aiResponseText = `Here is a structured conceptual breakdown for "${query}":`;
        steps = [
          'Core Principle: Break down complex axioms into foundational first principles.',
          'Step 1: Identify given variables, boundary conditions, and target quantities.',
          'Step 2: Apply the governing physical law or mathematical theorem.',
          'Step 3: Verify dimensional consistency and limits at extreme values.',
          'Pro Tip: You can test your mastery by taking an adaptive diagnostic test on this topic in the Tests section!'
        ];
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        equation,
        steps,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      addXP(20, 'Asked deep question to AI Tutor');
    }, 900);
  };

  const handleSimulateVoice = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setInput('Can you explain Newton\'s Third Law and action-reaction pairs?');
    }, 2000);
  };

  const handleSimulateImageUpload = () => {
    setImagePreview('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400');
    setInput('Solve problem #4 from my notebook diagram');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">SmartLearn AI Doubt Tutor</h2>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                Step-by-Step AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Supports Math, Physics, Chemistry & Computer Science</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMessages([messages[0]])}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Clear Chat History"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white ${
                m.sender === 'user' ? 'bg-indigo-600' : 'bg-blue-600'
              }`}
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
                      onClick={() => {
                        navigator.clipboard.writeText(m.text);
                        setCopiedId(m.id);
                        setTimeout(() => setCopiedId(null), 1500);
                      }}
                      className="hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
                    >
                      {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <button className="hover:text-emerald-500"><ThumbsUp className="w-3 h-3" /></button>
                    <button className="hover:text-rose-500"><ThumbsDown className="w-3 h-3" /></button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 pl-11">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
            <span className="text-[11px]">AI Tutor is formulating step-by-step proof...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Chips */}
      <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-200 dark:border-slate-800 flex gap-2 overflow-x-auto scrollbar-none">
        {promptChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-[11px] text-slate-600 dark:text-slate-300 whitespace-nowrap transition-colors shadow-xs"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Image Preview if uploaded */}
      {imagePreview && (
        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-950/30 flex items-center justify-between border-t border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-300">
            <Camera className="w-4 h-4" />
            <span>Handwritten diagram attached. Ready for OCR parsing.</span>
          </div>
          <button
            onClick={() => setImagePreview(null)}
            className="text-xs text-rose-500 hover:underline font-bold"
          >
            Remove
          </button>
        </div>
      )}

      {/* Input Tray */}
      <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <button
          type="button"
          onClick={handleSimulateVoice}
          className={`p-2.5 rounded-2xl border transition-all ${
            isRecording
              ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
              : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Voice Doubt Input (Simulated Mic)"
        >
          <Mic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleSimulateImageUpload}
          className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Attach Handwritten Math / Diagram (OCR)"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder={isRecording ? 'Listening to your voice doubt...' : 'Type a math or science doubt (or attach diagram)...'}
          className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="button"
          onClick={() => handleSend()}
          disabled={!input.trim() && !imagePreview}
          className="p-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-all shadow-md flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function DoubtTutorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading AI Doubt Tutor...</div>}>
      <DoubtTutorContent />
    </Suspense>
  );
}
