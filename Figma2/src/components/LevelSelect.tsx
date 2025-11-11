import { motion } from 'motion/react';
import { Lock, Star, Trophy } from 'lucide-react';

interface LevelSelectProps {
  onSelectLevel: (level: number) => void;
}

interface LevelData {
  level: number;
  name: string;
  description: string;
  stars: number;
  locked: boolean;
  color: string;
}

const levels: LevelData[] = [
  {
    level: 1,
    name: 'Getting Started',
    description: 'Basic addition and subtraction',
    stars: 3,
    locked: false,
    color: 'from-purple-400 to-purple-600',
  },
  {
    level: 2,
    name: 'Simple Steps',
    description: 'One-step equations',
    stars: 3,
    locked: false,
    color: 'from-orange-400 to-orange-600',
  },
  {
    level: 3,
    name: 'Two-Step Challenge',
    description: 'Two-step equations',
    stars: 2,
    locked: false,
    color: 'from-teal-400 to-teal-600',
  },
  {
    level: 4,
    name: 'Variable Ventures',
    description: 'Variables on both sides',
    stars: 1,
    locked: false,
    color: 'from-pink-400 to-pink-600',
  },
  {
    level: 5,
    name: 'Distribution Station',
    description: 'Using the distributive property',
    stars: 0,
    locked: false,
    color: 'from-yellow-400 to-yellow-600',
  },
  {
    level: 6,
    name: 'Fraction Action',
    description: 'Equations with fractions',
    stars: 0,
    locked: true,
    color: 'from-blue-400 to-blue-600',
  },
  {
    level: 7,
    name: 'Decimal Decisions',
    description: 'Working with decimals',
    stars: 0,
    locked: true,
    color: 'from-indigo-400 to-indigo-600',
  },
  {
    level: 8,
    name: 'Multi-Step Mastery',
    description: 'Complex multi-step problems',
    stars: 0,
    locked: true,
    color: 'from-red-400 to-red-600',
  },
  {
    level: 9,
    name: 'Expert Equations',
    description: 'Advanced solving techniques',
    stars: 0,
    locked: true,
    color: 'from-green-400 to-green-600',
  },
  {
    level: 10,
    name: 'Algebra Master',
    description: 'The ultimate challenge',
    stars: 0,
    locked: true,
    color: 'from-purple-600 to-pink-600',
  },
];

export function LevelSelect({ onSelectLevel }: LevelSelectProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-white tracking-tight text-center mb-2">
            🎮 Algebra Is A Game
          </h1>
          <p className="text-white/90 text-center">
            Choose your level and start solving!
          </p>
        </div>
      </header>

      {/* Level Grid */}
      <div className="flex-1 px-8 py-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {levels.map((levelData, index) => (
              <motion.div
                key={levelData.level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <LevelCard
                  levelData={levelData}
                  onClick={() => !levelData.locked && onSelectLevel(levelData.level)}
                />
              </motion.div>
            ))}
          </div>

          {/* Stats Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 bg-white rounded-3xl shadow-xl p-8 border-4 border-purple-200"
          >
            <div className="flex items-center justify-around flex-wrap gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <span className="text-gray-400">x</span>
                  <span className="text-gray-900">9</span>
                </div>
                <p className="text-gray-600">Stars Earned</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white">
                    5
                  </div>
                </div>
                <p className="text-gray-600">Levels Unlocked</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white">
                    50
                  </div>
                  <span className="text-gray-400">%</span>
                </div>
                <p className="text-gray-600">Progress</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

interface LevelCardProps {
  levelData: LevelData;
  onClick: () => void;
}

function LevelCard({ levelData, onClick }: LevelCardProps) {
  const { level, name, description, stars, locked, color } = levelData;

  return (
    <motion.button
      onClick={onClick}
      disabled={locked}
      whileHover={!locked ? { scale: 1.05, y: -4 } : {}}
      whileTap={!locked ? { scale: 0.95 } : {}}
      className={`
        relative w-full aspect-square rounded-3xl shadow-xl
        border-4 border-white
        transition-all
        ${
          locked
            ? 'bg-gradient-to-br from-gray-300 to-gray-400 cursor-not-allowed opacity-60'
            : `bg-gradient-to-br ${color} cursor-pointer hover:shadow-2xl`
        }
      `}
    >
      {/* Level Number Badge */}
      <div className="absolute -top-3 -left-3 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-current">
        <span className="text-gray-900">{level}</span>
      </div>

      {/* Content */}
      <div className="h-full flex flex-col items-center justify-center p-4 text-center">
        {locked ? (
          <Lock className="h-12 w-12 text-white mb-2" />
        ) : (
          <>
            {/* Stars */}
            <div className="flex gap-1 mb-3">
              {[1, 2, 3].map((starNum) => (
                <Star
                  key={starNum}
                  className={`h-5 w-5 ${
                    starNum <= stars
                      ? 'fill-yellow-300 text-yellow-400'
                      : 'fill-white/30 text-white/50'
                  }`}
                />
              ))}
            </div>

            <h3 className="text-white mb-1">{name}</h3>
            <p className="text-white/80 text-xs">{description}</p>
          </>
        )}
      </div>

      {/* Hover effect overlay */}
      {!locked && (
        <div className="absolute inset-0 rounded-3xl bg-white/0 hover:bg-white/10 transition-colors" />
      )}
    </motion.button>
  );
}
