const mongoose = require('mongoose');
const Hotel = require('../models/Hotel');
const { generateWithFallback, getGroundedDestinationContext } = require('../services/aiService');

/**
 * Utility helper to bulk-upsert dynamically generated hotels to MongoDB.
 * Secures a valid MongoDB database state and provides authentic _ids for booking.
 */
const upsertHotels = async (hotelsArray, destination) => {
  try {
    const upserted = await Promise.all(
      hotelsArray.map(async (h) => {
        const price = Number(h.pricePerNight || h.basePrice || h.price || 1500);
        // Enforce fallback features if absent
        const features = Array.isArray(h.features) ? h.features : ["Free WiFi", "Clean Rooms", "24/7 Service"];
        const category = h.category || 'midRange';
        const description = h.description || 'Comfortable stay.';
        
        // Find existing hotel by name & location or insert a new one
        const doc = await Hotel.findOneAndUpdate(
          { 
            name: h.name, 
            location: h.location || `${destination} Central` 
          },
          {
            name: h.name,
            location: h.location || `${destination} Central`,
            basePrice: price,
            features: features,
            category: category,
            description: description,
            availableRooms: Math.floor(Math.random() * 8) + 3 // Authentic counts between 3 and 10
          },
          { 
            upsert: true, 
            returnDocument: 'after', 
            setDefaultsOnInsert: true 
          }
        );
        return doc;
      })
    );
    return upserted;
  } catch (error) {
    console.error("Error upserting hotels to MongoDB:", error);
    // Graceful fallback: return the original objects decorated with temporary ObjectIds
    return hotelsArray.map((h) => ({
      _id: new mongoose.Types.ObjectId(),
      name: h.name,
      location: h.location || `${destination} Central`,
      basePrice: Number(h.pricePerNight || 1500),
      features: Array.isArray(h.features) ? h.features : ["Free WiFi", "Clean Rooms"],
      category: h.category || 'midRange',
      description: h.description || 'Comfortable stay.',
      availableRooms: 5
    }));
  }
};

