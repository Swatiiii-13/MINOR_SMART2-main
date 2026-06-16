const express = require('express');
const router = express.Router();
const { getTransportOptions, searchFlightOptions, searchTrainOptions } = require('../controllers/transportController');

router.get('/:destination', getTransportOptions);
router.get('/flights/search', searchFlightOptions);
router.get('/trains/search', searchTrainOptions);

module.exports = router;
