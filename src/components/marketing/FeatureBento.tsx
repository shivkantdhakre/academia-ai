'use client';

import { BrainCircuit, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export function FeatureBento() {
  const cards = [
    {
      icon: BrainCircuit,
      title: 'RAG Study Copilot',
      desc: 'Context is Everything. Our RAG-powered AI learns from your specific course materials to provide pinpoint accurate answers without hallucinations.',
      className: 'md:col-span-8',
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      tag: 'Vector Search',
    },
    {
      icon: Zap,
      title: 'Zero Layout Shifts',
      desc: 'Fluid Intelligence. Experience a dashboard that never jumps. Built with Next.js Server Components for a buttery-smooth study flow.',
      className: 'md:col-span-4',
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      tag: 'Performance',
    },
    {
      icon: Shield,
      title: 'Secure Multi-Tenancy',
      desc: 'Enterprise-Grade Privacy. Your notes and embeddings are protected by strict row-level security. We never train models on your private documents.',
      className: 'md:col-span-12',
      color: 'text-primary bg-primary/10 border-primary/20',
      tag: 'Security & RLS',
    },
  ];

  return (
    <section id="features" className="relative py-24 px-6 bg-muted/30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Built for High-Achieving Students
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience an academic workspace loaded with advanced features and institutional security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`glass-panel rounded-3xl p-8 flex flex-col justify-between hover:border-primary/30 transition-all duration-300 group shadow-xl hover:shadow-[0_20px_50px_rgba(59,130,246,0.05)] ${card.className}`}
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl border flex items-center justify-center ${card.color}`}>
                    <card.icon size={24} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-3 py-1 rounded-full border border-border bg-card/50">
                    {card.tag}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{card.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-base max-w-2xl">{card.desc}</p>
              </div>

              {card.title === 'Secure Multi-Tenancy' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-border">
                  {[
                    { val: '256-bit', label: 'AES Encryption' },
                    { val: 'Zero', label: 'Model Training Use' },
                    { val: 'Isolated', label: 'Tenant Contexts' },
                    { val: 'Strict RLS', label: 'Row Level Security' },
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-card/40 border border-border rounded-2xl p-4 text-center">
                      <div className="text-xl font-black text-primary mb-1">{stat.val}</div>
                      <div className="text-xs font-semibold text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
