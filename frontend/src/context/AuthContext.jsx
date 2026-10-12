import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { INITIAL_USERS } from '../mock/data';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => authService.getCurrentUser() || INITIAL_USERS[0]);
    useEffect(() => {
        // Keep user state in sync with local storage
        if (user) {
            localStorage.setItem('nexora_user', JSON.stringify(user));
        }
    }, [user]);
    const login = async (email, password) => {
        const res = await authService.login(email, password);
        setUser(res.user);
    };
    const register = async (name, email, password, role = 'USER') => {
        const res = await authService.register(name, email, password, role);
        setUser(res.user);
    };
    const logout = () => {
        authService.logout();
        setUser(null);
    };
    const switchDemoRole = async (targetRole) => {
        let email = 'user@nexora.org';
        let password = 'User@123';
        if (targetRole === 'OFFICER') {
            email = 'officer@nexora.org';
            password = 'Officer@123';
        }
        else if (targetRole === 'ADMIN') {
            email = 'admin@nexora.org';
            password = 'Admin@123';
        }
        try {
            await login(email, password);
        }
        catch (err) {
            console.warn('Backend demo switch fallback:', err);
            const demoUser = INITIAL_USERS.find((u) => u.role === targetRole) || INITIAL_USERS[0];
            setUser(demoUser);
            localStorage.setItem('nexora_user', JSON.stringify(demoUser));
        }
    };
    const role = user?.role || 'USER';
    const isAuthenticated = !!user;
    return (<AuthContext.Provider value={{ user, role, isAuthenticated, login, register, logout, switchDemoRole }}>
      {children}
    </AuthContext.Provider>);
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
