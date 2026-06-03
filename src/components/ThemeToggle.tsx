'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 rounded-full border border-border bg-card/40" />;
  }

  // Determine current active mode
  const currentTheme = theme === 'system' ? 'dark' : theme; // default to dark to match initial system style if system is dark
  const isDark = currentTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative w-10 h-10 rounded-full border border-border bg-card/40 flex items-center justify-center cursor-pointer transition-colors duration-300 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/50 overflow-hidden"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ y: 15, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -15, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
            className="text-amber-400"
          >
            <Sun className="h-5 w-5" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ y: 15, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -15, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
            className="text-primary"
          >
            <Moon className="h-5 w-5" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
