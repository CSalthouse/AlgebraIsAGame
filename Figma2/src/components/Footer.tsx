import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { ChevronRight, Trophy } from 'lucide-react';

interface FooterProps {
  level: number;
  levelName: string;
  progress: number;
}

export function Footer({ level, levelName, progress }: FooterProps) {
  return (
    <footer className="bg-white border-t-2 border-gray-200 px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Progress section */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="text-gray-700">
                Level {level}: {levelName}
              </span>
            </div>
            <span className="text-sm text-gray-500">{progress}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Next button */}
        <Button
          size="lg"
          className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white shadow-lg"
        >
          Next Equation
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </footer>
  );
}