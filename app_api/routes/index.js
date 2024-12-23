const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authentication');
const tripsController = require('../controllers/trips');
const reservationsRoutes = require('./reservations');
const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT
function authenticateJWT(req, res, next) {
    console.log('In Middleware');

    const authHeader = req.headers.authorization || `Bearer ${req.cookies.token}`;
    console.log('Auth Header:', authHeader);

    if (!authHeader) {
        console.log('Authorization header is missing');
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1]; // Extract token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Token validation error:', err.message);
            return res.status(401).json({ message: 'Invalid token' });
        }

        console.log('Decoded token:', decoded); // Debugging
        req.user = decoded; // Attach the decoded user data to the request
        next(); // Move to the next middleware/route handler
    });
}

// Middleware for admin access
function ensureAdmin(req, res, next) {
    console.log('Authorization Header:', req.headers.authorization);
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Bearer token missing' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err || decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        }
        req.auth = decoded;
        next();
    });
}

// Public Routes
router.route('/register').post(authController.register);
router.route('/login').post(authController.login);

// Use reservations routes
router.use('/reservations', reservationsRoutes);

// Protected Routes for trips
router.route('/trips')
    .get(tripsController.tripsList)
    .post(authenticateJWT, tripsController.tripsAddTrip);

router.route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode)
    .put(authenticateJWT, tripsController.tripsUpdateTrip)
    .delete(authenticateJWT, tripsController.tripsDeleteTrip);

// Admin Routes
router.get('/users', ensureAdmin, async (req, res) => {
    try {
        const User = mongoose.model('users');
        const users = await User.find({}, '-hash -salt');
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users:', err.message);
        res.status(500).json({ message: 'Server error while fetching users.' });
    }
});

router.route('/admin/register').post(ensureAdmin, async (req, res) => {
    try {
        const User = mongoose.model('users');
        const adminCount = await User.countDocuments({ role: 'admin' });
        if (adminCount === 0) {
            req.body.role = 'admin';
            return authController.register(req, res);
        }
        return res.status(403).json({ message: 'Admin already exists.' });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router; // Export only the router

