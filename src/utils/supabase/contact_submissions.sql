-- Create contact submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for public contact form submissions)
DROP POLICY IF EXISTS "Allow anonymous insert access" ON public.contact_submissions;
CREATE POLICY "Allow anonymous insert access" ON public.contact_submissions
  FOR INSERT WITH CHECK (true);
