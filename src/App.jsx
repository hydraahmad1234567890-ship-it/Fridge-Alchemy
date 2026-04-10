import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookMarked, FlaskConical, Home } from 'lucide-react';

import Generator from './components/Generator';
import RecipeDisplay from './components/RecipeDisplay';
import WhiskLoader from './components/WhiskLoader';
import SavedRecipes from './components/SavedRecipes';

const AppContent = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('fridgeAlchemy_recipes') || '[]');
    setSavedRecipes(stored);
  }, []);

  const handleGenerate = (newRecipes) => {
    setIsLoading(true);
    setRecipes([]);
    
    // Simulate aesthetic delay
    setTimeout(() => {
      setRecipes(newRecipes);
      setIsLoading(false);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }, 1500);
  };

  const handleSave = (recipeToSave) => {
    if (!recipeToSave) return;
    const newSaved = [recipeToSave, ...savedRecipes];
    setSavedRecipes(newSaved);
    localStorage.setItem('fridgeAlchemy_recipes', JSON.stringify(newSaved));
    alert('Recipe saved to your Grimoire!');
  };

  const handleDelete = (index) => {
    const newSaved = savedRecipes.filter((_, i) => i !== index);
    setSavedRecipes(newSaved);
    localStorage.setItem('fridgeAlchemy_recipes', JSON.stringify(newSaved));
  };

  return (
    <div className="min-h-screen bg-[url('/images/background.jpg')] bg-fixed bg-cover bg-center font-sans text-white relative">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-50 flex justify-center py-6">
        <div className="glass-light backdrop-blur-3xl px-6 py-3 rounded-full border border-white/10 flex items-center space-x-8 shadow-2xl">
          <Link to="/" className={`flex items-center space-x-2 transition-all ${location.pathname === '/' ? 'text-neon-orange font-bold' : 'text-zinc-400 hover:text-white'}`}>
            <FlaskConical className="w-5 h-5" />
            <span className="text-sm uppercase tracking-widest">Alchemy Lab</span>
          </Link>
          <Link to="/saved" className={`flex items-center space-x-2 transition-all ${location.pathname === '/saved' ? 'text-neon-orange font-bold' : 'text-zinc-400 hover:text-white'}`}>
            <BookMarked className="w-5 h-5" />
            <span className="text-sm uppercase tracking-widest">The Grimoire</span>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-4 py-8 pb-20">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-12"
              >
                <Generator onGenerate={handleGenerate} isLoading={isLoading} setIsLoading={setIsLoading} />
                
                {isLoading && <WhiskLoader />}
                
                {recipes.length > 0 && !isLoading && (
                  <RecipeDisplay recipes={recipes} onSave={handleSave} />
                )}
              </motion.div>
            } />
            
            <Route path="/saved" element={<SavedRecipes savedRecipes={savedRecipes} onDelete={handleDelete} />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-10 text-center space-y-4">
        <div className="flex justify-center space-x-4">
          <span className="text-zinc-500 hover:text-white cursor-pointer text-xs font-mono">GITHUB</span>
        </div>
        <p className="text-xs text-zinc-600 font-mono">
          &copy; 2026 FRIDGE ALCHEMY ENGINE | STABLE-PROCEDURAL-ALPHA
        </p>
      </footer>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
