const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const apiEndpoint = 'http://localhost:3000/api/reservations';

router.get('/', async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/auth/login'); // Redirect to login if not authenticated
    }

    try {
        const response = await fetch(apiEndpoint, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const reservations = await response.json();

        if (!response.ok) {
            return res.render('reservations', {
                title: 'Reservations',
                message: reservations.message || 'Unable to fetch reservations.',
                reservations: [],
            });
        }

        // Format reservations for display
        const formattedReservations = reservations.map(reservation => ({
            _id: reservation._id,
            tripName: reservation.tripId.name,
            tripImage: `/images/${reservation.tripId.image}`,
            tripStart: new Date(reservation.tripId.start).toLocaleDateString('en-US'), // Start date of the trip
            tripLength: reservation.tripId.length, // Length of the stay
            tripResort: reservation.tripId.resort,
            tripPrice: `$${parseFloat(reservation.tripId.perPerson).toFixed(2)}`,
            reservationDate: new Date(reservation.reservationDate).toLocaleDateString('en-US'), // Date the reservation was made
            status: reservation.status,
        }));

        // Render the Handlebars template
        res.render('reservations', {
            title: 'Reservations',
            reservations: formattedReservations,
        });
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.render('reservations', {
            title: 'Reservations',
            message: 'An error occurred while fetching reservations.',
            reservations: [],
        });
    }
});

router.post('/', async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/auth/login'); // Redirect to login if the user is not authenticated
    }

    const { tripId, reservationDate } = req.body;

    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ tripId, reservationDate }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Error creating reservation:', error);
            return res.render('error', { message: error.message || 'Unable to create reservation.' });
        }

        res.redirect('/reservations'); // Redirect to the reservations page
    } catch (error) {
        console.error('Error creating reservation:', error);
        res.render('error', { message: 'An error occurred while creating the reservation.' });
    }
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/auth/login');
    }

    try {
        const response = await fetch(`${apiEndpoint}/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            console.error(`API call failed with status: ${response.status}`);
            return res.render('error', { message: 'Reservation not found.' });
        }

        const reservation = await response.json();
        console.log('Fetched reservation details:', reservation);

        res.render('edit', {
            title: 'Edit Reservation',
            reservation,
            formattedReservationDate: new Date(reservation.reservationDate).toISOString().split('T')[0], // Format reservation date
        });
    } catch (error) {
        console.error('Error fetching reservation:', error);
        res.render('error', { message: 'Error fetching reservation details.' });
    }
});


router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { reservationDate } = req.body; 
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/auth/login');
    }

    try {
        const formattedDate = new Date(reservationDate + 'T00:00:00');
        const response = await fetch(`${apiEndpoint}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ reservationDate: formattedDate.toISOString() }), 
        });

        if (!response.ok) {
            const error = await response.json();
            return res.render('error', { message: error.message || 'Error updating reservation.' });
        }

        res.redirect('/reservations'); // Redirect back to reservations page
    } catch (error) {
        console.error('Error updating reservation:', error);
        res.render('error', { message: 'Error updating reservation.' });
    }
});

// Cancel a reservation
router.get('/cancel/:id', async (req, res) => {
    const { id } = req.params;
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/auth/login'); // Redirect to login if not authenticated
    }

    try {
        const response = await fetch(`${apiEndpoint}/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error canceling reservation:', errorText);
            return res.render('error', { message: 'Unable to cancel reservation. Please try again.' });
        }

        res.redirect('/reservations'); // Redirect back to reservations page after cancellation
    } catch (error) {
        console.error('Error canceling reservation:', error);
        res.render('error', { message: 'Error canceling reservation.' });
    }
});

module.exports = router;
