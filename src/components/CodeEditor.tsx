import { Code2, Save } from 'lucide-react';
import { ProjectFile } from '../types';

interface CodeEditorProps {
  file: ProjectFile | null;
  onChange: (content: string) => void;
  onSave: () => void;
}

export default function CodeEditor({ file, onChange, onSave }: CodeEditorProps) {
  if (!file) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <Code2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No file selected</p>
          <p className="text-sm">Select a file from the sidebar or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">{file.name}</h3>
          <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded font-mono">
            .{file.file_type}
          </span>
        </div>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
      </div>

      <textarea
        value={file.content}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 p-4 font-mono text-sm bg-gray-900 text-gray-100 resize-none focus:outline-none"
        placeholder="Start coding your mod here..."
        spellCheck={false}
      />
    </div>
  );
}
