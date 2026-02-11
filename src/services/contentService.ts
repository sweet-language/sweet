import type { User } from '../features/auth/AuthContext';

export interface ContentItem {
    id: string;
    authorId: string;
    assignedStudentId?: string; // If undefined, maybe public or draft
    type: 'story' | 'lesson' | 'video-lesson';
    title: string;
    payload: any; // The story text, vocab list, etc.
    lessonPlanId?: string; // Link back to source lesson plan
    createdAt: number;
}

const STORAGE_KEY = 'app-content';

export const contentService = {
    getAllContent: (): ContentItem[] => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    saveContent: (item: ContentItem) => {
        const all = contentService.getAllContent();
        all.push(item);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    },

    createStory: (author: User, studentId: string | undefined, title: string, storyPayload: any) => {
        const newItem: ContentItem = {
            id: Date.now().toString(),
            authorId: author.id,
            assignedStudentId: studentId,
            type: 'story',
            title,
            payload: storyPayload,
            createdAt: Date.now()
        };
        contentService.saveContent(newItem);
        return newItem;
    },

    getContentForStudent: (studentId: string): ContentItem[] => {
        const all = contentService.getAllContent();
        return all.filter(c => c.assignedStudentId === studentId);
    },

    getContentByTeacher: (teacherId: string): ContentItem[] => {
        const all = contentService.getAllContent();
        return all.filter(c => c.authorId === teacherId);
    },

    createFromLessonPlan: (authorId: string, studentId: string, title: string, payload: any, lessonPlanId: string, hasVideo: boolean): ContentItem => {
        const newItem: ContentItem = {
            id: Date.now().toString(),
            authorId,
            assignedStudentId: studentId,
            type: hasVideo ? 'video-lesson' : 'lesson',
            title,
            payload,
            lessonPlanId,
            createdAt: Date.now(),
        };
        contentService.saveContent(newItem);
        return newItem;
    },
};
