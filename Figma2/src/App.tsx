import { useState } from 'react';
import { Header } from './components/Header';
import { StepsPane } from './components/StepsPane';
import { EquationBoard } from './components/EquationBoard';
import { Footer } from './components/Footer';
import { LevelSelect } from './components/LevelSelect';
import { EquationSelect } from './components/EquationSelect';

interface Step {
  id: number;
  description: string;
  completed: boolean;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'levelSelect' | 'equationSelect' | 'game'>('levelSelect');
  const [selectedLevel, setSelectedLevel] = useState<number>(3);
  const [selectedEquation, setSelectedEquation] = useState<string>('2x + 3 = 5');
  
  const [steps] = useState<Step[]>([
    {
      id: 1,
      description: `Starting equation: ${selectedEquation}`,
      completed: true,
    },
  ]);

  const leftSide = [
    { id: 'block-1', content: '2x', type: 'variable' as const },
    { id: 'block-2', content: '+', type: 'operator' as const },
    { id: 'block-3', content: '3', type: 'number' as const },
  ];

  const rightSide = [
    { id: 'block-4', content: '5', type: 'number' as const },
  ];

  const handleSelectLevel = (level: number) => {
    setSelectedLevel(level);
    setCurrentScreen('equationSelect');
  };

  const handleSelectEquation = (equation: string) => {
    setSelectedEquation(equation);
    setCurrentScreen('game');
  };

  const handleBackToLevels = () => {
    setCurrentScreen('levelSelect');
  };

  const handleBackToEquations = () => {
    setCurrentScreen('equationSelect');
  };

  if (currentScreen === 'levelSelect') {
    return <LevelSelect onSelectLevel={handleSelectLevel} />;
  }

  if (currentScreen === 'equationSelect') {
    return (
      <EquationSelect
        level={selectedLevel}
        onSelectEquation={handleSelectEquation}
        onBack={handleBackToLevels}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      <Header onBackToLevels={handleBackToEquations} />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Equation Board (65%) */}
        <div className="w-[65%]">
          <EquationBoard leftSide={leftSide} rightSide={rightSide} />
        </div>
        
        {/* Right Panel - Steps Pane (35%) */}
        <div className="w-[35%]">
          <StepsPane steps={steps} />
        </div>
      </div>
      
      <Footer 
        level={selectedLevel} 
        levelName="Two-step equations" 
        progress={33} 
      />
    </div>
  );
}