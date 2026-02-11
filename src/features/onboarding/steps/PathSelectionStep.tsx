import React from 'react';
import { useLanguage } from '../../language/LanguageContext';

import { LanguageToggle } from '../../language/LanguageToggle';
import testLevelSketch from '../../../assets/images/test_level_sketch.png';
import joinClassSketch from '../../../assets/images/join_class_sketch.png';

interface PathSelectionStepProps {
    onSelect: (path: 'test' | 'join') => void;
}

export const PathSelectionStep: React.FC<PathSelectionStepProps> = ({ onSelect }) => {
    const { t } = useLanguage();

    return (
        <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s', position: 'relative' }}>
            <div style={{ position: 'fixed', top: '2rem', right: '2rem', zIndex: 100 }}>
                <LanguageToggle />
            </div>
            <h2 className="scratch-text" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                {t({ en: 'How would you like to start?', zh: '你想怎麼開始？' })}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                {t({ en: 'Choose the best path for you.', zh: '選擇最適合你的路徑。' })}
            </p>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                {/* Option 1: Test Your Level */}
                <button
                    onClick={() => onSelect('test')}
                    style={{
                        padding: '2rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: 'none',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                >

                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                        {t({ en: 'Test Your Level', zh: '測試你的程度' })}
                    </span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                        {t({ en: 'Take a quick adaptive test.', zh: '參加快速分級測驗。' })}
                    </span>
                    <img
                        src={testLevelSketch}
                        alt="Test Level"
                        style={{
                            width: '120px',
                            height: 'auto',
                            marginTop: '1rem',
                            filter: 'invert(1)',
                            mixBlendMode: 'screen',
                            opacity: 0.9
                        }}
                    />
                </button>

                {/* Option 2: Join a Teacher */}
                <button
                    onClick={() => onSelect('join')}
                    style={{
                        padding: '2rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: 'none',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                >

                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                        {t({ en: 'Join a Teacher', zh: '加入班級' })}
                    </span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                        {t({ en: 'I have a Class Code.', zh: '我有班級代碼。' })}
                    </span>
                    <img
                        src={joinClassSketch}
                        alt="Join Class"
                        style={{
                            width: '120px',
                            height: 'auto',
                            marginTop: '1rem',
                            filter: 'invert(1)',
                            mixBlendMode: 'screen',
                            opacity: 0.9
                        }}
                    />
                </button>
            </div>
        </div>
    );
};
