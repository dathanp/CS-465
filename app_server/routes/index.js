var express = require('express');
var router = express.Router();
const ctrlMain = require('../controllers/main');
const reservationsRouter = require('./reservations'); // Import the reservations router

/* GET home page. */
router.get('/', ctrlMain.index);

/* Use reservations routes */
router.use('/reservations', reservationsRouter);

module.exports = router;
