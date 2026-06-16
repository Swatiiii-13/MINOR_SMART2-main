const { searchFlights } = require('../services/amadeusService');
const { searchTrains } = require('../services/railwayService');

const getTransportOptions = (req, res) => {
  const { destination } = req.params;

  // Mocking realistic transport options based on destination
  const transportOptions = [
    {
      id: "t1",
      provider: "IndiGo",
      type: "Flight",
      departureTime: "08:30 AM",
      arrivalTime: "10:45 AM",
      price: "₹ 5,400"
    },
    {
      id: "t2",
      provider: "Air India",
      type: "Flight",
      departureTime: "02:15 PM",
      arrivalTime: "04:30 PM",
      price: "₹ 6,200"
    },
    {
      id: "t3",
      provider: "Vande Bharat Express",
      type: "Train",
      departureTime: "06:00 AM",
      arrivalTime: "02:00 PM",
      price: "₹ 1,500"
    }
  ];

  res.status(200).json(transportOptions);
};

const searchFlightOptions = async (req, res) => {
  try {
    const { origin, destination, departureDate, adults } = req.query;
    if (!origin || !destination || !departureDate) {
      return res.status(400).json({ message: 'Missing required query parameters' });
    }
    const flights = await searchFlights(origin, destination, departureDate, adults);
    res.status(200).json(flights);
  } catch (error) {
    console.error('Flight search error in controller:', error);
    res.status(500).json({ message: 'Failed to search flights' });
  }
};

const searchTrainOptions = async (req, res) => {
  try {
    const { fromStation, toStation, date } = req.query;
    if (!fromStation || !toStation || !date) {
      return res.status(400).json({ message: 'Missing required query parameters' });
    }
    const trains = await searchTrains(fromStation, toStation, date);
    res.status(200).json(trains);
  } catch (error) {
    console.error('Train search error in controller:', error);
    res.status(500).json({ message: 'Failed to search trains' });
  }
};

module.exports = {
  getTransportOptions,
  searchFlightOptions,
  searchTrainOptions
};
