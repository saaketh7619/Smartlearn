export type Role = 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  avatar: string;
  createdAt: string;
  studentProfile?: StudentProfile;
  teacherProfile?: TeacherProfile;
  parentProfile?: ParentProfile;
}

export interface StudentProfile {
  grade: string;
  school: string;
  rollNumber: string;
  xp: number;
  level: number;
  coins: number;
  streakDays: number;
  lastActive: string;
  enrolledCourseIds: string[];
  badges: string[];
}

export interface TeacherProfile {
  department: string;
  subjects: string[];
  classes: string[];
  experienceYears: number;
  rating: number;
}

export interface ParentProfile {
  childrenIds: string[];
  occupation?: string;
  preferredLanguage: 'en' | 'hi' | 'es';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail: string;
  instructorName: string;
  instructorRole: string;
  rating: number;
  enrollmentCount: number;
  durationHours: number;
  modules: CourseModule[];
}

export interface CourseModule {
  id: string;
  title: string;
  durationMinutes: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  type: 'video' | 'reading' | 'quiz';
  videoUrl?: string;
  contentMarkdown?: string;
  completed?: boolean;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  topic: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Olympiad';
}

export interface Test {
  id: string;
  title: string;
  subject: string;
  grade: string;
  durationMinutes: number;
  totalMarks: number;
  questions: Question[];
  isAdaptive: boolean;
  antiCheatEnabled: boolean;
  createdAt: string;
}

export interface TestSubmission {
  id: string;
  testId: string;
  testTitle: string;
  studentId: string;
  score: number;
  maxScore: number;
  percentage: number;
  completedAt: string;
  timeTakenSeconds: number;
  difficultyBreakdown: {
    easyCorrect: number;
    mediumCorrect: number;
    hardCorrect: number;
  };
  conceptualErrors: number;
  timeManagementErrors: number;
  carelessErrors: number;
  tabSwitchesDetected: number;
  topicScores: { topic: string; score: number; maxScore: number }[];
}

export interface WeakTopic {
  id: string;
  subject: string;
  topic: string;
  accuracyPercentage: number;
  affectedStudentsCount?: number;
  recommendedAction: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  category: 'achievement' | 'streak' | 'mastery' | 'contest';
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'alert' | 'badge' | 'test' | 'message' | 'system';
  read: boolean;
  createdAt: string;
  linkUrl?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  receiverId: string;
  content: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userRole: Role;
  subject: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
}

export interface ModerationItem {
  id: string;
  authorName: string;
  authorRole: Role;
  type: 'Forum Post' | 'Notes Upload' | 'Question Submission';
  contentSnippet: string;
  reasonFlagged: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  timestamp: string;
}

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  name: string;
  avatar: string;
  school: string;
  xp: number;
  level: number;
  streakDays: number;
  tier: 'Diamond' | 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
}
