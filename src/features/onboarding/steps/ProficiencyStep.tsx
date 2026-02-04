import React, { useState } from 'react';
import { useLanguage } from '../../language/LanguageContext';

interface ProficiencyStepProps {
    onChange: (data: { level: string }) => void;
}

export const ProficiencyStep: React.FC<ProficiencyStepProps> = ({ onChange }) => {
    const { t } = useLanguage();
    const [selected, setSelected] = useState('');

    const levels = [
        { id: 'beginner', label: t({ en: 'Beginner (A1-A2)', zh: '初學者 (A1-A2)' }) },
        { id: 'intermediate', label: t({ en: 'Intermediate (B1-B2)', zh: '中級 (B1-B2)' }) },
        { id: 'advanced', label: t({ en: 'Advanced (C1-C2)', zh: '高級 (C1-C2)' }) },
    ];

    const handleSelect = (id: string) => {
        setSelected(id);
        onChange({ level: id });
    };

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                {t({ en: 'What is your current level?', zh: '您的目前程度？' })}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {levels.map((level) => (
                    <button
                        key={level.id}
                        onClick={() => handleSelect(level.id)}
                        style={{
                            background: selected === level.id ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                            border: selected === level.id ? '1px solid var(--color-accent-gold)' : '1px solid var(--color-text-muted)',
                            color: selected === level.id ? 'var(--color-accent-gold)' : 'var(--color-text-primary)',
                            padding: '1rem',
                            borderRadius: '8px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-heading)',
                            fontSize: '1.1rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        {level.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
