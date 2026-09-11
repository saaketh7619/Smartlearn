import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { ConfettiEffect } from '@/components/shared/ConfettiEffect';

export const metadata: Metadata = {
  title: 'SmartLearn — AI-Powered Smart Education Ecosystem',
  description:
    'SmartLearn brings Students, Teachers, Parents, and Administrators together on one unified AI platform with adaptive mock testing, intelligent doubt solving, and analytics.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

import { ThemeInitializer } from '@/components/shared/ThemeInitializer';
import { ToastProvider } from '@/components/shared/ToastContext';
import { OnboardingTour } from '@/components/shared/OnboardingTour';
import { WelcomeSplashModal } from '@/components/shared/WelcomeSplashModal';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('smartlearn_theme');
                  if (saved === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else if (saved === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <ToastProvider>
          <ThemeInitializer />
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <CommandPalette />
          <ConfettiEffect />
        </ToastProvider>
      </body>
    </html>
  );
}
