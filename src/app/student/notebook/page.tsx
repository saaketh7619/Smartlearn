'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  Search,
  Download,
  Copy,
  Folder,
  Menu,
  X,
  Clock,
  BookOpen,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useToast } from '@/components/shared/ToastContext';

interface Note {
  id: string;
  title: string;
  subject: string;
  updatedAt: string;
  content: string;
}

const DEFAULT_NOTES: Note[] = [
  {
    id: 'n-1',
    title: 'Differential Calculus Core Summary',
    subject: 'Mathematics',
    updatedAt: new Date(Date.now() - 3600000).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
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
    updatedAt: new Date(Date.now() - 86400000).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
    content: `# Kinematics in Cartesian Planes

• Horizontal acceleration: a_x = 0 (velocity is constant)
• Vertical acceleration: a_y = -9.8 m/s² (gravity)
• Trajectory equation is always a downward parabola: y = x*tan(θ) - (g*x²)/(2*v₀²*cos²(θ))

## Momentum & Conservation
Total initial momentum = Total final momentum in isolated systems (no external impulse).`,
  },
  {
    id: 'n-3',
    title: 'Data Structures & Big-O Reference',
    subject: 'Computer Science',
    updatedAt: new Date(Date.now() - 172800000).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
    content: `# Core Data Structures & Time Complexities

| Structure | Access | Search | Insertion | Deletion |
|---|---|---|---|---|
| Array | O(1) | O(n) | O(n) | O(n) |
| Stack | O(n) | O(n) | O(1) | O(1) |
| Queue | O(n) | O(n) | O(1) | O(1) |
| BST (balanced) | O(log n) | O(log n) | O(log n) | O(log n) |
| Hash Table | O(1) | O(1) | O(1) | O(1) |`,
  },
];

