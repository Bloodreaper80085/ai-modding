import { X, Download, FileArchive, FileJson, FileCode } from 'lucide-react';
import { ProjectFile, Game } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: ProjectFile[];
  projectName: string;
  selectedGame: Game | null;
}

export default function ExportModal({ isOpen, onClose, files, projectName, selectedGame }: ExportModalProps) {
  if (!isOpen) return null;

  const exportAsZip = async () => {
    const JSZip = (await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm')).default;
    const zip = new JSZip();

    files.forEach(file => {
      zip.file(file.path, file.content);
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    downloadFile(blob, `${projectName}.zip`);
  };

  const exportAsQMOD = async () => {
    const JSZip = (await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm')).default;
    const zip = new JSZip();

    files.forEach(file => {
      zip.file(file.path, file.content);
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    downloadFile(blob, `${projectName}.qmod`);
  };

  const exportAsJSON = () => {
    const exportData = {
      projectName,
      game: selectedGame?.name,
      files: files.map(f => ({
        name: f.name,
        path: f.path,
        content: f.content,
        type: f.file_type
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    downloadFile(blob, `${projectName}.json`);
  };

  const exportIndividualFiles = () => {
    files.forEach(file => {
      const blob = new Blob([file.content], { type: 'text/plain' });
      downloadFile(blob, file.name);
    });
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportOptions = [
    {
      title: 'Export as .qmod',
      description: 'Beat Saber mod format (ZIP-based)',
      icon: FileArchive,
      action: exportAsQMOD,
      color: 'blue'
    },
    {
      title: 'Export as .zip',
      description: 'Universal compressed archive',
      icon: FileArchive,
      action: exportAsZip,
      color: 'green'
    },
    {
      title: 'Export as JSON',
      description: 'Project data in JSON format',
      icon: FileJson,
      action: exportAsJSON,
      color: 'yellow'
    },
    {
      title: 'Export Individual Files',
      description: 'Download each file separately',
      icon: FileCode,
      action: exportIndividualFiles,
      color: 'purple'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Export Project</h2>
            <p className="text-sm text-gray-600 mt-1">Choose your export format</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-2 gap-4">
          {exportOptions.map((option, index) => {
            const Icon = option.icon;
            const colorClasses = {
              blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
              green: 'bg-green-50 border-green-200 hover:bg-green-100',
              yellow: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
              purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
            };
            const iconColors = {
              blue: 'text-blue-600',
              green: 'text-green-600',
              yellow: 'text-yellow-600',
              purple: 'text-purple-600'
            };

            return (
              <button
                key={index}
                onClick={option.action}
                className={`p-4 rounded-lg border-2 transition-all text-left ${colorClasses[option.color as keyof typeof colorClasses]}`}
              >
                <Icon className={`w-8 h-8 mb-3 ${iconColors[option.color as keyof typeof iconColors]}`} />
                <h3 className="font-semibold text-gray-900 mb-1">{option.title}</h3>
                <p className="text-sm text-gray-600">{option.description}</p>
              </button>
            );
          })}
        </div>

        <div className="p-6 bg-gray-50 rounded-b-xl border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Download className="w-4 h-4" />
            <p>
              <span className="font-semibold">{files.length}</span> files ready to export
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
