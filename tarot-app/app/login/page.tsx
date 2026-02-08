"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';
import { Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [name, setName] = useState('');
  const router = useRouter();
  const { t } = useLanguage();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('userName', name);
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/4 w-60 h-60 md:w-96 md:h-96 bg-cosmic-neon/20 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-60 h-60 md:w-96 md:h-96 bg-blue-900/20 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow animation-delay-2000"></div>

      <div className="w-full max-w-sm md:max-w-md p-8 md:p-10 glass-panel rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.5)] border border-white/10 relative z-10 backdrop-blur-xl">
        <div className="flex justify-center mb-6 md:mb-8">
           <div className="w-16 h-16 rounded-full bg-space-800 border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(157,78,221,0.3)]">
             <Sparkles className="w-8 h-8 text-cosmic-neon" />
           </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-serif text-starlight mb-2 md:mb-3 text-center tracking-wide text-glow">{t('login.title')}</h1>
        <p className="text-starlight-muted mb-8 md:mb-10 text-center text-sm md:text-lg leading-relaxed">{t('login.subtitle')}</p>
        
        <form onSubmit={handleLogin} className="space-y-6 md:space-y-8">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cosmic-dark to-cosmic-neon rounded-2xl opacity-30 group-hover:opacity-60 blur transition duration-500"></div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('login.placeholder')}
              className="relative w-full px-6 py-4 rounded-2xl bg-space-950/90 border border-white/10 focus:border-cosmic-neon/50 outline-none transition-all placeholder:text-starlight-dim text-starlight text-base md:text-lg shadow-inner"
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 px-6 bg-cosmic hover:bg-cosmic-light text-white rounded-full font-medium shadow-[0_0_20px_rgba(157,78,221,0.4)] hover:shadow-[0_0_30px_rgba(157,78,221,0.6)] transition-all transform hover:-translate-y-0.5 text-base md:text-lg tracking-wide uppercase"
          >
            {t('login.button')}
          </button>
        </form>
      </div>
      
      <div className="mt-8 text-starlight-dim text-xs md:text-sm font-serif italic opacity-60">
        "The universe is waiting for you."
      </div>
    </div>
  );
}
