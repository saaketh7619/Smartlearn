'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Settings,
  Mail,
  Key,
  FileCode,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Send,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { getEmailJsConfig, saveEmailJsConfig, sendOtpEmail } from '@/lib/emailjs';

interface EmailJsConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export default function EmailJsConfigModal({
  isOpen,
  onClose,
  onSaved,
}: EmailJsConfigModalProps) {
  const [serviceId, setServiceId] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [testingStatus, setTestingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const config = getEmailJsConfig();
      setServiceId(config.serviceId || '');
      setTemplateId(config.templateId || '');
      setPublicKey(config.publicKey || '');
      setTestingStatus('idle');
      setStatusMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveEmailJsConfig({
      serviceId: serviceId.trim(),
      templateId: templateId.trim(),
      publicKey: publicKey.trim(),
    });
    setStatusMessage('EmailJS credentials saved successfully!');
    setTestingStatus('success');
    if (onSaved) onSaved();
  };

  const handleSendTest = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      setStatusMessage('Please enter a valid test email address.');
      setTestingStatus('error');
      return;
    }

    // Save first so test uses current values
    handleSave();

    setTestingStatus('loading');
    setStatusMessage('Sending test email via EmailJS...');

    const randomTestOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const result = await sendOtpEmail(testEmail.trim(), randomTestOtp, 'SmartLearn Tester');

    if (result.success) {
      setTestingStatus('success');
      setStatusMessage(`Test email sent to ${testEmail}! Check your inbox (Code: ${randomTestOtp}).`);
    } else {
      setTestingStatus('error');
      setStatusMessage(result.error || 'Failed to send test email. Check your credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1a1e24] rounded-lg border border-slate-200 dark:border-[#283038] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-[#283038] flex items-center justify-between bg-slate-50 dark:bg-[#15191e]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-[#d82a4e]/10 text-[#d82a4e]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                Connect EmailJS Account
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                  OTP Delivery
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure your EmailJS credentials to send real OTP emails
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {statusMessage && (
            <div
              className={`p-3 rounded-md text-xs flex items-start gap-2 ${
                testingStatus === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                  : testingStatus === 'error'
                  ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                  : 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
              }`}
            >
              {testingStatus === 'success' && <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />}
              {testingStatus === 'error' && <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
              {testingStatus === 'loading' && <Loader2 className="w-4 h-4 mt-0.5 shrink-0 animate-spin" />}
              <span>{statusMessage}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            {/* Service ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#d82a4e]" />
                <span>Service ID</span>
                <span className="text-slate-400 text-[11px] font-normal">(e.g., service_abc123)</span>
              </label>
              <input
                type="text"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                placeholder="service_xxxxxxxx"
                className="w-full px-3.5 py-2 text-xs rounded-md bg-slate-50 dark:bg-[#20252b] border border-slate-200 dark:border-[#283038] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d82a4e]"
              />
            </div>

            {/* Template ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-[#d82a4e]" />
                <span>Template ID</span>
                <span className="text-slate-400 text-[11px] font-normal">(e.g., template_xyz789)</span>
              </label>
              <input
                type="text"
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                placeholder="template_xxxxxxxx"
                className="w-full px-3.5 py-2 text-xs rounded-md bg-slate-50 dark:bg-[#20252b] border border-slate-200 dark:border-[#283038] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d82a4e]"
              />
            </div>

            {/* Public Key */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#d82a4e]" />
                <span>Public Key</span>
                <span className="text-slate-400 text-[11px] font-normal">(Account &gt; API Keys &gt; Public Key)</span>
              </label>
              <input
                type="text"
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                placeholder="Public Key / User ID"
                className="w-full px-3.5 py-2 text-xs rounded-md bg-slate-50 dark:bg-[#20252b] border border-slate-200 dark:border-[#283038] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d82a4e]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleSave()}
                className="flex-1 py-2.5 px-4 rounded-md bg-[#d82a4e] hover:bg-[#c32646] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Credentials</span>
              </button>
            </div>
          </form>

          {/* Test Email Section */}
          <div className="pt-4 border-t border-slate-200 dark:border-[#283038] space-y-2.5">
            <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Test Live OTP Email</span>
            </h3>
            <div className="flex gap-2">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="flex-1 px-3.5 py-2 text-xs rounded-md bg-slate-50 dark:bg-[#20252b] border border-slate-200 dark:border-[#283038] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d82a4e]"
              />
              <button
                type="button"
                onClick={handleSendTest}
                disabled={testingStatus === 'loading'}
                className="py-2 px-3.5 rounded-md bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {testingStatus === 'loading' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Test</span>
              </button>
            </div>
          </div>

          {/* Quick Setup Help Guide */}
          <div className="p-3 rounded-md bg-slate-100 dark:bg-[#121519] border border-slate-200 dark:border-[#283038] text-[11px] text-slate-600 dark:text-slate-400 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
              <span>EmailJS Template Variables to use:</span>
              <a
                href="https://dashboard.emailjs.com/admin/templates"
                target="_blank"
                rel="noreferrer"
                className="text-[#d82a4e] hover:underline inline-flex items-center gap-1"
              >
                <span>EmailJS Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <ul className="list-disc list-inside space-y-1 font-mono text-[10px] text-slate-700 dark:text-slate-300">
              <li><code>&#123;&#123;otp_code&#125;&#125;</code> or <code>&#123;&#123;otp&#125;&#125;</code> (The 6-digit code)</li>
              <li><code>&#123;&#123;to_email&#125;&#125;</code> (Recipient email address)</li>
              <li><code>&#123;&#123;to_name&#125;&#125;</code> (User&apos;s name)</li>
              <li><code>&#123;&#123;message&#125;&#125;</code> (Pre-formatted message)</li>
            </ul>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 pt-1">
              Tip: You can also define these in your <code>.env.local</code> file as <code>NEXT_PUBLIC_EMAILJS_SERVICE_ID</code>, <code>NEXT_PUBLIC_EMAILJS_TEMPLATE_ID</code>, and <code>NEXT_PUBLIC_EMAILJS_PUBLIC_KEY</code>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-200 dark:border-[#283038] bg-slate-50 dark:bg-[#15191e] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-md text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
