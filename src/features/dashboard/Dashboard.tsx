import React, { useEffect, useState } from 'react';
import { useLanguage } from '../language/LanguageContext';
import { useAuth } from '../auth/AuthContext';
import { contentService, type ContentItem } from '../../services/contentService';
import { FlashcardDeck } from '../study-tools/FlashcardDeck';
import { LivingBook } from '../study-tools/LivingBook';
import { LucideBook, LucideBrain, LucideLibrary } from 'lucide-react';

export const Dashboard: React.FC = () => {
    const { t, language } = useLanguage();
    const { user, getAllTeachers } = useAuth();
    const [activeTab, setActiveTab] = useState<'stories' | 'flashcards' | 'library'>('stories');

    // Content State
    const [assignedStories, setAssignedStories] = useState<ContentItem[]>([]);
    const [selectedStory, setSelectedStory] = useState<ContentItem | null>(null);

    // Find linked teacher
    const myTeacher = user?.linkedTeacherId
        ? getAllTeachers().find(t => t.id === user.linkedTeacherId)
        : null;

    useEffect(() => {
        if (user) {
            const stories = contentService.getContentForStudent(user.id);
            setAssignedStories(stories);
            if (stories.length > 0) {
                setSelectedStory(stories[0]);
            }
        }
    }, [user, activeTab]);

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
            {/* Header / Nav */}
            <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', marginBottom: '4rem', borderBottom: '1px solid var(--color-text-muted)', paddingBottom: '1rem' }}>
                {[
                    { id: 'stories', label: t({ en: 'MY STORIES', zh: '我的故事' }), icon: LucideBook },
                    { id: 'flashcards', label: t({ en: 'FLASHCARDS', zh: '單字卡' }), icon: LucideBrain },
                    { id: 'library', label: t({ en: 'LIBRARY', zh: '圖書館' }), icon: LucideLibrary },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                            color: activeTab === tab.id ? 'var(--color-accent-blue)' : 'var(--color-text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'color 0.2s'
                        }}
                    >
                        <tab.icon size={20} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            {activeTab === 'stories' && (
                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '4rem' }}>

                    {/* Story List (Sidebar) */}
                    <div>
                        <h3 style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            {t({ en: 'Assigned Lessons', zh: '指派課程' })}
                        </h3>
                        {assignedStories.length === 0 ? (
                            <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                                {t({ en: 'No stories assigned yet. Ask your teacher!', zh: '尚未指派故事。請詢問您的老師！' })}
                            </p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {assignedStories.map(story => (
                                    <button
                                        key={story.id}
                                        onClick={() => setSelectedStory(story)}
                                        style={{
                                            textAlign: 'left',
                                            padding: '1rem 0',
                                            background: 'transparent',
                                            border: 'none',
                                            borderLeft: selectedStory?.id === story.id ? '3px solid var(--color-accent-blue)' : '3px solid transparent',
                                            paddingLeft: '1rem',
                                            cursor: 'pointer',
                                            color: selectedStory?.id === story.id ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{story.title}</div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                                            {new Date(story.createdAt).toLocaleDateString(language === 'en' ? 'en-US' : 'zh-TW')}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Active Story View */}
                    <div>
                        {selectedStory ? (
                            <div style={{ animation: 'fadeIn 0.5s' }}>
                                <h1 style={{ fontSize: '3rem', marginBottom: '2rem', lineHeight: '1.2' }}>{selectedStory.title}</h1>

                                {/* If it has content (text) */}
                                {selectedStory.payload.content && (
                                    <div style={{ fontSize: '1.4rem', lineHeight: '1.8', marginBottom: '3rem', whiteSpace: 'pre-wrap' }}>
                                        {selectedStory.payload.content}
                                    </div>
                                )}

                                {/* If it has vocab */}
                                {selectedStory.payload.vocab && (
                                    <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--color-text-muted)' }}>
                                        <h4 style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                                            {t({ en: 'VOCABULARY', zh: '單字' })}
                                        </h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                                            {selectedStory.payload.vocab.map((v: string, i: number) => (
                                                <span key={i} style={{
                                                    padding: '0.3rem 0.8rem',
                                                    border: '1px solid var(--color-text-muted)',
                                                    borderRadius: '20px',
                                                    fontSize: '0.9rem'
                                                }}>
                                                    {v}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', opacity: 0.3 }}>
                                <p>{t({ en: 'Select a story to begin', zh: '選擇一個故事開始' })}</p>
                            </div>
                        )}
                    </div>

                </div>
            )}

            {activeTab === 'flashcards' && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <FlashcardDeck />
                </div>
            )}

            {activeTab === 'library' && (
                <LivingBook />
            )}

            {/* My Teacher Widget (Lower Right) */}
            <div style={{
                position: 'fixed',
                bottom: '2rem',
                left: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: 'var(--color-bg-base)', // Adapted to theme
                border: '1px solid var(--color-border-scratch)',
                borderRadius: '50px', // Pill shape
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                opacity: 0.85, // Muted
                transition: 'opacity 0.2s',
                zIndex: 50
            }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '0.85'}
            >
                <div style={{
                    width: '45px', height: '45px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-accent-blue)', // "Same blue color"
                    color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', fontSize: '1.2rem',
                    overflow: 'hidden',
                    flexShrink: 0
                }}>
                    {myTeacher?.avatar ? (
                        <img
                            src={myTeacher.avatar}
                            alt="Teacher"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        myTeacher?.id.charAt(0).toUpperCase() || '?'
                    )}
                </div>
                <div style={{ paddingRight: '0.5rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {t({ en: 'My Teacher', zh: '我的老師' })}
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>
                        {myTeacher ? myTeacher.id : (user?.linkedTeacherId || t({ en: 'None', zh: '無' }))}
                    </div>
                </div>
            </div>
        </div>
    );
};
