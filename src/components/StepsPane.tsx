import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';
import { CheckCircle2 } from 'lucide-react';

interface Step {
  id: number;
  description: string;
  completed: boolean;
}

interface StepsPaneProps {
  steps: Step[];
  onToggleCompleted?: (id: number) => void;
}

export function StepsPane({ steps, onToggleCompleted }: StepsPaneProps) {
  console.log(onToggleCompleted);
  return (
    <div className="h-full bg-gray-50 border-l border-gray-200 flex flex-col">
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <h2 className="text-teal-600">📝 Your Steps</h2>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {steps.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No steps yet!</p>
              <p className="text-sm mt-2">Start solving to see your progress here</p>
            </div>
          ) : (
            steps.map((step) => (
              <Card
                key={step.id}
                className={`p-4 border-2 transition-all ${
                  step.completed
                    ? 'border-teal-400 bg-teal-50'
                    : 'border-purple-300 bg-purple-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {step.completed && (
                    <CheckCircle2 className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-gray-700 flex-1">{step.description}</p>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}