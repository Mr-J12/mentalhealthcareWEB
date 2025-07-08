import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  updated_at: string;
}

export interface MoodEntry {
  id: string;
  user_id: string;
  mood_level: number;
  note: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  content: string;
  is_user_message: boolean;
  created_at: string;
}

export interface BreathingSession {
  id: string;
  user_id: string;
  cycles_completed: number;
  duration_minutes: number;
  created_at: string;
}