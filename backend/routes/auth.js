const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/register (for seeds/testing) - not exposed in production
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) return res.status(400).json({ message: 'Missing fields' });
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'User exists' });
        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hash, role });
        res.json({ id: user._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Missing email or password' });
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
        res.json({ token, role: user.role, name: user.name });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
