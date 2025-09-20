import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../auth/AuthContext';

export default function TeacherDashboard() {
    const { logout, user } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [filter, setFilter] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [editDueDate, setEditDueDate] = useState('');
    const [error, setError] = useState('');

    const fetch = async () => {
        const q = filter ? `?status=${filter}` : '';
        const res = await api.get('/api/assignments' + q);
        const data = await res.json();
        if (!res.ok) {
            alert(data.message || 'Failed to load assignments');
            return;
        }
        setAssignments(data.assignments);
    };

    useEffect(() => { fetch(); }, [filter]);

    const create = async () => {
        try {
            const res = await api.post('/api/assignments', { title, description: desc, dueDate });
            const data = await res.json();
            if (!res.ok) return setError(data.message || 'Create failed');
            setTitle(''); setDesc(''); setDueDate('');
            fetch();
        } catch (e) {
            setError(e.message);
        }
    };

    const changeStatus = async (id, status) => {
        try {
            const res = await api.put(`/api/assignments/${id}/status`, { status });
            const data = await res.json();
            if (!res.ok) return setError(data.message || 'Status change failed');
            fetch();
        } catch (e) { setError(e.message); }
    };

    const del = async (id) => {
        try {
            const res = await api.del(`/api/assignments/${id}`);
            const data = await res.json();
            if (!res.ok) return alert(data.message || 'Delete failed');
            fetch();
        } catch (e) {
            alert(e.message);
        }
    };

    const startEdit = (a) => {
        setEditingId(a._id);
        setEditTitle(a.title || '');
        setEditDesc(a.description || '');
        setEditDueDate(a.dueDate ? new Date(a.dueDate).toISOString().slice(0, 10) : '');
    };

    const saveEdit = async (id) => {
        try {
            const res = await api.put(`/api/assignments/${id}`, { title: editTitle, description: editDesc, dueDate: editDueDate });
            const data = await res.json();
            if (!res.ok) return setError(data.message || 'Edit failed');
            setEditingId(null);
            fetch();
        } catch (e) { setError(e.message); }
    };

    return (
        <div className="page">
            <div className="topbar">
                <h2>Teacher Dashboard</h2>
                <div className="header-actions">
                    <div className="user-pill">{user?.name}</div>
                    <button className="secondary" onClick={logout}>Logout</button>
                </div>
            </div>

            <section className="card">
                <h3>Create Assignment</h3>
                {error && <div className="error">{error}</div>}
                <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
                <textarea placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={create}>Create (Draft)</button>
                </div>
            </section>

            <section className="card">
                <h3>Assignments</h3>
                <div>
                    <label>Filter:</label>
                    <select value={filter} onChange={e => setFilter(e.target.value)}>
                        <option value="">All</option>
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <ul>
                    {assignments.map(a => (
                        <li key={a._id} className="assignment">
                            <div>
                                {editingId === a._id ? (
                                    <div>
                                        <input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                                        <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} />
                                        <input type="date" value={editDueDate} onChange={e => setEditDueDate(e.target.value)} />
                                    </div>
                                ) : (
                                    <div>
                                        <strong>{a.title}</strong> <em>{a.status}</em>
                                        <div>{a.description}</div>
                                        <div>Due: {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'N/A'}</div>
                                    </div>
                                )}
                            </div>
                            <div className="actions">
                                {a.status === 'Draft' && editingId !== a._id && <button onClick={() => startEdit(a)}>Edit</button>}
                                {editingId === a._id && <button onClick={() => saveEdit(a._id)}>Save</button>}
                                {a.status === 'Draft' && <button onClick={() => changeStatus(a._id, 'Published')}>Publish</button>}
                                {a.status === 'Published' && <button onClick={() => changeStatus(a._id, 'Completed')}>Mark Completed</button>}
                                {a.status === 'Draft' && <button onClick={() => del(a._id)}>Delete</button>}
                                <button onClick={async () => {
                                    const res = await api.get(`/api/assignments/${a._id}/submissions`);
                                    const data = await res.json();
                                    alert(JSON.stringify(data, null, 2));
                                }}>View Submissions</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
