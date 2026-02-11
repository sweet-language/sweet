import { useState, useRef, useCallback, useEffect } from 'react';
import type { TimedContentItem } from '../models/lessonPlan';

export interface VideoPlayerState {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    activeTimedItem: TimedContentItem | null;
    isPausedForContent: boolean;
}

export function useVideoPlayer(timedItems: TimedContentItem[]) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const triggeredRef = useRef<Set<string>>(new Set());
    const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [state, setState] = useState<VideoPlayerState>({
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        activeTimedItem: null,
        isPausedForContent: false,
    });

    // Sort timed items by start time for efficient lookup
    const sortedItems = [...timedItems].sort(
        (a, b) => a.timestamp.startTime - b.timestamp.startTime
    );

    const bindVideoElement = useCallback((el: HTMLVideoElement | null) => {
        videoRef.current = el;

        if (!el) return;

        el.onloadedmetadata = () => {
            setState(prev => ({ ...prev, duration: el.duration }));
        };

        el.onplay = () => {
            setState(prev => ({ ...prev, isPlaying: true }));
        };

        el.onpause = () => {
            setState(prev => ({
                ...prev,
                isPlaying: prev.isPausedForContent ? prev.isPlaying : false,
            }));
        };

        el.onended = () => {
            setState(prev => ({
                ...prev,
                isPlaying: false,
                activeTimedItem: null,
                isPausedForContent: false,
            }));
        };

        el.ontimeupdate = () => {
            const currentTime = el.currentTime;
            setState(prev => ({ ...prev, currentTime }));

            // Check if we hit a timed item
            for (const item of sortedItems) {
                if (triggeredRef.current.has(item.id)) continue;

                if (
                    currentTime >= item.timestamp.startTime &&
                    currentTime <= item.timestamp.endTime
                ) {
                    // Trigger pause for this item
                    triggeredRef.current.add(item.id);
                    el.pause();

                    setState(prev => ({
                        ...prev,
                        activeTimedItem: item,
                        isPausedForContent: true,
                    }));

                    const pauseMs = item.displayConfig.pauseDurationMs || 2000;

                    pauseTimerRef.current = setTimeout(() => {
                        setState(prev => ({
                            ...prev,
                            activeTimedItem: null,
                            isPausedForContent: false,
                        }));
                        el.play();
                    }, pauseMs);

                    break; // Only trigger one item at a time
                }
            }
        };

        // Handle seeking backward: reset triggered items after seek point
        el.onseeked = () => {
            const seekTime = el.currentTime;
            const newTriggered = new Set<string>();
            for (const id of triggeredRef.current) {
                const item = sortedItems.find(i => i.id === id);
                if (item && item.timestamp.startTime < seekTime) {
                    newTriggered.add(id);
                }
            }
            triggeredRef.current = newTriggered;
        };
    }, [sortedItems]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (pauseTimerRef.current) {
                clearTimeout(pauseTimerRef.current);
            }
        };
    }, []);

    const play = useCallback(() => {
        videoRef.current?.play();
    }, []);

    const pause = useCallback(() => {
        if (pauseTimerRef.current) {
            clearTimeout(pauseTimerRef.current);
            pauseTimerRef.current = null;
        }
        videoRef.current?.pause();
        setState(prev => ({
            ...prev,
            isPlaying: false,
            isPausedForContent: false,
            activeTimedItem: null,
        }));
    }, []);

    const seek = useCallback((time: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime = time;
        }
    }, []);

    const reset = useCallback(() => {
        triggeredRef.current.clear();
        if (pauseTimerRef.current) {
            clearTimeout(pauseTimerRef.current);
            pauseTimerRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.pause();
        }
        setState({
            isPlaying: false,
            currentTime: 0,
            duration: state.duration,
            activeTimedItem: null,
            isPausedForContent: false,
        });
    }, [state.duration]);

    return { state, bindVideoElement, play, pause, seek, reset };
}
