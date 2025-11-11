import { useState, useCallback } from 'react';
import { Header } from '../components/Header';
import { StepsPane } from '../components/StepsPane';
import { EquationBoard } from '../components/EquationBoard';
import { Footer } from '../components/Footer';
import 'katex/dist/katex.min.css';

// Define the shape of a single step shown in the StepsPane.
interface Step {
  id: number;
  description: string;
  completed: boolean;
}

function parseEquation(equationStr: string) {
  console.log('Parsing equation:', equationStr);
  // Split equation into left and right sides
  const [leftStr, rightStr] = equationStr.split('=').map(s => s.trim());
  console.log('Left side:', leftStr, 'Right side:', rightStr);  

  // Split left side into terms
  const leftTerms = leftStr.split(/([+\-*\/])/).map(t => t.trim()).filter(t => t);
  const leftSide = leftTerms.map((term, index, terms) => {
    if (['+', '-', '*', '/'].includes(term)) {
      return {
        id: crypto.randomUUID(),
        content: term,
        type: 'operator' as const,
        leftSideBlock: true,
        dragAdd: false,
        dragMult: false
      };
    }
    // Check if term contains variable
    if (term.includes('x')) {
      return {
        id: crypto.randomUUID(),
        content: term,
        type: 'variable' as const,
        leftSideBlock: true,
        dragAdd: false,
        dragMult: false
      };
    }
    // For numbers, check the operator to its left
    const prevOperator = index > 0 ? terms[index - 1] : null;
    return {
      id: crypto.randomUUID(),
      content: term,
      type: 'number' as const,
      leftSideBlock: true,
      dragAdd: prevOperator ? ['+', '-'].includes(prevOperator) : true, // true by default if no operator
      dragMult: prevOperator ? ['*', '/'].includes(prevOperator) : false // false by default if no operator
    };
  });

  // Parse right side
  const rightTerms = rightStr.split(/([+\-*\/])/).map(t => t.trim()).filter(t => t);
  const rightSide = rightTerms.map((term, index, terms) => {
    if (['+', '-', '*', '/'].includes(term)) {
      return {
        id: crypto.randomUUID(),
        content: term,
        type: 'operator' as const,
        leftSideBlock: false,
        dragAdd: false,
        dragMult: false
      };
    }
    // For numbers, check the operator to its left
    const prevOperator = index > 0 ? terms[index - 1] : null;
    return {
      id: crypto.randomUUID(),
      content: term,
      type: 'number' as const,
      leftSideBlock: false,
      dragAdd: prevOperator ? ['+', '-'].includes(prevOperator) : true, // true by default if no operator
      dragMult: prevOperator ? ['*', '/'].includes(prevOperator) : false // false by default if no operator
    };
  });

  return { leftSide, rightSide };
}

export function EquationPage() {
  // Get equation from URL and handle URL encoding
  const searchParams = new URLSearchParams(window.location.search);
  const rawEquation = searchParams.get('equation');
  // Decode the equation parameter and replace encoded plus signs
  const equationParam = rawEquation 
    ? decodeURIComponent(rawEquation.replace(/\+/g, '%2B')) 
    : '2x + 3 = 5';

  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      description: `Starting equation: ${equationParam}`,
      completed: true,
    },
  ]);

  const addStep = useCallback((description: string) => {
    setSteps(prev => {
      const nextId = prev.length ? Math.max(...prev.map(s => s.id)) + 1 : 1;
      return [...prev, { id: nextId, description, completed: false }];
    });
  }, []);

  const toggleStepCompleted = useCallback((id: number) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  }, []);

  // Parse equation string into left and right sides
  const { leftSide, rightSide } = parseEquation(equationParam);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <main className="flex-1 container mx-auto p-4 flex gap-4">
        <div className="flex-1">
          <EquationBoard
            leftSide={leftSide}
            rightSide={rightSide}
            onAddStep={addStep}
            onToggleStepCompleted={toggleStepCompleted}
          />
        </div>
        <div className="w-80">
          <StepsPane 
            steps={steps} 
            onToggleCompleted={toggleStepCompleted}
          />
        </div>
      </main>
      <Footer 
        level={1}
        levelName="Basic Equations"
        progress={0.5}
      />
    </div>
  );
}