import React, { useState } from 'react';
import { useLanguage } from '../../language/LanguageContext';
import { LucideSparkles } from 'lucide-react';

interface StoryInputProps {
    onGenerate: (topic: string) => void;
    isGenerating: boolean;
}

export const StoryInput: React.FC<StoryInputProps> = ({ onGenerate, isGenerating }) => {
    const { t } = useLanguage();
    const [topic, setTopic] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (topic.trim()) {
            onGenerate(topic);
        }
    };

    return (
        <div className="scratch-card" style={{ marginBottom: '2rem' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <LucideSparkles color="var(--color-accent-blue)" />
                {t({ en: 'Story Input', zh: '故事輸入' })}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={t({
                        en: 'e.g., A cat running for mayor...',
                        zh: '例如：一隻貓競選市長……'
                    })}
                    style={{
                        flex: 1,
                        padding: '1rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--color-text-muted)',
                        borderRadius: '8px',
                        color: 'var(--color-text-primary)',
                        fontFamily: 'var(--font-body)',
                        minWidth: '250px'
                    }}
                    disabled={isGenerating}
                />
                <button
                    type="submit"
                    className="btn-primary"
                    disabled={isGenerating}
                    style={{
                        opacity: isGenerating ? 0.7 : 1,
                        cursor: isGenerating ? 'wait' : 'pointer',
                        minWidth: '150px'
                    }}
                >
                    {isGenerating ? t({ en: 'Dreaming...', zh: '生成中...' }) : t({ en: 'Generate Story', zh: '生成故事' })}
                </button>
            </form>
        </div>
    );
};
