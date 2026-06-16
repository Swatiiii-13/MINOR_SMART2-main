const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const DESTINATION_DATABASE = {
  hubli: {
    name: "Hubli",
    attractions: [
      { name: "Unkal Lake", desc: "A serene lake with a stunning sunset viewpoint and a statue of Swami Vivekananda in the center.", cost: 50 },
      { name: "Siddharoodha Math", desc: "A highly revered spiritual center and monastery, offering a peaceful atmosphere and a massive temple hall.", cost: 0 },
      { name: "Nrupatunga Betta", desc: "A scenic hillock offering panoramic views of Hubli-Dharwad, ideal for a morning walk and nature photography.", cost: 20 },
      { name: "Urban Oasis Mall", desc: "The bustling lifestyle hub of Hubli, featuring premium retail outlets, a modern food court, and local cafes.", cost: 200 },
      { name: "Chandramouleshwara Temple", desc: "A 900-year-old Chalukyan-era monument carved in black stone, showcasing incredible ancient architecture.", cost: 0 },
      { name: "Glass House Garden", desc: "A beautiful botanical conservatory styled after London's Crystal Palace, hosting vibrant flower shows.", cost: 10 },
      { name: "Tolankere Lake", desc: "A newly renovated eco-park with boating, children play areas, and paved sunset walking paths.", cost: 30 },
      { name: "Navagraha Teertha", desc: "A prominent pilgrimage site featuring a majestic 109-foot tall monolithic statue of Shri Parshvanath.", cost: 0 },
      { name: "Agadi Thota", desc: "An immersive rural eco-farm offering authentic North Karnataka village experiences, boat rides, and local foods.", cost: 600 },
      { name: "Banashankari Temple Amargol", desc: "A heritage temple constructed from solid stone blocks displaying Badami Chalukyan design.", cost: 0 },
      { name: "Dharwad Pedha Sweets Trail", desc: "A culinary exploration of the iconic milk-sweets outlets operating since the early 1900s.", cost: 150 },
      { name: "Country Club Retreat", desc: "A relaxing green getaway on the outskirts of Hubli offering swimming, sports, and quiet family picnics.", cost: 400 }
    ],
    hotels: [
      { name: "Ocean Pearl", location: "Hubli", pricePerNight: 4000, features: ["Luxury Stay", "Multi-cuisine Restaurant", "City Views"] },
      { name: "Hotel Naveen", location: "Unkal Lake", pricePerNight: 5500, features: ["Lakeside Views", "Premium Pool", "Fine Dining"] },
      { name: "Denissons", location: "Hubli Bypass", pricePerNight: 6000, features: ["5-Star Comfort", "Lounge Bar", "Spacious Suites"] },
      { name: "Ozone Resort", location: "Hubli outskirts", pricePerNight: 3500, features: ["Lush Greenery", "Activity Zones", "Family Friendly"] }
    ],
    restaurants: ["Basaveshwar Khanavali", "Gurudatta Bhavan", "Ozone Restaurant", "Naveen Lakeside Diner"],
    vibe: "Industrial hub with ancient Chalukyan roots and North Karnataka cuisine",
    localInsight: "Basaveshwar Khanavali serves the most authentic North Karnataka Jowar Roti meals with spicy stuffed brinjal."
  },
  goa: {
    name: "Goa",
    attractions: [
      { name: "Fontainhas", desc: "The colorful Latin Quarter of Panaji, showcasing bright Portuguese colonial-era homes, quiet art galleries, and bakeries.", cost: 0 },
      { name: "Baga Beach", desc: "The high-energy epicenter of North Goa beach culture, lined with buzzing shacks, watersports, and live music.", cost: 500 },
      { name: "Chapora Fort", desc: "The iconic clifftop fortress overlooking the Vagator coastline, offering breathtaking panoramic sunset vistas.", cost: 0 },
      { name: "Dudhsagar Falls", desc: "A magnificent four-tiered waterfall cascading down the Western Ghats, accessed by a thrilling forest jeep safari.", cost: 1200 },
      { name: "Anjuna Flea Market", desc: "A bohemian seaside bazaar full of colorful handmade clothes, jewelry, spices, and live acoustic music.", cost: 100 },
      { name: "Tito's Lane Baga", desc: "The legendary nightlife hub of North Goa, packed with high-end clubs, multi-genre DJs, and cocktail bars.", cost: 1500 },
      { name: "Miramar Beach Panaji", desc: "A wide, clean urban beach where the Mandovi river merges with the sea, famous for quiet evening walks.", cost: 0 },
      { name: "Mangueshi Temple Ponda", desc: "A unique 450-year-old Goan temple blending Hindu, Christian, and Muslim styles, famous for its elegant lamp tower.", cost: 0 },
      { name: "Basilica of Bom Jesus", desc: "A massive, unplastered red stone UNESCO heritage church housing the sacred relics of St. Francis Xavier.", cost: 0 },
      { name: "Divar Island Ferry Route", desc: "A quiet, green island accessed only by a river ferry, preserving old Portuguese villas and empty paddy roads.", cost: 50 },
      { name: "Vagator Cliffs", desc: "Dramatic volcanic rocks overlooking the Arabian Sea, hosting premium sunset lounges like Purple Martini.", cost: 800 },
      { name: "Palolem Beach", desc: "A stunning crescent-shaped beach in South Goa, famed for quiet wooden shacks, dolphins, and kayak trips.", cost: 400 }
    ],
    hotels: [
      { name: "Purple Martini Stay", location: "Anjuna Cliff", pricePerNight: 7000, features: ["Oceanfront views", "Infinity Pool", "Sunset Deck"] },
      { name: "Alila Diwa Goa", location: "Majorda", pricePerNight: 9500, features: ["Infinite Paddy views", "Spas & Wellness", "Bespoke Dining"] },
      { name: "Cidade de Goa", location: "Dona Paula", pricePerNight: 8000, features: ["Beachfront Access", "Portuguese Design", "Heritage walks"] }
    ],
    restaurants: ["Café Bodega Panaji", "Purple Martini Anjuna", "Fisherman's Wharf", "Gunpowder Goa", "Curlies Anjuna", "Thalassa Vagator"],
    vibe: "Susegad coastal bliss, ancient Latin architecture, and energetic shacks",
    localInsight: "Go beyond standard beaches; visit Fontainhas in Panaji early morning to witness quiet, colorful Portuguese streets without the crowds."
  },
  manali: {
    name: "Manali",
    attractions: [
      { name: "Solang Valley", desc: "A stunning snow adventure arena offering paragliding, skiing, and thrilling cable car rides surrounded by peak views.", cost: 1500 },
      { name: "Hidimba Temple", desc: "A quiet, ancient wooden pagoda temple nestled deep inside dense, towering cedar forests.", cost: 0 },
      { name: "Old Manali Cafés", desc: "A relaxed, bohemian neighborhood packed with cozy wooden cafes serving international cuisine, river views, and live indie music.", cost: 500 },
      { name: "Atal Tunnel & Sissu", desc: "A thrilling ride through the world's longest highway tunnel into the snowy, stark landscapes of Lahaul Valley.", cost: 2000 },
      { name: "Jogini Waterfalls", desc: "A scenic mountain trek passing through pine trees and orchards, leading to tall, cooling white cascades.", cost: 50 },
      { name: "Vashisht Hot Springs", desc: "Natural therapeutic sulfur water baths constructed inside traditional timber temples.", cost: 0 },
      { name: "Manu Temple", desc: "An elegant, tiered wooden shrine situated on Old Manali hilltops dedicated to the sage Manu.", cost: 0 },
      { name: "Rohtang Pass", desc: "A high-altitude glacial paradise offering pristine vistas of snow mountains, slides, and blue skies.", cost: 3000 },
      { name: "Mall Road Shopping", desc: "The central marketplace of Manali perfect for buying pure wool shawls, wooden toys, and spicy street foods.", cost: 200 },
      { name: "Van Vihar Pine Walk", desc: "A towering pine forest park alongside the roaring Beas river, featuring a small paddle boating lake.", cost: 20 },
      { name: "Naggar Castle Heritage", desc: "A magnificent medieval stone-and-timber castle offering panoramic valleys and traditional Kullvi art.", cost: 100 },
      { name: "Great Himalayan National Park", desc: "A lush UNESCO forest sanctuary perfect for birdwatching, alpine treks, and eco-tours.", cost: 500 }
    ],
    hotels: [
      { name: "The Solang Resort", location: "Solang Valley", pricePerNight: 6500, features: ["Riverside Walks", "Glacier Views", "Adventure Desk"] },
      { name: "Span Resort & Spa", location: "Kullu-Manali highway", pricePerNight: 12000, features: ["Beas Riverfront", "Premium Spa", "Heritage Cottages"] },
      { name: "Manu Allaya Resort", location: "Manali Hilltop", pricePerNight: 5500, features: ["Snow peaks views", "Indoor Heated Pool", "Multi-cuisine buffet"] }
    ],
    restaurants: ["Johnson's Café", "Drifter's Café Old Manali", "Café 1947", "Lazy Dog Cafe"],
    vibe: "Bohemian snow-capped alpine sanctuary and adventure-laden pine valleys",
    localInsight: "Spend your evenings in Old Manali instead of the crowded Mall Road; Drifter's Café has amazing local apple ciders and live acoustic sessions."
  },
  kerala: {
    name: "Kerala",
    attractions: [
      { name: "Alleppey Backwaters", desc: "An unforgettable cruise on a traditional thatched houseboat through quiet coconut-fringed lagoons and canals.", cost: 2500 },
      { name: "Fort Kochi", desc: "A historical coastal village featuring ancient giant Chinese fishing nets, Dutch palaces, and local spice markets.", cost: 100 },
      { name: "Munnar Tea Gardens", desc: "Lush, rolling green tea estates carpeted in mist, offering dramatic panoramic viewpoint treks.", cost: 200 },
      { name: "Varkala Cliffs", desc: "Unique geological red cliffs bordering the Arabian Sea, featuring hippie cafes and spectacular panoramic sunset viewpoints.", cost: 300 },
      { name: "Periyar Tiger Reserve", desc: "A beautiful mountain lake sanctuary offering silent raft safaris to spot wild elephants and tigers.", cost: 450 },
      { name: "Athirappilly Waterfalls", desc: "A majestic, wide jungle cascade famously known as India's Niagara Falls, surrounded by thick rainforests.", cost: 50 },
      { name: "Kovalam Beach", desc: "A world-famous crescent coastline marked by a high red-and-white lighthouse and beachside seafood diners.", cost: 0 },
      { name: "Edakkal Caves Wayanad", desc: "Magnificent rock shelter chambers featuring historic Neolithic carving scriptures and hill climbs.", cost: 100 },
      { name: "Kumarakom Sanctuary", desc: "A vast wetland bird park near Vembanad Lake perfect for identifying migratory herons and egrets.", cost: 50 },
      { name: "Vagamon Meadows", desc: "Peaceful rolling velvet green hills, pine trees, and fresh mountain winds perfect for couples.", cost: 20 },
      { name: "Bekal Fort Kasaragod", desc: "A majestic keyhole-shaped stone fortress bordering the sea, famed for sunset strolls.", cost: 50 },
      { name: "Poovar Golden Beach", desc: "A spectacular estuary island where backwater canals, rivers, and sea waves converge onto golden sands.", cost: 800 }
    ],
    hotels: [
      { name: "Kumarakom Lake Resort", location: "Kumarakom", pricePerNight: 14000, features: ["Heritage Lake Villas", "Meandering Pool", "Ayurvedic Spa"] },
      { name: "Brunton Boatyard", location: "Fort Kochi", pricePerNight: 9000, features: ["Harbor Views", "Colonial Heritage", "Historical Tours"] },
      { name: "Spice Village", location: "Thekkady", pricePerNight: 8000, features: ["Eco-friendly stay", "Tribal architecture", "Spice plantation tours"] }
    ],
    restaurants: ["Kashi Art Café Fort Kochi", "Dhe Puttu", "Varkala Cliff Cafe", "Rice Boat Kumarakom"],
    vibe: "Tropical, spiritual backwater bliss and spice-scented mountain sanctuaries",
    localInsight: "Take the local government passenger ferry in Alleppey instead of a private houseboat for a fraction of the cost, giving you a highly authentic peek into local daily island life."
  },
  agra: {
    name: "Agra",
    attractions: [
      { name: "Taj Mahal", desc: "The magnificent ivory-white marble mausoleum on the south bank of the Yamuna river, a global symbol of eternal love.", cost: 50 },
      { name: "Mehtab Bagh", desc: "A beautiful charbagh garden complex located across the Yamuna river, offering flawless, crowd-free sunset views of the Taj Mahal.", cost: 30 },
      { name: "Agra Fort", desc: "A massive 16th-century red sandstone walled fortress serving as the grand royal city of the Mughal emperors.", cost: 50 },
      { name: "Sadar Bazaar Road Walk", desc: "A lively cultural shopping street famous for high-quality leather goods, marble handicrafts, and delicious street food stalls.", cost: 0 },
      { name: "Mughlai Dinner Fatehabad Road", desc: "A culinary journey exploring rich, creamy Mughlai gravies, tandoori items, and historic dessert spots.", cost: 300 },
      { name: "Itmad-ud-Daulah (Baby Taj)", desc: "A gorgeous, highly intricate marble tomb often regarded as the draft design or inspiration for the Taj Mahal.", cost: 30 },
      { name: "Akbar's Tomb Sikandra", desc: "The grand red sandstone and marble tomb of Emperor Akbar, nestled inside deep peaceful gardens with roaming deer.", cost: 30 },
      { name: "Buland Darwaza", desc: "The colossal 54-meter tall stone gateway of victory leading into the historical city complex of Fatehpur Sikri.", cost: 50 },
      { name: "Panch Mahal Fatehpur Sikri", desc: "An extraordinary five-story columnar open sandstone palace built by Akbar for recreation and evening breeze.", cost: 30 },
      { name: "Jama Masjid Agra", desc: "A massive, striking 17th-century red sandstone mosque situated directly opposite the Agra Fort.", cost: 0 },
      { name: "Keetham Lake Park", desc: "A serene woodland lake and bird sanctuary on the Delhi-Agra highway, hosting the famous Bear Rescue Facility.", cost: 50 },
      { name: "Kinari Bazaar", desc: "The oldest narrow wholesale marketplace of Agra, bustling with jewelry shops, bridal wear, and spice aroma.", cost: 0 }
    ],
    hotels: [
      { name: "The Oberoi Amarvilas", location: "Agra Near Taj East Gate", pricePerNight: 28000, features: ["Flawless Taj Mahal Views", "Mughal Architecture", "Royal Luxury Spa"] },
      { name: "Trident Agra", location: "Agra Fatehabad Road", pricePerNight: 5000, features: ["Lush Courtyard Gardens", "Outdoor Pool", "Spacious Family Suites"] },
      { name: "Taj Hotel & Convention Centre", location: "Agra Near Taj", pricePerNight: 7500, features: ["Rooftop Infinity Pool", "Taj Mahal Views", "Modern Business Lounge"] }
    ],
    restaurants: ["Pinch of Spice Fatehabad Road", "Peshawri ITC Mughal", "Mama Chicken Mama Franky House", "Dasaprakash Sadar Bazaar"],
    vibe: "Grand Mughal imperial heritage and sensory-rich chaotic markets",
    localInsight: "Visit Mehtab Bagh across the Yamuna river at sunset to see the Taj Mahal glowing red without paying the full monument entry fee or fighting the huge morning crowds."
  }
};

