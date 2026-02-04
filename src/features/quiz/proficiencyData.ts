
export interface Question {
    id: number;
    difficulty: number; // 1-40
    question: string;
    options: string[];
    correctIndex: number;
}

export const englishQuestions: Question[] = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    difficulty: i + 1,
    question: `English Level ${i + 1} Question: Select the correct word.`,
    options: ["Option A", "Option B", "Option C", "Correct Answer"],
    correctIndex: 3
})).map((q, i) => {
    // Inject some real-ish content for the first few levels
    if (i === 0) return { ...q, question: "Select the correct greeting: 'Hello, how ___ you?'", options: ["is", "are", "am", "be"], correctIndex: 1 };
    if (i === 1) return { ...q, question: "I ___ a student.", options: ["is", "be", "am", "are"], correctIndex: 2 };
    if (i === 5) return { ...q, question: "She ___ to the store yesterday.", options: ["go", "gone", "went", "going"], correctIndex: 2 };
    if (i === 10) return { ...q, question: "If I ___ known, I would have called.", options: ["have", "had", "has", "having"], correctIndex: 1 };
    if (i === 20) return { ...q, question: "The phenomenon is characterized ___ its variability.", options: ["at", "with", "by", "on"], correctIndex: 2 };
    if (i === 39) return { ...q, question: "Choose the synonym for 'Ephemeral':", options: ["Lasting", "Transient", "Solid", "Eternal"], correctIndex: 1 };
    return q;
});

export const chineseQuestions: Question[] = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    difficulty: i + 1,
    question: `中文等級 ${i + 1} 題目: 請選擇正確的字詞填空`,
    options: ["選項 A", "選項 B", "選項 C", "正解"],
    correctIndex: 3
})).map((q, i) => {
    if (i === 0) return { ...q, question: "你好嗎? 我很___，謝謝!", options: ["不", "好", "沒", "是"], correctIndex: 1 };
    if (i === 1) return { ...q, question: "我是學生。___是老師。", options: ["你", "他", "我", "她"], correctIndex: 1 };
    if (i === 5) return { ...q, question: "昨天我去___商店買東西。", options: ["了", "的", "得", "地"], correctIndex: 0 };
    if (i === 10) return { ...q, question: "如果我早知___，我就會打電話給你。", options: ["到", "道", "導", "倒"], correctIndex: 1 };
    if (i === 20) return { ...q, question: "這個現象被___為多變性。", options: ["稱", "叫", "為", "做"], correctIndex: 0 };
    if (i === 39) return { ...q, question: "選擇 '曇花一現' 的同義詞: ___", options: ["天長地久", "稍縱即逝", "堅若磐石", "永恆"], correctIndex: 1 };
    return q;
});

export const getQuestions = (language: 'en' | 'zh'): Question[] => {
    return language === 'zh' ? chineseQuestions : englishQuestions;
};
