'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Sparkles, Send, FileText, CheckCircle2 } from 'lucide-react';

type Message = {
  sender: 'user' | 'ai';
  text: string;
  sources?: string[];
};

const PROMPTS = [
  {
    question: "Summarize Database Sharding",
    answer: "Database sharding is a horizontal partitioning technique where database rows are divided and stored across multiple physical database instances (shards). Key concepts include:\n\n1. **Shard Key**: The column determines which shard stores a given row.\n2. **Horizontal Scaling**: Relieves CPU and memory constraints by dividing workload.\n3. **High Availability**: If one shard fails, others remain operational.",
    sources: ["database_sys_chap4.pdf (page 12)", "scalability_course_notes.docx (page 2)"]
  },
  {
    question: "Explain RAG vector matching",
    answer: "Retrieval-Augmented Generation (RAG) vector matching processes your course files as follows:\n\n1. **Chunking**: Splits documents into small, logical paragraphs.\n2. **Embeddings**: Converts text blocks into high-dimensional vector representations.\n3. **Cosine Similarity**: Finds vector matches between your search query and document chunks, then feeds this context to the LLM.",
    sources: ["academia_copilot_specs.pdf (page 5)", "intro_to_vector_db.pdf (page 1)"]
  },
  {
    question: "Outline Web Security RLS",
    answer: "Row-Level Security (RLS) is a database constraint that limits query visibility based on the requesting user identity. In this dashboard, it works by:\n\n1. **JWT Verification**: Verifying the user JWT session token.\n2. **Tenant Isolation**: Setting policy constraints (`auth.uid() = user_id`) on courses and profiles to prevent data leak between accounts.",
    sources: ["supabase_sec_policy.pdf (page 8)"]
  }
];

export function InteractiveMockup() {
  const [activeIdx, setActiveIdx] = React.useState<number | null>(null);
  const [chatLog, setChatLog] = React.useState<Message[]>([
    {
      sender: 'ai',
      text: "Hi! I am your context-aware Study Copilot. Click one of the prompts below or ask me anything based on your loaded coursework.",
    }
  ]);
  const [isTyping, setIsTyping] = React.useState(false);
  const [typedText, setTypedText] = React.useState("");

  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatLog, isTyping, typedText]);

  const handleSelectPrompt = async (idx: number) => {
    if (isTyping) return;
    setActiveIdx(idx);
    setIsTyping(true);
    
    const selected = PROMPTS[idx];
    
    // Add user query
    setChatLog(prev => [...prev, { sender: 'user', text: selected.question }]);
    
    // Typing delay
    await new Promise(r => setTimeout(r, 800));
    
    // Simulate AI typing response
    let currentText = "";
    const words = selected.answer.split(" ");
    
    for (let i = 0; i < words.length; i++) {
      currentText += words[i] + " ";
      setTypedText(currentText);
      await new Promise(r => setTimeout(r, 30));
    }
    
    // Done typing, add to official log
    setChatLog(prev => [...prev, { 
      sender: 'ai', 
      text: selected.answer,
      sources: selected.sources
    }]);
    setTypedText("");
    setIsTyping(false);
  };

  return (
    <section id="mockup" className="relative py-24 px-6 max-w-7xl mx-auto transition-colors duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left column info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-secondary/20 bg-secondary/5 text-secondary text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 size={12} />
            <span>Interactive Sandbox</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Experience the RAG Study Copilot
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Unlike standard AI chatbots, Academia AI has context memory. It runs semantic searches directly on your uploaded files, textbooks, and lecture transcripts to produce cited answers.
          </p>
          
          <div className="pt-4 space-y-3">
            <p className="text-sm font-semibold text-foreground">Click a study query to try it:</p>
            <div className="flex flex-col gap-2">
              {PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPrompt(idx)}
                  disabled={isTyping}
                  className={`w-full text-left px-5 py-3 rounded-2xl border text-sm font-medium transition-all duration-200 cursor-pointer ${
                    activeIdx === idx 
                      ? 'bg-primary border-primary text-primary-foreground shadow-md shadow-primary/10'
                      : 'bg-card/40 border-border text-foreground hover:bg-muted hover:border-primary/20'
                  } disabled:opacity-50`}
                >
                  {p.question}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column UI mockup */}
        <div className="lg:col-span-7 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="w-full glass-panel rounded-3xl overflow-hidden shadow-2xl border border-border"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-border bg-card/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-xs font-mono text-muted-foreground ml-2">academia_copilot_v2.ts</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse mr-1" />
                Active Context
              </div>
            </div>

            {/* Chat Area */}
            <div ref={chatContainerRef} className="h-[420px] overflow-y-auto p-6 space-y-6 flex flex-col scrollbar-thin bg-card/20">
              <AnimatePresence initial={false}>
                {chatLog.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start gap-3.5 max-w-[85%] ${
                      msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-primary border-primary/20 text-primary-foreground'
                        : 'bg-secondary/15 border-secondary/20 text-secondary'
                    }`}>
                      {msg.sender === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                    </div>
                    
                    <div className="space-y-2">
                      <div className={`p-4 rounded-3xl text-sm leading-relaxed whitespace-pre-line shadow-sm border ${
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-none border-primary/20'
                          : 'bg-card/90 text-foreground rounded-tl-none border-border'
                      }`}>
                        {msg.text}
                      </div>

                      {msg.sources && msg.sources.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1 pl-1">
                          {msg.sources.map((src, sIdx) => (
                            <div key={sIdx} className="flex items-center gap-1.5 text-[11px] font-semibold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full border border-secondary/25">
                              <FileText size={10} />
                              {src}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Typing simulation */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3.5 max-w-[85%] self-start"
                  >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-secondary/20 bg-secondary/15 text-secondary shadow-sm">
                      <Sparkles size={16} />
                    </div>
                    <div className="space-y-2">
                      <div className="p-4 rounded-3xl rounded-tl-none text-sm leading-relaxed whitespace-pre-line bg-card/90 text-foreground border border-border shadow-sm">
                        {typedText || (
                          <div className="flex items-center gap-1 py-1">
                            <span className="h-2 w-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="h-2 w-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="h-2 w-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        )}
                      </div>
                      
                      {typedText && (
                        <div className="flex items-center gap-2 pl-2">
                          <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-secondary w-2/3 animate-[shimmer_1.5s_infinite]" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }} />
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground tracking-wider animate-pulse">MATCHING VECTOR CHUNKS...</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-border bg-card/40 flex gap-2">
              <input
                type="text"
                disabled
                placeholder={isTyping ? "AI is responding..." : "Click a prompt on the left to start..."}
                className="flex-1 bg-muted/50 border border-border rounded-2xl px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
              />
              <button disabled className="p-3 bg-muted border border-border text-muted-foreground/50 rounded-2xl flex items-center justify-center">
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