/**
 * Centrally manages all Gemini API requests with fallback logic
 */
const generateWithFallback = async (modelConfig, promptString) => {
  try {
    console.log(`AI Central Service: Attempting gemini-1.5-flash...`);
    const model = genAI.getGenerativeModel({
      ...modelConfig,
      model: 'gemini-1.5-flash'
    });
    return await model.generateContent(promptString);
  } catch (error) {
    if (error.status === 404 || error.message.includes('404') || error.message.includes('not found')) {
      console.log('AI Central Service: gemini-1.5-flash not found. Retrying with gemini-2.0-flash...');
      const fallbackModel = genAI.getGenerativeModel({
        ...modelConfig,
        model: 'gemini-2.0-flash'
      });
      return await fallbackModel.generateContent(promptString);
    }
    throw error;
  }
};

/**
 * Retrieve a rich, realistic local destination block (Hubli, Goa, etc.)
 */
const getGroundedDestinationContext = (destinationName) => {
  const norm = String(destinationName).toLowerCase().trim();
  for (const key of Object.keys(DESTINATION_DATABASE)) {
    if (norm.includes(key) || key.includes(norm)) {
      return DESTINATION_DATABASE[key];
    }
  }
  return null;
};

module.exports = {
  genAI,
  DESTINATION_DATABASE,
  generateWithFallback,
  getGroundedDestinationContext
};
