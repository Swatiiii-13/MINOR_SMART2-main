const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
  try {
    const { hotelId, checkIn, checkOut } = req.body;
    const userId = req.user.id;

    // Validate inputs
    if (!hotelId || !checkIn || !checkOut) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Calculate nights first to ensure request is valid before performing database updates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDifference = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if (nights <= 0) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // Perform atomic verification and decrement in one single operation to resolve race conditions
    const hotel = await Hotel.findOneAndUpdate(
      { _id: hotelId, availableRooms: { $gt: 0 } },
      { $inc: { availableRooms: -1 } },
      { returnDocument: 'after' }
    );

    if (!hotel) {
      return res.status(400).json({ message: 'No rooms available or hotel not found' });
    }

    // Calculate totalCost using currentPrice virtual
    const pricePerNight = hotel.currentPrice;
    const totalCost = pricePerNight * nights;

    // Create Booking document
    const booking = await Booking.create({
      userId,
      hotelId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalCost,
      status: 'confirmed'
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
};
