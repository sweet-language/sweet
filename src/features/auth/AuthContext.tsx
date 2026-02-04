import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 'student' | 'teacher';

export interface User {
    id: string; // Username is ID
    role: Role;
    password?: string; // Simple mock password
    avatar?: string; // URL or base64
    linkedTeacherId?: string; // For students

    // New Fields
    targetLanguage?: 'en' | 'zh'; // Student learning
    teachingLanguage?: 'en' | 'zh'; // Teacher teaching
    proficiencyLevel?: string; // e.g. "Level 3"
    classId?: string; // Linked Group/Class ID

}

interface AuthContextType {
    user: User | null;
    login: (id: string, password?: string, expectedRole?: Role) => { success: boolean, error?: string };
    signup: (user: User) => { success: boolean, error?: string };
    logout: () => void;
    getAllTeachers: () => User[];
    getAllStudents: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // Load session on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('app-current-user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const getUsers = (): User[] => {
        const users = localStorage.getItem('app-users');
        return users ? JSON.parse(users) : [];
    };

    const saveUserToDB = (newUser: User) => {
        const users = getUsers();
        // Check duplicate (Case Insensitive global check)
        if (users.find(u => u.id.toLowerCase() === newUser.id.toLowerCase())) return false;

        users.push(newUser);
        localStorage.setItem('app-users', JSON.stringify(users));
        return true;
    };

    const login = (id: string, password?: string, expectedRole?: Role) => {
        const users = getUsers();
        // Case insensitive login
        const foundUser = users.find(u => u.id.toLowerCase() === id.toLowerCase());

        if (!foundUser) {
            return { success: false, error: 'User not found' };
        }

        // Role Check (Strict Login)
        if (expectedRole && foundUser.role !== expectedRole) {
            return {
                success: false,
                error: `This is a ${expectedRole} login. Please go to ${foundUser.role} login.`
            };
        }

        // Password check for everyone
        if (foundUser.password !== password) {
            return { success: false, error: 'Invalid password' };
        }

        setUser(foundUser);
        localStorage.setItem('app-current-user', JSON.stringify(foundUser));
        return { success: true };
    };

    const signup = (newUser: User) => {
        if (saveUserToDB(newUser)) {
            setUser(newUser);
            localStorage.setItem('app-current-user', JSON.stringify(newUser));
            return { success: true };
        }
        return { success: false, error: 'That name is already taken. Please choose another.' };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('app-current-user');
    };

    const getAllTeachers = () => {
        return getUsers().filter(u => u.role === 'teacher');
    };

    const getAllStudents = () => {
        return getUsers().filter(u => u.role === 'student');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, getAllTeachers, getAllStudents }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
