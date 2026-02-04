import React from 'react';
// import { useLanguage } from '../../language/LanguageContext';
import { LucideImage, LucideSkipBack, LucideSkipForward } from 'lucide-react';

interface StoryDisplayProps {
    story: {
        title: string;
        content: string;
        imageUrl?: string;
        imagePlaceholder?: string; // Color code or ID for now
    } | null;
}

export const StoryDisplay: React.FC<StoryDisplayProps> = ({ story }) => {
    // const { t } = useLanguage();

    if (!story) return null;

    return (
        <div className="scratch-card" style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{
                height: '250px',
                background: '#111',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--color-text-muted)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Placeholder for AI Image */}
                {story.imageUrl && !story.imageUrl.includes('mock-image-id') ? (
                    <img
                        src={story.imageUrl}
                        alt={story.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <>
                        <div style={{ position: 'absolute', inset: 0, opacity: 0.2, background: `repeating-linear-gradient(45deg, #000 0, #000 10px, #222 10px, #222 20px)` }}></div>
                        <div style={{ textAlign: 'center', zIndex: 1 }}>
                            <LucideImage size={48} color="var(--color-text-muted)" style={{ marginBottom: '1rem' }} />
                            <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-heading)' }}>
                                [AI Visual: {story.title}]
                            </p>
                        </div>
                    </>
                )}
            </div>

            <h2 className="scratch-text" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                {story.title}
            </h2>

            <div style={{
                lineHeight: '1.8',
                fontSize: '1.1rem',
                color: 'var(--color-text-primary)',
                whiteSpace: 'pre-wrap',
                marginBottom: '2rem',
                padding: '0 1rem',
                borderLeft: '2px solid var(--color-accent-gold)'
            }}>
                {story.content}
            </div>

            {/* Pagination / Scene Navigation (Mock) */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                <button style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                    <LucideSkipBack />
                </button>
                <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent-silver)' }}>1 / 4</span>
                <button style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer' }}>
                    <LucideSkipForward />
                </button>
            </div>
        </div>
    );
};
