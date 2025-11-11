import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { EquationPage } from './pages/EquationPage';
import { AboutPage } from './pages/AboutPage';
import {LevelSelect} from './pages/LevelSelectPage';
import { EquationSelect } from './pages/EquationSelect';


import 'katex/dist/katex.min.css';

export default function App() {
  const handleSelectLevel = (level: number) => {
    // Navigate to equation select page with the selected level
    window.location.href = `/equation-select?level=${level}`;
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link 
                  to="/" 
                  className="flex items-center px-2 py-2 text-gray-700 hover:text-gray-900"
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className="flex items-center px-2 py-2 text-gray-700 hover:text-gray-900"
                >
                  About
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<LevelSelect onSelectLevel={handleSelectLevel} />} />
          <Route path="/equation" element={<EquationPage />} /> 
          <Route 
            path="/equation-select" 
            element={
              <EquationSelect 
                level={Number(new URLSearchParams(window.location.search).get('level')) || 1}
                onSelectEquation={(equation) => {
                  // Navigate to the game page with the selected equation
                  const encodedEquation = encodeURIComponent(equation);
                  window.location.href = `/equation?equation=${encodedEquation}`;
                }}
                onBack={() => {
                  // Navigate back to level select
                  window.location.href = '/';
                }}
              />
            } 
          />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );


}