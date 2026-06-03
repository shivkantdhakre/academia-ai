'use server';

import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  message: z.string().min(5, 'Message must be at least 5 characters').max(2000),
});

export type FormState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
};

export async function submitContactForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  // Validate the data
  const validated = contactSchema.safeParse({ name, email, message });

  if (!validated.success) {
    return {
      success: false,
      message: 'Please fix the errors below.',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await (supabase as any)
      .from('contact_submissions')
      .insert({
        name: validated.data.name,
        email: validated.data.email,
        message: validated.data.message,
      });

    if (error) {
      console.error('Supabase error inserting contact submission:', error);
      return {
        success: false,
        message: 'Could not submit your message. Please try again later.',
      };
    }

    return {
      success: true,
      message: 'Thank you! Your request has been successfully submitted.',
    };
  } catch (err) {
    console.error('Unexpected error inserting contact submission:', err);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
    };
  }
}
