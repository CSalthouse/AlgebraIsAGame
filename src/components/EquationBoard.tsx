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
  leftSideBlock?: boolean;
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
  leftSideBlock?: boolean;
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
  const prevRef = useRef<{ leftJson: string; rightJson: string } | null>(null);

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

  function findOperator(prev: EquationBlock[], id: string): string | null {
    // Find the index of the block with the given id
    const index = prev.findIndex(block => block.id === id);

    // If not found or if it’s the last item, return null
    if (index === -1) {
      return null;
    }

    var operatorBlock = null;

    if (index === 0) {
      operatorBlock = prev[index + 1];
    } else {
      operatorBlock = prev[index - 1];
    }
    // Return its id (could check type === 'operator' if you only want operators)
    console.log(`findOperator: for id=${id}, found operator id=${operatorBlock?.id}`);
    return operatorBlock?.id ?? null;
  }

  function findNextOperator(prev: EquationBlock[], id: string): string | null {
    // Find the index of the block with the given id
    const index = prev.findIndex(block => block.id === id);

    // If not found or if it’s the last item, return null
    if (index === -1 || index === prev.length - 1) {
      return null;
    }

    // Get the next block
    const nextBlock = prev[index + 1];

    // Return its id (could check type === 'operator' if you only want operators)
    console.log(`findOperator: for id=${id}, found operator id=${nextBlock?.id}`);
    return nextBlock?.id ?? null;
  }


  // Handler invoked when drag ends. Accepts optional clientOffset from drag monitor.
  function handleDragEnd(id: string, content?: string, 
    clientOffset?: { x: number; y: number } | null,
    leftSideBlock?: boolean, parenLevel?: number, dragAdd?: boolean, 
    dragMult?: boolean,) {
    console.log(`handleDragEnd id=${id} clientOffset=${clientOffset ? `(${clientOffset.x}, ${clientOffset.y})` : 'null'}`);

    if (!clientOffset) return;
    if (content === undefined) content = '';

    // Find equals center X
    const equalsEl = document.querySelector('[data-block-id="equals"]') as HTMLElement | null;
    let equalsCenterX = Infinity;
    if (equalsEl) {
      const rect = equalsEl.getBoundingClientRect();
      equalsCenterX = rect.left + rect.width / 2;
    }
    console.log(`Equals center X: ${equalsCenterX}`);
    // If block was on left
    if (leftSideBlock) {
      // If dropped to the right of equals, move the block from left to right
      //  if (clientOffset.x > equalsCenterX && id === 'block-3') {
      if (clientOffset.x > equalsCenterX) {
        //identify operator block to be deleted
        setLeftBlocks((prev) => prev.filter((b) => b.id !== findOperator(prev, id)));
        setLeftBlocks((prev) => prev.filter((b) => b.id !== id));


        if (dragAdd) {
          // append to right side
          setRightBlocks((prev) => [...prev, { id: 'block-2', content: '-', 
            type: 'operator', leftSideBlock: true }]);
          setRightBlocks((prev) => [...prev, { id, content: content,
             type: 'number', leftSideBlock: true }]);
          console.log('Added subtraction blocks to right side');
        }
        if (dragMult) {
          // append to right side
          setRightBlocks((prev) => [{ id: 'block-2', content: '*', type: 'operator', leftSideBlock: true }, ...prev]);
          setRightBlocks((prev) => [{ id, content: '1/'+content, type: 'number', leftSideBlock: true }, ...prev]);
        }
      }
    }
    // If block was on right
    if (!leftSideBlock) {
      // If dropped to the left of equals, move the block from right to left
      if (clientOffset.x < equalsCenterX && id === 'block-3') {
        setRightBlocks((prev) => prev.filter((b) => b.id !== id));
        setRightBlocks((prev) => prev.filter((b) => b.id !== 'block-2'));

        // append to right side
        setLeftBlocks((prev) => [...prev, { id: 'block-2', content: '-', type: 'operator', leftSideBlock: false }]);
        setLeftBlocks((prev) => [...prev, { id, content: '3', type: 'number', leftSideBlock: false }]);
      }
    }


  }

