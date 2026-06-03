import { serve } from 'inngest/next';
import { inngest } from '@/utils/inngest';
import { createAdminClient } from '@/utils/supabase/admin';
import { embed } from 'ai';
import { google } from '@/utils/google';
import * as Sentry from '@sentry/nextjs';
import { PDFParse } from 'pdf-parse';
import { chunkText } from '@/utils/chunk';



const processMaterial = inngest.createFunction(
  { 
    id: 'process-material', 
    name: 'Process Course Study Material',
    triggers: [{ event: 'course/material.process' }]
  },
  async ({ event, step }) => {
    const { course_id, upload_id, text: rawText, filePath } = event.data;
    const supabase = createAdminClient();

    // 1. Mark upload job as processing
    await step.run('update-status-processing', async () => {
      await (supabase as any)
        .from('course_materials_uploads')
        .update({ status: 'processing' })
        .eq('id', upload_id);
    });

    try {
      // 2. Resolve text content
      let textContent = '';
      if (rawText) {
        textContent = rawText;
      } else if (filePath) {
        textContent = await step.run('download-and-parse-file', async () => {
          const { data, error } = await (supabase as any).storage
            .from('course-materials')
            .download(filePath);

          if (error || !data) {
            throw new Error(`Failed to download file from storage: ${error?.message || 'unknown error'}`);
          }

          const fileBuffer = Buffer.from(await data.arrayBuffer());
          
          if (filePath.toLowerCase().endsWith('.pdf')) {
            const parser = new PDFParse({ data: fileBuffer });
            const parsed = await parser.getText();
            await parser.destroy();
            if (!parsed.text || !parsed.text.trim()) {
              throw new Error('PDF file appears to be empty or unreadable.');
            }
            return parsed.text;
          } else {
            // Default to text parsing
            return fileBuffer.toString('utf-8');
          }
        });
      }

      if (!textContent || !textContent.trim()) {
        throw new Error('No content found to index.');
      }

      // 3. Chunk text
      const chunks = chunkText(textContent);
      if (chunks.length === 0) {
        throw new Error('Content is too short or empty.');
      }

      // 4. Generate embeddings and save
      await step.run('generate-embeddings-and-save', async () => {
        const materialsToInsert: any[] = [];
        
        for (const chunk of chunks) {
          const { embedding } = await embed({
            model: google.textEmbeddingModel('gemini-embedding-2'),
            value: chunk,
            providerOptions: {
              google: {
                outputDimensionality: 768,
              },
            },
          });

          materialsToInsert.push({
            course_id,
            content: chunk,
            embedding,
          });
        }

        // Bulk insert chunks
        const { error: insertError } = await (supabase as any)
          .from('course_materials')
          .insert(materialsToInsert);

        if (insertError) {
          throw new Error(`Failed to save course materials in database: ${insertError.message}`);
        }
      });

      // 5. Mark job as completed
      await step.run('update-status-completed', async () => {
        await (supabase as any)
          .from('course_materials_uploads')
          .update({ status: 'completed' })
          .eq('id', upload_id);
      });

      return { success: true, chunksCount: chunks.length };

    } catch (err: any) {
      console.error('Inngest Background Process Error:', err);
      Sentry.captureException(err);

      // Mark job as failed with error details
      await step.run('update-status-failed', async () => {
        await (supabase as any)
          .from('course_materials_uploads')
          .update({ 
            status: 'failed',
            error_message: err.message || 'Unknown processing failure'
          })
          .eq('id', upload_id);
      });

      throw err; // Allow Inngest to handle retry configuration
    }
  }
);

// Expose serve endpoint
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processMaterial],
});
