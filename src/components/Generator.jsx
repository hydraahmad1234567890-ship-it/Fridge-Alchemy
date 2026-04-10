import React, { useState } from 'react';
import { Search, Sparkles, UtensilsCrossed, Dumbbell, Coffee, IceCream, Layers, BookOpen } from 'lucide-react';
import { fetchVarieties } from '../engine/recipeBuilder';

const Generator = ({ onGenerate, isLoading, setIsLoading }) => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('Dinner');
  const [servings, setServings] = useState(2);
  const [searchMode, setSearchMode] = useState('inventory'); // 'inventory' or 'dish'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setIsLoading(true);
    try {
      // Global Spoonacular Search (Multi-Recipe)
      const results = await fetchVarieties(input, searchMode, servings);
      
      if (results && results.length > 0) {
        onGenerate(results);
      } else {
        alert("The Alchemical archives found no matches for those ingredients. Try broader terms!");
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("Connectivity with the culinary cloud was lost. Check your connection!");
      setIsLoading(false);
    }
  };

  return (
    <div className="glass rounded-3xl p-6 md:p-10 neon-blue-glow w-full max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase">
          Fridge <span className="text-neon-lime">Alchemy</span>
        </h1>
        <p className="text-zinc-400 font-medium tracking-wide">Multi-Recipe Generation Powered by Spoonacular Cloud.</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 relative">
        <button 
          onClick={() => setSearchMode('inventory')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl z-10 transition-all ${searchMode === 'inventory' ? 'text-black font-bold' : 'text-zinc-500'}`}
        >
          <Layers className="w-4 h-4" />
          <span className="text-xs uppercase tracking-widest">Pantry varieties</span>
        </button>
        <button 
          onClick={() => setSearchMode('dish')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl z-10 transition-all ${searchMode === 'dish' ? 'text-black font-bold' : 'text-zinc-500'}`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-xs uppercase tracking-widest">Dish Search</span>
        </button>
        {/* Sliding Backdrop */}
        <div 
          className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r from-neon-lime to-green-400 rounded-xl transition-all duration-300 ease-out shadow-lg"
          style={{ left: searchMode === 'inventory' ? '4px' : 'calc(50% )' }}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold uppercase tracking-wider text-neon-orange ml-1">
            {searchMode === 'inventory' ? 'List Your Ingredients (comma separated)' : 'Enter Dish Name'}
          </label>
          <div className="relative group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={searchMode === 'inventory' ? "e.g. chicken, onion, garlic" : "e.g. Choco Lava Cake, Sushi, Burger"}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pt-4 min-h-[120px] focus:outline-none focus:border-neon-lime transition-all text-lg placeholder:text-zinc-600 group-hover:bg-white/10"
              required
            />
            <Search className="absolute bottom-4 right-4 text-zinc-400 w-6 h-6 border-l border-white/10 pl-4" />
          </div>
        </div>

        <div className="flex items-center justify-between glass-light p-4 rounded-2xl">
          <label className="text-sm font-bold uppercase tracking-wider text-zinc-400">
            Servings
          </label>
          <div className="flex items-center space-x-4">
            <button 
              type="button" 
              onClick={() => setServings(Math.max(1, servings - 1))}
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
            > - </button>
            <span className="text-xl font-black text-neon-lime w-4 text-center">{servings}</span>
            <button 
              type="button" 
              onClick={() => setServings(servings + 1)}
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
            > + </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-neon-orange to-red-600 hover:from-neon-lime hover:to-green-600 text-black font-bold py-4 rounded-2xl transition-all transform active:scale-95 flex items-center justify-center space-x-2 text-xl uppercase tracking-tighter disabled:opacity-50 shadow-xl shadow-orange-900/20"
        >
          {isLoading ? (
             <Sparkles className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <Sparkles className="w-6 h-6" />
              <span>{searchMode === 'inventory' ? 'Generate Alchemical Varieties' : 'Deconstruct Cloud Dish'}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Generator;
