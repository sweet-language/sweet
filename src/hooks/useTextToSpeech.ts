import { useState, useEffect, useCallback, useRef } from 'react';

export const useTextToSpeech = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [supported, setSupported] = useState(false);
    const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
    const resumeTimerRef = useRef<number | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            setSupported(true);

            const loadVoices = () => {
                const available = window.speechSynthesis.getVoices();
                voicesRef.current = available;
            };

            loadVoices();
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => {
            if (resumeTimerRef.current) clearInterval(resumeTimerRef.current);
        };
    }, []);

    const getVoices = () => {
        if (voicesRef.current.length === 0) {
            voicesRef.current = window.speechSynthesis.getVoices();
        }
        return voicesRef.current;
    };

    const speak = useCallback((text: string, lang: 'en' | 'zh-TW' | 'zh-CN' = 'en') => {
        if (!supported || !text) return;

        // Cancel any current speech
        window.speechSynthesis.cancel();
        if (resumeTimerRef.current) {
            clearInterval(resumeTimerRef.current);
            resumeTimerRef.current = null;
        }

        const voices = getVoices();
        const utterance = new SpeechSynthesisUtterance(text);

        let selectedVoice = null;
        if (lang === 'en') {
            selectedVoice = voices.find(v => v.name.includes('Google US English'))
                || voices.find(v => v.name.includes('Samantha'))
                || voices.find(v => v.lang.startsWith('en'));
            utterance.lang = 'en-US';
        } else if (lang === 'zh-TW') {
            selectedVoice = voices.find(v => v.lang === 'zh-TW' && v.name.includes('Google'))
                || voices.find(v => v.lang === 'zh-TW');
            utterance.lang = 'zh-TW';
        } else if (lang === 'zh-CN') {
            selectedVoice = voices.find(v => v.lang === 'zh-CN' && v.name.includes('Google'))
                || voices.find(v => v.lang === 'zh-CN');
            utterance.lang = 'zh-CN';
        }

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onstart = () => {
            setIsSpeaking(true);
            // Chrome bug workaround: Chrome pauses speech after ~15s
            // Periodically call resume() to keep it going
            resumeTimerRef.current = window.setInterval(() => {
                if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
                    window.speechSynthesis.pause();
                    window.speechSynthesis.resume();
                }
            }, 10000);
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            if (resumeTimerRef.current) {
                clearInterval(resumeTimerRef.current);
                resumeTimerRef.current = null;
            }
        };

        utterance.onerror = (e) => {
            // Ignore 'interrupted' errors from cancel()
            if (e.error !== 'interrupted') {
                console.warn('TTS error:', e.error);
            }
            setIsSpeaking(false);
            if (resumeTimerRef.current) {
                clearInterval(resumeTimerRef.current);
                resumeTimerRef.current = null;
            }
        };

        // Small delay to ensure cancel() has fully cleared
        setTimeout(() => {
            window.speechSynthesis.speak(utterance);
        }, 50);
    }, [supported]);

    const cancel = useCallback(() => {
        if (!supported) return;
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        if (resumeTimerRef.current) {
            clearInterval(resumeTimerRef.current);
            resumeTimerRef.current = null;
        }
    }, [supported]);

    return { speak, cancel, isSpeaking, supported };
};
