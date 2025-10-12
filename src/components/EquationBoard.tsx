import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DraggableBlock, type BlockType } from './DraggableBlock';
import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface EquationBlock {
  id: string;
  content: string;
  type: BlockType;
  hidden?: boolean;
}

interface EquationBoardProps {
  leftSide: EquationBlock[];
  rightSide: EquationBlock[];
}

export function EquationBoard({ leftSide, rightSide }: EquationBoardProps) {
  // Local state so the board can react to drag events and update blocks.
  // We initialize from props but own the state here so we can mutate
  // (hide/modify) blocks in response to interactions.
  const [leftBlocks, setLeftBlocks] = useState(leftSide);
  const [rightBlocks, setRightBlocks] = useState(rightSide);

  useEffect(() => {
    setLeftBlocks(leftSide);
  }, [leftSide]);

  useEffect(() => {
    setRightBlocks(rightSide);
  }, [rightSide]);

  // Keep a snapshot of the previous left blocks so we can restore them
  // if a drag is cancelled or ends without committing changes.
  const previousLeftSnapshot = useRef<EquationBlock[] | null>(null);

  // Handler invoked when a block drag begins. If block-3 begins drag,
  // snapshot the current left blocks, then update block-3's content to '+3'
  // and hide block-2 by filtering it out.
  // (previous handleDragBegin removed - restored to simpler behavior)

  // Restore left blocks from the snapshot when drag ends for block-3.
  function handleDragEnd(id: string) {
    if (id === 'block-3') {
      if (previousLeftSnapshot.current) {
        setLeftBlocks(previousLeftSnapshot.current);
        previousLeftSnapshot.current = null;
      }
    }
  }

  // Click handler to change block content when clicked.
  function handleBlockClick(id: string) {
    if (id === 'block-3') {
      setLeftBlocks((prev) => prev.map((b) => (b.id === 'block-3' ? { ...b, content: '+3' } : b)));
    }
  }

  // Pointer-down handler to change block content immediately when the
  // user presses down to start a drag (before the actual drag begins).
  function handleBlockPointerDown(id: string) {
    if (id === 'block-3') {
      // Snapshot now so we can restore on drag end
      previousLeftSnapshot.current = leftBlocks;
      // Delay the UI change to avoid re-registering the drag source
      setTimeout(() => {
        setLeftBlocks((prev) => prev.map((b) => (b.id === 'block-3' ? { ...b, content: '+3' } : b)));
      }, 0);
    }
  }

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
                {leftBlocks.map((block) => (
                  <DraggableBlock
                    key={block.id}
                    id={block.id}
                    content={block.content}
                    type={block.type}
                    onDragEnd={handleDragEnd}
                    hidden={block.hidden}
                    onClick={handleBlockClick}
                    onPointerDown={handleBlockPointerDown}
                  />
                ))}
              </div>

              {/* Equals sign */}
              <DraggableBlock id="equals" content="=" type="equals" />

              {/* Right side of equation */}
              <div className="flex items-center gap-3">
                {rightBlocks.map((block) => (
                  <DraggableBlock
                    key={block.id}
                    id={block.id}
                    content={block.content}
                    type={block.type}
                    onDragEnd={handleDragEnd}
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
        {/* debug panel removed during revert */}
      </div>
    </DndProvider>
  );
}
