import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, ExternalLink, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

const SavedRecipes = ({ savedRecipes, onDelete }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-4">
      <div className="flex justify-between items-center bg-black/40 backdrop-blur-md p-6 rounded-3xl border border-white/10">
        <div>
          <h2 className="text-3xl font-black text-neon-orange uppercase tracking-tighter">Your Grimoire</h2>
          <p className="text-zinc-500">Stored alchemical successes</p>
        </div>
        <Link to="/" className="bg-white/10 hover:bg-neon-lime/20 px-6 py-2 rounded-full border border-white/10 font-bold transition-all">
          New Transmutation
        </Link>
      </div>

      {savedRecipes.length === 0 ? (
        <div className="text-center py-20 glass rounded-3xl">
          <p className="text-zinc-500 text-xl font-medium">Your grimoire is empty. Start transmuting!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedRecipes.map((recipe, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-3xl overflow-hidden border border-white/5 hover:border-neon-orange/30 transition-all group shadow-2xl"
            >
              <div className="h-48 relative overflow-hidden">
                <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <button 
                  onClick={() => onDelete(idx)}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500 rounded-full backdrop-blur-md transition-all z-10"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
                <div className="absolute bottom-4 left-6 right-6">
                   <h3 className="text-xl font-bold line-clamp-2 text-white italic tracking-tight uppercase leading-none">{recipe.title}</h3>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="glass-light px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-neon-lime uppercase">
                    {recipe.mode}
                  </span>
                  <span className="flex items-center space-x-1 text-xs text-orange-400 font-bold">
                    <Flame className="w-3 h-3" />
                    {recipe.nutrition} kcal
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em]">Core Elements</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(recipe.ingredients).slice(0, 4).map((ing, i) => (
                      <span key={i} className="text-[10px] bg-white/5 px-2 py-1 rounded-md text-zinc-300 font-bold capitalize border border-white/5">{ing}</span>
                    ))}
                    {Object.keys(recipe.ingredients).length > 4 && (
                      <span className="text-[10px] text-zinc-600 font-bold">+{Object.keys(recipe.ingredients).length - 4} OPTIONAL</span>
                    )}
                  </div>
                </div>

                <button 
                   className="w-full py-3 bg-white/5 border border-white/10 rounded-2xl font-black text-xs tracking-[0.3em] hover:bg-neon-lime hover:text-black transition-all group-hover:shadow-[0_0_30px_-10px_rgba(101,255,143,0.3)] uppercase"
                   onClick={() => alert(`Reviewing: ${recipe.title}\nCheck the main lab for details!`)}
                >
                  REBOOT ALCHEMY
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedRecipes;
