# ✈️ TripZip: AI-Based Smart Travel Planner

**TripZip** is a next-generation, full-stack AI-powered travel planning and booking application designed to deliver highly personalized, geographically grounded, and budget-aware itineraries. Built using **React 19**, **Node.js/Express**, and **MongoDB**, TripZip utilizes **Google's Gemini AI models** to generate curated travel plans on the fly while integrating interactive maps, budget charts, live hotel and transit queries, and a fully simulated Razorpay booking checkout system.

---

## 🚀 Key Features

*   **🔍 AI Itinerary Generator:** Generates immersive, non-repetitive, step-by-step itineraries based on duration, travelers, budget, preferences, and origin city.
*   **📍 Interactive Leaflet Maps:** Plugs into the OpenStreetMap (via Nominatim API) to geocode points of interest and display interactive map markers with Google Maps directions routing.
*   **📊 Cost Distribution & Budget Analytics:** Renders dynamic Pie and Bar charts (using Recharts) for category cost breakdowns and day-wise expenses, with a one-click **PDF Itinerary Export** capability.
*   **🏨 Dynamic Hotel Search & Booking Gateway:** Fetches AI-curated hotel recommendations matching specific budgets, featuring Unsplash imagery, dynamic pricing multiplier attributes, and simulated Razorpay payments.
*   **🚊 Transit & Flight Search Engine:** Interfaces with Amadeus API and mock Railway/Bus adapters to fetch flight, train, and bus choices for the planned route.
*   **💬 Hybrid Travel Agent Chat Copilot:** A chat console acting as a virtual assistant, offering offbeat local alternatives, budget guides, and safety advisories.
*   **🔐 Auth Guarded travel History:** JWT-based user session authentication, securing saved memories and bookings.

---

## 🛠️ Complete Technology Stack

### Frontend Architecture
*   **Framework:** React 19 (Vite Build Tool)
*   **Routing:** React Router v7 (`react-router-dom`)
*   **Animations:** Framer Motion (for sleek transitions and expandable cards)
*   **State Management:** React Context API (`AuthContext`)
*   **Data Visualization:** Recharts (interactive cost charts)
*   **Mapping:** Leaflet & React-Leaflet (dynamic coordinate mapping)
*   **Utilities:** `html2canvas` & `jspdf` (client-side PDF builder), Axios (HTTP Client), Lucide-React (vector icons)
*   **Styling:** Custom glassmorphic Vanilla CSS (modern dark-theme layout)

### Backend Architecture
*   **Runtime:** Node.js
*   **Web Server:** Express.js
*   **Database:** MongoDB & Mongoose ODM
*   **Security:** JSON Web Tokens (JWT) for session control & `bcryptjs` for salted password hashing
*   **API Integrations:**
    *   `@google/generative-ai` (Gemini 1.5 Flash & 2.0 Flash SDKs)
    *   `amadeus` Node SDK (live flight queries)
    *   `razorpay` Node SDK (payment verification)
*   **Environment Management:** `dotenv`

---

## 🗺️ Step-by-Step System Workflow

```mermaid
graph TD
    A[User visits TripZip] --> B[Register / Login Security Guard - JWT & Bcryptjs]
    B --> C[Trip Request Form Input Captured]
    C --> D[Pre-Trip Feasibility Validation Engine]
    D -- Budget Insufficient --> D1[Smart Recommendation Loop - Reduce Days / Change Destination]
    D -- Feasible --> E[AI Central Service Grounding Request]
    E --> F[AI Prompt Generation & JSON Mapping - Gemini API]
    F --> G[Render Dashboard: Itinerary Timeline + Recharts Analytics]
    G --> H[Explore Stays, Trains, Flights, and Buses]
    H --> I[Razorpay Booking Sandbox Simulator]
    I -- Atomic Mongoose Lock --> J[Booking Confirmed & Archived to Travel History]
    G --> K[Interactive Map Modal - Nominatim Geocoding]
    G --> L[PDF Export Engine - HTML2Canvas & jsPDF]
    G --> M[Live AI Chat Copilot Audit Interception]
```

