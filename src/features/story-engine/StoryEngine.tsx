import React, { useState } from 'react';
import { useLanguage } from '../language/LanguageContext';
import { StoryInput } from './components/StoryInput';
import { StoryDisplay } from './components/StoryDisplay';
import { AudioControls } from './components/AudioControls';
import { aiService, type GeneratedStory } from '../../services/aiService';

export const StoryEngine: React.FC = () => {
    const { t, language, userLevel } = useLanguage();
    const [isGenerating, setIsGenerating] = useState(false);
    const [story, setStory] = useState<GeneratedStory | null>(null);

    const handleGenerate = async (topic: string) => {
        setIsGenerating(true);
        try {
            const result = await aiService.generateStory(topic, language, userLevel);
            setStory(result);
        } catch (error) {
            console.error("Failed to generate story:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div style={{ padding: '2rem', paddingBottom: '100px', maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 className="scratch-text">{t({ en: 'The Story Engine', zh: '故事引擎' })}</h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                    {t({ en: 'Generate absurd stories to boost your memory.', zh: '生成荒謬故事以增強記憶。' })}
                </p>
            </header>

            <StoryInput onGenerate={handleGenerate} isGenerating={isGenerating} />

            <StoryDisplay story={story} />

            {story && <AudioControls textToRead={story.content} />}
        </div>
    );
};
