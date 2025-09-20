const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const { auth, requireRole } = require('../middleware/auth');

// POST /api/submissions -> student submits answer
router.post('/', auth, requireRole('student'), async (req, res) => {
    try {
        const { assignmentId, answer } = req.body;
        if (!assignmentId || !answer) return res.status(400).json({ message: 'Missing fields' });
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
        if (assignment.status !== 'Published') return res.status(400).json({ message: 'Assignment not open for submissions' });
        if (assignment.dueDate && new Date() >= new Date(assignment.dueDate)) return res.status(400).json({ message: 'Past due date' });
        const existing = await Submission.findOne({ assignmentId, studentId: req.user._id });
        if (existing) return res.status(400).json({ message: 'Already submitted' });
        const sub = await Submission.create({ assignmentId, studentId: req.user._id, answer });
        res.json(sub);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/submissions/:assignmentId -> teacher views submissions (route protected by assignments route also)
// GET /api/submissions/mine -> student views their submissions
router.get('/mine', auth, requireRole('student'), async (req, res) => {
    try {
        const subs = await Submission.find({ studentId: req.user._id }).populate('assignmentId').sort({ submittedAt: -1 });
        res.json(subs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/submissions/:assignmentId/mine -> get my submission for an assignment
router.get('/:assignmentId/mine', auth, requireRole('student'), async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const sub = await Submission.findOne({ assignmentId, studentId: req.user._id });
        if (!sub) return res.status(404).json({ message: 'No submission' });
        res.json(sub);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/submissions/:assignmentId -> teacher views submissions (route protected by assignments route also)
router.get('/:assignmentId', auth, requireRole('teacher'), async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
        if (!assignment.createdBy.equals(req.user._id)) return res.status(403).json({ message: 'Not owner' });
        const subs = await Submission.find({ assignmentId }).populate('studentId', 'name email').sort({ submittedAt: -1 });
        res.json(subs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/submissions/mine -> student views their submissions
router.get('/mine', auth, requireRole('student'), async (req, res) => {
    try {
        const subs = await Submission.find({ studentId: req.user._id }).populate('assignmentId').sort({ submittedAt: -1 });
        res.json(subs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/submissions/:assignmentId/mine -> get my submission for an assignment
router.get('/:assignmentId/mine', auth, requireRole('student'), async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const sub = await Submission.findOne({ assignmentId, studentId: req.user._id });
        if (!sub) return res.status(404).json({ message: 'No submission' });
        res.json(sub);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/submissions/:id/review -> mark reviewed (teacher)
router.put('/:id/review', auth, requireRole('teacher'), async (req, res) => {
    try {
        const { id } = req.params;
        const sub = await Submission.findById(id).populate('assignmentId');
        if (!sub) return res.status(404).json({ message: 'Submission not found' });
        if (!sub.assignmentId.createdBy.equals(req.user._id)) return res.status(403).json({ message: 'Not owner' });
        sub.reviewed = true;
        await sub.save();
        res.json(sub);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
