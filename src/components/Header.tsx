import { Gamepad2, Download } from 'lucide-react';

interface HeaderProps {
  projectName: string;
  onExport: () => void;
  onNewProject: () => void;
}

export default function Header({ projectName, onExport, onNewProject }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Gamepad2 className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Universal Mod Creator</h1>
            <p className="text-sm text-blue-100">Create mods for any game</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-blue-100">Current Project</p>
            <p className="font-semibold">{projectName || 'Untitled Mod'}</p>
          </div>

          <button
            onClick={onNewProject}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            New Project
          </button>

          <button
            onClick={onExport}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
    </header>
  );
}
