import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import Header from './components/Header';
import GameSelector from './components/GameSelector';
import FileTree from './components/FileTree';
import CodeEditor from './components/CodeEditor';
import SuggestionsPanel from './components/SuggestionsPanel';
import ExportModal from './components/ExportModal';
import NewProjectModal from './components/NewProjectModal';
import { Game, ProjectFile, Project } from './types';

interface ModTemplate {
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
}

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [templates, setTemplates] = useState<ModTemplate[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(true);

  useEffect(() => {
    loadGames();
    loadTemplates();
  }, []);

  const loadGames = async () => {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('name');

    if (!error && data) {
      setGames(data);
    }
  };

  const loadTemplates = async () => {
    const { data, error } = await supabase
      .from('mod_templates')
      .select('*');

    if (!error && data) {
      setTemplates(data);
    }
  };

  const createProject = async (
    name: string,
    description: string,
    gameId: string,
    templateId: string | null
  ) => {
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        name,
        description,
        game_id: gameId
      })
      .select()
      .single();

    if (error || !project) {
      console.error('Error creating project:', error);
      return;
    }

    const game = games.find(g => g.id === gameId);
    setSelectedGame(game || null);
    setCurrentProject(project);

    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template && template.file_structure.files) {
        const newFiles: ProjectFile[] = [];

        for (const file of template.file_structure.files) {
          const { data: createdFile } = await supabase
            .from('project_files')
            .insert({
              project_id: project.id,
              name: file.name,
              path: file.path,
              content: file.content,
              file_type: file.type
            })
            .select()
            .single();

          if (createdFile) {
            newFiles.push(createdFile);
          }
        }

        setFiles(newFiles);
        if (newFiles.length > 0) {
          setSelectedFile(newFiles[0]);
        }
      }
    } else {
      setFiles([]);
    }

    setIsNewProjectModalOpen(false);
  };

  const addNewFile = async () => {
    if (!currentProject) return;

    const fileName = prompt('Enter file name (e.g., script.cs, config.json):');
    if (!fileName) return;

    const extension = fileName.split('.').pop() || 'txt';

    const { data: newFile, error } = await supabase
      .from('project_files')
      .insert({
        project_id: currentProject.id,
        name: fileName,
        path: fileName,
        content: '',
        file_type: extension
      })
      .select()
      .single();

    if (!error && newFile) {
      setFiles([...files, newFile]);
      setSelectedFile(newFile);
    }
  };

  const deleteFile = async (fileId: string) => {
    const { error } = await supabase
      .from('project_files')
      .delete()
      .eq('id', fileId);

    if (!error) {
      const newFiles = files.filter(f => f.id !== fileId);
      setFiles(newFiles);
      if (selectedFile?.id === fileId) {
        setSelectedFile(newFiles[0] || null);
      }
    }
  };

  const updateFileContent = (content: string) => {
    if (selectedFile) {
      setSelectedFile({ ...selectedFile, content });
    }
  };

  const saveFile = async () => {
    if (!selectedFile) return;

    const { error } = await supabase
      .from('project_files')
      .update({
        content: selectedFile.content,
        updated_at: new Date().toISOString()
      })
      .eq('id', selectedFile.id);

    if (!error) {
      const updatedFiles = files.map(f =>
        f.id === selectedFile.id ? selectedFile : f
      );
      setFiles(updatedFiles);
    }
  };

  const applySuggestion = (code: string) => {
    if (selectedFile) {
      const newContent = selectedFile.content
        ? `${selectedFile.content}\n\n${code}`
        : code;
      updateFileContent(newContent);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header
        projectName={currentProject?.name || 'Untitled Mod'}
        onExport={() => setIsExportModalOpen(true)}
        onNewProject={() => setIsNewProjectModalOpen(true)}
      />

      <GameSelector
        games={games}
        selectedGame={selectedGame}
        onSelectGame={setSelectedGame}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="w-64">
          <FileTree
            files={files}
            selectedFile={selectedFile}
            onSelectFile={setSelectedFile}
            onAddFile={addNewFile}
            onDeleteFile={deleteFile}
          />
        </div>

        <div className="flex-1">
          <CodeEditor
            file={selectedFile}
            onChange={updateFileContent}
            onSave={saveFile}
          />
        </div>

        <div className="w-80">
          <SuggestionsPanel
            selectedGame={selectedGame}
            onApplySuggestion={applySuggestion}
          />
        </div>
      </div>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        files={files}
        projectName={currentProject?.name || 'mod'}
        selectedGame={selectedGame}
      />

      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        games={games}
        templates={templates}
        onCreateProject={createProject}
      />
    </div>
  );
}

export default App;
