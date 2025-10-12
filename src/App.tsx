import { useState } from 'react';
import { Header } from './components/Header';
import { StepsPane } from './components/StepsPane';
import { EquationBoard } from './components/EquationBoard';
import { Footer } from './components/Footer';

interface Step {
  id: number;
  description: string;
  completed: boolean;
}

export default function App() {
  const [steps] = useState<Step[]>([
    {
      id: 1,
      description: 'Starting equation: 2x + 3 = 5',
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

  return (
    <div className="h-screen flex flex-col bg-white">
      <Header />
      
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
        level={3} 
        levelName="Two-step equations" 
        progress={33} 
      /> 

      
    </div>
  );
}