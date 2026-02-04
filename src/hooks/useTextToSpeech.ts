import { useState, useEffect, useCallback } from 'react';

export const useTextToSpeech = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [supported, setSupported] = useState(false);

    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            setSupported(true);

            const loadVoices = () => {
                const available = window.speechSynthesis.getVoices();
                setVoices(available);
            };

            loadVoices();
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    const speak = useCallback((text: string, lang: 'en' | 'zh-TW' | 'zh-CN' = 'en') => {
        if (!supported) return;

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Enhanced Voice Selection
        let selectedVoice = null;
        if (lang === 'en') {
            // Prefer Google US English or Premium voices
            selectedVoice = voices.find(v => v.name.includes('Google US English'))
                || voices.find(v => v.name.includes('Samantha'))
                || voices.find(v => v.lang.startsWith('en'));
            utterance.lang = 'en-US';
        } else if (lang === 'zh-TW') {
            // Prefer Google 國語 or Mei-Jia
            selectedVoice = voices.find(v => v.lang === 'zh-TW' && v.name.includes('Google'))
                || voices.find(v => v.lang === 'zh-TW');
            utterance.lang = 'zh-TW';
        } else if (lang === 'zh-CN') {
            // Prefer Google 普通话
            selectedVoice = voices.find(v => v.lang === 'zh-CN' && v.name.includes('Google'))
                || voices.find(v => v.lang === 'zh-CN');
            utterance.lang = 'zh-CN';
        }

        if (selectedVoice) {
            utterance.voice = selectedVoice;
            // Adjust rate/pitch slightly for typical "Storyteller" vibe if needed, 
            // but default is usually best for clarity.
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [supported, voices]);

    const cancel = useCallback(() => {
        if (!supported) return;
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }, [supported]);

    return { speak, cancel, isSpeaking, supported };
};
