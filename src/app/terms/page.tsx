import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions — SmartLearn',
  description: 'SmartLearn platform terms of use, user responsibilities, and intellectual property.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#121519] text-slate-900 dark:text-white py-16 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-3">
          <h1 className="text-3xl font-black tracking-tight">Terms &amp; Conditions</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: September 2026</p>
        </div>

        <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section className="bg-white dark:bg-[#1a1e24] rounded-2xl border border-slate-200 dark:border-[#283038] p-6 space-y-3">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
            <p className="text-slate-600 dark:text-slate-400">By accessing or using SmartLearn, you agree to be bound by these Terms and Conditions and our <Link href="/privacy/" prefetch={true} className="text-[#d82a4e] hover:underline">Privacy Policy</Link>. If you do not agree, please do not use the platform.</p>
          </section>

          <section className="bg-white dark:bg-[#1a1e24] rounded-2xl border border-slate-200 dark:border-[#283038] p-6 space-y-3">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">2. Eligibility</h2>
            <p className="text-slate-600 dark:text-slate-400">SmartLearn is designed for students aged 10–18, teachers, parents, and school administrators. Users under 13 must have verifiable parental or guardian consent.</p>
          </section>

          <section className="bg-white dark:bg-[#1a1e24] rounded-2xl border border-slate-200 dark:border-[#283038] p-6 space-y-3">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">3. Acceptable Use</h2>
            <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
              <li>You may not use SmartLearn for cheating, academic dishonesty, or impersonation.</li>
              <li>You may not attempt to reverse-engineer, scrape, or overload platform infrastructure.</li>
              <li>You may not upload harmful, offensive, or copyrighted content without authorization.</li>
              <li>Test anti-cheating controls (Page Visibility API) must not be circumvented.</li>
            </ul>
          </section>

          <section className="bg-white dark:bg-[#1a1e24] rounded-2xl border border-slate-200 dark:border-[#283038] p-6 space-y-3">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">4. Intellectual Property</h2>
            <p className="text-slate-600 dark:text-slate-400">All platform content, AI-generated explanations, course materials, and software are the property of SmartLearn Education Platform. User-created notes remain the property of the user.</p>
          </section>

          <section className="bg-white dark:bg-[#1a1e24] rounded-2xl border border-slate-200 dark:border-[#283038] p-6 space-y-3">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">5. Limitation of Liability</h2>
            <p className="text-slate-600 dark:text-slate-400">SmartLearn is provided &quot;as is.&quot; While we strive for accuracy, AI-generated content is for educational assistance only and should be verified by qualified educators for critical academic decisions.</p>
          </section>

          <section className="bg-white dark:bg-[#1a1e24] rounded-2xl border border-slate-200 dark:border-[#283038] p-6 space-y-3">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">6. Account Termination</h2>
            <p className="text-slate-600 dark:text-slate-400">We reserve the right to suspend or terminate accounts that violate these terms. Users may request account deletion by contacting <a href="mailto:support@smartlearn.edu" className="text-[#d82a4e] hover:underline">support@smartlearn.edu</a>.</p>
          </section>

          <section className="bg-white dark:bg-[#1a1e24] rounded-2xl border border-slate-200 dark:border-[#283038] p-6 space-y-3">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">7. Changes to Terms</h2>
            <p className="text-slate-600 dark:text-slate-400">We may update these Terms. Material changes will be notified via the platform notification center. Continued use constitutes acceptance.</p>
          </section>

          <section className="bg-white dark:bg-[#1a1e24] rounded-2xl border border-slate-200 dark:border-[#283038] p-6 space-y-3">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">8. Contact</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Questions about these terms? <Link href="/contact/" prefetch={true} className="text-[#d82a4e] hover:underline">Contact us</Link> or email <a href="mailto:legal@smartlearn.edu" className="text-[#d82a4e] hover:underline">legal@smartlearn.edu</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
