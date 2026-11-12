# ✈️ TripZip – AI-Based Smart Trip Planner & Travel Guide

**Plan smarter. Travel better. Explore more.**

TripZip is an AI-powered travel planning and travel guide application developed using the MERN stack. It helps users plan personalized trips based on their destination, travel duration, budget, number of travelers and preferences.

The application uses Google's Gemini AI to generate customized day-wise itineraries and provides features such as hotel recommendations, transportation options, budget estimation, trip management and an AI-powered travel assistant.

---

## 🌟 Key Features

### 1. AI-Powered Itinerary Generation
- Generate personalized day-wise travel itineraries.
- Get recommendations based on destination, budget and travel duration.
- Discover popular tourist attractions, restaurants and activities.
- Use AI-generated travel suggestions to simplify trip planning.

### 2. Smart Budget Estimation
- Estimate trip expenses based on travel requirements.
- Calculate approximate accommodation, food and transportation costs.
- Check whether the selected budget is feasible.
- Provide budget-related suggestions.

### 3. Hotel Recommendations
- Explore available hotels based on destination.
- View hotel information, pricing and categories.
- Support budget, mid-range and luxury hotel categories.
- Implement dynamic hotel pricing based on demand and seasonal factors.

### 4. Transportation Planning
- Explore available transportation options.
- Support flight, train and bus-related features.
- View travel options based on the source and destination.

### 5. AI Travel Assistant
- Interact with an AI-powered travel assistant.
- Ask travel-related questions.
- Get contextual recommendations and travel guidance.

### 6. User Authentication
- User registration and login.
- Password hashing using bcrypt.
- JWT-based authentication.
- Protected routes and APIs.

### 7. Trip Management
- Save generated itineraries.
- View previously saved trips.
- Manage personal travel plans.

### 8. Hotel Booking and Payment
- Hotel booking functionality.
- Room availability management.
- Booking status tracking.
- Razorpay payment integration with a mock payment flow for development/testing.

---

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JWT, bcryptjs |
| AI Integration | Google Gemini API |
| HTTP Client | Axios |
| Routing | React Router |
| Maps | Leaflet, OpenStreetMap |
| Charts | Recharts |
| Payment | Razorpay |
| PDF Export | jsPDF, html2canvas |
| External Travel APIs | Amadeus API |
| Development Tools | Git, GitHub, VS Code |

---

## 🏗️ System Architecture

TripZip follows a three-tier architecture.

```text
             USER
               |
               v
      REACT FRONTEND
       (Vite + React)
               |
          Axios API Calls
               |
               v
      NODE.JS + EXPRESS
          BACKEND
               |
       +-------+--------+
       |       |        |
       v       v        v
   Controllers Middleware Services
       |       |        |
       +-------+--------+
               |
       +-------+---------+
       |       |         |
       v       v         v
    MongoDB  Gemini AI  External APIs
                       |
                 Amadeus / Razorpay
```

### Application Workflow

1. Users interact with the React frontend.
2. The frontend sends HTTP requests to the Express backend.
3. Authentication middleware verifies protected requests.
4. Controllers process business logic and communicate with services.
5. Gemini AI generates personalized travel recommendations.
6. Mongoose interacts with MongoDB to store and retrieve information.
7. The backend returns JSON responses to the frontend.

---

## 📁 Project Structure

```text
TripZip/
│
├── Frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
│
├── backend/
│   ├── config/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── tripController.js
│   │   ├── hotelController.js
│   │   ├── bookingController.js
│   │   └── paymentController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Trip.js
│   │   ├── Hotel.js
│   │   └── Booking.js
│   │
│   ├── routes/
│   ├── services/
│   │   └── aiService.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation and Setup

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB
- Git
- Google Gemini API key

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd TripZip
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret

GEMINI_API_KEY=your_gemini_api_key

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Add any other API credentials required by the enabled integrations.

Start the backend:

```bash
npm start
```
3. Frontend Setup

Open a new terminal:

```bash
cd Frontend
npm install
npm run dev
```

The Vite development server will display the local frontend URL in the terminal.

---

 Database Models

The application uses MongoDB with Mongoose for data management.

| Model | Purpose |
|---|---|
| User | Stores user information, credentials and preferences |
| Trip | Stores saved trip details and itinerary data |
| Hotel | Stores hotel information, categories, pricing and availability |
| Booking | Stores hotel booking information, payment ID and booking status |

---
Authentication and Security

- Passwords are hashed using bcryptjs before storage.
- JWT is used for user authentication.
- Express middleware protects restricted API endpoints.
- Authenticated user information is attached to the request.
- Password fields are excluded when retrieving user information for protected requests.



---

AI Integration

TripZip integrates Google's Gemini API for intelligent travel planning.

The AI service processes user-provided travel requirements and generates structured itinerary information.

The application uses a primary Gemini model with a fallback model to improve resilience when the primary model is unavailable. A predefined destination-based fallback mechanism is also available for itinerary generation.

---

Highlights and Implementation Concepts

Some important technical concepts implemented in this project include:

- RESTful API development using Express.js.
- JWT-based authentication and authorization middleware.
- Password hashing using bcryptjs.
- MongoDB schema design and Mongoose relationships.
- AI integration and prompt engineering.
- In-memory caching to reduce repeated AI API requests.
- Budget validation and expense estimation.
- Haversine formula for geographical distance estimation.
- Dynamic hotel pricing.
- Atomic room availability updates during booking.
- Payment verification using Razorpay integration.

---

Future Enhancements

- Real-time travel booking integrations.
- Improved AI recommendations using user travel history.
- Weather-based itinerary suggestions.
- Multi-language travel assistance.
- More advanced route optimization.
- Real-time hotel and transportation availability.
- Enhanced user reviews and ratings.

---

Project Information

Project Name: TripZip – AI-Based Smart Trip Planner & Travel Guide

Domain: Travel and Tourism

Project Type: Full-Stack Web Application

Technology: MERN Stack with Generative AI

---

License

This project is developed for educational and academic purposes. Licensing and third-party API usage are subject to their respective terms and conditions.
