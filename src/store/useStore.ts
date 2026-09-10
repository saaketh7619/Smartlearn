import { create } from 'zustand';
import { User, Role, NotificationItem } from '@/types';
import { db, INITIAL_USERS } from '@/lib/db';
import { DEMO_ACCOUNTS } from '@/lib/auth';

interface SmartLearnState {
  currentUser: User | null;
  isLoggedIn: boolean;
  welcomeSplashOpen: boolean;
  theme: 'light' | 'dark';
  language: 'en' | 'hi' | 'es';
  activeChildId: string;
  commandPaletteOpen: boolean;
  notifications: NotificationItem[];
  confettiTrigger: number;
  onboardingSeen: Record<string, boolean>;

  // Actions
  setCurrentUser: (user: User | null) => void;
  setWelcomeSplashOpen: (open: boolean) => void;
  loginUser: (user: User) => void;
  logoutUser: () => void;
  switchDemoRole: (role: Role) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setLanguage: (lang: 'en' | 'hi' | 'es') => void;
  setActiveChildId: (childId: string) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  triggerConfetti: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addXP: (amount: number, reason: string) => void;
  setOnboardingSeen: (role: Role) => void;
}

export const useStore = create<SmartLearnState>((set, get) => ({
  currentUser: INITIAL_USERS[0],
  isLoggedIn: false, // Starts unauthenticated to show entrance flow
  welcomeSplashOpen: false, // No intrusive popup on initial visit
  theme: 'dark',
  language: 'en',
  activeChildId: 'user-student-alex',
  commandPaletteOpen: false,
  notifications: db.notifications,
  confettiTrigger: 0,
  onboardingSeen: {},

  setCurrentUser: (user) => set({ currentUser: user, isLoggedIn: !!user }),

  setWelcomeSplashOpen: (open) => set({ welcomeSplashOpen: open }),

  loginUser: (user) => {
    set({ currentUser: user, isLoggedIn: true, welcomeSplashOpen: false });
    if (user.role === 'PARENT') {
      set({ activeChildId: 'user-student-alex' });
    }
  },

  logoutUser: () => {
    set({ currentUser: null, isLoggedIn: false });
  },

  switchDemoRole: (role) => {
    let targetUser = INITIAL_USERS[0];
    if (role === 'STUDENT') targetUser = INITIAL_USERS[0];
    if (role === 'TEACHER') targetUser = INITIAL_USERS[1];
    if (role === 'PARENT') targetUser = INITIAL_USERS[2];
    if (role === 'ADMIN') targetUser = INITIAL_USERS[3];
    set({ currentUser: targetUser, isLoggedIn: true, welcomeSplashOpen: false });
  },

  setTheme: (theme) => {
    set({ theme });
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      try {
        localStorage.setItem('smartlearn_theme', theme);
      } catch {
        // ignore
      }
    }
  },

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(next);
  },

  setLanguage: (language) => set({ language }),

  setActiveChildId: (activeChildId) => set({ activeChildId }),

  setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),

  triggerConfetti: () => set({ confettiTrigger: Date.now() }),

  markNotificationRead: (id) => {
    db.markNotificationRead(id);
    set({ notifications: [...db.notifications] });
  },

  markAllNotificationsRead: () => {
    const user = get().currentUser;
    if (user) {
      db.markAllNotificationsRead(user.id);
      set({ notifications: [...db.notifications] });
    }
  },

  addXP: (amount, reason) => {
    const user = get().currentUser;
    if (user && user.studentProfile) {
      const newXp = user.studentProfile.xp + amount;
      const newLevel = Math.floor(newXp / 200) + 1;
      const leveledUp = newLevel > user.studentProfile.level;

      const updatedUser: User = {
        ...user,
        studentProfile: {
          ...user.studentProfile,
          xp: newXp,
          level: newLevel,
          coins: user.studentProfile.coins + Math.round(amount * 0.15),
        },
      };

      db.updateUser(user.id, updatedUser);
      set({ currentUser: updatedUser });

      if (leveledUp) {
        get().triggerConfetti();
        // Add level up notification
        db.notifications.unshift({
          id: `notif-${Date.now()}`,
          userId: user.id,
          title: `🎉 Level Up! You reached Level ${newLevel}!`,
          message: `Congratulations! Your hard work is paying off. Keep the streak going.`,
          type: 'badge',
          read: false,
          createdAt: 'Just now',
          linkUrl: '/student',
        });
        set({ notifications: [...db.notifications] });
      }
    }
  },

  setOnboardingSeen: (role) => {
    set((state) => ({
      onboardingSeen: { ...state.onboardingSeen, [role]: true },
    }));
  },
}));
