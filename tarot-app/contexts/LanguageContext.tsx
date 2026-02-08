"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'zh-TW' | 'en';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  'zh-TW': {
    'app.title': '塔羅占卜',
    'nav.dashboard': '儀表板',
    'nav.freeMode': '自由模式',
    'nav.login': '登入',
    'nav.logout': '登出',
    'login.title': '歡迎來到心靈塔羅',
    'login.subtitle': '探索內心的指引',
    'login.placeholder': '請輸入您的名字',
    'login.button': '開始旅程',
    'dashboard.welcome': '歡迎, {name}',
    'dashboard.daily': '今日運勢',
    'dashboard.daily.desc': '每日一張，指引當下能量',
    'dashboard.ai': 'AI 占卜',
    'dashboard.ai.desc': '智能解析，深度洞察',
    'dashboard.free': '自由模式',
    'dashboard.free.desc': '手動抽牌，多種牌陣',
    'dashboard.history': '歷史紀錄',
    'daily.draw': '抽取今日牌卡',
    'daily.your_card': '您的今日牌卡',
    'free.question': '心中想著您的問題...',
    'free.spread': '選擇牌陣',
    'free.spread.one': '單張占卜',
    'free.spread.time': '過去/現在/未來',
    'free.spread.celtic': '凱爾特十字',
    'free.draw': '開始抽牌',
    'result.title': '占卜結果',
    'history.empty': '尚無紀錄',
    'divination.back': '返回',
    'divination.ask': '您心中所惑為何？',
    'divination.placeholder': '請在此輸入您的問題...',
    'divination.consult': '祈求指引',
    'divination.focus': '專注於您的問題...',
    'divination.select': '準備好後，請選擇一張牌',
    'divination.analysis': '解析',
    'divination.again': '再問一個問題',
  },
  'en': {
    'app.title': 'Tarot App',
    'nav.dashboard': 'Dashboard',
    'nav.freeMode': 'Free Mode',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'login.title': 'Welcome to Mystic Tarot',
    'login.subtitle': 'Explore your inner guidance',
    'login.placeholder': 'Enter your name',
    'login.button': 'Start Journey',
    'dashboard.welcome': 'Welcome, {name}',
    'dashboard.daily': 'Daily Fortune',
    'dashboard.daily.desc': 'One card for daily guidance',
    'dashboard.ai': 'AI Divination',
    'dashboard.ai.desc': 'Smart insights and reading',
    'dashboard.free': 'Free Mode',
    'dashboard.free.desc': 'Manual draw, various spreads',
    'dashboard.history': 'History',
    'daily.draw': 'Draw Daily Card',
    'daily.your_card': 'Your Daily Card',
    'free.question': 'Focus on your question...',
    'free.spread': 'Select Spread',
    'free.spread.one': 'One Card',
    'free.spread.time': 'Past/Present/Future',
    'free.spread.celtic': 'Celtic Cross',
    'free.draw': 'Draw Cards',
    'result.title': 'Reading Result',
    'history.empty': 'No history yet',
    'divination.back': 'Back',
    'divination.ask': 'What is on your heart?',
    'divination.placeholder': 'Type your question or concern here...',
    'divination.consult': 'Consult the Cards',
    'divination.focus': 'Focus on your question...',
    'divination.select': 'Select a card when you feel ready',
    'divination.analysis': 'Analysis',
    'divination.again': 'Ask another question',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('zh-TW');

  const t = (key: string, params?: { [key: string]: string | number }) => {
    let text = translations[language][key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
