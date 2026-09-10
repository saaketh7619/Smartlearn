'use client';

import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Save,
  FolderPlus,
  Trash2,
  Share2,
  Code,
  Bold,
  Italic,
  List,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '@/store/useStore';

interface Note {
  id: string;
  title: string;
  subject: string;
  updatedAt: string;
  content: string;
}

export default function StudentNotebookPage() {
  const addXP = useStore((state) => state.addXP);
  const triggerConfetti = useStore((state) => state.triggerConfetti);

  const [notes, setNotes] = useState<Note[]>([
    {
      id: 'n-1',
      title: 'Differential Calculus Core Summary',
      subject: 'Mathematics',
      updatedAt: 'Today at 10:45 AM',
      content: `# Differential Calculus & Real-World Rate of Change

## 1. Fundamentals
The derivative of a function f(x) represents the instantaneous rate of change:
f'(x) = lim_{h -> 0} [f(x + h) - f(x)] / h

## 2. Power Rule
• d/dx [x^n] = n * x^(n - 1)
• Example: d/dx [4x^3] = 12x^2

## 3. The Chain Rule
When functions are composed f(g(x)), differentiate outer, keep inner intact, multiply by derivative of inner:
d/dx [f(g(x))] = f'(g(x)) * g'(x)

Key insight: In physics, displacement x(t) -> velocity v(t) = dx/dt -> acceleration a(t) = d²x/dt².`,
    },
    {
      id: 'n-2',
      title: 'Newtonian Kinematics & 2D Vectors',
      subject: 'Physics',
      updatedAt: 'Yesterday',
      content: `# Kinematics in Cartesian Planes

• Horizontal acceleration: a_x = 0 (velocity is constant)
• Vertical acceleration: a_y = -9.8 m/s² (gravity)
• Trajectory equation is always a downward parabola: y = x*tan(θ) - (g*x²)/(2*v₀²*cos²(θ))`,
    },
  ]);

  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  const handleContentChange = (newContent: string) => {
    setSaveStatus('saving');
    setNotes((prev) =>
      prev.map((n) => (n.id === activeNoteId ? { ...n, content: newContent, updatedAt: 'Just now' } : n))
    );
    setTimeout(() => setSaveStatus('saved'), 600);
  };

  const handleAiGenerateNotes = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generatedAddon = `\n\n## 🤖 AI Synthesized Exam Tips (Added ${new Date().toLocaleTimeString()}):\n• Common Trap: Forgetting constant of integration in reverse differentiation.\n• High-yield problem: Maxima and minima optimization where f'(x) = 0 and f''(x) < 0 indicates a local maximum.`;
      handleContentChange(activeNote.content + generatedAddon);
      setIsGenerating(false);
      triggerConfetti();
      addXP(30, 'Used AI Notes Synthesis');
    }, 1100);
  };

  const handleCreateNewNote = () => {
    const newNote: Note = {
      id: `n-${Date.now()}`,
      title: 'Untitled Study Note',
      subject: 'General STEM',
      updatedAt: 'Just now',
      content: `# New Study Guide\n\nStart typing or click "AI Generate Notes" to synthesize concepts...`,
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in duration-200">
      {/* Top action header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">SmartLearn Notebook</h2>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>{saveStatus === 'saved' ? '✓ Auto-saved' : 'Saving...'}</span>
              <span>·</span>
              <span>{notes.length} saved notebooks</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAiGenerateNotes}
            disabled={isGenerating}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isGenerating ? 'Synthesizing...' : 'AI Generate Notes'}
          </button>

          <button
            onClick={handleCreateNewNote}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            New Note
          </button>
        </div>
      </div>

      {/* Main split view: notes sidebar + rich editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Notebook List Sidebar */}
        <div className="w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40 p-3 space-y-2 overflow-y-auto hidden sm:block">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
            My Study Notes
          </span>
          {notes.map((n) => (
            <div
              key={n.id}
              onClick={() => setActiveNoteId(n.id)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                activeNoteId === n.id
                  ? 'bg-white dark:bg-slate-900 border-blue-500 shadow-xs'
                  : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-900/60'
              }`}
            >
              <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">{n.title}</h4>
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                <span>{n.subject}</span>
                <span>{n.updatedAt}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto">
          <input
            type="text"
            value={activeNote.title}
            onChange={(e) => {
              const newTitle = e.target.value;
              setNotes((prev) =>
                prev.map((n) => (n.id === activeNoteId ? { ...n, title: newTitle } : n))
              );
            }}
            className="text-xl sm:text-2xl font-black bg-transparent border-none text-slate-900 dark:text-white focus:outline-none mb-4"
          />

          <textarea
            value={activeNote.content}
            onChange={(e) => handleContentChange(e.target.value)}
            className="flex-1 w-full bg-transparent resize-none focus:outline-none font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed"
            placeholder="Write your study notes here..."
          />
        </div>
      </div>
    </div>
  );
}
