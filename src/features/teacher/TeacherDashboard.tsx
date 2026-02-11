import React, { useState, useEffect } from 'react';
import { useLanguage } from '../language/LanguageContext';
import { useAuth } from '../auth/AuthContext';
import { contentService } from '../../services/contentService';
import { aiService, type GeneratedStory } from '../../services/aiService'; // Import AI Service
import { LucideBookOpen, LucideImage, LucideWholeWord, LucideLanguages, LucideSend } from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
    const { t, language } = useLanguage();
    const { user } = useAuth();
    const [activeTool, setActiveTool] = useState<'photo' | 'vocab' | 'grammar' | 'images'>('vocab');

    // Form Inputs
    const [vocabList, setVocabList] = useState('');
    const [grammarTopic, setGrammarTopic] = useState('');

    // Photo Tool State
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [generatedContent, setGeneratedContent] = useState<GeneratedStory | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setGeneratedContent(null); // Reset previous result
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyzeImage = async () => {
        if (!imagePreview) return;
        setIsAnalyzing(true);
        try {
            const result = await aiService.generateStoryFromImage(imagePreview, language);
            setGeneratedContent(result);
        } catch (error) {
            alert('Analysis failed. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Groups State
    interface StudentGroup {
        id: string;
        name: string;
        studentIds: string[];
        joinCode?: string; // e.g. "CLASS-123"
    }
    const [groups, setGroups] = useState<StudentGroup[]>([]);
    const [activeGroupTab, setActiveGroupTab] = useState<string>('all'); // 'all' or group.id
    const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);

    // Load Groups
    useEffect(() => {
        const saved = localStorage.getItem('teacher-groups');
        if (saved) {
            setGroups(JSON.parse(saved));
        }
    }, []);

    const saveGroup = () => {
        if (!newGroupName.trim()) return;
        if (selectedStudentIds.length === 0) {
            alert('Select students to include in the group first!');
            return;
        }

        const newGroup: StudentGroup = {
            id: Date.now().toString(),
            name: newGroupName,
            studentIds: [...selectedStudentIds]
        };

        const updated = [...groups, newGroup];
        setGroups(updated);
        localStorage.setItem('teacher-groups', JSON.stringify(updated));

        setIsCreatingGroup(false);
        setNewGroupName('');
        setActiveGroupTab(newGroup.id);
        alert(`Group "${newGroup.name}" created!`);
    };

    const deleteGroup = (groupId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Delete this group?')) {
            const updated = groups.filter(g => g.id !== groupId);
            setGroups(updated);
            localStorage.setItem('teacher-groups', JSON.stringify(updated));
            if (activeGroupTab === groupId) setActiveGroupTab('all');
        }
    };

    // Assignment State
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    const [showPreview, setShowPreview] = useState(false);

    // Get Students
    const { getAllStudents } = useAuth();
    const students = getAllStudents().filter(s => s.linkedTeacherId === user?.id);

    // Toggle Selection
    const toggleStudent = (id: string) => {
        setSelectedStudentIds(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    // Filtered Students for Display
    const getDisplayedStudents = () => {
        let list = students;
        if (activeGroupTab !== 'all') {
            const group = groups.find(g => g.id === activeGroupTab);
            if (group) {
                list = students.filter(s => group.studentIds.includes(s.id));
            }
        }
        // Alpha Sort
        return list.sort((a, b) => a.id.localeCompare(b.id));
    };

    const displayedStudents = getDisplayedStudents();

    // Select All logic (scoped to current view)
    const toggleSelectAll = () => {
        const currentIds = displayedStudents.map(s => s.id);
        const allSelected = currentIds.every(id => selectedStudentIds.includes(id));

        if (allSelected) {
            // Deselect these
            setSelectedStudentIds(prev => prev.filter(id => !currentIds.includes(id)));
        } else {
            // Add missing
            const toAdd = currentIds.filter(id => !selectedStudentIds.includes(id));
            setSelectedStudentIds(prev => [...prev, ...toAdd]);
        }
    };


    // Generic Content Generator (for Preview & Sending)
    const getContentObject = () => {
        if (generatedContent && (activeTool === 'photo' || activeTool === 'images')) {
            return {
                title: generatedContent.title,
                content: generatedContent.content,
                vocab: generatedContent.vocab || []
            };
        } else if (activeTool === 'vocab') {
            return {
                title: 'Vocabulary Lesson',
                content: `Here is a story using your words: ${vocabList}. \n\n(AI Contextual Story Generation would happen here)`,
                vocab: vocabList.split(',').map(v => v.trim()).filter(v => v)
            };
        } else if (activeTool === 'grammar') {
            return {
                title: `Grammar Focus: ${grammarTopic}`,
                content: `Today we are learning about ${grammarTopic}. \n\nThis is a critical concept for mastering the language...`,
                vocab: []
            };
        }
        return null;
    };

    const handlePreview = () => {
        if (selectedStudentIds.length === 0) {
            alert(t({ en: 'Please select at least one student.', zh: '請至少選擇一位學生' }));
            setIsRosterModalOpen(true); // Open roster if none selected
            return;
        }

        const content = getContentObject();
        if (!content) {
            alert(t({ en: 'Please enter some content first.', zh: '請先輸入內容' }));
            return;
        }

        setShowPreview(true);
    };

    const handleConfirmSend = () => {
        if (!user || user.role !== 'teacher') return;

        const content = getContentObject();
        if (!content) return;

        // Batch Create
        selectedStudentIds.forEach(studentId => {
            contentService.createStory(
                user,
                studentId,
                content.title,
                content
            );
        });

        alert(`Successfully sent content to ${selectedStudentIds.length} students!`);

        // Reset
        setShowPreview(false);
        setGeneratedContent(null);
        setVocabList('');
        setGrammarTopic('');
        // setSelectedStudentIds([]); // Keep selected students for potential re-use
        setImagePreview(null);
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1rem', paddingBottom: '6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: '1px solid var(--color-text-muted)', paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '300', margin: 0 }}>
                    {t({ en: 'Teacher Content Studio', zh: '教師內容工作室' })}
                </h2>
                <button
                    onClick={() => setIsRosterModalOpen(true)}
                    className="btn-primary"
                    style={{
                        background: 'var(--color-bg-card)',
                        border: '1px solid var(--color-text-primary)',
                        color: 'var(--color-text-primary)',
                        fontSize: '0.9rem',
                        padding: '0.5rem 1rem'
                    }}
                >
                    {selectedStudentIds.length > 0
                        ? `${t({ en: 'Manage Students', zh: '管理學生' })} (${selectedStudentIds.length})`
                        : t({ en: 'Manage Students', zh: '管理學生' })}
                </button>
            </div>

            {/* Header Section */}
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#9ECA3B' }}>
                    {t({ en: 'Design Your Lesson', zh: '設計您的課程' })}
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem' }}>
                    {t({ en: 'Create magical content for your students.', zh: '為您的學生創造神奇的內容。' })}
                </p>
            </header>

            {/* Tool Selector */}
            <div className="teacher-tools" style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '4rem' }}>
                {[
                    { id: 'photo', icon: LucideImage, label: t({ en: 'Photo -> Content', zh: '照片 -> 內容' }) },
                    { id: 'vocab', icon: LucideWholeWord, label: t({ en: 'Vocab List', zh: '單詞列表' }) },
                    { id: 'grammar', icon: LucideLanguages, label: t({ en: 'Grammar Focus', zh: '語法重點' }) },
                    { id: 'images', icon: LucideBookOpen, label: t({ en: 'Story Images', zh: '故事圖片' }) },
                ].map((tool) => (
                    <button
                        key={tool.id}
                        onClick={() => setActiveTool(tool.id as any)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.8rem',
                            cursor: 'pointer',
                            background: 'transparent',
                            border: 'none',
                            padding: '1rem',
                            opacity: activeTool === tool.id ? 1 : 0.5,
                            borderBottom: activeTool === tool.id ? '2px solid #9ECA3B' : '2px solid transparent',
                            transition: 'all 0.3s'
                        }}
                    >
                        <tool.icon size={32} color={activeTool === tool.id ? '#9ECA3B' : 'var(--color-text-secondary)'} />
                        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>{tool.label}</span>
                    </button>
                ))}
            </div>

            {/* Tool Content */}
            <div style={{ animation: 'fadeIn 0.5s' }}>
                {activeTool === 'vocab' && (
                    <div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '300' }}>{t({ en: 'Create Story from Vocabulary', zh: '從單詞創建故事' })}</h3>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>{t({ en: 'Enter words separated by commas.', zh: '輸入以逗號分隔的單詞。' })}</p>
                        <textarea
                            value={vocabList}
                            onChange={(e) => setVocabList(e.target.value)}
                            style={{
                                width: '100%',
                                height: '200px',
                                background: 'transparent',
                                border: '1px solid var(--color-text-muted)',
                                borderRadius: '4px',
                                color: 'var(--color-text-primary)',
                                padding: '1rem',
                                marginBottom: '2rem',
                                resize: 'none',
                                fontSize: '1.2rem',
                                lineHeight: '1.6'
                            }}
                            placeholder="apple, run, happy..."
                        />
                    </div>
                )}

                {activeTool === 'grammar' && (
                    <div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{t({ en: 'Grammar Focus', zh: '語法重點' })}</h3>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>{t({ en: 'Select a grammar concept to target.', zh: '選擇一個語法概念作為目標。' })}</p>
                        <input
                            type="text"
                            value={grammarTopic}
                            onChange={(e) => setGrammarTopic(e.target.value)}
                            style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: '1px solid var(--color-text-muted)',
                                color: 'var(--color-text-primary)',
                                padding: '1rem 0',
                                marginBottom: '2rem',
                                fontSize: '1.5rem'
                            }}
                            placeholder="e.g. Past Tense..."
                        />
                    </div>
                )}

                {(activeTool === 'photo' || activeTool === 'images') && (
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        {!imagePreview ? (
                            <div style={{
                                border: '2px dashed var(--color-text-muted)',
                                borderRadius: '12px',
                                padding: '4rem 2rem',
                                transition: 'all 0.3s',
                                cursor: 'pointer',
                                background: 'rgba(0,0,0,0.02)'
                            }}
                                onClick={() => document.getElementById('cameraInput')?.click()}
                            >
                                <LucideImage size={48} color="var(--color-text-muted)" style={{ marginBottom: '1rem' }} />
                                <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    {t({ en: 'Tap to Take Photo or Upload', zh: '點擊拍照或上傳圖片' })}
                                </p>
                                <p style={{ color: 'var(--color-text-secondary)' }}>
                                    {t({ en: 'Textbooks, Notes, or anything!', zh: '教科書、筆記，任何教材皆可！' })}
                                </p>
                                <input
                                    id="cameraInput"
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    style={{ display: 'none' }}
                                    onChange={handleImageUpload}
                                />
                            </div>
                        ) : (
                            <div style={{ animation: 'fadeIn 0.5s' }}>
                                <div style={{ position: 'relative', maxWidth: '400px', margin: '0 auto 2rem' }}>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        style={{ width: '100%', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <button
                                        onClick={() => { setImagePreview(null); setGeneratedContent(null); }}
                                        style={{
                                            position: 'absolute', top: -10, right: -10,
                                            background: 'var(--color-text-primary)', color: 'var(--color-bg-primary)',
                                            border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer'
                                        }}
                                    >✕</button>
                                </div>

                                {!generatedContent ? (
                                    <button
                                        className="btn-primary"
                                        onClick={handleAnalyzeImage}
                                        disabled={isAnalyzing}
                                        style={{ fontSize: '1.2rem', padding: '1rem 2rem', opacity: isAnalyzing ? 0.7 : 1 }}
                                    >
                                        {isAnalyzing
                                            ? t({ en: 'Analyzing with AI...', zh: 'AI 正在分析中... (Gemini)' })
                                            : t({ en: '✨ Analyze & Generate Story', zh: '✨ 分析並生成故事' })
                                        }
                                    </button>
                                ) : (
                                    <div style={{
                                        textAlign: 'left',
                                        background: 'var(--color-bg-card)',
                                        padding: '2rem',
                                        borderRadius: '12px',
                                        border: '1px solid #9ECA3B',
                                        marginTop: '2rem'
                                    }}>
                                        <h3 style={{ color: '#9ECA3B', marginBottom: '1rem' }}>{generatedContent.title}</h3>
                                        <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', marginBottom: '1.5rem' }}>{generatedContent.content}</p>

                                        {generatedContent.vocab && (
                                            <div style={{ background: 'rgba(0,0,0,0.05)', padding: '1rem', borderRadius: '8px' }}>
                                                <strong>{t({ en: 'Key Vocabulary: ', zh: '關鍵詞彙：' })}</strong>
                                                {generatedContent.vocab.join(', ')}
                                            </div>
                                        )}

                                        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                                            {t({ en: 'Looks good? Select students below to assign!', zh: '看起來不錯？選擇下面的學生進行分配！' })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Removed Assignment Trigger */}

                {/* Roster Modal */}
                {isRosterModalOpen && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.6)', zIndex: 2000,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }} onClick={() => setIsRosterModalOpen(false)}>
                        <div style={{
                            width: '90%', maxWidth: '600px', height: '80vh',
                            background: 'var(--color-bg-base)', borderRadius: '16px',
                            display: 'flex', flexDirection: 'column', overflow: 'hidden',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
                        }} onClick={e => e.stopPropagation()}>

                            {/* Header */}
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border-scratch)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0 }}>{t({ en: 'Assign Students', zh: '分配學生' })}</h3>
                                <button onClick={() => setIsRosterModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-muted)' }}>✕</button>
                            </div>

                            {/* Group Tabs */}
                            <div style={{ padding: '1rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', borderBottom: '1px solid var(--color-border-scratch)' }}>
                                <button
                                    onClick={() => setActiveGroupTab('all')}
                                    style={{
                                        padding: '0.5rem 1rem', borderRadius: '20px', whiteSpace: 'nowrap',
                                        background: activeGroupTab === 'all' ? 'var(--color-accent-blue)' : 'transparent',
                                        color: activeGroupTab === 'all' ? 'white' : 'var(--color-text-primary)',
                                        border: '1px solid var(--color-accent-blue)', cursor: 'pointer'
                                    }}
                                >
                                    {t({ en: 'All Students', zh: '所有學生' })}
                                </button>
                                {groups.map(g => (
                                    <div key={g.id} style={{ position: 'relative' }}>
                                        <button
                                            onClick={() => setActiveGroupTab(g.id)}
                                            style={{
                                                padding: '0.5rem 1rem', borderRadius: '20px', whiteSpace: 'nowrap',
                                                background: activeGroupTab === g.id ? 'var(--color-accent-blue)' : 'transparent',
                                                color: activeGroupTab === g.id ? 'white' : 'var(--color-text-primary)',
                                                border: '1px solid var(--color-accent-blue)', cursor: 'pointer'
                                            }}
                                        >
                                            {g.name}
                                        </button>
                                        <div
                                            onClick={(e) => deleteGroup(g.id, e)}
                                            style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                        >✕</div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => setIsCreatingGroup(!isCreatingGroup)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '20px',
                                        border: '1px dashed var(--color-text-secondary)', // Lighter border
                                        color: 'var(--color-text-secondary)', // Lighter text
                                        background: 'transparent',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                        opacity: 0.8
                                    }}
                                >
                                    {t({ en: '+ New Class', zh: '+ 新班級' })}
                                </button>
                            </div>

                            {/* Create Group Form */}
                            {isCreatingGroup && (
                                <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.03)', display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        autoFocus
                                        placeholder={t({ en: 'Class Name (e.g. Morning Group)', zh: '班級名稱（例如：早班）' })}
                                        value={newGroupName}
                                        onChange={e => setNewGroupName(e.target.value)}
                                        style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-border-scratch)' }}
                                    />
                                    <button onClick={saveGroup} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>{t({ en: 'Save Selection', zh: '儲存選擇' })}</button>
                                </div>
                            )}

                            {/* Toolbar */}
                            <div style={{ padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                <span>{t({ en: 'Showing', zh: '顯示' })} {displayedStudents.length} {t({ en: 'students', zh: '學生' })} (A-Z)</span>
                                <button
                                    onClick={toggleSelectAll}
                                    style={{ background: 'transparent', border: 'none', color: 'var(--color-accent-blue)', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    {displayedStudents.every(s => selectedStudentIds.includes(s.id)) && displayedStudents.length > 0
                                        ? t({ en: 'Deselect All', zh: '取消全選' })
                                        : t({ en: 'Select All', zh: '全選' })}
                                </button>
                            </div>

                            {/* List */}
                            <div style={{ flex: 1, overflowY: 'auto', padding: '0 1rem 1rem' }}>
                                {displayedStudents.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                                        {t({ en: 'No students found in this view.', zh: '在此視圖中未找到學生。' })}
                                    </div>
                                ) : (
                                    displayedStudents.map(student => (
                                        <div
                                            key={student.id}
                                            onClick={() => toggleStudent(student.id)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '0.8rem',
                                                padding: '0.6rem 0.8rem', borderBottom: '1px solid var(--color-border-scratch)',
                                                background: selectedStudentIds.includes(student.id) ? 'rgba(0, 119, 237, 0.05)' : 'transparent',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <div style={{
                                                width: '18px', height: '18px', borderRadius: '3px',
                                                border: selectedStudentIds.includes(student.id) ? 'none' : '2px solid var(--color-text-muted)',
                                                background: selectedStudentIds.includes(student.id) ? 'var(--color-accent-blue)' : 'transparent',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                                                fontSize: '0.7rem'
                                            }}>
                                                {selectedStudentIds.includes(student.id) && '✓'}
                                            </div>
                                            <div style={{ fontSize: '1rem' }}>
                                                {student.id}
                                                <span style={{
                                                    fontSize: '0.8rem',
                                                    color: 'var(--color-text-secondary)',
                                                    background: 'rgba(0,0,0,0.05)',
                                                    padding: '2px 8px',
                                                    borderRadius: '10px',
                                                    marginLeft: '10px'
                                                }}>
                                                    {student.proficiencyLevel || 'No Score'}
                                                </span>
                                            </div>
                                            {selectedStudentIds.includes(student.id) && <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--color-accent-blue)' }}>{t({ en: 'Selected', zh: '已選擇' })}</span>}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--color-border-scratch)', textAlign: 'right' }}>
                                <button
                                    className="btn-primary"
                                    onClick={() => setIsRosterModalOpen(false)}
                                    style={{ width: '100%' }}
                                >
                                    {t({ en: 'Confirm Selection', zh: '確認選擇' })} ({selectedStudentIds.length})
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Floating Action Bar */}
                <div className="floating-action-bar" style={{
                    position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--color-bg-base)', padding: '1rem 2rem', borderRadius: '50px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)', border: '1px solid var(--color-border-scratch)',
                    display: 'flex', gap: '1rem', alignItems: 'center', zIndex: 100
                }}>
                    <span style={{ fontWeight: 'bold', color: 'var(--color-text-secondary)', marginRight: '1rem' }}>
                        {selectedStudentIds.length} {t({ en: 'Selected', zh: '已選擇' })}
                    </span>
                    <button
                        className="btn-primary"
                        onClick={handlePreview}
                        disabled={selectedStudentIds.length === 0}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: selectedStudentIds.length === 0 ? 0.5 : 1 }}
                    >
                        <LucideSend size={18} /> {t({ en: 'Review & Send', zh: '預覽並發送' })}
                    </button>
                </div>
            </div>

            {/* Preview Modal */}
            {showPreview && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', zIndex: 3000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
                }}>
                    <div style={{
                        background: 'var(--color-bg-base)', width: '100%', maxWidth: '600px',
                        padding: '2rem', borderRadius: '16px', border: '1px solid var(--color-border-scratch)',
                        maxHeight: '90vh', overflowY: 'auto'
                    }}>
                        <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-text-muted)', paddingBottom: '1rem' }}>
                            {t({ en: 'Preview Content', zh: '預覽內容' })}
                        </h2>

                        <div style={{ marginBottom: '2rem' }}>
                            {getContentObject() ? (
                                <>
                                    <h3 style={{ color: '#9ECA3B', marginBottom: '0.5rem' }}>{getContentObject()?.title}</h3>
                                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: 'var(--color-text-primary)' }}>
                                        {getContentObject()?.content}
                                    </div>
                                    {getContentObject()?.vocab?.length ? (
                                        <div style={{ marginTop: '1rem', fontStyle: 'italic', color: 'var(--color-text-secondary)' }}>
                                            {t({ en: 'Includes', zh: '包含' })} {getContentObject()?.vocab?.length} {t({ en: 'vocabulary words.', zh: '個詞彙。' })}
                                        </div>
                                    ) : null}
                                </>
                            ) : (
                                <p>No content to preview.</p>
                            )}
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.05)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
                            <strong>{t({ en: 'Assigning to:', zh: '分配給：' })}</strong> {selectedStudentIds.length > 5 ? `${selectedStudentIds.length} ${t({ en: 'students', zh: '學生' })}` : selectedStudentIds.join(', ')}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowPreview(false)}
                                style={{ background: 'transparent', border: '1px solid var(--color-text-muted)', padding: '0.8rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}
                            >
                                {t({ en: 'Edit / Cancel', zh: '編輯 / 取消' })}
                            </button>
                            <button
                                className="btn-primary"
                                onClick={handleConfirmSend}
                                style={{ background: 'var(--color-accent-green)', border: 'none' }}
                            >
                                {t({ en: 'Confirm & Send to', zh: '確認並發送給' })} {selectedStudentIds.length} {t({ en: 'Students', zh: '學生' })}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
