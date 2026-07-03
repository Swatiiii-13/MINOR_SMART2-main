const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

console.log('Connecting to MONGO_URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error details:', err);
    process.exit(1);
  });
