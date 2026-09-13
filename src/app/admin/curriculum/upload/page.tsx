'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronRight, ChevronLeft, Check, Upload, Link as LinkIcon,
  BookOpen, FileText, Video, Target, FlaskConical, ClipboardList,
  Star, Plus, Trash2, Globe, Save, Sparkles, X,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { db } from '@/lib/db';
import { EDUCATIONAL_LEVELS, BOARDS, LANGUAGES } from '@/lib/curriculumData';
import {
  Subject, Chapter, Concept, LearningResource, ResourceType, ContentStatus,
} from '@/types';
import { useToast } from '@/components/shared/ToastContext';

const STEPS = [
  'Educational Level',
  'Stream',
  'Class / Semester',
  'Subject Details',
  'Chapters',
  'Concepts',
  'Resources',
  'Preview & Publish',
];

const RESOURCE_TYPES: { value: ResourceType; label: string; icon: React.ReactNode }[] = [
  { value: 'syllabus', label: 'Syllabus', icon: <ClipboardList className="w-4 h-4" /> },
  { value: 'textbook', label: 'Textbook', icon: <BookOpen className="w-4 h-4" /> },
  { value: 'notes', label: 'Notes / Study Material', icon: <FileText className="w-4 h-4" /> },
  { value: 'video', label: 'Video Lecture', icon: <Video className="w-4 h-4" /> },
  { value: 'quiz', label: 'Quiz / Test', icon: <Target className="w-4 h-4" /> },
  { value: 'flashcards', label: 'Flashcards', icon: <Star className="w-4 h-4" /> },
  { value: 'worksheet', label: 'Worksheet', icon: <FileText className="w-4 h-4" /> },
  { value: 'practice_test', label: 'Practice Test', icon: <ClipboardList className="w-4 h-4" /> },
  { value: 'external_link', label: 'External Link', icon: <LinkIcon className="w-4 h-4" /> },
];

