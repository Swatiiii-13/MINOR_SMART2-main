const { generateWithFallback, getGroundedDestinationContext } = require('../services/aiService');

const getLocalHybridResponse = (message, context) => {
  const normMessage = message.toLowerCase();
  const normContext = String(context || '').toLowerCase();
  
  // Find matching destination context
  const groundedCtx = getGroundedDestinationContext(normMessage + ' ' + normContext);
  if (!groundedCtx) return null; // let Gemini or fallback handle it
  
  const destName = groundedCtx.name;
  const atts = groundedCtx.attractions;
  const rests = groundedCtx.restaurants;
  const vibe = groundedCtx.vibe;
  const insight = groundedCtx.localInsight;

  // 1. Sunset / Views Interception
  if (normMessage.includes('sunset') || normMessage.includes('view') || normMessage.includes('dusk')) {
    let spots = [];
    if (destName === 'Goa') {
      spots = [atts[2], atts[10], atts[11]]; // Chapora Fort, Vagator Cliffs, Palolem Beach
    } else if (destName === 'Hubli') {
      spots = [atts[0], atts[2], atts[6]]; // Unkal Lake, Nrupatunga Betta, Tolankere Lake
    } else if (destName === 'Manali') {
      spots = [atts[7], atts[4], atts[6]]; // Rohtang Pass, Jogini Waterfalls, Manu Temple
    } else if (destName === 'Kerala') {
      spots = [atts[3], atts[6], atts[10]]; // Varkala Cliffs, Kovalam Beach, Bekal Fort
    } else if (destName === 'Agra') {
      spots = [atts[1], atts[0], atts[5]]; // Mehtab Bagh, Taj Mahal, Itmad-ud-Daulah
    } else {
      spots = atts.slice(0, 3);
    }

    return `🌅 *Top Insider Sunset & Scenic Spots in ${destName}:*

1. **${spots[0].name}**: ${spots[0].desc} (Highly recommended)
2. **${spots[1].name}**: ${spots[1].desc}
3. **${spots[2].name}**: ${spots[2].desc}

✨ *Insider Tip:* ${insight} Feel free to ask me about local food joints near these viewpoints!`;
  }

  // 2. Food / Cafes / Restaurants Interception
  if (normMessage.includes('food') || normMessage.includes('eat') || normMessage.includes('cafe') || normMessage.includes('restaurant') || normMessage.includes('dine') || normMessage.includes('breakfast') || normMessage.includes('dinner') || normMessage.includes('lunch') || normMessage.includes('specialties')) {
    return `🍲 *Authentic Dining & Cafés in ${destName}:*

Here are the absolute local favorites you must try:
- **${rests[0] || 'Local Diner'}**: Famous for authentic culinary delights.
- **${rests[1] || 'Heritage Café'}**: A highly popular spot with a premium, relaxed vibe.
- **${rests[2] || 'Skyline Bistro'}**: Excellent ambience and great local views.

✨ *Insider culinary advice:* ${insight} Let me know if you need the coordinates for specific safety tips!`;
  }

  // 3. Hidden Gems / Offbeat Interception
  if (normMessage.includes('gem') || normMessage.includes('hidden') || normMessage.includes('secret') || normMessage.includes('unexplored') || normMessage.includes('offbeat')) {
    let gems = [];
    if (destName === 'Goa') {
      gems = [atts[9], atts[4]]; // Divar Island, Anjuna Flea Market
    } else if (destName === 'Hubli') {
      gems = [atts[4], atts[8]]; // Chandramouleshwara Temple, Agadi Thota
    } else if (destName === 'Manali') {
      gems = [atts[4], atts[10]]; // Jogini Waterfalls, Naggar Castle
    } else if (destName === 'Kerala') {
      gems = [atts[5], atts[11]]; // Athirappilly Waterfalls, Poovar Golden Beach
    } else if (destName === 'Agra') {
      gems = [atts[5], atts[6], atts[7]]; // Baby Taj, Akbar's Tomb, Buland Darwaza
    } else {
      gems = atts.slice(3, 5);
    }

    return `✨ *Unexplored Hidden Gems & Offbeat Escapes in ${destName}:*

1. **${gems[0].name}**: ${gems[0].desc} (A gorgeous quiet getaway)
2. **${gems[1].name}**: ${gems[1].desc} (Highly immersive)

💡 *Pro Traveler Insight:* These spots are relatively untouched by mainstream tourist groups. Arrive early to capture pristine panoramic shots!`;
  }

  // 4. Facts / Vibe Interception
  if (normMessage.includes('fact') || normMessage.includes('vibe') || normMessage.includes('about') || normMessage.includes('history') || normMessage.includes('tell me about')) {
    return `ℹ️ *Local Insights & Vibe of ${destName}:*

The core traveler vibe of ${destName} is **"${vibe}"**. 

Here's what makes this place special:
- **Major attractions planned:** ${atts.slice(0, 3).map(a => a.name).join(', ')}.
- **Local dining style:** Rich, authentic, and sensory-filled.
- **Pro Tip:** ${insight}

Ask me to recommend a quieter alternative if you're worried about crowd levels!`;
  }

  // 5. Safety / Budget / Scams Interception
  if (normMessage.includes('safe') || normMessage.includes('safety') || normMessage.includes('budget') || normMessage.includes('scam') || normMessage.includes('money') || normMessage.includes('cost')) {
    return `🛡️ *Safety, Budget & Pro Transit Tips for ${destName}:*

- **Budgeting:** Dining locally and using public transits (like local passenger ferries or auto-rickshaws) can cut costs by 40% compared to private cabs.
- **Safety advisory:** Stay hydrated, keep emergency helpline numbers stored, and avoid isolated pathways late at night.
- **Scam prevention:** Always confirm travel fares with auto-drivers *before* stepping inside. For major tourist entries, purchase official tickets online to avoid middle-agent markups.

Hope this helps you travel with peace of mind!`;
  }

  return null; // fallback to advanced chat
};

