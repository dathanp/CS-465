var express = require('express');
var router = express.Router();
var { travel, getTripDetails } = require('../controllers/travel');

// GET travel page
router.get('/', travel);

// GET specific trip details page
router.get('/:tripCode', getTripDetails);

module.exports = router;