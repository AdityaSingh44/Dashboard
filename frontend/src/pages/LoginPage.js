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
        <div className="auth-container">
            <div className="auth-card fade-in">
                <div className="auth-header">
                    <h1>Welcome Back</h1>
                    <p>Sign in to your account</p>
                </div>

                <form className="auth-form" onSubmit={submit}>
                    {error && <div className="alert alert-error">{error}</div>}

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button type="submit" className="btn">
                        Sign In
                    </button>
                </form>

                <div className="auth-footer">
                    <a href="/register">Don't have an account? Create one here</a>
                </div>
            </div>
        </div>
    );
}
