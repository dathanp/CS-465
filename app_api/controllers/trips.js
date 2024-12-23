const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model
const Model = mongoose.model('trips');
const Reservation = require('./reservations'); // Path to your reservation model

// GET: /trips - lists all the trips
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsList = async (req, res) => {
    const q = await Model
        .find({}) // No filter, return all records
        .exec();
        
    // Uncomment the following line to show results of query
    // on the console
    // console.log(q);

    if (!q) {
        // Database returned no data
        return res
            .status(404)
            .json({ message: "No trips found" });
    } else {
        // Return resulting trip list
        return res
            .status(200)
            .json(q);
    }
};

const getUserTrips = async (userId) => {
    try {
        // Find reservations for the user and populate the trip details
        const reservations = await Reservation.find({ userId })
            .populate('tripId') // Populate trip details
            .exec();

        // Extract the trip details from the populated data
        const trips = reservations.map((reservation) => reservation.tripId);
        return trips;
    } catch (error) {
        console.error('Error fetching user trips:', error);
        throw error;
    }
};


// GET: /trips/:tripCode - lists a single trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsFindByCode = async (req, res) => {
    const q = await Model
        .find({ code: req.params.tripCode }) // Return single record
        .exec();

    // Uncomment the following line to show results of query
    // on the console
    // console.log(q);

    if (!q) {
        // Database returned no data
        return res
            .status(404)
            .json({ err});
    } else {
        // Return resulting trip list
        return res
            .status(200)
            .json(q);
    }
};

// POST: /trips – Adds a new Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsAddTrip = async (req, res) => {
    try {
        const trip = await Trip.create({
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description,
        });

        res.status(201).json(trip); // Successfully created
    } catch (err) {
        console.error('Error adding trip:', err);
        res.status(400).json(err); // Bad request
    }
};

  
  // Uncomment the following line to show results of operation
  // on the console
  // console.log(q);  

// PUT: /trips/:tripCode - Adds a new Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsUpdateTrip = async (req, res) => {
    try {
        const trip = await Trip.findOneAndUpdate(
            { code: req.params.tripCode },
            {
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                resort: req.body.resort,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description,
            },
            { new: true }
        );

        if (!trip) {
            return res.status(404).send({
                message: `Trip not found with code ${req.params.tripCode}`,
            });
        }

        res.send(trip);
    } catch (err) {
        if (err.kind === "ObjectId") {
            return res.status(404).send({
                message: `Trip not found with code ${req.params.tripCode}`,
            });
        }
        res.status(500).json(err);
    }
};


// DELETE: /trips/:tripCode - Deletes a Trip
const tripsDeleteTrip = async (req, res) => {
    const tripCode = req.params.tripCode;
    console.log(`Received request to delete trip with code: ${tripCode}`);
    try {
        const trip = await Model.findOneAndDelete({ code: tripCode });
        if (!trip) {
            console.log(`No trip found with code: ${tripCode}`);
            return res.status(404).json({ message: `Trip with code ${tripCode} not found.` });
        }
        console.log(`Successfully deleted trip with code: ${tripCode}`);
        res.status(200).json({ message: `Trip with code ${tripCode} deleted successfully.` });
    } catch (err) {
        console.error('Error deleting trip:', err);
        res.status(500).json({ message: 'Server error while deleting the trip.' });
    }
};



module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip,
    tripsDeleteTrip,
    getUserTrips,
};