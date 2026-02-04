import React, { useState } from 'react';

interface WizardProps {
    steps: React.ReactNode[];
    onComplete: () => void;
}

export const Wizard: React.FC<WizardProps> = ({ steps, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const isLastStep = currentStep === steps.length - 1;
    const isFirstStep = currentStep === 0;

    const handleNext = () => {
        if (isLastStep) {
            onComplete();
        } else {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (!isFirstStep) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    return (
        <div className="scratch-card" style={{ maxWidth: '600px', margin: '2rem auto', border: '1px solid var(--color-accent-gold)' }}>
            {/* Progress Bar */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
                    <div
                        style={{
                            width: `${((currentStep + 1) / steps.length) * 100}%`,
                            height: '100%',
                            background: 'var(--gradient-scratch)',
                            transition: 'width 0.3s ease'
                        }}
                    ></div>
                </div>
                <p style={{ textAlign: 'right', marginTop: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                    Step {currentStep + 1} of {steps.length}
                </p>
            </div>

            {/* Step Content */}
            <div style={{ minHeight: '300px', padding: '1rem 0' }}>
                {steps[currentStep]}
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                <button
                    onClick={handleBack}
                    disabled={isFirstStep}
                    style={{
                        background: 'transparent',
                        border: '1px solid var(--color-text-muted)',
                        color: isFirstStep ? 'var(--color-text-muted)' : 'var(--color-text-secondary)',
                        padding: '0.5rem 1.5rem',
                        borderRadius: '8px',
                        cursor: isFirstStep ? 'not-allowed' : 'pointer',
                        opacity: isFirstStep ? 0.5 : 1
                    }}
                >
                    Back
                </button>
                <button
                    onClick={handleNext}
                    className="btn-primary"
                >
                    {isLastStep ? 'Finish' : 'Next'}
                </button>
            </div>
        </div>
    );
};
