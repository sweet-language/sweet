import React from 'react';
import { useLanguage } from '../language/LanguageContext';
import { LucideBookOpen, LucideDownload } from 'lucide-react';

export const LivingBook: React.FC = () => {
    const { t } = useLanguage();

    const month = t({ en: 'February 2026', zh: '2026年 2月' });

    return (
        <div className="scratch-card" style={{ maxWidth: '800px', margin: '2rem auto', textAlign: 'center' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                <LucideBookOpen color="var(--color-accent-purple)" />
                {t({ en: 'The Living Textbook', zh: '活體教科書' })}
            </h2>

            <div style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #000 100%)',
                border: '1px solid var(--color-text-muted)',
                borderRadius: '4px',
                width: '200px',
                height: '300px',
                margin: '0 auto 2rem',
                boxShadow: '10px 10px 30px rgba(0,0,0,0.8)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
            }}>
                {/* Book Binding */}
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '10px', background: 'rgba(255,255,255,0.1)' }}></div>

                <h3 className="scratch-text" style={{ fontFamily: 'var(--font-heading)' }}>sweet!</h3>
                <p style={{ color: 'var(--color-accent-gold)', marginTop: '0.5rem' }}>{month}</p>
                <div style={{ marginTop: '2rem', fontSize: '3rem', opacity: 0.2 }}>🐉</div>
            </div>

            <p style={{ color: 'var(--color-text-primary)', marginBottom: '1rem', lineHeight: '1.6' }}>
                {t({
                    en: 'Your personalized collection of stories, vocabulary, and grammar from this month.',
                    zh: '您本月的個人化故事、單字和文法合集。'
                })}
            </p>

            <button className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <LucideDownload size={20} />
                {t({ en: 'Download PDF', zh: '下載 PDF' })}
            </button>
        </div>
    );
};
