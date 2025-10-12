import { useState } from 'react';
import { Header } from './components/Header';
import { StepsPane } from './components/StepsPane';
import { EquationBoard } from './components/EquationBoard';
import { Footer } from './components/Footer';

// Define the shape of a single step shown in the StepsPane.
// Keeping this lightweight helps TypeScript provide autocomplete and
// makes the component contract explicit.
interface Step {
  id: number; // unique identifier for the step
  description: string; // human-readable text describing the step
  completed: boolean; // whether the step has been completed by the student
}

export default function App() {
  // Local state: an array of Steps used by the StepsPane.
  // Only reading here — the app likely manages step updates elsewhere.
  const [steps] = useState<Step[]>([
    {
      id: 1,
      description: 'Starting equation: 2x + 3 = 5',
      completed: true,
    },
  ]);

  // These arrays represent the blocks shown on the EquationBoard.
  // Each block has a stable `id`, `content` string to display, and
  // a `type` literal used for rendering/styling/dragging logic.
  const leftSide = [
    { id: 'block-1', content: '2x', type: 'variable' as const },
    { id: 'block-2', content: '+', type: 'operator' as const },
    { id: 'block-3', content: '3', type: 'number' as const },
  ];

  const rightSide = [
    { id: 'block-4', content: '5', type: 'number' as const },
  ];

  // The app layout is a vertical column (header, body, footer).
  // The body is split horizontally: left side is the equation board
  // (65% width) and the right side is the steps pane (35% width).
  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Top navigation/header area */}
      <Header />

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Equation Board (65%) */}
        <div className="w-[65%]">
          {/* Pass the left and right side blocks to EquationBoard as props */}
          <EquationBoard leftSide={leftSide} rightSide={rightSide} />
        </div>

        {/* Right Panel - Steps Pane (35%) */}
        <div className="w-[35%]">
          {/* StepsPane receives the list of steps to display to the student */}
          <StepsPane steps={steps} />
        </div>
      </div>

      {/* Footer shows progress and metadata about the current level */}
      <Footer
        level={3}
        levelName="Two-step equations"
        progress={33}
      />
    </div>
  );
}