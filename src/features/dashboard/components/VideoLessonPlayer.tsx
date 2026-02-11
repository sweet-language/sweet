import React from 'react';
import { useVideoPlayer } from '../../../hooks/useVideoPlayer';
import type { VideoContent, VocabItem } from '../../../models/lessonPlan';
import { useLanguage } from '../../language/LanguageContext';

interface VideoLessonPlayerProps {
    videoContent: VideoContent;
    vocabItems: VocabItem[];
}

export const VideoLessonPlayer: React.FC<VideoLessonPlayerProps> = ({ videoContent, vocabItems }) => {
    const { t } = useLanguage();
    const { state, bindVideoElement, play, pause, seek, reset } = useVideoPlayer(videoContent.timedItems);

    const activeVocab = state.activeTimedItem?.vocabItemId
        ? vocabItems.find(v => v.id === state.activeTimedItem?.vocabItemId)
        : null;

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    const progressPct = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Video Element */}
            <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#000' }}>
                <video
                    ref={bindVideoElement}
                    src={videoContent.videoUrl}
                    style={{ width: '100%', display: 'block' }}
                    playsInline
                />

                {/* Timed Content Overlay */}
                {state.isPausedForContent && state.activeTimedItem && (
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                        padding: '2rem 1.5rem 1.5rem',
                        animation: 'fadeIn 0.3s ease-out',
                    }}>
                        {activeVocab ? (
                            <div style={{ color: 'white', textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>
                                    {activeVocab.word}
                                </div>
                                {activeVocab.pinyin && (
                                    <div style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: '0.3rem' }}>
                                        {activeVocab.pinyin}
                                    </div>
                                )}
                                <div style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '0.2rem' }}>
                                    <em>{activeVocab.partOfSpeech}</em> — {activeVocab.definition}
                                </div>
                                {activeVocab.exampleSentence && (
                                    <div style={{ fontSize: '0.9rem', opacity: 0.7, fontStyle: 'italic' }}>
                                        "{activeVocab.exampleSentence}"
                                    </div>
                                )}
                            </div>
                        ) : state.activeTimedItem.passageText ? (
                            <div style={{ color: 'white', textAlign: 'center', fontSize: '1.2rem', lineHeight: '1.6' }}>
                                {state.activeTimedItem.passageText}
                            </div>
                        ) : null}
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            <div style={{ margin: '0.75rem 0 0.5rem', position: 'relative' }}>
                <div
                    onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const pct = (e.clientX - rect.left) / rect.width;
                        seek(pct * state.duration);
                    }}
                    style={{
                        height: '6px',
                        background: 'var(--color-bg-card)',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        position: 'relative',
                    }}
                >
                    <div style={{
                        height: '100%',
                        width: `${progressPct}%`,
                        background: 'var(--color-accent-blue)',
                        borderRadius: '3px',
                        transition: 'width 0.1s linear',
                    }} />

                    {/* Timestamp Markers */}
                    {videoContent.timedItems.map(item => (
                        <div
                            key={item.id}
                            style={{
                                position: 'absolute',
                                left: `${(item.timestamp.startTime / state.duration) * 100}%`,
                                top: '-2px',
                                width: '4px',
                                height: '10px',
                                background: '#9ECA3B',
                                borderRadius: '2px',
                            }}
                        />
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    <span>{formatTime(state.currentTime)}</span>
                    <span>{formatTime(state.duration)}</span>
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                <button
                    onClick={reset}
                    style={{
                        background: 'transparent',
                        border: '1px solid var(--color-text-muted)',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        color: 'var(--color-text-primary)',
                    }}
                    title={t({ en: 'Reset', zh: '重置' })}
                >
                    &#x21BA;
                </button>

                <button
                    onClick={state.isPlaying ? pause : play}
                    style={{
                        background: 'var(--color-accent-blue)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '48px',
                        height: '48px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        color: 'white',
                    }}
                >
                    {state.isPlaying ? '\u23F8' : '\u25B6'}
                </button>
            </div>

            {/* Vocab List Below Player */}
            {vocabItems.length > 0 && (
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--color-text-muted)', paddingTop: '1rem' }}>
                    <h4 style={{ color: 'var(--color-text-secondary)', marginBottom: '0.75rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {t({ en: 'Vocabulary', zh: '詞彙' })}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {vocabItems.map(v => (
                            <div key={v.id} style={{
                                padding: '0.6rem 0.8rem',
                                borderRadius: '8px',
                                background: activeVocab?.id === v.id ? 'rgba(158, 202, 59, 0.15)' : 'var(--color-bg-card)',
                                border: activeVocab?.id === v.id ? '1px solid #9ECA3B' : '1px solid transparent',
                                transition: 'all 0.3s',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                    <strong>{v.word}</strong>
                                    {v.pinyin && <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{v.pinyin}</span>}
                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>{v.partOfSpeech}</span>
                                </div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>{v.definition}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
