import React, { useState } from 'react';
import { useLanguage } from '../../language/LanguageContext';

interface ClassCodeStepProps {
    onChange: (code: string) => void;
}

export const ClassCodeStep: React.FC<ClassCodeStepProps> = ({ onChange }) => {
    const { t } = useLanguage();
    const [code, setCode] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.toUpperCase();
        setCode(val);
        onChange(val);
    };

    return (
        <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
            <h2 className="scratch-text" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                {t({ en: 'Enter Class Code', zh: '輸入班級代碼' })}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                {t({ en: 'Ask your teacher for the 6-digit code.', zh: '請向老師索取 6 位數代碼。' })}
            </p>

            <input
                type="text"
                value={code}
                onChange={handleChange}
                placeholder="Ex. A1B2C3"
                style={{
                    fontSize: '2rem',
                    padding: '1rem',
                    textAlign: 'center',
                    letterSpacing: '0.2em',
                    width: '100%',
                    maxWidth: '300px',
                    borderRadius: '8px',
                    border: '2px solid var(--color-accent-blue)',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'var(--color-text-primary)',
                    outline: 'none',
                    fontFamily: 'monospace'
                }}
            />
        </div>
    );
};
