const express = require('express');
const mongoose = require('mongoose'); // Ensure mongoose is imported for ObjectId
const router = express.Router();
const jwt = require('jsonwebtoken');
const Reservation = require('../models/reservations');
const Trip = require('../models/travlr');
const { body, validationResult } = require('express-validator');
const { createReservation, getUserReservations } = require('../controllers/reservations');


// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || `Bearer ${req.cookies.token}`;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
};

// Middleware to verify admin access
function ensureAdmin(req, res, next) {
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

// Get all reservations for the authenticated user
router.get('/', authenticateJWT, getUserReservations);

// POST: Create a new reservation
router.post('/', authenticateJWT, createReservation);

// Get a specific reservation by ID
router.get('/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;

    try {
        // Correctly instantiate ObjectId
        const reservation = await Reservation.findById(new mongoose.Types.ObjectId(id)).populate('tripId');
        if (!reservation) {
            console.log(`Reservation with ID ${id} not found.`);
            return res.status(404).json({ message: 'Reservation not found.' });
        }

        console.log('Reservation details:', reservation);
        res.status(200).json(reservation);
    } catch (error) {
        console.error('Error fetching reservation:', error);
        res.status(500).json({ message: 'Error fetching reservation.' });
    }
});

const validateUpdate = [
    body('reservationDate').optional().isISO8601().withMessage('Invalid date format.'),
    body('length').optional().isString().withMessage('Length must be a string.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

// Update a reservation
router.put('/:id', authenticateJWT, validateUpdate, async (req, res) => {
    const { id } = req.params;
    const { reservationDate } = req.body;

    try {
        // Find reservation by ID
        const reservation = await Reservation.findByIdAndUpdate(id, {reservationDate}, {new: true});
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found.' });
        }

        await reservation.save(); // Save the reservation
        res.status(200).json({ message: 'Reservation updated successfully.' });
    } catch (error) {
        console.error('Error updating reservation:', error);
        res.status(500).json({ message: 'Error updating reservation.' });
    }
});

// DELETE: /api/reservations/:id - Cancel a reservation
router.delete('/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;

    try {
        const reservation = await Reservation.findByIdAndDelete(id);

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found.' });
        }

        res.status(200).json({ message: 'Reservation canceled successfully.' });
    } catch (error) {
        console.error('Error canceling reservation:', error);
        res.status(500).json({ message: 'Error canceling reservation.' });
    }
});

// GET: All reservations for admin
router.get('/all', authenticateJWT, ensureAdmin, async (req, res) => {
    try {
      const reservations = await Reservation.find()
        .populate('tripId')
        .populate('userId');
      res.status(200).json(reservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      res.status(500).json({ message: 'Error fetching reservations.' });
    }
  });
  

module.exports = router; // Ensure this is correctly exported