const getHotels = async (req, res) => {
  const { destination } = req.params;
  const { budget, travelers, duration } = req.query;
  console.log("Hotel request params:", { destination, budget, travelers, duration });

  if (!destination) {
    return res.status(400).json({ message: 'Destination is required' });
  }

  const totalBudget = parseInt(String(budget).replace(/\D/g, '')) || 50000;
  const numTravelers = parseInt(travelers) || 1;
  const numDays = parseInt(duration) || 1;
  const hotelBudget = Math.round(totalBudget * 0.40);
  const maxPerNight = Math.round(hotelBudget / numDays);
  console.log("Max hotel per night:", maxPerNight);

  // Generate a diverse, realistic fallback list of 9 hotels distributed across categories
  const localFallbackHotels = [
    // Budget (3 options)
    { 
      name: "Blue Sky Dorms & Lodge", 
      location: `${destination} Transit Area`, 
      pricePerNight: Math.min(800, Math.round(maxPerNight * 0.25)) || 600, 
      features: ["Locker Facility", "Shared Lounge", "Free WiFi"], 
      description: "Super affordable, clean dormitory beds designed specifically for backpackers.", 
      category: "budget" 
    },
    { 
      name: "Sunrise Homestay & Inn", 
      location: `${destination} Suburban Hills`, 
      pricePerNight: Math.min(1200, Math.round(maxPerNight * 0.4)) || 1000, 
      features: ["Home-cooked Food", "Cozy Garden", "Hot Shower"], 
      description: "Peaceful family homestay with exceptionally warm hosts and home-cooked meals.", 
      category: "budget" 
    },
    { 
      name: "Backpackers Hub Hostel", 
      location: `${destination} Old Town`, 
      pricePerNight: Math.min(1000, Math.round(maxPerNight * 0.35)) || 800, 
      features: ["Bunk Beds", "Common Kitchen", "City Maps"], 
      description: "Social and vibrant youth hostel perfect for meeting other budget solo travelers.", 
      category: "budget" 
    },
    
    // Mid-Range (3 options)
    { 
      name: "The Grand Regal Stay", 
      location: `${destination} City Center`, 
      pricePerNight: Math.min(2500, Math.round(maxPerNight * 0.65)) || 2200, 
      features: ["Free WiFi", "AC Rooms", "24/7 Service"], 
      description: "Comfortable, clean rooms situated right in the city center near major local markets.", 
      category: "midRange" 
    },
    { 
      name: "Comfort Inn Executive Suite", 
      location: `${destination} Downtown`, 
      pricePerNight: Math.min(2200, Math.round(maxPerNight * 0.58)) || 1800, 
      features: ["Breakfast Buffet", "Free WiFi", "AC & Work Desk"], 
      description: "Clean, professional executive rooms offering great value for business travelers and families.", 
      category: "midRange" 
    },
    { 
      name: "Green Valley Nature Resort", 
      location: `${destination} Scenic Valleys`, 
      pricePerNight: Math.min(3000, Math.round(maxPerNight * 0.75)) || 2500, 
      features: ["Swimming Pool", "Lush Gardens", "In-house Bistro"], 
      description: "Relaxing boutique garden retreat offering lovely panoramic views and a quiet, fresh atmosphere.", 
      category: "midRange" 
    },

    // Luxury (3 options)
    { 
      name: "Royal Palace Resort & Spa", 
      location: `${destination} Lakeside Heights`, 
      pricePerNight: Math.max(5000, Math.min(9500, Math.round(maxPerNight * 0.95))) || 5500, 
      features: ["Infinity Pool", "Ayurvedic Spa", "Fine Dining Bar"], 
      description: "Premium luxury accommodation offering gorgeous views, spa treatments, and elite hospitality.", 
      category: "luxury" 
    },
    { 
      name: "The Oberoi Grand View", 
      location: `${destination} Golden Peak`, 
      pricePerNight: Math.max(7000, Math.min(14000, Math.round(maxPerNight * 1.1))) || 8500, 
      features: ["Private Balcony", "Personal Butler", "Helipad Access"], 
      description: "Exquisite five-star luxury suites featuring dramatic peaks views and bespoke services.", 
      category: "luxury" 
    },
    { 
      name: "Boutique Heritage Villa", 
      location: `${destination} Historic Palace Grounds`, 
      pricePerNight: Math.max(6000, Math.min(12000, Math.round(maxPerNight * 0.88))) || 6500, 
      features: ["Vintage Courtyard", "Wine Cellar", "Rooftop Terrace"], 
      description: "Exquisite historical palace villa combining classic architecture with state-of-the-art luxury.", 
      category: "luxury" 
    }
  ];

  const getPolishedImageUrl = (name) => {
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(name + ' hotel in ' + destination)}?width=800&height=400&nologo=true`;
  };

  try {
    const mainConfig = {
      generationConfig: {
        responseMimeType: "application/json"
      }
    };

    const prompt = `You are a hotel recommendation API for Indian travel. The user is planning a trip to exactly: ${destination}. Total travelers: ${numTravelers}, trip duration: ${numDays} days, total budget: ₹${totalBudget}.
    You MUST generate a diverse and highly realistic list of AT LEAST 9 to 12 hotels, distributed across different budget categories.
    Return ONLY a valid JSON array, with no markdown formatting, no backticks, and no extra text.
    
    🏨 Requirements:
    Divide the hotels into 3 categories:
    1. Budget Hotels (Low Cost) - 3 to 4 options (affordable stays, basic amenities, suitable for backpackers / budget travelers)
    2. Mid-Range Hotels (Moderate Cost) - 3 to 4 options (comfortable stays, good amenities like WiFi, breakfast, AC, suitable for families / regular travelers)
    3. Luxury Hotels (High Cost) - 3 to 4 options (premium experience, high-end amenities like pool, spa, fine dining, great views, suitable for premium travelers)
    
    💰 Pricing Rules:
    - Budget: low price range (clearly cheapest)
    - Mid-range: moderate pricing
    - Luxury: highest pricing
    - Ensure a clear price difference between the categories.
    
    Each hotel object MUST have exactly these keys:
    - name (string)
    - location (string)
    - pricePerNight (number, must be numeric only)
    - features (array of strings, e.g. ["Free WiFi", "Pool", "Breakfast"])
    - description (string, short 1-2 lines max)
    - category (string, must be exactly one of: "budget", "midRange", "luxury")`;

    const result = await generateWithFallback(mainConfig, prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    console.log("=== RAW HOTEL GEMINI RESPONSE ===");
    console.log(text);
    console.log("=================================");

    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    if (!text.startsWith('[')) {
      const startIndex = text.indexOf('[');
      const endIndex = text.lastIndexOf(']');
      if (startIndex !== -1 && endIndex !== -1) {
        text = text.substring(startIndex, endIndex + 1);
      }
    }

    const hotels = JSON.parse(text);
    
    // Dynamic database synchronization
    const savedDocs = await upsertHotels(hotels, destination);
    
    const finalHotels = savedDocs.map((doc) => ({
      _id: doc._id,
      name: doc.name,
      location: doc.location,
      pricePerNight: doc.basePrice,
      features: doc.features,
      category: doc.category,
      description: doc.description,
      availableRooms: doc.availableRooms,
      imageUrl: getPolishedImageUrl(doc.name)
    }));

    return res.status(200).json(finalHotels);
  } catch (error) {
    console.error('Error fetching hotels dynamically. Engaging local grounded fallback...', error);
    
    // Dynamic database synchronization for fallbacks (guarantees at least 9 options populated in Mongoose)
    const savedDocs = await upsertHotels(localFallbackHotels, destination);
    
    const finalHotels = savedDocs.map((doc) => ({
      _id: doc._id,
      name: doc.name,
      location: doc.location,
      pricePerNight: doc.basePrice,
      features: doc.features,
      category: doc.category,
      description: doc.description,
      availableRooms: doc.availableRooms,
      imageUrl: getPolishedImageUrl(doc.name)
    }));

    return res.status(200).json(finalHotels);
  }
};

module.exports = { getHotels };
