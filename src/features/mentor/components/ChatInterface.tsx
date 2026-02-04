import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../language/LanguageContext';
import { useAuth } from '../../auth/AuthContext';
import { LucideSend, LucideMic, LucideX } from 'lucide-react';
import { aiService, type ChatMessage } from '../../../services/aiService';

interface ChatInterfaceProps {
    onClose: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onClose }) => {
    const { t, language } = useLanguage();
    const { user } = useAuth();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', role: 'ai', text: t({ en: `Hi ${user?.id || 'there'}, what can I help you with?`, zh: `嗨 ${user?.id || '你好'}，我能幫你什麼？` }) }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    useEffect(() => {
        const loadVoices = () => {
            const available = window.speechSynthesis.getVoices();
            setVoices(available);
        };

        loadVoices();

        // Chrome requires this event listener
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    const getBestVoice = (lang: string) => {
        const targetLang = lang === 'en' ? 'en-US' : (lang === 'zh-TW' ? 'zh-TW' : 'zh-CN');

        // Filter by language first
        const langVoices = voices.filter(v => v.lang.includes(targetLang) || v.lang.includes(lang));

        if (langVoices.length === 0) return null;

        // Priority 1: Google Voices (usually high quality on Chrome)
        const googleVoice = langVoices.find(v => v.name.includes('Google'));
        if (googleVoice) return googleVoice;

        // Priority 2: "Microsoft" or "Natural" (Edge/Windows)
        const naturalVoice = langVoices.find(v => v.name.includes('Natural') || v.name.includes('Microsoft'));
        if (naturalVoice) return naturalVoice;

        // Priority 3: Default/First available
        return langVoices[0];
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
        const updatedHistory = [...messages, userMsg];

        setMessages(updatedHistory);
        setInput('');
        setIsTyping(true);

        try {
            const responseText = await aiService.chatWithMentor(updatedHistory, language);
            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                text: responseText
            };
            setMessages(prev => [...prev, aiMsg]);

            // Text-to-Speech
            const utterance = new SpeechSynthesisUtterance(responseText);
            utterance.lang = language === 'en' ? 'en-US' : 'zh-TW';

            // Apply best voice
            const bestVoice = getBestVoice(language);
            if (bestVoice) {
                utterance.voice = bestVoice;
                // Slight pitch/rate tweaks for character
                utterance.pitch = 1.1;
                utterance.rate = 1.0;
            }

            window.speechSynthesis.speak(utterance);


        } catch (error) {
            console.error("Chat error:", error);
        } finally {
            setIsTyping(false);
        }
    };

    const handleMicClick = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Speech recognition is not supported in this browser.');
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = language === 'en' ? 'en-US' : 'zh-TW';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(prev => prev + (prev ? ' ' : '') + transcript);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    return (
        <div className="scratch-card" style={{
            width: '350px',
            height: '500px',
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            bottom: '80px',
            right: '0',
            padding: '0',
            zIndex: 1000,
            backgroundColor: '#f9f9f9',
            borderRadius: '16px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.15)',
            border: '1px solid #e0e0e0',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{ padding: '1rem', borderBottom: '1px solid #eee', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: '#111' }}>
                    {t({ en: 'Elias', zh: 'Elias' })}
                </h3>
                <button
                    onClick={onClose}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#666',
                        padding: '0.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#111'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#666'}
                >
                    <LucideX size={20} />
                </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {messages.map(msg => (
                    <div key={msg.id} style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '80%',
                        background: msg.role === 'user' ? 'var(--color-accent-blue)' : '#ffffff',
                        border: msg.role === 'user' ? 'none' : '1px solid #e0e0e0',
                        color: msg.role === 'user' ? '#fff' : '#333',
                        padding: '0.5rem 1rem',
                        borderRadius: '12px',
                        borderBottomRightRadius: msg.role === 'user' ? '2px' : '12px',
                        borderBottomLeftRadius: msg.role === 'ai' ? '2px' : '12px',
                        fontSize: '0.9rem',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}>
                        {msg.text}
                    </div>
                ))}
                {isTyping && (
                    <div style={{ alignSelf: 'flex-start', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginLeft: '1rem' }}>
                        {t({ en: 'Elias is typing...', zh: 'Elias 正在輸入...' })}
                    </div>
                )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid #eee', display: 'flex', gap: '0.5rem', background: '#fff' }}>
                <button
                    type="button"
                    onClick={handleMicClick}
                    style={{
                        background: isListening ? 'var(--color-accent-red)' : '#f0f0f0',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: isListening ? 'white' : '#666',
                        transition: 'all 0.2s'
                    }}
                    title="Speak"
                >
                    <LucideMic size={18} />
                </button>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t({ en: 'Ask a question...', zh: '問個問題...' })}
                    style={{
                        flex: 1,
                        background: '#f0f0f0',
                        border: '1px solid transparent',
                        borderRadius: '20px',
                        padding: '0.5rem 1rem',
                        color: '#333',
                        fontFamily: 'var(--font-body)'
                    }}
                    disabled={isTyping || isListening}
                />
                <button type="submit" disabled={isTyping} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-accent-blue)', opacity: isTyping ? 0.5 : 1 }}>
                    <LucideSend size={20} />
                </button>
            </form>
        </div>
    );
};
