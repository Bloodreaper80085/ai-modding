import { File, Plus, Trash2, FolderOpen } from 'lucide-react';
import { ProjectFile } from '../types';

interface FileTreeProps {
  files: ProjectFile[];
  selectedFile: ProjectFile | null;
  onSelectFile: (file: ProjectFile) => void;
  onAddFile: () => void;
  onDeleteFile: (fileId: string) => void;
}

export default function FileTree({
  files,
  selectedFile,
  onSelectFile,
  onAddFile,
  onDeleteFile,
}: FileTreeProps) {
  return (
    <div className="h-full bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Files</h3>
        </div>
        <button
          onClick={onAddFile}
          className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
          title="Add new file"
        >
          <Plus className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {files.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No files yet. Click + to add a file.
          </div>
        ) : (
          <div className="p-2">
            {files.map((file) => (
              <div
                key={file.id}
                className={`group flex items-center justify-between px-3 py-2 rounded-lg mb-1 cursor-pointer transition-colors ${
                  selectedFile?.id === file.id
                    ? 'bg-blue-100 text-blue-900'
                    : 'hover:bg-gray-200 text-gray-700'
                }`}
                onClick={() => onSelectFile(file)}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <File className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium truncate">{file.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFile(file.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                  title="Delete file"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
