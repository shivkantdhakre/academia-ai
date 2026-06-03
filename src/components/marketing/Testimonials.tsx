'use client';

import { motion } from 'framer-motion';
import { Star, Quote, Award } from 'lucide-react';

export function Testimonials() {
  const reviews = [
    {
      name: 'Sarah Jenkins',
      uni: 'Stanford University',
      rating: 5,
      quote: 'The RAG Study Copilot saved my midterms. I uploaded 3 different course syllabi and 15 research papers, and it connected all the dots instantly. Absolute game changer.',
      role: 'Computer Science Major',
    },
    {
      name: 'David Miller',
      uni: 'Massachusetts Institute of Technology',
      rating: 5,
      quote: 'No layout shifts, and the vector index search is lightning-fast. Academia AI is the first platform that feels like a natural, high-performance extension of my brain.',
      role: 'Physics PhD Candidate',
    },
    {
      name: 'Aisha Lawal',
      uni: 'University of Oxford',
      rating: 5,
      quote: 'The strict RLS security constraints give me complete peace of mind. Knowing my original research drafts and private course notes are securely sandboxed is critical.',
      role: 'Biomedical Scholar',
    },
  ];

  return (
    <section id="testimonials" className="relative py-24 px-6 bg-muted/20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            <Award size={12} />
            <span>Student Success Stories</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Empowering Scholars Worldwide
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See how top-tier students are utilizing Academia AI to streamline their study processes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="glass-panel rounded-3xl p-8 flex flex-col justify-between shadow-xl relative hover:border-primary/20 transition-colors duration-300 group"
            >
              <div className="absolute top-6 right-8 text-primary/10 group-hover:text-primary/25 transition-colors duration-300">
                <Quote size={40} style={{ transform: 'rotate(180deg)' }} />
              </div>

              <div className="space-y-6">
                {/* Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, starIdx) => (
                    <Star key={starIdx} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-foreground/90 text-base leading-relaxed italic">
                  "{rev.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-border shrink-0 text-primary font-bold text-lg shadow-sm">
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                    {rev.name}
                    <span className="w-3.5 h-3.5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[8px] font-black" title="Verified Scholar">✓</span>
                  </h4>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">{rev.role}</p>
                  <p className="text-[10px] text-primary/80 font-bold tracking-wide uppercase mt-1">{rev.uni}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
