const express = require('express');
const router = express.Router();
const { generateWithFallback } = require('../services/aiService');

router.get('/', async (req, res) => {
  const { origin, destination, date, travelers } = req.query;

  if (!origin || !destination || !date || !travelers) {
    return res.status(400).json({ error: 'Missing required query parameters' });
  }

  const numTravelers = parseInt(travelers) || 1;

  // Generate robust local fallback data matching parameters
  const localFallbackFlights = [
    {
      airlineName: "IndiGo",
      flightNumber: "6E-504",
      departureTime: "06:15 AM",
      arrivalTime: "08:30 AM",
      duration: "2h 15m",
      stops: "Non-stop",
      farePerPerson: 5400,
      totalFareForGroup: 5400 * numTravelers,
      class: "Economy"
    },
    {
      airlineName: "Air India",
      flightNumber: "AI-802",
      departureTime: "09:30 AM",
      arrivalTime: "11:55 AM",
      duration: "2h 25m",
      stops: "Non-stop",
      farePerPerson: 6200,
      totalFareForGroup: 6200 * numTravelers,
      class: "Economy"
    },
    {
      airlineName: "Vistara",
      flightNumber: "UK-981",
      departureTime: "12:45 PM",
      arrivalTime: "03:05 PM",
      duration: "2h 20m",
      stops: "Non-stop",
      farePerPerson: 7500,
      totalFareForGroup: 7500 * numTravelers,
      class: "Economy"
    },
    {
      airlineName: "SpiceJet",
      flightNumber: "SG-332",
      departureTime: "04:15 PM",
      arrivalTime: "06:40 PM",
      duration: "2h 25m",
      stops: "Non-stop",
      farePerPerson: 4800,
      totalFareForGroup: 4800 * numTravelers,
      class: "Economy"
    },
    {
      airlineName: "Akasa Air",
      flightNumber: "QP-112",
      departureTime: "08:00 PM",
      arrivalTime: "10:15 PM",
      duration: "2h 15m",
      stops: "Non-stop",
      farePerPerson: 5100,
      totalFareForGroup: 5100 * numTravelers,
      class: "Economy"
    }
  ];

  try {
    const mainConfig = {
      generationConfig: {
        responseMimeType: "application/json"
      }
    };

    const prompt = `You are a travel data API. Generate exactly 5 realistic Indian domestic flights from ${origin} to ${destination} on ${date} for ${numTravelers} passengers. You MUST return ONLY a valid JSON array. No markdown, no backticks, no explanation. Each object MUST have exactly these keys: airlineName (string, use real Indian airlines like IndiGo, Air India, SpiceJet, Vistara, Akasa Air), flightNumber (string like '6E-234'), departureTime (string in HH:MM AM/PM format), arrivalTime (string in HH:MM AM/PM format), duration (string like '1h 20m'), stops (string like 'Non-stop' or '1 Stop'), farePerPerson (number in INR, realistic Indian domestic fare between 2500 and 15000), totalFareForGroup (number in INR, farePerPerson multiplied by number of travelers), class (string like 'Economy'). Use realistic flight numbers and timings.`;

    const result = await generateWithFallback(mainConfig, prompt);
    const response = await result.response;
    let rawText = response.text().trim();
    console.log("=== RAW FLIGHT RESPONSE ===");
    console.log(rawText);
    console.log("===========================");
    
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    if (!rawText.startsWith('[')) {
      const startIndex = rawText.indexOf('[');
      const endIndex = rawText.lastIndexOf(']');
      if (startIndex !== -1 && endIndex !== -1) {
        rawText = rawText.substring(startIndex, endIndex + 1);
      }
    }
    
    console.log("Raw flight response:", rawText);
    const parsedData = JSON.parse(rawText);
    return res.json(parsedData);
  } catch (error) {
    console.error('Error fetching flights dynamically. Engaging local grounded fallback...', error);
    return res.json(localFallbackFlights);
  }
});

module.exports = router;
