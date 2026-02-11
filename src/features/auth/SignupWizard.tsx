import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth, type User } from './AuthContext';
import { useLanguage } from '../../features/language/LanguageContext';
import { LanguageToggle } from '../../features/language/LanguageToggle';

// Steps
import { PathSelectionStep } from '../../features/onboarding/steps/PathSelectionStep';
import { AssessmentEngine } from '../../features/onboarding/components/AssessmentEngine';
import { ClassCodeStep } from '../../features/onboarding/steps/ClassCodeStep';

import { AccountCreationStep } from '../../features/onboarding/steps/AccountCreationStep';
import { AgeSelectionStep } from '../../features/onboarding/steps/AgeSelectionStep';
import classroomSketch from '../../assets/images/classroom_sketch.png';

export const SignupWizard: React.FC = () => {
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode') || 'test';
    const { t } = useLanguage();
    const { signup, getAllTeachers } = useAuth();
    const navigate = useNavigate();

    // Wizard State
    const [step, setStep] = useState(1);
    const [path, setPath] = useState<'test' | 'join'>('test');

    // Data State
    const [targetLanguage, setTargetLanguage] = useState<'en' | 'zh'>('zh');
    const [proficiencyData, setProficiencyData] = useState<{ level: number, label: string } | null>(null);
    const [classCode, setClassCode] = useState('');

    const [selectedTeacherId, setSelectedTeacherId] = useState('');
    const [age, setAge] = useState<number | undefined>(undefined);

    // Teacher selection
    const allTeachers = getAllTeachers();

    // Language is now managed by LanguageContext and persists from landing page


    const handleSignup = (credentials: { username: string, password?: string }) => {
        // Final Validation
        if (!credentials.username || !credentials.password) return alert('Please complete all fields.');

        const newUser: User = {
            id: credentials.username,
            role: mode === 'teacher' ? 'teacher' : 'student',
            password: credentials.password,
            targetLanguage: mode !== 'teacher' ? targetLanguage : undefined,
            teachingLanguage: mode === 'teacher' ? targetLanguage : undefined,
            proficiencyLevel: proficiencyData ? `${proficiencyData.label} (Level ${proficiencyData.level})` : 'Unassessed',
            linkedTeacherId: selectedTeacherId || undefined,
            classId: classCode || undefined
        };

        const result = signup(newUser);
        if (result.success) {
            navigate('/dashboard');
        } else {
            alert(result.error);
        }
    };

    // --- Render Logic ---
    const arrowStyle = {
        display: 'inline-block',
        transition: 'transform 0.2s',
        animation: 'pointLeft 1.5s infinite ease-in-out'
    };

    const animStyles = (
        <style>{`
            @keyframes pointLeft {
                0%, 100% { transform: translateX(0); }
                50% { transform: translateX(-4px); }
            }
        `}</style>
    );

    // 1. Language Selection
    if (step === 1) {
        return (
            <div className="wizard-step" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#1a1918' }}>
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}>
                    <LanguageToggle variant="dark" />
                </div>
                <div style={{ marginTop: '-3rem' }}>
                    <h2 className="scratch-text" style={{ fontSize: '2.5rem', color: '#9ECA3B', marginBottom: '2rem', textAlign: 'center' }}>
                        {mode === 'teacher' ? t({ en: 'What do you teach?', zh: '您教什麼？' }) : t({ en: 'What are you studying?', zh: '您想學什麼？' })}
                    </h2>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <button onClick={() => { setTargetLanguage('zh'); setStep(2); }} style={{ padding: '2rem', borderRadius: '16px', border: 'none', cursor: 'pointer', fontSize: '1.5rem', minWidth: '200px' }}>
                            {t({ en: 'Chinese', zh: '中文' })}
                        </button>
                        <button onClick={() => { setTargetLanguage('en'); setStep(2); }} style={{ padding: '2rem', borderRadius: '16px', border: 'none', cursor: 'pointer', fontSize: '1.5rem', minWidth: '200px' }}>
                            {t({ en: 'English', zh: '英文' })}
                        </button>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        position: 'absolute',
                        bottom: '2rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: '#666',
                        cursor: 'pointer',
                    }}
                >
                    <span style={{ position: 'absolute', right: '100%', top: '0', bottom: '0', display: 'flex', alignItems: 'center', paddingRight: '0.5rem' }}>
                        <span style={arrowStyle}>←</span>
                    </span>
                    {t({ en: 'Previous Page', zh: '上一頁' })}
                </button>
                {animStyles}
            </div>
        );
    }

    // 2. Path Selection (Student Only)
    if (step === 2 && mode !== 'teacher') {
        return (
            <div className="wizard-step" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', paddingTop: '10vh' }}>
                <PathSelectionStep onSelect={(p) => {
                    setPath(p);
                    if (p === 'test' && targetLanguage === 'en') {
                        setStep(3); // Go to Age Step for English Learners
                    } else {
                        setStep(4); // Skip to Assessment/Code
                    }
                }} />
                <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                    <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', position: 'relative', margin: '0 auto' }}>
                        <span style={{ position: 'absolute', right: '100%', top: '0', bottom: '0', display: 'flex', alignItems: 'center', paddingRight: '0.5rem' }}>
                            <span style={arrowStyle}>←</span>
                        </span>
                        {t({ en: 'Previous Page', zh: '上一頁' })}
                    </button>
                </div>
            </div>
        );
    }

    // 3. Age Selection (Conditional)
    if (step === 3 && mode !== 'teacher') {
        return (
            <div className="wizard-step" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', paddingTop: '10vh' }}>
                <AgeSelectionStep onNext={(a) => {
                    setAge(a);
                    setStep(4);
                }} />
                <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                    <button onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', position: 'relative', margin: '0 auto' }}>
                        <span style={{ position: 'absolute', right: '100%', top: '0', bottom: '0', display: 'flex', alignItems: 'center', paddingRight: '0.5rem' }}>
                            <span style={arrowStyle}>←</span>
                        </span>
                        {t({ en: 'Previous Page', zh: '上一頁' })}
                    </button>
                </div>
            </div>
        );
    }

    // 4. Main Action (Test or Code)
    if (step === 4 && mode !== 'teacher') {
        if (path === 'test') {
            return (
                <div className="wizard-step" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                    <AssessmentEngine
                        age={age}
                        targetLanguage={targetLanguage}
                        onComplete={(level, label) => {
                            setProficiencyData({ level, label });
                            setStep(5); // Go to Teacher Match
                        }}
                    />
                    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                        <button
                            onClick={() => {
                                // Logic to retrace: if we did age step (start=en & path=test), go back to 3. else 2.
                                if (path === 'test' && targetLanguage === 'en') setStep(3);
                                else setStep(2);
                            }}
                            style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', position: 'relative', margin: '0 auto' }}
                        >
                            <span style={{ position: 'absolute', right: '100%', top: '0', bottom: '0', display: 'flex', alignItems: 'center', paddingRight: '0.5rem' }}>
                                <span style={arrowStyle}>←</span>
                            </span>
                            {t({ en: 'Previous Page', zh: '上一頁' })}
                        </button>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="wizard-step" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', paddingTop: '10vh' }}>
                    <ClassCodeStep onChange={(code) => {
                        setClassCode(code);
                        // Auto advance if code is valid length? Or button.
                        // For now classCodeStep inputs value. We might need a "Next" button in ClassCodeStep or here.
                        // Let's assume ClassCodeStep is just input. We need a next button.
                    }} />
                    <button
                        className="btn-primary"
                        onClick={() => setStep(5)}
                        disabled={classCode.length < 3}
                        style={{
                            display: 'block',
                            margin: '2.5rem auto 1rem auto',
                            transition: 'background-color 0.3s ease, border-color 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            if (classCode.length >= 3) {
                                e.currentTarget.style.backgroundColor = '#9ECA3B';
                                e.currentTarget.style.borderColor = '#9ECA3B';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '';
                            e.currentTarget.style.borderColor = '';
                        }}
                    >
                        Next
                    </button>
                    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                        <div style={{ marginTop: '-2.5rem' }}>
                            <img src={classroomSketch} alt="Classroom" style={{ maxWidth: '300px', width: '100%', opacity: 0.9, mixBlendMode: 'screen' }} />
                        </div>
                        <button
                            onClick={() => setStep(2)}
                            style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', position: 'relative', margin: '2rem auto 0 auto' }}
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
                                <span className="hover-arrow" style={{ ...arrowStyle, transition: 'transform 0.3s ease' }}>←</span>
                            </span>
                            {t({ en: 'Previous Page', zh: '上一頁' })}
                        </button>
                    </div>
                </div>
            );
        }
    }

    // 5. Match Teacher (If Test or Join)
    // If Join, maybe we auto-select based on code? For now, manual select is fine as fallback.
    if (step === 5 && mode !== 'teacher') {
        return (
            <div className="wizard-step" style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto', textAlign: 'center', paddingTop: '10vh' }}>
                <h2>{t({ en: 'Select a Teacher', zh: '選擇老師' })}</h2>
                <p style={{ color: '#666', marginBottom: '2rem' }}>{t({ en: 'Choose a mentor to guide you.', zh: '選擇一位導師。' })}</p>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    {allTeachers.map(tea => (
                        <button
                            key={tea.id}
                            onClick={() => { setSelectedTeacherId(tea.id); setStep(6); }}
                            style={{
                                padding: '1.5rem',
                                border: selectedTeacherId === tea.id ? '2px solid var(--color-accent-gold)' : '1px solid #ddd',
                                background: 'white',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                textAlign: 'left'
                            }}
                        >
                            <strong>{tea.id}</strong>
                            <div style={{ fontSize: '0.8rem', color: '#888' }}>
                                {tea.teachingLanguage === 'zh' ? 'Teaches Chinese' : 'Teaches English'}
                            </div>
                        </button>
                    ))}
                    {allTeachers.length === 0 && <p>No teachers available.</p>}
                </div>
                {allTeachers.length > 0 && !selectedTeacherId && (
                    <div style={{ marginTop: '1rem', color: '#999', fontSize: '0.9rem' }}>Please select a teacher to continue.</div>
                )}

                <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                    <button
                        onClick={() => setStep(4)}
                        style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', position: 'relative', margin: '0 auto' }}
                    >
                        <span style={{ position: 'absolute', right: '100%', top: '0', bottom: '0', display: 'flex', alignItems: 'center', paddingRight: '0.5rem' }}>
                            <span style={arrowStyle}>←</span>
                        </span>
                        {t({ en: 'Previous Page', zh: '上一頁' })}
                    </button>
                </div>
            </div>
        );
    }

    // 6. Account Creation (Final)
    // Also Step 2 for Teacher
    if ((step === 6 && mode !== 'teacher') || (step === 2 && mode === 'teacher')) {
        return (
            <div className="wizard-step" style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto', paddingTop: '10vh' }}>
                <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                    <LanguageToggle />
                </div>
                <AccountCreationWrapper onSignup={handleSignup} mode={mode} />
                <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                    <button
                        onClick={() => setStep(5)}
                        style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', position: 'relative', margin: '0 auto' }}
                    >
                        <span style={{ position: 'absolute', right: '100%', top: '0', bottom: '0', display: 'flex', alignItems: 'center', paddingRight: '0.5rem' }}>
                            <span style={arrowStyle}>←</span>
                        </span>
                        {t({ en: 'Previous Page', zh: '上一頁' })}
                    </button>
                </div>
            </div>
        );
    }

    return <div>Loading...</div>;
};

// Helper to bridge the gap since AccountCreationStep was purely UI
const AccountCreationWrapper: React.FC<{ onSignup: (data: any) => void, mode: string }> = ({ onSignup, mode }) => {
    const { t } = useLanguage();
    const [data, setData] = useState<{ username: string, password?: string }>({ username: '', password: '' });

    const title = mode === 'teacher'
        ? t({ en: 'Create your Teacher Profile', zh: '建立您的教師檔案' })
        : t({ en: 'Create Your Profile', zh: '建立你的檔案' });

    return (
        <div>
            <AccountCreationStep onChange={(d) => setData(d)} title={title} />
            <button
                className="btn-primary"
                onClick={() => onSignup(data)}
                style={{ width: '100%', marginTop: '2rem' }}
            >
                {mode === 'teacher'
                    ? t({ en: 'Create Teacher Account', zh: '建立教師帳戶' })
                    : t({ en: 'Complete Signup', zh: '完成註冊' })}
            </button>
        </div>
    );
};
