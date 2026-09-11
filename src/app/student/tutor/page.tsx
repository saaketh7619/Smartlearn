'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  BrainCircuit,
  Send,
  Mic,
  MicOff,
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
  Key,
  Settings,
  Lightbulb,
  HelpCircle,
  X,
  Upload,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import Link from 'next/link';
import { getGeminiApiKey, saveGeminiApiKey, getOfflineStemResponse, callGeminiTutorLive, TutorMessage, TutorResponse } from '@/lib/gemini';
import GeminiKeyModal from '@/components/GeminiKeyModal';

// ─── Typing Indicator ───────────────────────────────────────────────────────
function TypingIndicator({ isGeminiLive }: { isGeminiLive: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white flex-shrink-0 shadow-md">
        <Bot className="w-4 h-4" />
      </div>
      <div className="flex items-center gap-2 px-4 py-3 rounded-3xl rounded-tl-none bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <span className="text-[11px] text-slate-500 font-medium pl-1">
          {isGeminiLive ? 'Gemini AI is deriving step-by-step solution...' : 'AI Tutor is thinking...'}
        </span>
      </div>
    </div>
  );
}

// ─── Subject Chips for Welcome State ────────────────────────────────────────
interface ChipItem {
  subject: string;
  label: string;
  icon: string;
}

const CHIPS_DATA: ChipItem[] = [
  { subject: 'Math', label: 'Solve quadratic: 2x² - 7x + 3 = 0', icon: '📐' },
  { subject: 'Math', label: 'Explain the Chain Rule with an intuitive analogy', icon: '🔗' },
  { subject: 'Physics', label: 'Why does a projectile follow a parabolic path?', icon: '🚀' },
  { subject: 'Physics', label: "Explain Newton's Third Law with real-world pairs", icon: '⚡' },
  { subject: 'Chemistry', label: 'Explain hybridization of CH₄ vs H₂O and bond angles', icon: '🧪' },
  { subject: 'CS', label: 'How does QuickSort achieve O(n log n) average time?', icon: '💻' },
  { subject: 'Physics', label: "Derive Faraday's Law of Electromagnetic Induction", icon: '🧲' },
  { subject: 'Math', label: 'What is the derivative of f(x) = 3x⁴ - 5x² + 7?', icon: '∫' },
];

