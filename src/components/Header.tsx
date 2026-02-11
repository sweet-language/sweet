import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LucideSun, LucideMoon, LucideLogOut } from 'lucide-react';
import { LanguageToggle } from '../features/language/LanguageToggle';
import { useLanguage } from '../features/language/LanguageContext';
import { useTheme } from '../features/theme/ThemeContext';
import { useAuth } from '../features/auth/AuthContext';

interface HeaderProps {
    showLogout?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ showLogout = true }) => {
    const { t } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            background: 'var(--color-bg-base)',
            borderBottom: 'var(--border-scratch)',
            padding: '1rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.5s ease'
        }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <svg width="140" height="60" viewBox="0 0 500 200" style={{ overflow: 'visible' }}>
                    <defs>
                        <path id="curveSweetHeader" d="M 50,120 Q 250,20 450,120" />
                    </defs>

                    {/* Speed Lines - Adapted to Current Color */}
                    <g stroke="#9ECA3B" fill="none" strokeLinecap="round" opacity="1" transform="rotate(-15, 115, 75)">
                        <path d="M 55,80 Q 95,60 130,53" strokeWidth="2" strokeDasharray="1 8 4 6 2 5" strokeLinecap="round" />
                        <path d="M 25,105 Q 75,75 127,65" strokeWidth="4" />
                        <path d="M 75,95 Q 100,85 125,77" strokeWidth="3" strokeDasharray="0.5 10 2 8" strokeLinecap="round" />
                        <path d="M 45,120 Q 85,100 123,89" strokeWidth="2" />
                    </g>

                    <text>
                        <textPath
                            href="#curveSweetHeader"
                            startOffset="50%"
                            textAnchor="middle"
                            style={{
                                fontSize: '5rem',
                                fontWeight: '900',
                                fill: '#9ECA3B',
                                fontFamily: 'var(--font-heading, sans-serif)'
                            }}
                        >
                            {t({ en: 'sweet!', zh: 'sweet!' })}
                        </textPath>
                    </text>
                </svg>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Greeting */}
                {user && (
                    <span style={{ marginRight: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                        {t({ en: 'Hello, ', zh: '你好，' })}
                        <strong style={{ color: '#9ECA3B' }}>
                            {user.id}
                        </strong>
                    </span>
                )}

                {user && showLogout && (
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '0.5rem',
                            background: 'transparent',
                            border: '1px solid var(--color-text-muted)',
                            color: 'var(--color-text-secondary)',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                        title={t({ en: "Log Out", zh: "登出" })}
                    >
                        <LucideLogOut size={18} />
                    </button>
                )}

                <button
                    onClick={toggleTheme}
                    style={{
                        background: 'transparent',
                        border: '1px solid var(--color-border-scratch, rgba(255,255,255,0.1))',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--color-text-primary)'
                    }}
                >
                    {theme === 'dark' ? <LucideSun size={20} /> : <LucideMoon size={20} />}
                </button>
                <LanguageToggle />
            </div>
        </header>
    );
};
