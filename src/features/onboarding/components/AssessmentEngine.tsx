import React from 'react';
import { ProficiencyQuiz } from './ProficiencyQuiz';

interface AssessmentEngineProps {
    onComplete: (level: number, label: string) => void;
    age?: number;
    targetLanguage?: 'en' | 'zh';
}

// Wrapper for SignupWizard to use the core ProficiencyQuiz
export const AssessmentEngine: React.FC<AssessmentEngineProps> = ({ onComplete, age, targetLanguage }) => {
    return (
        <ProficiencyQuiz
            onChange={() => { }} // No-op for onChange, we use onFinish
            age={age}
            targetLanguage={targetLanguage}
            onFinish={(level, label) => onComplete(level, label)}
        />
    );
};
