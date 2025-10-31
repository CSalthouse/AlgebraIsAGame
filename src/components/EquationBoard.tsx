import { DndProvider, useDragLayer } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DraggableBlock, type BlockType } from './DraggableBlock';
import { useEffect, useState, useRef } from 'react';
import { Sparkles } from 'lucide-react';

interface EquationBlock {
  id: string;
  content: string;
  type: BlockType;
  hidden?: boolean;
  dimmed?: boolean;
  leftSide?: boolean;
  parenLevel?: number;
  dragAdd?: boolean;
  dragMult?: boolean;

}

interface EquationBoardProps {
  leftSide: EquationBlock[];
  rightSide: EquationBlock[];
  onAddStep?: (description: string) => void;           
  onToggleStepCompleted?: (id: number) => void; 
}

//defining DragItem here for use in DragLayer and InnerBoard
type DragItem = {
  id: string;
  content: string;
  type: BlockType;
  leftSide?: boolean;
  parenLevel?: number;
  dragAdd?: boolean;
  dragMult?: boolean;
};

//helper function for generating equation string
function getEquationString(leftBlocks: EquationBlock[], rightBlocks: EquationBlock[]): string {
  const left = leftBlocks.map(b => b.content).join(' ');
  const right = rightBlocks.map(b => b.content).join(' ');
  return `${left} = ${right}`;
}

export function EquationBoard({ leftSide, rightSide, onAddStep }: EquationBoardProps) {
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

  //code to record steps



  // Run whenever leftBlocks or rightBlocks change
  const firstRunRef = useRef(true);
  const prevRef = useRef<{leftJson: string; rightJson: string} | null>(null);

  useEffect(() => {
    const leftJson = JSON.stringify(leftBlocks);
    const rightJson = JSON.stringify(rightBlocks);

    if (firstRunRef.current) {
      firstRunRef.current = false; // skip first render if you want
    } else if (
      !prevRef.current ||
      prevRef.current.leftJson !== leftJson ||
      prevRef.current.rightJson !== rightJson
    ) {
      if (onAddStep) onAddStep(getEquationString(leftBlocks, rightBlocks));
    }

    prevRef.current = { leftJson, rightJson };
  }, [leftBlocks, rightBlocks]);

  // Handler invoked when drag begins
  function handleDragBegin(id: string) { }

  // Handler invoked when drag ends. Accepts optional clientOffset from drag monitor.
  function handleDragEnd(id: string, clientOffset?: { x: number; y: number } | null,
    leftSide?: boolean, parenLevel?: number, dragAdd?: boolean, dragMult?: boolean,) {
    if (!clientOffset) return;

    // Find equals center X
    const equalsEl = document.querySelector('[data-block-id="equals"]') as HTMLElement | null;
    let equalsCenterX = Infinity;
    if (equalsEl) {
      const rect = equalsEl.getBoundingClientRect();
      equalsCenterX = rect.left + rect.width / 2;
    }
    // If block was on left
    if (leftSide) {
      // If dropped to the right of equals, move the block from left to right
    //  if (clientOffset.x > equalsCenterX && id === 'block-3') {
        if (clientOffset.x > equalsCenterX ) {
             setLeftBlocks((prev) => prev.filter((b) => b.id !== id));
              setLeftBlocks((prev) => prev.filter((b) => b.id !== 'block-2'));
              setLeftBlocks((prev) => prev.filter((b) => b.id !== 'block-21'));


        if (dragAdd) {
        // append to right side
        setRightBlocks((prev) => [...prev, { id: 'block-2', content: '-', type: 'operator', leftSide: true }]);
        setRightBlocks((prev) => [...prev, { id, content: '3', type: 'number', leftSide: true }]);
      }
      if (dragMult) {
        // append to right side
        setRightBlocks((prev) => [ { id: 'block-2', content: '*', type: 'operator', leftSide: true },...prev]);
        setRightBlocks((prev) => [{ id, content: '1/2', type: 'number', leftSide: true },...prev]);
      }
    }
  }
    // If block was on right
    if (!leftSide) {
      // If dropped to the left of equals, move the block from right to left
      if (clientOffset.x < equalsCenterX && id === 'block-3') {
        setRightBlocks((prev) => prev.filter((b) => b.id !== id));
        setRightBlocks((prev) => prev.filter((b) => b.id !== 'block-2'));

        // append to right side
        setLeftBlocks((prev) => [...prev, { id: 'block-2', content: '-', type: 'operator', leftSide: false }]);
        setLeftBlocks((prev) => [...prev, { id, content: '3', type: 'number', leftSide: false }]);
      }
    }


  }

// EquationBoard.tsx
  function handleBlockClick(id: string, content: string)  {
  console.log(`Clicked block ${id} (${content})`);
  if (content === '-') {
    //first I am going to hard code the subtraction.  Then I will have to go back and compute 
    setRightBlocks((prev) => [{ id: 'block-5', content: '2', type: 'number', 
      leftSide: false, dragAdd: false, dragMult:false },]);
    setLeftBlocks((prev) => [{ id: 'block-11', content: '2', type: 'number', 
      leftSide: true, dragAdd: false, dragMult:true },
      { id: 'block-21', content: '*', type: 'operator', leftSide: true,
        dragAdd:false, dragMult:false       },
      { id: 'block-31', content: 'x', type: 'variable', leftSide: true,
        dragAdd:false, dragMult:false  },
      
    ]);

  }
  if (content === '*') {
    //first I am going to hard code the subtraction.  Then I will have to go back and compute 
    setRightBlocks((prev) => [{ id: 'block-31', content: '1', type: 'number', 
      leftSide: false, dragAdd: false, dragMult:false },]);
      

  }
};

  // Custom drag layer component to handle switching sides preview
  const DragLayer = () => {


    const blockColors: Record<BlockType, string> = {
      variable: 'bg-gradient-to-br from-purple-400 to-purple-600 text-white',
      number: 'bg-gradient-to-br from-orange-400 to-orange-600 text-white',
      operator: 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-gray-800',
      equals: 'bg-gradient-to-br from-teal-400 to-teal-600 text-white',
      parenthesis: 'bg-gradient-to-br from-teal-400 to-teal-600 text-white',
    };

    const { isDragging, currentOffset, item } = useDragLayer((monitor) => ({
      isDragging: monitor.isDragging(),
      currentOffset: monitor.getSourceClientOffset(),
      item: monitor.getItem<DragItem>(),
    }));

    if (!isDragging || !currentOffset || !(item?.dragMult  || item?.dragAdd)){
      return null;
    }

    // If we are here, it means that we are dragging a block that is dragMult or dragAdd

    // Find the equals element on the page and compute its center X
    const equalsEl = document.querySelector('[data-block-id="equals"]') as HTMLElement | null;
    let equalsCenterX = Infinity;
    if (equalsEl) {
      const rect = equalsEl.getBoundingClientRect();
      equalsCenterX = rect.left + rect.width / 2;
    }

    // Determine sign based on whether current drag X is to the right of equals center
    const draggedX = currentOffset.x;
    let previewText = 'ERROR';
    if (item.dragMult) {
      previewText = draggedX > equalsCenterX ? '1/2' : '2';
    } else if (item.dragAdd) {
      previewText = draggedX > equalsCenterX ? '-3' : '3';
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
          <span className="select-none">{previewText}</span>
        </div>
      </div>
    );
  };



  return (
    <DndProvider backend={HTML5Backend}>
      <DragLayer />
      <BoardInner
        leftBlocks={leftBlocks}
        rightBlocks={rightBlocks}
        handleDragBegin={handleDragBegin}
        handleDragEnd={handleDragEnd}
        handleBlockClick={handleBlockClick}
      />
    </DndProvider>
  );
}

