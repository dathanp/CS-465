const express = require('express'); // Express app
const router = express.Router(); // Router logic

// This is where we import the controllers we will route
const tripsController = require('../controllers/trips');

// Define route for our trips endpoint
router
    .route('/trips') // Specify the '/trips' endpoint
    .get(tripsController.tripsList) // GET Method routes tripList
    .post(tripsController.tripsAddTrip);

    //GET method routes tripsfindbycode = requires parameter
router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode)
    .put(tripsController.tripsUpdateTrip);

module.exports = router;