function parseFraction(str: string): { numerator: number; denominator: number } {
  const parts = str.split('/').map(s => s.trim());
  const numerator = Number(parts[0]);
  const denominator = parts.length > 1 ? Number(parts[1]) : 1;
  return { numerator, denominator };
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

  function processOperator(prev: EquationBlock[], id: string, content: string): EquationBlock[] {
    const index = prev.findIndex(b => b.id === id);
    console.log(`processOperator: operator id=${id} at index=${index}`);
    if (index <= 0 || index >= prev.length - 1) {
     console.log(`Operator at index ${index} cannot be processed. index = {index }`);
      return prev;
    }
    const left = prev[index - 1];
    const op = prev[index];      // operator at index
    const right = prev[index + 1];
console.log(`Computed value for ${left.content} ${op.content} ${right.content}`);  

    // convert strings to numbers safely
    const leftNum = Number(left.content);
    const rightNum = Number(right.content);

    let value = String(leftNum);
    if (op.content === '+') value = String(leftNum + rightNum);
    if (op.content === '-') value = String(leftNum - rightNum);
    if (op.content === '*') {
      console.log('Processing multiplication');
      const leftFraction = parseFraction(left.content);
      const rightFraction = parseFraction(right.content);
      const leftNumerator = leftFraction.numerator;
      const leftDenominator = leftFraction.denominator;
      const rightNumerator = rightFraction.numerator;
      const rightDenominator = rightFraction.denominator;
      console.log('Processing multiplication values');
      console.log(`Computed value for ${leftNumerator} * ${rightNumerator} /  ${leftDenominator} *  ${rightDenominator}`);  

      const valNumerator=leftNumerator*rightNumerator;
      const valDenominator=leftDenominator*rightDenominator;
      const commonDivisor = gcd(valNumerator, valDenominator);
      if (valDenominator/commonDivisor) {
        value= String(valNumerator/commonDivisor);
      } else {
        value = valNumerator/commonDivisor + '/' + valDenominator/commonDivisor;
      }
      console.log(`Computed value for ${leftNumerator} * ${rightNumerator} /  ${leftDenominator} *  ${rightDenominator}`);  

    }
    if (op.content === '/') value = String(leftNum / rightNum);
console.log(`Computed value for ${left.content} ${op.content} ${right.content} = ${value}`);  
    const combined: EquationBlock = {
      id: crypto.randomUUID(),
      content: String(value),
      type: 'number',
      leftSideBlock: left.leftSideBlock,
      dragAdd: false,
      dragMult: false,
    };

    // return a NEW array (no mutation)
    console.log(`Combining blocks at index ${index-1}, ${index}, ${index+1} into new block with id=${combined.id} and content=${combined.content}`);
    return [
      ...prev.slice(0, index - 1), // everything before left
      combined,                    // the new combined number
      ...prev.slice(index + 2),    // everything after right
    ];
  }

  function expandVariableProduct(prev: EquationBlock[], leftSideBlock: boolean): EquationBlock[] {
    if (prev.length < 2) {
      const match = prev[0].content.match(/^(\d+)(.*)$/);

      if (match) {
        const numberPart = match[1];  // "34"
        const rest = match[2];        // "x"

        if (rest === '') {
          return prev;
        }
        else {

          const newPrev: EquationBlock[] = [{
            id: crypto.randomUUID(),
            content: String(numberPart),
            type: 'number',
            leftSideBlock: leftSideBlock,
            dragAdd: false,
            dragMult: true,
          }, {
            id: crypto.randomUUID(),
            content: '*',
            type: 'operator',
            leftSideBlock: leftSideBlock,
            dragAdd: false,
            dragMult: true,
          }, {
            id: crypto.randomUUID(),
            content: String(rest),
            type: 'variable',
            leftSideBlock: leftSideBlock,
            dragAdd: false,
            dragMult: true,
          }];

          // return a NEW array (no mutation)
          return newPrev;
        }
      }
      else {
        return prev;
      }



    } else {
      return prev;
    }

  }


  // EquationBoard.tsx
  function handleBlockClick(id: string, content: string, leftSideBlock: boolean) {
    console.log(`Clicked block ${id} (${content})`);
    if (leftSideBlock) {
      console.log('processing operator on left side')
      setLeftBlocks((prev) => processOperator(prev, id, content));
      setLeftBlocks((prev) => expandVariableProduct(prev, leftSideBlock));
      setRightBlocks((prev) => expandVariableProduct(prev, leftSideBlock));

    } else {
      //the operator is on the right side.
      console.log('Processing operator on right side')
      setRightBlocks((prev) => processOperator(prev, id, content));
      setRightBlocks((prev) => expandVariableProduct(prev, leftSideBlock));
      setLeftBlocks((prev) => expandVariableProduct(prev, leftSideBlock));

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

    if (!isDragging || !currentOffset || !(item?.dragMult || item?.dragAdd)) {
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
      previewText = draggedX < equalsCenterX ? item.content : '1/' + item.content;
    } else if (item.dragAdd) {
      previewText = draggedX < equalsCenterX ? item.content : '-' + item.content;
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
  handleDragEnd: (id: string, content: string,
    clientOffset?: { x: number; y: number } | null,
    leftSideBlock?: boolean,
    parenLevel?: number,
    dragAdd?: boolean,
    dragMult?: boolean,
  ) => void;
  handleBlockClick: (id: string, content: string, leftSideBlock: boolean) => void;
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
                      leftSideBlock={true}
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
                    leftSideBlock={false}
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
