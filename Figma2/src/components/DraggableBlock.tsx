import { useDrag } from 'react-dnd';
import { motion } from 'motion/react';

export type BlockType = 'variable' | 'number' | 'operator' | 'equals';

interface DraggableBlockProps {
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

export function DraggableBlock({ id, content, type }: DraggableBlockProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'EQUATION_BLOCK',
    item: { id, content, type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <motion.div
      ref={drag}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`
        ${blockColors[type]}
        px-6 py-4 rounded-2xl shadow-lg cursor-move
        flex items-center justify-center
        border-4 border-white
        transition-all
        ${isDragging ? 'opacity-50 ring-4 ring-blue-400' : 'hover:ring-4 hover:ring-blue-300'}
      `}
      style={{ minWidth: '80px' }}
    >
      <span className="select-none">{content}</span>
    </motion.div>
  );
}