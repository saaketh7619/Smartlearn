import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy — SmartLearn',
  description: 'How SmartLearn collects, uses, and protects your personal and educational data.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#121519] text-slate-900 dark:text-white py-16 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-3">
          <h1 className="text-3xl font-black tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: September 2026</p>
        </div>

        <div className="prose prose-slate dark:prose-invert prose-sm max-w-none space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section className="bg-white dark:bg-[#1a1e24] rounded-2xl border border-slate-200 dark:border-[#283038] p-6 space-y-3">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">1. What We Collect</h2>
            <p>SmartLearn collects only what is necessary to provide personalized learning. This includes:</p>
            <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
              <li>Account registration information (name, email, school/grade)</li>
              <li>Learning activity data (tests taken, scores, notes, study sessions)</li>
              <li>Device and browser information for security and compatibility</li>
              <li>Optional: profile picture and phone number for two-factor authentication</li>
            </ul>
          </section>

          <section className="bg-white dark:bg-[#1a1e24] rounded-2xl border border-slate-200 dark:border-[#283038] p-6 space-y-3">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">2. How We Use Your Data</h2>
            <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
              <li>Personalizing the AI study plan and adaptive test difficulty</li>
              <li>Providing progress reports to authorized parents and teachers</li>
              <li>Improving platform features using anonymized aggregate trends</li>
              <li>Sending important account and security notifications</li>
            </ul>
          </section>

          <section className="bg-white dark:bg-[#1a1e24] rounded-2xl border border-slate-200 dark:border-[#283038] p-6 space-y-3">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">3. Data We Never Share or Sell</h2>
            <p className="font-semibold text-slate-900 dark:text-white">SmartLearn does not sell, rent, or share student personal data with any third party for marketing or commercial purposes.</p>
            <p className="text-slate-600 dark:text-slate-400">We are committed to FERPA (Family Educational Rights and Privacy Act) and COPPA (Children's Online Privacy Protection Act) compliance. Student data is only shared with authorized teachers and parents within the same school account.</p>
          </section>

          <section className="bg-white dark:bg-[#1a1e24] rounded-2xl border border-slate-200 dark:border-[#283038] p-6 space-y-3">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">4. Security</h2>
            <p className="text-slate-600 dark:text-slate-400">All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We implement role-based access controls, session expiry, and rate limiting on authentication endpoints. Passwords are hashed using bcrypt. We do not store plain-text credentials.</p>
          </section>

          <section className="bg-white dark:bg-[#1a1e24] rounded-2xl border border-slate-200 dark:border-[#283038] p-6 space-y-3">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">5. Cookies & Local Storage</h2>
            <p className="text-slate-600 dark:text-slate-400">We use browser local storage to save your theme preference, session state, and study progress for offline-first functionality. No tracking cookies are used for advertising. We do not use third-party analytics trackers.</p>
          </section>

          <section className="bg-white dark:bg-[#1a1e24] rounded-2xl border border-slate-200 dark:border-[#283038] p-6 space-y-3">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">6. Your Rights</h2>
            <p className="text-slate-600 dark:text-slate-400">You have the right to access, correct, export, or delete your data at any time. Contact us at <a href="mailto:privacy@smartlearn.edu" className="text-[#d82a4e] hover:underline">privacy@smartlearn.edu</a>.</p>
          </section>

          <section className="bg-white dark:bg-[#1a1e24] rounded-2xl border border-slate-200 dark:border-[#283038] p-6 space-y-3">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">7. Contact Us</h2>
            <p className="text-slate-600 dark:text-slate-400">
              For privacy-related questions, contact our Data Protection team at{' '}
              <a href="mailto:privacy@smartlearn.edu" className="text-[#d82a4e] hover:underline">privacy@smartlearn.edu</a>
              {' '}or visit our <Link href="/contact" className="text-[#d82a4e] hover:underline">Contact page</Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
