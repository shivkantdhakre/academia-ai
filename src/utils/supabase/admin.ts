import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

// Create a Supabase client using the service role key to bypass RLS for background worker processes.
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseServiceKey) {
    console.warn(
      'Warning: SUPABASE_SERVICE_ROLE_KEY is missing in env. Background worker will fall back to anon key.'
    );
    return createClient<Database>(
      supabaseUrl,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
