import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../language/LanguageContext';

interface ProficiencyQuizProps {
    onChange: (data: { level: string }) => void;
    age?: number;
    targetLanguage?: 'en' | 'zh';
    onFinish?: (level: number, label: string) => void;
}

// Data Structure
type Question = {
    id: string;
    lang: 'en' | 'zh';
    difficulty: number; // 1-6
    text: string;
    options: { text: string; correct: boolean }[];
    type?: 'child';
};

// ----------------------------------------------------------------------------
// LARGE MOCK POOL (Targeting ~30+ items per track)
// ----------------------------------------------------------------------------
const BASE_POOL: Question[] = [
    // --- CHILD EN (Grades 1-6) ---
    { id: 'c_en_1', lang: 'en', difficulty: 1, text: "Grade 1: What color is a banana?", options: [{ text: "Yellow", correct: true }, { text: "Blue", correct: false }, { text: "Red", correct: false }], type: 'child' },
    { id: 'c_en_2', lang: 'en', difficulty: 1, text: "Grade 1: 1 + 1 = ?", options: [{ text: "Two", correct: true }, { text: "Five", correct: false }, { text: "Ten", correct: false }], type: 'child' },
    { id: 'c_en_3', lang: 'en', difficulty: 2, text: "Grade 2: A cat says ___.", options: [{ text: "Meow", correct: true }, { text: "Woof", correct: false }, { text: "Moo", correct: false }], type: 'child' },
    { id: 'c_en_4', lang: 'en', difficulty: 2, text: "Grade 2: I ___ playing.", options: [{ text: "am", correct: true }, { text: "is", correct: false }, { text: "are", correct: false }], type: 'child' },
    { id: 'c_en_5', lang: 'en', difficulty: 3, text: "Grade 3: We ___ to the park yesterday.", options: [{ text: "walked", correct: true }, { text: "walk", correct: false }, { text: "walking", correct: false }], type: 'child' },
    { id: 'c_en_6', lang: 'en', difficulty: 3, text: "Grade 3: She is my ___.", options: [{ text: "sister", correct: true }, { text: "car", correct: false }, { text: "apple", correct: false }], type: 'child' },
    { id: 'c_en_7', lang: 'en', difficulty: 4, text: "Grade 4: Opposites: Big and ___", options: [{ text: "Small", correct: true }, { text: "Tall", correct: false }, { text: "Huge", correct: false }], type: 'child' },
    { id: 'c_en_8', lang: 'en', difficulty: 4, text: "Grade 4: He drives a ___.", options: [{ text: "car", correct: true }, { text: "read", correct: false }, { text: "sky", correct: false }], type: 'child' },
    { id: 'c_en_9', lang: 'en', difficulty: 5, text: "Grade 5: The sun ___ in the morning.", options: [{ text: "rises", correct: true }, { text: "rising", correct: false }, { text: "rose", correct: false }], type: 'child' },
    { id: 'c_en_10', lang: 'en', difficulty: 5, text: "Grade 5: Geography: Paris is in ___.", options: [{ text: "France", correct: true }, { text: "Spain", correct: false }, { text: "UK", correct: false }], type: 'child' },
    { id: 'c_en_11', lang: 'en', difficulty: 6, text: "Grade 6: If I ___ rich, I would travel.", options: [{ text: "were", correct: true }, { text: "am", correct: false }, { text: "was", correct: false }], type: 'child' },
    { id: 'c_en_12', lang: 'en', difficulty: 6, text: "Grade 6: Photosynthesis needs ___.", options: [{ text: "Light", correct: true }, { text: "Dark", correct: false }, { text: "Moon", correct: false }], type: 'child' },

    // --- CHILD ZH (Grades 1-6) ---
    { id: 'c_zh_1', lang: 'zh', difficulty: 1, text: "一年級: 這是什麼？ 🍎", options: [{ text: "蘋果", correct: true }, { text: "香蕉", correct: false }, { text: "西瓜", correct: false }], type: 'child' },
    { id: 'c_zh_2', lang: 'zh', difficulty: 1, text: "一年級: 1, 2, 3, ___", options: [{ text: "4", correct: true }, { text: "8", correct: false }, { text: "0", correct: false }], type: 'child' },
    { id: 'c_zh_3', lang: 'zh', difficulty: 2, text: "二年級: 太陽在___。", options: [{ text: "天上", correct: true }, { text: "水裡", correct: false }, { text: "地下", correct: false }], type: 'child' },
    { id: 'c_zh_4', lang: 'zh', difficulty: 2, text: "二年級: 我___吃飯。", options: [{ text: "要", correct: true }, { text: "不", correct: false }, { text: "沒", correct: false }], type: 'child' },
    { id: 'c_zh_5', lang: 'zh', difficulty: 3, text: "三年級: 魚在___游。", options: [{ text: "水裡", correct: true }, { text: "樹上", correct: false }, { text: "天上", correct: false }], type: 'child' },
    { id: 'c_zh_6', lang: 'zh', difficulty: 3, text: "三年級: 小狗___叫。", options: [{ text: "汪汪", correct: true }, { text: "喵喵", correct: false }, { text: "吱吱", correct: false }], type: 'child' },
    { id: 'c_zh_7', lang: 'zh', difficulty: 4, text: "四年級: 媽媽去___買菜。", options: [{ text: "市場", correct: true }, { text: "學校", correct: false }, { text: "公園", correct: false }], type: 'child' },
    { id: 'c_zh_8', lang: 'zh', difficulty: 4, text: "四年級: 這是我的書___。", options: [{ text: "包", correct: true }, { text: "子", correct: false }, { text: "頭", correct: false }], type: 'child' },
    { id: 'c_zh_9', lang: 'zh', difficulty: 5, text: "五年級: 因為下雨，___。", options: [{ text: "所以帶傘", correct: true }, { text: "所以吃飯", correct: false }, { text: "所以睡覺", correct: false }], type: 'child' },
    { id: 'c_zh_10', lang: 'zh', difficulty: 5, text: "五年級: 他跑得___快。", options: [{ text: "很", correct: true }, { text: "是", correct: false }, { text: "有", correct: false }], type: 'child' },
    { id: 'c_zh_11', lang: 'zh', difficulty: 6, text: "六年級: 祝你___。", options: [{ text: "一路順風", correct: true }, { text: "一路好走", correct: false }, { text: "馬馬虎虎", correct: false }], type: 'child' },
    { id: 'c_zh_12', lang: 'zh', difficulty: 6, text: "六年級: 只要努力，就___成功。", options: [{ text: "會", correct: true }, { text: "能", correct: false }, { text: "要", correct: false }], type: 'child' },

    // --- EN GEPT (Targets A1-C2) ---
    // A1
    { id: 'e_1', lang: 'en', difficulty: 1, text: "Hi, how ___ you?", options: [{ text: "are", correct: true }, { text: "is", correct: false }, { text: "be", correct: false }] },
    { id: 'e_2', lang: 'en', difficulty: 1, text: "I ___ an apple.", options: [{ text: "have", correct: true }, { text: "has", correct: false }, { text: "having", correct: false }] },
    { id: 'e_3', lang: 'en', difficulty: 1, text: "She ___ happy.", options: [{ text: "is", correct: true }, { text: "are", correct: false }, { text: "am", correct: false }] },
    { id: 'e_4', lang: 'en', difficulty: 1, text: "Good ___ description.", options: [{ text: "Morning", correct: true }, { text: "Moon", correct: false }, { text: "Mourning", correct: false }] },
    { id: 'e_5', lang: 'en', difficulty: 1, text: "This is ___ book.", options: [{ text: "my", correct: true }, { text: "I", correct: false }, { text: "mine", correct: false }] },
    // A2
    { id: 'e_6', lang: 'en', difficulty: 2, text: "Yesterday, I ___ to school.", options: [{ text: "walked", correct: true }, { text: "walk", correct: false }, { text: "walking", correct: false }] },
    { id: 'e_7', lang: 'en', difficulty: 2, text: "The train ___ at 5 PM.", options: [{ text: "leaves", correct: true }, { text: "leaving", correct: false }, { text: "leaf", correct: false }] },
    { id: 'e_8', lang: 'en', difficulty: 2, text: "Wait ___ me.", options: [{ text: "for", correct: true }, { text: "to", correct: false }, { text: "at", correct: false }] },
    { id: 'e_9', lang: 'en', difficulty: 2, text: "He is taller ___ me.", options: [{ text: "than", correct: true }, { text: "then", correct: false }, { text: "that", correct: false }] },
    { id: 'e_10', lang: 'en', difficulty: 2, text: "I don't have ___ money.", options: [{ text: "any", correct: true }, { text: "some", correct: false }, { text: "none", correct: false }] },
    // B1
    { id: 'e_11', lang: 'en', difficulty: 3, text: "If it rains, I ___ stay home.", options: [{ text: "will", correct: true }, { text: "would", correct: false }, { text: "had", correct: false }] },
    { id: 'e_12', lang: 'en', difficulty: 3, text: "I have lived here ___ 2010.", options: [{ text: "since", correct: true }, { text: "for", correct: false }, { text: "ago", correct: false }] },
    { id: 'e_13', lang: 'en', difficulty: 3, text: "The car was ___ by him.", options: [{ text: "fixed", correct: true }, { text: "fixing", correct: false }, { text: "fix", correct: false }] },
    { id: 'e_14', lang: 'en', difficulty: 3, text: "Do you mind ___ the window?", options: [{ text: "opening", correct: true }, { text: "open", correct: false }, { text: "to open", correct: false }] },
    { id: 'e_15', lang: 'en', difficulty: 3, text: "I look forward to ___ you.", options: [{ text: "meeting", correct: true }, { text: "meet", correct: false }, { text: "met", correct: false }] },
    // B2
    { id: 'e_16', lang: 'en', difficulty: 4, text: "He is accused ___ theft.", options: [{ text: "of", correct: true }, { text: "for", correct: false }, { text: "with", correct: false }] },
    { id: 'e_17', lang: 'en', difficulty: 4, text: "I wish I ___ harder last year.", options: [{ text: "had studied", correct: true }, { text: "studied", correct: false }, { text: "have studied", correct: false }] },
    { id: 'e_18', lang: 'en', difficulty: 4, text: "___ the weather, we went out.", options: [{ text: "Despite", correct: true }, { text: "Although", correct: false }, { text: "Even", correct: false }] },
    { id: 'e_19', lang: 'en', difficulty: 4, text: "It's high time we ___.", options: [{ text: "left", correct: true }, { text: "leave", correct: false }, { text: "leaving", correct: false }] },
    { id: 'e_20', lang: 'en', difficulty: 4, text: "She suggested ___ to the cinema.", options: [{ text: "going", correct: true }, { text: "to go", correct: false }, { text: "go", correct: false }] },
    // C1
    { id: 'e_21', lang: 'en', difficulty: 5, text: "No sooner had he arrived ___ he left.", options: [{ text: "than", correct: true }, { text: "when", correct: false }, { text: "then", correct: false }] },
    { id: 'e_22', lang: 'en', difficulty: 5, text: "Little ___ he know about the surprise.", options: [{ text: "did", correct: true }, { text: "does", correct: false }, { text: "do", correct: false }] },
    { id: 'e_23', lang: 'en', difficulty: 5, text: "This needs to be done, ___ costs.", options: [{ text: "regardless of", correct: true }, { text: "regarding", correct: false }, { text: "regards", correct: false }] },
    { id: 'e_24', lang: 'en', difficulty: 5, text: "He is a man of ___ integrity.", options: [{ text: "unimpeachable", correct: true }, { text: "impeachable", correct: false }, { text: "peach", correct: false }] },
    { id: 'e_25', lang: 'en', difficulty: 5, text: "The policy was ___ void.", options: [{ text: "null and", correct: true }, { text: "null or", correct: false }, { text: "void and", correct: false }] },
    // C2
    { id: 'e_26', lang: 'en', difficulty: 6, text: "He is prone to ___.", options: [{ text: "exaggeration", correct: true }, { text: "exaggerating", correct: false }, { text: "exaggerate", correct: false }] },
    { id: 'e_27', lang: 'en', difficulty: 6, text: "The argument was ___.", options: [{ text: "fallacious", correct: true }, { text: "fallback", correct: false }, { text: "falling", correct: false }] },
    { id: 'e_28', lang: 'en', difficulty: 6, text: "Select synonym: 'Ephemeral'", options: [{ text: "Transient", correct: true }, { text: "Lasting", correct: false }, { text: "Solid", correct: false }] },
    { id: 'e_29', lang: 'en', difficulty: 6, text: "To ___ the impact.", options: [{ text: "mitigate", correct: true }, { text: "mitigation", correct: false }, { text: "militate", correct: false }] },
    { id: 'e_30', lang: 'en', difficulty: 6, text: "A ___ of errors.", options: [{ text: "comedy", correct: true }, { text: "comic", correct: false }, { text: "comically", correct: false }] },

    // --- ZH TOCFL (Targets A1-C2) ---
    // A1
    { id: 'z_1', lang: 'zh', difficulty: 1, text: "你好___？", options: [{ text: "嗎", correct: true }, { text: "呢", correct: false }, { text: "吧", correct: false }] },
    { id: 'z_2', lang: 'zh', difficulty: 1, text: "我是___國人。", options: [{ text: "美", correct: true }, { text: "沒", correct: false }, { text: "妹", correct: false }] },
    { id: 'z_3', lang: 'zh', difficulty: 1, text: "我要___水。", options: [{ text: "喝", correct: true }, { text: "吃", correct: false }, { text: "看", correct: false }] },
    { id: 'z_4', lang: 'zh', difficulty: 1, text: "現在幾___？", options: [{ text: "點", correct: true }, { text: "分", correct: false }, { text: "天", correct: false }] },
    { id: 'z_5', lang: 'zh', difficulty: 1, text: "這是___書？", options: [{ text: "什麼", correct: true }, { text: "誰", correct: false }, { text: "哪", correct: false }] },
    // A2
    { id: 'z_6', lang: 'zh', difficulty: 2, text: "我昨天___去台北。", options: [{ text: "沒", correct: true }, { text: "不", correct: false }, { text: "別", correct: false }] },
    { id: 'z_7', lang: 'zh', difficulty: 2, text: "請___我一杯茶。", options: [{ text: "給", correct: true }, { text: "送", correct: false }, { text: "拿", correct: false }] },
    { id: 'z_8', lang: 'zh', difficulty: 2, text: "這件事___容易。", options: [{ text: "不", correct: true }, { text: "沒", correct: false }, { text: "否", correct: false }] },
    { id: 'z_9', lang: 'zh', difficulty: 2, text: "我家___學校很近。", options: [{ text: "離", correct: true }, { text: "從", correct: false }, { text: "在", correct: false }] },
    { id: 'z_10', lang: 'zh', difficulty: 2, text: "他___生病了。", options: [{ text: "好像", correct: true }, { text: "好想", correct: false }, { text: "好象", correct: false }] },
    // B1
    { id: 'z_11', lang: 'zh', difficulty: 3, text: "雖然下雨，___我還是去了。", options: [{ text: "但是", correct: true }, { text: "所以", correct: false }, { text: "因為", correct: false }] },
    { id: 'z_12', lang: 'zh', difficulty: 3, text: "這本書被他___走了。", options: [{ text: "借", correct: true }, { text: "偷", correct: false }, { text: "拿", correct: false }] },
    { id: 'z_13', lang: 'zh', difficulty: 3, text: "把門___上。", options: [{ text: "關", correct: true }, { text: "開", correct: false }, { text: "打", correct: false }] },
    { id: 'z_14', lang: 'zh', difficulty: 3, text: "只要努力，___會成功。", options: [{ text: "就", correct: true }, { text: "才", correct: false }, { text: "再", correct: false }] },
    { id: 'z_15', lang: 'zh', difficulty: 3, text: "除了英文，我___會中文。", options: [{ text: "也", correct: true }, { text: "都", correct: false }, { text: "還", correct: false }] },
    // B2
    { id: 'z_16', lang: 'zh', difficulty: 4, text: "無論如何，我___支持你。", options: [{ text: "都", correct: true }, { text: "也", correct: false }, { text: "還", correct: false }] },
    { id: 'z_17', lang: 'zh', difficulty: 4, text: "這篇文章___有意思。", options: [{ text: "頗", correct: true }, { text: "波", correct: false }, { text: "玻", correct: false }] },
    { id: 'z_18', lang: 'zh', difficulty: 4, text: "他___答應了我的請求。", options: [{ text: "終於", correct: true }, { text: "總算", correct: false }, { text: "最後", correct: false }] },
    { id: 'z_19', lang: 'zh', difficulty: 4, text: "這對雙胞胎長得___。", options: [{ text: "一模一樣", correct: true }, { text: "亂七八糟", correct: false }, { text: "獨一無二", correct: false }] },
    { id: 'z_20', lang: 'zh', difficulty: 4, text: "受環境___，他變壞了。", options: [{ text: "影響", correct: true }, { text: "影嚮", correct: false }, { text: "引響", correct: false }] },
    // C1
    { id: 'z_21', lang: 'zh', difficulty: 5, text: "此事刻不___。", options: [{ text: "容緩", correct: true }, { text: "榮緩", correct: false }, { text: "容換", correct: false }] },
    { id: 'z_22', lang: 'zh', difficulty: 5, text: "他的貢獻___。", options: [{ text: "有目共睹", correct: true }, { text: "目不轉睛", correct: false }, { text: "耳濡目染", correct: false }] },
    { id: 'z_23', lang: 'zh', difficulty: 5, text: "這是一個___的決定。", options: [{ text: "草率", correct: true }, { text: "草地", correct: false }, { text: "潦草", correct: false }] },
    { id: 'z_24', lang: 'zh', difficulty: 5, text: "必須___這個問題。", options: [{ text: "正視", correct: true }, { text: "重視", correct: false }, { text: "無視", correct: false }] },
    { id: 'z_25', lang: 'zh', difficulty: 5, text: "情況___惡化。", options: [{ text: "日益", correct: true }, { text: "日義", correct: false }, { text: "日易", correct: false }] },
    // C2
    { id: 'z_26', lang: 'zh', difficulty: 6, text: "他的文章___深刻。", options: [{ text: "寓意", correct: true }, { text: "意義", correct: false }, { text: "意見", correct: false }] },
    { id: 'z_27', lang: 'zh', difficulty: 6, text: "這是一場___的災難。", options: [{ text: "空前絕後", correct: true }, { text: "前所未有", correct: false }, { text: "史無前例", correct: false }] },
    { id: 'z_28', lang: 'zh', difficulty: 6, text: "為人要___。", options: [{ text: "光明磊落", correct: true }, { text: "光明正大", correct: false }, { text: "正大光明", correct: false }] },
    { id: 'z_29', lang: 'zh', difficulty: 6, text: "飲水___。", options: [{ text: "思源", correct: true }, { text: "思考", correct: false }, { text: "思念", correct: false }] },
    { id: 'z_30', lang: 'zh', difficulty: 6, text: "他是這行的___。", options: [{ text: "泰斗", correct: true }, { text: "太斗", correct: false }, { text: "大斗", correct: false }] },
];

