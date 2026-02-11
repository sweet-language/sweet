import React, { useEffect } from 'react';
import { useLanguage } from '../../language/LanguageContext';
import { useTextToSpeech } from '../../../hooks/useTextToSpeech';
import { useSpeechRecognition } from '../../../hooks/useSpeechRecognition';
import { LucidePlay, LucideMic, LucideSquare, LucideMicOff } from 'lucide-react';

interface AudioControlsProps {
    textToRead?: string;
}

export const AudioControls: React.FC<AudioControlsProps> = ({ textToRead = '' }) => {
    const { t, language } = useLanguage();
    const { speak, cancel, isSpeaking } = useTextToSpeech();
    const { startListening, stopListening, isListening, transcript, supported: sttSupported } = useSpeechRecognition();

    // Determine locale for TTS/STT
    const locale = language === 'en' ? 'en' : (language === 'zh-TW' ? 'zh-TW' : 'zh-CN');

    const handlePlay = () => {
        if (isSpeaking) {
            cancel();
        } else {
            speak(textToRead, locale);
        }
    };

    const handleMic = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening(locale);
        }
    };

    // Log transcript for demo purposes (in real app, compare with textToRead)
    useEffect(() => {
        if (transcript) {
            console.log('Shadowing Output:', transcript);
        }
    }, [transcript]);

    return (
        <div className="audio-controls-bar" style={{
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '1rem',
            background: 'rgba(5, 5, 5, 0.8)',
            backdropFilter: 'blur(10px)',
            padding: '1rem 2rem',
            borderRadius: '50px',
            border: '1px solid var(--color-text-muted)',
            boxShadow: '0 0 20px rgba(0,0,0,0.8)',
            zIndex: 100
        }}>
            <button
                onClick={handlePlay}
                title={isSpeaking ? "Stop" : "Play Text"}
                style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    border: '1px solid var(--color-accent-blue)',
                    background: isSpeaking ? 'var(--color-accent-blue)' : 'transparent',
                    color: isSpeaking ? '#000' : 'var(--color-accent-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                }}
            >
                {isSpeaking ? <LucideSquare size={20} fill="currentColor" /> : <LucidePlay size={24} fill="currentColor" />}
            </button>

            {sttSupported ? (
                <button
                    onClick={handleMic}
                    title={isListening ? "Stop Recording" : "Start Shadowing"}
                    style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        border: '1px solid var(--color-accent-gold)',
                        background: isListening ? 'var(--color-accent-gold)' : 'transparent',
                        color: isListening ? '#000' : 'var(--color-accent-gold)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        boxShadow: isListening ? '0 0 15px var(--color-accent-gold)' : 'none'
                    }}
                >
                    <LucideMic size={24} />
                </button>
            ) : (
                <div style={{ padding: '0.5rem', color: '#666' }} title="Speech Recognition not supported">
                    <LucideMicOff size={24} />
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-heading)' }}>
                    {isListening ? t({ en: 'Listening...', zh: '正在聆聽...' }) : (
                        transcript ? t({ en: 'Heard: ' + transcript.substring(0, 10) + '...', zh: '聽到：' + transcript.substring(0, 5) + '...' }) : t({ en: 'Shadow Mode', zh: '跟讀模式' })
                    )}
                </span>
            </div>
        </div>
    );
};