function EmptyState({
  onChipClick,
  onOpenKeyModal,
  hasKey,
}: {
  onChipClick: (q: string) => void;
  onOpenKeyModal: () => void;
  hasKey: boolean;
}) {
  const [selectedSubject, setSelectedSubject] = useState<'All' | 'Math' | 'Physics' | 'Chemistry' | 'CS'>('All');

  const filteredChips = selectedSubject === 'All'
    ? CHIPS_DATA
    : CHIPS_DATA.filter((c) => c.subject === selectedSubject);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 max-w-2xl mx-auto w-full">
      <div className="relative">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/25">
          <BrainCircuit className="w-8 h-8" />
        </div>
        <div className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-slate-900 rounded-full">
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
        </div>
      </div>

      <div className="space-y-1.5">
        <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">
          SmartLearn Socratic AI Tutor
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Get intuitive first-principles explanations, step-by-step mathematical proofs, and multimodal diagram analysis for all STEM subjects.
        </p>
      </div>

      {/* Key Status Banner */}
      {!hasKey ? (
        <div className="w-full max-w-lg p-3 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2.5">
            <Key className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-blue-900 dark:text-blue-300">
                Offline STEM Engine Active
              </p>
              <p className="text-[11px] text-blue-700/80 dark:text-blue-400/80">
                Connect your free Google Gemini key for unlimited real-time reasoning.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenKeyModal}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex-shrink-0"
          >
            Add Key
          </button>
        </div>
      ) : (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Google Gemini 3.6 Flash Connected &amp; Ready
        </div>
      )}

      {/* Subject Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {(['All', 'Math', 'Physics', 'Chemistry', 'CS'] as const).map((sub) => (
          <button
            key={sub}
            onClick={() => setSelectedSubject(sub)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              selectedSubject === sub
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Chips Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full text-left">
        {filteredChips.map((c) => (
          <button
            key={c.label}
            onClick={() => onChipClick(c.label)}
            className="p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 text-xs hover:border-blue-400 hover:shadow-md transition-all group flex items-start gap-2.5"
          >
            <span className="text-base flex-shrink-0 group-hover:scale-110 transition-transform">{c.icon}</span>
            <div className="flex-1">
              <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {c.label}
              </span>
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                {c.subject}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Tutor Component ──────────────────────────────────────────────────
function DoubtTutorContent() {
  const searchParams = useSearchParams();
  // Support both ?q= and ?topic= from course and test review navigations
  const initialQuery = searchParams.get('q') || searchParams.get('topic') || '';
  const currentUser = useStore((state) => state.currentUser);
  const addXP = useStore((state) => state.addXP);
  const triggerConfetti = useStore((state) => state.triggerConfetti);

  const [input, setInput] = useState(initialQuery);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [geminiKey, setGeminiKey] = useState('');
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const [messages, setMessages] = useState<TutorMessage[]>([]);

  // Load configured API key (from localStorage or URL parameter)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlKey = params.get('gemini_key') || params.get('key');
        if (urlKey && urlKey.trim()) {
          const clean = urlKey.trim();
          saveGeminiApiKey(clean);
          setGeminiKey(clean);
          // Clean query string from browser address bar smoothly without reloading
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, '', cleanUrl);
          return;
        }
      } catch {
        // ignore
      }
    }
    const key = getGeminiApiKey();
    setGeminiKey(key || '');
  }, []);

  // Check SpeechRecognition support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechRecognitionSupported(true);
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = true;
        recog.lang = 'en-US';

        recog.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setInput(transcript);
        };

        recog.onerror = (event: any) => {
          setIsRecording(false);
          setSpeechError(event.error || 'Microphone error');
          setTimeout(() => setSpeechError(null), 3000);
        };

        recog.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recog;
      }
    }
  }, []);

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

  // Auto-send initialQuery from search params (e.g. from weak topic in test results)
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

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend ?? input).trim();
    const attachedImage = imagePreview;

    if (!query && !attachedImage) return;

    setTimedOut(false);
    const userMsg: TutorMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: attachedImage ? `[Attached Diagram/Problem] ${query}` : query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setImagePreview(null);
    setIsTyping(true);

    // 12-second timeout guard
    const tid = setTimeout(() => {
      setIsTyping(false);
      setTimedOut(true);
    }, 12000);
    setTimeoutId(tid);

    try {
      const currentApiKey = geminiKey || getGeminiApiKey();
      let data: TutorResponse | null = null;

      // When an API key is available or on static export (GitHub Pages), call Gemini directly client-side
      if (currentApiKey) {
        data = await callGeminiTutorLive(
          query,
          currentApiKey,
          messages.slice(-4).map((m) => ({ sender: m.sender, text: m.text })),
          attachedImage || undefined
        );
      } else {
        // Try local server API if running Next.js dev server
        try {
          const res = await fetch('/api/ai/tutor/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query,
              imageBase64: attachedImage,
              history: messages.slice(-4).map((m) => ({
                sender: m.sender,
                text: m.text,
              })),
            }),
          });
          if (res.ok) {
            data = await res.json();
          }
        } catch {
          // Fallback to offline STEM engine
        }
      }

      clearTimeout(tid);
      setTimedOut(false);

      if (!data) {
        data = getOfflineStemResponse(query);
      }

      const aiMsg: TutorMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.text || 'Explanation derived successfully.',
        equation: data.equation,
        steps: data.steps,
        keyTakeaway: data.keyTakeaway,
        followUps: data.followUps,
        isLiveGemini: data.isLiveGemini,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      addXP(25, 'Learned with AI Tutor');
    } catch (err) {
      clearTimeout(tid);
      setTimedOut(false);
      const fallback = getOfflineStemResponse(query);
      const aiMsg: TutorMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: fallback.text,
        equation: fallback.equation,
        steps: fallback.steps,
        keyTakeaway: fallback.keyTakeaway,
        followUps: fallback.followUps,
        isLiveGemini: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRetry = () => {
    setTimedOut(false);
    const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user');
    if (lastUserMsg) handleSend(lastUserMsg.text);
  };

  // Real Web Speech API Toggle
  const handleToggleVoice = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    if (speechRecognitionSupported && recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        setSpeechError(null);
      } catch (err: any) {
        setIsRecording(false);
      }
    } else {
      // Fallback voice simulation if browser does not support SpeechRecognition
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setInput("Explain Newton's Third Law and action-reaction pairs.");
        inputRef.current?.focus();
      }, 1500);
    }
  };

  // Real File Upload Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      if (!input.trim()) {
        setInput('Analyze and solve this handwritten problem or diagram step-by-step:');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Support pasting image directly into chat
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = () => {
            setImagePreview(reader.result as string);
            if (!input.trim()) {
              setInput('Analyze and solve this diagram from my clipboard:');
            }
          };
          reader.readAsDataURL(blob);
          break;
        }
      }
    }
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(id);
    triggerConfetti();
    setTimeout(() => setCopiedId(null), 1500);
  };

  const isEmpty = messages.length === 0;

  return (
    <div
      className="h-[calc(100vh-8rem)] flex flex-col rounded-3xl bg-white dark:bg-[#12161d] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in duration-200"
      role="main"
      aria-label="AI Doubt Tutor"
      onPaste={handlePaste}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#161b24] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm text-slate-900 dark:text-white">SmartLearn AI Doubt Tutor</h1>
              <button
                onClick={() => setIsKeyModalOpen(true)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all ${
                  geminiKey
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
                    : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border border-blue-500/30'
                }`}
                title="Configure Google Gemini API Key"
              >
                {geminiKey ? (
                  <>
                    <Sparkles className="w-3 h-3 text-emerald-500" />
                    Gemini 2.5 Live
                  </>
                ) : (
                  <>
                    <Key className="w-3 h-3 text-blue-500" />
                    STEM Engine (Connect Gemini)
                  </>
                )}
              </button>
              {isOffline && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-bold flex items-center gap-1">
                  <WifiOff className="w-2.5 h-2.5" /> Offline Mode
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Interactive Socratic reasoning across Math, Physics, Chemistry &amp; Computer Science
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsKeyModalOpen(true)}
            className="p-2 rounded-xl text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Gemini AI Settings"
            aria-label="Gemini AI Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
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
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5" role="log" aria-live="polite" aria-label="Chat messages">
        {isEmpty && !isTyping ? (
          <EmptyState
            onChipClick={(q) => {
              setInput(q);
              handleSend(q);
            }}
            onOpenKeyModal={() => setIsKeyModalOpen(true)}
            hasKey={Boolean(geminiKey)}
          />
        ) : (
          <>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-xs ${
                    m.sender === 'user'
                      ? 'bg-blue-600'
                      : 'bg-gradient-to-tr from-blue-600 to-indigo-600'
                  }`}
                  aria-hidden="true"
                >
                  {m.sender === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[88%] sm:max-w-[78%] rounded-3xl p-4 sm:p-5 text-xs shadow-xs space-y-3 ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/70 dark:border-slate-700/60'
                  }`}
                >
                  {/* Message Main Text */}
                  <p className="leading-relaxed whitespace-pre-wrap text-[13px]">{m.text}</p>

                  {/* Mathematical Formula / Equation Card */}
                  {m.equation && (
                    <div className="my-3 p-3.5 rounded-2xl bg-black/85 text-emerald-400 font-mono text-center text-xs sm:text-sm tracking-wide shadow-inner border border-emerald-500/25 overflow-x-auto">
                      {m.equation}
                    </div>
                  )}

                  {/* Step-by-Step Derivation */}
                  {m.steps && m.steps.length > 0 && (
                    <div className="mt-3 space-y-2.5 border-t border-slate-200 dark:border-slate-700/80 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                          <BrainCircuit className="w-3.5 h-3.5" />
                          Step-by-Step Derivation
                        </span>
                        {m.isLiveGemini && (
                          <span className="text-[10px] font-bold text-indigo-500 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Gemini Verified
                          </span>
                        )}
                      </div>
                      <ol className="space-y-2 pl-0.5">
                        {m.steps.map((st, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-2.5 leading-relaxed text-[12px]">
                            <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 mt-0.5">
                              {sIdx + 1}
                            </span>
                            <span className="text-slate-700 dark:text-slate-200">{st}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Key Takeaway Highlight */}
                  {m.keyTakeaway && (
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold uppercase text-[10px] tracking-wider text-amber-600 dark:text-amber-400 block">
                          Key Exam Takeaway
                        </span>
                        <span>{m.keyTakeaway}</span>
                      </div>
                    </div>
                  )}

                  {/* Follow-up Questions / Suggestions */}
                  {m.followUps && m.followUps.length > 0 && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 space-y-1.5">
                      <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                        <HelpCircle className="w-3 h-3" />
                        Explore Further with AI:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {m.followUps.map((fu, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setInput(fu);
                              handleSend(fu);
                            }}
                            className="text-left text-[11px] px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-300 border border-slate-200 dark:border-slate-600 transition-colors shadow-2xs"
                          >
                            👉 {fu}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metadata and Actions */}
                  <div className="flex items-center justify-between mt-2 pt-1 text-[10px] text-slate-400">
                    <span>{m.timestamp}</span>
                    {m.sender === 'ai' && (
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => {
                            const fullContent = [
                              m.text,
                              m.equation,
                              ...(m.steps ?? []),
                              m.keyTakeaway ? `Key Takeaway: ${m.keyTakeaway}` : '',
                            ]
                              .filter(Boolean)
                              .join('\n\n');
                            copyText(m.id, fullContent);
                          }}
                          className="hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 transition-colors"
                          aria-label="Copy solution"
                          title="Copy Full Solution"
                        >
                          {copiedId === m.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                        </button>
                        <button
                          onClick={() => triggerConfetti()}
                          className="hover:text-emerald-500 transition-colors p-1"
                          aria-label="Helpful"
                          title="Mark Helpful"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="hover:text-rose-500 transition-colors p-1"
                          aria-label="Not helpful"
                          title="Needs Improvement"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && <TypingIndicator isGeminiLive={Boolean(geminiKey)} />}

            {/* Timeout state */}
            {timedOut && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <div className="max-w-sm p-4 rounded-3xl rounded-tl-none bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs">
                  <p className="font-bold text-amber-700 dark:text-amber-400 mb-1">
                    AI response took longer than expected
                  </p>
                  <p className="text-amber-600 dark:text-amber-500">
                    Network lag or high model demand. Click retry to get an instant derivation.
                  </p>
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

      {/* Image Preview Thumbnail */}
      {imagePreview && (
        <div className="px-4 pb-2 flex-shrink-0 bg-slate-50/50 dark:bg-slate-950/30 border-t border-slate-100 dark:border-slate-800/60 pt-2">
          <div className="flex items-center gap-3">
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Attached diagram"
                className="h-16 w-24 rounded-xl border-2 border-blue-500/50 object-cover shadow-sm"
              />
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white text-xs flex items-center justify-center hover:bg-rose-700 transition-colors shadow-md"
                aria-label="Remove attached image"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="text-xs text-slate-500">
              <p className="font-semibold text-slate-700 dark:text-slate-300">Handwritten Diagram / Math Attached</p>
              <p className="text-[11px]">Gemini Vision will solve and break this down step-by-step.</p>
            </div>
          </div>
        </div>
      )}

      {/* Speech error toast */}
      {speechError && (
        <div className="px-4 py-1 text-[11px] text-rose-500 bg-rose-50 dark:bg-rose-950/30 flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3" /> {speechError}
        </div>
      )}

      {/* Input Bar */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-slate-50/70 dark:bg-[#161b24] flex-shrink-0">
        <button
          type="button"
          onClick={handleToggleVoice}
          className={`p-2.5 rounded-2xl border transition-all ${
            isRecording
              ? 'border-rose-500 bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
              : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title={isRecording ? 'Stop listening' : 'Voice Doubt Input (Web Speech)'}
          aria-label={isRecording ? 'Stop voice recording' : 'Start voice recording'}
        >
          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Upload / Attach Handwritten Diagram or Problem Image"
          aria-label="Upload image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={
            isRecording
              ? 'Listening to your STEM doubt... Speak naturally'
              : 'Ask any Math, Physics, Chemistry or CS doubt (or paste/attach image)...'
          }
          className="flex-1 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
          aria-label="Type your doubt"
          disabled={isTyping}
        />

        <button
          type="button"
          onClick={() => handleSend()}
          disabled={(!input.trim() && !imagePreview) || isTyping}
          className="p-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-all shadow-md shadow-blue-500/20 flex items-center justify-center cursor-pointer"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Hidden real file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />

      {/* Gemini Key Config Modal */}
      <GeminiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onSaved={(key) => setGeminiKey(key)}
      />
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
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 animate-pulse">
              <BrainCircuit className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <p className="font-bold text-sm text-slate-900 dark:text-white">Initializing AI Tutor...</p>
              <p className="text-xs text-slate-500">Preparing Socratic reasoning engine.</p>
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