function shuffle<T>(array: T[]): T[] {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}

export const ProficiencyQuiz: React.FC<ProficiencyQuizProps> = ({ onChange, age, targetLanguage, onFinish }) => {
    const { t, language } = useLanguage();

    // State
    const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [history, setHistory] = useState<boolean[]>([]); // Track correct/incorrect
    const [finished, setFinished] = useState(false);
    const [resultLevel, setResultLevel] = useState('');
    const [shuffledOptions, setShuffledOptions] = useState<any[]>([]);
    const [quizTitle, setQuizTitle] = useState('');

    useEffect(() => {
        const isChild = age && age <= 12;
        // If targetLanguage is provided, use it. Otherwise fallback to UI language switch.
        const targetLang = targetLanguage || (language === 'en' ? 'zh' : 'en');

        let selected: Question[] = [];
        let title = '';

        if (targetLang === 'en') {
            // Target is English
            if (isChild) {
                // Child: Filter for 'child' type EN
                title = "Grade School Proficiency Test";
                const childPool = BASE_POOL.filter(q => q.lang === 'en' && q.type === 'child');
                selected = childPool.sort((a, b) => a.difficulty - b.difficulty);
            } else {
                // Adult: Filter for standard EN
                title = "GEPT Proficiency Test";
                const adultPool = BASE_POOL.filter(q => q.lang === 'en' && !q.type);
                selected = adultPool.sort((a, b) => a.difficulty - b.difficulty);
            }
        } else {
            // Target is Mandarin
            // Use Standard ZH questions
            // Assuming adults for now as per requirement (Chinese study students are all adults)
            title = t({ en: "Chinese Proficiency Test", zh: "中文能力測驗" });
            const zhPool = BASE_POOL.filter(q => q.lang === 'zh' && !q.type);
            selected = zhPool.sort((a, b) => a.difficulty - b.difficulty);
        }

        // Limit to 30 if we have more
        if (selected.length > 30) selected = selected.slice(0, 30);

        setActiveQuestions(selected);
        setQuizTitle(title);
        setCurrentIdx(0);
        setHistory([]);
        setFinished(false);
    }, [language, age, targetLanguage]);

    useEffect(() => {
        if (activeQuestions.length > 0 && activeQuestions[currentIdx]) {
            setShuffledOptions(shuffle(activeQuestions[currentIdx].options));
        }
    }, [currentIdx, activeQuestions]);

    const handleAnswer = (isCorrect: boolean) => {
        const newHistory = [...history, isCorrect];
        setHistory(newHistory);

        // Check 3 out of 5 Wrong Termination Rule
        const recentWindow = newHistory.slice(-5);
        const wrongCount = recentWindow.filter(pass => !pass).length;

        if (wrongCount >= 3 || currentIdx >= activeQuestions.length - 1) {
            finalizeTest(newHistory);
        } else {
            setCurrentIdx(prev => prev + 1);
        }
    };

    const finalizeTest = (finalHistory: boolean[]) => {
        const isChild = age && age <= 12;

        // Determine Level
        let highestDiff = 0;
        finalHistory.forEach((passed, idx) => {
            if (passed && activeQuestions[idx]) {
                const qDiff = activeQuestions[idx].difficulty;
                if (qDiff > highestDiff) highestDiff = qDiff;
            }
        });

        // Determine Label
        let levelLabel = '';
        let levelNum = 1;

        if (language !== 'en') {
            // UI is Chinese (TW/CN) -> Target is English
            if (isChild) {
                // English Child -> Gradeschool Levels
                levelLabel = `Grade ${Math.max(1, highestDiff)}`;
                levelNum = Math.max(1, highestDiff);
            } else {
                // English Adult -> GEPT
                if (highestDiff >= 6) { levelLabel = 'GEPT Advanced'; levelNum = 6; }
                else if (highestDiff >= 5) { levelLabel = 'GEPT High-Intermediate'; levelNum = 5; }
                else if (highestDiff >= 4) { levelLabel = 'GEPT Intermediate'; levelNum = 4; }
                else if (highestDiff >= 3) { levelLabel = 'GEPT Elementary (High)'; levelNum = 3; }
                else if (highestDiff >= 2) { levelLabel = 'GEPT Elementary'; levelNum = 2; }
                else { levelLabel = 'GEPT Basic'; levelNum = 1; }
            }
        } else {
            // UI is English -> Target is Mandarin (TOCFL)
            if (highestDiff >= 6) { levelLabel = 'TOCFL Band C (Level 6)'; levelNum = 6; }
            else if (highestDiff >= 5) { levelLabel = 'TOCFL Band C (Level 5)'; levelNum = 5; }
            else if (highestDiff >= 4) { levelLabel = 'TOCFL Band B (Level 4)'; levelNum = 4; }
            else if (highestDiff >= 3) { levelLabel = 'TOCFL Band B (Level 3)'; levelNum = 3; }
            else if (highestDiff >= 2) { levelLabel = 'TOCFL Band A (Level 2)'; levelNum = 2; }
            else { levelLabel = 'TOCFL Band A (Level 1)'; levelNum = 1; }
        }

        const appSetting = (highestDiff >= 3) ? 'Advanced' : 'Beginner';

        setResultLevel(levelLabel);
        setFinished(true);
        onChange({ level: appSetting });
        if (onFinish) onFinish(levelNum, levelLabel);
    };

    if (activeQuestions.length === 0) return <div>{t({ en: 'Loading...', zh: '載入中...' })}</div>;

    if (finished) {
        return (
            <div className="card" style={{ padding: '2rem', textAlign: 'center', animation: 'fadeIn 0.5s' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                    {t({ en: 'Assessment Complete', zh: '評估完成' })}
                </h3>
                <div style={{ fontSize: '4rem', margin: '2rem 0' }}>🎉</div>
                <div style={{ marginBottom: '2rem' }}>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                        {t({ en: 'Your Estimated Level', zh: '您的預估等級' })}
                    </p>
                    <h2 style={{ fontSize: '2rem', color: 'var(--color-text-primary)' }}>
                        {resultLevel}
                    </h2>
                </div>
                <button className="btn-primary" onClick={() => { }} style={{ pointerEvents: 'none', opacity: 0.8 }}>
                    {t({ en: 'Level Set', zh: '已設定等級' })}
                </button>
            </div>
        );
    }

    const q = activeQuestions[currentIdx];

    return (
        <div className="card" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.2rem', color: 'var(--color-primary)' }}>
                {quizTitle}
            </h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                <span>{t({ en: `Question ${currentIdx + 1} / ${activeQuestions.length}`, zh: `第 ${currentIdx + 1} / ${activeQuestions.length} 題` })}</span>
            </div>

            <h3 style={{ fontSize: '1.4rem', marginBottom: '2rem', lineHeight: 1.4, minHeight: '3em' }}>
                {q.text}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {shuffledOptions.map((opt, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleAnswer(opt.correct)}
                        className="btn-secondary"
                        style={{
                            textAlign: 'left',
                            padding: '1rem',
                            fontSize: '1.1rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        {opt.text}
                    </button>
                ))}
            </div>

            <div style={{ marginTop: '2rem', height: '4px', background: 'var(--color-bg-base)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{
                    height: '100%',
                    width: `${((currentIdx) / activeQuestions.length) * 100}%`,
                    background: 'var(--color-primary)',
                    transition: 'width 0.3s ease'
                }} />
            </div>
        </div>
    );
};
