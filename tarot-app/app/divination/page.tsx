"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TarotDeck from "../../components/TarotDeck";
import { ArrowLeft, Sparkles, Loader2, Send, Wand2, Stars, MessageSquare, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../../contexts/LanguageContext";
import { getRandomCard, TarotCard } from "../../lib/tarot-logic";

interface TarotAnalysis {
  card: TarotCard;
  interpretation: string;
}

export default function DivinationPage() {
  const { t } = useLanguage();
  const [step, setStep] = useState<"input" | "draw" | "analyzing" | "result">("input");
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<TarotAnalysis | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [result]);

  const handleStartDraw = () => {
    if (!question.trim()) return;
    setStep("draw");
  };

  const handleCardDraw = async () => {
    const card = getRandomCard();
    setStep("analyzing");

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          cardName: card.name,
          cardMeaning: card.meaning,
          cardArchetype: card.archetype
        })
      });

      const data = await response.json();

      setResult({
        card,
        interpretation: data.interpretation || "The stars are silent momentarily."
      });
      setStep("result");

    } catch (error) {
      console.error("Divination failed:", error);
      setResult({
        card,
        interpretation: `(Connection lost) The card is ${card.name}. It signifies ${card.meaning}. Reflect on this archetype: ${card.archetype}.`
      });
      setStep("result");
    }
  };

  const resetReading = () => {
      setStep("input");
      setQuestion("");
      setResult(null);
  }

  return (
    <div className="min-h-screen pt-4 pb-24 px-4 w-full flex flex-col items-center">
      
      {/* Header / Nav Back */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-4 md:mb-8 py-2 md:py-4 relative z-20">
        <Link href="/dashboard" className="text-starlight-muted hover:text-cosmic-neon transition-colors flex items-center gap-2 text-sm group px-3 py-2 rounded-full hover:bg-white/5">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          <span className="hidden sm:inline">{t('divination.back')}</span>
        </Link>
        <div className="flex flex-col items-end">
             <div className="text-xs font-serif tracking-[0.2em] text-starlight-dim uppercase">Tarot Reading</div>
             <div className="text-[10px] text-cosmic-neon/60 tracking-widest uppercase">AI Oracle</div>
        </div>
      </div>

      {/* Main Container - Full height for mobile */}
      <div className="w-full max-w-2xl flex-1 flex flex-col relative h-[calc(100vh-140px)] md:h-auto md:min-h-[600px]">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: INPUT */}
          {step === "input" && (
            <motion.div 
              key="input"
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              className="glass-panel rounded-[2rem] p-6 md:p-12 flex flex-col items-center text-center shadow-[0_0_50px_rgba(0,0,0,0.3)] relative overflow-hidden flex-1 justify-center"
            >
              {/* Decorative Background */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/20 pointer-events-none"></div>
              
              <div className="relative z-10 w-16 h-16 md:w-20 md:h-20 rounded-full bg-space-800 border border-white/10 flex items-center justify-center mb-6 md:mb-8 shadow-[0_0_30px_rgba(157,78,221,0.2)] group shrink-0">
                <div className="absolute inset-0 bg-cosmic-neon/20 rounded-full blur-xl group-hover:bg-cosmic-neon/40 transition-all duration-1000"></div>
                <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-cosmic-neon relative z-10" />
              </div>
              
              <h2 className="relative z-10 text-3xl md:text-4xl font-serif text-starlight mb-2 md:mb-3 text-glow">{t('divination.ask')}</h2>
              <p className="relative z-10 text-starlight-muted text-xs md:text-sm mb-6 md:mb-10 max-w-xs mx-auto leading-relaxed">Focus your energy on a specific question.</p>
              
              <div className="w-full relative group z-10 flex-1 max-h-[150px] md:max-h-none">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cosmic-dark to-cosmic-light rounded-2xl opacity-40 blur group-hover:opacity-70 transition duration-500"></div>
                <textarea
                  className="relative w-full h-full p-4 md:p-6 rounded-2xl bg-space-950/90 border border-white/10 text-starlight placeholder:text-starlight-dim focus:outline-none focus:ring-0 resize-none shadow-inner text-base md:text-lg"
                  placeholder={t('divination.placeholder')}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>

              <button
                onClick={handleStartDraw}
                disabled={!question.trim()}
                className="relative z-10 mt-6 md:mt-10 w-full md:w-auto px-10 py-4 bg-gradient-to-r from-cosmic to-cosmic-dark text-white rounded-full font-bold tracking-widest uppercase text-xs hover:scale-105 transition-all shadow-[0_0_20px_rgba(157,78,221,0.4)] hover:shadow-[0_0_40px_rgba(157,78,221,0.6)] disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100 flex items-center justify-center gap-3"
              >
                {t('divination.consult')} <Wand2 className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: DRAW */}
          {step === "draw" && (
            <motion.div
              key="draw"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center justify-center flex-1 py-8"
            >
              <div className="text-center mb-6 md:mb-12 px-4">
                 <p className="text-[10px] font-bold tracking-[0.3em] text-cosmic-neon uppercase mb-2 opacity-80">Your Inquiry</p>
                 <h3 className="text-xl md:text-3xl font-serif text-starlight max-w-lg leading-tight line-clamp-3">"{question}"</h3>
              </div>
              
              <div className="relative w-full flex justify-center py-4 md:py-10 perspective-1000 flex-1 items-center">
                 {/* Glow effect behind cards */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 bg-cosmic-dark/20 blur-[80px] rounded-full pointer-events-none"></div>
                 <TarotDeck onDraw={handleCardDraw} />
              </div>
              
              <p className="text-xs md:text-sm text-starlight-muted mt-8 animate-pulse font-medium tracking-widest uppercase opacity-60 text-center">{t('divination.select')}</p>
            </motion.div>
          )}

          {/* STEP 3: ANALYZING */}
          {step === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center z-50 bg-space-950/80 backdrop-blur-sm rounded-[2rem]"
            >
              <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 bg-cosmic-neon blur-2xl opacity-20 animate-pulse-slow"></div>
                <div className="w-24 h-24 rounded-full border-t-2 border-l-2 border-cosmic-neon animate-spin"></div>
                <div className="w-16 h-16 rounded-full border-b-2 border-r-2 border-white/50 animate-spin-slow absolute"></div>
                <Stars className="w-8 h-8 text-white animate-pulse relative z-10" />
              </div>
              <p className="mt-8 text-starlight font-serif text-2xl animate-pulse text-glow">Whispering to the stars...</p>
            </motion.div>
          )}

          {/* STEP 4: RESULT (Chat Style) */}
          {step === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex-1 flex flex-col glass-panel-dark rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)]"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/5 bg-space-950/50 backdrop-blur-xl flex items-center justify-between shrink-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)] animate-pulse"></div>
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-starlight uppercase tracking-wider">Oracle AI</span>
                        <span className="block text-[10px] text-starlight-muted">Connected to Cosmos</span>
                    </div>
                </div>
                <button onClick={resetReading} className="p-2 hover:bg-white/5 rounded-full text-starlight-muted hover:text-white transition-colors">
                    <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Area - Fill remaining space */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar relative z-10 scroll-smooth">
                
                {/* User Message */}
                <div className="flex justify-end animate-slide-up">
                    <div className="max-w-[85%] bg-cosmic-dark/30 backdrop-blur-md p-3 md:p-4 rounded-2xl rounded-tr-sm border border-white/10 text-starlight text-sm leading-relaxed shadow-lg relative overflow-hidden">
                        {question}
                    </div>
                </div>

                {/* System Message - Card Reveal */}
                <div className="flex flex-col items-center py-4 animate-fade-in delay-300">
                    <motion.div 
                        initial={{ rotateY: 90, opacity: 0 }} 
                        animate={{ rotateY: 0, opacity: 1 }} 
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-40 md:w-48 aspect-[2/3] rounded-2xl bg-gradient-to-br from-space-800 to-black border border-white/20 shadow-[0_0_40px_rgba(157,78,221,0.3)] flex flex-col items-center justify-center relative overflow-hidden mb-3 group cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40"></div>
                        <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-cosmic-neon animate-pulse mb-3" />
                        <span className="font-serif text-white text-center px-4 font-bold text-lg md:text-xl text-glow leading-tight">{result.card.name}</span>
                        <div className="mt-2 w-6 h-[1px] bg-cosmic-neon/50"></div>
                    </motion.div>
                    <span className="text-[10px] md:text-xs text-starlight-muted uppercase tracking-widest bg-black/20 px-3 py-1 rounded-full border border-white/5">{result.card.meaning}</span>
                </div>

                {/* AI Response */}
                <div className="flex justify-start animate-fade-in delay-700 w-full pb-4">
                    <div className="flex gap-3 max-w-full">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cosmic to-blue-600 flex-shrink-0 flex items-center justify-center shadow-lg border border-white/20 relative self-start mt-1">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-space-800/80 backdrop-blur-xl p-4 md:p-6 rounded-2xl rounded-tl-sm border border-white/5 text-starlight text-sm md:text-base leading-relaxed shadow-xl relative overflow-hidden w-full">
                             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cosmic-neon to-transparent opacity-50"></div>
                             
                             {/* AI Text Content */}
                             <div className="prose prose-invert max-w-none">
                                <p className="mb-2 text-cosmic-neon text-[10px] font-bold uppercase tracking-wide flex items-center gap-2">
                                    Interpretation <Stars className="w-3 h-3" />
                                </p>
                                <div className="whitespace-pre-wrap text-gray-200 font-light tracking-wide">{result.interpretation}</div>
                             </div>
                        </div>
                    </div>
                </div>
              </div>

              {/* Input Area (Disabled / Action) */}
              <div className="p-4 border-t border-white/5 bg-space-950/50 backdrop-blur-md flex justify-center shrink-0 z-20">
                 <button
                    onClick={resetReading}
                    className="w-full text-xs text-starlight hover:text-white transition-all flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 uppercase tracking-widest font-medium group"
                  >
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Ask another question
                  </button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
