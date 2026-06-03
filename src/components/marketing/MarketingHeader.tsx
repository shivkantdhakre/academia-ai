'use client';

import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function MarketingHeader() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border shadow-[0_4px_20px_rgba(34,211,238,0.02)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-primary/20">
            <BrainCircuit className="text-white" size={18} />
          </div>
          <span className="font-bold text-foreground tracking-tight text-lg">ACADEMIA AI</span>
        </div>
        
        <div className="flex items-center gap-6">
          <ThemeToggle />
          <Link 
            href="/login" 
            className="px-6 py-2.5 text-sm font-semibold text-foreground bg-card/60 hover:bg-muted border border-border rounded-full transition-all backdrop-blur-md shadow-sm active:scale-95"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
