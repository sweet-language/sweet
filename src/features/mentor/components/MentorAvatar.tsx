import React from 'react';


interface MentorAvatarProps {
    onClick: () => void;
    isOpen: boolean;
}

export const MentorAvatar: React.FC<MentorAvatarProps> = ({ onClick, isOpen }) => {
    return (
        <button
            onClick={onClick}
            style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'var(--color-bg-card)',
                border: '2px solid var(--color-accent-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: isOpen ? '0 0 20px var(--color-accent-gold)' : '0 4px 10px rgba(0,0,0,0.5)',
                transition: 'all 0.3s ease',
                position: 'relative',
                zIndex: 1001
            }}
        >
            <img
                src="/src/assets/images/ai-guide.jpg"
                alt="AI Mentor"
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />

            {/* Status Dot */}
            <div style={{
                position: 'absolute',
                bottom: '2px',
                right: '2px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: 'var(--color-accent-blue)',
                border: '2px solid var(--color-bg-base)'
            }}></div>
        </button>
    );
};
