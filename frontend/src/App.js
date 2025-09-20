import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';

function PrivateRoute({ children, role }) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    if (role && user.role !== role) return <Navigate to="/login" replace />;
    return children;
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="app">
                    <main className="main">
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/teacher" element={<PrivateRoute role="teacher"><TeacherDashboard /></PrivateRoute>} />
                            <Route path="/student" element={<PrivateRoute role="student"><StudentDashboard /></PrivateRoute>} />
                            <Route path="/" element={<Navigate to="/login" />} />
                        </Routes>
                    </main>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}
