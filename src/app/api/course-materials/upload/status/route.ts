import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Get the background processing status of an upload job.
export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const upload_id = searchParams.get('upload_id');

    if (!upload_id) {
      return NextResponse.json({ error: 'Missing upload_id' }, { status: 400 });
    }

    const { data, error } = await (supabase as any)
      .from('course_materials_uploads')
      .select('*')
      .eq('id', upload_id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Upload job not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
