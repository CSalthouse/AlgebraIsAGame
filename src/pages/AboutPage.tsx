import { Link } from 'react-router-dom';

export function AboutPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">About Algebra Is A Game</h1>
      <div className="prose prose-lg">
        <p>
          Algebra Is A Game is an interactive learning tool that helps students understand
          algebraic concepts through hands-on manipulation of equations.
        </p>
        <p>
          By treating algebraic operations as game moves, students can develop an intuitive
          understanding of how equations work and how to solve them step by step.
        </p>
        </div>
        <div className="mt-8 not-prose">
          <Link 
            to="/" 
            className="bg-blue-500 hover:bg-blue-600 !text-white font-semibold py-2 px-4 rounded"
          >
            Back to Game
          </Link>
        </div>
      
    </div>
  );
}