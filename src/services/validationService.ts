import type {
    LessonPlan,
    ValidationResult,
    ValidationIssue,
    ValidationCheckType,
} from '../models/lessonPlan';
import {
    getVocabTargetForLevel,
    getSentenceComplexityForLevel,
    isLevelAppropriate,
} from '../models/leveling';

// ── Individual Check Functions ────────────────────────────────────────

function checkGrammar(plan: LessonPlan): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const text = plan.textContent || '';

    // Check for unclosed quotes
    const doubleQuotes = (text.match(/"/g) || []).length;
    if (doubleQuotes % 2 !== 0) {
        issues.push({
            check: 'grammar',
            severity: 'error',
            message: 'Unclosed double quotes detected in text content.',
            field: 'textContent',
        });
    }

    const singleQuotes = (text.match(/'/g) || []).length;
    if (singleQuotes % 2 !== 0) {
        issues.push({
            check: 'grammar',
            severity: 'warning',
            message: 'Possible unclosed single quotes in text content.',
            field: 'textContent',
        });
    }

    // Check for double spaces
    if (/  /.test(text)) {
        issues.push({
            check: 'grammar',
            severity: 'warning',
            message: 'Double spaces detected in text content.',
            field: 'textContent',
        });
    }

    // Check that all vocab items have definitions
    for (const item of plan.vocabItems) {
        if (!item.definition || item.definition.trim() === '') {
            issues.push({
                check: 'grammar',
                severity: 'error',
                message: `Vocab item "${item.word}" is missing a definition.`,
                field: `vocabItems.${item.id}.definition`,
            });
        }
    }

    // Check punctuation at end of text
    if (text.trim().length > 0) {
        const lastChar = text.trim().slice(-1);
        if (!/[.!?。！？]/.test(lastChar)) {
            issues.push({
                check: 'grammar',
                severity: 'warning',
                message: 'Text content does not end with punctuation.',
                field: 'textContent',
            });
        }
    }

    return issues;
}

function checkVocabCompleteness(plan: LessonPlan): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const target = getVocabTargetForLevel(plan.targetFramework, plan.targetLevel);
    const count = plan.vocabItems.length;

    if (count < target.min) {
        issues.push({
            check: 'vocab-completeness',
            severity: 'error',
            message: `Too few vocab items: ${count} (minimum ${target.min} for level ${plan.targetLevel}).`,
            field: 'vocabItems',
        });
    }

    if (count > target.max) {
        issues.push({
            check: 'vocab-completeness',
            severity: 'warning',
            message: `Too many vocab items: ${count} (maximum ${target.max} for level ${plan.targetLevel}).`,
            field: 'vocabItems',
        });
    }

    // Check example sentences
    for (const item of plan.vocabItems) {
        if (!item.exampleSentence || item.exampleSentence.trim() === '') {
            issues.push({
                check: 'vocab-completeness',
                severity: 'error',
                message: `Vocab item "${item.word}" is missing an example sentence.`,
                field: `vocabItems.${item.id}.exampleSentence`,
            });
        }
    }

    // Check vocab words appear in text
    const textLower = (plan.textContent || '').toLowerCase();
    for (const item of plan.vocabItems) {
        if (!textLower.includes(item.word.toLowerCase())) {
            issues.push({
                check: 'vocab-completeness',
                severity: 'warning',
                message: `Vocab word "${item.word}" does not appear in the text content.`,
                field: `vocabItems.${item.id}.word`,
            });
        }
    }

    return issues;
}

function checkTimestampAlignment(plan: LessonPlan): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    if (!plan.videoContent) {
        // No video - skip timestamp checks
        return [];
    }

    const { timedItems, duration } = plan.videoContent;

    // Check all timed items are within video bounds
    for (const item of timedItems) {
        if (item.timestamp.startTime < 0) {
            issues.push({
                check: 'timestamp-alignment',
                severity: 'error',
                message: `Timed item "${item.id}" has a negative start time.`,
                field: `videoContent.timedItems.${item.id}`,
            });
        }
        if (item.timestamp.endTime > duration) {
            issues.push({
                check: 'timestamp-alignment',
                severity: 'error',
                message: `Timed item "${item.id}" end time (${item.timestamp.endTime}s) exceeds video duration (${duration}s).`,
                field: `videoContent.timedItems.${item.id}`,
            });
        }
        if (item.timestamp.startTime >= item.timestamp.endTime) {
            issues.push({
                check: 'timestamp-alignment',
                severity: 'error',
                message: `Timed item "${item.id}" has start time >= end time.`,
                field: `videoContent.timedItems.${item.id}`,
            });
        }
    }

    // Check for overlapping timestamps
    const sorted = [...timedItems].sort((a, b) => a.timestamp.startTime - b.timestamp.startTime);
    for (let i = 0; i < sorted.length - 1; i++) {
        if (sorted[i].timestamp.endTime > sorted[i + 1].timestamp.startTime) {
            issues.push({
                check: 'timestamp-alignment',
                severity: 'error',
                message: `Timed items "${sorted[i].id}" and "${sorted[i + 1].id}" have overlapping timestamps.`,
                field: 'videoContent.timedItems',
            });
        }
    }

    // Check all vocab items have timestamps
    const timedVocabIds = new Set(
        timedItems.filter(t => t.type === 'vocab' && t.vocabItemId).map(t => t.vocabItemId)
    );
    for (const vocab of plan.vocabItems) {
        if (!timedVocabIds.has(vocab.id)) {
            issues.push({
                check: 'timestamp-alignment',
                severity: 'warning',
                message: `Vocab item "${vocab.word}" does not have a timed timestamp in the video.`,
                field: `vocabItems.${vocab.id}`,
            });
        }
    }

    return issues;
}

function checkLevelAppropriateness(plan: LessonPlan): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Check sentence complexity
    const maxWords = getSentenceComplexityForLevel(plan.targetFramework, plan.targetLevel);
    const sentences = (plan.textContent || '').split(/[.!?。！？]+/).filter(s => s.trim());
    for (const sentence of sentences) {
        const wordCount = sentence.trim().split(/\s+/).length;
        if (wordCount > maxWords) {
            issues.push({
                check: 'level-appropriateness',
                severity: 'warning',
                message: `Sentence has ${wordCount} words, exceeding max ${maxWords} for level ${plan.targetLevel}: "${sentence.trim().slice(0, 50)}..."`,
                field: 'textContent',
            });
        }
    }

    // Check vocab item levels vs plan level
    for (const item of plan.vocabItems) {
        if (!isLevelAppropriate(plan.targetFramework, plan.targetLevel, item.level)) {
            issues.push({
                check: 'level-appropriateness',
                severity: 'warning',
                message: `Vocab "${item.word}" is level ${item.level}, which may not be appropriate for plan level ${plan.targetLevel}.`,
                field: `vocabItems.${item.id}.level`,
            });
        }
    }

    return issues;
}

// ── Main Validation Pipeline ─────────────────────────────────────────

export function runFullValidation(plan: LessonPlan): ValidationResult {
    const checkTypes: { type: ValidationCheckType; fn: (p: LessonPlan) => ValidationIssue[] }[] = [
        { type: 'grammar', fn: checkGrammar },
        { type: 'vocab-completeness', fn: checkVocabCompleteness },
        { type: 'timestamp-alignment', fn: checkTimestampAlignment },
        { type: 'level-appropriateness', fn: checkLevelAppropriateness },
    ];

    const checks = checkTypes.map(({ type, fn }) => {
        const issues = fn(plan);
        const hasErrors = issues.some(i => i.severity === 'error');
        return { type, passed: !hasErrors, issues };
    });

    const passed = checks.every(c => c.passed);

    return {
        passed,
        timestamp: Date.now(),
        checks,
    };
}
