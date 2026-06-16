const Amadeus = require('amadeus');

// Initialize Amadeus API client
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID || 'placeholder_client_id',
  clientSecret: process.env.AMADEUS_CLIENT_SECRET || 'placeholder_client_secret',
  hostname: 'test' // Use 'production' for live environment
});

/**
 * Search for flight offers
 * @param {string} origin - IATA code (e.g., 'DEL')
 * @param {string} destination - IATA code (e.g., 'BOM')
 * @param {string} departureDate - YYYY-MM-DD
 * @param {number} adults - Number of passengers
 * @returns {Promise<Array>} Array of flight objects
 */
const searchFlights = async (origin, destination, departureDate, adults = 1) => {
  try {
    if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
      throw new Error('Amadeus API credentials are not set');
    }

    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departureDate,
      adults: adults,
      max: 5,
      currencyCode: 'INR'
    });

    const flightOffers = response.data;
    const processedFlights = [];

    flightOffers.forEach((offer) => {
      // Get first itinerary and first segment (simplification for direct/one-stop flights)
      const itinerary = offer.itineraries[0];
      const segments = itinerary.segments;
      const firstSegment = segments[0];
      const lastSegment = segments[segments.length - 1];

      // Extract details
      const airlineCode = firstSegment.carrierCode;
      const flightNumber = `${airlineCode} ${firstSegment.number}`;
      
      const departureTimeRaw = firstSegment.departure.at;
      const arrivalTimeRaw = lastSegment.arrival.at;
      
      const formatTime = (timeStr) => {
        const date = new Date(timeStr);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      };

      const duration = itinerary.duration.replace('PT', '').replace('H', 'h ').replace('M', 'm');
      const stops = segments.length - 1;
      
      // Amadeus returns price. If not in INR, convert (assuming 83 INR = 1 EUR/USD if Amadeus defaults to EUR)
      // We requested currencyCode: 'INR', so we assume it returns INR.
      let price = parseFloat(offer.price.total);
      
      // Safety conversion if currency is not INR (Amadeus test env sometimes ignores currencyCode)
      if (offer.price.currency !== 'INR') {
        price = Math.round(price * 83); // Simple fixed rate conversion
      }

      processedFlights.push({
        id: offer.id,
        provider: airlineCode, // Will map this to airline name in frontend if needed
        type: 'Flight',
        flightNumber,
        departureTime: formatTime(departureTimeRaw),
        arrivalTime: formatTime(arrivalTimeRaw),
        duration,
        stops,
        price: price
      });
    });

    return processedFlights;
  } catch (error) {
    console.error('Amadeus flight search error:', error.description || error.message);
    throw new Error('Failed to fetch flights from Amadeus');
  }
};

module.exports = {
  searchFlights
};
