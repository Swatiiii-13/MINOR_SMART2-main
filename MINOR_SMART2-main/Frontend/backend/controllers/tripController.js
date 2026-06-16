const { generateWithFallback, getGroundedDestinationContext, genAI } = require('../services/aiService');
const Trip = require('../models/Trip');

// Pre-trip coordinate coordinates for Indian travel hubs
const INDIAN_CITIES_COORDINATES = {
  mumbai: { lat: 19.0760, lon: 72.8777 },
  delhi: { lat: 28.6139, lon: 77.2090 },
  bangalore: { lat: 12.9716, lon: 77.5946 },
  bengaluru: { lat: 12.9716, lon: 77.5946 },
  kolkata: { lat: 22.5726, lon: 88.3639 },
  chennai: { lat: 13.0827, lon: 80.2707 },
  hyderabad: { lat: 17.3850, lon: 78.4867 },
  pune: { lat: 18.5204, lon: 73.8567 },
  ahmedabad: { lat: 23.0225, lon: 72.5714 },
  jaipur: { lat: 26.9124, lon: 75.7873 },
  goa: { lat: 15.2993, lon: 74.1240 },
  manali: { lat: 32.2396, lon: 77.1887 },
  shimla: { lat: 31.1048, lon: 77.1734 },
  agra: { lat: 27.1767, lon: 78.0081 },
  jammu: { lat: 32.7266, lon: 74.8570 },
  srinagar: { lat: 34.0837, lon: 74.7973 },
  kochi: { lat: 9.9312, lon: 76.2673 },
  alleppey: { lat: 9.4981, lon: 76.3388 },
  munnar: { lat: 10.0889, lon: 77.0595 },
  varkala: { lat: 8.7302, lon: 76.7136 },
  ooty: { lat: 11.4102, lon: 76.6950 },
  mysore: { lat: 12.2958, lon: 76.6394 },
  coorg: { lat: 12.3375, lon: 75.8069 },
  amritsar: { lat: 31.6340, lon: 74.8723 },
  leh: { lat: 34.1526, lon: 77.5771 },
  rishikesh: { lat: 30.0869, lon: 78.2676 },
  haridwar: { lat: 29.9457, lon: 78.1642 },
  darjeeling: { lat: 27.0410, lon: 88.2627 },
  gangtok: { lat: 27.3314, lon: 88.6138 },
  pondicherry: { lat: 11.9416, lon: 79.8083 },
  hampi: { lat: 15.3350, lon: 76.4600 },
  hubli: { lat: 15.3647, lon: 75.1240 }
};

