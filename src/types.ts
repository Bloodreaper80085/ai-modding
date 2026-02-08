export interface Game {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  file_extensions: string[];
}

export interface ProjectFile {
  id: string;
  name: string;
  path: string;
  content: string;
  file_type: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  game_id: string;
  files: ProjectFile[];
}

export interface Suggestion {
  title: string;
  description: string;
  code?: string;
  category: string;
}
