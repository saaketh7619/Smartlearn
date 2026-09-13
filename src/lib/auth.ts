import { Role, User } from '@/types';
import { db } from './db';

export const DEMO_ACCOUNTS = {
  STUDENT: {
    email: 'student@smartlearn.edu',
    name: 'Alex Rivera',
    role: 'STUDENT' as Role,
    id: 'user-student-alex',
    label: 'Demo Student',
    accent: 'blue',
    description: 'Explore adaptive mock tests, AI tutor, study planner, gamified XP, and courses.',
    redirectUrl: '/student/',
  },
  TEACHER: {
    email: 'teacher@smartlearn.edu',
    name: 'Dr. Sarah Jenkins',
    role: 'TEACHER' as Role,
    id: 'user-teacher-sarah',
    label: 'Demo Teacher',
    accent: 'purple',
    description: 'Class average analytics, AI question paper generator, and anti-cheat test controls.',
    redirectUrl: '/teacher/',
  },
  PARENT: {
    email: 'parent@smartlearn.edu',
    name: 'Priya Sharma',
    role: 'PARENT' as Role,
    id: 'user-parent-priya',
    label: 'Demo Parent',
    accent: 'emerald',
    description: 'Multi-child selector, progress ring, smart alerts, and text-to-speech read aloud.',
    redirectUrl: '/parent/',
  },
  ADMIN: {
    email: 'admin@smartlearn.edu',
    name: 'Marcus Vance',
    role: 'ADMIN' as Role,
    id: 'user-admin-marcus',
    label: 'Demo Admin',
    accent: 'amber',
    description: 'KPI stat cards, user management with RBAC, moderation queue, and support tickets.',
    redirectUrl: '/admin/',
  },
};

// Simple reliable JWT / Session Token Simulator (works without native C++ compilation)
export function createSessionToken(user: User): string {
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export function verifySessionToken(token: string): { sub: string; email: string; name: string; role: Role } | null {
  try {
    const jsonStr = Buffer.from(token, 'base64').toString('utf-8');
    const parsed = JSON.parse(jsonStr);
    if (parsed.exp && parsed.exp < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

// In-memory OTP cache for demo verification
const OTP_STORE = new Map<string, { code: string; expiresAt: number }>();

export function generateOTP(identifier: string): string {
  // Generate a random realistic 6-digit demo OTP code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  OTP_STORE.set(identifier.toLowerCase(), {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
  });
  return code;
}

export function verifyOTP(identifier: string, code: string): boolean {
  const cleanId = identifier.toLowerCase().trim();
  const cleanCode = code.trim();
  // Allow demo universal code 123456 anytime for convenience
  if (cleanCode === '123456') return true;
  const entry = OTP_STORE.get(cleanId);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) return false;
  return entry.code === cleanCode;
}
