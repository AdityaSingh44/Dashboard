const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    const header = req.headers['authorization'];
    if (!header) return res.status(401).json({ message: 'No token provided' });
    const parts = header.split(' ');
    if (parts.length !== 2) return res.status(401).json({ message: 'Token error' });
    const token = parts[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.status(401).json({ message: 'Invalid token user' });
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token invalid', error: err.message });
    }
};

const requireRole = (role) => (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    if (req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
    next();
};

module.exports = { auth, requireRole };
