import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { inngest } from '@/utils/inngest';

export async function POST(req: Request) {
  try {
    // 1. Authenticate user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = req.headers.get('content-type') || '';
    let course_id = '';
    let text = '';
    let file: File | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      course_id = formData.get('course_id') as string;
      file = formData.get('file') as File;
    } else {
      let body;
      try {
        body = await req.json();
      } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
      }
      course_id = body.course_id;
      text = body.text;
    }

    if (!course_id) {
      return NextResponse.json({ error: 'Missing course_id.' }, { status: 400 });
    }

    if (!text && !file) {
      return NextResponse.json({ error: 'Missing text content or file.' }, { status: 400 });
    }

    // 2. Verify user owns the course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id')
      .eq('id', course_id)
      .eq('user_id', user.id)
      .single();

    if (courseError || !course) {
      return NextResponse.json({ error: 'Course not found or unauthorized' }, { status: 404 });
    }

    let uploadData: any = null;
    let filePath: string | null = null;

    if (file) {
      // Handle file upload
      const fileExt = file.name.split('.').pop() || '';
      const allowedExts = ['pdf', 'txt', 'md'];
      if (!allowedExts.includes(fileExt.toLowerCase())) {
        return NextResponse.json({ error: 'Only PDF, TXT, or MD files are supported.' }, { status: 400 });
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
      filePath = `${user.id}/${course_id}/${Date.now()}_${safeName}`;
      
      const fileBuffer = Buffer.from(await file.arrayBuffer());

      // Upload to storage
      const { error: storageError } = await supabase.storage
        .from('course-materials')
        .upload(filePath, fileBuffer, {
          contentType: file.type,
          upsert: false
        });

      if (storageError) {
        console.error('Supabase Storage upload error:', storageError);
        return NextResponse.json({ error: `Failed to upload file to storage: ${storageError.message}` }, { status: 500 });
      }

      // Create upload tracking record
      const { data, error: uploadDbError } = await (supabase as any)
        .from('course_materials_uploads')
        .insert({
          course_id,
          filename: file.name,
          status: 'processing',
        })
        .select('id')
        .single();

      if (uploadDbError || !data) {
        console.error('Failed to create upload record:', uploadDbError);
        return NextResponse.json({ error: 'Failed to create upload tracking record' }, { status: 500 });
      }
      uploadData = data;
    } else {
      // Handle text upload
      if (text.trim().length < 10) {
        return NextResponse.json({ error: 'Pasted text must be at least 10 characters long.' }, { status: 400 });
      }

      // Create upload tracking record
      const { data, error: uploadDbError } = await (supabase as any)
        .from('course_materials_uploads')
        .insert({
          course_id,
          filename: 'Pasted Notes',
          status: 'processing',
        })
        .select('id')
        .single();

      if (uploadDbError || !data) {
        console.error('Failed to create upload record:', uploadDbError);
        return NextResponse.json({ error: 'Failed to create upload tracking record' }, { status: 500 });
      }
      uploadData = data;
    }

    // 3. Trigger Inngest background event
    await inngest.send({
      name: 'course/material.process',
      data: {
        course_id,
        upload_id: uploadData.id,
        text: text ? text.trim() : undefined,
        filePath: filePath || undefined,
      },
    });

    return NextResponse.json({
      success: true,
      uploadId: uploadData.id,
      status: 'processing',
    });
  } catch (error: any) {
    console.error('Upload Endpoint Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to initiate upload processing' }, { status: 500 });
  }
}
