import React, { useState, useEffect } from 'react';
import { useAuth, type User } from './AuthContext';
import { useLanguage } from '../../features/language/LanguageContext';
import { useNavigate, Link } from 'react-router-dom';
import { LucideUpload, LucideUser, LucideLock, LucideSchool } from 'lucide-react';

export const SignupPage: React.FC = () => {
    const { t, setLanguage } = useLanguage();
    const { signup, getAllTeachers } = useAuth();
    const navigate = useNavigate();

    // Form State
    const [role, setRole] = useState<'student' | 'teacher'>('student');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [avatar] = useState<string>(''); // For now just a placeholder string or dataURL logic

    // Auto-switch language based on role
    useEffect(() => {
        if (role === 'student') {
            setLanguage('zh-TW');
        } else if (role === 'teacher') {
            setLanguage('en');
        }
    }, [role, setLanguage]);

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (password.length < 4 || password.length > 10) {
            alert('Password must be 4-10 characters');
            return;
        }

        const newUser: User = {
            id: username,
            role,
            password,
            avatar,
            linkedTeacherId: role === 'student' ? selectedTeacher : undefined
        };

        const result = signup(newUser);
        if (result.success) {
            // Auto-switch language
            if (role === 'student') setLanguage('zh-TW');
            else setLanguage('en');

            navigate('/dashboard');
        } else {
            alert(result.error);
        }
    };

    const teachers = getAllTeachers();

    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <h1 className="scratch-text" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
                {role === 'teacher' ? 'Join sweet!' : '加入 sweet!'}
            </h1>

            {/* Role Toggles */}
            <div style={{ display: 'flex', gap: '3rem', marginBottom: '3rem' }}>
                <button
                    onClick={() => setRole('student')}
                    style={{
                        padding: '1rem 2rem',
                        borderBottom: role === 'student' ? '2px solid var(--color-accent-blue)' : '2px solid transparent',
                        color: role === 'student' ? 'var(--color-accent-blue)' : 'var(--color-text-muted)',
                        cursor: 'pointer',
                        background: 'transparent',
                        fontWeight: role === 'student' ? 'bold' : 'normal',
                        fontSize: '1.2rem',
                        opacity: role === 'student' ? 1 : 0.5,
                        transition: 'all 0.3s'
                    }}
                >
                    {t({ en: 'Student', zh: '學生' })}
                </button>
                <button
                    onClick={() => setRole('teacher')}
                    style={{
                        padding: '1rem 2rem',
                        borderBottom: role === 'teacher' ? '2px solid var(--color-accent-purple)' : '2px solid transparent',
                        color: role === 'teacher' ? 'var(--color-accent-purple)' : 'var(--color-text-muted)',
                        cursor: 'pointer',
                        background: 'transparent',
                        fontWeight: role === 'teacher' ? 'bold' : 'normal',
                        fontSize: '1.2rem',
                        opacity: role === 'teacher' ? 1 : 0.5,
                        transition: 'all 0.3s'
                    }}
                >
                    {t({ en: 'Teacher', zh: '教師' })}
                </button>
            </div>

            <form onSubmit={handleSignup} style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Username */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                        {role === 'teacher' ? 'Username (ID)' : '帳號 (ID)'}
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--color-text-muted)', padding: '0.5rem' }}>
                        <LucideUser size={20} style={{ marginRight: '0.5rem', opacity: 0.5 }} />
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--color-text-primary)', width: '100%', outline: 'none', fontSize: '1rem' }}
                            placeholder="Pick a unique username"
                        />
                    </div>
                </div>

                {/* Password (For ALL) */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                        {role === 'teacher' ? 'Password (4-10 chars)' : '密碼 (4-10 字元)'}
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--color-text-muted)', padding: '0.5rem' }}>
                        <LucideLock size={20} style={{ marginRight: '0.5rem', opacity: 0.5 }} />
                        <input
                            type="password"
                            required
                            minLength={4}
                            maxLength={10}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--color-text-primary)', width: '100%', outline: 'none', fontSize: '1rem' }}
                            placeholder="••••••"
                        />
                    </div>
                </div>

                {/* Teacher Only: Avatar */}
                {role === 'teacher' && (
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                            {t({ en: 'Profile Picture', zh: '大頭貼' })}
                        </label>
                        <div style={{
                            border: '1px dashed var(--color-text-muted)',
                            borderRadius: '8px',
                            padding: '1rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            opacity: 0.7
                        }}>
                            <LucideUpload size={24} style={{ marginBottom: '0.5rem' }} />
                            <span style={{ fontSize: '0.8rem' }}>Click to Upload (Mock)</span>
                        </div>
                    </div>
                )}

                {/* Student Only: Select Teacher */}
                {role === 'student' && (
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                            {t({ en: 'Select Teacher', zh: '選擇教師' })}
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--color-text-muted)', padding: '0.5rem' }}>
                            <LucideSchool size={20} style={{ marginRight: '0.5rem', opacity: 0.5 }} />
                            <select
                                value={selectedTeacher}
                                onChange={e => setSelectedTeacher(e.target.value)}
                                style={{ background: 'transparent', border: 'none', color: 'var(--color-text-primary)', width: '100%', outline: 'none', fontSize: '1rem' }}
                                required
                            >
                                <option value="" disabled>Select a teacher...</option>
                                {teachers.map(t => (
                                    <option key={t.id} value={t.id} style={{ color: 'black' }}>{t.id}</option>
                                ))}
                                {teachers.length === 0 && <option disabled>No teachers found</option>}
                            </select>
                        </div>
                        {teachers.length === 0 && (
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-accent-gold)', marginTop: '0.5rem' }}>
                                No teachers registered. Create a teacher account first!
                            </p>
                        )}
                    </div>
                )}

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginTop: '1rem' }}>
                    {role === 'teacher' ? 'Create Account' : '建立帳號'}
                </button>


                <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    <Link to="/login" style={{ color: 'var(--color-text-secondary)' }}>
                        {role === 'teacher' ? 'Already have an account? Log in' : '已有帳號？登入'}
                    </Link>
                </p>
            </form>
        </div>
    );
};
