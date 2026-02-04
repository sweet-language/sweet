
export interface GeneratedStory {
    title: string;
    content: string;
    imageUrl?: string;
    level?: string;
    vocab?: string[];
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'ai';
    text: string;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const aiService = {

    // -----------------------------------------
    // 3. New Vision Capability (Textbook -> Story)
    // -----------------------------------------
    generateStoryFromImage: async (imageBase64: string, lang: string): Promise<GeneratedStory> => {
        // Remove data:image/jpeg;base64, prefix if present
        const cleanBase64 = imageBase64.split(',')[1] || imageBase64;

        if (GEMINI_API_KEY) {
            try {
                const prompt = {
                    contents: [{
                        parts: [
                            {
                                text: lang === 'zh-TW'
                                    ? "分析這張教科書圖片。提取關鍵詞彙和語法重點。然後，寫一個有趣、簡短的故事（約 150 字），使用這些詞彙來教學。回傳純 JSON 格式：{ \"title\": \"標題\", \"content\": \"故事內容\", \"vocab\": [\"詞彙1\", \"詞彙2\"] }"
                                    : "Analyze this textbook page. Extract key vocabulary and grammar points. Then, write a fun, short story (approx 150 words) that uses these distinct words to teach the grammar. Return pure JSON: { \"title\": \"Title\", \"content\": \"Story Content...\", \"vocab\": [\"word1\", \"word2\"] }"
                            },
                            { inline_data: { mime_type: "image/jpeg", data: cleanBase64 } }
                        ]
                    }]
                };

                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(prompt)
                });

                const data = await response.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

                if (text) {
                    // Clean code blocks if present
                    const jsonStr = text.replace(/```json|```/g, '').trim();
                    const result = JSON.parse(jsonStr);
                    return {
                        title: result.title,
                        content: result.content,
                        vocab: result.vocab,
                        imageUrl: imageBase64 // Use the uploaded image as the cover!
                    };
                }
            } catch (error) {
                console.error("Vision Error:", error);
            }
        }

        // Fallback / Mock
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    title: lang === 'zh-TW' ? "魔法教科書 (模擬)" : "The Magic Textbook (Simulated)",
                    content: lang === 'zh-TW'
                        ? "這是一個模擬故事。我們偵測到圖片中有關於 '交通' 的內容。有一天，一台公車決定飛上天空..."
                        : "This is a simulated story. We detected 'Transportation' in your image. One day, a bus decided to fly into the sky...",
                    vocab: ["bus", "fly", "sky", "transportation"],
                    imageUrl: imageBase64
                });
            }, 1500);
        });
    },

    // Real Gemini Chat (or Fallback)
    chatWithMentor: async (history: ChatMessage[], lang: string): Promise<string> => {
        const lastMsg = history[history.length - 1].text;
        const lowerMsg = lastMsg.toLowerCase();
        const isEn = lang !== 'zh-TW' && lang !== 'zh-CN';

        // -----------------------------------------
        // 1. TRY REAL AI (If Key Exists)
        // -----------------------------------------
        if (GEMINI_API_KEY) {
            try {
                const systemInstruction = lang === 'zh-TW'
                    ? "你是 Elias，一位友善、樂於助人的雙語導師。請用繁體中文自然地回答學生的問題。不要過度說教，就像朋友聊天一樣。"
                    : "You are Elias, a friendly and helpful bilingual mentor. Answer the student's questions naturally. Don't be too preachy, just chat like a friend.";

                const prompt = {
                    contents: [
                        { role: "user", parts: [{ text: systemInstruction }] },
                        ...history.map(msg => ({
                            role: msg.role === 'ai' ? 'model' : 'user',
                            parts: [{ text: msg.text }]
                        }))
                    ]
                };

                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(prompt)
                });

                const data = await response.json();
                if (!data.error && data.candidates && data.candidates[0].content) {
                    return data.candidates[0].content.parts[0].text;
                }
                console.error("Gemini API Error (falling back to mock):", data.error);
            } catch (error) {
                console.error("Network Error (falling back to mock):", error);
            }
        }

        // -----------------------------------------
        // 2. FALLBACK: MOCK AI (Basic Conversation)
        // -----------------------------------------
        return new Promise((resolve) => {
            setTimeout(() => {
                // Greetings
                if (lowerMsg.match(/\b(hello|hi|hey|good morning|yo)\b/) || lastMsg.match(/你好|早安|嗨/)) {
                    resolve(isEn ? "Hi! How can I help?" : "嗨！有什麼我可以幫你的？");
                    return;
                }

                // Permission
                if (lowerMsg.match(/ask.*(question|something)/) || lowerMsg.includes('may i ask')) {
                    resolve(isEn ? "Sure, ask away." : "當然，請說。");
                    return;
                }

                // Simple "Who are you"
                if (lowerMsg.includes('who are you') || lowerMsg.includes('your name')) {
                    resolve(isEn ? "I'm Elias." : "我是 Elias。");
                    return;
                }

                // Generic Safe Responses
                const casualAnswers = isEn ? [
                    "That's interesting.",
                    "I see.",
                    "Tell me more.",
                    "I'm not sure about that one!",
                    "Can you say that in a different way?"
                ] : [
                    "很有趣。",
                    "我明白了。",
                    "多跟我說一點。",
                    "我不確定耶！",
                    "你可以換個方式說嗎？"
                ];

                resolve(casualAnswers[Math.floor(Math.random() * casualAnswers.length)]);

            }, 500);
        });
    },

    // Keep generateStory as mock for now, or upgrade similarly if needed
    generateStory: async (topic: string, lang: string, level: string = 'Beginner'): Promise<GeneratedStory> => {
        // Prevent lint errors
        console.log(`Generating story for ${topic} in ${lang} (${level})`);

        return new Promise((resolve) => {
            resolve({
                title: "Story Generation",
                content: "Please connect API for generic stories.",
                imageUrl: "/images/story-mock-1.jpg"
            });
        });
    }
};
