import { Game } from '../types';

interface GameSelectorProps {
  games: Game[];
  selectedGame: Game | null;
  onSelectGame: (game: Game) => void;
}

export default function GameSelector({ games, selectedGame, onSelectGame }: GameSelectorProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Select Game</h2>
        <div className="grid grid-cols-5 gap-3">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => onSelectGame(game)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedGame?.id === game.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-4xl mb-2">{game.icon}</div>
              <div className="text-sm font-semibold text-gray-900">{game.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
