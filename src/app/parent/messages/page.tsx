'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
} from 'lucide-react';
import { db } from '@/lib/db';
import { useStore } from '@/store/useStore';
import { ChatMessage } from '@/types';

export default function ParentMessagesPage() {
  const currentUser = useStore((state) => state.currentUser);
  const [messages, setMessages] = useState<ChatMessage[]>(db.messages);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser?.id || 'user-parent-priya',
      senderName: 'Priya Sharma',
      senderRole: 'PARENT',
      receiverId: 'user-teacher-sarah',
      content: input,
      timestamp: 'Just now',
    };

    db.addMessage(newMsg);
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in duration-200">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100"
            alt="Dr. Jenkins"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500"
          />
          <div>
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">Dr. Sarah Jenkins</h2>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              Alex&apos;s Mathematics Teacher & Class Mentor
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {messages.map((m) => {
          const isMe = m.senderRole === 'PARENT';
          return (
            <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[75%] rounded-3xl p-4 text-xs ${
                  isMe
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700'
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

      <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message to Dr. Sarah Jenkins..."
          className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="submit"
          className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
