export interface Course {
  id: string; // uuid, primary key
  title: string; // text
  progress: number; // integer progress percentage (e.g., 0-100)
  icon_name: string; // text representing Lucide icon name
  user_id: string; // uuid referencing auth.users
  created_at: string; // timestamp with time zone (ISO-8601 string)
}

export interface Profile {
  id: string; // uuid, primary key referencing auth.users
  email: string | null;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  ai_credits_remaining: number;
  updated_at: string;
}

export interface CourseMaterial {
  id: string; // uuid, primary key
  course_id: string; // uuid referencing courses
  content: string; // text
  embedding: number[]; // vector(768) represented as number array
  metadata: any; // jsonb
  created_at: string; // timestamptz
}

export interface ContactSubmission {
  id: string; // uuid, primary key
  name: string; // text
  email: string; // text
  message: string; // text
  created_at: string; // timestamp with time zone
}

export interface CourseMaterialsUpload {
  id: string; // uuid, primary key
  course_id: string; // uuid referencing courses
  filename: string; // text
  status: 'processing' | 'completed' | 'failed'; // text
  error_message: string | null; // text
  created_at: string; // timestamptz
}

export interface Database {
  public: {
    Tables: {
      courses: {
        Row: Course;
        Insert: Omit<Course, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Course>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'updated_at'> & {
          updated_at?: string;
        };
        Update: Partial<Profile>;
      };
      course_materials: {
        Row: CourseMaterial;
        Insert: Omit<CourseMaterial, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
          metadata?: any;
        };
        Update: Partial<CourseMaterial>;
      };
      contact_submissions: {
        Row: ContactSubmission;
        Insert: Omit<ContactSubmission, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<ContactSubmission>;
      };
      course_materials_uploads: {
        Row: CourseMaterialsUpload;
        Insert: Omit<CourseMaterialsUpload, 'id' | 'created_at' | 'status' | 'error_message'> & {
          id?: string;
          created_at?: string;
          status?: 'processing' | 'completed' | 'failed';
          error_message?: string | null;
        };
        Update: Partial<CourseMaterialsUpload>;
      };
    };
  };
}
