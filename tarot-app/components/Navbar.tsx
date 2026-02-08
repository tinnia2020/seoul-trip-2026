"use client";
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, Compass, Zap, User } from 'lucide-react';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserName(localStorage.getItem('userName'));
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('userName');
    setUserName(null);
    router.push('/login');
  };

  if (pathname === '/login') return null;

  return (
    <>
      {/* --- DESKTOP NAVBAR (Top) --- */}
      <nav className="hidden md:block fixed top-0 w-full z-50 bg-space-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/dashboard" className="text-2xl font-serif text-starlight tracking-wide flex items-center gap-3 hover:text-cosmic-neon transition-colors group">
                <div className="relative w-8 h-8">
                   <div className="absolute inset-0 bg-cosmic-neon/50 blur-md rounded-full group-hover:bg-cosmic-neon/80 transition-all"></div>
                   <Sparkles className="relative w-8 h-8 text-starlight" />
                </div>
                <span>Cosmic Tarot</span>
              </Link>
              
              {/* Desktop Links */}
              <div className="ml-12 flex space-x-2">
                <NavLinkDesktop href="/dashboard" active={pathname === '/dashboard'} icon={<Compass className="w-4 h-4"/>} label={t('nav.dashboard')} />
                <NavLinkDesktop href="/divination" active={pathname === '/divination'} icon={<Sparkles className="w-4 h-4"/>} label="Reading" />
                <NavLinkDesktop href="/free-mode" active={pathname === '/free-mode'} icon={<Zap className="w-4 h-4"/>} label={t('nav.freeMode')} />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setLanguage(language === 'zh-TW' ? 'en' : 'zh-TW')}
                className="px-3 py-1 rounded-full bg-white/5 text-starlight-muted text-xs font-medium hover:bg-white/10 hover:text-white transition-colors uppercase tracking-wider border border-white/5"
              >
                {language === 'zh-TW' ? 'EN' : '繁中'}
              </button>
              
              {userName && (
                <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cosmic to-blue-600 flex items-center justify-center text-xs font-bold text-white border border-white/20">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-starlight text-sm font-medium tracking-wide">Hi, {userName}</span>
                  </div>
                  <button onClick={handleLogout} className="text-starlight-muted hover:text-red-400 text-xs uppercase tracking-widest transition-colors">
                     Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* --- MOBILE NAVBAR (Bottom) --- */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 bg-[#0B0B15]/95 backdrop-blur-2xl border-t border-white/10 pb-safe">
        <div className="flex justify-around items-center h-16 px-2">
          <NavLinkMobile href="/dashboard" active={pathname === '/dashboard'} icon={<Compass className="w-6 h-6"/>} label={t('nav.dashboard')} />
          
          {/* Featured Center Button for Reading */}
          <Link href="/divination" className="relative -top-5">
             <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${pathname === '/divination' ? 'bg-cosmic-neon shadow-[0_0_20px_rgba(224,170,255,0.6)] scale-110' : 'bg-space-800 border border-white/20 shadow-[0_0_15px_rgba(0,0,0,0.5)]'}`}>
                <Sparkles className={`w-7 h-7 ${pathname === '/divination' ? 'text-space-950' : 'text-starlight'}`} />
             </div>
             <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-starlight-muted whitespace-nowrap opacity-0">Reading</span>
          </Link>

          <NavLinkMobile href="/free-mode" active={pathname === '/free-mode'} icon={<Zap className="w-6 h-6"/>} label={t('nav.freeMode')} />
          
          <button 
             onClick={handleLogout}
             className="flex flex-col items-center justify-center w-16 space-y-1 text-starlight-muted"
          >
             <User className="w-6 h-6 opacity-60" />
             <span className="text-[10px] font-medium opacity-60">Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
}

function NavLinkDesktop({ href, active, icon, label }: { href: string, active: boolean, icon: any, label: string }) {
  return (
    <Link href={href} className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${active ? 'bg-white/10 text-cosmic-neon shadow-[0_0_15px_rgba(157,78,221,0.2)] border border-white/10' : 'text-starlight-muted hover:text-starlight hover:bg-white/5 border border-transparent'}`}>
      {icon}
      {label}
    </Link>
  );
}

function NavLinkMobile({ href, active, icon, label }: { href: string, active: boolean, icon: any, label: string }) {
  return (
    <Link href={href} className={`flex flex-col items-center justify-center w-16 space-y-1 transition-colors ${active ? 'text-cosmic-neon' : 'text-starlight-muted hover:text-starlight'}`}>
      <div className={`relative ${active ? 'scale-110 transition-transform' : ''}`}>
        {icon}
        {active && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-cosmic-neon rounded-full"></div>}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}