const handleChat = async (req, res) => {
  const { message, context } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  // -----------------------------
  // STEP 1: HYBRID COPILOT INTERCEPTION (OFFLINE GROUNDED ANSWERS)
  // -----------------------------
  console.log("Hybrid Copilot: Auditing query offline...");
  const hybridResponse = getLocalHybridResponse(message, context);
  if (hybridResponse) {
    console.log("Hybrid Copilot: Offline Match found. Bypassing Gemini API to save quota!");
    return res.status(200).json({ text: hybridResponse });
  }

  // -----------------------------
  // STEP 2: ADVANCED GEMINI CONVERSATION
  // -----------------------------
  try {
    const prompt = `
You are a highly charming, premium Live AI Travel Agent for an elite trip planner.
Context about the user's current planned itinerary: ${context || 'General travel query'}

YOUR CORE MISSION:
1. Deliver a highly conversational, hyper-personalized, and intelligent response to the user's message.
2. AUDIT THE ITINERARY (CRITICAL): Examine the "Context" block to see which attractions are already included.
3. PROVIDE INTENTIONAL ALTERNATIVES:
   - If the itinerary already contains a highly crowded spot (like Baga Beach, Solang Valley, Fort Kochi, or Unkal Lake), suggest quieter, high-fidelity alternatives or nearby secret local cafés/viewpoints that are NOT already in the itinerary.
   - For example, if Baga Beach is planned, suggest visiting the volcanic rock cliffs at Vagator or Palolem beach in the south.
   - Suggest excellent food joints that complement their current itinerary.
4. ACT LIKE A LOCAL INSIDER: Use authentic geographic facts, exact prices (in ₹), and seasonal advisories. Never use generic AI fluff like "discover the magic" or "vibrant heritage".
5. DYNAMIC RESPONSES: Avoid repeating identical openings or structural formats. Keep it fresh, organic, and genuinely interactive.

User message: ${message}

Provide a concise, engaging, and friendly response. If mentioning any prices, budgets, or costs, strictly use Indian Rupees (INR) and the ₹ symbol with realistic Indian market estimates.
`;

    const mainConfig = {};
    const result = await generateWithFallback(mainConfig, prompt);

    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text });
  } catch (error) {
    console.error('Chat API Error. Falling back to local destination context...', error);
    
    // Offline local intelligent fallback
    const normalizedMessage = (message + ' ' + (context || '')).toLowerCase();
    const groundedCtx = getGroundedDestinationContext(normalizedMessage);
    
    if (groundedCtx) {
      const atts = groundedCtx.attractions;
      const rests = groundedCtx.restaurants;
      
      // Audit context for already used attractions
      const normContext = String(context || '').toLowerCase();
      let selectedAtt = atts[2] || atts[0];
      let auditNote = "";
      
      // Look for first attraction that is NOT mentioned in context
      for (const att of atts) {
        if (!normContext.includes(att.name.toLowerCase())) {
          selectedAtt = att;
          break;
        }
      }
      
      // If we did find a matching already planned spot, add context awareness
      for (const att of atts) {
        if (normContext.includes(att.name.toLowerCase())) {
          auditNote = `I see you already have ${att.name} planned in your itinerary! Since you are exploring that area, `;
          break;
        }
      }
      
      const fallbackText = `I am currently operating on backup local intelligence due to high traffic, but I have got you fully covered for ${groundedCtx.name}! 

${auditNote ? `✨ Itinerary Insider: ${auditNote}I highly recommend also checking out ${selectedAtt.name} (${selectedAtt.desc}).` : `🌅 Local Spot Suggestion: I highly recommend visiting ${selectedAtt.name} (${selectedAtt.desc}).`}

🍲 Hidden Dining: Don't miss out on grabbing a bite at ${rests.slice(0, 2).join(' or ')}. ${groundedCtx.localInsight}
✨ Local Vibe: The neighborhood vibe here is ${groundedCtx.vibe}. 

Keep browsing your unique itinerary days and route maps seamlessly!`;
      
      return res.status(200).json({ text: fallbackText });
    }
    
    // Fallback if destination is unknown but Gemini fails
    const destWord = context ? context.trim().split(" ")[0] : "your destination";
    return res.status(200).json({ 
      text: `I am currently running on local backup systems right now, but your premium itinerary for ${destWord} is fully loaded! Keep exploring the unique daily routes, map indicators, and hotel recommendation lists smoothly.` 
    });
  }
};

module.exports = { handleChat };
