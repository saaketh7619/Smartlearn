'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  MessageSquare,
  Send,
  Users,
  Search,
  CheckCheck,
  Sparkles,
} from 'lucide-react';
import { db } from '@/lib/db';
import { useStore } from '@/store/useStore';
import { ChatMessage } from '@/types';

function TeacherMessagesContent() {
  const searchParams = useSearchParams();
  const initialRecipient = searchParams.get('to') || 'Priya Sharma (Alex\'s Mother)';
  const currentUser = useStore((state) => state.currentUser);

  const [activeContact, setActiveContact] = useState(initialRecipient);
  const [messages, setMessages] = useState<ChatMessage[]>(db.messages);
  const [inputText, setInputText] = useState('');

  const contacts = [
    { name: 'Priya Sharma (Alex\'s Mother)', role: 'Parent · Grade 10', lastMsg: 'We scheduled 30 minutes with SmartLearn revision generator...', unread: 0 },
    { name: 'David Chen (Liam\'s Father)', role: 'Parent · Grade 10', lastMsg: 'Thank you for the update on Calculus.', unread: 1 },
    { name: 'Alex Rivera', role: 'Student · Grade 10', lastMsg: 'Dr. Jenkins, I reviewed the Chain rule questions!', unread: 0 },
    { name: 'Noah Patel', role: 'Student · Grade 10', lastMsg: 'Can I take the quadratics retest tomorrow?', unread: 2 },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser?.id || 'user-teacher-sarah',
      senderName: currentUser?.name || 'Dr. Sarah Jenkins',
      senderRole: 'TEACHER',
      receiverId: 'user-parent-priya',
      content: inputText,
      timestamp: 'Just now',
    };

    db.addMessage(newMsg);
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in duration-200">
      {/* Contact List */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-950/40">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-purple-600" />
            Teacher Messages
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">Parent & Student Communication Hub</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-2 space-y-1">
          {contacts.map((c) => (
            <div
              key={c.name}
              onClick={() => setActiveContact(c.name)}
              className={`p-3 rounded-2xl cursor-pointer transition-colors ${
                activeContact === c.name
                  ? 'bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">{c.name}</span>
                {c.unread > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-purple-600 text-white text-[9px] font-bold">
                    {c.unread}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold mb-1">{c.role}</p>
              <p className="text-[11px] text-slate-500 line-clamp-1">{c.lastMsg}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Thread */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">{activeContact}</h3>
            <span className="text-[11px] text-emerald-500 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Connected · Direct Messaging
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {messages.map((m) => {
            const isMe = m.senderRole === 'TEACHER';
            return (
              <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[75%] rounded-3xl p-4 text-xs ${
                    isMe
                      ? 'bg-purple-600 text-white rounded-tr-none'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                  }`}
                >
                  <p className="font-bold text-[10px] mb-1 opacity-80">{m.senderName}</p>
                  <p className="leading-relaxed">{m.content}</p>
                  <span className="text-[9px] block text-right mt-1 opacity-70">{m.timestamp}</span>
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${activeContact}...`}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="p-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white shadow-md flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function TeacherMessagesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading messages...</div>}>
      <TeacherMessagesContent />
    </Suspense>
  );
}
