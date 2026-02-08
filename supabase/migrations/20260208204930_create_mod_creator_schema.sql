/*
  # Mod Creator Platform Schema

  ## Overview
  Creates the complete database schema for a universal game mod creation platform
  with primary focus on Beat Saber but supporting any game.

  ## New Tables
  
  ### `games`
  Stores information about supported games
  - `id` (uuid, primary key) - Unique game identifier
  - `name` (text) - Game name (e.g., "Beat Saber")
  - `slug` (text, unique) - URL-friendly identifier
  - `description` (text) - Game description
  - `icon` (text) - Icon or emoji for the game
  - `file_extensions` (jsonb) - Supported file extensions for this game
  - `created_at` (timestamptz) - Record creation time

  ### `mod_templates`
  Stores starter templates and code snippets for different games
  - `id` (uuid, primary key) - Unique template identifier
  - `game_id` (uuid, foreign key) - References games table
  - `name` (text) - Template name
  - `description` (text) - What this template does
  - `file_structure` (jsonb) - Template file structure and content
  - `created_at` (timestamptz) - Record creation time

  ### `projects`
  Stores user mod projects
  - `id` (uuid, primary key) - Unique project identifier
  - `game_id` (uuid, foreign key) - References games table
  - `name` (text) - Project name
  - `description` (text) - Project description
  - `created_at` (timestamptz) - Record creation time
  - `updated_at` (timestamptz) - Last update time

  ### `project_files`
  Stores individual files within projects
  - `id` (uuid, primary key) - Unique file identifier
  - `project_id` (uuid, foreign key) - References projects table
  - `name` (text) - File name
  - `path` (text) - File path within project
  - `content` (text) - File content
  - `file_type` (text) - File extension/type
  - `created_at` (timestamptz) - Record creation time
  - `updated_at` (timestamptz) - Last update time

  ## Security
  - Enable RLS on all tables
  - Public read access for games and templates
  - Public access for projects and files (no auth required for this demo)

  ## Notes
  - All tables use UUID primary keys for scalability
  - JSONB used for flexible data structures
  - Timestamps track creation and modification
  - Foreign keys ensure referential integrity
*/

-- Create games table
CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT '🎮',
  file_extensions jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create mod_templates table
CREATE TABLE IF NOT EXISTS mod_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  file_structure jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES games(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create project_files table
CREATE TABLE IF NOT EXISTS project_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  path text NOT NULL,
  content text DEFAULT '',
  file_type text DEFAULT 'txt',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE mod_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;

-- RLS Policies for games (public read)
CREATE POLICY "Anyone can view games"
  ON games FOR SELECT
  USING (true);

-- RLS Policies for mod_templates (public read)
CREATE POLICY "Anyone can view templates"
  ON mod_templates FOR SELECT
  USING (true);

-- RLS Policies for projects (public access for demo)
CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create projects"
  ON projects FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update projects"
  ON projects FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete projects"
  ON projects FOR DELETE
  USING (true);

-- RLS Policies for project_files (public access for demo)
CREATE POLICY "Anyone can view project files"
  ON project_files FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create project files"
  ON project_files FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update project files"
  ON project_files FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete project files"
  ON project_files FOR DELETE
  USING (true);

-- Insert default games
INSERT INTO games (name, slug, description, icon, file_extensions) VALUES
  ('Beat Saber', 'beat-saber', 'VR rhythm game - Create custom songs, sabers, and gameplay mods', '⚔️', '["qmod", "json", "cs", "dll", "manifest"]'),
  ('Minecraft', 'minecraft', 'Sandbox game - Create blocks, items, mobs, and world generation', '🟫', '["java", "json", "mcmeta", "mcfunction", "jar"]'),
  ('Skyrim', 'skyrim', 'RPG - Create quests, items, spells, and gameplay enhancements', '🐉', '["esp", "esm", "psc", "pex", "nif"]'),
  ('GTA V', 'gta-v', 'Open world - Create scripts, vehicles, weapons, and missions', '🚗', '["asi", "dll", "lua", "xml", "meta"]'),
  ('Custom Game', 'custom', 'Any other game - Create mods with custom file types', '🎮', '["txt", "json", "xml", "ini", "cfg"]')
ON CONFLICT (slug) DO NOTHING;

-- Insert Beat Saber templates
INSERT INTO mod_templates (game_id, name, description, file_structure)
SELECT 
  id,
  'Basic Beat Saber Mod',
  'A starter template for creating Beat Saber mods with manifest and main code file',
  '{
    "files": [
      {
        "name": "manifest.json",
        "path": "manifest.json",
        "content": "{\n  \"id\": \"com.yourname.yourmod\",\n  \"name\": \"Your Mod Name\",\n  \"author\": \"Your Name\",\n  \"version\": \"1.0.0\",\n  \"gameVersion\": \"1.29.1\",\n  \"description\": \"Description of your mod\",\n  \"dependencies\": [],\n  \"modFiles\": [],\n  \"libraryFiles\": []\n}",
        "type": "json"
      },
      {
        "name": "mod.json",
        "path": "mod.json",
        "content": "{\n  \"_QPVersion\": \"0.1.1\",\n  \"name\": \"Your Mod Name\",\n  \"id\": \"yourmod\",\n  \"author\": \"Your Name\",\n  \"version\": \"1.0.0\",\n  \"packageId\": \"com.beatgames.beatsaber\",\n  \"packageVersion\": \"1.29.1\",\n  \"description\": \"Your mod description\",\n  \"dependencies\": [],\n  \"modFiles\": [],\n  \"libraryFiles\": [],\n  \"fileCopies\": []\n}",
        "type": "json"
      },
      {
        "name": "main.cs",
        "path": "main.cs",
        "content": "using System;\nusing UnityEngine;\n\nnamespace YourModNamespace\n{\n    public class MainMod : MonoBehaviour\n    {\n        void Start()\n        {\n            Debug.Log(\"Your Mod Loaded!\");\n        }\n\n        void Update()\n        {\n            // Your mod logic here\n        }\n    }\n}",
        "type": "cs"
      }
    ]
  }'::jsonb
FROM games WHERE slug = 'beat-saber'
ON CONFLICT DO NOTHING;

-- Insert Minecraft template
INSERT INTO mod_templates (game_id, name, description, file_structure)
SELECT 
  id,
  'Basic Minecraft Mod',
  'A starter template for Minecraft mods with basic block creation',
  '{
    "files": [
      {
        "name": "mod.json",
        "path": "mod.json",
        "content": "{\n  \"schemaVersion\": 1,\n  \"id\": \"yourmod\",\n  \"version\": \"1.0.0\",\n  \"name\": \"Your Mod\",\n  \"description\": \"Your mod description\",\n  \"authors\": [\"Your Name\"],\n  \"contact\": {},\n  \"license\": \"MIT\"\n}",
        "type": "json"
      },
      {
        "name": "CustomBlock.java",
        "path": "CustomBlock.java",
        "content": "package com.yourname.yourmod;\n\nimport net.minecraft.block.Block;\nimport net.minecraft.block.Material;\n\npublic class CustomBlock extends Block {\n    public CustomBlock() {\n        super(Material.STONE);\n        setUnlocalizedName(\"customBlock\");\n        setRegistryName(\"custom_block\");\n    }\n}",
        "type": "java"
      }
    ]
  }'::jsonb
FROM games WHERE slug = 'minecraft'
ON CONFLICT DO NOTHING;