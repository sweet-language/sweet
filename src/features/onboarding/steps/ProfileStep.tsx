import React, { useState } from 'react';
import { useLanguage } from '../../language/LanguageContext';

interface ProfileStepProps {
    onChange: (data: any) => void;
}

export const ProfileStep: React.FC<ProfileStepProps> = ({ onChange }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        age: '',
        gender: '',
        district: '',
        city: '',
        country: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const newData = { ...formData, [e.target.name]: e.target.value };
        setFormData(newData);
        onChange(newData);
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        background: 'var(--color-bg-base)',
        border: '1px solid var(--color-text-muted)',
        borderRadius: '8px',
        color: 'var(--color-text-primary)',
        marginBottom: '1rem',
        fontFamily: 'var(--font-body)',
    };

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                {t({ en: 'Tell us about yourself', zh: '基本資料' })}
            </h2>

            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                {t({ en: 'Age', zh: '年齡' })}
            </label>
            <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                style={inputStyle}
            />

            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                {t({ en: 'Gender', zh: '性別' })}
            </label>
            <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                style={inputStyle}
            >
                <option value="">{t({ en: 'Select...', zh: '請選擇...' })}</option>
                <option value="male">{t({ en: 'Male', zh: '男性' })}</option>
                <option value="female">{t({ en: 'Female', zh: '女性' })}</option>
                <option value="other">{t({ en: 'Other', zh: '其他' })}</option>
            </select>

            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                {t({ en: 'District', zh: '居住地區' })}
            </label>
            <input
                type="text"
                name="district"
                value={formData.district}
                style={inputStyle}
            />

            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                {t({ en: 'City', zh: '城市' })}
            </label>
            <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                style={inputStyle}
            />

            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                {t({ en: 'Country', zh: '國家' })}
            </label>
            <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                style={inputStyle}
            />
        </div>
    );
};