### Step 1: User Authentication & Security Guard
*   The visitor enters through the public pages `/login` or `/register`. 
*   **Registration:** Passwords are salted and hashed using `bcryptjs` (10 rounds) before getting stored in MongoDB.
*   **Login:** The server verifies password validity, generates a JSON Web Token (JWT) containing the user ID, and returns it to the client. The React `AuthContext` receives the token and stores it in Axios headers for all subsequent authenticated API calls.

### Step 2: Trip Customization & Parameter Capture
*   The user accesses the protected dashboard and fills the `TripForm`. Parameters include:
    *   *Origin City* (e.g., Delhi) & *Destination* (e.g., Goa)
    *   *Duration* (Number of days)
    *   *Travelers count* & *Trip Type* (e.g., Adventure, Solo, Family)
    *   *Total Budget* (in INR) & *Specific Preferences* (e.g., Beaches, Temples, Street Food)

### Step 3: Pre-Trip Feasibility Validation System
*   Before contacting the AI model, the backend executes an offline feasibility check.
*   It looks up coordinates for the origin and destination, calculating the **Haversine Distance**.
*   It computes mathematical minimum cost thresholds for:
    *   **Stay:** `Days * Math.ceil(Travelers / 2) * ₹800` (Economy room baseline)
    *   **Food:** `Days * Travelers * ₹300` (Local meals baseline)
    *   **Transport:** Scaled based on distance thresholds (e.g., flight price baseline for >800km distance).
*   If the user's budget is lower than the calculated minimum required sum, the request is intercepted. The system sends back a detailed breakdown and calculation recommending a reduced duration or closer destination, preserving API token quotas.

### Step 4: Context Grounding & AI Structuring
*   If feasible, the server loads local destination metadata (Hubli, Goa, Manali, Kerala, Agra) to seed the prompt, acting as a grounding layer.
*   The system formats a structured instructions block, specifying rules like the *Zero-Placeholder Rule* (mandatory usage of real names of hotels, cafes, and spots) and the *Token-Bound Rule* (forcing short, detailed sentences to prevent output truncation).
*   The prompt requests a structured output configured via `responseMimeType: 'application/json'`.

### Step 5: Parsing & Front-End Rendering
*   The backend validates and repairs the JSON output (normalizing numeric attributes, calculating budget breakdowns, and mapping daily lists).
*   The React client parses the JSON structure:
    *   **Timeline:** Renders cards for morning, afternoon, and evening experiences.
    *   **Recharts Visualizer:** Renders a cost distribution pie chart and a day-wise budget bar chart.
    *   **PDF Exporter:** Uses `html2canvas` to render the DOM canvas, saving it as an A4 document with `jsPDF`.

### Step 6: Hotel Recommendations & Simulated Bookings
*   The user browses hotels categorized into *Budget*, *Mid-Range*, and *Luxury*.
*   When a hotel is chosen, the app redirects the user to `/checkout`.
*   If the local `.env` contains placeholder Razorpay credentials, the page launches an overlay **Razorpay Sandbox Simulator**. The user can trigger either a `🟢 Success` or `🔴 Failure` outcome, simulating real network delay.
*   Upon successful payment signature validation (HMAC SHA256), the server performs an **atomic database update**, reducing available rooms and saving the booking.

### Step 7: Hybrid Chat Copilot & History Archive
*   The virtual Travel Agent Chat allows asking ad-hoc questions.
*   To minimize latency, a **Hybrid Copilot Interception Algorithm** intercepts questions containing keywords like "sunset", "food", "safety", or "hidden gems". It extracts responses from local grounded data, bypassing Gemini API to conserve costs. If no match is found, it sends the context to Gemini for a live agent response.
*   Users can save their generated trips to MongoDB, where they are permanently archived.

---

## 🧮 Core Algorithms & Logical Implementations

### 1. Haversine Geometric Distance Formula
Used to estimate transit costs between cities based on latitude and longitude coordinates.
$$\Delta \text{lat} = \text{lat}_2 - \text{lat}_1$$
$$\Delta \text{lon} = \text{lon}_2 - \text{lon}_1$$
$$a = \sin^2\left(\frac{\Delta \text{lat}}{2}\right) + \cos(\text{lat}_1) \cdot \cos(\text{lat}_2) \cdot \sin^2\left(\frac{\Delta \text{lon}}{2}\right)$$
$$c = 2 \cdot \arctan2(\sqrt{a}, \sqrt{1-a})$$
$$\text{Distance} = R \cdot c \quad (\text{where } R = 6371 \text{ km})$$

