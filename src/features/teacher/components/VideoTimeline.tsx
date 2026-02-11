import React, { useState, useRef } from 'react';
import type { TimedContentItem, VocabItem, VideoContent } from '../../../models/lessonPlan';
import { useLanguage } from '../../language/LanguageContext';

interface VideoTimelineProps {
    videoContent: VideoContent;
    vocabItems: VocabItem[];
    onTimedItemsChange: (items: TimedContentItem[]) => void;
}

export const VideoTimeline: React.FC<VideoTimelineProps> = ({ videoContent, vocabItems, onTimedItemsChange }) => {
    const { t } = useLanguage();
    const timelineRef = useRef<HTMLDivElement>(null);
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
    const videoPreviewRef = useRef<HTMLVideoElement>(null);

    const { duration, timedItems } = videoContent;

    const getTimePosition = (clientX: number): number => {
        if (!timelineRef.current) return 0;
        const rect = timelineRef.current.getBoundingClientRect();
        const fraction = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        return Math.round(fraction * duration * 100) / 100;
    };

    const handleTimelineClick = (e: React.MouseEvent) => {
        if (draggingId) return;
        const time = getTimePosition(e.clientX);

        // Find unassigned vocab item to place
        const assignedIds = new Set(timedItems.filter(ti => ti.vocabItemId).map(ti => ti.vocabItemId));
        const nextVocab = vocabItems.find(v => !assignedIds.has(v.id));

        if (!nextVocab) return;

        const newItem: TimedContentItem = {
            id: `ti-${Date.now()}`,
            type: 'vocab',
            timestamp: {
                startTime: time,
                endTime: Math.min(time + 3, duration),
                pauseDuration: 2,
            },
            vocabItemId: nextVocab.id,
            displayConfig: { pauseDurationMs: 2000 },
        };

        onTimedItemsChange([...timedItems, newItem]);
    };

    const handleDragStart = (itemId: string) => {
        setDraggingId(itemId);
    };

    const handleDragMove = (e: React.MouseEvent) => {
        if (!draggingId) return;
        const time = getTimePosition(e.clientX);
        const updated = timedItems.map(item => {
            if (item.id !== draggingId) return item;
            const itemDuration = item.timestamp.endTime - item.timestamp.startTime;
            return {
                ...item,
                timestamp: {
                    ...item.timestamp,
                    startTime: Math.max(0, time),
                    endTime: Math.min(time + itemDuration, duration),
                },
            };
        });
        onTimedItemsChange(updated);
    };

    const handleDragEnd = () => {
        setDraggingId(null);
    };

    const removeTimedItem = (itemId: string) => {
        onTimedItemsChange(timedItems.filter(i => i.id !== itemId));
    };

    const togglePreview = () => {
        if (!videoPreviewRef.current) return;
        if (isPreviewPlaying) {
            videoPreviewRef.current.pause();
            setIsPreviewPlaying(false);
        } else {
            videoPreviewRef.current.currentTime = 0;
            videoPreviewRef.current.play();
            setIsPreviewPlaying(true);
        }
    };

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{ padding: '1rem' }}>
            <h4 style={{ marginBottom: '1rem', fontWeight: '400' }}>
                {t({ en: 'Video Timeline Editor', zh: '影片時間軸編輯器' })}
            </h4>

            {/* Video Preview */}
            {videoContent.videoUrl && (
                <div style={{ marginBottom: '1rem' }}>
                    <video
                        ref={videoPreviewRef}
                        src={videoContent.videoUrl}
                        style={{ width: '100%', maxHeight: '200px', borderRadius: '8px', background: '#000' }}
                        onEnded={() => setIsPreviewPlaying(false)}
                    />
                    <button
                        onClick={togglePreview}
                        style={{
                            marginTop: '0.5rem',
                            background: 'transparent',
                            border: '1px solid var(--color-text-muted)',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                        }}
                    >
                        {isPreviewPlaying
                            ? t({ en: 'Pause Preview', zh: '暫停預覽' })
                            : t({ en: 'Play Preview', zh: '播放預覽' })}
                    </button>
                </div>
            )}

            {/* Timeline Bar */}
            <div
                ref={timelineRef}
                onClick={handleTimelineClick}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                style={{
                    position: 'relative',
                    height: '60px',
                    background: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border-scratch)',
                    borderRadius: '8px',
                    cursor: 'crosshair',
                    overflow: 'hidden',
                    marginBottom: '1rem',
                }}
            >
                {/* Time markers */}
                {Array.from({ length: Math.ceil(duration / 10) + 1 }, (_, i) => i * 10).map(s => (
                    <div key={s} style={{
                        position: 'absolute',
                        left: `${(s / duration) * 100}%`,
                        top: 0,
                        bottom: 0,
                        borderLeft: '1px solid var(--color-text-muted)',
                        opacity: 0.3,
                    }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', position: 'absolute', top: '2px', left: '2px' }}>
                            {formatTime(s)}
                        </span>
                    </div>
                ))}

                {/* Timed Item Markers */}
                {timedItems.map(item => {
                    const vocab = vocabItems.find(v => v.id === item.vocabItemId);
                    const leftPct = (item.timestamp.startTime / duration) * 100;
                    const widthPct = ((item.timestamp.endTime - item.timestamp.startTime) / duration) * 100;

                    return (
                        <div
                            key={item.id}
                            onMouseDown={(e) => { e.stopPropagation(); handleDragStart(item.id); }}
                            style={{
                                position: 'absolute',
                                left: `${leftPct}%`,
                                width: `${Math.max(widthPct, 1)}%`,
                                top: '15px',
                                height: '30px',
                                background: draggingId === item.id ? '#9ECA3B' : 'var(--color-accent-blue)',
                                borderRadius: '4px',
                                cursor: 'grab',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.7rem',
                                color: 'white',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                padding: '0 4px',
                                userSelect: 'none',
                            }}
                        >
                            {vocab?.word || item.type}
                        </div>
                    );
                })}
            </div>

            {/* Item List */}
            <div style={{ fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                    <span>{t({ en: 'Timed Items', zh: '定時項目' })} ({timedItems.length})</span>
                    <span>{t({ en: 'Click timeline to add vocab', zh: '點擊時間軸以新增詞彙' })}</span>
                </div>

                {timedItems.length === 0 && (
                    <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>
                        {t({ en: 'No timed items yet. Click on the timeline to add vocabulary markers.', zh: '尚無定時項目。點擊時間軸新增詞彙標記。' })}
                    </p>
                )}

                {timedItems.map(item => {
                    const vocab = vocabItems.find(v => v.id === item.vocabItemId);
                    return (
                        <div key={item.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.4rem 0.6rem',
                            borderBottom: '1px solid var(--color-border-scratch)',
                        }}>
                            <span>
                                <strong>{vocab?.word || 'Passage'}</strong>
                                {' '}
                                <span style={{ color: 'var(--color-text-muted)' }}>
                                    {formatTime(item.timestamp.startTime)} - {formatTime(item.timestamp.endTime)}
                                </span>
                            </span>
                            <button
                                onClick={() => removeTimedItem(item.id)}
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#e74c3c', fontSize: '0.8rem' }}
                            >
                                {t({ en: 'Remove', zh: '移除' })}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
