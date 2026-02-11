import React, { createContext, useContext, useState } from 'react';
import * as OpenCC from 'opencc-js';

// Language Types
export type Language = 'en' | 'zh-TW' | 'zh-CN';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    userLevel: string;
    setUserLevel: (level: string) => void;
    convert: (text: string) => Promise<string>;
    t: (labels: { en: string; zh: string }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// OpenCC Converters
// zh-TW <-> zh-CN
const converterTWToCN = OpenCC.Converter({ from: 'tw', to: 'cn' });
const converterCNToTW = OpenCC.Converter({ from: 'cn', to: 'tw' });

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize from localStorage or default to 'en'
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem('app-language');
        return (saved as Language) || 'en';
    });

    const [userLevel, setUserLevel] = useState<string>('Beginner'); // 'Beginner' or 'Advanced'

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('app-language', lang);
    };

    // Simple label translator
    const t = (labels: { en: string; zh: string }) => {
        if (language === 'en') return labels.en;
        if (language === 'zh-CN') return converterTWToCN(labels.zh);
        return labels.zh; // Default to Traditional (zh-TW)
    };

    // Async converter for larger blocks (stories)
    const convert = async (text: string): Promise<string> => {
        if (language === 'zh-CN') return converterTWToCN(text);
        if (language === 'zh-TW') return converterCNToTW(text); // Ensure it's TW
        return text;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, convert, t, userLevel, setUserLevel }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
    return context;
};
