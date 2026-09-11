'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Key,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { getGeminiApiKey, saveGeminiApiKey } from '@/lib/gemini';

interface GeminiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (key: string) => void;
}

export default function GeminiKeyModal({
  isOpen,
  onClose,
  onSaved,
}: GeminiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [testingStatus, setTestingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const existing = getGeminiApiKey();
      setApiKey(existing || '');
      setTestingStatus('idle');
      setStatusMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanKey = apiKey.trim();
    saveGeminiApiKey(cleanKey);
    setStatusMessage(cleanKey ? 'Gemini API Key saved successfully!' : 'API Key cleared.');
    setTestingStatus('success');
    if (onSaved) onSaved(cleanKey);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleTestKey = async () => {
    const keyToTest = apiKey.trim();
    if (!keyToTest) {
      setTestingStatus('error');
      setStatusMessage('Please enter a Gemini API Key first.');
      return;
    }

    setTestingStatus('loading');
    setStatusMessage('Testing connection with Google Gemini 2.5 Flash...');

    try {
      const res = await fetch('/api/ai/tutor/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'Explain why 1+1=2 simply in 1 sentence',
          apiKey: keyToTest,
        }),
      });

      const data = await res.json();
      if (data.success && data.isLiveGemini) {
        setTestingStatus('success');
        setStatusMessage(`Connected! Gemini responded successfully via ${data.modelUsed || 'Gemini Flash'}.`);
        saveGeminiApiKey(keyToTest);
        if (onSaved) onSaved(keyToTest);
      } else if (data.error) {
        setTestingStatus('error');
        setStatusMessage(`Connection failed: ${data.error}`);
      } else {
        setTestingStatus('error');
        setStatusMessage('Could not verify Gemini key. Please double-check the key.');
      }
    } catch (err: any) {
      setTestingStatus('error');
      setStatusMessage(`Network error: ${err.message || 'Failed to reach tutor API'}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#1a1e24] w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Google Gemini AI Setup
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  Live Socratic AI
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Powers real-time problem solving, derivations &amp; diagram analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 ${
                testingStatus === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300'
                  : testingStatus === 'error'
                  ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300'
                  : 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300'
              }`}
            >
              {testingStatus === 'loading' && <Loader2 className="w-4 h-4 animate-spin flex-shrink-0 mt-0.5" />}
              {testingStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />}
              {testingStatus === 'error' && <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />}
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-blue-500" />
                  Gemini API Key
                </span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  Get free key from Google AI Studio <ExternalLink className="w-3 h-3" />
                </a>
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-[11px] text-slate-400 mt-1.5">
                Keys start with <code className="text-blue-500">AIzaSy...</code> and are completely free from Google AI Studio.
              </p>
            </div>

            {/* Info card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/60 dark:border-blue-900/40 text-[11px] text-slate-600 dark:text-slate-300 space-y-1.5">
              <div className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Zero Cost &amp; Privacy First
              </div>
              <p>
                Google AI Studio provides a free tier with high daily limits. The API key is stored securely in your browser and used solely to answer your doubts.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleTestKey}
                disabled={testingStatus === 'loading' || !apiKey.trim()}
                className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors flex items-center gap-2"
              >
                {testingStatus === 'loading' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                )}
                Test Key Live
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Save Key
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
