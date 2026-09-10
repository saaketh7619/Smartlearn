'use client';

import React, { useState } from 'react';
import { Mail, MessageCircle, Clock, CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', department: 'Support', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const departments = ['General Inquiry', 'Admissions & Onboarding', 'Technical Support', 'Teacher Partnerships', 'Privacy & Data'];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email address.';
    if (!form.subject.trim()) e.subject = 'Subject is required.';
    if (form.message.trim().length < 20) e.message = 'Message must be at least 20 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    // Simulate async form submission (real backend can be wired up here)
    await new Promise((res) => setTimeout(res, 1400));
    setStatus('success');
  };

  const faqs = [
    { q: 'How do I reset my password?', a: 'Visit the login page and click "Forgot Password." You\'ll receive a reset link within minutes.' },
    { q: 'Can teachers create custom tests?', a: 'Yes — the Teacher Portal provides a full test builder with adaptive difficulty settings and anti-cheat controls.' },
    { q: 'Is student data shared with third parties?', a: 'Never. SmartLearn does not sell or share student data. See our Privacy Policy for full details.' },
    { q: 'Does SmartLearn work offline?', a: 'Core reading and review content is cached. Network-dependent features like AI Tutor gracefully fall back to offline heuristic mode.' },
  ];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#121519] text-slate-900 dark:text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-16 space-y-16">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Contact <span className="text-[#d82a4e]">SmartLearn</span></h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            Have a question, technical issue, or partnership inquiry? Our team typically responds within 1 business day.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="bg-white dark:bg-[#1a1e24] rounded-3xl border border-slate-200 dark:border-[#283038] shadow-sm p-8">
            <h2 className="font-extrabold text-lg mb-6">Send a Message</h2>

            {status === 'success' ? (
              <div className="flex flex-col items-center text-center gap-3 py-10">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="font-bold text-lg">Message Sent!</h3>
                <p className="text-sm text-slate-500">Thank you, {form.name}. We&apos;ll reply to {form.email} within 1 business day.</p>
                <button
                  onClick={() => { setForm({ name: '', email: '', department: 'Support', subject: '', message: '' }); setStatus('idle'); }}
                  className="mt-4 px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Full Name *</label>
                  <input
                    id="contact-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#20252b] border ${errors.name ? 'border-rose-400' : 'border-slate-200 dark:border-[#283038]'} text-sm focus:outline-none focus:ring-2 focus:ring-[#d82a4e]/40`}
                    placeholder="Alex Rivera"
                  />
                  {errors.name && <p role="alert" className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Email Address *</label>
                  <input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#20252b] border ${errors.email ? 'border-rose-400' : 'border-slate-200 dark:border-[#283038]'} text-sm focus:outline-none focus:ring-2 focus:ring-[#d82a4e]/40`}
                    placeholder="you@example.com"
                  />
                  {errors.email && <p role="alert" className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                </div>

                {/* Department */}
                <div>
                  <label htmlFor="contact-department" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Department</label>
                  <select
                    id="contact-department"
                    value={form.department}
                    onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#20252b] border border-slate-200 dark:border-[#283038] text-sm focus:outline-none focus:ring-2 focus:ring-[#d82a4e]/40"
                  >
                    {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Subject *</label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#20252b] border ${errors.subject ? 'border-rose-400' : 'border-slate-200 dark:border-[#283038]'} text-sm focus:outline-none focus:ring-2 focus:ring-[#d82a4e]/40`}
                    placeholder="Brief description of your inquiry"
                  />
                  {errors.subject && <p role="alert" className="text-xs text-rose-500 mt-1">{errors.subject}</p>}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Message *</label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#20252b] border ${errors.message ? 'border-rose-400' : 'border-slate-200 dark:border-[#283038]'} text-sm focus:outline-none focus:ring-2 focus:ring-[#d82a4e]/40 resize-none`}
                    placeholder="Please describe your question or issue in detail..."
                  />
                  {errors.message && <p role="alert" className="text-xs text-rose-500 mt-1">{errors.message}</p>}
                </div>

                {status === 'error' && (
                  <div role="alert" className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 text-xs border border-rose-200 dark:border-rose-800">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Failed to send message. Please try again or email support@smartlearn.edu directly.</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#d82a4e] hover:bg-[#c32646] text-white text-sm font-bold transition-colors disabled:opacity-60"
                >
                  {status === 'sending' ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="w-4 h-4" /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Info + FAQ */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="bg-white dark:bg-[#1a1e24] rounded-3xl border border-slate-200 dark:border-[#283038] shadow-sm p-6 space-y-4">
              <h2 className="font-extrabold text-base">Contact Details</h2>
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#d82a4e] flex-shrink-0" />
                  <span>support@smartlearn.edu</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span>Live chat available inside the Student Portal</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Response time: within 1 business day</span>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white dark:bg-[#1a1e24] rounded-3xl border border-slate-200 dark:border-[#283038] shadow-sm p-6 space-y-4">
              <h2 className="font-extrabold text-base">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{faq.q}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
