import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../auth/AuthContext';

export default function StudentDashboard() {
    const { logout, user } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [answerMap, setAnswerMap] = useState({});

    const fetch = async () => {
        try {
            const res = await api.get('/api/assignments');
            const data = await res.json();
            if (!res.ok) {
                if (res.status === 401) return alert('Not authenticated - please login');
                return alert(data.message || 'Failed to load assignments');
            }
            setAssignments(data.assignments);
        } catch (e) {
            alert(e.message);
        }
        // fetch student's submissions to show answers and prevent double submit
        try {
            const r2 = await api.get('/api/submissions/mine');
            const sdata = await r2.json();
            if (r2.ok) {
                const map = {};
                for (const s of sdata) {
                    const aid = (s.assignmentId && s.assignmentId._id) ? String(s.assignmentId._id) : String(s.assignmentId);
                    map[aid] = s;
                }
                setAnswerMap(map);
            }
        } catch (e) {
            // ignore
        }
    };

    useEffect(() => { fetch(); }, []);

    const submit = async (assignmentId) => {
        if (answerMap[String(assignmentId)]) {
            alert('⚠️ You have already submitted an answer for this assignment.');
            return;
        }

        const assignment = assignments.find(a => a._id === assignmentId);
        if (assignment && assignment.dueDate && new Date() > new Date(assignment.dueDate)) {
            alert('⏰ Sorry, this assignment is past its due date and no longer accepts submissions.');
            return;
        }

        const ans = prompt(`📝 Submit your answer for "${assignment?.title || 'this assignment'}":\n\nEnter your detailed response below:`);
        if (!ans || ans.trim() === '') return;

        try {
            const res = await api.post('/api/submissions', { assignmentId, answer: ans.trim() });
            const data = await res.json();
            if (!res.ok) {
                alert(`❌ Submission failed: ${data.message || 'Unknown error'}`);
                return;
            }

            // refetch submissions and assignments
            await fetch();
            alert(`✅ Assignment submitted successfully!\n\n📋 Your answer has been recorded and will be reviewed by your teacher.`);
        } catch (err) {
            alert(`❌ Network error: ${err.message}`);
        }
    };

    const refresh = () => fetch();

    const submittedList = assignments.filter(a => answerMap[String(a._id)]);
    const publishedList = assignments.filter(a => !answerMap[String(a._id)]);

    return (
        <div className="page fade-in">
            <div className="topbar">
                <h2>🎓 Student Dashboard</h2>
                <div className="header-actions">
                    <div className="user-pill">👨‍🎓 {user?.name}</div>
                    <button className="btn-secondary" onClick={logout}>Sign Out</button>
                </div>
            </div>

            {/* Dashboard Stats */}
            <div className="dashboard-stats">
                <div className="stat-card stagger-fade-in">
                    <div className="stat-number">{publishedList.length}</div>
                    <div className="stat-label">Available Assignments</div>
                </div>
                <div className="stat-card stagger-fade-in">
                    <div className="stat-number">{submittedList.length}</div>
                    <div className="stat-label">Submitted Assignments</div>
                </div>
                <div className="stat-card stagger-fade-in">
                    <div className="stat-number">{assignments.length}</div>
                    <div className="stat-label">Total Assignments</div>
                </div>
                <div className="stat-card stagger-fade-in">
                    <div className="stat-number">
                        {submittedList.filter(a => answerMap[String(a._id)]?.reviewed).length}
                    </div>
                    <div className="stat-label">Reviewed Submissions</div>
                </div>
            </div>

            {/* Available Assignments */}
            <div className="card slide-in">
                <div className="card-header">
                    <h3>📢 Available Assignments</h3>
                    <button className="btn-sm btn-secondary" onClick={refresh}>
                        🔄 Refresh
                    </button>
                </div>
                <div className="card-content">
                    {publishedList.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📚</div>
                            <h3>No assignments available</h3>
                            <p>Check back later for new assignments from your teachers.</p>
                        </div>
                    ) : (
                        <div className="assignment-list">
                            {publishedList.map(a => (
                                <div key={a._id} className="assignment slide-in">
                                    <div className="assignment-content">
                                        <div className="assignment-title">
                                            {a.title}
                                            <span className="badge badge-published">Available</span>
                                        </div>
                                        <div className="assignment-description">
                                            {a.description || 'No description provided'}
                                        </div>
                                        <div className="assignment-meta">
                                            <div className="assignment-meta-item">
                                                Due: {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'No due date'}
                                            </div>
                                            <div className="assignment-meta-item">
                                                Created: {new Date(a.createdAt).toLocaleDateString()}
                                            </div>
                                            {a.dueDate && new Date() > new Date(a.dueDate) && (
                                                <div className="assignment-meta-item" style={{ color: 'var(--error-600)' }}>
                                                    ⚠️ Past Due
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="actions">
                                        <button
                                            className="btn btn-success"
                                            onClick={() => submit(a._id)}
                                            disabled={a.dueDate && new Date() > new Date(a.dueDate)}
                                        >
                                            {a.dueDate && new Date() > new Date(a.dueDate) ? '⏰ Past Due' : '📝 Submit Answer'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Submitted Assignments */}
            <div className="card slide-in">
                <div className="card-header">
                    <h3>✅ Submitted Assignments</h3>
                </div>
                <div className="card-content">
                    {submittedList.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📝</div>
                            <h3>No submissions yet</h3>
                            <p>Your submitted assignments will appear here once you complete them.</p>
                        </div>
                    ) : (
                        <div className="assignment-list">
                            {submittedList.map(a => {
                                const submission = answerMap[String(a._id)];
                                return (
                                    <div key={a._id} className="assignment slide-in">
                                        <div className="assignment-content">
                                            <div className="assignment-title">
                                                {a.title}
                                                <span className={`badge ${submission?.reviewed ? 'badge-completed' : 'badge-published'}`}>
                                                    {submission?.reviewed ? '✅ Reviewed' : '📋 Submitted'}
                                                </span>
                                            </div>
                                            <div className="assignment-description">
                                                {a.description || 'No description provided'}
                                            </div>
                                            <div className="assignment-meta">
                                                <div className="assignment-meta-item">
                                                    Due: {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'No due date'}
                                                </div>
                                                <div className="assignment-meta-item">
                                                    Submitted: {submission ? new Date(submission.submittedAt).toLocaleString() : 'N/A'}
                                                </div>
                                                <div className="assignment-meta-item">
                                                    Status: {submission?.reviewed ? 'Reviewed by teacher' : 'Pending review'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="actions">
                                            <button
                                                className="btn-sm"
                                                onClick={() => {
                                                    const answer = submission?.answer || '';
                                                    const submittedAt = submission ? new Date(submission.submittedAt).toLocaleString() : 'N/A';
                                                    const reviewStatus = submission?.reviewed ? '✅ Reviewed by teacher' : '📋 Pending review';

                                                    alert(`📝 Your Submission for "${a.title}"\n\n` +
                                                        `📅 Submitted: ${submittedAt}\n` +
                                                        `🔍 Status: ${reviewStatus}\n\n` +
                                                        `💭 Your Answer:\n${answer}`);
                                                }}
                                            >
                                                👁️ View Submission
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
