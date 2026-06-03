'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as Icons from 'lucide-react';

interface StudyMaterialFormProps {
  courseId: string;
}

export function StudyMaterialForm({ courseId }: StudyMaterialFormProps) {
  const router = useRouter();
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [jobStatus, setJobStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');
  const [feedback, setFeedback] = useState<{ error?: string; success?: string }>({});
  
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clear polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setText(''); // Clear text when a file is selected
      setFeedback({});
    }
  };

  const handleClearFile = () => {
    setFile(null);
  };

  const pollJobStatus = (uploadId: string) => {
    setJobStatus('processing');
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    pollIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/course-materials/upload/status?upload_id=${uploadId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch job status');
        }

        const data = await response.json();
        
        if (data.status === 'completed') {
          setJobStatus('completed');
          setFeedback({ success: 'Study material successfully processed, chunked, and indexed!' });
          setFile(null);
          setText('');
          setIsUploading(false);
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          router.refresh(); // Refresh page data to show new material chunks
        } else if (data.status === 'failed') {
          setJobStatus('failed');
          setFeedback({ error: data.error_message || 'Indexing process failed. Please try again.' });
          setIsUploading(false);
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        }
      } catch (err: any) {
        console.error('Error polling job status:', err);
      }
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) return;

    if (!file && !text.trim()) {
      setFeedback({ error: 'Please enter notes text or select a file to upload.' });
      return;
    }

    setIsUploading(true);
    setJobStatus('processing');
    setFeedback({});

    try {
      let response;
      if (file) {
        const formData = new FormData();
        formData.append('course_id', courseId);
        formData.append('file', file);

        response = await fetch('/api/course-materials/upload', {
          method: 'POST',
          body: formData,
        });
      } else {
        response = await fetch('/api/course-materials/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ course_id: courseId, text: text.trim() }),
        });
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate study material upload');
      }

      // Start polling the job status in the background
      pollJobStatus(data.uploadId);

    } catch (err: any) {
      console.error(err);
      setFeedback({ error: err.message || 'Something went wrong. Please try again.' });
      setIsUploading(false);
      setJobStatus('failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* File Upload Selector */}
      <div className="space-y-2">
        <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
          Upload Reading Material (PDF, TXT, MD)
        </label>
        
        {file ? (
          <div className="flex items-center justify-between p-3.5 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <Icons.FileText className="text-indigo-400 shrink-0" size={16} />
              <span className="text-slate-200 truncate font-semibold">{file.name}</span>
              <span className="text-[10px] text-slate-500 font-mono shrink-0">
                ({Math.round(file.size / 1024)} KB)
              </span>
            </div>
            <button
              type="button"
              onClick={handleClearFile}
              disabled={isUploading}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Icons.X size={14} />
            </button>
          </div>
        ) : (
          <div className="relative group border border-dashed border-white/10 hover:border-indigo-500/30 rounded-2xl p-6 transition-all bg-[#030303]/20 flex flex-col items-center justify-center text-center cursor-pointer">
            <input
              type="file"
              accept=".pdf,.txt,.md"
              onChange={handleFileChange}
              disabled={isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Icons.UploadCloud className="text-slate-500 group-hover:text-indigo-400 transition-colors mb-2" size={24} />
            <p className="text-xs text-slate-300 font-bold">Click or drag file to upload</p>
            <p className="text-[10px] text-slate-500 mt-1">PDF, TXT, or MD up to 10MB</p>
          </div>
        )}
      </div>

      {/* Or Separator */}
      {!file && (
        <div className="flex items-center gap-3">
          <div className="flex-grow border-t border-white/5" />
          <span className="text-[9px] uppercase font-bold tracking-widest text-slate-600">OR</span>
          <div className="flex-grow border-t border-white/5" />
        </div>
      )}

      {/* Text Area Input */}
      {!file && (
        <div>
          <label htmlFor="material-text" className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">
            Paste Course Materials or Notes
          </label>
          <textarea
            id="material-text"
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste extra chapters, study guides, definitions, or custom notes here... (minimum 10 characters)"
            disabled={isUploading}
            className="w-full bg-[#030303]/60 border border-white/5 hover:border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 rounded-2xl p-4 text-xs text-white placeholder-slate-600 outline-none transition-all duration-200 resize-y"
          />
        </div>
      )}

      {feedback.error && (
        <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-2xl text-xs flex items-center gap-2">
          <Icons.AlertCircle size={14} className="text-rose-400 shrink-0" />
          <span>{feedback.error}</span>
        </div>
      )}

      {feedback.success && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-2xl text-xs flex items-center gap-2">
          <Icons.CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
          <span>{feedback.success}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isUploading || (!file && !text.trim())}
        className="w-full py-2.5 px-5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
      >
        {isUploading ? (
          <>
            <Icons.Loader2 size={12} className="animate-spin text-indigo-400" />
            <span>
              {jobStatus === 'processing' ? 'Queueing & Indexing...' : 'Uploading File...'}
            </span>
          </>
        ) : (
          <>
            <Icons.UploadCloud size={12} />
            <span>{file ? 'Upload & Index File' : 'Add Study Material'}</span>
          </>
        )}
      </button>
    </form>
  );
}
