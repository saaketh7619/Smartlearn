import { Role, User } from '@/types';
import { INITIAL_USERS } from './db';

export interface RegisteredAccount {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: Role;
  gradeOrDept?: string;
  createdAt: string;
}

const STORAGE_KEY = 'sl_registered_accounts';

/**
 * Pre-seeded accounts guaranteed to always exist and authenticate
 */
export const DEFAULT_ACCOUNTS: RegisteredAccount[] = [
  {
    id: 'user-student-alex',
    email: 'student@smartlearn.edu',
    password: 'smartlearn123',
    fullName: 'Alex Rivera',
    role: 'STUDENT',
    gradeOrDept: 'Grade 10-A',
    createdAt: '2026-01-15T08:00:00.000Z',
  },
  {
    id: 'user-teacher-sarah',
    email: 'teacher@smartlearn.edu',
    password: 'smartlearn123',
    fullName: 'Dr. Sarah Jenkins',
    role: 'TEACHER',
    gradeOrDept: 'Advanced Mathematics',
    createdAt: '2025-08-10T09:00:00.000Z',
  },
  {
    id: 'user-teacher-sarah-alias',
    email: 'sarah@smartlearn.edu',
    password: 'smartlearn123',
    fullName: 'Dr. Sarah Jenkins',
    role: 'TEACHER',
    gradeOrDept: 'Advanced Mathematics',
    createdAt: '2025-08-10T09:00:00.000Z',
  },
  {
    id: 'user-parent-priya',
    email: 'parent@smartlearn.edu',
    password: 'smartlearn123',
    fullName: 'Priya Sharma',
    role: 'PARENT',
    createdAt: '2025-09-01T10:00:00.000Z',
  },
  {
    id: 'user-parent-priya-alias',
    email: 'priya@smartlearn.edu',
    password: 'smartlearn123',
    fullName: 'Priya Sharma',
    role: 'PARENT',
    createdAt: '2025-09-01T10:00:00.000Z',
  },
  {
    id: 'user-admin-marcus',
    email: 'admin@smartlearn.edu',
    password: 'smartlearn123',
    fullName: 'Marcus Vance',
    role: 'ADMIN',
    createdAt: '2025-06-01T07:30:00.000Z',
  },
  {
    id: 'user-student-saicharan',
    email: 'saicharanmindi146@gmail.com',
    password: 'smartlearn123',
    fullName: 'Sai Charan',
    role: 'STUDENT',
    gradeOrDept: 'Grade 10-A',
    createdAt: '2026-09-12T05:00:00.000Z',
  },
];

/**
 * Loads all registered accounts from localStorage combined with defaults
 */
export function getAllRegisteredAccounts(): RegisteredAccount[] {
  if (typeof window === 'undefined') return DEFAULT_ACCOUNTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const stored: RegisteredAccount[] = raw ? JSON.parse(raw) : [];
    
    // Merge defaults so default accounts are never lost
    const map = new Map<string, RegisteredAccount>();
    for (const acc of DEFAULT_ACCOUNTS) {
      map.set(acc.email.toLowerCase().trim(), acc);
    }
    for (const acc of stored) {
      map.set(acc.email.toLowerCase().trim(), acc);
    }
    return Array.from(map.values());
  } catch {
    return DEFAULT_ACCOUNTS;
  }
}

/**
 * Saves an account to local storage
 */
export function saveRegisteredAccount(account: RegisteredAccount): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getAllRegisteredAccounts();
    const cleanEmail = account.email.toLowerCase().trim();
    const updated = current.filter((a) => a.email.toLowerCase().trim() !== cleanEmail);
    updated.push(account);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

/**
 * Finds an account by email (case-insensitive)
 */
export function findAccountByEmail(email: string): RegisteredAccount | undefined {
  const clean = email.toLowerCase().trim();
  const all = getAllRegisteredAccounts();
  return all.find((a) => a.email.toLowerCase().trim() === clean);
}

/**
 * Converts a RegisteredAccount to a full SmartLearn User session object
 */
export function accountToUser(account: RegisteredAccount): User {
  const baseUser =
    account.role === 'STUDENT'
      ? INITIAL_USERS[0]
      : account.role === 'TEACHER'
      ? INITIAL_USERS[1]
      : account.role === 'PARENT'
      ? INITIAL_USERS[2]
      : INITIAL_USERS[3];

  return {
    ...baseUser,
    id: account.id,
    name: account.fullName,
    email: account.email,
    role: account.role,
    studentProfile:
      account.role === 'STUDENT' && baseUser.studentProfile
        ? {
            ...baseUser.studentProfile,
            grade: account.gradeOrDept || baseUser.studentProfile.grade,
          }
        : baseUser.studentProfile,
    teacherProfile:
      account.role === 'TEACHER' && baseUser.teacherProfile
        ? {
            ...baseUser.teacherProfile,
            department: account.gradeOrDept || baseUser.teacherProfile.department,
          }
        : baseUser.teacherProfile,
  };
}

/**
 * Registers a new account locally and prepares the session
 */
export function registerLocalAccount(params: {
  email: string;
  password: string;
  fullName: string;
  role: Role;
  gradeOrDept?: string;
}): { success: boolean; user?: User; error?: string } {
  const cleanEmail = params.email.toLowerCase().trim();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Invalid email address format.' };
  }
  if (!params.password || params.password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  const newAccount: RegisteredAccount = {
    id: `user-${params.role.toLowerCase()}-${Date.now()}`,
    email: cleanEmail,
    password: params.password,
    fullName: params.fullName.trim() || 'SmartLearn User',
    role: params.role,
    gradeOrDept: params.gradeOrDept?.trim(),
    createdAt: new Date().toISOString(),
  };

  saveRegisteredAccount(newAccount);
  const user = accountToUser(newAccount);
  return { success: true, user };
}

/**
 * Authenticates against registered accounts
 */
export function authenticateLocalAccount(
  email: string,
  password: string
): {
  success: boolean;
  user?: User;
  errorType?: 'wrong_password' | 'unregistered_email';
  error?: string;
} {
  const cleanEmail = email.toLowerCase().trim();
  const account = findAccountByEmail(cleanEmail);

  if (!account) {
    return {
      success: false,
      errorType: 'unregistered_email',
      error: 'Wrong email. No registered account found with this email address. Please check your spelling or click "Create Account" above.',
    };
  }

  // Pre-seeded demo convenience: accept 'smartlearn123' or exact match
  const isMatch = account.password === password || (account.password === 'smartlearn123' && password === 'smartlearn123');
  if (!isMatch) {
    return {
      success: false,
      errorType: 'wrong_password',
      error: 'Wrong password. The password you entered is incorrect for this account. Please verify your password and try again.',
    };
  }

  return {
    success: true,
    user: accountToUser(account),
  };
}