function uid() {
  return `new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

interface NewChapter {
  id: string;
  title: string;
  concepts: { id: string; title: string; description: string }[];
  resources: { id: string; type: ResourceType; title: string; description: string; externalUrl: string; tags: string }[];
}

function AdminCurriculumUploadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const { currentUser } = useStore();

  const [step, setStep] = useState(0);
  const [selectedLevelId, setSelectedLevelId] = useState('');
  const [selectedStreamId, setSelectedStreamId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState(searchParams?.get('classId') ?? '');

  // Pre-fill from URL param
  useEffect(() => {
    const classId = searchParams?.get('classId');
    if (classId) {
      setSelectedClassId(classId);
      // Find parent level and stream
      for (const level of EDUCATIONAL_LEVELS) {
        for (const stream of level.streams) {
          if (stream.classes.some((c) => c.id === classId)) {
            setSelectedLevelId(level.id);
            setSelectedStreamId(stream.id);
            setStep(3); // skip to subject details
            break;
          }
        }
      }
    }
  }, []);

  // Subject details
  const [subjectName, setSubjectName] = useState('');
  const [subjectBoard, setSubjectBoard] = useState('CBSE');
  const [subjectYear, setSubjectYear] = useState('2025-26');
  const [subjectLanguage, setSubjectLanguage] = useState('English');
  const [subjectDescription, setSubjectDescription] = useState('');

  // Chapters
  const [chapters, setChapters] = useState<NewChapter[]>([
    { id: uid(), title: '', concepts: [], resources: [] },
  ]);
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);

  const [publishMode, setPublishMode] = useState<'draft' | 'published'>('draft');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentLevel = EDUCATIONAL_LEVELS.find((l) => l.id === selectedLevelId);
  const currentStream = currentLevel?.streams.find((s) => s.id === selectedStreamId);
  const currentClass = currentStream?.classes.find((c) => c.id === selectedClassId);

  const progress = ((step + 1) / STEPS.length) * 100;

  const canProceed = () => {
    if (step === 0) return !!selectedLevelId;
    if (step === 1) return !currentLevel?.streams.length || !!selectedStreamId;
    if (step === 2) return !!selectedClassId;
    if (step === 3) return subjectName.trim().length >= 2;
    if (step === 4) return chapters.every((ch) => ch.title.trim().length >= 2);
    return true;
  };

  const handleAddChapter = () => {
    setChapters((prev) => [...prev, { id: uid(), title: '', concepts: [], resources: [] }]);
    setActiveChapterIdx(chapters.length);
  };

  const handleRemoveChapter = (idx: number) => {
    setChapters((prev) => prev.filter((_, i) => i !== idx));
    setActiveChapterIdx(Math.max(0, activeChapterIdx - 1));
  };

  const handleChapterChange = (idx: number, field: string, value: string) => {
    setChapters((prev) => prev.map((ch, i) => i === idx ? { ...ch, [field]: value } : ch));
  };

  const handleAddConcept = (chIdx: number) => {
    setChapters((prev) => prev.map((ch, i) =>
      i === chIdx ? { ...ch, concepts: [...ch.concepts, { id: uid(), title: '', description: '' }] } : ch
    ));
  };

  const handleConceptChange = (chIdx: number, conIdx: number, field: string, value: string) => {
    setChapters((prev) => prev.map((ch, i) =>
      i === chIdx ? {
        ...ch,
        concepts: ch.concepts.map((con, ci) => ci === conIdx ? { ...con, [field]: value } : con)
      } : ch
    ));
  };

  const handleRemoveConcept = (chIdx: number, conIdx: number) => {
    setChapters((prev) => prev.map((ch, i) =>
      i === chIdx ? { ...ch, concepts: ch.concepts.filter((_, ci) => ci !== conIdx) } : ch
    ));
  };

  const handleAddResource = (chIdx: number) => {
    setChapters((prev) => prev.map((ch, i) =>
      i === chIdx ? {
        ...ch,
        resources: [...ch.resources, { id: uid(), type: 'notes', title: '', description: '', externalUrl: '', tags: '' }]
      } : ch
    ));
  };

  const handleResourceChange = (chIdx: number, resIdx: number, field: string, value: string) => {
    setChapters((prev) => prev.map((ch, i) =>
      i === chIdx ? {
        ...ch,
        resources: ch.resources.map((r, ri) => ri === resIdx ? { ...r, [field]: value } : r)
      } : ch
    ));
  };

  const handleRemoveResource = (chIdx: number, resIdx: number) => {
    setChapters((prev) => prev.map((ch, i) =>
      i === chIdx ? { ...ch, resources: ch.resources.filter((_, ri) => ri !== resIdx) } : ch
    ));
  };

  const handleSubmit = async () => {
    if (!selectedClassId || !subjectName) return;
    setIsSubmitting(true);
    try {
      const audit = {
        uploadedBy: currentUser?.name ?? 'Admin',
        uploadedAt: new Date().toISOString(),
      };

      const subjectId = uid();
      const newSubject: Subject = {
        id: subjectId,
        classId: selectedClassId,
        name: subjectName,
        board: subjectBoard,
        academicYear: subjectYear,
        language: subjectLanguage,
        description: subjectDescription,
        status: publishMode,
        audit,
        chapters: chapters
          .filter((ch) => ch.title.trim())
          .map((ch, chOrder) => {
            const chapterId = uid();
            return {
              id: chapterId,
              subjectId,
              title: ch.title,
              displayOrder: chOrder + 1,
              concepts: ch.concepts
                .filter((con) => con.title.trim())
                .map((con, conOrder): Concept => ({
                  id: uid(),
                  chapterId,
                  title: con.title,
                  description: con.description || undefined,
                  displayOrder: conOrder + 1,
                  resources: [],
                })),
              resources: ch.resources
                .filter((r) => r.title.trim())
                .map((r): LearningResource => ({
                  id: uid(),
                  parentId: chapterId,
                  parentType: 'chapter',
                  type: r.type,
                  title: r.title,
                  description: r.description || undefined,
                  externalUrl: r.externalUrl || undefined,
                  tags: r.tags ? r.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
                  language: subjectLanguage,
                  status: publishMode,
                  audit,
                  viewCount: 0,
                })),
            };
          }),
      };

      db.addSubject(selectedClassId, newSubject);

      toast.success(
        publishMode === 'published' ? 'Content Published!' : 'Draft Saved!',
        `${subjectName} for ${currentClass?.name} has been ${publishMode === 'published' ? 'published and is now live for students' : 'saved as a draft'}.`
      );

      setTimeout(() => router.push('/admin/curriculum/'), 200);
    } catch (e) {
      toast.error('Upload Failed', 'There was an error saving the content. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-slate-500" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Upload Curriculum Content</h1>
          <p className="text-xs text-slate-500">Guided 8-step content creation wizard</p>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span>Step {step + 1} of {STEPS.length} — <span className="font-semibold text-slate-700 dark:text-slate-300">{STEPS[step]}</span></span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex gap-1 mt-2 overflow-x-auto pb-1">
          {STEPS.map((s, i) => (
            <button
              key={i}
              onClick={() => i < step && setStep(i)}
              disabled={i > step}
              className={`flex-shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors ${
                i === step ? 'bg-rose-500 text-white' : i < step ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 cursor-pointer' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              {i < step ? <Check className="w-2.5 h-2.5 inline" /> : i + 1}. {s}
            </button>
          ))}
        </div>
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-[#1a1e24] rounded-3xl border border-slate-200 dark:border-[#283038] shadow-xl p-6 sm:p-8">

        {/* Step 0: Level */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Select Educational Level</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EDUCATIONAL_LEVELS.map((level) => (
                <button
                  key={level.id}
                  onClick={() => { setSelectedLevelId(level.id); setSelectedStreamId(''); setSelectedClassId(''); }}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    selectedLevelId === level.id
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/20'
                      : 'border-slate-200 dark:border-[#283038] hover:border-rose-300'
                  }`}
                >
                  <span className="text-xl">{level.icon}</span>
                  <div className="flex-1">
                    <div className="font-bold text-sm text-slate-900 dark:text-white">{level.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{level.description}</div>
                  </div>
                  {selectedLevelId === level.id && <Check className="w-4 h-4 text-rose-500" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Stream */}
        {step === 1 && currentLevel && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Select Stream in {currentLevel.name}</h2>
            {currentLevel.streams.length === 0 ? (
              <p className="text-sm text-slate-500">No streams. Click Next to continue.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentLevel.streams.map((stream) => (
                  <button
                    key={stream.id}
                    onClick={() => { setSelectedStreamId(stream.id); setSelectedClassId(''); }}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      selectedStreamId === stream.id
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/20'
                        : 'border-slate-200 dark:border-[#283038] hover:border-rose-300'
                    }`}
                  >
                    <BookOpen className="w-5 h-5 text-rose-500 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-bold text-sm text-slate-900 dark:text-white">{stream.name}</div>
                      <div className="text-xs text-slate-400">{stream.classes.length} classes</div>
                    </div>
                    {selectedStreamId === stream.id && <Check className="w-4 h-4 text-rose-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Class */}
        {step === 2 && currentStream && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Select Class / Semester</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {currentStream.classes.map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClassId(cls.id)}
                  className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedClassId === cls.id
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/20'
                      : 'border-slate-200 dark:border-[#283038] hover:border-rose-300'
                  }`}
                >
                  <span className="text-2xl mb-1">📖</span>
                  <span className="font-bold text-sm text-slate-900 dark:text-white text-center">{cls.name}</span>
                  <span className="text-[10px] text-slate-400 mt-1">{cls.subjects.length} subjects</span>
                  {selectedClassId === cls.id && <Check className="w-4 h-4 text-rose-500 mt-1" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Subject Details */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Subject Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Subject Name *</label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="e.g., Mathematics, Science, English"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Board / University</label>
                <select
                  value={subjectBoard}
                  onChange={(e) => setSubjectBoard(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 cursor-pointer"
                >
                  {BOARDS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Academic Year</label>
                <input
                  type="text"
                  value={subjectYear}
                  onChange={(e) => setSubjectYear(e.target.value)}
                  placeholder="2025-26"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Language</label>
                <select
                  value={subjectLanguage}
                  onChange={(e) => setSubjectLanguage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 cursor-pointer"
                >
                  {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Description (optional)</label>
                <textarea
                  value={subjectDescription}
                  onChange={(e) => setSubjectDescription(e.target.value)}
                  placeholder="Brief overview of this subject..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Chapters */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Add Chapters</h2>
              <button
                onClick={handleAddChapter}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Chapter
              </button>
            </div>
            <div className="space-y-3">
              {chapters.map((ch, idx) => (
                <div key={ch.id} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-rose-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <input
                    type="text"
                    value={ch.title}
                    onChange={(e) => handleChapterChange(idx, 'title', e.target.value)}
                    placeholder={`Chapter ${idx + 1} title...`}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                  {chapters.length > 1 && (
                    <button
                      onClick={() => handleRemoveChapter(idx)}
                      className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400">You can add concepts and resources to each chapter in the next steps.</p>
          </div>
        )}

        {/* Step 5: Concepts */}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Add Concepts / Topics</h2>
            {/* Chapter tabs */}
            <div className="flex gap-2 flex-wrap">
              {chapters.map((ch, idx) => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChapterIdx(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    activeChapterIdx === idx
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                  }`}
                >
                  Ch. {idx + 1}: {ch.title || `Chapter ${idx + 1}`}
                </button>
              ))}
            </div>
            {chapters[activeChapterIdx] && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
                  Concepts in: {chapters[activeChapterIdx].title || `Chapter ${activeChapterIdx + 1}`}
                </div>
                {chapters[activeChapterIdx].concepts.map((con, conIdx) => (
                  <div key={con.id} className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={con.title}
                        onChange={(e) => handleConceptChange(activeChapterIdx, conIdx, 'title', e.target.value)}
                        placeholder="Concept title..."
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                      />
                      <button
                        onClick={() => handleRemoveConcept(activeChapterIdx, conIdx)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={con.description}
                      onChange={(e) => handleConceptChange(activeChapterIdx, conIdx, 'description', e.target.value)}
                      placeholder="Brief description (optional)..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                    />
                  </div>
                ))}
                <button
                  onClick={() => handleAddConcept(activeChapterIdx)}
                  className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Concept
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 6: Resources */}
        {step === 6 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Upload / Link Resources</h2>
            {/* Chapter tabs */}
            <div className="flex gap-2 flex-wrap">
              {chapters.map((ch, idx) => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChapterIdx(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    activeChapterIdx === idx
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-rose-50'
                  }`}
                >
                  Ch. {idx + 1}
                </button>
              ))}
            </div>
            {chapters[activeChapterIdx] && (
              <div className="space-y-3">
                {chapters[activeChapterIdx].resources.map((res, resIdx) => (
                  <div key={res.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={res.type}
                        onChange={(e) => handleResourceChange(activeChapterIdx, resIdx, 'type', e.target.value)}
                        className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                      >
                        {RESOURCE_TYPES.map((rt) => <option key={rt.value} value={rt.value}>{rt.label}</option>)}
                      </select>
                      <input
                        type="text"
                        value={res.title}
                        onChange={(e) => handleResourceChange(activeChapterIdx, resIdx, 'title', e.target.value)}
                        placeholder="Resource title..."
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                      />
                      <button
                        onClick={() => handleRemoveResource(activeChapterIdx, resIdx)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="url"
                      value={res.externalUrl}
                      onChange={(e) => handleResourceChange(activeChapterIdx, resIdx, 'externalUrl', e.target.value)}
                      placeholder="External URL (https://...) or leave blank for file upload later"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                    />
                    <input
                      type="text"
                      value={res.tags}
                      onChange={(e) => handleResourceChange(activeChapterIdx, resIdx, 'tags', e.target.value)}
                      placeholder="Tags (comma-separated): ncert, chapter-1, important"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                    />
                  </div>
                ))}
                <button
                  onClick={() => handleAddResource(activeChapterIdx)}
                  className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Resource
                </button>
                <p className="text-[10px] text-slate-400">File upload to cloud storage is available in the full production build. For the demo, use external URLs.</p>
              </div>
            )}
          </div>
        )}

        {/* Step 7: Preview & Publish */}
        {step === 7 && (
          <div className="space-y-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Preview & Publish</h2>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Content Summary</div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><span className="text-slate-400">Level:</span> <span className="font-semibold text-slate-900 dark:text-white">{currentLevel?.name}</span></div>
                <div><span className="text-slate-400">Stream:</span> <span className="font-semibold text-slate-900 dark:text-white">{currentStream?.name}</span></div>
                <div><span className="text-slate-400">Class:</span> <span className="font-semibold text-slate-900 dark:text-white">{currentClass?.name}</span></div>
                <div><span className="text-slate-400">Board:</span> <span className="font-semibold text-slate-900 dark:text-white">{subjectBoard}</span></div>
                <div><span className="text-slate-400">Subject:</span> <span className="font-semibold text-slate-900 dark:text-white">{subjectName}</span></div>
                <div><span className="text-slate-400">Language:</span> <span className="font-semibold text-slate-900 dark:text-white">{subjectLanguage}</span></div>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-4 text-xs">
                <span className="text-slate-400">{chapters.filter((c) => c.title.trim()).length} chapters</span>
                <span className="text-slate-400">{chapters.reduce((t, c) => t + c.concepts.length, 0)} concepts</span>
                <span className="text-slate-400">{chapters.reduce((t, c) => t + c.resources.length, 0)} resources</span>
              </div>
            </div>

            {/* Publish mode */}
            <div>
              <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-3">Publication Status</div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPublishMode('draft')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    publishMode === 'draft'
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-amber-300'
                  }`}
                >
                  <Save className="w-5 h-5 text-amber-500 mb-2" />
                  <div className="font-bold text-sm text-slate-900 dark:text-white">Save as Draft</div>
                  <div className="text-xs text-slate-400 mt-0.5">Only visible to admins</div>
                </button>
                <button
                  onClick={() => setPublishMode('published')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    publishMode === 'published'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                  }`}
                >
                  <Globe className="w-5 h-5 text-emerald-500 mb-2" />
                  <div className="font-bold text-sm text-slate-900 dark:text-white">Publish Now</div>
                  <div className="text-xs text-slate-400 mt-0.5">Immediately visible to students</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#d82a4e] hover:bg-[#c32646] text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer"
            >
              {isSubmitting ? (
                <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
              ) : publishMode === 'published' ? (
                <><Globe className="w-3.5 h-3.5" />Publish Now</>
              ) : (
                <><Save className="w-3.5 h-3.5" />Save Draft</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminCurriculumUploadPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-[#d82a4e] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Loading curriculum uploader...</p>
          </div>
        </div>
      }
    >
      <AdminCurriculumUploadContent />
    </Suspense>
  );
}
