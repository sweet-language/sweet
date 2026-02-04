import React from 'react';
import { useLanguage, type Language } from './LanguageContext';

export interface LanguageToggleProps {
    variant?: 'light' | 'dark';
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ variant = 'light' }) => {
    const { language, setLanguage } = useLanguage();

    const options: { id: Language; label: string }[] = [
        { id: 'en', label: 'EN' },
        { id: 'zh-TW', label: '繁' },
        { id: 'zh-CN', label: '简' },
    ];

    const isDarkBg = variant === 'dark';

    // selected state colors
    const selectedBg = isDarkBg ? '#ffffff' : '#1a1918';
    const selectedText = isDarkBg ? '#1a1918' : '#ffffff';

    // unselected state colors
    const unselectedText = isDarkBg ? 'rgba(255,255,255,0.6)' : 'var(--color-text-secondary)';

    return (
        <div style={{
            display: 'flex',
            gap: '8px',
            background: 'transparent',
            padding: '4px',
            borderRadius: '8px',
            border: `1px solid ${isDarkBg ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`
        }}>
            {options.map((opt) => (
                <button
                    key={opt.id}
                    onClick={() => setLanguage(opt.id)}
                    style={{
                        background: language === opt.id ? selectedBg : 'transparent',
                        color: language === opt.id ? selectedText : unselectedText,
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 12px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontFamily: 'var(--font-heading)',
                        transition: 'all 0.3s ease',
                        boxShadow: language === opt.id ? '0 2px 8px rgba(0,0,0, 0.2)' : 'none'
                    }}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
};
