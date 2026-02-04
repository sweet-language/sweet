import React, { useState } from 'react';
import { useLanguage } from '../../language/LanguageContext';

export interface FlashcardData {
    id: string;
    front: string;
    back: string;
    example: string;
}

interface FlashcardProps {
    data: FlashcardData;
    onNext: (result: 'easy' | 'hard') => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({ data, onNext }) => {
    const { t } = useLanguage();
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => setIsFlipped(!isFlipped);

    return (
        <div style={{ perspective: '1000px', width: '300px', height: '400px', margin: '0 auto' }}>
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    textAlign: 'center',
                    transition: 'transform 0.6s',
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    cursor: 'pointer'
                }}
                onClick={handleFlip}
            >
                {/* Front */}
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    background: 'var(--color-bg-card)',
                    border: '1px solid var(--color-accent-gold)',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                }}>
                    <h2 className="scratch-text" style={{ fontSize: '2.5rem' }}>{data.front}</h2>
                    <p style={{ color: 'var(--color-text-secondary)', marginTop: '1rem' }}>
                        {t({ en: 'Tap to flip', zh: '點擊翻轉' })}
                    </p>
                </div>

                {/* Back */}
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    background: '#111',
                    border: '1px solid var(--color-accent-blue)',
                    borderRadius: '16px',
                    transform: 'rotateY(180deg)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                }}>
                    <h3 style={{ fontSize: '1.5rem', color: 'var(--color-text-primary)' }}>{data.back}</h3>
                    <p style={{ marginTop: '1rem', fontStyle: 'italic', color: 'var(--color-text-muted)' }}>
                        "{data.example}"
                    </p>

                    <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem', width: '100%' }} onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => onNext('hard')}
                            style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid #FF4444', background: 'transparent', color: '#FF4444', cursor: 'pointer' }}
                        >
                            {t({ en: 'Hard', zh: '困難' })}
                        </button>
                        <button
                            onClick={() => onNext('easy')}
                            style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid #00FF00', background: 'transparent', color: '#00FF00', cursor: 'pointer' }}
                        >
                            {t({ en: 'Easy', zh: '簡單' })}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
