'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  BookOpen,
  BrainCircuit,
  Clock,
  Sparkles,
  Share2,
  FileQuestion,
  HelpCircle,
  Video,
  FileText,
  CheckSquare,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  Eye,
  GraduationCap,
  Layers,
  Award,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { db } from '@/lib/db';
import { useToast } from '@/components/shared/ToastContext';
import { CourseHierarchyBrowser } from '@/components/shared/CourseHierarchyBrowser';
import { getClassAncestors } from '@/lib/curriculumData';
import { assetUrl } from '@/lib/basePath';
import { Subject, LearningResource, Chapter } from '@/types';

// ============================================================
// Subject Curriculum Deep-Dive View Component
// ============================================================
function SubjectCurriculumView({
  subject,
}: {
  subject: Subject;
}) {
  const toast = useToast();
  const academicProfile = useStore((state) => state.academicProfile);
  const bookmarkedResourceIds = useStore((state) => state.bookmarkedResourceIds);
  const toggleBookmarkResource = useStore((state) => state.toggleBookmarkResource);
  const addRecentlyViewed = useStore((state) => state.addRecentlyViewed);
  const addXP = useStore((state) => state.addXP);
  const triggerConfetti = useStore((state) => state.triggerConfetti);

  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>(() => {
    // Expand first chapter by default
    const firstId = subject.chapters[0]?.id;
    return firstId ? { [firstId]: true } : {};
  });

  const [activeResourceModal, setActiveResourceModal] = useState<LearningResource | null>(null);

  // Find class ancestors
  const classId = subject.classId || academicProfile?.classId || 'class-10';
  const ancestors = getClassAncestors(classId);

  const totalChapters = subject.chapters.length;
  const totalConcepts = subject.chapters.reduce((sum, ch) => sum + ch.concepts.length, 0);
  const totalResources = subject.chapters.reduce(
    (sum, ch) =>
      sum +
      ch.resources.length +
      ch.concepts.reduce((cSum, c) => cSum + c.resources.length, 0),
    0
  );

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const handleOpenResource = (res: LearningResource, chapter: Chapter) => {
    db.incrementResourceView(res.id);
    addRecentlyViewed({
      resourceId: res.id,
      resourceTitle: res.title,
      subjectName: subject.name,
      chapterTitle: chapter.title,
      viewedAt: new Date().toISOString(),
      resourceType: res.type,
    });
    addXP(15, `Studied ${res.title}`);

    const rawUrl = res.fileUrl || res.externalUrl;
    if (rawUrl) {
      const resourceUrl = rawUrl.startsWith('http') ? rawUrl : assetUrl(rawUrl);
      window.open(resourceUrl, '_blank', 'noopener,noreferrer');
      toast.success('Resource Opened', `Viewing "${res.title}" in a new tab.`);
    } else {
      setActiveResourceModal(res);
    }
  };

  const handleToggleBookmark = (res: LearningResource) => {
    toggleBookmarkResource(res.id);
    const isBookmarked = bookmarkedResourceIds.includes(res.id);
    if (!isBookmarked) {
      toast.success('Bookmarked', `"${res.title}" saved to your study bookmarks.`);
    } else {
      toast.info('Bookmark Removed', `"${res.title}" removed from your bookmarks.`);
    }
  };

  const getResourceIcon = (type: LearningResource['type']) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 text-blue-500" />;
      case 'notes':
      case 'textbook':
      case 'syllabus':
        return <FileText className="w-4 h-4 text-rose-500" />;
      case 'quiz':
      case 'practice_test':
      case 'assignment':
      case 'worksheet':
        return <CheckSquare className="w-4 h-4 text-amber-500" />;
      case 'external_link':
      case 'flashcards':
      default:
        return <ExternalLink className="w-4 h-4 text-purple-500" />;
    }
  };

  const getResourceTypeBadge = (type: LearningResource['type']) => {
    switch (type) {
      case 'video':
        return 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'notes':
      case 'textbook':
      case 'syllabus':
        return 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      case 'quiz':
      case 'practice_test':
      case 'assignment':
      case 'worksheet':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'external_link':
      case 'flashcards':
      default:
        return 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation */}
      <CourseHierarchyBrowser
        items={[
          { label: ancestors.level?.name || 'School', href: '/student/courses' },
          { label: ancestors.classLevel?.name || 'Class 10', href: '/student/courses' },
          { label: subject.name },
        ]}
      />

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-extrabold uppercase tracking-wider">
              {subject.board || 'CBSE'} Syllabus
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold">
              {ancestors.classLevel?.name || 'Class 10'}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold">
              {subject.language || 'English'} Medium
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {subject.name}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              {subject.description ||
                `Official ${subject.board || 'CBSE'} syllabus mapped into sequential chapters, fundamental conceptual notes, video lectures, and practice problems.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/15">
            <div className="flex items-center gap-4 sm:gap-6 text-xs text-blue-100 font-medium">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-white" />
                <strong>{totalChapters}</strong> Chapters
              </span>
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-white" />
                <strong>{totalConcepts}</strong> Key Concepts
              </span>
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-white" />
                <strong>{totalResources}</strong> Learning Materials
              </span>
            </div>

            <Link
              href={`/student/tutor?q=I%20need%20help%20with%20${encodeURIComponent(subject.name)}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold transition-all shadow-md"
            >
              <BrainCircuit className="w-4 h-4 text-blue-600" />
              Ask AI Tutor About {subject.name}
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Layout: Chapter Accordions (2 cols) + Sticky Quick Jump (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chapters Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Syllabus Chapters ({totalChapters})
            </h2>
            <button
              onClick={() => {
                const allExpanded = Object.keys(expandedChapters).length === subject.chapters.length;
                if (allExpanded) {
                  setExpandedChapters({});
                } else {
                  const all: Record<string, boolean> = {};
                  subject.chapters.forEach((ch) => (all[ch.id] = true));
                  setExpandedChapters(all);
                }
              }}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              {Object.keys(expandedChapters).length === subject.chapters.length
                ? 'Collapse All'
                : 'Expand All'}
            </button>
          </div>

          {subject.chapters.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No chapters published yet
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Content for this subject is currently being curated by curriculum editors.
              </p>
            </div>
          ) : (
            subject.chapters.map((chapter, chIdx) => {
              const isOpen = !!expandedChapters[chapter.id];
              const chapterAllResources = [
                ...chapter.resources,
                ...chapter.concepts.flatMap((c) => c.resources),
              ];

              return (
                <div
                  key={chapter.id}
                  id={`chapter-${chapter.id}`}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-all"
                >
                  {/* Chapter Accordion Header */}
                  <button
                    onClick={() => toggleChapter(chapter.id)}
                    className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                      <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-extrabold text-sm flex-shrink-0">
                        {chIdx + 1}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                          {chapter.title}
                        </h3>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                          <span>{chapter.concepts.length} concepts</span>
                          <span>•</span>
                          <span>{chapterAllResources.length} materials</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* Chapter Content Body */}
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 space-y-4 border-t border-slate-100 dark:border-slate-800">
                      {chapter.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {chapter.description}
                        </p>
                      )}

                      {/* Concepts pills */}
                      {chapter.concepts.length > 0 && (
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2 block">
                            Key Concepts &amp; Topics
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {chapter.concepts.map((concept, cIdx) => (
                              <span
                                key={concept.id}
                                className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 text-xs font-medium"
                              >
                                {cIdx + 1}. {concept.title}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Resources List */}
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2 block">
                          Study Materials &amp; Media ({chapterAllResources.length})
                        </span>

                        {chapterAllResources.length === 0 ? (
                          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 text-center">
                            <p className="text-xs text-slate-400">
                              No study materials uploaded for this chapter yet.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {chapterAllResources.map((res) => {
                              const isBookmarked = bookmarkedResourceIds.includes(res.id);
                              return (
                                <div
                                  key={res.id}
                                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                                >
                                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                                    <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs flex-shrink-0">
                                      {getResourceIcon(res.type)}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                          {res.title}
                                        </h4>
                                        <span
                                          className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${getResourceTypeBadge(
                                            res.type
                                          )}`}
                                        >
                                          {res.type}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                                        <span className="flex items-center gap-1">
                                          <Eye className="w-3 h-3" />
                                          {res.viewCount} views
                                        </span>
                                        {res.language && <span>• {res.language}</span>}
                                        {res.tags.length > 0 && (
                                          <span>• {res.tags.slice(0, 2).join(', ')}</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                                    {/* Bookmark Button */}
                                    <button
                                      onClick={() => handleToggleBookmark(res)}
                                      className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                                        isBookmarked
                                          ? 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                                          : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                      }`}
                                      title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Resource'}
                                    >
                                      {isBookmarked ? (
                                        <BookmarkCheck className="w-4 h-4" />
                                      ) : (
                                        <Bookmark className="w-4 h-4" />
                                      )}
                                    </button>

                                    {/* Study / Open Button */}
                                    <button
                                      onClick={() => handleOpenResource(res, chapter)}
                                      className={`px-3.5 py-1.5 rounded-xl text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                                        res.type === 'textbook'
                                          ? 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700'
                                          : 'bg-blue-600 hover:bg-blue-700'
                                      }`}
                                    >
                                      {res.type === 'textbook' ? (
                                        <>
                                          <span>Read PDF</span>
                                          <BookOpen className="w-3.5 h-3.5" />
                                        </>
                                      ) : (
                                        <>
                                          <span>Study</span>
                                          <ExternalLink className="w-3.5 h-3.5" />
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Quick Chapter Navigator */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-500" />
              Quick Chapter Index
            </h3>
            <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
              {subject.chapters.map((ch, idx) => (
                <button
                  key={ch.id}
                  onClick={() => {
                    setExpandedChapters((prev) => ({ ...prev, [ch.id]: true }));
                    const el = document.getElementById(`chapter-${ch.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 truncate cursor-pointer"
                >
                  <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="truncate">{ch.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Doubt Solver Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-blue-500/10 border border-purple-200 dark:border-purple-900/50 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Stuck on a formula or theorem?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Ask our SmartLearn AI tutor for step-by-step mathematical proofs, intuitive analogies, or practice questions.
            </p>
            <Link
              href={`/student/tutor?q=Explain%20key%20theorems%20in%20${encodeURIComponent(subject.name)}`}
              className="block text-center py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              Open AI Tutor for {subject.name}
            </Link>
          </div>

          {/* Syllabus Compliance Info */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
              <Award className="w-4 h-4 text-emerald-500" />
              <span>Accredited Academic Standard</span>
            </div>
            <p className="leading-relaxed">
              Mapped directly to official {subject.board || 'CBSE'} guidelines. All modules are reviewed for board exam readiness and competitive foundation tests.
            </p>
          </div>
        </div>
      </div>

      {/* Resource Viewer Modal for items without external URLs */}
      {activeResourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50">
                  {getResourceIcon(activeResourceModal.type)}
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                  {activeResourceModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveResourceModal(null)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <p>
                <strong>Format:</strong> {activeResourceModal.type.toUpperCase()}
              </p>
              <p>
                <strong>Language:</strong> {activeResourceModal.language || 'English'}
              </p>
              <p>
                <strong>Content Status:</strong> Verified curriculum resource. Real textbook chapter notes will be displayed here when supplied by the administrator.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveResourceModal(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Main Client Component: Subject vs Course Router
// ============================================================
export default function CourseDetailClient() {
  const params = useParams();
  const courseId = params?.id as string;

  // Check if this ID is a curriculum Subject
  const subject = db.getSubjectById(courseId);
  if (subject) {
    return <SubjectCurriculumView subject={subject} />;
  }

  // Otherwise, handle as general flat Course
  const course = db.getCourseById(courseId) || db.courses[0] || {
    id: 'course-default',
    title: 'General Curriculum Course',
    description: 'Explore comprehensive STEM lessons and modules.',
    subject: 'General',
    grade: 'Grade 10',
    difficulty: 'Intermediate' as const,
    thumbnail: '',
    instructorName: 'SmartLearn Faculty',
    instructorRole: 'Curriculum Director',
    rating: 4.9,
    enrollmentCount: 100,
    durationHours: 10,
    modules: [],
  };
  const addXP = useStore((state) => state.addXP);
  const triggerConfetti = useStore((state) => state.triggerConfetti);

  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Record<number, boolean>>({
    0: true,
  });
  const [showAiSummary, setShowAiSummary] = useState(false);

  const lessons =
    course?.modules && course.modules.length > 0 && course.modules[0]?.lessons?.length > 0
      ? course.modules.flatMap((m) => m?.lessons || [])
      : [
          { id: 'les-1', title: '1. Foundations & Intuition', durationMinutes: 15, type: 'video' },
          { id: 'les-2', title: '2. Deep Dive & Core Axioms', durationMinutes: 25, type: 'video' },
          { id: 'les-3', title: '3. Real-World Applications & Edge Cases', durationMinutes: 20, type: 'reading' },
          { id: 'les-4', title: '4. Module Mastery Check Quiz', durationMinutes: 15, type: 'quiz' },
        ];

  const currentLesson = lessons[activeLessonIndex] || lessons[0];

  const handleCompleteLesson = () => {
    if (!completedLessons[activeLessonIndex]) {
      setCompletedLessons((prev) => ({ ...prev, [activeLessonIndex]: true }));
      addXP(50, `Completed: ${currentLesson.title}`);
      triggerConfetti();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/student/courses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Course Library
        </Link>
        <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-bold">
          {course.subject} · {course.difficulty}
        </span>
      </div>

      {/* Main Grid: Player + Syllabus */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Video / Content Player */}
        <div className="lg:col-span-2 space-y-4">
          {/* Mock Video Container */}
          <div className="relative aspect-video rounded-3xl bg-slate-900 overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center group">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="absolute inset-0 w-full h-full object-cover opacity-35"
            />
            <div className="relative z-10 flex flex-col items-center text-center p-4">
              <button
                className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-xl shadow-blue-500/30 group-hover:scale-110 transition-transform mb-3 focus:outline-none"
                onClick={handleCompleteLesson}
                title="Play Lesson"
              >
                <Play className="w-7 h-7 fill-white translate-x-0.5" />
              </button>
              <h4 className="text-white font-bold text-base sm:text-lg">{currentLesson.title}</h4>
              <p className="text-xs text-slate-300 mt-1">
                {currentLesson.durationMinutes} mins · High Definition Lecture with AI Interactive Prompts
              </p>
            </div>
          </div>

          {/* Lesson Action Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{course.title}</h2>
              <p className="text-xs text-slate-500">Taught by {course.instructorName} · {course.instructorRole}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAiSummary(!showAiSummary)}
                className="px-3.5 py-2 rounded-xl border border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI Key Takeaways
              </button>

              <button
                onClick={handleCompleteLesson}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                  completedLessons[activeLessonIndex]
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {completedLessons[activeLessonIndex] ? 'Completed (+50 XP)' : 'Mark Complete'}
              </button>
            </div>
          </div>

          {/* AI Summary Dropdown Panel */}
          {showAiSummary && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-blue-500/10 border border-purple-300/60 dark:border-purple-800/60 animate-in fade-in duration-150">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4" />
                  SmartLearn AI Automated Lesson Summary
                </span>
                <span className="text-[10px] text-slate-400">Generated in 0.4s</span>
              </div>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>Core Principle: Differentiation measures instantaneous rate of change as secant lines approach tangent lines.</li>
                <li>Chain Rule Formula: d/dx [f(g(x))] = f&apos;(g(x)) * g&apos;(x). Always multiply the outer derivative by the inner derivative.</li>
                <li>Common Exam Mistake: Forgetting to take the derivative of the inside polynomial term.</li>
              </ul>
            </div>
          )}

          {/* Lesson Notes & Text Content */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Lesson Study Notes</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              In this module, we construct the foundation of continuous mathematical models. Whenever you encounter
              physics kinematics problems involving displacement, velocity is the first derivative with respect to time,
              and acceleration is the second derivative. Keep your notebook handy or use SmartLearn&apos;s AI revision
              generator to create flashcards directly from these lecture points.
            </p>
          </div>
        </div>

        {/* Right: Course Syllabus & Module Outline */}
        <div className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Course Syllabus</h3>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">
              {Object.keys(completedLessons).length} of {lessons.length} done
            </span>
          </div>

          <div className="space-y-2">
            {lessons.map((les, idx) => {
              const isActive = activeLessonIndex === idx;
              const isDone = completedLessons[idx];
              return (
                <div
                  key={les.id}
                  onClick={() => setActiveLessonIndex(idx)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 shadow-xs'
                      : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCompletedLessons((prev) => ({ ...prev, [idx]: !prev[idx] }));
                      }}
                      className="focus:outline-none"
                    >
                      <CheckCircle2
                        className={`w-4 h-4 flex-shrink-0 ${
                          isDone ? 'text-emerald-500 fill-emerald-500/20' : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold truncate ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {les.title}
                      </p>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {les.durationMinutes}m · {les.type.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {isActive && <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">Playing</span>}
                </div>
              );
            })}
          </div>

          {/* Quick AI Tutor Help trigger */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <Link
              href={`/student/tutor?q=I%20have%20a%20doubt%20on%20${encodeURIComponent(course.title)}`}
              className="inline-flex items-center justify-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Ask AI Tutor about this lesson
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
