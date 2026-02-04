import React from 'react';
import { useLanguage } from '../../language/LanguageContext';

interface LanguageStepProps {
    onNext: (data: { targetLanguage: 'en' | 'zh' }) => void;
}

export const LanguageStep: React.FC<LanguageStepProps> = ({ onNext }) => {
    const { setLanguage, t } = useLanguage();

    const handleSelect = (target: 'en' | 'zh') => {
        // Logic: If learning English, UI is likely Chinese. If learning Chinese, UI is English.
        if (target === 'en') {
            setLanguage('zh-TW'); // Learn English -> Interface in Chinese
        } else {
            setLanguage('en');    // Learn Chinese -> Interface in English
        }
        onNext({ targetLanguage: target });
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h2 className="scratch-text" style={{ fontSize: '2rem', marginBottom: '2rem' }}>
                {t({ en: 'What do you want to learn?', zh: '你想學習什麼語言？' })}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button
                    onClick={() => handleSelect('en')}
                    className="scratch-card"
                    style={{
                        cursor: 'pointer',
                        textAlign: 'center',
                        borderColor: 'var(--color-accent-blue)',
                        transition: 'transform 0.2s'
                    }}
                >
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🇺🇸</div>
                    <h3 style={{ color: 'var(--color-accent-blue)' }}>English</h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                        {t({ en: 'For Mandarin Speakers', zh: '給中文使用者' })}
                    </p>
                </button>

                <button
                    onClick={() => handleSelect('zh')}
                    className="scratch-card"
                    style={{
                        cursor: 'pointer',
                        textAlign: 'center',
                        borderColor: 'var(--color-accent-gold)',
                        transition: 'transform 0.2s'
                    }}
                >
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🇹🇼</div>
                    <h3 style={{ color: 'var(--color-accent-gold)' }}>Mandarin</h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                        {t({ en: 'For English Speakers', zh: '給英語使用者' })}
                    </p>
                </button>
            </div>
        </div>
    );
};
