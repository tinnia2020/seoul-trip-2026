import type { Metadata } from "next";
import { Lato, Playfair_Display } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../contexts/LanguageContext";
import Navbar from "../components/Navbar";

const lato = Lato({
  weight: ['300', '400', '700'],
  subsets: ["latin"],
  variable: '--font-sans'
});

const playfair = Playfair_Display({
  weight: ['400', '500', '700'],
  subsets: ["latin"],
  variable: '--font-serif'
});

export const metadata: Metadata = {
  title: "Cosmic Tarot",
  description: "Unveil your destiny",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lato.variable} ${playfair.variable} font-sans antialiased text-starlight min-h-screen flex flex-col overflow-x-hidden selection:bg-cosmic-neon selection:text-space-950`}>
        {/* Global Noise Overlay */}
        <div className="fixed inset-0 z-50 pointer-events-none bg-noise mix-blend-overlay"></div>

        <LanguageProvider>
          {/* Main Content */}
          <main className="flex-grow w-full relative z-10">
              {children}
          </main>
           
           <div className="fixed bottom-0 w-full z-40">
             <Navbar />
           </div>

           {/* Cosmic Background Elements */}
           <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Vivid Ambient Glows */}
                <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-cosmic-dark/30 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] bg-blue-900/20 rounded-full blur-[100px] mix-blend-screen animate-float"></div>
                <div className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] bg-purple-900/30 rounded-full blur-[120px] mix-blend-screen"></div>
                
                {/* Stars */}
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full opacity-60 animate-float shadow-[0_0_10px_white]"></div>
                <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-cosmic-neon rounded-full opacity-50 animate-float animation-delay-2000 shadow-[0_0_10px_#E0AAFF]"></div>
                <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-white rounded-full opacity-40 animate-pulse"></div>
            </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
