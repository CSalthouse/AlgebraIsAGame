export interface LevelData {
  level: number;
  name: string;
  description: string;
  stars: number;
  locked: boolean;
  color: string;
}

export const levels: LevelData[] = [
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