### 2. Mongoose Dynamic Pricing Engine
Utilizes Mongoose virtual attributes to dynamically update hotel prices depending on mock demand factors and seasonal multipliers.
```javascript
// models/Hotel.js
hotelSchema.virtual('currentPrice').get(function() {
  return this.basePrice * this.demandFactor * this.seasonMultiplier;
});
```

### 3. Atomic Room Allocation (Race Condition Lock)
Prevents double-booking by ensuring database verification and room decrement occur in a single atomic database operation.
```javascript
// controllers/bookingController.js
const hotel = await Hotel.findOneAndUpdate(
  { _id: hotelId, availableRooms: { $gt: 0 } },
  { $inc: { availableRooms: -1 } },
  { returnDocument: 'after' }
);
```

### 4. Dual-Model Fallback Architecture
Handles rate-limits or key configuration issues on the host platform.
```javascript
// services/aiService.js
const generateWithFallback = async (modelConfig, promptString) => {
  try {
    const model = genAI.getGenerativeModel({ ...modelConfig, model: 'gemini-1.5-flash' });
    return await model.generateContent(promptString);
  } catch (error) {
    if (error.status === 404 || error.message.includes('not found')) {
      const fallbackModel = genAI.getGenerativeModel({ ...modelConfig, model: 'gemini-2.0-flash' });
      return await fallbackModel.generateContent(promptString);
    }
    throw error;
  }
};
```

---

## 💾 Database Schema Design

```
   ┌──────────────┐           ┌──────────────┐
   │     User     │           │     Trip     │
   ├──────────────┤           ├──────────────┤
   │ _id          │◄──┐       │ _id          │
   │ email (Unique)│  └───────│ user (Ref)   │
   │ password     │           │ destination  │
   │ name         │           │ duration     │
   │ createdAt    │           │ budget       │
   └──────────────┘           │ itineraryData│
                              └──────────────┘
   ┌──────────────┐           ┌──────────────┐
   │    Hotel     │           │   Booking    │
   ├──────────────┤           ├──────────────┤
   │ _id          │◄──┐       │ _id          │
   │ name         │   └───────│ hotelId (Ref)│
   │ location     │◄──┐       │ userId (Ref) │
   │ basePrice    │   │       │ checkIn      │
   │ demandFactor │   │       │ checkOut     │
   │ features[]   │   └───────│ totalCost    │
   │ category     │           │ status       │
   │ availableRooms│          │ paymentId    │
   └──────────────┘           └──────────────┘
```

---

## ⚙️ Installation & Setup Guide

### Prerequisites
*   Node.js (v18+)
*   MongoDB Instance (Local or Atlas cloud cluster)
*   Google Gemini API Key

### Backend Setup
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file in the `backend/` root folder:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://your_username:your_password@cluster0.mongodb.net/trip_zip
   JWT_SECRET=your_jwt_secret_token
   GEMINI_API_KEY=your_google_gemini_api_key
   RAZORPAY_KEY_ID=placeholder_or_real_key_id
   RAZORPAY_KEY_SECRET=placeholder_or_real_key_secret
   AMADEUS_CLIENT_ID=placeholder_or_real_client_id
   AMADEUS_CLIENT_SECRET=placeholder_or_real_client_secret
   RAILWAY_API_KEY=placeholder_or_real_railway_api_key
   ```
3. Run the development server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the `Frontend/` directory:
   ```bash
   cd Frontend
   npm install
   ```
2. Create a `.env` file in the `Frontend/` root folder:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_RAZORPAY_KEY_ID=placeholder_or_real_key_id
   ```
3. Start the Vite server:
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:5173`.

---

## 🔮 Future Enhancements

1.  **🌤️ Live Weather API Integration:** Combine daily itinerary cards with real-time weather forecasts and packing advisories.
2.  **💱 Real-time Currency Converter:** Dynamic itinerary adjustments for international destinations incorporating up-to-date currency conversion values.
3.  **🤝 Collaborative Planning Cabin:** Enable group travelers to view, edit, and co-plan travel details together in a shared planning workspace.
4.  **📈 Smart Review & Recommendation Engine:** Machine learning-based hotel and restaurant suggestions based on user ratings and historical itineraries.
