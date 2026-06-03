'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export function HeroSection() {
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring' as const, stiffness: 120, damping: 20 } 
    }
  };

  return (
    <section className="relative px-6 pt-40 pb-20 flex flex-col items-center text-center overflow-hidden min-h-[80vh] justify-center">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-[10%] left-[10%] w-[35vw] h-[35vw] rounded-full bg-primary/8 blur-[120px] pointer-events-none ambient-glow" />
      <div className="absolute bottom-[10%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-secondary/8 blur-[120px] pointer-events-none ambient-glow" />

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto flex flex-col items-center z-10"
      >
        {/* Sparkle Chip */}
        <motion.div 
          variants={fadeUp} 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold uppercase tracking-wider mb-8 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
        >
          <Sparkles size={14} className="animate-pulse" />
          <span>AI-Powered Study Workspace</span>
        </motion.div>

        {/* Heading */}
        <motion.h1 
          variants={fadeUp} 
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-8 leading-[1.1] max-w-3xl"
        >
          Master your coursework with{' '}
          <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient-x">
            intelligent learning.
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p 
          variants={fadeUp} 
          className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-12 leading-relaxed"
        >
          Upload your syllabus, track your progress, and chat with a context-aware AI tutor. Built for top-tier students who want to study smarter, not harder.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          variants={fadeUp} 
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center"
        >
          <Link 
            href="/login"
            className="px-8 py-4 bg-primary hover:bg-primary-hover text-primary-foreground rounded-2xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 group active:scale-98"
          >
            Get Started for Free
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <a
            href="#mockup"
            className="px-8 py-4 bg-card/60 hover:bg-muted/80 text-foreground border border-border rounded-2xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-md hover:-translate-y-0.5 active:scale-98"
          >
            See Live Demo
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