function BoardInner({
  leftBlocks,
  rightBlocks,
  handleDragBegin,
  handleDragEnd,
  handleBlockClick,
}: {
  leftBlocks: EquationBlock[];
  rightBlocks: EquationBlock[];
  handleDragBegin: (id: string) => void;
  handleDragEnd: (id: string,
    clientOffset?: { x: number; y: number } | null,
    leftSide?: boolean,
    parenLevel?: number,
    dragAdd?: boolean,
    dragMult?: boolean,
  ) => void;
  handleBlockClick: (id: string, content: string) => void;
}) {
  const { isDragging: boardDragging, item } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
    item: monitor.getItem<DragItem>(),
  }));
  const isDraggingBlock3 = boardDragging && item?.id === 'block-3';


  return (
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
              {leftBlocks.map((block) => {
                const dimmed = isDraggingBlock3 && block.id === 'block-2';

                //&& isDragging && item.id === 'block-3';
                //   console.log

                return (
                  <div key={block.id} data-block-id={block.id}>
                    <DraggableBlock
                      id={block.id}
                      content={block.content}
                      type={block.type}
                      leftSide={true}
                      onDragEnd={handleDragEnd}
                      onDragBegin={handleDragBegin}
                      onClick={handleBlockClick}
                      hidden={block.hidden}
                      dimmed={dimmed}
                      dragAdd={block.dragAdd}
                      dragMult={block.dragMult}
                    />
                  </div>
                );
              })}
            </div>


            {/* Equals sign */}
            <DraggableBlock id="equals" content="=" type="equals" />

            {/* Right side of equation */}
            <div className="flex items-center gap-3">
              {rightBlocks.map((block) => {
                const dimmed = isDraggingBlock3 && block.id === 'block-2';
                return (
                  <DraggableBlock
                    key={block.id}
                    id={block.id}
                    content={block.content}
                    type={block.type}
                    leftSide={false}
                    onDragEnd={handleDragEnd}
                    onDragBegin={handleDragBegin}
                    onClick={handleBlockClick}
                    hidden={block.hidden}
                    dimmed={dimmed}
                  />
                );
              })}



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
  );
}
