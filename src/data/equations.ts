export interface EquationData {
  id: number;
  equation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  stars: number;
}

interface LevelEquations {
  [level: number]: EquationData[];
}

export const equations: LevelEquations = {
  1: [
    { id: 1, equation: 'x = 7 + 3', difficulty: 'easy', completed: true, stars: 3 },
    { id: 2, equation: 'x = 8 + 2', difficulty: 'easy', completed: true, stars: 3 },
    { id: 3, equation: 'x = 2 - 4', difficulty: 'easy', completed: true, stars: 2 },
    { id: 4, equation: 'x = 12 + 15', difficulty: 'easy', completed: false, stars: 0 },
    { id: 5, equation: 'x = 34 - 9', difficulty: 'easy', completed: false, stars: 0 },
  ],
  2: [
    { id: 1, equation: 'x + 2 = 3', difficulty: 'medium', completed: false, stars: 0 },
    { id: 2, equation: 'x - 1 = 11', difficulty: 'medium', completed: false, stars: 0 },
    { id: 3, equation: 'x + 5 = 13', difficulty: 'medium', completed: false, stars: 0 },
    { id: 4, equation: 'x - 3 = 15', difficulty: 'medium', completed: false, stars: 0 },
    { id: 5, equation: 'x + 7 = 22', difficulty: 'medium', completed: false, stars: 0 },
  ],
  3: [
    { id: 1, equation: '4x = 16', difficulty: 'medium', completed: false, stars: 0 },
    { id: 2, equation: '2x = 8', difficulty: 'medium', completed: false, stars: 0 },
    { id: 3, equation: '3x = 9', difficulty: 'medium', completed: false, stars: 0 },
    { id: 4, equation: '3x = 20', difficulty: 'medium', completed: false, stars: 0 },
    { id: 5, equation: '2x = 14', difficulty: 'medium', completed: false, stars: 0 },
  ],
  4: [
    { id: 1, equation: '7x - 2 = 19', difficulty: 'hard', completed: false, stars: 0 },
    { id: 2, equation: '6x - 5 = 13', difficulty: 'hard', completed: false, stars: 0 },
    { id: 3, equation: '8x - 3 = 29', difficulty: 'hard', completed: false, stars: 0 },
    { id: 4, equation: '4x + 6 = 22', difficulty: 'hard', completed: false, stars: 0 },
    { id: 5, equation: '9x - 7 = 20', difficulty: 'hard', completed: false, stars: 0 },
  ]
};