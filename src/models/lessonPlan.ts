import type { LevelNumber, Framework } from './leveling';
import type { ContentItem } from '../services/contentService';

// ── Vocab & Video Types ──────────────────────────────────────────────

export interface VocabItem {
    id: string;
    word: string;
    pinyin?: string;
    definition: string;
    partOfSpeech: string;
    exampleSentence: string;
    level: LevelNumber;
}

export interface VideoTimestamp {
    startTime: number;  // seconds
    endTime: number;    // seconds
    pauseDuration: number; // seconds
}

export interface TimedContentItem {
    id: string;
    type: 'vocab' | 'passage';
    timestamp: VideoTimestamp;
    vocabItemId?: string;
    passageText?: string;
    displayConfig: {
        pauseDurationMs: number; // default 2000
    };
}

export interface VideoContent {
    videoUrl: string;
    duration: number; // seconds
    timedItems: TimedContentItem[];
    thumbnail?: string;
}

// ── Lesson Plan Status & Validation ──────────────────────────────────

export type LessonPlanStatus =
    | 'draft'
    | 'ai-generating'
    | 'pending-review'
    | 'review-in-progress'
    | 'revision-needed'
    | 'finalized'
    | 'assigned';

export type ValidationCheckType =
    | 'grammar'
    | 'vocab-completeness'
    | 'timestamp-alignment'
    | 'level-appropriateness';

export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationIssue {
    check: ValidationCheckType;
    severity: ValidationSeverity;
    message: string;
    field?: string;
}

export interface ValidationResult {
    passed: boolean;
    timestamp: number;
    checks: {
        type: ValidationCheckType;
        passed: boolean;
        issues: ValidationIssue[];
    }[];
}

// ── Lesson Plan Entity ───────────────────────────────────────────────

export interface LessonPlan {
    id: string;
    teacherId: string;
    status: LessonPlanStatus;
    createdAt: number;
    updatedAt: number;

    // Content
    title: string;
    textContent: string;
    targetLanguage: 'en' | 'zh';
    targetLevel: LevelNumber;
    targetFramework: Framework;

    // Structured data
    vocabItems: VocabItem[];
    videoContent?: VideoContent;

    // Validation & review
    validationHistory: ValidationResult[];
    revisionCount: number;

    // Assignment
    assignedStudentIds: string[];

    // Source metadata
    sourceType?: 'image' | 'vocab-list' | 'grammar-topic' | 'manual';
    sourceData?: string;
}

// ── Bridge Function ──────────────────────────────────────────────────

export function lessonPlanToContentItem(
    plan: LessonPlan,
    studentId: string
): ContentItem {
    return {
        id: `${plan.id}-${studentId}-${Date.now()}`,
        authorId: plan.teacherId,
        assignedStudentId: studentId,
        type: plan.videoContent ? 'video-lesson' : 'lesson',
        title: plan.title,
        payload: {
            content: plan.textContent,
            vocab: plan.vocabItems.map(v => v.word),
            vocabItems: plan.vocabItems,
            videoContent: plan.videoContent,
            level: plan.targetLevel,
            framework: plan.targetFramework,
        },
        lessonPlanId: plan.id,
        createdAt: Date.now(),
    };
}
