import { useState, useEffect, useCallback } from 'react';

// Type definition for Web Speech API
interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    abort: () => void;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
    onend: () => void;
}

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export const useSpeechRecognition = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const reco = new SpeechRecognition();
                reco.continuous = false; // Stop after one sentence for shadowing
                reco.interimResults = true;
                setRecognition(reco);
            }
        }
    }, []);

    const startListening = useCallback((lang: 'en' | 'zh-TW' | 'zh-CN' = 'en') => {
        if (!recognition) return;

        // Map to specific locales
        if (lang === 'zh-TW') recognition.lang = 'cmn-Hant-TW'; // Mandarin Traditional
        else if (lang === 'zh-CN') recognition.lang = 'cmn-Hans-CN'; // Mandarin Simplified
        else recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    // interim logic if needed
                }
            }
            if (finalTranscript) setTranscript(finalTranscript);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        setTranscript('');
        recognition.start();
        setIsListening(true);
    }, [recognition]);

    const stopListening = useCallback(() => {
        if (recognition) {
            recognition.stop();
            setIsListening(false);
        }
    }, [recognition]);

    return { startListening, stopListening, isListening, transcript, supported: !!recognition };
};
