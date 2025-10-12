import { useDrag } from 'react-dnd';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

export type BlockType = 'variable' | 'number' | 'operator' | 'equals';

interface DraggableBlockProps {
  id: string;
  content: string;
  type: BlockType;
  onDragEnd?: (id: string) => void;
  hidden?: boolean;
  onClick?: (id: string) => void;
  onPointerDown?: (id: string) => void;
}

const blockColors: Record<BlockType, string> = {
  variable: 'bg-gradient-to-br from-purple-400 to-purple-600 text-white',
  number: 'bg-gradient-to-br from-orange-400 to-orange-600 text-white',
  operator: 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-gray-800',
  equals: 'bg-gradient-to-br from-teal-400 to-teal-600 text-white',
};

export function DraggableBlock({ id, content, type, onDragEnd, hidden, onClick, onPointerDown }: DraggableBlockProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'EQUATION_BLOCK',
    item: { id, content, type },
    end: (item) => {
      onDragEnd?.(item?.id ?? id);
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

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
        ${isDragging ? 'opacity-50 ring-4 ring-blue-400' : 'hover:ring-4 hover:ring-blue-300'}
        ${hidden ? 'invisible pointer-events-none' : ''}
      `}
      style={{ minWidth: '80px' }}
      onClick={() => onClick?.(id)}
      onPointerDown={() => onPointerDown?.(id)}
      onMouseDown={() => onPointerDown?.(id)}
      onTouchStart={() => onPointerDown?.(id)}
    >
      <span className="select-none">{content}</span>
    </motion.div>
  );
}