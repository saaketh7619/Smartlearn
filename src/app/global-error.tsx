'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/** Root-level error boundary that catches errors in the root layout itself. */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#121519] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 text-white">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/20 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-rose-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white mb-2">SmartLearn Encountered a Problem</h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              A critical application error occurred. Your data is safe. Please refresh the page.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-4 p-3 rounded-xl bg-slate-800 text-xs text-rose-400 text-left whitespace-pre-wrap break-all">
                {error?.message ?? 'Unknown error'}
              </pre>
            )}
          </div>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#d82a4e] text-white text-sm font-bold hover:bg-[#c32646] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reload SmartLearn
          </button>
        </div>
      </body>
    </html>
  );
}
