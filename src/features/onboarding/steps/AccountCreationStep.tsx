import React, { useState } from 'react';
import { useLanguage } from '../../language/LanguageContext';

interface AccountCreationStepProps {
    onChange: (data: { username: string; password?: string }) => void;
    title?: string;
}

export const AccountCreationStep: React.FC<AccountCreationStepProps> = ({ onChange, title }) => {
    const { t } = useLanguage();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleChange = (field: 'username' | 'password', value: string) => {
        if (field === 'username') setUsername(value);
        if (field === 'password') setPassword(value);

        onChange({
            username: field === 'username' ? value : username,
            password: field === 'password' ? value : password
        });
    };

    return (
        <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
            <h2 className="scratch-text" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                {title || t({ en: 'Create Your Profile', zh: '建立你的檔案' })}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '350px', margin: '0 auto' }}>
                <div style={{ textAlign: 'left' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                        {t({ en: 'Username', zh: '使用者名稱' })}
                    </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => handleChange('username', e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            borderRadius: '8px',
                            border: '1px solid var(--color-text-muted)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'var(--color-text-primary)'
                        }}
                    />
                </div>

                <div style={{ textAlign: 'left' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                        {t({ en: 'Password', zh: '密碼' })}
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            borderRadius: '8px',
                            border: '1px solid var(--color-text-muted)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'var(--color-text-primary)'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
