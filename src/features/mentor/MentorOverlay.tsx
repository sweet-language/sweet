import React, { useState } from 'react';
import { MentorAvatar } from './components/MentorAvatar';
import { ChatInterface } from './components/ChatInterface';

export const MentorOverlay: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mentor-overlay-container" style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 9999 }}>
            {isOpen && <ChatInterface onClose={() => setIsOpen(false)} />}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <MentorAvatar onClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />
            </div>
        </div>
    );
};
