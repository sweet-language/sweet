import React, { useState, useEffect } from 'react';
import { useLanguage } from '../language/LanguageContext';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { LanguageToggle } from '../language/LanguageToggle';

import puzzlePeopleImg from '../../assets/images/puzzle-people.png';
import studentSymbolImg from '../../assets/images/symbol-student-v5.png';
import teacherSymbolImg from '../../assets/images/symbol-teacher-v5.png';

export const LoginPage: React.FC = () => {
    const { t, language } = useLanguage();
    const { login } = useAuth();
    const navigate = useNavigate();

    // UI State
    const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Auto-switch language based on selected role for the Login Form
    // Auto-switch language based on selected role for the Login Form - REMOVED for Global State
    useEffect(() => {
        // Clear form when switching roles
        setUsername('');
        setPassword('');
        setError('');
    }, [selectedRole]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (selectedRole) {
            const result = login(username, password, selectedRole);

            if (result.success) {
                // Auto-switch language based on role
                // Auto-switch language based on role - REMOVED for Global State

                navigate('/dashboard');
            } else {
                setError(result.error || 'Login failed');
            }
        }
    };

    if (!selectedRole) {
        return (
            <>
                <style>{`
                    @keyframes blink {
                        0% { opacity: 1; transform: translateY(0); }
                        50% { opacity: 0.4; transform: translateY(5px); }
                        100% { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes sparkle {
                        0%, 100% { opacity: 0.8; filter: drop-shadow(0 0 2px rgba(181, 227, 82, 0.3)); }
                        50% { opacity: 1; filter: drop-shadow(0 0 8px rgba(181, 227, 82, 0.8)); }
                    }
                    @keyframes twinkle {
                        0%, 100% { opacity: 0.2; transform: scale(1); }
                        50% { opacity: 1; transform: scale(1.2); }
                    }
                    @keyframes textGlow {
                        0%, 100% { filter: drop-shadow(0 0 2px rgba(181, 227, 82, 0.4)); }
                        50% { filter: drop-shadow(0 0 8px rgba(181, 227, 82, 0.7)); }
                    }
                    @keyframes darkGlow {
                        0%, 100% { filter: drop-shadow(0 0 2px rgba(0,0,0, 0.2)); }
                        50% { filter: drop-shadow(0 0 10px rgba(0,0,0, 0.5)); }
                    }
                    .blink-arrow {
                        animation: blink 2s infinite ease-in-out;
                    }
                    html { scroll-behavior: smooth; }
                `}</style>

                {/* --- Section 1: Hero (Off-Black) --- */}
                <div style={{
                    height: '100vh',
                    width: '100%',
                    backgroundColor: '#1a1918',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start', // Move content up
                    alignItems: 'center',
                    position: 'relative',
                    paddingTop: '15vh', // Push down slightly from top
                    overflow: 'hidden' // Keep stars contained
                }}>
                    {/* Stars / Glow Effects - Randomized & Clustered */}
                    {[
                        // Near Logo (Center-ish)
                        { top: '15%', left: '35%', size: '3px', delay: '0.5s', color: '#B5E352' }, // Lime
                        { top: '10%', left: '55%', size: '2px', delay: '2.5s', color: 'white' },
                        { top: '22%', left: '62%', size: '2px', delay: '1.2s', color: 'white' },

                        // Top & Left Drifting
                        { top: '5%', left: '8%', size: '3px', delay: '0s', color: 'white' },
                        { top: '28%', left: '15%', size: '2px', delay: '3.5s', color: '#B5E352' }, // Lime
                        { top: '8%', left: '85%', size: '2px', delay: '1.8s', color: 'white' },

                        // Scattered / Organic Feel
                        { top: '42%', left: '12%', size: '3px', delay: '2.2s', color: '#B5E352' }, // Lime
                        { top: '55%', left: '92%', size: '2px', delay: '4.1s', color: 'white' },
                        { top: '68%', left: '25%', size: '3px', delay: '0.8s', color: 'white' },
                        { top: '38%', left: '75%', size: '2px', delay: '3.0s', color: '#B5E352' }, // Lime

                        // Deep Space
                        { top: '18%', left: '94%', size: '2px', delay: '1.0s', color: '#B5E352' }, // Lime
                        { top: '75%', left: '5%', size: '4px', delay: '2.8s', color: '#B5E352' }, // Lime
                        { top: '62%', left: '45%', size: '2px', delay: '1.5s', color: 'white' },
                        { top: '88%', left: '80%', size: '3px', delay: '3.2s', color: 'white' },

                        // Bottom Anchors
                        { top: '92%', left: '15%', size: '2px', delay: '2.0s', color: '#B5E352' }, // Lime
                        { top: '85%', left: '58%', size: '2px', delay: '0.2s', color: 'white' },
                    ].map((star, i) => (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                top: star.top,
                                left: star.left,
                                width: star.size,
                                height: star.size,
                                borderRadius: '50%',
                                backgroundColor: star.color,
                                boxShadow: `0 0 8px 2px ${star.color === 'white' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(181, 227, 82, 0.6)'}`,
                                animation: `twinkle ${3 + Math.random()}s infinite ease-in-out`,
                                animationDelay: star.delay
                            }}
                        />
                    ))}

                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}>
                        {/* Toggle is already dark-text optimized, so we invert it for dark background */}
                        <div style={{ filter: 'invert(1) brightness(2)' }}>
                            <LanguageToggle />
                        </div>
                    </div>

                    {/* Logo (Inverted Colors for Dark Mode) */}
                    <div className="login-hero" style={{ marginBottom: '2rem', width: '100%', maxWidth: '500px', padding: '0 1rem' }}>
                        <svg width="100%" height="auto" viewBox="0 0 500 200" style={{ overflow: 'visible', maxWidth: '500px' }}>
                            <defs>
                                <path id="curveSweet" d="M 50,120 Q 250,20 450,120" />
                                <path id="curveTagline" d="M 70,130 Q 250,55 430,130" />
                            </defs>
                            <g stroke="#B5E352" fill="none" strokeLinecap="round" opacity="1" transform="rotate(-15, 115, 75)" style={{ animation: 'sparkle 4s infinite ease-in-out' }}>
                                <path d="M 55,80 Q 95,60 130,53" strokeWidth="2" strokeDasharray="1 8 4 6 2 5" strokeLinecap="round" />
                                <path d="M 25,105 Q 75,75 127,65" strokeWidth="4" />
                                <path d="M 75,95 Q 100,85 125,77" strokeWidth="3" strokeDasharray="0.5 10 2 8" strokeLinecap="round" />
                                <path d="M 45,120 Q 85,100 123,89" strokeWidth="2" />
                            </g>
                            <path
                                d="M 405,140 Q 630,300 450,480"
                                stroke="#f0f0f0"
                                strokeWidth="1"
                                fill="none"
                                strokeLinecap="round"
                                opacity="0.4"
                                strokeDasharray="300 12 1 12 1 12 1 12 1 12 1 12 1 12 1 12 1 12"
                            />
                            <text>
                                <textPath href="#curveSweet" startOffset="50%" textAnchor="middle" style={{ fontSize: '5rem', fontWeight: '900', fill: '#B5E352', fontFamily: 'var(--font-heading, sans-serif)', animation: 'textGlow 6s infinite ease-in-out' }}>
                                    {t({ en: 'sweet!', zh: 'sweet!' })}
                                </textPath>
                            </text>
                            <text>
                                <textPath href="#curveTagline" startOffset="50%" textAnchor="middle" style={{ fontSize: language === 'en' ? '1rem' : '1.3rem', fill: '#cccccc', fontStyle: 'italic', fontFamily: 'var(--font-body, sans-serif)', letterSpacing: '0.05em' }}>
                                    {t({ en: 'communicate with the world', zh: '與世界溝通' })}
                                </textPath>
                            </text>
                        </svg>
                    </div>

                    {/* Hero Puzzle Image */}
                    <div style={{ marginBottom: '2rem', width: '100%', display: 'flex', justifyContent: 'center', padding: '0 1rem' }}>
                        <img
                            src={puzzlePeopleImg}
                            alt="Join us"
                            style={{
                                maxWidth: '400px',
                                width: '80%',
                                objectFit: 'contain',
                                filter: 'invert(1)',
                                mixBlendMode: 'screen'
                            }}
                        />
                    </div>

                    {/* Scroll Indicator */}
                    <div
                        className="blink-arrow"
                        style={{
                            position: 'absolute',
                            bottom: '3rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            color: '#f0f0f0',
                            cursor: 'pointer',
                            opacity: 0.5 // 50% transparent
                        }}
                        onClick={() => document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        <p style={{ fontSize: '3rem', margin: 0, lineHeight: 1, transform: 'scaleX(2)' }}>↓</p>
                    </div>
                </div>

                {/* --- Section 2: Login/Signup (White) --- */}
                <div id="login-section" style={{
                    minHeight: '100vh',
                    backgroundColor: '#9ECA3B', // Slightly darker lime
                    color: '#1a1918',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4rem 2rem',
                    position: 'relative' // Added for absolute positioning of logo
                }}>



                    {/* Scattered Stars (Black & White) */}
                    {[
                        { top: '15%', left: '10%', size: '3px', delay: '0.5s', color: 'black' },
                        { top: '25%', left: '85%', size: '2px', delay: '1.2s', color: 'white' },
                        { top: '65%', left: '15%', size: '3px', delay: '2.5s', color: 'black' },
                        { top: '80%', left: '80%', size: '2px', delay: '0.8s', color: 'white' },
                        { top: '40%', left: '90%', size: '3px', delay: '1.8s', color: 'black' },
                        { top: '10%', left: '50%', size: '2px', delay: '3.0s', color: 'white' },
                        // Added more
                        { top: '55%', left: '5%', size: '2px', delay: '1.5s', color: 'white' },
                        { top: '35%', left: '25%', size: '3px', delay: '2.0s', color: 'black' },
                        { top: '90%', left: '40%', size: '2px', delay: '0.2s', color: 'white' },
                        { top: '70%', left: '95%', size: '3px', delay: '2.8s', color: 'black' },
                        { top: '20%', left: '70%', size: '2px', delay: '1.0s', color: 'black' },
                        { top: '50%', left: '60%', size: '3px', delay: '3.5s', color: 'white' },
                    ].map((star, i) => (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                top: star.top,
                                left: star.left,
                                width: star.size,
                                height: star.size,
                                borderRadius: '50%',
                                backgroundColor: star.color,
                                boxShadow: `0 0 8px 2px ${star.color === 'white' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)'}`,
                                animation: `twinkle ${3 + Math.random()}s infinite ease-in-out`,
                                animationDelay: star.delay,
                                zIndex: 0
                            }}
                        />
                    ))}



                    {/* Role Selection Title */}
                    <div style={{ marginBottom: '-1rem', zIndex: 1, textAlign: 'center', width: '100%', maxWidth: '500px', padding: '0 1rem' }}>
                        <svg width="100%" height="auto" viewBox="0 0 500 120" style={{ overflow: 'visible', maxWidth: '500px' }}>
                            {/* Gentle arch curve */}
                            <path id="curveRole" d="M 50,100 Q 250,20 450,100" fill="none" stroke="none" />
                            <text>
                                <textPath
                                    href="#curveRole"
                                    startOffset="50%"
                                    textAnchor="middle"
                                    style={{
                                        fontSize: '2rem',
                                        fontWeight: '500',
                                        fill: '#000000',
                                        fontFamily: 'sans-serif',
                                        letterSpacing: '0.05em',
                                        animation: 'darkGlow 3s infinite ease-in-out'
                                    }}
                                >
                                    {t({ en: 'whom are you?', zh: '你是誰？' })}
                                </textPath>
                            </text>
                        </svg>
                    </div>

                    <div style={{ display: 'flex', gap: '4rem', justifyContent: 'center', flexWrap: 'wrap', paddingBottom: '4rem' }}>

                        {/* Student Option */}
                        <button
                            onClick={() => setSelectedRole('student')}
                            style={{
                                background: '#9ECA3B',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '2rem',
                                transition: 'transform 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img
                                    src={studentSymbolImg}
                                    alt="Student"
                                    style={{
                                        width: '100px', height: '100px', objectFit: 'contain',
                                        mixBlendMode: 'multiply'
                                    }}
                                />
                            </div>
                            <span style={{ fontSize: '1.5rem', fontWeight: '300', color: '#000000' }}>{t({ en: 'Student', zh: '學生' })}</span>
                        </button>

                        {/* Teacher Option */}
                        <button
                            onClick={() => setSelectedRole('teacher')}
                            style={{
                                background: '#9ECA3B',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '2rem',
                                transition: 'transform 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img
                                    src={teacherSymbolImg}
                                    alt="Teacher"
                                    style={{
                                        width: '130px', height: '130px', objectFit: 'contain',
                                        transform: 'translateX(-22px)',
                                        mixBlendMode: 'multiply'
                                    }}
                                />
                            </div>
                            <span style={{ fontSize: '1.5rem', fontWeight: '300', color: '#000000' }}>{t({ en: 'Teacher', zh: '教師' })}</span>

                        </button>
                    </div>


                </div>

                {/* --- Section 3: About Us (Off-White) --- */}
                <div style={{
                    minHeight: '100vh',
                    backgroundColor: '#f9f9f9', // Off-white
                    color: '#1a1918', // Black text
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8rem 2rem 4rem 2rem', // Increased top padding to push content down
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden' // Keep stars contained
                }}>
                    {/* Glowing Stars (Black & Green) */}
                    {[
                        // Top Area
                        { top: '10%', left: '10%', size: '3px', delay: '0s', color: '#1a1918' },   // Black
                        { top: '15%', left: '85%', size: '4px', delay: '2s', color: '#9ECA3B' },   // Green
                        { top: '5%', left: '50%', size: '2px', delay: '1s', color: '#1a1918' },    // Black
                        { top: '25%', left: '25%', size: '3px', delay: '3s', color: '#9ECA3B' },   // Green

                        // Middle / Side Areas
                        { top: '40%', left: '5%', size: '3px', delay: '1.5s', color: '#9ECA3B' },  // Green
                        { top: '45%', left: '95%', size: '4px', delay: '0.5s', color: '#1a1918' }, // Black
                        { top: '60%', left: '15%', size: '2px', delay: '2.5s', color: '#1a1918' }, // Black
                        { top: '55%', left: '80%', size: '3px', delay: '3.5s', color: '#9ECA3B' }, // Green

                        // Bottom Area
                        { top: '80%', left: '10%', size: '4px', delay: '1s', color: '#1a1918' },   // Black
                        { top: '85%', left: '90%', size: '3px', delay: '2s', color: '#9ECA3B' },   // Green
                        { top: '90%', left: '40%', size: '2px', delay: '0s', color: '#1a1918' },    // Black
                        { top: '75%', left: '70%', size: '3px', delay: '1.5s', color: '#9ECA3B' }, // Green

                        // Extra Filler
                        { top: '20%', left: '60%', size: '2px', delay: '2.2s', color: '#1a1918' }, // Black
                        { top: '70%', left: '30%', size: '3px', delay: '0.8s', color: '#9ECA3B' }, // Green
                    ].map((star, i) => (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                top: star.top,
                                left: star.left,
                                width: star.size,
                                height: star.size,
                                borderRadius: '50%',
                                backgroundColor: star.color,
                                boxShadow: `0 0 8px 2px ${star.color === '#1a1918' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(158, 202, 59, 0.4)'}`,
                                animation: `twinkle ${3 + Math.random()}s infinite ease-in-out`,
                                animationDelay: star.delay,
                                zIndex: 1
                            }}
                        />
                    ))}


                    {/* Language Toggle - Top Right */}
                    <div style={{ position: 'absolute', top: '2rem', right: '2rem' }}>
                        <LanguageToggle />
                    </div>
                    <h2 style={{
                        fontSize: '3rem',
                        fontWeight: '500',
                        marginBottom: '2rem',
                        color: '#000000',
                        display: 'flex',
                        gap: '1rem',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'baseline',
                        fontFamily: 'Poppins, sans-serif'
                    }}>
                        <span style={{
                            backgroundColor: '#2c2c2c',
                            color: '#ffffff',
                            padding: '0rem 0.8rem 2rem 0.8rem',
                            display: 'inline-block'
                        }}>
                            {language === 'en' ? 'Whom' : '我們'}
                        </span>
                        <span style={{
                            display: 'inline-block'
                        }}>
                            <span style={{
                                display: 'inline-block',
                                position: 'relative'
                            }}>
                                <span style={{
                                    position: 'absolute',
                                    backgroundColor: '#1a1918',
                                    top: '0.5rem',
                                    left: '-0.15rem',
                                    right: '-0.15rem',
                                    bottom: '-0.15rem',
                                    zIndex: -1
                                }}></span>
                                <span style={{
                                    color: '#9ECA3B',
                                    position: 'relative',
                                    zIndex: 1
                                }}>
                                    {language === 'en' ? 'a' : '是'}
                                </span>
                            </span>
                            <span style={{
                                color: '#000000',
                                display: 'inline-block'
                            }}>
                                {language === 'en' ? 're' : ''}
                            </span>
                        </span>
                        <span style={{
                            backgroundColor: '#9ECA3B',
                            color: '#000000',
                            padding: '3rem 1rem',
                            display: 'inline-block'
                        }}>
                            {language === 'en' ? 'we?' : '誰？'}
                        </span>
                    </h2>
                    <p style={{
                        marginTop: '1rem',
                        fontSize: '1.8rem',
                        lineHeight: '1.8',
                        maxWidth: '800px',
                        fontWeight: '200',
                        color: '#4a4a4a',
                        fontFamily: 'Poppins, sans-serif'
                    }}>
                        {language === 'en' ? (
                            <>
                                We are a group of <span style={{ backgroundColor: '#666666', color: '#f9f9f9', padding: '0 0.4rem' }}>passionate</span> humans <span style={{ backgroundColor: '#666666', color: '#f9f9f9', padding: '0 0.4rem' }}>curious</span> about <span style={{ backgroundColor: '#666666', color: '#f9f9f9', padding: '0 0.4rem' }}>language</span>, <span style={{ backgroundColor: '#ebebeb', color: '#4a4a4a', padding: '0.5rem 1.2rem' }}>learning</span>, <span style={{ backgroundColor: '#9ECA3B', color: '#f9f9f9', padding: '0 0.4rem' }}>the mind</span> and <span style={{ backgroundColor: '#e0e0e0', color: '#000000', padding: '0 0.4rem' }}>the world</span> around us.
                            </>
                        ) : (
                            <>
                                我們是一群<span style={{ backgroundColor: '#666666', color: '#f9f9f9', padding: '0 0.4rem' }}>充滿熱情</span>對<span style={{ backgroundColor: '#666666', color: '#f9f9f9', padding: '0 0.4rem' }}>語言</span>、<span style={{ backgroundColor: '#ebebeb', color: '#4a4a4a', padding: '0.5rem 1.2rem' }}>學習</span>、<span style={{ backgroundColor: '#9ECA3B', color: '#f9f9f9', padding: '0 0.4rem' }}>心靈</span>和<span style={{ backgroundColor: '#e0e0e0', color: '#000000', padding: '0 0.4rem' }}>周遭世界</span>充滿<span style={{ backgroundColor: '#666666', color: '#f9f9f9', padding: '0 0.4rem' }}>好奇</span>的人類。
                            </>
                        )}
                    </p>



                    <div style={{ marginTop: '-3rem', marginBottom: '0' }}>
                        <img
                            src="/images/three_people.png?v=2"
                            alt="Three People"
                            style={{
                                width: '250px',
                                height: 'auto',
                                opacity: 0.8,
                                mixBlendMode: 'multiply'
                            }}
                        />
                    </div>

                    <div style={{
                        marginTop: '1rem', // Moved down slightly
                        marginBottom: '-25px', // Closer to image
                        height: '60px', // Taller for deep curve
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        zIndex: 3,
                        position: 'relative'
                    }}>
                        <svg width="200" height="60" viewBox="0 0 200 60" style={{ overflow: 'visible' }}>
                            <path id="curveInquiries" d="M 30,55 Q 100,0 170,55" fill="transparent" />
                            <text width="200" style={{ fontSize: '12px', fontFamily: 'Poppins, sans-serif', fill: '#666', letterSpacing: '0.05em', textShadow: '0 0 8px rgba(102, 102, 102, 0.6)' }}>
                                <textPath href="#curveInquiries" startOffset="50%" textAnchor="middle">
                                    {t({ en: 'inquiries', zh: '諮詢' })}
                                </textPath>
                            </text>
                        </svg>
                    </div>

                    <div
                        onClick={() => navigate('/contact')}
                        style={{
                            marginTop: '0',
                            cursor: 'pointer',
                            display: 'inline-block',
                            transition: 'transform 0.2s',
                            mixBlendMode: 'multiply' // Apply blend mode to container
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <img
                            src="/images/brain_bulb.png"
                            alt="Contact Us"
                            style={{
                                width: '80px',
                                height: 'auto',
                                opacity: 0.8
                            }}
                        />
                    </div>
                </div>
            </>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f9f9f9', // Off-white as requested
            color: '#333333',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            position: 'relative'
        }}>
            {/* Language Toggle - Top Right */}
            <div style={{ position: 'absolute', top: '2rem', right: '2rem' }}>
                <LanguageToggle />
            </div>


            <form
                key={selectedRole} // BRAND NEW FORM DOM
                onSubmit={handleLogin}
                autoComplete="off" // Disable browser intelligence
                style={{ width: '100%', maxWidth: '350px', display: 'flex', flexDirection: 'column', gap: '2rem' }}
            >
                {/* HONEYPOT FOR AUTOFILL: Trap browser's first attempt here */}
                <input type="text" name="fakeusernameremembered" style={{ display: 'none' }} />
                <input type="password" name="fakepasswordremembered" style={{ display: 'none' }} />

                <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#1a1918', fontSize: '2rem' }}>
                    {selectedRole === 'teacher'
                        ? t({ en: 'Teacher Login', zh: '教師登入' })
                        : t({ en: 'Student Login', zh: '學生登入' })}
                </h2>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                        {t({ en: 'Username', zh: '帳號' })}
                    </label>
                    <input
                        id={`${selectedRole}-username`}
                        name={`${selectedRole}-username`}
                        type="text"
                        required
                        value={username} // Controlled input
                        onChange={e => setUsername(e.target.value)}
                        autoComplete="off"
                        role="presentation" // Another hint to discourage managers
                        style={{
                            background: 'transparent',
                            border: 'none',
                            borderBottom: '1px solid var(--color-text-muted)',
                            color: '#000000',
                            width: '100%',
                            outline: 'none',
                            padding: '0.5rem 0',
                            fontSize: '1.1rem'
                        }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                        {t({ en: 'Password', zh: '密碼' })}
                    </label>
                    <input
                        id={`${selectedRole}-password`}
                        name={`${selectedRole}-password`}
                        type="password"
                        required
                        value={password} // Controlled input
                        onChange={e => setPassword(e.target.value)}
                        autoComplete="new-password" // "new-password" often stops autofill better than "off"
                        role="presentation"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            borderBottom: '1px solid var(--color-text-muted)',
                            color: 'var(--color-text-primary)',
                            width: '100%',
                            outline: 'none',
                            padding: '0.5rem 0',
                            fontSize: '1.1rem'
                        }}
                    />
                </div>

                {error && (
                    <div style={{ color: '#666666', fontSize: '0.9rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
                    {t({ en: 'Log In', zh: '登入' })}
                </button>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <button
                        onClick={() => navigate(selectedRole === 'student' ? '/signup?mode=onboarding' : '/signup?mode=teacher')}
                        style={{
                            background: '#1a1918',
                            color: '#f9f9f9',
                            border: 'none',
                            padding: '0.75rem 2rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            fontFamily: 'var(--font-heading)'
                        }}
                    >
                        {t({ en: 'Create an Account', zh: '建立帳號' })}
                    </button>
                </div>
            </form>

            <button
                onClick={() => setSelectedRole(null)}
                style={{
                    position: 'absolute',
                    bottom: '2rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#999',
                    cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                    const arrow = e.currentTarget.querySelector('.hover-arrow') as HTMLElement;
                    if (arrow) arrow.style.transform = 'translateX(-8px)';
                }}
                onMouseLeave={(e) => {
                    const arrow = e.currentTarget.querySelector('.hover-arrow') as HTMLElement;
                    if (arrow) arrow.style.transform = 'translateX(0)';
                }}
            >
                <span style={{ position: 'absolute', right: '100%', top: '0', bottom: '0', display: 'flex', alignItems: 'center', paddingRight: '0.5rem' }}>
                    <span className="hover-arrow" style={{ display: 'inline-block', transition: 'transform 0.3s ease' }}>←</span>
                </span>
                {t({ en: 'Previous Page', zh: '上一頁' })}
            </button>
        </div>
    );
};
