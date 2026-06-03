import { unstable_cache } from 'next/cache';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Database, Course, Profile } from '@/types/database.types';

const supabaseAnon = createSupabaseClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Cache user's course list
export const getCachedCourses = (userId: string): Promise<Course[]> => {
  return unstable_cache(
    async (): Promise<Course[]> => {
      const { data, error } = await supabaseAnon
        .from('courses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      
      if (error) {
        throw new Error(`Failed to fetch cached courses: ${error.message}`);
      }
      return (data || []) as Course[];
    },
    [`user-courses-${userId}`],
    {
      tags: [`courses-${userId}`],
      revalidate: 3600, // Cache for up to 1 hour, or until tag invalidation
    }
  )();
};

// Cache user's profile info (e.g. credits, subscription tier)
export const getCachedProfile = (userId: string): Promise<Profile> => {
  return unstable_cache(
    async (): Promise<Profile> => {
      const { data, error } = await supabaseAnon
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        throw new Error(`Failed to fetch cached profile: ${error.message}`);
      }
      if (!data) {
        throw new Error('Profile not found');
      }
      return data as Profile;
    },
    [`user-profile-${userId}`],
    {
      tags: [`profile-${userId}`],
      revalidate: 3600, // Cache for up to 1 hour, or until tag invalidation
    }
  )();
};
