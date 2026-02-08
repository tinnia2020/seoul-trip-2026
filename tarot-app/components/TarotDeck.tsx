"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const TarotDeck = ({ onDraw }: { onDraw: () => void }) => {
  const [dealt, setDealt] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  // Simulate dealing animation
  const dealCards = () => {
    setDealt(true);
  };

  const handleCardClick = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    setTimeout(() => {
        onDraw();
    }, 800);
  };

  return (
    <div className="w-full h-80 relative flex items-center justify-center">
      {!dealt ? (
        <button
          onClick={dealCards}
          className="relative px-10 py-4 bg-space-950 text-starlight rounded-full border border-cosmic-neon/30 hover:bg-space-900 hover:border-cosmic-neon transition-all shadow-[0_0_20px_rgba(157,78,221,0.2)] hover:shadow-[0_0_35px_rgba(157,78,221,0.5)] font-bold tracking-widest uppercase text-xs overflow-hidden group"
        >
          <span className="relative z-10 group-hover:text-white transition-colors">Shuffle the Cosmos</span>
          <div className="absolute inset-0 bg-gradient-to-r from-cosmic-dark to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </button>
      ) : (
        <div className="relative w-full h-full flex justify-center items-center perspective-1000">
          {Array.from({ length: 5 }).map((_, i) => {
             // Calculate fanned position
             const rotation = (i - 2) * 8;
             const xOffset = (i - 2) * 50;
             const yOffset = Math.abs(i - 2) * 15;
             
             return (
                <motion.div
                key={i}
                initial={{ x: 0, y: 100, rotate: 0, scale: 0.5, opacity: 0 }}
                animate={{ 
                    x: xOffset, 
                    y: yOffset, 
                    rotate: rotation,
                    scale: 1,
                    opacity: 1
                }}
                transition={{ 
                    delay: i * 0.1, 
                    type: "spring", 
                    stiffness: 150, 
                    damping: 15 
                }}
                whileHover={{ 
                    y: -40, 
                    scale: 1.15, 
                    rotate: 0,
                    zIndex: 50, 
                    transition: { duration: 0.2 } 
                }}
                onClick={() => handleCardClick(i)}
                className={`absolute w-32 h-52 rounded-2xl cursor-pointer shadow-2xl border border-white/10 overflow-hidden transform-style-3d
                    ${selected === i ? "ring-2 ring-cosmic-neon shadow-[0_0_50px_rgba(157,78,221,0.8)] z-50 scale-125 -translate-y-10" : ""}
                    ${selected !== null && selected !== i ? "opacity-10 blur-sm scale-90 grayscale" : "hover:shadow-[0_0_30px_rgba(157,78,221,0.4)] hover:border-white/30"}
                `}
                style={{
                    // Cosmic Card Back Gradient
                    background: "radial-gradient(circle at 50% 50%, #2E003E 0%, #0B0B15 100%)",
                }}
                >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none transform translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000"></div>

                    {/* Geometric Mystic Pattern */}
                    <div className="absolute inset-2 border border-white/10 rounded-xl flex flex-col items-center justify-center opacity-60">
                         {/* Simple geometric mandala via CSS */}
                        <div className="w-16 h-16 border border-cosmic-light/20 rotate-45 flex items-center justify-center relative">
                            <div className="absolute inset-0 border border-cosmic-light/20 rotate-45"></div>
                            <div className="w-8 h-8 bg-cosmic-dark/40 rotate-45 flex items-center justify-center shadow-[0_0_15px_rgba(157,78,221,0.4)]">
                                <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_5px_white]"></div>
                            </div>
                        </div>
                        <div className="absolute bottom-4">
                             <div className="w-1 h-8 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                        </div>
                        <div className="absolute top-4">
                             <div className="w-1 h-8 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                        </div>
                    </div>
                    
                    {/* Star Dust Texture */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-screen"></div>

                </motion.div>
             );
          })}
        </div>
      )}
    </div>
  );
};

export default TarotDeck;
