import { DndProvider, useDragLayer } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DraggableBlock, type BlockType } from './DraggableBlock';
import { useEffect, useState } from 'react';
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

  // Handler invoked when drag begins
  function handleDragBegin(id: string) {
    // Not needed anymore, useDragLayer handles overlay
  }

  // Handler invoked when drag ends
  function handleDragEnd(id: string) {
    // Not needed anymore, useDragLayer handles overlay
  }

  // Click and pointer handlers not needed anymore since we're only showing
  // the plus during drag
  function handleBlockClick(id: string) {}
  function handleBlockPointerDown(id: string) {}

  // Custom drag layer component to show the plus sign
  const DragLayer = () => {
    interface DragItem {
      id: string;
      content: string;
      type: BlockType;
    }

    const blockColors: Record<BlockType, string> = {
      variable: 'bg-gradient-to-br from-purple-400 to-purple-600 text-white',
      number: 'bg-gradient-to-br from-orange-400 to-orange-600 text-white',
      operator: 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-gray-800',
      equals: 'bg-gradient-to-br from-teal-400 to-teal-600 text-white',
    };

    const { isDragging, currentOffset, item } = useDragLayer((monitor) => ({
      isDragging: monitor.isDragging(),
      currentOffset: monitor.getSourceClientOffset(),
      item: monitor.getItem<DragItem>(),
    }));

    if (!isDragging || !currentOffset || item?.id !== 'block-3') {
      return null;
    }

    return (
      <div
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          left: currentOffset.x - 15,
          top: currentOffset.y - 15,
          zIndex: 1000,
        }}
      >
        <div className={`
          ${blockColors['number']}
          px-6 py-4 rounded-2xl shadow-lg
          flex items-center justify-center
          border-4 border-white
          transition-all
          opacity-80
        `}
        style={{ minWidth: '80px' }}
        >
          <span className="select-none">+3</span>
        </div>
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
        <DragLayer />
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
                  <div key={block.id} data-block-id={block.id}>
                    <DraggableBlock
                      id={block.id}
                      content={block.content}
                      type={block.type}
                      onDragEnd={handleDragEnd}
                      onDragBegin={handleDragBegin}
                      hidden={block.hidden}
                      onClick={handleBlockClick}
                      onPointerDown={handleBlockPointerDown}
                    />
                  </div>
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
