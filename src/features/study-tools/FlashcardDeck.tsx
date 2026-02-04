import React, { useState } from 'react';
import { useLanguage } from '../language/LanguageContext';
import { Flashcard, type FlashcardData } from './components/Flashcard';
import { LucideCheckCircle } from 'lucide-react';

export const FlashcardDeck: React.FC = () => {
    const { t } = useLanguage();

    // Mock Data
    const initialDeck: FlashcardData[] = [
        { id: '1', front: '鮪魚', back: 'Tuna', example: 'The cat mayor promised free tuna.' },
        { id: '2', front: '市長', back: 'Mayor', example: 'Who is running for mayor?' },
        { id: '3', front: '混沌', back: 'Chaos', example: 'Embrace the chaos of language learning.' },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [complete, setComplete] = useState(false);

    const handleNext = (result: 'easy' | 'hard') => {
        console.log(`Card ${initialDeck[currentIndex].id} marked as ${result}`);

        if (currentIndex < initialDeck.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setComplete(true);
        }
    };

    if (complete) {
        return (
            <div className="scratch-card" style={{ textAlign: 'center', padding: '3rem' }}>
                <LucideCheckCircle size={64} color="var(--color-accent-gold)" style={{ marginBottom: '1rem' }} />
                <h2 style={{ marginBottom: '1rem' }}>{t({ en: 'Session Complete!', zh: '練習完成！' })}</h2>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                    {t({ en: 'You have reviewed 3 words.', zh: '你複習了 3 個單字。' })}
                </p>
                <button
                    className="btn-primary"
                    onClick={() => { setCurrentIndex(0); setComplete(false); }}
                >
                    {t({ en: 'Review Again', zh: '再次複習' })}
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: '2rem', width: '100%', maxWidth: '300px' }}>
                <p style={{ textAlign: 'right', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                    {currentIndex + 1} / {initialDeck.length}
                </p>
                <div style={{ background: 'rgba(255,255,255,0.1)', height: '4px', borderRadius: '2px' }}>
                    <div style={{
                        width: `${((currentIndex + 1) / initialDeck.length) * 100}%`,
                        height: '100%',
                        background: 'var(--color-accent-blue)',
                        transition: 'width 0.3s'
                    }}></div>
                </div>
            </div>

            <Flashcard data={initialDeck[currentIndex]} onNext={handleNext} />
        </div>
    );
};
