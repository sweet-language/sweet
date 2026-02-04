import React, { useState } from 'react';
import { useLanguage } from '../../language/LanguageContext';

interface AgeSelectionStepProps {
    onNext: (age: number) => void;
}

export const AgeSelectionStep: React.FC<AgeSelectionStepProps> = ({ onNext }) => {
    const { t } = useLanguage();
    const [age, setAge] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const ageNum = parseInt(age);
        if (ageNum > 0) {
            onNext(ageNum);
        }
    };

    return (
        <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s', maxWidth: '400px', margin: '0 auto' }}>
            <h2 className="scratch-text" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                {t({ en: 'How old are you?', zh: '你幾歲？' })}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                {t({ en: 'We will personalize the test for you.', zh: '我們會為你量身打造測驗。' })}
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder={t({ en: 'Enter your age', zh: '輸入你的年齡' })}
                    min="1"
                    max="120"
                    required
                    style={{
                        padding: '1.5rem',
                        fontSize: '1.5rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '2px solid var(--color-border)',
                        borderRadius: '12px',
                        color: 'white',
                        textAlign: 'center',
                        width: '100%',
                        boxSizing: 'border-box'
                    }}
                />

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={!age}
                    style={{
                        padding: '1.2rem',
                        fontSize: '1.2rem',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        marginTop: '1rem'
                    }}
                >
                    {t({ en: 'Continue', zh: '繼續' })}
                </button>
            </form>
        </div>
    );
};
