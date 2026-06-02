'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console or external error reporting service
    console.error('Captured dashboard error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="max-w-md w-full rounded-3xl border border-red-500/10 bg-[#09090b]/40 backdrop-blur-md p-8 md:p-10 flex flex-col items-center relative overflow-hidden shadow-2xl shadow-red-950/5"
      >
        {/* Decorative subtle red background glow */}
        <div className="absolute -inset-px bg-gradient-to-br from-red-500/5 via-transparent to-transparent pointer-events-none rounded-3xl" />
        
        {/* Animated Warning Icon container */}
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 shadow-lg shadow-red-500/5">
          <AlertTriangle className="text-red-400" size={32} />
        </div>

        <h2 className="text-2xl font-extrabold text-white tracking-tight leading-snug">
          Something went wrong!
        </h2>
        
        <p className="text-slate-400 text-sm mt-3 mb-8 leading-relaxed">
          {error.message || 'We encountered an error while loading your dashboard. Please try again.'}
        </p>

        <button
          onClick={() => reset()}
          className="flex items-center gap-2 px-5 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-200 border border-red-500/20 hover:border-red-500/30 rounded-xl transition-all duration-200 font-semibold text-sm shadow-md cursor-pointer group"
        >
          <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
          Try Again
        </button>
      </motion.div>
    </div>
  );
}