export default function StudentNotebookPage() {
  const addXP = useStore((state) => state.addXP);
  const triggerConfetti = useStore((state) => state.triggerConfetti);
  const toast = useToast();

  const [notes, setNotes] = useState<Note[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('smartlearn_notes');
        return saved ? JSON.parse(saved) : DEFAULT_NOTES;
      } catch {
        return DEFAULT_NOTES;
      }
    }
    return DEFAULT_NOTES;
  });

  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || 'n-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('All');
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('smartlearn_notes', JSON.stringify(notes));
    }
  }, [notes]);

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0] || {
    id: 'temp',
    title: 'Untitled Note',
    subject: 'General STEM',
    updatedAt: 'Just now',
    content: '',
  };

  const handleContentChange = (newContent: string) => {
    setSaveStatus('saving');
    const now = new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
    setNotes((prev) =>
      prev.map((n) => (n.id === activeNoteId ? { ...n, content: newContent, updatedAt: now } : n))
    );
    setTimeout(() => setSaveStatus('saved'), 500);
  };

  const handleAiGenerateNotes = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const generatedAddon = `\n\n## 🤖 AI Synthesized Exam Tips (${timestamp}):\n• Key Theorem / Formula: Ensure units are dimensionally verified before substituting numerical values.\n• Common Diagnostic Trap: Confusing instantaneous rates of change with average intervals.\n• Practice Checkpoint: Re-run the practice questions in the Mock Tests hub to evaluate retention.`;
      handleContentChange(activeNote.content + generatedAddon);
      setIsGenerating(false);
      triggerConfetti();
      addXP(30, 'Used AI Notes Synthesis');
      toast.success('Notes Synthesized (+30 XP)', 'AI added high-yield exam tips and formulas.');
    }, 1100);
  };

  const handleCreateNewNote = () => {
    const now = new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
    const newNote: Note = {
      id: `n-${Date.now()}`,
      title: 'Untitled Study Note',
      subject: selectedFolder === 'All' ? 'Mathematics' : selectedFolder,
      updatedAt: now,
      content: `# New Study Guide\n\nStart typing or click "AI Synthesize" to generate high-yield concepts...`,
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    toast.info('New Note Created', 'Ready for lecture notes and active recall summaries.');
  };

  const handleDeleteNote = (id: string, title: string) => {
    if (notes.length <= 1) {
      toast.warning('Cannot Delete', 'You must maintain at least one note in your notebook.');
      return;
    }
    const filtered = notes.filter((n) => n.id !== id);
    setNotes(filtered);
    if (activeNoteId === id) {
      setActiveNoteId(filtered[0].id);
    }
    toast.info('Note Deleted', `"${title}" was removed.`);
  };

  const handleExportMarkdown = () => {
    const blob = new Blob([activeNote.content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeNote.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded', `Exported "${activeNote.title}" as Markdown file.`);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(activeNote.content);
    toast.success('Copied', 'Note contents copied to clipboard.');
  };

  const subjects = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Computer Science'];

  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      const matchesSearch =
        !searchQuery ||
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFolder = selectedFolder === 'All' || n.subject === selectedFolder;
      return matchesSearch && matchesFolder;
    });
  }, [notes, searchQuery, selectedFolder]);

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in duration-200">
      {/* Top action header */}
      <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarMobileOpen(!sidebarMobileOpen)}
            className="sm:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
          >
            {sidebarMobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">SmartLearn Notebook</h2>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className={saveStatus === 'saved' ? 'text-emerald-500 font-semibold' : 'text-amber-500'}>
                {saveStatus === 'saved' ? '✓ Saved to local storage' : 'Saving...'}
              </span>
              <span>·</span>
              <span>{notes.length} total notes</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyToClipboard}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
            title="Copy Note Text"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportMarkdown}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
            title="Export as Markdown (.md)"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleAiGenerateNotes}
            disabled={isGenerating}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Synthesizing...' : 'AI Synthesize'}</span>
          </button>

          <button
            onClick={handleCreateNewNote}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* Main split view: sidebar + rich editor */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Notebook List Sidebar */}
        <div
          className={`${
            sidebarMobileOpen ? 'absolute inset-0 z-30 bg-white dark:bg-slate-900' : 'hidden sm:block'
          } w-full sm:w-72 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 p-3 space-y-3 overflow-y-auto flex-shrink-0`}
        >
          {/* Search inside notebook */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          {/* Folder Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px] font-semibold">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedFolder(sub)}
                className={`px-2 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedFolder === sub
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold'
                    : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Note list cards */}
          <div className="space-y-1.5">
            {filteredNotes.length === 0 ? (
              <p className="text-center py-6 text-xs text-slate-400">No notes found</p>
            ) : (
              filteredNotes.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    setActiveNoteId(n.id);
                    setSidebarMobileOpen(false);
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer group relative ${
                    activeNoteId === n.id
                      ? 'bg-white dark:bg-slate-900 border-blue-500 shadow-xs'
                      : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate max-w-[170px]">
                      {n.title}
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(n.id, n.title);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity p-0.5"
                      title="Delete Note"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{n.subject}</span>
                    <span>{n.updatedAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <input
              type="text"
              value={activeNote.title}
              onChange={(e) => {
                const newTitle = e.target.value;
                setNotes((prev) =>
                  prev.map((n) => (n.id === activeNoteId ? { ...n, title: newTitle } : n))
                );
              }}
              placeholder="Note Title..."
              className="text-lg sm:text-2xl font-black bg-transparent border-none text-slate-900 dark:text-white focus:outline-none flex-1"
            />

            <select
              value={activeNote.subject}
              onChange={(e) => {
                const newSub = e.target.value;
                setNotes((prev) =>
                  prev.map((n) => (n.id === activeNoteId ? { ...n, subject: newSub } : n))
                );
              }}
              className="text-xs px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Biology">Biology</option>
              <option value="General STEM">General STEM</option>
            </select>
          </div>

          <textarea
            value={activeNote.content}
            onChange={(e) => handleContentChange(e.target.value)}
            className="flex-1 w-full bg-transparent resize-none focus:outline-none font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed min-h-[300px]"
            placeholder="Write your study notes here using standard markdown..."
          />
        </div>
      </div>
    </div>
  );
}
