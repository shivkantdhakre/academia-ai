'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, BrainCircuit, Zap, Shield } from 'lucide-react';

export default function HomePage() {
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col relative overflow-hidden selection:bg-indigo-500/30">
      {/* Dynamic Ambient Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

      {/* Minimalist Top Navigation */}
      <header className="absolute top-0 w-full p-6 flex justify-between items-center z-50 max-w-7xl mx-auto left-0 right-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <BrainCircuit className="text-white" size={16} />
          </div>
          <span className="font-bold text-white tracking-tight">ACADEMIA AI</span>
        </div>
        <Link 
          href="/login" 
          className="px-5 py-2 text-sm font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors backdrop-blur-md"
        >
          Sign In
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-20 z-10 text-center">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-8">
            <Sparkles size={14} className="animate-pulse" />
            <span>AI-Powered Study Workspace</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            Master your coursework with <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-gradient-x">
              intelligent learning.
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-slate-400 text-base md:text-xl max-w-2xl mb-10 leading-relaxed">
            Upload your syllabus, track your progress, and chat with a context-aware AI tutor. Built for top-tier students who want to study smarter, not harder.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link 
              href="/login"
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-2xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 group"
            >
              Get Started for Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Highlights Row */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, type: 'spring' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24 px-4 pb-20"
        >
          {[
            { icon: BrainCircuit, title: "RAG Study Copilot", desc: "Chat directly with your course materials using advanced vector search." },
            { icon: Zap, title: "Zero Layout Shifts", desc: "Experience a buttery-smooth interface powered by Next.js Server Components." },
            { icon: Shield, title: "Secure Multi-Tenancy", desc: "Your personal notes and embeddings are protected by strict row-level security." }
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-3xl bg-[#09090b]/60 border border-white/5 backdrop-blur-sm text-left flex flex-col items-start hover:bg-white/5 transition-colors shadow-xl">
              <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 mb-4 border border-indigo-500/20">
                <feature.icon size={20} />
              </div>
              <h3 className="text-white font-bold mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
