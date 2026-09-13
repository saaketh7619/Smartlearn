'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  BookOpen,
  Clock,
  Star,
  ArrowRight,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  GraduationCap,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { db } from '@/lib/db';
import { useStore } from '@/store/useStore';
import { useToast } from '@/components/shared/ToastContext';
import { AcademicProfileBadge } from '@/components/shared/AcademicProfileBadge';
import { EmptyCurriculumState } from '@/components/shared/EmptyCurriculumState';
import { getClassAncestors } from '@/lib/curriculumData';
import { assetUrl } from '@/lib/basePath';

// ============================================================
// Curriculum-aware subject card for personalised library
// ============================================================
function CurriculumSubjectCard({ subject, classId, classLevel }: {
  subject: import('@/types').Subject;
  classId: string;
  classLevel: string;
}) {
  const totalChapters = subject.chapters.length;
  const totalResources = subject.chapters.reduce(
    (t, ch) => t + ch.resources.length + ch.concepts.reduce((tc, c) => tc + c.resources.length, 0),
    0
  );
  const hasTextbooks = subject.chapters.some((ch) => ch.resources.some((r) => r.type === 'textbook'));

  const subjectColors: Record<string, string> = {
    Mathematics: 'from-blue-500 to-indigo-600',
    Science: 'from-emerald-500 to-teal-600',
    English: 'from-amber-500 to-orange-600',
    'Social Science': 'from-purple-500 to-violet-600',
    'Information Technology': 'from-slate-500 to-slate-700',
    Physics: 'from-cyan-500 to-blue-600',
    Chemistry: 'from-rose-500 to-pink-600',
    Biology: 'from-green-500 to-emerald-600',
  };
  const gradient = subjectColors[subject.name] || 'from-slate-500 to-slate-700';

  return (
    <Link
      href={`/student/courses/${subject.id}/`}
      prefetch={true}
      className="group flex flex-col p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 relative overflow-hidden"
    >
      {/* Gradient header */}
      <div className={`h-20 rounded-2xl bg-gradient-to-br ${gradient} mb-4 flex items-center justify-center relative overflow-hidden`}>
        <BookOpen className="w-8 h-8 text-white/80" />
        {hasTextbooks && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md text-white text-[9px] font-extrabold flex items-center gap-1 border border-white/20">
            <span>NCERT PDF</span>
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
          </span>
        )}
        <div className="absolute inset-0 bg-white/5" />
      </div>

      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1">{subject.name}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 flex-1">
        {subject.description || `${subject.board ?? ''} ${classLevel} ${subject.name}`}
      </p>

      <div className="flex items-center justify-between text-[10px] text-slate-400">
        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {totalChapters} chapters</span>
        <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {totalResources} resources</span>
        <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold group-hover:gap-2 transition-all">
          Explore <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  );
}

function CoursesContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('q') || searchParams.get('tag') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const currentUser = useStore((state) => state.currentUser);
  const academicProfile = useStore((state) => state.academicProfile);
  const setAcademicProfile = useStore((state) => state.setAcademicProfile);
  const toast = useToast();

  const handleQuickChangeClass = (newClassId: string) => {
    const classMap: Record<string, { level: string; stream: string; name: string }> = {
      'class-10': { level: 'School', stream: 'Secondary', name: 'Class 10' },
      'class-9': { level: 'School', stream: 'Secondary', name: 'Class 9' },
      'class-8': { level: 'School', stream: 'Secondary', name: 'Class 8' },
      'class-7': { level: 'School', stream: 'Secondary', name: 'Class 7' },
      'class-6': { level: 'School', stream: 'Secondary', name: 'Class 6' },
      'class-11-sci': { level: 'Intermediate / Higher Secondary', stream: 'Science', name: 'Class 11' },
      'class-12-sci': { level: 'Intermediate / Higher Secondary', stream: 'Science', name: 'Class 12' },
      'col-yr1': { level: 'College', stream: 'General', name: 'Year 1' },
    };
    const target = classMap[newClassId] || { level: 'School', stream: 'Secondary', name: 'Class 10' };
    setAcademicProfile({
      educationalLevel: target.level,
      stream: target.stream,
      classLevel: target.name,
      classId: newClassId,
      board: 'CBSE',
      subjects: newClassId === 'class-10' ? ['Mathematics', 'Science', 'English', 'Social Science'] : ['General Subjects'],
      learningGoals: ['exam_prep', 'concept_learning'],
      onboardingCompleted: true,
    });
    toast.info('Class Switched', `Now viewing curriculum for ${target.name} (${target.level}).`);
  };

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedSubject, setSelectedSubject] = useState<string>(initialCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'popular' | 'duration' | 'title'>('featured');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('smartlearn_saved_courses');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Get curriculum subjects for this student's class
  const curriculumSubjects = academicProfile?.classId
    ? db.getPublishedSubjectsByClassId(academicProfile.classId)
    : [];

  const classAncestors = academicProfile?.classId
    ? getClassAncestors(academicProfile.classId)
    : null;

  const courses = db.courses;

  const subjects = [
    'All',
    'Mathematics',
    'Physics',
    'Computer Science',
    'Chemistry',
    'Biology',
    'Literature & Humanities',
    'Social Sciences',
  ];

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const grades = ['All', 'Grade 9-10', 'Grade 10-12', 'Grade 11-12'];

  const enrolledCourseIds = currentUser?.studentProfile?.enrolledCourseIds || ['course-calc-1', 'course-phys-1', 'course-ai-1'];

  const toggleBookmark = (id: string, title: string) => {
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      if (typeof window !== 'undefined') {
        localStorage.setItem('smartlearn_saved_courses', JSON.stringify(next));
      }
      if (next.includes(id)) {
        toast.success('Course Saved', `"${title}" has been saved to your bookmarks.`);
      } else {
        toast.info('Bookmark Removed', `"${title}" removed from your bookmarks.`);
      }
      return next;
    });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSubject('All');
    setSelectedDifficulty('All');
    setSelectedGrade('All');
    setSortBy('featured');
    toast.info('Filters Reset', 'Showing all available courses in the catalog.');
  };

  const activeFilterCount =
    (selectedSubject !== 'All' ? 1 : 0) +
    (selectedDifficulty !== 'All' ? 1 : 0) +
    (selectedGrade !== 'All' ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const filteredCourses = useMemo(() => {
    const list = courses.filter((course) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        course.title.toLowerCase().includes(q) ||
        course.description.toLowerCase().includes(q) ||
        course.instructorName.toLowerCase().includes(q) ||
        course.subject.toLowerCase().includes(q);

      const matchesSubject = selectedSubject === 'All' || course.subject === selectedSubject;
      const matchesDifficulty = selectedDifficulty === 'All' || course.difficulty === selectedDifficulty;
      const matchesGrade = selectedGrade === 'All' || course.grade.includes(selectedGrade.replace('Grade ', ''));

      return matchesSearch && matchesSubject && matchesDifficulty && matchesGrade;
    });

    return list.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'popular') return b.enrollmentCount - a.enrollmentCount;
      if (sortBy === 'duration') return b.durationHours - a.durationHours;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0; // 'featured' retains natural DB sequence
    });
  }, [courses, searchQuery, selectedSubject, selectedDifficulty, selectedGrade, sortBy]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Comprehensive Curriculum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Course Library
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Explore accredited CBSE &amp; STEM courses with official NCERT textbooks, adaptive quizzes, and AI doubt solvers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset ({activeFilterCount})</span>
            </button>
          )}
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            {filteredCourses.length} of {courses.length} Courses
          </span>
        </div>
      </div>

      {/* Personalised Academic Curriculum Section */}
      {academicProfile?.onboardingCompleted ? (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-200/60 dark:border-blue-800/40 backdrop-blur-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Your Academic Curriculum
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Structured chapters, concepts, and materials mapped to your academic profile.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Quick Class Switcher Dropdown */}
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-blue-200/80 dark:border-blue-800/80 rounded-xl px-2.5 py-1 text-xs shadow-xs">
                <span className="text-slate-400 font-semibold">Class:</span>
                <select
                  value={academicProfile.classId || 'class-10'}
                  onChange={(e) => handleQuickChangeClass(e.target.value)}
                  className="bg-transparent font-bold text-blue-600 dark:text-blue-400 focus:outline-none cursor-pointer text-xs pr-1"
                  aria-label="Select Class Level"
                >
                  <option value="class-10">Class 10 (Textbooks Ready 📖)</option>
                  <option value="class-9">Class 9 (Coming Soon)</option>
                  <option value="class-8">Class 8 (Coming Soon)</option>
                  <option value="class-7">Class 7 (Coming Soon)</option>
                  <option value="class-6">Class 6 (Coming Soon)</option>
                  <option value="class-11-sci">Class 11 Science (Coming Soon)</option>
                  <option value="class-12-sci">Class 12 Science (Coming Soon)</option>
                  <option value="col-yr1">College Year 1 (Coming Soon)</option>
                </select>
              </div>
              <AcademicProfileBadge profile={academicProfile} />
              <Link
                href="/student/onboarding"
                className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
              >
                Change Class
              </Link>
            </div>
          </div>

          {curriculumSubjects.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {curriculumSubjects.map((sub) => (
                  <CurriculumSubjectCard
                    key={sub.id}
                    subject={sub}
                    classId={academicProfile.classId}
                    classLevel={academicProfile.classLevel}
                  />
                ))}
              </div>

              {/* Class 10 Dedicated NCERT Textbook Hub */}
              {academicProfile.classId === 'class-10' && (
                <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-blue-200/80 dark:border-blue-800/60 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                          Class 10 NCERT Digital Textbooks &amp; Solutions
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Complete chapter PDFs for Mathematics &amp; Science + Social Science modules — offline ready and mapped to CBSE 2025-26.
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800 w-fit flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      Official 10th NCERT Books Attached
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {/* Mathematics Card */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/70 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/20 border border-blue-200/80 dark:border-blue-800/40 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold uppercase">
                            14 Chapters
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">PDF Books</span>
                        </div>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Mathematics Textbook</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          Real Numbers, Polynomials, Linear Equations, Trigonometry, Coordinate Geometry, Statistics &amp; Probability + Solutions.
                        </p>
                      </div>
                      <div className="pt-3 mt-3 border-t border-blue-200/50 dark:border-blue-900/40 flex items-center justify-between gap-2">
                        <a
                          href={assetUrl('/textbooks/class-10/mathematics/jemh101.pdf')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                        >
                          <span>Read Ch 1 PDF</span>
                          <ArrowRight className="w-3 h-3" />
                        </a>
                        <Link
                          href={`/student/courses/${curriculumSubjects.find(s => s.name === 'Mathematics')?.id || 'class-10-math'}`}
                          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          All 14 Chapters &rarr;
                        </Link>
                      </div>
                    </div>

                    {/* Science Card */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200/80 dark:border-emerald-800/40 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold uppercase">
                            13 Chapters
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">PDF Books</span>
                        </div>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Science Textbook</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          Chemical Reactions, Acids &amp; Bases, Life Processes, Reproduction, Light, Electricity, Magnetic Effects &amp; Solutions.
                        </p>
                      </div>
                      <div className="pt-3 mt-3 border-t border-emerald-200/50 dark:border-emerald-900/40 flex items-center justify-between gap-2">
                        <a
                          href={assetUrl('/textbooks/class-10/science/jesc101.pdf')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                        >
                          <span>Read Ch 1 PDF</span>
                          <ArrowRight className="w-3 h-3" />
                        </a>
                        <Link
                          href={`/student/courses/${curriculumSubjects.find(s => s.name === 'Science')?.id || 'class-10-sci'}`}
                          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          All 13 Chapters &rarr;
                        </Link>
                      </div>
                    </div>

                    {/* Social Science Card */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/70 to-violet-50/50 dark:from-purple-950/30 dark:to-violet-950/20 border border-purple-200/80 dark:border-purple-800/40 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-md bg-purple-600 text-white text-[10px] font-bold uppercase">
                            4 Core Books
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">CBSE / NCERT</span>
                        </div>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Social Science</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          History (Nationalism in Europe &amp; India), Geography (Resources &amp; Water), Civics (Power Sharing &amp; Federalism), Economics.
                        </p>
                      </div>
                      <div className="pt-3 mt-3 border-t border-purple-200/50 dark:border-purple-900/40 flex items-center justify-between gap-2">
                        <Link
                          href={`/student/courses/${curriculumSubjects.find(s => s.name === 'Social Science')?.id || 'class-10-social'}`}
                          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                        >
                          <span>Open Chapters</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                        <a
                          href="https://ncert.nic.in/textbook.php?jess1=0-5"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                        >
                          NCERT Portal &rarr;
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <EmptyCurriculumState
              className={academicProfile.classLevel}
              levelName={academicProfile.educationalLevel}
            />
          )}
        </div>
      ) : (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Set up your Academic Profile
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select your School/College level, Class, Board, and Subjects for a tailored syllabus library.
              </p>
            </div>
          </div>
          <Link
            href="/student/onboarding"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            Get Started &rarr;
          </Link>
        </div>
      )}

      {/* Catalog Section Header */}
      <div className="pt-2">
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
          Accredited Electives &amp; General Courses
        </h2>
      </div>

      {/* Search & Sort Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic, instructor, or title (e.g. Calculus, Python, Thermodynamics)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs text-slate-900 dark:text-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="course-sort" className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
            Sort:
          </label>
          <select
            id="course-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="featured">Featured &amp; Recommended</option>
            <option value="popular">Most Popular (Enrolled)</option>
            <option value="rating">Highest Rated (⭐)</option>
            <option value="duration">Longest Duration</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>

          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="sm:hidden px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {subjects.map((sub) => (
          <button
            key={sub}
            onClick={() => setSelectedSubject(sub)}
            className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap font-semibold transition-all cursor-pointer ${
              selectedSubject === sub
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Secondary Filter Bar (Difficulty, Grade) */}
      <div className={`flex flex-wrap items-center gap-4 text-xs font-medium ${showFiltersMobile ? 'flex' : 'hidden sm:flex'}`}>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Difficulty:</span>
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedDifficulty === diff
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Grade:</span>
          {grades.map((gr) => (
            <button
              key={gr}
              onClick={() => setSelectedGrade(gr)}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedGrade === gr
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {gr}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid / Empty State */}
      {filteredCourses.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No courses match your criteria</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try loosening your search terms or clearing the subject and grade filters to discover more courses.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredCourses.map((course) => {
            const isEnrolled = enrolledCourseIds.includes(course.id);
            const isBookmarked = bookmarkedIds.includes(course.id);

            return (
              <div
                key={course.id}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail & Badges */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-800">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                        {course.subject}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-600/90 text-white text-[10px] font-bold">
                        {course.grade}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={() => toggleBookmark(course.id, course.title)}
                        aria-label={isBookmarked ? 'Remove bookmark' : 'Save course'}
                        className="p-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white hover:text-amber-400 transition-colors cursor-pointer"
                        title={isBookmarked ? 'Bookmarked' : 'Bookmark course'}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <Bookmark className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <span className="px-2 py-0.5 rounded-md bg-white/90 dark:bg-slate-900/90 text-amber-500 text-[10px] font-bold flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 fill-amber-500" />
                        {course.rating}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                      <span className="font-medium opacity-90">{course.enrollmentCount} enrolled</span>
                      {isEnrolled && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/90 text-white font-bold text-[10px]">
                          <CheckCircle2 className="w-3 h-3" />
                          Enrolled
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {course.durationHours} hours
                      </span>
                      <span className="font-semibold text-purple-600 dark:text-purple-400">
                        {course.difficulty}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400">Instructor</p>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[130px]">
                          {course.instructorName}
                        </p>
                      </div>
                      <Link
                        href={`/student/courses/${course.id}/`}
                        prefetch={true}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 ${
                          isEnrolled
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        <span>{isEnrolled ? 'Continue' : 'Start'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
          Loading Course Library...
        </div>
      }
    >
      <CoursesContent />
    </Suspense>
  );
}
