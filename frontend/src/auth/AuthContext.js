import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const raw = localStorage.getItem('auth');
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        if (user) localStorage.setItem('auth', JSON.stringify(user));
        else localStorage.removeItem('auth');
    }, [user]);

    const login = async (email, password) => {
        const res = await api.post('/api/auth/login', { email, password });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        const auth = { token: data.token, role: data.role, name: data.name };
        setUser(auth);
        api.setToken(auth.token);
        return auth;
    };

    const register = async (name, email, password, role) => {
        const res = await api.post('/api/auth/register', { name, email, password, role });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Registration failed');
        return data;
    };

    const registerAndLogin = async (name, email, password, role) => {
        await register(name, email, password, role);
        return await login(email, password);
    };

    const logout = () => {
        setUser(null);
        api.setToken(null);
    };

    // Ensure API token is set whenever user changes (including initial load)
    useEffect(() => {
        if (user && user.token) api.setToken(user.token);
        else api.setToken(null);
    }, [user]);

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
