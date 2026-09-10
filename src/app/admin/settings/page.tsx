'use client';

import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Lock,
  BrainCircuit,
  Bell,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function AdminSettingsPage() {
  const triggerConfetti = useStore((state) => state.triggerConfetti);
  const [antiCheatStrictness, setAntiCheatStrictness] = useState('Medium (Warning on 1st tab switch, Lockout on 3rd)');
  const [aiModelEngine, setAiModelEngine] = useState('SmartLearn Heuristic + Hybrid Cloud AI');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    triggerConfetti();
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Platform-Wide Settings & Security Controls
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure anti-cheating tolerances, AI model routing, and school security protocols.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Anti-Cheat Settings */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-500" />
            Exam Anti-Cheat & Page Visibility Protocol
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Tab-Switch Detection Sensitivity
            </label>
            <select
              value={antiCheatStrictness}
              onChange={(e) => setAntiCheatStrictness(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <option>Strict (Immediate exam disqualification on 2nd tab switch)</option>
              <option>Medium (Warning on 1st tab switch, Lockout on 3rd)</option>
              <option>Lenient (Audit logging only, no lockout)</option>
            </select>
          </div>
        </div>

        {/* AI Engine Settings */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-blue-500" />
            AI Doubt Tutor & Question Synthesis
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              AI Generation Engine
            </label>
            <select
              value={aiModelEngine}
              onChange={(e) => setAiModelEngine(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <option>SmartLearn Heuristic + Hybrid Cloud AI (Recommended)</option>
              <option>Local Offline Rule-Based Mathematical Solver</option>
              <option>High-Context LLM Gateway API</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
        >
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Platform Configuration Saved!' : 'Save System Settings'}
        </button>
      </form>
    </div>
  );
}
