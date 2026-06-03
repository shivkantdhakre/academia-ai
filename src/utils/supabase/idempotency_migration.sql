-- Create public.processed_orders table for tracking fulfilled orders
CREATE TABLE IF NOT EXISTS public.processed_orders (
  order_id text PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  payment_id text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security (RLS) on processed_orders
ALTER TABLE public.processed_orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for processed_orders
DROP POLICY IF EXISTS "Users can read their own processed orders" ON public.processed_orders;
CREATE POLICY "Users can read their own processed orders" ON public.processed_orders
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can insert processed orders" ON public.processed_orders;
CREATE POLICY "System can insert processed orders" ON public.processed_orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
