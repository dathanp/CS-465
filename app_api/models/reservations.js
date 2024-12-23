const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'trips', required: true },
    reservationDate: { type: Date, default: Date.now },
    status: { type: String, default: 'confirmed' },
});

const Reservation = mongoose.model('reservations', reservationSchema);
module.exports = Reservation;
