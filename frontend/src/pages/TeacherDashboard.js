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
    const [submissionsModal, setSubmissionsModal] = useState({ open: false, assignmentId: null, submissions: [] });

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
        setError('');

        if (!title.trim()) {
            setError('Please enter a title for the assignment.');
            return;
        }

        try {
            const res = await api.post('/api/assignments', {
                title: title.trim(),
                description: desc.trim(),
                dueDate: dueDate || null
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Failed to create assignment');
                return;
            }

            // Clear form and refresh list
            setTitle('');
            setDesc('');
            setDueDate('');
            fetch();

            // Show success message
            alert(`✅ Assignment "${data.title}" created successfully!\n\n📝 Status: Draft\n🔧 You can now edit, publish, or delete this assignment.`);
        } catch (e) {
            setError(`Network error: ${e.message}`);
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

    const viewSubmissions = async (assignmentId, assignmentTitle) => {
        try {
            console.log(`Fetching submissions for assignment ${assignmentId}`);
            const res = await api.get(`/api/assignments/${assignmentId}/submissions`);

            console.log('Response status:', res.status);
            console.log('Response headers:', res.headers);

            const data = await res.json();
            console.log('Response data:', data);
            console.log('Data type:', typeof data);
            console.log('Is array:', Array.isArray(data));

            // Check if the response is not ok
            if (!res.ok) {
                console.error('API Error:', data);
                alert(`❌ Error fetching submissions (Status: ${res.status}): ${data.message || 'Unknown error'}`);
                return;
            }

            // Check if data is an array
            if (!Array.isArray(data)) {
                console.error('Invalid response:', data);
                alert(`❌ Error: Server returned invalid data format.\n` +
                    `Expected: array\n` +
                    `Received: ${typeof data}\n` +
                    `Data: ${JSON.stringify(data)}\n\n` +
                    `Please check the console for more details.`);
                return;
            }

            if (data.length === 0) {
                alert(`📝 No submissions yet for "${assignmentTitle}".`);
            } else {
                const submissionText = data.map((sub, index) =>
                    `${index + 1}. 👤 ${sub.studentId?.name || 'Unknown Student'}\n` +
                    `   📧 ${sub.studentId?.email || 'N/A'}\n` +
                    `   📝 Answer: ${sub.answer}\n` +
                    `   📅 Submitted: ${new Date(sub.submittedAt).toLocaleString()}\n` +
                    `   ${sub.reviewed ? '✅ Reviewed' : '❌ Not Reviewed'}`
                ).join('\n\n' + '─'.repeat(60) + '\n\n');

                alert(`📊 Submissions for "${assignmentTitle}"\n` +
                    `📈 Total Submissions: ${data.length}\n\n` +
                    `${'='.repeat(60)}\n\n${submissionText}`);
            }
        } catch (error) {
            console.error('Network error:', error);
            alert(`❌ Network Error: ${error.message}\n\nPlease check your internet connection and try again.`);
        }
    };

    return (
        <div className="page fade-in">
            <div className="topbar">
                <h2>📚 Teacher Dashboard</h2>
                <div className="header-actions">
                    <div className="user-pill">👨‍🏫 {user?.name}</div>
                    <button className="btn-secondary" onClick={logout}>Sign Out</button>
                </div>
            </div>

            {/* Dashboard Stats */}
            <div className="dashboard-stats">
                <div className="stat-card stagger-fade-in">
                    <div className="stat-number">{assignments.filter(a => a.status === 'Draft').length}</div>
                    <div className="stat-label">Draft Assignments</div>
                </div>
                <div className="stat-card stagger-fade-in">
                    <div className="stat-number">{assignments.filter(a => a.status === 'Published').length}</div>
                    <div className="stat-label">Published Assignments</div>
                </div>
                <div className="stat-card stagger-fade-in">
                    <div className="stat-number">{assignments.filter(a => a.status === 'Completed').length}</div>
                    <div className="stat-label">Completed Assignments</div>
                </div>
                <div className="stat-card stagger-fade-in">
                    <div className="stat-number">{assignments.length}</div>
                    <div className="stat-label">Total Assignments</div>
                </div>
            </div>

            {/* Create Assignment Section */}
            <div className="card slide-in">
                <div className="card-header">
                    <h3>✨ Create New Assignment</h3>
                </div>
                <div className="card-content">
                    {error && <div className="alert alert-error">{error}</div>}

                    <div className="form-group">
                        <label className="form-label">Assignment Title</label>
                        <input
                            type="text"
                            placeholder="Enter assignment title..."
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            placeholder="Describe the assignment requirements..."
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Due Date</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={e => setDueDate(e.target.value)}
                        />
                    </div>
                </div>
                <div className="card-footer">
                    <button className="btn" onClick={create}>
                        📝 Create Assignment (Draft)
                    </button>
                </div>
            </div>

            {/* Assignments Management */}
            <div className="card slide-in">
                <div className="card-header">
                    <h3>📋 Assignment Management</h3>
                </div>
                <div className="card-content">
                    <div className="filter-controls">
                        <label className="form-label">Filter by Status:</label>
                        <select value={filter} onChange={e => setFilter(e.target.value)}>
                            <option value="">🔍 All Assignments</option>
                            <option value="Draft">📝 Draft</option>
                            <option value="Published">📢 Published</option>
                            <option value="Completed">✅ Completed</option>
                        </select>
                    </div>

                    {assignments.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📚</div>
                            <h3>No assignments yet</h3>
                            <p>Create your first assignment to get started with managing coursework.</p>
                        </div>
                    ) : (
                        <div className="assignment-list">
                            {assignments.map(a => (
                                <div key={a._id} className="assignment slide-in">
                                    <div className="assignment-content">
                                        {editingId === a._id ? (
                                            <div>
                                                <div className="form-group">
                                                    <label className="form-label">Title</label>
                                                    <input
                                                        value={editTitle}
                                                        onChange={e => setEditTitle(e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Description</label>
                                                    <textarea
                                                        value={editDesc}
                                                        onChange={e => setEditDesc(e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Due Date</label>
                                                    <input
                                                        type="date"
                                                        value={editDueDate}
                                                        onChange={e => setEditDueDate(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="assignment-title">
                                                    {a.title}
                                                    <span className={`badge status-${a.status.toLowerCase()}`}>
                                                        {a.status}
                                                    </span>
                                                </div>
                                                <div className="assignment-description">{a.description || 'No description provided'}</div>
                                                <div className="assignment-meta">
                                                    <div className="assignment-meta-item">
                                                        Due: {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'No due date'}
                                                    </div>
                                                    <div className="assignment-meta-item">
                                                        Created: {new Date(a.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="actions">
                                        {a.status === 'Draft' && editingId !== a._id && (
                                            <button className="btn-sm btn-secondary" onClick={() => startEdit(a)}>
                                                ✏️ Edit
                                            </button>
                                        )}
                                        {editingId === a._id && (
                                            <button className="btn-sm btn-success" onClick={() => saveEdit(a._id)}>
                                                💾 Save
                                            </button>
                                        )}
                                        {a.status === 'Draft' && (
                                            <button className="btn-sm btn-warning" onClick={() => changeStatus(a._id, 'Published')}>
                                                📢 Publish
                                            </button>
                                        )}
                                        {a.status === 'Published' && (
                                            <button className="btn-sm btn-success" onClick={() => changeStatus(a._id, 'Completed')}>
                                                ✅ Complete
                                            </button>
                                        )}
                                        {a.status === 'Draft' && (
                                            <button className="btn-sm btn-danger" onClick={() => del(a._id)}>
                                                🗑️ Delete
                                            </button>
                                        )}
                                        <button
                                            className="btn-sm"
                                            onClick={() => viewSubmissions(a._id, a.title)}
                                        >
                                            👥 View Submissions
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
