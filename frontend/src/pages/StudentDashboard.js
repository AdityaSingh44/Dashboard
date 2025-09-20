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
        if (answerMap[String(assignmentId)]) return alert('You already submitted');
        const ans = prompt('Enter your answer (text)');
        if (!ans) return;
        const res = await api.post('/api/submissions', { assignmentId, answer: ans });
        const data = await res.json();
        if (!res.ok) return alert(data.message || 'Error');
        // refetch submissions and assignments
        await fetch();
        alert('Submitted');
    };

    const refresh = () => fetch();

    const submittedList = assignments.filter(a => answerMap[String(a._id)]);
    const publishedList = assignments.filter(a => !answerMap[String(a._id)]);

    return (
        <div className="page">
            <div className="topbar">
                <h2>Student Dashboard</h2>
                <div className="header-actions">
                    <div className="user-pill">{user?.name}</div>
                    <button className="secondary" onClick={logout}>Logout</button>
                </div>
            </div>

            <section className="card">
                <h3>Published Assignments (not submitted) <button onClick={refresh} style={{ marginLeft: 8 }}>Refresh</button></h3>
                <ul>
                    {publishedList.length === 0 && <li>No published assignments available</li>}
                    {publishedList.map(a => (
                        <li key={a._id} className="assignment">
                            <div>
                                <strong>{a.title}</strong>
                                <div>{a.description}</div>
                                <div>Due: {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'N/A'}</div>
                            </div>
                            <div className="actions">
                                <button onClick={() => submit(a._id)}>Submit</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="card">
                <h3>Submitted Assignments</h3>
                <ul>
                    {submittedList.length === 0 && <li>No submissions yet</li>}
                    {submittedList.map(a => (
                        <li key={a._id} className="assignment">
                            <div>
                                <strong>{a.title}</strong>
                                <div>{a.description}</div>
                                <div>Due: {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'N/A'}</div>
                                <div>Submitted At: {answerMap[String(a._id)] ? new Date(answerMap[String(a._id)].submittedAt).toLocaleString() : 'N/A'}</div>
                            </div>
                            <div className="actions">
                                <button onClick={() => alert('Your answer:\n\n' + (answerMap[String(a._id)]?.answer || ''))}>View Submission</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
