import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wizard } from './components/Wizard';
import { LanguageStep } from './steps/LanguageStep';
import { ProfileStep } from './steps/ProfileStep';
import { ProficiencyQuiz } from './components/ProficiencyQuiz';
import { useLanguage } from '../language/LanguageContext';

import { PathSelectionStep } from './steps/PathSelectionStep';
import { ClassCodeStep } from './steps/ClassCodeStep';

export const OnboardingFlow: React.FC = () => {
    const navigate = useNavigate();
    const { setUserLevel } = useLanguage();
    const [path, setPath] = useState<'test' | 'join'>('test'); // Default to test
    const [formData, setFormData] = useState({
        targetLanguage: '',
        age: '',
        gender: '',
        district: '',
        level: 'Beginner', // Default
        classCode: ''
    });

    const updateData = (newData: any) => {
        setFormData((prev) => ({ ...prev, ...newData }));
    };

    const handleFinish = () => {
        console.log('Onboarding Complete:', formData);
        setUserLevel(formData.level); // Save to Global Context
        navigate('/dashboard');
    };

    const steps = [
        <LanguageStep key="lang" onNext={(data) => updateData(data)} />,
        <PathSelectionStep key="path" onSelect={(p) => setPath(p)} />,
        <ProfileStep key="profile" onChange={(data) => updateData(data)} />,
        // Conditional Step
        path === 'join'
            ? <ClassCodeStep key="code" onChange={(code) => updateData({ classCode: code })} />
            : <div key="level"><ProficiencyQuiz age={Number(formData.age)} onChange={(data) => updateData(data)} /></div>,
    ];

    return (
        <div style={{ padding: '2rem' }}>
            <h1 className="scratch-text" style={{ textAlign: 'center', marginBottom: '1rem' }}>
                Enrollment
            </h1>
            <Wizard steps={steps} onComplete={handleFinish} />
        </div>
    );
};
