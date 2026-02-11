// Global Leveling System - Pure data, no React, no side effects

export type LanguageTrack = 'en' | 'zh';
export type LearnerCategory = 'child' | 'adult';
export type Framework = 'GEPT' | 'TOCFL' | 'GRADE';
export type LevelNumber = 1 | 2 | 3 | 4 | 5 | 6;

export interface ProficiencyLevel {
    language: LanguageTrack;
    category: LearnerCategory;
    framework: Framework;
    level: LevelNumber;
    label: string;
    cefr: string;
}

export interface UserProficiency {
    english?: ProficiencyLevel;
    chinese?: ProficiencyLevel;
    assessedAt: number;
    assessmentMethod: 'quiz' | 'manual' | 'placement';
}

// ── Constant Tables ──────────────────────────────────────────────────

interface LevelDetail {
    label: string;
    cefr: string;
    vocabMin: number;
    vocabMax: number;
    maxSentenceWords: number;
}

export const GEPT_LEVELS: Record<LevelNumber, LevelDetail> = {
    1: { label: 'GEPT Basic',               cefr: 'A1', vocabMin: 5,  vocabMax: 10, maxSentenceWords: 8  },
    2: { label: 'GEPT Elementary',           cefr: 'A2', vocabMin: 8,  vocabMax: 15, maxSentenceWords: 12 },
    3: { label: 'GEPT Elementary (High)',     cefr: 'B1', vocabMin: 10, vocabMax: 20, maxSentenceWords: 18 },
    4: { label: 'GEPT Intermediate',         cefr: 'B2', vocabMin: 12, vocabMax: 25, maxSentenceWords: 22 },
    5: { label: 'GEPT High-Intermediate',    cefr: 'C1', vocabMin: 15, vocabMax: 30, maxSentenceWords: 28 },
    6: { label: 'GEPT Advanced',             cefr: 'C2', vocabMin: 18, vocabMax: 40, maxSentenceWords: 35 },
};

export const TOCFL_LEVELS: Record<LevelNumber, LevelDetail> = {
    1: { label: 'TOCFL Band A (Level 1)',  cefr: 'A1', vocabMin: 5,  vocabMax: 10, maxSentenceWords: 6  },
    2: { label: 'TOCFL Band A (Level 2)',  cefr: 'A2', vocabMin: 8,  vocabMax: 15, maxSentenceWords: 10 },
    3: { label: 'TOCFL Band B (Level 3)',  cefr: 'B1', vocabMin: 10, vocabMax: 20, maxSentenceWords: 14 },
    4: { label: 'TOCFL Band B (Level 4)',  cefr: 'B2', vocabMin: 12, vocabMax: 25, maxSentenceWords: 18 },
    5: { label: 'TOCFL Band C (Level 5)',  cefr: 'C1', vocabMin: 15, vocabMax: 30, maxSentenceWords: 22 },
    6: { label: 'TOCFL Band C (Level 6)',  cefr: 'C2', vocabMin: 18, vocabMax: 40, maxSentenceWords: 28 },
};

export const GRADE_LEVELS: Record<LevelNumber, LevelDetail> = {
    1: { label: 'Grade 1', cefr: 'A1', vocabMin: 3,  vocabMax: 8,  maxSentenceWords: 6  },
    2: { label: 'Grade 2', cefr: 'A1', vocabMin: 5,  vocabMax: 10, maxSentenceWords: 8  },
    3: { label: 'Grade 3', cefr: 'A2', vocabMin: 6,  vocabMax: 12, maxSentenceWords: 10 },
    4: { label: 'Grade 4', cefr: 'A2', vocabMin: 8,  vocabMax: 15, maxSentenceWords: 14 },
    5: { label: 'Grade 5', cefr: 'B1', vocabMin: 10, vocabMax: 18, maxSentenceWords: 18 },
    6: { label: 'Grade 6', cefr: 'B1', vocabMin: 12, vocabMax: 20, maxSentenceWords: 20 },
};

// ── Utility Functions ────────────────────────────────────────────────

function getFrameworkTable(framework: Framework): Record<LevelNumber, LevelDetail> {
    switch (framework) {
        case 'GEPT':  return GEPT_LEVELS;
        case 'TOCFL': return TOCFL_LEVELS;
        case 'GRADE': return GRADE_LEVELS;
    }
}

function inferFramework(language: LanguageTrack, category: LearnerCategory): Framework {
    if (category === 'child') return 'GRADE';
    return language === 'en' ? 'GEPT' : 'TOCFL';
}

export function buildProficiency(
    language: LanguageTrack,
    category: LearnerCategory,
    level: LevelNumber,
    framework?: Framework
): ProficiencyLevel {
    const fw = framework ?? inferFramework(language, category);
    const table = getFrameworkTable(fw);
    const detail = table[level];
    return {
        language,
        category,
        framework: fw,
        level,
        label: detail.label,
        cefr: detail.cefr,
    };
}

export function getVocabTargetForLevel(
    framework: Framework,
    level: LevelNumber
): { min: number; max: number } {
    const table = getFrameworkTable(framework);
    const detail = table[level];
    return { min: detail.vocabMin, max: detail.vocabMax };
}

export function getSentenceComplexityForLevel(
    framework: Framework,
    level: LevelNumber
): number {
    const table = getFrameworkTable(framework);
    return table[level].maxSentenceWords;
}

export function isLevelAppropriate(
    framework: Framework,
    planLevel: LevelNumber,
    itemLevel: LevelNumber
): boolean {
    // Items can be at the plan level or one level below (review material)
    return itemLevel <= planLevel && itemLevel >= Math.max(1, planLevel - 1) as LevelNumber;
}

export function compareLevels(a: ProficiencyLevel, b: ProficiencyLevel): number {
    // Compare within same framework first by level number
    if (a.framework === b.framework) {
        return a.level - b.level;
    }
    // Cross-framework: compare by CEFR mapping
    const cefrOrder: Record<string, number> = { 'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6 };
    return (cefrOrder[a.cefr] || 0) - (cefrOrder[b.cefr] || 0);
}
