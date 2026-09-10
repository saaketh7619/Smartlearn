'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  GraduationCap, ChevronRight, ChevronLeft, Check, Sparkles,
  BookOpen, Target, School, Building2, Cpu, FlaskConical, Briefcase,
  X,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { StudentAcademicProfile, LearningGoal } from '@/types';
import { EDUCATIONAL_LEVELS, BOARDS } from '@/lib/curriculumData';
import { useToast } from '@/components/shared/ToastContext';

const STEP_LABELS = [
  'Education Level',
  'Stream',
  'Class / Year',
  'Board',
  'Subjects',
  'Goals',
];

const LEVEL_ICONS: Record<string, React.ReactNode> = {
  'School': <School className="w-5 h-5" />,
  'Intermediate / Higher Secondary': <BookOpen className="w-5 h-5" />,
  'College': <Building2 className="w-5 h-5" />,
  'B.Tech': <Cpu className="w-5 h-5" />,
  'M.Tech': <FlaskConical className="w-5 h-5" />,
  'Other / Professional': <Briefcase className="w-5 h-5" />,
};

const LEARNING_GOAL_OPTIONS: { value: LearningGoal; label: string; icon: string; desc: string }[] = [
  { value: 'exam_prep', label: 'Exam Preparation', icon: '📝', desc: 'Board exams, competitive tests, entrance exams' },
  { value: 'concept_learning', label: 'Concept Learning', icon: '💡', desc: 'Deep understanding of topics from scratch' },
  { value: 'practice', label: 'Practice & Drill', icon: '🎯', desc: 'Solve problems, question banks, mock papers' },
  { value: 'revision', label: 'Revision', icon: '🔄', desc: 'Quick revision with flashcards and summaries' },
  { value: 'competitive_exams', label: 'Competitive Exams', icon: '🏆', desc: 'JEE, NEET, UPSC, Olympiads, etc.' },
];

// Default subjects by class
function getDefaultSubjects(classId: string): string[] {
  if (classId === 'class-10') return ['Mathematics', 'Science', 'English', 'Social Science'];
  if (classId === 'class-9') return ['Mathematics', 'Science', 'English', 'Social Science'];
  if (classId.startsWith('class-') && parseInt(classId.replace('class-', '')) <= 8) {
    return ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi'];
  }
  if (classId.includes('sci')) return ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English'];
  if (classId.includes('com')) return ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'English'];
  if (classId.includes('arts')) return ['History', 'Geography', 'Political Science', 'Economics', 'English'];
  if (classId.includes('btech') || classId.includes('mtech')) return ['Engineering Mathematics', 'Data Structures', 'Computer Networks', 'OS', 'DBMS'];
  return ['Mathematics', 'Science', 'English'];
}

