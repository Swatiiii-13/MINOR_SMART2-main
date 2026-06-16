const express = require('express');
const router = express.Router();
const { generateItinerary, saveTrip, getTravelHistory } = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, generateItinerary);
router.post('/save', protect, saveTrip);
router.get('/history', protect, getTravelHistory);

module.exports = router;
