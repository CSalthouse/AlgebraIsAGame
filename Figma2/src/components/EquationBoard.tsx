import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DraggableBlock, BlockType } from './DraggableBlock';
import { Sparkles } from 'lucide-react';

interface EquationBlock {
  id: string;
  content: string;
  type: BlockType;
}

interface EquationBoardProps {
  leftSide: EquationBlock[];
  rightSide: EquationBlock[];
}

export function EquationBoard({ leftSide, rightSide }: EquationBoardProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
        <div className="px-8 py-4 border-b border-gray-200 bg-white/80 backdrop-blur">
          <div className="flex items-center justify-between">
            <h2 className="text-purple-600">🎯 Equation Board</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span>Drag blocks to manipulate the equation</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white/60 backdrop-blur rounded-3xl p-12 shadow-2xl border-4 border-white">
            <div className="flex items-center gap-6 justify-center">
              {/* Left side of equation */}
              <div className="flex items-center gap-3">
                {leftSide.map((block) => (
                  <DraggableBlock
                    key={block.id}
                    id={block.id}
                    content={block.content}
                    type={block.type}
                  />
                ))}
              </div>

              {/* Equals sign */}
              <DraggableBlock id="equals" content="=" type="equals" />

              {/* Right side of equation */}
              <div className="flex items-center gap-3">
                {rightSide.map((block) => (
                  <DraggableBlock
                    key={block.id}
                    id={block.id}
                    content={block.content}
                    type={block.type}
                  />
                ))}
              </div>
            </div>

            {/* Hint section */}
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                💡 <span className="italic">Try subtracting 3 from both sides</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons area */}
        <div className="px-8 py-6 bg-white/80 backdrop-blur border-t border-gray-200">
          <div className="flex items-center justify-center gap-4">
            <div className="px-4 py-2 bg-yellow-100 border-2 border-yellow-300 rounded-xl text-yellow-800">
              <span>✨ Drag blocks to solve for x!</span>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}