const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const { auth, requireRole } = require('../middleware/auth');

// GET /api/assignments -> lists assignments; teachers see all, students see only Published
router.get('/', auth, async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (req.user.role === 'student') {
            filter.status = 'Published';
        } else if (status) {
            filter.status = status;
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Assignment.countDocuments(filter);
        const assignments = await Assignment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).populate('createdBy', 'name email');
        res.json({ total, page: parseInt(page), assignments });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/assignments -> create (Teacher only)
router.post('/', auth, requireRole('teacher'), async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;
        if (!title) return res.status(400).json({ message: 'Title required' });
        const assignment = await Assignment.create({ title, description, dueDate, createdBy: req.user._id });
        res.json(assignment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/assignments/:id -> edit only in Draft
router.put('/:id', auth, requireRole('teacher'), async (req, res) => {
    try {
        const { id } = req.params;
        const assignment = await Assignment.findById(id);
        if (!assignment) return res.status(404).json({ message: 'Not found' });
        if (assignment.status !== 'Draft') return res.status(400).json({ message: 'Only Draft assignments can be edited' });
        if (!assignment.createdBy.equals(req.user._id)) return res.status(403).json({ message: 'Not owner' });
        const { title, description, dueDate } = req.body;
        assignment.title = title || assignment.title;
        assignment.description = description || assignment.description;
        assignment.dueDate = dueDate || assignment.dueDate;
        await assignment.save();
        res.json(assignment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/assignments/:id -> delete only in Draft
router.delete('/:id', auth, requireRole('teacher'), async (req, res) => {
    try {
        const { id } = req.params;
        const assignment = await Assignment.findById(id);
        if (!assignment) return res.status(404).json({ message: 'Not found' });
        if (assignment.status !== 'Draft') return res.status(400).json({ message: 'Only Draft assignments can be deleted' });
        if (!assignment.createdBy.equals(req.user._id)) return res.status(403).json({ message: 'Not owner' });
        // Use deleteOne to ensure deletion regardless of mongoose document helpers
        await Assignment.deleteOne({ _id: id });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/assignments/:id/status -> update status (Teacher only)
router.put('/:id/status', auth, requireRole('teacher'), async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!['Draft', 'Published', 'Completed'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
        const assignment = await Assignment.findById(id);
        if (!assignment) return res.status(404).json({ message: 'Not found' });
        if (!assignment.createdBy.equals(req.user._id)) return res.status(403).json({ message: 'Not owner' });
        // Enforce allowed transitions
        const allowed = {
            Draft: ['Published'],
            Published: ['Completed'],
            Completed: []
        };
        if (!allowed[assignment.status].includes(status)) return res.status(400).json({ message: `Cannot change from ${assignment.status} to ${status}` });
        assignment.status = status;
        await assignment.save();
        res.json(assignment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET teacher-specific: get submissions for an assignment
router.get('/:id/submissions', auth, requireRole('teacher'), async (req, res) => {
    try {
        const { id } = req.params;
        const assignment = await Assignment.findById(id);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
        if (!assignment.createdBy.equals(req.user._id)) return res.status(403).json({ message: 'Not owner' });
        const subs = await Submission.find({ assignmentId: id }).populate('studentId', 'name email').sort({ submittedAt: -1 });
        res.json(subs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
