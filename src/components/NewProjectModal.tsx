import { X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Game } from '../types';

interface ModTemplate {
  id: string;
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

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  games: Game[];
  templates: ModTemplate[];
  onCreateProject: (name: string, description: string, gameId: string, templateId: string | null) => void;
}

export default function NewProjectModal({
  isOpen,
  onClose,
  games,
  templates,
  onCreateProject
}: NewProjectModalProps) {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGameId, setSelectedGameId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = () => {
    if (projectName && selectedGameId) {
      onCreateProject(projectName, description, selectedGameId, selectedTemplateId);
      setProjectName('');
      setDescription('');
      setSelectedGameId('');
      setSelectedTemplateId(null);
    }
  };

  const filteredTemplates = templates.filter(t => t.id && selectedGameId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
            <p className="text-sm text-gray-600 mt-1">Start building your mod</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="My Awesome Mod"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what your mod does..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Game
            </label>
            <div className="grid grid-cols-3 gap-3">
              {games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => setSelectedGameId(game.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedGameId === game.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{game.icon}</div>
                  <div className="text-sm font-semibold text-gray-900">{game.name}</div>
                </button>
              ))}
            </div>
          </div>

          {selectedGameId && filteredTemplates.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Choose Template (optional)
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedTemplateId(null)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedTemplateId === null
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900">Start from Scratch</div>
                  <div className="text-sm text-gray-600">Create an empty project</div>
                </button>
                {filteredTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplateId(template.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedTemplateId === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      <div className="font-semibold text-gray-900">{template.name}</div>
                    </div>
                    <div className="text-sm text-gray-600">{template.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!projectName || !selectedGameId}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}
