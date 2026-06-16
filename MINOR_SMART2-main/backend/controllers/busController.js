const { generateWithFallback } = require('../services/aiService');

const getBuses = async (req, res) => {
  const { origin, destination, date, travelers } = req.query;

  if (!origin || !destination || !date || !travelers) {
    return res.status(400).json({ message: 'Missing required query parameters' });
  }

  const numTravelers = parseInt(travelers) || 1;

  const fallbackBuses = [
    { operatorName: "VRL Travels", busType: "A/C Sleeper (2+1)", departureTime: "09:00 PM", arrivalTime: "06:30 AM", duration: "9h 30m", farePerPerson: 950, totalFareForGroup: 950 * numTravelers, amenities: ["Water Bottle", "Charging Point", "Blanket"] },
    { operatorName: "SRS Travels", busType: "Scania Multi-Axle A/C Semi-Sleeper", departureTime: "10:00 PM", arrivalTime: "07:15 AM", duration: "9h 15m", farePerPerson: 850, totalFareForGroup: 850 * numTravelers, amenities: ["Charging Point", "Reading Light"] },
    { operatorName: "KSRTC (Airavat)", busType: "Club Class Eicher A/C Semi-Sleeper", departureTime: "08:30 PM", arrivalTime: "05:45 AM", duration: "9h 15m", farePerPerson: 1100, totalFareForGroup: 1100 * numTravelers, amenities: ["Pillow", "WiFi", "Emergency Hammer"] }
  ];

  try {
    const mainConfig = {
      generationConfig: {
        responseMimeType: 'application/json'
      }
    };

    const prompt = `You are a travel data API. Generate exactly 5 realistic Indian bus services from ${origin} to ${destination} for ${travelers} passengers. You MUST return ONLY a valid JSON array. No markdown, no backticks, no explanation. Each object MUST have exactly these keys: operatorName (string), busType (string), departureTime (string in HH:MM AM/PM format), arrivalTime (string in HH:MM AM/PM format), duration (string like '8h 30m'), farePerPerson (number in INR), totalFareForGroup (number in INR), amenities (array of strings). Example operator names: KSRTC, VRL Travels, SRS Travels, Orange Tours, Sharma Travels.`;

    const result = await generateWithFallback(mainConfig, prompt);
    const response = await result.response;
    let rawText = response.text();
    console.log("=== RAW BUS RESPONSE ===");
    console.log(rawText);
    console.log("========================");

    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    if (rawText.startsWith('[') === false) {
      const startIndex = rawText.indexOf('[');
      const endIndex = rawText.lastIndexOf(']');
      rawText = rawText.substring(startIndex, endIndex + 1);
    }
    const parsedData = JSON.parse(rawText);
    return res.status(200).json(parsedData);
  } catch (error) {
    console.error('Error fetching buses from Gemini. Engaging local fallback...', error);
    return res.status(200).json(fallbackBuses);
  }
};

module.exports = { getBuses };
