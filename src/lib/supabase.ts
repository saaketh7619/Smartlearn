import { createClient } from '@supabase/supabase-js';
import { Role, User } from '@/types';
import { INITIAL_USERS } from './db';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wvwhmeceincqfkfryqrs.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2d2htZWNlaW5jcWZrZnJ5cXJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxNDA3MDcsImV4cCI6MjEwNDcxNjcwN30.aEkYQaLv3eydkuhJJ8Gcs1TD9WtnJLNkXL3woYPl4_8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface SupabaseAuthResult {
  success: boolean;
  user?: User;
  session?: any;
  error?: string;
  isOtpSent?: boolean;
}

/**
 * Maps Supabase user/metadata to SmartLearn internal User model
 */
export function mapSupabaseUserToSmartLearnUser(
  sbUser: any,
  fallbackRole: Role = 'STUDENT',
  gradeOrDept?: string
): User {
  const metadata = sbUser.user_metadata || {};
  const role: Role = (metadata.role?.toUpperCase() as Role) || fallbackRole;
  const name =
    metadata.full_name ||
    metadata.name ||
    sbUser.email?.split('@')[0] ||
    'SmartLearn User';
  const email = sbUser.email || '';

  const baseUser =
    role === 'STUDENT'
      ? INITIAL_USERS[0]
      : role === 'TEACHER'
      ? INITIAL_USERS[1]
      : role === 'PARENT'
      ? INITIAL_USERS[2]
      : INITIAL_USERS[3];

  return {
    ...baseUser,
    id: sbUser.id || `sb-${Date.now()}`,
    name,
    email,
    role,
    studentProfile:
      role === 'STUDENT' && baseUser.studentProfile
        ? {
            ...baseUser.studentProfile,
            grade: gradeOrDept || metadata.grade_or_dept || baseUser.studentProfile.grade,
          }
        : baseUser.studentProfile,
    teacherProfile:
      role === 'TEACHER' && baseUser.teacherProfile
        ? {
            ...baseUser.teacherProfile,
            department: gradeOrDept || metadata.grade_or_dept || baseUser.teacherProfile.department,
          }
        : baseUser.teacherProfile,
  };
}

/**
 * Sign up with Email and Password using Supabase Auth
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  meta: { fullName: string; role: Role; gradeOrDept?: string }
): Promise<SupabaseAuthResult> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: meta.fullName,
          role: meta.role,
          grade_or_dept: meta.gradeOrDept,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'Registration completed but user session not found.' };
    }

    // If auto-confirmed and session returned directly
    const user = mapSupabaseUserToSmartLearnUser(data.user, meta.role, meta.gradeOrDept);
    return { success: true, user, session: data.session };
  } catch (err: any) {
    return { success: false, error: err?.message || 'An unexpected error occurred during signup.' };
  }
}

/**
 * Sign in with Email and Password using Supabase Auth
 */
export async function signInWithPassword(
  email: string,
  password: string,
  fallbackRole: Role = 'STUDENT'
): Promise<SupabaseAuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'Authentication succeeded but user data is missing.' };
    }

    const user = mapSupabaseUserToSmartLearnUser(data.user, fallbackRole);
    return { success: true, user, session: data.session };
  } catch (err: any) {
    return { success: false, error: err?.message || 'An unexpected error occurred during sign in.' };
  }
}

/**
 * Request OTP via Supabase Auth
 */
export async function sendSupabaseOtp(
  email: string,
  meta?: { fullName?: string; role?: Role; gradeOrDept?: string }
): Promise<SupabaseAuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        data: {
          full_name: meta?.fullName,
          role: meta?.role,
          grade_or_dept: meta?.gradeOrDept,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, isOtpSent: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to send Supabase OTP.' };
  }
}

/**
 * Verify OTP code via Supabase Auth
 */
export async function verifySupabaseOtp(
  email: string,
  token: string,
  fallbackRole: Role = 'STUDENT'
): Promise<SupabaseAuthResult> {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'OTP verified but no user record returned.' };
    }

    const user = mapSupabaseUserToSmartLearnUser(data.user, fallbackRole);
    return { success: true, user, session: data.session };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to verify Supabase OTP.' };
  }
}

/**
 * Sign out from Supabase Auth
 */
export async function signOutSupabase(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch {
    // ignore
  }
}
