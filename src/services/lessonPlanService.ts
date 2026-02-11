import type { LessonPlan, LessonPlanStatus, ValidationResult } from '../models/lessonPlan';
import { lessonPlanToContentItem } from '../models/lessonPlan';
import { contentService } from './contentService';
import type { LevelNumber, Framework } from '../models/leveling';

const STORAGE_KEY = 'app-lesson-plans';

// ── Valid Transitions ────────────────────────────────────────────────

const VALID_TRANSITIONS: Record<LessonPlanStatus, LessonPlanStatus[]> = {
    'draft':             ['ai-generating', 'pending-review'],
    'ai-generating':     ['pending-review', 'draft'],
    'pending-review':    ['review-in-progress'],
    'review-in-progress': ['revision-needed', 'finalized'],
    'revision-needed':   ['pending-review', 'draft'],
    'finalized':         ['assigned', 'revision-needed'],
    'assigned':          [],
};

// ── Service ──────────────────────────────────────────────────────────

export const lessonPlanService = {

    getAll(): LessonPlan[] {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    getById(id: string): LessonPlan | undefined {
        return lessonPlanService.getAll().find(p => p.id === id);
    },

    getByTeacher(teacherId: string): LessonPlan[] {
        return lessonPlanService.getAll().filter(p => p.teacherId === teacherId);
    },

    save(plan: LessonPlan): void {
        const all = lessonPlanService.getAll();
        const idx = all.findIndex(p => p.id === plan.id);
        if (idx >= 0) {
            all[idx] = plan;
        } else {
            all.push(plan);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    },

    delete(id: string): void {
        const all = lessonPlanService.getAll().filter(p => p.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    },

    createDraft(params: {
        teacherId: string;
        title: string;
        targetLanguage: 'en' | 'zh';
        targetLevel: LevelNumber;
        targetFramework: Framework;
        sourceType?: LessonPlan['sourceType'];
        sourceData?: string;
    }): LessonPlan {
        const now = Date.now();
        const plan: LessonPlan = {
            id: now.toString(),
            teacherId: params.teacherId,
            status: 'draft',
            createdAt: now,
            updatedAt: now,
            title: params.title,
            textContent: '',
            targetLanguage: params.targetLanguage,
            targetLevel: params.targetLevel,
            targetFramework: params.targetFramework,
            vocabItems: [],
            validationHistory: [],
            revisionCount: 0,
            assignedStudentIds: [],
            sourceType: params.sourceType,
            sourceData: params.sourceData,
        };
        lessonPlanService.save(plan);
        return plan;
    },

    transition(planId: string, newStatus: LessonPlanStatus): LessonPlan {
        const plan = lessonPlanService.getById(planId);
        if (!plan) throw new Error(`Lesson plan "${planId}" not found.`);

        const allowed = VALID_TRANSITIONS[plan.status];
        if (!allowed.includes(newStatus)) {
            throw new Error(
                `Invalid transition: "${plan.status}" → "${newStatus}". Allowed: ${allowed.join(', ') || 'none'}`
            );
        }

        if (newStatus === 'revision-needed') {
            plan.revisionCount += 1;
        }

        plan.status = newStatus;
        plan.updatedAt = Date.now();
        lessonPlanService.save(plan);
        return plan;
    },

    addValidation(planId: string, result: ValidationResult): LessonPlan {
        const plan = lessonPlanService.getById(planId);
        if (!plan) throw new Error(`Lesson plan "${planId}" not found.`);

        plan.validationHistory.push(result);
        plan.updatedAt = Date.now();
        lessonPlanService.save(plan);
        return plan;
    },

    assign(planId: string, studentIds: string[]): LessonPlan {
        const plan = lessonPlanService.getById(planId);
        if (!plan) throw new Error(`Lesson plan "${planId}" not found.`);

        // Guard: must be finalized
        if (plan.status !== 'finalized') {
            throw new Error(`Cannot assign: plan status is "${plan.status}", must be "finalized".`);
        }

        // Guard: latest validation must pass
        const latestValidation = plan.validationHistory[plan.validationHistory.length - 1];
        if (!latestValidation || !latestValidation.passed) {
            throw new Error('Cannot assign: latest validation did not pass.');
        }

        // Create ContentItems for each student
        for (const studentId of studentIds) {
            const contentItem = lessonPlanToContentItem(plan, studentId);
            contentService.saveContent(contentItem);
        }

        plan.assignedStudentIds = [...new Set([...plan.assignedStudentIds, ...studentIds])];
        plan.status = 'assigned';
        plan.updatedAt = Date.now();
        lessonPlanService.save(plan);
        return plan;
    },
};
