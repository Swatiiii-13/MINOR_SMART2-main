# AI-Based Smart Travel Planner - Project Documentation

## 1. Project Overview

The **AI-Based Smart Travel Planner** is a full-stack web application designed to help users generate dynamic, personalized travel itineraries using Google's Gemini AI. It provides a seamless experience for planning trips, getting hotel and transport recommendations, talking with an AI travel agent, and securely saving travel histories.

**Repository Structure:**
The repository is split into two main directories:
- `Frontend/`: A modern React application built with Vite and Tailwind CSS.
- `backend/`: A robust Node.js and Express.js REST API using MongoDB.

---

## 2. Technology Stack

### Frontend
- **Framework:** React 19, initialized with Vite.
- **Routing:** React Router v7 (`react-router-dom`).
- **Styling:** CSS (`App.css`, `style.css`), likely using standard modular CSS.
- **State Management:** React Context API (`AuthContext`).
- **HTTP Client:** Axios.

### Backend
- **Runtime:** Node.js.
- **Framework:** Express.js.
- **Database:** MongoDB via Mongoose.
- **Authentication:** JSON Web Tokens (JWT) and `bcryptjs` for password hashing.
- **AI Integration:** `@google/generative-ai` (Gemini 2.5 Flash model).
- **Environment Management:** `dotenv`.
- **Middleware:** `cors`, `express.json()`.
- **Mapping & Location:** `leaflet`, `react-leaflet`, and Nominatim OpenStreetMap API (Frontend).
- **Image Sourcing:** Unsplash API for dynamic contextual imagery.

---

## 3. Backend Architecture

The backend follows a standard MVC-like architecture but emphasizes routing and controllers.

### Core Modules:
- **`server.js`**: The main entry point. Initializes Express, connects to MongoDB, sets up global middlewares (CORS, JSON parsing), and defines the base API routes (`/api/...`).
- **`models/`**: Mongoose schemas defining the data structure.
  - `User.js`: Handles user authentication data (email, hashed password).
  - `Trip.js`: Stores generated AI itineraries, destination, budget, and links back to the user.
  - `Hotel.js`: Stores hotel recommendation data.
  - `Booking.js`: Handles user bookings and checkouts.
- **`routes/`**: Express routers that map HTTP methods and endpoints to specific controller functions.
  - `authRoutes.js`: Login, Registration.
  - `tripRoutes.js`: Trigger AI itinerary generation, save trips, fetch travel history.
  - `hotelRoutes.js`: Fetch AI-based hotel recommendations.
  - `transportRoutes.js`: Fetch AI-based transport options.
  - `chatRoutes.js`: Handle interactions with the AI travel agent.
  - `bookingRoutes.js`: Handle checkout and booking endpoints.
- **`controllers/`**: The core business logic.
  - `tripController.js`: Uses the `GoogleGenerativeAI` SDK (`gemini-2.5-flash`) to prompt for structured JSON travel itineraries based on destination, duration, budget, and preferences. Also handles saving to MongoDB.
  - `authController.js`: Manages user signup, login, password hashing, and JWT generation.
  - *Other controllers*: Follow similar AI-prompting logic for hotels, chat, and transport, or simple CRUD operations for bookings.

---

## 4. Frontend Architecture

The frontend is a single-page application (SPA) where protected routes are guarded by a custom `PrivateRoute` component relying on `AuthContext`.

### Core Flow & Routing (`App.jsx`):
- `/login`: Public route for user authentication.
- `/register`: Public route for user registration.
- `/dashboard`: The main protected view where the magic happens.
- `/checkout`: Protected view for finalizing bookings.

### Key Components:
- **`TripForm.jsx`**: A form component where the user inputs their travel criteria (origin city, destination, budget, duration, travelers, trip type, preferences). This triggers the backend AI generation.
- **`ItineraryDisplay.jsx`**: Renders the highly structured JSON itinerary returned by the Gemini AI. Displays day-by-day schedules and dynamic Unsplash imagery. Includes interactive 'View on Map' buttons for every activity.
- **`HotelCard.jsx` & `TransportOptions.jsx`**: Renders AI-recommended accommodations and transport methods. Hotel cards also feature dynamic Unsplash images and direct mapping capabilities.
- **`MapModal.jsx`**: A reusable popup component utilizing Leaflet and Nominatim to geocode locations on the fly and plot them on an interactive map with direct links to Google Maps routing.
- **`TravelAgentChat.jsx`**: A conversational interface allowing users to chat with the AI for ad-hoc travel advice or itinerary modifications.
- **`TravelHistory.jsx`**: Fetches and displays past trips the user has saved to the database.

### State & Context:
- **`context/AuthContext.jsx`**: Wraps the application to provide global user state (`user`, `loading`) and handles login/logout logic, persisting the JWT token.
- **`services/api.js`**: An Axios instance configured with a base URL to communicate with the backend, likely intercepting requests to attach the JWT token.

---

## 5. Typical User Flow

1. **Authentication**: The user visits the site and is redirected to `/login`. They can sign in or go to `/register` to create an account.
2. **Dashboard**: Upon successful login, the user enters the Dashboard.
3. **Trip Planning**: The user fills out the `TripForm`.
4. **AI Generation**: The frontend sends the criteria to the backend (`/api/trips/generate`). The backend prompts Gemini AI to generate a strict JSON itinerary and returns it to the client.
5. **Review**: The user views the generated itinerary (`ItineraryDisplay`), views hotel options (`HotelCard`), and transport details (`TransportOptions`).
6. **Chat**: The user can ask specific questions using the `TravelAgentChat`.
7. **Save & Checkout**: The user can save the trip to their history and proceed to `/checkout` to finalize any simulated bookings.

---

## 6. Setup & Installation

### Backend Setup
1. Navigate to the `backend/` directory.
2. Run `npm install` to install dependencies.
3. Create a `.env` file with the following keys:
   - `PORT=5000`
   - `MONGO_URI=<your-mongodb-connection-string>`
   - `JWT_SECRET=<your-jwt-secret>`
   - `GEMINI_API_KEY=<your-google-gemini-api-key>`
4. Run `npm start` (or `node server.js`).

### Frontend Setup
1. Navigate to the `Frontend/` directory.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the Vite development server.
4. Access the app in your browser (usually at `http://localhost:5173`).
