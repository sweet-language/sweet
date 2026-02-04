import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../language/LanguageContext';
import { LanguageToggle } from '../language/LanguageToggle';

export const ContactPage: React.FC = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock submission
        setTimeout(() => {
            setSubmitted(true);
        }, 1000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    if (submitted) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#f9f9f9',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                textAlign: 'center'
            }}>
                <div style={{ animation: 'fadeIn 0.5s' }}>
                    <h2 style={{ fontSize: '2.5rem', color: '#9ECA3B', marginBottom: '1rem' }}>
                        {t({ en: 'Message Sent!', zh: '訊息已發送！' })}
                    </h2>
                    <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
                        {t({ en: 'Thank you for reaching out. We will get back to you shortly.', zh: '感謝您的聯繫。我們將盡快回覆您。' })}
                    </p>
                    <button onClick={() => navigate('/')} className="btn-primary">
                        {t({ en: 'Return Home', zh: '返回首頁' })}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#1a1918', // Dark background for premium feel
            color: '#f0f0f0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '4rem 2rem',
            position: 'relative'
        }}>
            {/* Navigation & Tools */}
            <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
                <Link to="/" style={{ textDecoration: 'none', color: '#9ECA3B', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    ← {t({ en: 'Back', zh: '返回' })}
                </Link>
            </div>
            <div style={{ position: 'absolute', top: '2rem', right: '2rem' }}>
                <LanguageToggle variant="dark" />
            </div>

            <div style={{ maxWidth: '600px', width: '100%', marginTop: '4rem' }}>
                <h1 className="scratch-text" style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>
                    {t({ en: 'Contact Us', zh: '聯絡我們' })}
                </h1>
                <p style={{ textAlign: 'center', color: '#aaa', marginBottom: '3rem', fontSize: '1.2rem' }}>
                    {t({ en: 'We\'d love to hear from you.', zh: '我們很樂意聽取您的意見。' })}
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9ECA3B', fontSize: '0.9rem' }}>
                            {t({ en: 'Name', zh: '姓名' })}
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid #333',
                                padding: '1rem',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                            placeholder={t({ en: 'Your Name', zh: '您的姓名' })}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9ECA3B', fontSize: '0.9rem' }}>
                            {t({ en: 'Email', zh: '電子郵件' })}
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid #333',
                                padding: '1rem',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                            placeholder="name@example.com"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9ECA3B', fontSize: '0.9rem' }}>
                            {t({ en: 'Subject', zh: '主旨' })}
                        </label>
                        <input
                            type="text"
                            name="subject"
                            required
                            value={formData.subject}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid #333',
                                padding: '1rem',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                            placeholder={t({ en: 'How can we help?', zh: '我們能如何協助您？' })}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9ECA3B', fontSize: '0.9rem' }}>
                            {t({ en: 'Message', zh: '訊息內容' })}
                        </label>
                        <textarea
                            name="message"
                            required
                            rows={6}
                            value={formData.message}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid #333',
                                padding: '1rem',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none',
                                resize: 'vertical'
                            }}
                            placeholder={t({ en: 'Write your message here...', zh: '請在此輸入您的訊息...' })}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            backgroundColor: '#9ECA3B',
                            color: '#1a1918',
                            padding: '1.2rem',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            marginTop: '1rem',
                            transition: 'transform 0.1s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {t({ en: 'Send Message', zh: '發送訊息' })}
                    </button>
                </form>
            </div>
        </div>
    );
};