const getCoordinates = (cityName) => {
  const norm = String(cityName).toLowerCase().trim();
  for (const [key, coords] of Object.entries(INDIAN_CITIES_COORDINATES)) {
    if (norm.includes(key) || key.includes(norm)) {
      return coords;
    }
  }
  return null;
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// -----------------------------
// FALLBACK DATA GENERATOR
// -----------------------------
const generateFallbackTrip = ({
  destination,
  duration,
  budget,
}) => {
  const totalDays = Number(duration);
  const itinerary = [];

  const groundedCtx = getGroundedDestinationContext(destination);

  let attractionsList = [];
  let restaurantsList = [];

  if (groundedCtx) {
    attractionsList = [...groundedCtx.attractions];
    restaurantsList = [...groundedCtx.restaurants];
  } else {
    // Generate beautiful, human-like non-repeating activities for any random city to ensure 100% immersion and 0% numbered placeholders
    const organicActivities = [
      { name: "Old Quarter Heritage Walk", desc: "A guided walk exploring the oldest streets, historic neighborhoods, and traditional architecture of the city.", cost: 100 },
      { name: "Sunrise Hill Viewpoint", desc: "A short early-morning climb to a scenic panoramic spot overlooking the complete cityscape as the sun rises.", cost: 50 },
      { name: "Central Botanical Gardens", desc: "A serene walk inside a highly famous, lush green garden conservation complex filled with exotic local plants.", cost: 120 },
      { name: "Lakeside Sunset Promenade", desc: "A beautiful walk alongside a popular waterfront area to enjoy stunning dusk skyline silhouettes.", cost: 0 },
      { name: "Ancient Architectural Palace", desc: "A cultural exploration of the grandest historic fortress or monumental castle in the region.", cost: 250 },
      { name: "Traditional Handloom Bazaar", desc: "A vibrant market walk exploring pure local handicrafts, colorful fabrics, and artisanal souvenir stands.", cost: 50 },
      { name: "Regional Culinary Workshop", desc: "An authentic cooking class where you prepare and taste traditional delicacies from local home chefs.", cost: 600 },
      { name: "Modern Lifestyle Plaza", desc: "A visit to the highest rated shopping center, showcasing high-end local cafes and modern skyline viewing decks.", cost: 150 },
      { name: "Evening Folk Theater Show", desc: "A delightful cultural experience showcasing regional classical music, folk dances, and local stage plays.", cost: 300 },
      { name: "Quiet Riverside Retreat", desc: "A peaceful afternoon escape near scenic waterways, perfect for photography and relaxing strolls.", cost: 0 },
      { name: "Historic Clocktower Market", desc: "A stroll around the ancient clocktower square, tasting famous street foods and aromatic spices.", cost: 100 },
      { name: "West-facing Rooftop Bistro", desc: "A luxurious final evening dinner overlooking the golden lit city streets and historical markers.", cost: 450 }
    ];

    attractionsList = organicActivities.map(act => ({
      name: `${destination} ${act.name}`,
      desc: act.desc,
      cost: act.cost
    }));

    restaurantsList = [
      `${destination} Traditional Kitchen`,
      `The Grand ${destination} Cafe`,
      `Local Heritage Bistro`,
      `Skyline Panoramic Diner`
    ];
  }

  let attIndex = 0;
  for (let i = 1; i <= totalDays; i++) {
    const morningAtt = attractionsList[attIndex % attractionsList.length];
    attIndex++;
    const afternoonAtt = attractionsList[attIndex % attractionsList.length];
    attIndex++;
    const eveningAtt = attractionsList[attIndex % attractionsList.length];
    attIndex++;

    const rest1 = restaurantsList[(i - 1) % restaurantsList.length];
    const rest2 = restaurantsList[i % restaurantsList.length];

    itinerary.push({
      day: i,
      theme: `Day ${i}: Grounded Unique ${groundedCtx ? groundedCtx.name : destination} Explorer`,
      morning: {
        activity: `Begin your morning visiting ${morningAtt.name}. ${morningAtt.desc}`,
        imageKeyword: `${morningAtt.name} ${destination} morning travel photography`,
        costEstimate: morningAtt.cost || 120,
        title: `Vibrant Morning at ${morningAtt.name}`,
        story: `Experience the early morning tranquil ambiance at ${morningAtt.name} before mainstream crowds arrive.`,
        localInsight: groundedCtx ? groundedCtx.localInsight : `Arrive early at ${morningAtt.name} to witness local cultural rituals.`,
        hiddenGem: attractionsList[(attIndex + 1) % attractionsList.length].name,
        foodRecommendation: rest1,
        bestTimeToVisit: "7:00 AM - 9:30 AM",
        photographyTip: "Capture high-contrast light reflections off colonial structures.",
        safetyTip: "Keep comfortable hiking footwear handy.",
        weatherAdvice: "Cool, breeze mornings.",
        crowdLevel: "Low",
        vibe: "Serene & Refreshing"
      },
      afternoon: {
        activity: `Embark on a dynamic guided tour around ${afternoonAtt.name}. ${afternoonAtt.desc}`,
        imageKeyword: `${afternoonAtt.name} ${destination} structure architecture`,
        costEstimate: afternoonAtt.cost || 200,
        title: `Exploring Heritage: ${afternoonAtt.name}`,
        story: `Uncover the stunning architectural marvels and stories carved inside the walls of ${afternoonAtt.name}.`,
        localInsight: `A quaint local handicraft bazaar is situated directly behind ${afternoonAtt.name}.`,
        hiddenGem: attractionsList[(attIndex + 2) % attractionsList.length].name,
        foodRecommendation: rest2,
        bestTimeToVisit: "1:30 PM - 3:30 PM",
        photographyTip: "Use shadows to emphasize the ancient patterns.",
        safetyTip: "Stay hydrated with fresh coconut water.",
        weatherAdvice: "Warm and bright conditions.",
        crowdLevel: "Moderate",
        vibe: "Enriching & Historical"
      },
      evening: {
        activity: `Spend a highly scenic sunset walking through the scenic boundaries of ${eveningAtt.name}. ${eveningAtt.desc}`,
        imageKeyword: `${eveningAtt.name} ${destination} golden sunset viewpoint`,
        costEstimate: eveningAtt.cost || 180,
        title: `Spectacular Sunset at ${eveningAtt.name}`,
        story: `Reflect on your magnificent day as you capture the glowing golden sun dipping below the horizons at ${eveningAtt.name}.`,
        localInsight: `Clifftop spots overlooking ${eveningAtt.name} are absolute gold mines for photography.`,
        hiddenGem: attractionsList[(attIndex + 3) % attractionsList.length].name,
        foodRecommendation: rest1,
        bestTimeToVisit: "5:30 PM - 7:30 PM",
        photographyTip: "Focus on rich crimson silhouettes during dusk.",
        safetyTip: "Confirm return taxi reservations before dark.",
        weatherAdvice: "Cool, calming coastal wind.",
        crowdLevel: "High",
        vibe: "Cinematic & Panoramic"
      },
      localFoodSuggestion: `Enjoy a authentic multi-course meal at ${rest1} trying regional culinary specialties.`
    });
  }

  return {
    success: true,
    isFallback: true,

    tripSummary: {
      destination,
      totalDays,
      estimatedCost: `₹${budget}`,
      generalSafetyTip:
        'Stay hydrated, avoid isolated places at night, and keep emergency contacts accessible.',
    },

    budgetBreakdown: {
      totalCost: Number(budget),
      stayCost: Math.floor(budget * 0.4),
      transportCost: Math.floor(budget * 0.2),
      foodCost: Math.floor(budget * 0.15),
      activitiesCost: Math.floor(budget * 0.25),

      dailyExpenses: Array.from({ length: totalDays }, (_, index) => ({
        day: index + 1,
        cost: Math.floor(budget / totalDays),
      })),
    },

    itinerary,
  };
};

// -----------------------------
// BACKEND CACHE & REUSE SYSTEM
// -----------------------------
// Memory-bounded cache for trip generations to optimize latency and prevent redundant AI calls
const tripCache = new Map();
const MAX_CACHE_SIZE = 50;

const getCacheKey = (body) => {
  const { destination, duration, travelers, budget, preferences, originCity, tripType } = body;
  const prefStr = Array.isArray(preferences) ? preferences.join(',') : String(preferences || '');
  return `${String(destination).toLowerCase().trim()}_${duration}_${travelers}_${budget}_${prefStr.toLowerCase()}_${String(originCity).toLowerCase().trim()}_${String(tripType).toLowerCase().trim()}`;
};

// -----------------------------
// GENERATE ITINERARY
// -----------------------------
const generateItinerary = async (req, res) => {
  const cacheKey = getCacheKey(req.body);
  try {
    const {
      destination,
      duration,
      travelers,
      budget,
      preferences,
      originCity,
      tripType,
    } = req.body;

    // -----------------------------
    // CACHE LOOKUP
    // -----------------------------
    if (tripCache.has(cacheKey)) {
      console.log('Serving travel itinerary and budget breakdown from backend cache.');
      return res.status(200).json(tripCache.get(cacheKey));
    }

    // -----------------------------
    // VALIDATION & SANITY CHECKS
    // -----------------------------
    if (
      !destination ||
      !duration ||
      !travelers ||
      !budget ||
      !originCity ||
      !tripType
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const numDays = parseInt(duration) || 0;
    const numTravelers = parseInt(travelers) || 0;
    const userBudget = parseInt(String(budget).replace(/\D/g, '')) || 0;

    if (numDays <= 0 || numTravelers <= 0 || userBudget <= 0) {
      return res.status(200).json({
        success: false,
        message: 'Invalid travel parameters. Travelers, duration, and budget must be positive numbers.',
        suggestion: 'Please verify that duration, travelers, and budget are positive numeric values.'
      });
    }

    // -----------------------------
    // PRE-TRIP FEASIBILITY VALIDATION SYSTEM
    // -----------------------------
    const originCoords = getCoordinates(originCity);
    const destCoords = getCoordinates(destination);
    
    let distance = 600; // Default medium-long distance fallback
    if (originCoords && destCoords) {
      distance = calculateDistance(originCoords.lat, originCoords.lon, destCoords.lat, destCoords.lon);
    } else if (String(originCity).toLowerCase().trim() === String(destination).toLowerCase().trim()) {
      distance = 0; // Same city
    }

    // Cost baseline definitions (Realistic minimums in INR)
    const stayCostPerRoomNight = 800; // Economy lodge/homestay baseline
    const foodCostPerDayPerson = 300; // Simple local meals baseline
    const localTransit = 300;         // Local city transport baseline
    
    // Transport fee estimation based on geographic distance
    let minTransportCostPerPerson = 900; // Standard intercity train/bus baseline
    if (distance < 50) {
      minTransportCostPerPerson = localTransit;
    } else if (distance >= 50 && distance < 300) {
      minTransportCostPerPerson = 450; // Short-distance express train/bus
    } else if (distance >= 300 && distance < 800) {
      minTransportCostPerPerson = 950; // Mid-distance sleeper class or private bus
    } else {
      minTransportCostPerPerson = 3200; // Long-distance flight or premium super-express train
    }

    // Mathematical projection of real minimal required costs
    const minStayCost = numDays * Math.ceil(numTravelers / 2) * stayCostPerRoomNight;
    const minFoodCost = numDays * numTravelers * foodCostPerDayPerson;
    const minTransportCost = numTravelers * minTransportCostPerPerson;
    const totalRequiredMin = minStayCost + minFoodCost + minTransportCost;

    if (userBudget < totalRequiredMin) {
      console.log(`Pre-Trip Feasibility Check Failed: Budget ₹${userBudget} < Required Min ₹${totalRequiredMin}`);
      
      let suggestion = `Increase budget to at least ₹${totalRequiredMin.toLocaleString('en-IN')}`;
      
      // Smart Suggestion: Calculate maximum days possible with the current user budget
      if (userBudget > minTransportCost) {
        const remainingForStayAndFood = userBudget - minTransportCost;
        const dailyStayAndFood = (Math.ceil(numTravelers / 2) * stayCostPerRoomNight) + (numTravelers * foodCostPerDayPerson);
        const maxPossibleDays = Math.floor(remainingForStayAndFood / dailyStayAndFood);
        
        if (maxPossibleDays >= 1) {
          suggestion += ` or reduce trip duration to ${maxPossibleDays} day${maxPossibleDays > 1 ? 's' : ''}`;
        } else {
          suggestion += ` or reduce the number of travelers`;
        }
      } else {
        suggestion += ` or consider a closer destination to lower transit fees (Transport alone requires ₹${minTransportCost.toLocaleString('en-IN')})`;
      }

      return res.status(200).json({
        success: false,
        message: `Your budget of ₹${userBudget.toLocaleString('en-IN')} is insufficient for a ${numDays}-day trip to ${destination} for ${numTravelers} traveler${numTravelers > 1 ? 's' : ''}.`,
        suggestion: suggestion,
        estimatedMinCosts: {
          stay: minStayCost,
          food: minFoodCost,
          transport: minTransportCost,
          totalMinimumRequired: totalRequiredMin
        }
      });
    }

    console.log('========== NEW TRIP REQUEST ==========');
    console.log(req.body);



    // -----------------------------
    // STEP 1: FETCH REAL DESTINATION INTELLIGENCE
    // -----------------------------
    console.log('Fetching real destination grounding data...');
    const groundingConfig = { responseMimeType: 'application/json' };
    const groundingPrompt = `List 15 real, highly famous tourist attractions/landmarks, 8 real local cafes/restaurants, and 5 real popular hotels in exactly this destination: ${destination}. Return ONLY a JSON object with keys "attractions", "restaurants", "hotels" containing arrays of real names. Do not invent places.`;
    const groundingResult = await generateWithFallback(groundingConfig, groundingPrompt);
    const realPlacesJSON = (await groundingResult.response).text().replace(/```json/g, '').replace(/```/g, '').trim();
    
    console.log('Grounding Data Fetched successfully.');

    // -----------------------------
    // STEP 2: MAIN PROMPT INJECTION
    // -----------------------------
    const prompt = `
You are a master travel curator and local expert for ${destination}.

Generate an immersive, cinematic, hyper-detailed travel itinerary.

Trip Details:
- Destination: ${destination}
- Duration: ${duration} days
- Travelers: ${travelers}
- Budget: ₹${budget}
- Trip Type: ${tripType}
- Origin City: ${originCity}
- Preferences: ${preferences && Array.isArray(preferences)
        ? preferences.join(', ')
        : 'None'
      }

IMPORTANT RULES:

1. DESTINATION-AWARE INTELLIGENCE (CRITICAL):
- You MUST build itineraries strictly using the REAL, geographically accurate places fetched for this destination.
- DO NOT invent fake placeholder activities.
- Here are the actual attractions, restaurants, and hotels you MUST use to build this itinerary:
${realPlacesJSON}
- You MUST use the exact names from this provided data block.

2. NEVER use generic phrases:
- "explore the beauty"
- "vibrant culture"
- "stroll around"
- "enjoy the views"
- "hidden gems"

3. Every activity MUST feel unique and cinematic:
- BAD: "Enjoy beautiful landscapes and local experiences."
- GOOD: "Start your morning at Fontainhas, where colorful Portuguese-era streets, hidden bakeries, and quiet art cafés create a completely different atmosphere."

4. IMAGE ACCURACY IMPROVEMENT (CRITICAL):
- Every imageKeyword MUST be highly specific to the destination, activity, time of day, and location vibe.
- BAD: "nature cinematic", "travel sunset", "city exploration", "Goa tourism"
- GOOD: "Fontainhas Goa portuguese street morning", "Baga beach sunset shack Goa", "Ocean Pearl Hubli hotel lobby"

5. AVOID REPETITION COMPLETELY (CRITICAL):
- Every single day of the itinerary MUST feature completely unique and distinct locations, attractions, cafes, and activities.
- DO NOT reuse the same place cards, attractions, titles, or descriptions on subsequent days.
- Distribute attractions logically (e.g. Day 1: Central/Latin Panaji Quarter, Day 2: North Goa Beaches, Day 3: South Goa quiet escapes, Day 4: Spice plantations and heritage sights).
- Track the places used, ensuring zero duplicate cards, zero repeating activity titles, and zero duplicated description phrases.

6. Costs must be realistic in INR.

7. Return STRICT JSON ONLY.

8. TOKEN LIMIT CONSTRAINTS (CRITICAL): Keep all "activity", "story", and "localInsight" fields highly concise (maximum 1-2 sentences). This is to ensure that the complete multi-day itinerary JSON object fits within strict output token limits and does not get truncated.

Required JSON Structure:

{
  "tripSummary": {
    "destination": "${destination}",
    "totalDays": ${Number(duration)},
    "estimatedCost": "",
    "generalSafetyTip": ""
  },

  "budgetBreakdown": {
    "totalCost": 0,
    "stayCost": 0,
    "transportCost": 0,
    "foodCost": 0,
    "activitiesCost": 0,

    "dailyExpenses": [
      {
        "day": 1,
        "cost": 0
      }
    ]
  },

  "itinerary": [
    {
      "day": 1,

      "theme": "",

      "morning": {
        "activity": "",
        "imageKeyword": "",
        "costEstimate": 0,
        "title": "",
        "story": "",
        "localInsight": "",
        "hiddenGem": "",
        "foodRecommendation": "",
        "bestTimeToVisit": "",
        "photographyTip": "",
        "safetyTip": "",
        "weatherAdvice": "",
        "crowdLevel": "",
        "estimatedSpend": "",
        "vibe": ""
      },

      "afternoon": {
        "activity": "",
        "imageKeyword": "",
        "costEstimate": 0,
        "title": "",
        "story": "",
        "localInsight": "",
        "hiddenGem": "",
        "foodRecommendation": "",
        "bestTimeToVisit": "",
        "photographyTip": "",
        "safetyTip": "",
        "weatherAdvice": "",
        "crowdLevel": "",
        "estimatedSpend": "",
        "vibe": ""
      },

      "evening": {
        "activity": "",
        "imageKeyword": "",
        "costEstimate": 0,
        "title": "",
        "story": "",
        "localInsight": "",
        "hiddenGem": "",
        "foodRecommendation": "",
        "bestTimeToVisit": "",
        "photographyTip": "",
        "safetyTip": "",
        "weatherAdvice": "",
        "crowdLevel": "",
        "estimatedSpend": "",
        "vibe": ""
      },

      "localFoodSuggestion": ""
    }
  ]
}

The itinerary array MUST contain exactly ${duration} items.
`;

    // -----------------------------
    // AI GENERATION
    // -----------------------------
    const mainConfig = {
      generationConfig: {
        temperature: 0.9,
        topP: 1,
        topK: 32,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
      },
    };
    const result = await generateWithFallback(mainConfig, prompt);

    const response = await result.response;

    let text = response.text();

    // Cleanup markdown wrapping if Gemini returns it
    text = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    // -----------------------------
    // PARSE JSON
    // -----------------------------
    let parsedData;

    try {
      parsedData = JSON.parse(text);
    } catch (parseError) {
      console.error('========== JSON PARSE ERROR. FALLING BACK GRACEFULLY... ==========');
      console.error(text);

      const fallbackTrip = generateFallbackTrip(req.body);
      
      // Store in backend cache for subsequent rapid requests
      if (tripCache.size >= MAX_CACHE_SIZE) {
        const firstKey = tripCache.keys().next().value;
        tripCache.delete(firstKey);
      }
      tripCache.set(cacheKey, fallbackTrip);

      return res.status(200).json(fallbackTrip);
    }

    // -----------------------------
    // SANITIZE & VALIDATE BUDGET BREAKDOWN (HIGH PERFORMANCE & CONSISTENCY)
    // -----------------------------
    if (parsedData && parsedData.budgetBreakdown) {
      const breakdown = parsedData.budgetBreakdown;
      breakdown.stayCost = Math.round(Number(String(breakdown.stayCost || 0).replace(/\D/g, ''))) || 0;
      breakdown.transportCost = Math.round(Number(String(breakdown.transportCost || 0).replace(/\D/g, ''))) || 0;
      breakdown.foodCost = Math.round(Number(String(breakdown.foodCost || 0).replace(/\D/g, ''))) || 0;
      breakdown.activitiesCost = Math.round(Number(String(breakdown.activitiesCost || 0).replace(/\D/g, ''))) || 0;
      
      const calculatedTotal = breakdown.stayCost + breakdown.transportCost + breakdown.foodCost + breakdown.activitiesCost;
      breakdown.totalCost = Math.round(Number(String(breakdown.totalCost || 0).replace(/\D/g, ''))) || calculatedTotal;
      
      // If totalCost is zero or wildly inconsistent, align it with the budget or calculated total
      if (!breakdown.totalCost) {
        breakdown.totalCost = Math.round(Number(budget)) || calculatedTotal || 10000;
      }
      
      // Force proportional fallback if categories are all zero
      if (calculatedTotal === 0) {
        breakdown.stayCost = Math.floor(breakdown.totalCost * 0.4);
        breakdown.transportCost = Math.floor(breakdown.totalCost * 0.2);
        breakdown.foodCost = Math.floor(breakdown.totalCost * 0.15);
        breakdown.activitiesCost = Math.floor(breakdown.totalCost * 0.25);
      } else if (Math.abs(breakdown.totalCost - calculatedTotal) > 100) {
        // Reconcile differences by scaling totalCost to sum of categories to be 100% accurate
        breakdown.totalCost = calculatedTotal;
      }
      
      // Ensure dailyExpenses is array, populated, and consistent
      if (!Array.isArray(breakdown.dailyExpenses) || breakdown.dailyExpenses.length === 0) {
        const days = Number(duration) || 1;
        breakdown.dailyExpenses = Array.from({ length: days }, (_, i) => ({
          day: i + 1,
          cost: Math.floor(breakdown.totalCost / days)
        }));
      } else {
        breakdown.dailyExpenses = breakdown.dailyExpenses.map((de, i) => ({
          day: Number(de.day) || (i + 1),
          cost: Math.round(Number(String(de.cost || 0).replace(/\D/g, ''))) || 0
        }));
      }
    }

    const successResponse = {
      success: true,
      isFallback: false,
      ...parsedData,
    };

    // Store in backend cache
    if (tripCache.size >= MAX_CACHE_SIZE) {
      const firstKey = tripCache.keys().next().value;
      tripCache.delete(firstKey);
    }
    tripCache.set(cacheKey, successResponse);

    // -----------------------------
    // SUCCESS
    // -----------------------------
    return res.status(200).json(successResponse);

  } catch (error) {

    console.error('========== AI GENERATION ERROR ==========');
    console.error(error);

    // -----------------------------
    // RATE LIMIT / QUOTA EXCEEDED
    // -----------------------------
    if (error.status === 429) {
      console.log('AI quota exceeded. Returning graceful fallback itinerary.');
      const fallbackTrip = generateFallbackTrip(req.body);

      // Store in backend cache
      if (tripCache.size >= MAX_CACHE_SIZE) {
        const firstKey = tripCache.keys().next().value;
        tripCache.delete(firstKey);
      }
      tripCache.set(cacheKey, fallbackTrip);

      return res.status(200).json(fallbackTrip);
    }

    // -----------------------------
    // MODEL NOT FOUND
    // -----------------------------
    if (error.status === 404) {
      console.log('Gemini model unavailable. Returning graceful fallback itinerary.');
      const fallbackTrip = generateFallbackTrip(req.body);

      // Store in backend cache
      if (tripCache.size >= MAX_CACHE_SIZE) {
        const firstKey = tripCache.keys().next().value;
        tripCache.delete(firstKey);
      }
      tripCache.set(cacheKey, fallbackTrip);

      return res.status(200).json(fallbackTrip);
    }

    // -----------------------------
    // UNKNOWN ERROR
    // -----------------------------
    return res.status(500).json({
      success: false,
      message: 'Failed to generate itinerary.',
      error: error.message,
    });
  }
};

// -----------------------------
// SAVE TRIP
// -----------------------------
const saveTrip = async (req, res) => {
  try {
    const {
      destination,
      duration,
      budget,
      itineraryData,
    } = req.body;

    if (
      !destination ||
      !duration ||
      !budget ||
      !itineraryData
    ) {
      return res.status(400).json({
        message: 'Missing required fields for saving trip',
      });
    }

    const trip = new Trip({
      user: req.user.id,
      destination,
      duration,
      budget,
      itineraryData,
    });

    const savedTrip = await trip.save();

    res.status(201).json(savedTrip);

  } catch (error) {

    console.error('Error saving trip:', error);

    res.status(500).json({
      message: 'Failed to save trip to history',
    });
  }
};

// -----------------------------
// GET TRAVEL HISTORY
// -----------------------------
const getTravelHistory = async (req, res) => {
  try {

    const trips = await Trip.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(trips);

  } catch (error) {

    console.error('Error fetching travel history:', error);

    res.status(500).json({
      message: 'Failed to fetch travel history',
    });
  }
};

module.exports = {
  generateItinerary,
  saveTrip,
  getTravelHistory,
};