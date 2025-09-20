import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) return setError('Email and password required');
        try {
            const auth = await login(email, password);
            if (auth.role === 'teacher') navigate('/teacher');
            else navigate('/student');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="center" style={{ padding: 20 }}>
            <form className="card" style={{ maxWidth: 420 }} onSubmit={submit}>
                <h2 style={{ marginBottom: 6 }}>Login</h2>
                {error && <div className="error">{error}</div>}
                <label className="small">Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} />
                <label className="small">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                    <a href="/register" className="small">Don't have an account? Register</a>
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    );
}
