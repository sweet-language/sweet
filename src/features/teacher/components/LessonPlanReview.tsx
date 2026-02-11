import React, { useState } from 'react';
import type { LessonPlan, ValidationResult, ValidationCheckType } from '../../../models/lessonPlan';
import { runFullValidation } from '../../../services/validationService';
import { lessonPlanService } from '../../../services/lessonPlanService';
import { useLanguage } from '../../language/LanguageContext';

interface LessonPlanReviewProps {
    plan: LessonPlan;
    onPlanUpdate: (plan: LessonPlan) => void;
    onFinalize: (plan: LessonPlan) => void;
}

const CHECK_LABELS: Record<ValidationCheckType, { en: string; zh: string }> = {
    'grammar':               { en: 'Grammar & Punctuation', zh: '語法與標點' },
    'vocab-completeness':    { en: 'Vocabulary Completeness', zh: '詞彙完整性' },
    'timestamp-alignment':   { en: 'Timestamp Alignment', zh: '時間戳對齊' },
    'level-appropriateness': { en: 'Level Appropriateness', zh: '等級適當性' },
};

export const LessonPlanReview: React.FC<LessonPlanReviewProps> = ({ plan, onPlanUpdate, onFinalize }) => {
    const { t } = useLanguage();
    const [validation, setValidation] = useState<ValidationResult | null>(
        plan.validationHistory.length > 0
            ? plan.validationHistory[plan.validationHistory.length - 1]
            : null
    );
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(plan.textContent);
    const [editTitle, setEditTitle] = useState(plan.title);

    const handleRunValidation = () => {
        const result = runFullValidation(plan);
        setValidation(result);
        const updated = lessonPlanService.addValidation(plan.id, result);
        onPlanUpdate(updated);
    };

    const handleFinalize = () => {
        if (!validation?.passed) return;

        try {
            // Transition: review-in-progress → finalized
            if (plan.status === 'pending-review') {
                const inReview = lessonPlanService.transition(plan.id, 'review-in-progress');
                const finalized = lessonPlanService.transition(inReview.id, 'finalized');
                onFinalize(finalized);
            } else if (plan.status === 'review-in-progress') {
                const finalized = lessonPlanService.transition(plan.id, 'finalized');
                onFinalize(finalized);
            }
        } catch (err) {
            alert(String(err));
        }
    };

    const handleSaveEdits = () => {
        const updated = lessonPlanService.getById(plan.id);
        if (updated) {
            updated.title = editTitle;
            updated.textContent = editText;
            updated.updatedAt = Date.now();
            lessonPlanService.save(updated);
            onPlanUpdate(updated);
            setIsEditing(false);
        }
    };

    const severityColor = (sev: string) => {
        switch (sev) {
            case 'error': return '#e74c3c';
            case 'warning': return '#f39c12';
            case 'info': return '#3498db';
            default: return 'var(--color-text-secondary)';
        }
    };

    return (
        <div style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontWeight: '300', fontSize: '1.4rem' }}>
                {t({ en: 'Lesson Plan Review', zh: '課程計畫審查' })}
            </h3>

            {/* Plan Summary */}
            <div style={{
                background: 'var(--color-bg-card)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                border: '1px solid var(--color-border-scratch)',
            }}>
                {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <input
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            style={{
                                padding: '0.5rem',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                border: '1px solid var(--color-text-muted)',
                                borderRadius: '4px',
                                background: 'transparent',
                                color: 'var(--color-text-primary)',
                            }}
                        />
                        <textarea
                            value={editText}
                            onChange={e => setEditText(e.target.value)}
                            rows={8}
                            style={{
                                padding: '0.5rem',
                                border: '1px solid var(--color-text-muted)',
                                borderRadius: '4px',
                                background: 'transparent',
                                color: 'var(--color-text-primary)',
                                resize: 'vertical',
                                lineHeight: '1.6',
                            }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn-primary" onClick={handleSaveEdits} style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                                {t({ en: 'Save Changes', zh: '儲存變更' })}
                            </button>
                            <button onClick={() => setIsEditing(false)} style={{ background: 'transparent', border: '1px solid var(--color-text-muted)', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
                                {t({ en: 'Cancel', zh: '取消' })}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <h4 style={{ margin: 0 }}>{plan.title}</h4>
                            <button
                                onClick={() => setIsEditing(true)}
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-accent-blue)', fontSize: '0.9rem' }}
                            >
                                {t({ en: 'Edit', zh: '編輯' })}
                            </button>
                        </div>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                            {t({ en: 'Status', zh: '狀態' })}: <strong>{plan.status}</strong>
                            {' | '}
                            {t({ en: 'Level', zh: '等級' })}: <strong>{plan.targetLevel}</strong>
                            {' | '}
                            {t({ en: 'Vocab', zh: '詞彙' })}: <strong>{plan.vocabItems.length}</strong>
                            {plan.revisionCount > 0 && (
                                <> {' | '} {t({ en: 'Revisions', zh: '修改次數' })}: <strong>{plan.revisionCount}</strong></>
                            )}
                        </p>
                    </div>
                )}
            </div>

            {/* Validation Checklist */}
            {validation && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1rem', fontWeight: '400' }}>
                        {t({ en: 'Validation Results', zh: '驗證結果' })}
                        <span style={{
                            marginLeft: '0.5rem',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontSize: '0.8rem',
                            background: validation.passed ? '#27ae6020' : '#e74c3c20',
                            color: validation.passed ? '#27ae60' : '#e74c3c',
                        }}>
                            {validation.passed
                                ? t({ en: 'PASSED', zh: '通過' })
                                : t({ en: 'FAILED', zh: '未通過' })
                            }
                        </span>
                    </h4>

                    {validation.checks.map(check => (
                        <div key={check.type} style={{
                            padding: '0.75rem 1rem',
                            marginBottom: '0.5rem',
                            borderRadius: '6px',
                            border: `1px solid ${check.passed ? '#27ae6040' : '#e74c3c40'}`,
                            background: check.passed ? '#27ae6008' : '#e74c3c08',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: check.issues.length > 0 ? '0.5rem' : 0 }}>
                                <span style={{ fontSize: '1.1rem' }}>{check.passed ? '\u2705' : '\u274C'}</span>
                                <span style={{ fontWeight: '500' }}>
                                    {t(CHECK_LABELS[check.type])}
                                </span>
                            </div>

                            {check.issues.length > 0 && (
                                <div style={{ paddingLeft: '1.5rem' }}>
                                    {check.issues.map((issue, i) => (
                                        <div key={i} style={{ fontSize: '0.85rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                                            <span style={{
                                                padding: '1px 6px',
                                                borderRadius: '3px',
                                                fontSize: '0.7rem',
                                                fontWeight: 'bold',
                                                color: 'white',
                                                background: severityColor(issue.severity),
                                                flexShrink: 0,
                                                marginTop: '2px',
                                            }}>
                                                {issue.severity.toUpperCase()}
                                            </span>
                                            <span style={{ color: 'var(--color-text-secondary)' }}>{issue.message}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                    className="btn-primary"
                    onClick={handleRunValidation}
                    style={{ fontSize: '0.95rem', padding: '0.6rem 1.2rem' }}
                >
                    {t({ en: 'Run Validation', zh: '執行驗證' })}
                </button>

                <button
                    className="btn-primary"
                    onClick={handleFinalize}
                    disabled={!validation?.passed}
                    style={{
                        fontSize: '0.95rem',
                        padding: '0.6rem 1.2rem',
                        opacity: validation?.passed ? 1 : 0.4,
                        background: validation?.passed ? 'var(--color-accent-green)' : undefined,
                    }}
                >
                    {t({ en: 'Finalize', zh: '定案' })}
                </button>
            </div>
        </div>
    );
};
