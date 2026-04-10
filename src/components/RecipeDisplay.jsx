import React, { useState } from 'react';
import { Flame, Save, Globe, List, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RecipeDisplay = ({ recipes, onSave }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const active = recipes[selectedIdx];

  return (
    <div className="space-y-12">
      {/* Selection Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recipes.map((r, idx) => (
          <motion.div
            key={r.id || idx}
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              setSelectedIdx(idx);
              window.scrollTo({ top: 900, behavior: 'smooth' });
            }}
            className={`cursor-pointer glass rounded-2xl overflow-hidden border transition-all duration-500 ${
              selectedIdx === idx 
                ? 'border-neon-lime ring-2 ring-neon-lime/20 shadow-2xl shadow-green-900/20' 
                : 'border-white/10 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="h-40 relative group">
              <img src={r.image} alt={r.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
              <div className="absolute bottom-3 left-4">
                <span className="bg-neon-lime text-black text-[10px] font-black px-2 py-1 rounded-md uppercase">
                  Option {idx + 1}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <h3 className="text-sm font-black text-white line-clamp-2 uppercase tracking-tighter leading-tight">
                {r.title}
              </h3>
              <p className="text-[10px] text-zinc-400 font-medium">
                {Math.round(r.nutrition)} KCAL | {r.mode}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Alchemical Scroll (Detail View) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          className="glass rounded-[3rem] p-8 md:p-12 border border-white/10 shadow-3xl relative overflow-hidden"
        >
          {/* Subtle Background Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-neon-lime/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Left Column: Visuals & Stats */}
            <div className="w-full md:w-1/3 space-y-6">
              <div className="rounded-3xl overflow-hidden border-4 border-white/5 shadow-2xl transform -rotate-1">
                <img src={active.image} alt={active.title} className="w-full aspect-square object-cover" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-light p-4 rounded-2xl text-center">
                  <div className="text-neon-orange font-black text-2xl">{active.nutrition}</div>
                  <div className="text-[10px] uppercase font-bold text-zinc-500">Kcal / Serv</div>
                </div>
                <div className="glass-light p-4 rounded-2xl text-center">
                  <div className="text-neon-lime font-black text-2xl">{active.servings}</div>
                  <div className="text-[10px] uppercase font-bold text-zinc-500">Servings</div>
                </div>
              </div>

              <button
                onClick={() => onSave(active)}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all group"
              >
                <Save className="w-5 h-5 text-neon-orange group-hover:scale-125 transition-transform" />
                <span className="font-black uppercase tracking-widest text-sm">Save to Grimoire</span>
              </button>
            </div>

            {/* Right Column: Alchemy Data */}
            <div className="w-full md:w-2/3 space-y-10">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-neon-lime font-black tracking-[0.2em] text-xs uppercase">
                  <Flame className="w-4 h-4" />
                  <span>Verified Alchemy</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                  {active.title}
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed font-medium">
                  {active.summary}
                </p>
              </div>

              {/* Ingredients */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="h-px flex-1 bg-white/10" />
                  <div className="flex items-center space-x-2 text-zinc-500 uppercase text-[10px] font-black tracking-widest">
                    <List className="w-4 h-4" />
                    <span>Reagents Required</span>
                  </div>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(active.ingredients).map(([name, data], i) => (
                    <div key={i} className="flex items-center space-x-3 group">
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-neon-lime font-mono text-xs group-hover:border-neon-lime transition-colors">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <span className="text-white font-bold capitalize text-sm">{name}</span>
                        <div className="text-[10px] text-zinc-500 uppercase font-bold">
                          {data.quantity} {data.unit}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="h-px flex-1 bg-white/10" />
                  <div className="flex items-center space-x-2 text-zinc-500 uppercase text-[10px] font-black tracking-widest">
                    <History className="w-4 h-4" />
                    <span>Transmutation Steps</span>
                  </div>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <div className="space-y-4">
                  {active.steps.map((step, i) => (
                    <div key={i} className="flex space-x-4 group">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full border border-neon-orange flex items-center justify-center text-neon-orange font-black text-xs">
                        {i + 1}
                      </div>
                      <p className="text-zinc-300 text-md leading-snug font-medium pt-1 group-hover:text-white transition-colors">
                        {step.replace(/^Step \d+: /, '')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Source Link */}
              <div className="pt-8 border-t border-white/5">
                <a 
                  href={active.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
                >
                  <Globe className="w-4 h-4" />
                  <span>View Original Manuscript</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RecipeDisplay;
