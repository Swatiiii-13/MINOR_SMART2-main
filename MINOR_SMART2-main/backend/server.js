const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart-trip-planner')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/trips', require('./routes/tripRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/transport/flights', require('./routes/flightRoutes'));
app.use('/api/transport/trains', require('./routes/trainRoutes'));
app.use('/api/transport/buses', require('./routes/busRoutes'));
app.use('/api/transport', require('./routes/transportRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/hotels', require('./routes/hotelRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

// Basic Error Handling
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
