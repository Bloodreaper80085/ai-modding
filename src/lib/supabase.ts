import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Game {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  file_extensions: string[];
  created_at: string;
}

export interface ModTemplate {
  id: string;
  game_id: string;
  name: string;
  description: string;
  file_structure: {
    files: Array<{
      name: string;
      path: string;
      content: string;
      type: string;
    }>;
  };
  created_at: string;
}

export interface Project {
  id: string;
  game_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  name: string;
  path: string;
  content: string;
  file_type: string;
  created_at: string;
  updated_at: string;
}
