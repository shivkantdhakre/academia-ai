import { createClient } from '@/utils/supabase/server';
import { CourseGrid } from '@/components/CourseGrid';
import { getCachedCourses } from '@/utils/cache';
import { redirect } from 'next/navigation';

export default async function CoursesPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const courses = await getCachedCourses(user.id);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          My Courses
        </h2>
        <p className="text-slate-400 mt-2 text-sm md:text-base">
          Manage and track your active study curriculums.
        </p>
      </div>

      <CourseGrid courses={courses || []} />
    </div>
  );
}
