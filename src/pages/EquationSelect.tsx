import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import type { EquationData } from '../data/equations';
import { equations } from '../data/equations';

interface EquationSelectProps {
  level: number;
  onSelectEquation: (equation: string) => void;
  onBack: () => void;
}

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
  const levelEquations = equations[level] || [];
  const completedCount = levelEquations.filter((eq: EquationData) => eq.completed).length;
  const totalStars = levelEquations.reduce((sum: number, eq: EquationData) => sum + eq.stars, 0);

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
                {completedCount}/{levelEquations.length} complete
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Equations Grid */}
      <div className="flex-1 px-8 py-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {levelEquations.map((equationData: EquationData, index: number) => (
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
