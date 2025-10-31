// Minimal TypeScript declarations for react-katex used in this project
// This prevents TypeScript from complaining about missing types while
// keeping the API loose. If you need precise types later, replace
// these with full declarations or install @types/react-katex if available.
declare module 'react-katex' {
  import * as React from 'react';

  export interface InlineMathProps {
    math: string;
    className?: string;
  }

  export interface BlockMathProps {
    math: string;
    className?: string;
  }

  export const InlineMath: React.FC<InlineMathProps>;
  export const BlockMath: React.FC<BlockMathProps>;

  const _default: {
    InlineMath: typeof InlineMath;
    BlockMath: typeof BlockMath;
  };

  export default _default;
}
