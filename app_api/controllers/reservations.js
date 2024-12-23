
const Reservation = require('../models/reservations');
const Trip = require('../models/travlr');

// Create a reservation for a user
const createReservation = async (req, res) => {
    const { tripId, reservationDate } = req.body;

    try {
        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        const reservation = new Reservation({
            userId: req.user._id, // Authenticated user's ID
            tripId: tripId,
            reservationDate: new Date(reservationDate + 'T00:00:00'),
            status: 'confirmed',
        });

        await reservation.save();
        res.status(201).json({ message: 'Reservation created successfully.' });
    } catch (error) {
        console.error('Error creating reservation:', error);
        res.status(500).json({ message: 'Error creating reservation.' });
    }
};

// Get reservations for a user
const getUserReservations = async (req, res) => {
    try {
        const userId = req.user._id; // Authenticated user's ID

        // Fetch reservations and populate trip details
        const reservations = await Reservation.find({ userId })
            .populate('tripId')
            .exec();

        if (!reservations || reservations.length === 0) {
            return res.status(404).json({ message: 'No reservations found' });
        }

        res.status(200).json(reservations);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({ message: 'Error fetching reservations.' });
    }
};

module.exports = {
    createReservation,
    getUserReservations,
};
