import { motion } from 'motion/react';
import { ArrowLeft, Trophy, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';

interface EquationSelectProps {
  level: number;
  onSelectEquation: (equation: string) => void;
  onBack: () => void;
}

interface EquationData {
  id: number;
  equation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  stars: number;
}

// Generate 20 equations for the level
const generateEquations = (level: number): EquationData[] => {
  const equations: EquationData[] = [
    { id: 1, equation: 'x + 3 = 7', difficulty: 'easy', completed: true, stars: 3 },
    { id: 2, equation: '2x = 8', difficulty: 'easy', completed: true, stars: 3 },
    { id: 3, equation: 'x - 5 = 2', difficulty: 'easy', completed: true, stars: 2 },
    { id: 4, equation: '3x = 12', difficulty: 'easy', completed: false, stars: 0 },
    { id: 5, equation: '5x + 2 = 3', difficulty: 'medium', completed: false, stars: 0 },
    { id: 6, equation: '4x - 1 = 11', difficulty: 'medium', completed: false, stars: 0 },
    { id: 7, equation: '2x + 5 = 13', difficulty: 'medium', completed: false, stars: 0 },
    { id: 8, equation: '6x - 3 = 15', difficulty: 'medium', completed: false, stars: 0 },
    { id: 9, equation: 'x / 2 = 4', difficulty: 'easy', completed: false, stars: 0 },
    { id: 10, equation: '3x + 7 = 22', difficulty: 'medium', completed: false, stars: 0 },
    { id: 11, equation: '5x - 4 = 16', difficulty: 'medium', completed: false, stars: 0 },
    { id: 12, equation: '2x + 3 = 9', difficulty: 'medium', completed: false, stars: 0 },
    { id: 13, equation: '4x + 1 = 17', difficulty: 'medium', completed: false, stars: 0 },
    { id: 14, equation: '7x - 2 = 19', difficulty: 'hard', completed: false, stars: 0 },
    { id: 15, equation: '3x + 8 = 20', difficulty: 'medium', completed: false, stars: 0 },
    { id: 16, equation: '6x - 5 = 13', difficulty: 'hard', completed: false, stars: 0 },
    { id: 17, equation: '2x + 7 = 15', difficulty: 'medium', completed: false, stars: 0 },
    { id: 18, equation: '8x - 3 = 29', difficulty: 'hard', completed: false, stars: 0 },
    { id: 19, equation: '4x + 6 = 22', difficulty: 'hard', completed: false, stars: 0 },
    { id: 20, equation: '9x - 7 = 20', difficulty: 'hard', completed: false, stars: 0 },
  ];

  return equations;
};

const difficultyColors = {
  easy: 'from-green-400 to-green-600',
  medium: 'from-orange-400 to-orange-600',
  hard: 'from-red-400 to-red-600',
};

const difficultyLabels = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

export function EquationSelect({ level, onSelectEquation, onBack }: EquationSelectProps) {
  const equations = generateEquations(level);
  const completedCount = equations.filter((eq) => eq.completed).length;
  const totalStars = equations.reduce((sum, eq) => sum + eq.stars, 0);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-white tracking-tight">Level {level}</h1>
              <p className="text-white/90 text-sm">
                Choose an equation to solve
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-white">
              <Trophy className="h-5 w-5" />
              <span>{totalStars} stars</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <CheckCircle2 className="h-5 w-5" />
              <span>
                {completedCount}/{equations.length} complete
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Equations Grid */}
      <div className="flex-1 px-8 py-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {equations.map((equationData, index) => (
              <motion.div
                key={equationData.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
              >
                <EquationCard
                  equationData={equationData}
                  onClick={() => onSelectEquation(equationData.equation)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface EquationCardProps {
  equationData: EquationData;
  onClick: () => void;
}

function EquationCard({ equationData, onClick }: EquationCardProps) {
  const { id, equation, difficulty, completed, stars } = equationData;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
      className="relative w-full aspect-square rounded-2xl shadow-lg border-4 border-white bg-white hover:shadow-2xl transition-all group"
    >
      {/* Number Badge */}
      <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-md flex items-center justify-center border-2 border-white">
        <span className="text-white text-sm">{id}</span>
      </div>

      {/* Completed Badge */}
      {completed && (
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-green-500 shadow-md flex items-center justify-center border-2 border-white">
          <CheckCircle2 className="h-4 w-4 text-white" />
        </div>
      )}

      {/* Content */}
      <div className="h-full flex flex-col items-center justify-center p-4">
        {/* Equation */}
        <div className="mb-3">
          <p className="text-gray-900">{equation}</p>
        </div>

        {/* Difficulty Badge */}
        <div
          className={`px-3 py-1 rounded-full bg-gradient-to-r ${difficultyColors[difficulty]} text-white text-xs mb-2`}
        >
          {difficultyLabels[difficulty]}
        </div>

        {/* Stars */}
        {completed && (
          <div className="flex gap-1">
            {[1, 2, 3].map((starNum) => (
              <div
                key={starNum}
                className={`w-3 h-3 rounded-full ${
                  starNum <= stars ? 'bg-yellow-400' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all" />
    </motion.button>
  );
}
