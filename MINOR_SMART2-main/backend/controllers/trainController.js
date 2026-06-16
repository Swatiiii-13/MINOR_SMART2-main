const { generateWithFallback } = require('../services/aiService');

const getTrains = async (req, res) => {
  const { origin, destination, date, travelers } = req.query;

  if (!origin || !destination || !date || !travelers) {
    return res.status(400).json({ message: 'Missing required query parameters' });
  }

  const numTravelers = parseInt(travelers) || 1;

  const fallbackTrains = [
    { trainName: "Shatabdi Express", trainNumber: "12002", departureTime: "06:00 AM", arrivalTime: "01:30 PM", duration: "7h 30m", availableClasses: [{ className: "CC", farePerPerson: 1100 }, { className: "EC", farePerPerson: 2200 }], totalFareForGroup: 1100 * numTravelers },
    { trainName: "Jan Shatabdi Express", trainNumber: "12080", departureTime: "02:00 PM", arrivalTime: "09:45 PM", duration: "7h 45m", availableClasses: [{ className: "2S", farePerPerson: 320 }, { className: "CC", farePerPerson: 850 }], totalFareForGroup: 320 * numTravelers },
    { trainName: "Intercity Express", trainNumber: "12629", departureTime: "04:30 PM", arrivalTime: "11:55 PM", duration: "7h 25m", availableClasses: [{ className: "2S", farePerPerson: 280 }, { className: "CC", farePerPerson: 750 }], totalFareForGroup: 280 * numTravelers }
  ];

  try {
    const mainConfig = {
      generationConfig: {
        responseMimeType: 'application/json'
      }
    };

    const prompt = `You are a travel data API. Generate exactly 5 realistic Indian Railways trains from ${origin} to ${destination} for ${travelers} passengers. You MUST return ONLY a valid JSON array. No markdown, no backticks, no explanation. Each object MUST have exactly these keys: trainName (string), trainNumber (string like '12345'), departureTime (string in HH:MM AM/PM format), arrivalTime (string in HH:MM AM/PM format), duration (string like '8h 30m'), availableClasses (array of objects with className and farePerPerson as number in INR), totalFareForGroup (number in INR). Example train names: Rajdhani Express, Shatabdi Express, Hubli Express.`;

    const result = await generateWithFallback(mainConfig, prompt);
    const response = await result.response;
    let rawText = response.text();
    console.log("=== RAW TRAIN RESPONSE ===");
    console.log(rawText);
    console.log("==========================");

    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    if (rawText.startsWith('[') === false) {
      const startIndex = rawText.indexOf('[');
      const endIndex = rawText.lastIndexOf(']');
      rawText = rawText.substring(startIndex, endIndex + 1);
    }
    const parsedData = JSON.parse(rawText);
    return res.status(200).json(parsedData);
  } catch (error) {
    console.error('Error fetching trains from Gemini. Engaging local fallback...', error);
    return res.status(200).json(fallbackTrains);
  }
};

module.exports = { getTrains };
