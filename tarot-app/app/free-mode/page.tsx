"use client";
import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function FreeModePage() {
  const { t } = useLanguage();
  const [step, setStep] = useState<'question' | 'spread' | 'draw' | 'result'>('question');
  const [question, setQuestion] = useState('');
  const [spread, setSpread] = useState('one');
  const [cards, setCards] = useState<string[]>([]);

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) setStep('spread');
  };

  const handleSpreadSelect = (s: string) => {
    setSpread(s);
    setStep('draw');
  };

  useEffect(() => {
    if (step === 'draw') {
        const deck = ['The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor', 'The World', 'The Star', 'The Moon', 'The Sun', 'Death', 'The Tower', 'Strength', 'The Lovers', 'Justice', 'The Hermit', 'Wheel of Fortune', 'The Hanged Man', 'Temperance', 'The Devil', 'Judgement'];
        let count = 1;
        if (spread === 'time') count = 3;
        if (spread === 'celtic') count = 10;
        
        const drawn = [];
        const tempDeck = [...deck];
        for(let i=0; i<count; i++) {
            if (tempDeck.length === 0) break;
            const rand = Math.floor(Math.random() * tempDeck.length);
            drawn.push(tempDeck[rand]);
            tempDeck.splice(rand, 1);
        }
        
        setTimeout(() => {
            setCards(drawn);
            setStep('result');
        }, 2000);
    }
  }, [step, spread]);

  return (
    <div className="max-w-6xl mx-auto min-h-screen pt-4 md:pt-20 pb-24 px-4 flex flex-col items-center">
      
      {/* Header / Back */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-6 md:mb-8 py-4">
        <Link href="/dashboard" className="text-starlight-muted hover:text-cosmic-neon transition-colors flex items-center gap-2 text-sm group px-3 py-2 rounded-full hover:bg-white/5">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {t('divination.back')}
        </Link>
        <div className="text-[10px] md:text-xs font-serif tracking-[0.2em] text-starlight-dim uppercase">Free Mode</div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-4xl flex-1 flex flex-col justify-center">
        {/* Step 1: Question */}
        {step === 'question' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel rounded-[2rem] p-6 md:p-12 text-center max-w-lg mx-auto shadow-[0_0_50px_rgba(157,78,221,0.1)] w-full">
            <h1 className="text-2xl md:text-3xl font-serif text-starlight mb-4 md:mb-6">{t('free.question')}</h1>
            <form onSubmit={handleQuestionSubmit} className="space-y-6">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cosmic-dark to-cosmic-light rounded-xl opacity-30 group-hover:opacity-60 blur transition duration-500"></div>
                    <textarea 
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="relative w-full h-32 md:h-40 p-4 md:p-6 rounded-xl bg-space-950/90 border border-white/10 focus:border-cosmic-neon/50 outline-none resize-none text-starlight placeholder:text-starlight-dim shadow-inner text-base md:text-lg"
                        placeholder={t('free.question')}
                    />
                </div>
                <button 
                    type="submit"
                    disabled={!question.trim()}
                    className="w-full py-4 px-6 bg-cosmic hover:bg-cosmic-light text-white rounded-full font-medium shadow-[0_0_20px_rgba(157,78,221,0.4)] hover:shadow-[0_0_30px_rgba(157,78,221,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-wide text-sm md:text-base"
                >
                    Continue
                </button>
            </form>
            </motion.div>
        )}

        {/* Step 2: Spread Selection */}
        {step === 'spread' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full text-center pb-20 md:pb-0">
                <h1 className="text-2xl md:text-3xl font-serif text-starlight mb-6 md:mb-8">{t('free.spread')}</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {[
                        { id: 'one', label: t('free.spread.one'), icon: '🎴', desc: "Single Card Insight" },
                        { id: 'time', label: t('free.spread.time'), icon: '🕰️', desc: "Past, Present, Future" },
                        { id: 'celtic', label: t('free.spread.celtic'), icon: '✝️', desc: "Deep Analysis" },
                    ].map((s) => (
                        <button
                            key={s.id}
                            onClick={() => handleSpreadSelect(s.id)}
                            className="glass-panel p-6 md:p-8 rounded-3xl hover:bg-space-800/50 hover:-translate-y-2 transition-all duration-300 group flex flex-row md:flex-col items-center justify-start md:justify-center relative overflow-hidden gap-6 md:gap-0"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="text-4xl md:text-5xl md:mb-4 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] shrink-0">{s.icon}</span>
                            <div className="text-left md:text-center">
                                <span className="font-serif text-lg md:text-xl text-starlight mb-1 block">{s.label}</span>
                                <span className="text-xs text-starlight-muted uppercase tracking-wider block">{s.desc}</span>
                            </div>
                        </button>
                    ))}
                </div>
                <button onClick={() => setStep('question')} className="mt-8 text-starlight-muted hover:text-white transition-colors text-sm underline underline-offset-4">Change Question</button>
            </motion.div>
        )}

        {/* Step 3: Draw (Animation) */}
        {step === 'draw' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="relative w-32 h-48 md:w-40 md:h-60">
                    <div className="absolute inset-0 bg-cosmic-neon blur-[60px] opacity-40 animate-pulse"></div>
                    <div className="w-full h-full bg-gradient-to-br from-space-800 to-black rounded-xl border border-white/20 flex items-center justify-center relative z-10 animate-float">
                         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
                         <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-cosmic-neon animate-spin-slow" />
                    </div>
                </div>
                <p className="mt-8 text-starlight font-serif text-lg md:text-xl animate-pulse tracking-widest uppercase">The stars are aligning...</p>
            </motion.div>
        )}

        {/* Step 4: Result */}
        {step === 'result' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full pb-20 md:pb-0">
                <div className="text-center mb-8 md:mb-10">
                    <h1 className="text-2xl md:text-3xl font-serif text-starlight mb-2">{t('result.title')}</h1>
                    <p className="text-starlight-muted text-xs md:text-sm italic px-4 line-clamp-2">"{question}"</p>
                </div>
                
                <div className={`grid gap-4 md:gap-6 ${spread === 'one' ? 'grid-cols-1 max-w-xs mx-auto' : spread === 'time' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5'}`}>
                    {cards.map((card, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-panel p-4 md:p-6 rounded-2xl text-center group hover:bg-space-800/50 transition-all duration-300 relative overflow-hidden flex flex-row md:flex-col items-center md:items-center gap-4 md:gap-0"
                        >
                            <div className="w-16 md:w-full aspect-[2/3] bg-gradient-to-br from-space-800 to-black rounded-lg md:mb-4 flex items-center justify-center shadow-inner border border-white/5 group-hover:border-cosmic-neon/30 transition-colors relative shrink-0">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                                <span className="text-xl md:text-3xl filter drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">🎴</span>
                            </div>
                            <div className="text-left md:text-center">
                                <p className="font-serif text-starlight text-base md:text-lg mb-1">{card}</p>
                                {spread === 'time' && (
                                    <p className="text-[10px] text-cosmic-neon font-bold uppercase tracking-widest">
                                        {idx === 0 ? 'Past' : idx === 1 ? 'Present' : 'Future'}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
                <button 
                    onClick={() => { setStep('question'); setQuestion(''); }}
                    className="mt-10 md:mt-12 w-full max-w-xs mx-auto block py-3 px-6 glass-panel hover:bg-white/10 text-starlight rounded-full font-medium transition-all text-xs md:text-sm uppercase tracking-wide border border-white/10"
                >
                    New Reading
                </button>
            </motion.div>
        )}
      </div>
    </div>
  );
}
