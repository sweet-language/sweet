import React from 'react';
import { useLanguage } from '../../language/LanguageContext';

interface PathSelectionStepProps {
    onSelect: (path: 'test' | 'join') => void;
}

export const PathSelectionStep: React.FC<PathSelectionStepProps> = ({ onSelect }) => {
    const { t } = useLanguage();

    return (
        <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
            <h2 className="scratch-text" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                {t({ en: 'How would you like to start?', zh: '你想怎麼開始？' })}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                {t({ en: 'Choose the best path for you.', zh: '選擇最適合你的路徑。' })}
            </p>

            <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '400px', margin: '0 auto' }}>
                {/* Option 1: Test Your Level */}
                <button
                    onClick={() => onSelect('test')}
                    style={{
                        padding: '2rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '2px solid var(--color-accent-gold)',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <span style={{ fontSize: '2rem' }}>📝</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                        {t({ en: 'Test Your Level', zh: '測試你的程度' })}
                    </span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                        {t({ en: 'Take a quick adaptive test.', zh: '參加快速分級測驗。' })}
                    </span>
                </button>

                {/* Option 2: Join a Teacher */}
                <button
                    onClick={() => onSelect('join')}
                    style={{
                        padding: '2rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '2px dashed var(--color-accent-blue)',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <span style={{ fontSize: '2rem' }}>👨‍🏫</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                        {t({ en: 'Join a Teacher', zh: '加入班級' })}
                    </span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                        {t({ en: 'I have a Class Code.', zh: '我有班級代碼。' })}
                    </span>
                </button>
            </div>
        </div>
    );
};
