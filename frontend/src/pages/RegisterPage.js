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
        <div className="center">
            <form className="card" style={{ maxWidth: 480 }} onSubmit={submit}>
                <h2 style={{ marginBottom: 6 }}>Register</h2>
                {error && <div className="error">{error}</div>}
                <label className="small">Name</label>
                <input value={name} onChange={e => setName(e.target.value)} />
                <label className="small">Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} />
                <label className="small">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                <label className="small">Role</label>
                <select value={role} onChange={e => setRole(e.target.value)}>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                </select>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                    <a href="/login" className="small">Already have an account? Login</a>
                    <button type="submit">Register</button>
                </div>
            </form>
        </div>
    );
}
