import React, { createContext, useContext, useState } from 'react';

type Role = 'student' | 'teacher' | null;

interface RoleContextType {
    role: Role;
    setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [role, setRoleState] = useState<Role>(
        (localStorage.getItem('app-role') as Role) || null
    );

    const setRole = (newRole: Role) => {
        setRoleState(newRole);
        if (newRole) {
            localStorage.setItem('app-role', newRole);
        } else {
            localStorage.removeItem('app-role');
        }
    };

    return (
        <RoleContext.Provider value={{ role, setRole }}>
            {children}
        </RoleContext.Provider>
    );
};

export const useRole = () => {
    const context = useContext(RoleContext);
    if (!context) throw new Error('useRole must be used within a RoleProvider');
    return context;
};
