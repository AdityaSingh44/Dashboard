import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../auth/AuthContext';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        if (!name || !email || !password) return setError('All fields required');
        try {
            const res = await api.post('/api/auth/register', { name, email, password, role });
            const data = await res.json();
            if (!res.ok) return setError(data.message || 'Registration failed');
            // auto-login
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
                    <h1>Create Account</h1>
                    <p>Join our learning platform</p>
                </div>

                <form className="auth-form" onSubmit={submit}>
                    {error && <div className="alert alert-error">{error}</div>}

                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

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
                            placeholder="Create a password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Role</label>
                        <select value={role} onChange={e => setRole(e.target.value)}>
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </select>
                    </div>

                    <button type="submit" className="btn">
                        Create Account
                    </button>
                </form>

                <div className="auth-footer">
                    <a href="/login">Already have an account? Sign in here</a>
                </div>
            </div>
        </div>
    );
}
