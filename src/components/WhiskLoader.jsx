import React from 'react';

const WhiskLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <div className="relative">
        <div className="text-6xl animate-whisk">
          🥣
        </div>
        <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
          ✨
        </div>
      </div>
      <p className="text-neon-lime font-mono text-lg animate-pulse">
        Transmuting ingredients...
      </p>
    </div>
  );
};

export default WhiskLoader;
