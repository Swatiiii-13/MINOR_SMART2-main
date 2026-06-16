const Razorpay = require('razorpay');
const crypto = require('crypto');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');

// Initialize Razorpay client. Secure key fallback for testing.
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholderKeyId123',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholderKeySecret456'
});

const createOrder = async (req, res) => {
  try {
    const { amount } = req.body; // Amount in INR from frontend
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    const options = {
      amount: Math.round(Number(amount) * 100), // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    // If key_id is a placeholder, return a mocked order ID for simulated testing
    if (process.env.RAZORPAY_KEY_ID && !process.env.RAZORPAY_KEY_ID.includes('placeholder')) {
      const order = await razorpay.orders.create(options);
      return res.status(200).json({
        id: order.id,
        amount: order.amount,
        currency: order.currency
      });
    } else {
      // Mock order generation for offline/sandbox simulated flows
      const mockOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
      return res.status(200).json({
        id: mockOrderId,
        amount: options.amount,
        currency: options.currency,
        isMock: true
      });
    }
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return res.status(500).json({ message: 'Failed to create payment order' });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      hotelId,
      checkIn,
      checkOut
    } = req.body;

    const userId = req.user.id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !hotelId || !checkIn || !checkOut) {
      return res.status(400).json({ message: 'Missing required payment or booking fields' });
    }

    let isVerified = false;

    // Check if it is a mock order verification
    if (razorpay_order_id.startsWith('order_') && (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes('placeholder'))) {
      // Mock verification for offline simulation
      isVerified = true;
    } else {
      // Real signature verification using HMAC SHA256
      const secret = process.env.RAZORPAY_KEY_SECRET || 'placeholderKeySecret456';
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      isVerified = generatedSignature === razorpay_signature;
    }

    if (!isVerified) {
      return res.status(400).json({ message: 'Payment verification signature mismatch' });
    }

    // Payment verified successfully! Proceed with Booking creation
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDifference = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if (nights <= 0) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // Atomic room allocation
    const hotel = await Hotel.findOneAndUpdate(
      { _id: hotelId, availableRooms: { $gt: 0 } },
      { $inc: { availableRooms: -1 } },
      { returnDocument: 'after' }
    );

    if (!hotel) {
      return res.status(400).json({ message: 'No rooms available or hotel not found' });
    }

    const pricePerNight = hotel.currentPrice || hotel.basePrice;
    const totalCost = pricePerNight * nights;

    // Save authentic booking details with the verified paymentId
    const booking = await Booking.create({
      userId,
      hotelId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalCost,
      status: 'confirmed',
      paymentId: razorpay_payment_id
    });

    return res.status(201).json({
      success: true,
      message: 'Payment verified and booking confirmed successfully',
      booking
    });

  } catch (error) {
    console.error('Error during payment verification:', error);
    return res.status(500).json({ message: 'Internal server error during verification' });
  }
};

module.exports = {
  createOrder,
  verifyPayment
};
