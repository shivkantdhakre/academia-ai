'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { submitContactForm, FormState } from '@/app/(marketing)/actions';
import { Send, Loader2, Sparkles, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const initialState: FormState = {
  success: false,
  message: '',
};

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state]);

  return (
    <section id="contact" className="relative py-24 px-6 bg-muted/30 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-secondary/20 bg-secondary/5 text-secondary text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles size={12} />
            <span>Early Access</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Get in touch to request early access for your academic institution or ask about our pro workspace features.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-panel rounded-3xl p-8 md:p-12 shadow-2xl border border-border bg-card/45 relative"
        >
          {state.success ? (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/5">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Message Received!</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {state.message}
              </p>
            </motion.div>
          ) : (
            <form ref={formRef} action={formAction} className="space-y-6">
              {state.message && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
                  {state.message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold text-foreground/80">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="John Doe"
                    className="w-full bg-card border border-border rounded-2xl px-5 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                  />
                  {state.errors?.name && (
                    <p className="text-xs font-semibold text-red-500 mt-1">{state.errors.name[0]}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-foreground/80">Institutional Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="john@university.edu"
                    className="w-full bg-card border border-border rounded-2xl px-5 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                  />
                  {state.errors?.email && (
                    <p className="text-xs font-semibold text-red-500 mt-1">{state.errors.email[0]}</p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold text-foreground/80">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  placeholder="Tell us about your courses, research goals, or any feature questions..."
                  className="w-full bg-card border border-border rounded-2xl px-5 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 resize-y"
                />
                {state.errors?.message && (
                  <p className="text-xs font-semibold text-red-500 mt-1">{state.errors.message[0]}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-primary-foreground rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-98 cursor-pointer disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Request
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
