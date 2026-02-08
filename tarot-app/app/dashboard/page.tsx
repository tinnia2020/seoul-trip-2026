"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Sparkles, History, LayoutGrid, Zap } from 'lucide-react';

export default function DashboardPage() {
  const { t } = useLanguage();
  const [userName, setUserName] = useState('');
  const [dailyCard, setDailyCard] = useState<string | null>(null);

  useEffect(() => {
    setUserName(localStorage.getItem('userName') || 'Traveler');
    
    // Check daily draw
    const today = new Date().toISOString().split('T')[0];
    const lastDraw = localStorage.getItem('dailyDrawDate');
    const savedCard = localStorage.getItem('dailyCard');
    
    if (lastDraw === today && savedCard) {
      setDailyCard(savedCard);
    }
  }, []);

  const handleDailyDraw = () => {
    // Mock draw
    const cards = ['The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor', 'The World', 'The Star', 'The Moon', 'The Sun', 'Death', 'The Tower', 'Strength', 'The Lovers'];
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    const today = new Date().toISOString().split('T')[0];
    
    localStorage.setItem('dailyDrawDate', today);
    localStorage.setItem('dailyCard', randomCard);
    setDailyCard(randomCard);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 pb-32 pt-6 md:pt-10 px-4 md:px-6">
      
      {/* Header */}
      <header className="mb-8 md:mb-12 text-left relative z-10">
        <h1 className="text-3xl md:text-5xl font-serif text-starlight tracking-wide mb-2 md:mb-3 text-glow">
          {t('dashboard.welcome', { name: userName })}
        </h1>
        <p className="text-starlight-muted text-sm md:text-lg font-light tracking-wide">The stars align for you today.</p>
      </header>

      {/* Daily Draw Section - Glass Card */}
      <section className="glass-panel rounded-3xl p-6 md:p-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cosmic-neon/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-cosmic-neon/20 transition-colors duration-1000"></div>
        
        <div className="flex items-center gap-3 mb-6 md:mb-8 relative z-10">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-cosmic-neon animate-pulse-slow" />
            <h2 className="text-xl md:text-2xl font-serif text-starlight">
            {t('dashboard.daily')}
            </h2>
        </div>
        
        <div className="flex flex-col items-center justify-center min-h-[250px] md:min-h-[300px] relative z-10">
          {dailyCard ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center w-full max-w-sm"
            >
              <div className="aspect-[2/3] w-40 md:w-56 mx-auto bg-gradient-to-br from-space-800 to-black rounded-xl mb-4 md:mb-6 flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(157,78,221,0.3)] relative border border-white/10">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
                 <span className="text-5xl md:text-6xl animate-float">🎴</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-serif text-white mb-2 text-glow">{dailyCard}</h3>
              <p className="text-cosmic-neon font-medium tracking-widest uppercase text-[10px] md:text-xs">{t('daily.your_card')}</p>
            </motion.div>
          ) : (
            <div className="text-center w-full max-w-sm">
               <div 
                className="aspect-[2/3] w-40 md:w-56 bg-space-800 rounded-xl shadow-2xl mx-auto mb-6 md:mb-8 cursor-pointer hover:-translate-y-4 transition-all duration-500 flex items-center justify-center group/card relative overflow-hidden border border-white/5 hover:border-cosmic-neon/50 hover:shadow-[0_0_40px_rgba(157,78,221,0.4)]" 
                onClick={handleDailyDraw}
               >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                  <div className="absolute inset-2 border border-white/10 rounded-lg flex items-center justify-center group-hover/card:border-cosmic-neon/30 transition-colors">
                     <span className="text-4xl md:text-5xl text-white/20 group-hover/card:text-white/80 transition-colors font-serif group-hover/card:scale-110 duration-500">?</span>
                  </div>
               </div>
               <button 
                onClick={handleDailyDraw}
                className="px-8 md:px-10 py-3 bg-cosmic text-white rounded-full hover:bg-cosmic-light transition-all shadow-lg hover:shadow-[0_0_20px_rgba(157,78,221,0.6)] text-base md:text-lg tracking-wide font-medium relative overflow-hidden group/btn w-full md:w-auto"
               >
                 <span className="relative z-10">{t('daily.draw')}</span>
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
               </button>
            </div>
          )}
        </div>
      </section>

      {/* Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <Link href="/divination" className="glass-panel rounded-3xl p-6 md:p-8 hover:bg-space-800/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(157,78,221,0.2)] group relative overflow-hidden flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-cosmic-neon/20 rounded-full blur-[60px] group-hover:bg-cosmic-neon/30 transition-colors"></div>
          <div className="w-12 h-12 md:w-16 md:h-16 bg-space-800 rounded-full flex items-center justify-center mb-0 md:mb-6 border border-white/10 shadow-lg group-hover:border-cosmic-neon/50 transition-colors shrink-0">
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-cosmic-neon" />
          </div>
          <div className="relative z-10 flex-1">
              <h3 className="text-lg md:text-2xl font-serif text-starlight mb-1 md:mb-3 group-hover:text-cosmic-neon transition-colors">{t('dashboard.ai')}</h3>
              <p className="text-starlight-muted leading-relaxed text-xs md:text-sm line-clamp-2 md:line-clamp-none">{t('dashboard.ai.desc')}</p>
          </div>
        </Link>
        
        <Link href="/free-mode" className="glass-panel rounded-3xl p-6 md:p-8 hover:bg-space-800/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(157,78,221,0.2)] group relative overflow-hidden flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/20 rounded-full blur-[60px] group-hover:bg-blue-500/30 transition-colors"></div>
          <div className="w-12 h-12 md:w-16 md:h-16 bg-space-800 rounded-full flex items-center justify-center mb-0 md:mb-6 border border-white/10 shadow-lg group-hover:border-blue-400/50 transition-colors shrink-0">
            <Zap className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
          </div>
          <div className="relative z-10 flex-1">
              <h3 className="text-lg md:text-2xl font-serif text-starlight mb-1 md:mb-3 group-hover:text-blue-300 transition-colors">{t('dashboard.free')}</h3>
              <p className="text-starlight-muted leading-relaxed text-xs md:text-sm line-clamp-2 md:line-clamp-none">{t('dashboard.free.desc')}</p>
          </div>
        </Link>
      </div>

      {/* History Section */}
      <section className="glass-panel rounded-3xl p-6 md:p-8 mb-20 md:mb-0">
        <h2 className="text-xl md:text-2xl font-serif text-starlight mb-6 flex items-center gap-3">
          <History className="w-5 h-5 md:w-6 md:h-6 text-starlight-muted" /> {t('dashboard.history')}
        </h2>
        <div className="space-y-4">
          {/* Mock History Items */}
          {[
            { title: "General Reading", date: "2026-02-01", type: "Celtic Cross" },
            { title: "Career Path", date: "2026-01-30", type: "Three Card" }
          ].map((item, i) => (
             <div key={i} className="flex items-center justify-between p-4 md:p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors cursor-pointer group">
                <div className="flex flex-col gap-1">
                  <span className="font-serif text-base md:text-lg text-starlight group-hover:text-cosmic-neon transition-colors">{item.title}</span>
                  <span className="text-[10px] md:text-xs font-medium text-starlight-dim uppercase tracking-wider">{item.date} • {item.type}</span>
                </div>
                <span className="text-cosmic-neon opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1 text-sm md:text-base">View →</span>
             </div>
          ))}
        </div>
      </section>
    </div>
  );
}