export default function StudentOnboardingPage() {
  const router = useRouter();
  const toast = useToast();
  const { currentUser, academicProfile, setAcademicProfile, triggerConfetti } = useStore();

  const [step, setStep] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedStream, setSelectedStream] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('CBSE');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<LearningGoal[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not a student
  useEffect(() => {
    if (currentUser && currentUser.role !== 'STUDENT') {
      router.replace(`/${currentUser.role.toLowerCase()}`);
    }
  }, [currentUser, router]);

  // If profile already set, let them re-do or skip
  const isEditing = !!academicProfile;

  const currentLevel = EDUCATIONAL_LEVELS.find((l) => l.name === selectedLevel);
  const currentStream = currentLevel?.streams.find((s) => s.name === selectedStream);

  // Auto-set subjects when class changes
  useEffect(() => {
    if (selectedClassId) {
      setSelectedSubjects(getDefaultSubjects(selectedClassId));
    }
  }, [selectedClassId]);

  const totalSteps = STEP_LABELS.length;
  const progress = ((step + 1) / totalSteps) * 100;

  const canProceed = () => {
    if (step === 0) return !!selectedLevel;
    if (step === 1) return currentLevel?.streams.length === 0 || !!selectedStream;
    if (step === 2) return !!selectedClass && !!selectedClassId;
    if (step === 3) return !!selectedBoard;
    if (step === 4) return selectedSubjects.length > 0;
    if (step === 5) return selectedGoals.length > 0;
    return false;
  };

  const handleNext = () => {
    if (step === 1 && (!currentLevel?.streams.length || currentLevel.streams.length === 1)) {
      // Auto-select single stream
      if (currentLevel?.streams.length === 1) {
        setSelectedStream(currentLevel.streams[0].name);
      }
      setStep(2);
      return;
    }
    if (step < totalSteps - 1) setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleComplete = async () => {
    setIsSubmitting(true);

    const profile: StudentAcademicProfile = {
      educationalLevel: selectedLevel,
      stream: selectedStream,
      classLevel: selectedClass,
      classId: selectedClassId,
      board: selectedBoard,
      subjects: selectedSubjects,
      learningGoals: selectedGoals,
      onboardingCompleted: true,
    };

    setAcademicProfile(profile);
    triggerConfetti();

    toast.success(
      'Academic Profile Saved!',
      `Your courses and resources are now personalised for ${selectedClass} · ${selectedBoard}.`
    );

    setTimeout(() => {
      router.push('/student');
    }, 800);
  };

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  const toggleGoal = (goal: LearningGoal) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {isEditing ? 'Update Your Profile' : 'Welcome to SmartLearn'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            {isEditing ? 'Update Your Academic Profile' : "Let's personalise your learning"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Tell us about your studies so we can show you the right courses, resources, and tests.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Step {step + 1} of {totalSteps} — {STEP_LABELS[step]}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Step dots */}
          <div className="flex items-center justify-between mt-2">
            {STEP_LABELS.map((label, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                  idx < step
                    ? 'bg-blue-600 text-white'
                    : idx === step
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/40'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}>
                  {idx < step ? <Check className="w-3 h-3" /> : idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#1a1e24] rounded-3xl border border-slate-200 dark:border-[#283038] shadow-xl p-6 sm:p-8 space-y-6">

          {/* Step 0: Educational Level */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">I am studying at…</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EDUCATIONAL_LEVELS.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => { setSelectedLevel(level.name); setSelectedStream(''); setSelectedClass(''); setSelectedClassId(''); }}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      selectedLevel === level.name
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300'
                        : 'border-slate-200 dark:border-[#283038] hover:border-blue-300 dark:hover:border-blue-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-xl">{level.icon}</span>
                    <div>
                      <div className="font-bold text-sm">{level.name}</div>
                      <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{level.description}</div>
                    </div>
                    {selectedLevel === level.name && (
                      <div className="ml-auto w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Stream */}
          {step === 1 && currentLevel && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Select your stream in {selectedLevel}
              </h2>
              {currentLevel.streams.length === 0 ? (
                <p className="text-sm text-slate-500">No streams available — click Next to continue.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentLevel.streams.map((stream) => (
                    <button
                      key={stream.id}
                      onClick={() => { setSelectedStream(stream.name); setSelectedClass(''); setSelectedClassId(''); }}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                        selectedStream === stream.name
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                          : 'border-slate-200 dark:border-[#283038] hover:border-blue-300 dark:hover:border-blue-700'
                      }`}
                    >
                      <GraduationCap className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">{stream.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{stream.classes.length} classes</div>
                      </div>
                      {selectedStream === stream.name && (
                        <Check className="ml-auto w-4 h-4 text-blue-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Class/Year */}
          {step === 2 && currentStream && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Select your class / year
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {currentStream.classes.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => { setSelectedClass(cls.name); setSelectedClassId(cls.id); }}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      selectedClassId === cls.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                        : 'border-slate-200 dark:border-[#283038] hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                  >
                    <span className="text-2xl mb-1">📖</span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{cls.name}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{cls.subjects.length > 0 ? `${cls.subjects.filter(s => s.status === 'published').length} published subjects` : 'Content pending'}</span>
                    {selectedClassId === cls.id && (
                      <div className="mt-1.5 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Board */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Select your board or university
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
                {BOARDS.map((board) => (
                  <button
                    key={board}
                    onClick={() => setSelectedBoard(board)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer text-sm ${
                      selectedBoard === board
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 font-bold text-blue-700 dark:text-blue-300'
                        : 'border-slate-200 dark:border-[#283038] text-slate-700 dark:text-slate-300 hover:border-blue-300'
                    }`}
                  >
                    <span>{board}</span>
                    {selectedBoard === board && <Check className="w-4 h-4 text-blue-500" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Subjects */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Select your subjects
                </h2>
                <p className="text-xs text-slate-500 mt-1">Select all subjects you are studying. You can change this later.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {getDefaultSubjects(selectedClassId).map((subject) => (
                  <button
                    key={subject}
                    onClick={() => toggleSubject(subject)}
                    className={`px-3.5 py-2 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                      selectedSubjects.includes(subject)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300'
                        : 'border-slate-200 dark:border-[#283038] text-slate-600 dark:text-slate-400 hover:border-blue-300'
                    }`}
                  >
                    {selectedSubjects.includes(subject) && <Check className="w-3 h-3 inline mr-1" />}
                    {subject}
                  </button>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-400">Can't find a subject? You can add custom subjects from your profile settings.</p>
              </div>
            </div>
          )}

          {/* Step 5: Learning Goals */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  What are your learning goals?
                </h2>
                <p className="text-xs text-slate-500 mt-1">Select all that apply. This helps personalise your tests, revision, and planner.</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {LEARNING_GOAL_OPTIONS.map((goal) => (
                  <button
                    key={goal.value}
                    onClick={() => toggleGoal(goal.value)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      selectedGoals.includes(goal.value)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                        : 'border-slate-200 dark:border-[#283038] hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                  >
                    <span className="text-2xl">{goal.icon}</span>
                    <div className="flex-1">
                      <div className="font-bold text-sm text-slate-900 dark:text-white">{goal.label}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{goal.desc}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      selectedGoals.includes(goal.value)
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {selectedGoals.includes(goal.value) && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <div className="flex items-center gap-3">
              {!isEditing && (
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      sessionStorage.setItem('sl_skip_onboarding', 'true');
                    }
                    router.push('/student');
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                >
                  Skip for now
                </button>
              )}

              {step < totalSteps - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  disabled={!canProceed() || isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer"
                >
                  {isSubmitting ? (
                    <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
                  ) : (
                    <><Sparkles className="w-3.5 h-3.5" />Start Learning!</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Summary preview */}
        {(selectedLevel || selectedStream || selectedClass) && (
          <div className="mt-4 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400">
            <GraduationCap className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            {[selectedLevel, selectedStream, selectedClass, selectedBoard].filter(Boolean).map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <ChevronRight className="w-3 h-3" />}
                <span className="font-semibold text-slate-700 dark:text-slate-300">{item}</span>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
