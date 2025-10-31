import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { InlineMath } from 'react-katex';

export type BlockType = 'variable' | 'number' | 'operator' | 'equals' | 'parenthesis';

interface DraggableBlockProps {
  id: string;
  content: string;
  type: BlockType;
  // Indicates this block should be treated as an additive value when dragged
  dragAdd?: boolean;
  // Indicates this block should be treated as a multiplicative value when dragged
  dragMult?: boolean;
  leftSide?: boolean;
  parenLevel?: number;
  // onDragEnd now receives the id and the client offset where it was dropped
  onDragEnd?: (
    id: string, 
    clientOffset?: { x: number; y: number } | null,
    leftSide?: boolean, 
    parenLevel?: number
    ) => void;
  onDragBegin?: (id: string) => void;
  hidden?: boolean;
  dimmed?: boolean;
  onClick?: (id: string, content: string) => void;
  onPointerDown?: (id: string) => void;

}

const blockColors: Record<BlockType, string> = {
  variable: 'bg-gradient-to-br from-purple-400 to-purple-600 text-white',
  number: 'bg-gradient-to-br from-orange-400 to-orange-600 text-white',
  operator: 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white',
  equals: 'bg-gradient-to-br from-teal-400 to-teal-600 text-white',
  parenthesis: 'bg-gradient-to-br from-green-400 to-green-600 text-white',
};

function renderMath(content: string) {
  // If your content is already LaTeX, just pass it through.
  // For plain fractions like "1/2" you can convert to LaTeX:
  const simpleFrac = content.match(/^\s*(-)?\s*([^/]+)\/([^/]+)\s*$/);
  if (simpleFrac) {
    const [, neg, num, den] = simpleFrac;
    return <InlineMath math={`${neg ? '-' : ''}\\frac{${num}}{${den}}`} />;
  }
  // Mixed number "2 1/2"
  const mixed = content.match(/^\s*(-)?\s*(\d+)\s+([^/]+)\/([^/]+)\s*$/);
  if (mixed) {
    const [, neg, whole, num, den] = mixed;
    return <InlineMath math={`${neg ? '-' : ''}${whole}\\tfrac{${num}}{${den}}`} />;
  }
  // Already LaTeX? e.g. \frac{x+1}{2}
  if (content.trim().startsWith('\\')) {
    return <InlineMath math={content} />;
  }
  // Fallback: plain text
  return content;
}

export function DraggableBlock({ 
  id,
  content,
  type, 
  // new optional flags for drag semantics
  dragAdd,
  dragMult,
  leftSide,
  parenLevel,
  onDragEnd, 
  onDragBegin, 
  hidden,
  dimmed, 
  onClick, 
  onPointerDown }: DraggableBlockProps) {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: 'EQUATION_BLOCK',
    item: () => {
      onDragBegin?.(id);
      return { id, content, type };
    },
    end: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      onDragEnd?.(item?.id ?? id, clientOffset ?? null, leftSide, parenLevel);
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    previewOptions: {
      captureDraggingState: true,
    },
  }));

  // Connect an empty preview so nothing shows except our custom drag layer
  useEffect(() => {
    dragPreview(getEmptyImage(), { captureDraggingState: true });
  }, [dragPreview]);

  // fallback: if `end` doesn't fire for whatever reason, detect drag state change
  // and notify parent to restore UI.
  const wasDragging = useRef(false);
  useEffect(() => {
    if (wasDragging.current && !isDragging) {
      onDragEnd?.(id);
    }
    wasDragging.current = isDragging;
  }, [isDragging, id, onDragEnd]);

  return (
    console.log(`Rendering DraggableBlock id=${id} content=${content} isDragging=${isDragging} dimmed=${dimmed}`),

    <motion.div
      // react-dnd's drag ref type is incompatible with React's Ref types
      // for some wrapped components (like framer-motion's motion.div).
      // Cast the ref to keep types happy without ref forwarding changes.
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`
        ${blockColors[type]}
        px-6 py-4 rounded-2xl shadow-lg cursor-move
        flex items-center justify-center
        border-4 border-white
        transition-all
        relative
        group
        ${isDragging ? 'opacity-30' : 'hover:ring-4 hover:ring-blue-300'}
        ${hidden ? 'invisible pointer-events-none' : ''}
        ${dimmed ? 'opacity-30' : ''}

      `}
      style={{ minWidth: '80px' }}
      onMouseDown={() => onPointerDown?.(id)}
      onTouchStart={() => onPointerDown?.(id)}
      onClick={() => onClick?.(id, content)}
      data-plus={id === 'block-3' && content === '+3'}
      data-block-id={id}
      data-drag-add={dragAdd ? 'true' : undefined}
      data-drag-mult={dragMult ? 'true' : undefined}
    >
      <span className="select-none">{content === '+3' ? '3' : renderMath(content)}</span>
      {id === 'block-3' && (
        <span className="select-none absolute left-2.5 top-1/2 -translate-y-1/2 transition-opacity bg-inherit rounded-full"
              style={{
                opacity: content === '+3' ? '1' : '0',
                transition: 'opacity 150ms ease-in-out'
              }}>
          +
        </span>
      )}
    </motion.div>
  );
}