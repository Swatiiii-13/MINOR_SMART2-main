const express = require('express');
const router = express.Router();
const { getHotels } = require('../controllers/hotelController');

router.get('/:destination', getHotels);

module.exports = router;
