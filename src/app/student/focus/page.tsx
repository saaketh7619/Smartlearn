'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  CloudRain,
  Coffee,
  Trees,
  Waves,
  Maximize2,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function FocusModePage() {
  const addXP = useStore((state) => state.addXP);
  const triggerConfetti = useStore((state) => state.triggerConfetti);

  const [mode, setMode] = useState<'pomodoro' | 'short' | 'deep'>('pomodoro');
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [ambientSound, setAmbientSound] = useState<string | null>(null);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          triggerConfetti();
          addXP(100, 'Finished 25-minute uninterrupted Focus Session');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft, triggerConfetti, addXP]);

  const handleSelectPreset = (preset: 'pomodoro' | 'short' | 'deep') => {
    setMode(preset);
    setIsRunning(false);
    if (preset === 'pomodoro') setSecondsLeft(25 * 60);
    if (preset === 'short') setSecondsLeft(5 * 60);
    if (preset === 'deep') setSecondsLeft(50 * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200 text-center py-6">
      <div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-wider">
          Zen Study Space
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-2 mb-1">
          Distraction-Free Focus Mode
        </h1>
        <p className="text-xs text-slate-500">
          Immerse yourself in deep uninterrupted study. Timers pause external notifications automatically.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => handleSelectPreset('pomodoro')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            mode === 'pomodoro'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          25m Pomodoro
        </button>
        <button
          onClick={() => handleSelectPreset('short')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            mode === 'short'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          5m Quick Break
        </button>
        <button
          onClick={() => handleSelectPreset('deep')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            mode === 'deep'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          50m Deep Work
        </button>
      </div>

      {/* Circular Timer Clock View */}
      <div className="p-10 rounded-full w-72 h-72 sm:w-80 sm:h-80 mx-auto bg-gradient-to-tr from-slate-900 via-slate-950 to-slate-900 border-4 border-slate-800 shadow-2xl flex flex-col items-center justify-center relative">
        <div className="text-5xl sm:text-6xl font-black font-mono text-white tracking-widest">
          {formatTime(secondsLeft)}
        </div>
        <span className="text-xs text-emerald-400 font-semibold mt-2 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          {isRunning ? 'Flow State Active' : 'Ready to begin'}
        </span>
      </div>

      {/* Timer Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-6 py-3 rounded-2xl text-xs font-black transition-all shadow-lg flex items-center gap-2 ${
            isRunning ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isRunning ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
          <span>{isRunning ? 'Pause Timer' : 'Start Focus'}</span>
        </button>

        <button
          onClick={() => {
            setIsRunning(false);
            if (mode === 'pomodoro') setSecondsLeft(25 * 60);
            if (mode === 'short') setSecondsLeft(5 * 60);
            if (mode === 'deep') setSecondsLeft(50 * 60);
          }}
          className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Ambient Sound Selector */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          <span className="font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <Volume2 className="w-4 h-4 text-purple-500" />
            Ambient Background Audio
          </span>
          <span className="text-[11px]">{ambientSound ? `Playing: ${ambientSound}` : 'Muted'}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { name: 'Rainfall', icon: <CloudRain className="w-4 h-4" /> },
            { name: 'Cafe Sounds', icon: <Coffee className="w-4 h-4" /> },
            { name: 'Forest Birds', icon: <Trees className="w-4 h-4" /> },
            { name: 'Ocean Waves', icon: <Waves className="w-4 h-4" /> },
          ].map((snd) => (
            <button
              key={snd.name}
              onClick={() => setAmbientSound(ambientSound === snd.name ? null : snd.name)}
              className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                ambientSound === snd.name
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 font-bold'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {snd.icon}
              <span>{snd.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
