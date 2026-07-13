import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Compass, Tag, Calendar, DollarSign, ArrowRight, X, Star, Heart, MapPin, Sparkles } from 'lucide-react';
import UnsplashImage from '../components/UnsplashImage';

const TRENDING_DESTINATIONS = [
  {
    id: 'goa',
    name: 'Goa',
    image: 'Goa beach palms ocean',
    vibe: 'Sun-kissed beaches, Portuguese villas, and electric night shacks.',
    season: 'November — February',
    budget: '₹15,000 - ₹35,000',
    category: 'Beach Escapes',
    tags: ['Beaches', 'Nightlife', 'Cafés'],
    overview: 'India\'s ultimate coastal retreat combining scenic beaches, historical 17th-century Portuguese heritage, spice farms, and vibrant tropical cafes.',
    attractions: ['Fontainhas Latin Quarter', 'Baga Beach & Shacks', 'Dudhsagar Waterfalls', 'Purple Martini Sunset Lounge'],
    activities: ['Scenic heritage walk', 'Water sports at Baga', 'Sunset clifftop dinner', 'Mandovi river cruise'],
    isRecommended: true,
    recommendationReason: 'Perfect for beach lovers & nightlife enthusiasts'
  },
  {
    id: 'manali',
    name: 'Manali',
    image: 'Manali mountains snow pines',
    vibe: 'Snow-capped peaks, evergreen pine forests, and cozy mountain cafes.',
    season: 'October — April',
    budget: '₹20,000 - ₹40,000',
    category: 'Mountain Retreats',
    tags: ['Mountains', 'Adventure', 'Cafés'],
    overview: 'A high-altitude Himalayan resort town known for its cool valleys, Solang adventure parks, pristine waterfalls, and old vintage wooden architecture.',
    attractions: ['Solang Valley', 'Old Manali Cafés', 'Hadimba Temple', 'Jogini Waterfalls Walk'],
    activities: ['Hadimba temple exploration', 'Café-hopping in Old Manali', 'Solang paragliding adventure', 'Jogini falls scenic trek'],
    isRecommended: true,
    recommendationReason: 'Ideal for adventure travelers & mountain seekers'
  },
  {
    id: 'kashmir',
    name: 'Kashmir',
    image: 'Kashmir mountains dal lake shikara',
    vibe: 'Majestic glassy lakes, floating wooden houseboats, and snow valleys.',
    season: 'March — August',
    budget: '₹25,000 - ₹50,000',
    category: 'Mountain Retreats',
    tags: ['Scenic', 'Lakes', 'Houseboats'],
    overview: 'Often called "Paradise on Earth", Kashmir offers breathtaking flower-filled alpine meadows, snowy Gulmarg cable rides, and iconic Dal Lake shikara rides.',
    attractions: ['Dal Lake Houseboats', 'Gulmarg Gondola Ride', 'Pahalgam Valley', 'Shalimar Bagh Mughal Garden'],
    activities: ['Shikara lake cruise at sunset', 'Himalayan Gondola ride', 'Meadow walking in Pahalgam', 'Tasting saffron Kahwa tea'],
    isRecommended: false
  },
  {
    id: 'bali',
    name: 'Bali',
    image: 'Bali temples tropical forest waterfall',
    vibe: 'Spiritual stone temples, terraced emerald rice fields, and surf coasts.',
    season: 'April — October',
    budget: '₹60,000 - ₹1,20,000',
    category: 'Luxury Escapes',
    tags: ['Spiritual', 'Beaches', 'Surfing'],
    overview: 'A famous Indonesian volcanic island known for its rich Hindu heritage, jungle swings, spiritual meditation hubs, and world-class surfing beaches.',
    attractions: ['Uluwatu Cliff Temple', 'Tegalalang Rice Terraces', 'Seminyak Coastal Cafes', 'Nusa Penida Cliffs'],
    activities: ['Sunset temple dance watching', 'Scenic rice terrace swing', 'Scuba diving in Gili Islands', 'Beach club lounging'],
    isRecommended: true,
    recommendationReason: 'Trending this month among digital nomads'
  },
  {
    id: 'dubai',
    name: 'Dubai',
    image: 'Dubai skyscraper skyline desert safari',
    vibe: 'Ultramodern towering skylines, luxury gold souks, and desert safaris.',
    season: 'November — March',
    budget: '₹80,000 - ₹1,50,000',
    category: 'Luxury Escapes',
    tags: ['Modern', 'Shopping', 'Desert'],
    overview: 'A global metropolis celebrated for its architectural ambition (Burj Khalifa), vast futuristic shopping malls, artificial islands, and golden sand dunes.',
    attractions: ['Burj Khalifa Observation Deck', 'Dubai Mall Fountain Show', 'Palm Jumeirah Resort', 'Desert Dunes Safari'],
    activities: ['Burj Khalifa high floor view', 'Desert dune buggy riding', 'Dubai Marina yacht cruise', 'Traditional Gold Souk stroll'],
    isRecommended: false
  },
  {
    id: 'kerala',
    name: 'Kerala',
    image: 'Kerala backwaters coconut trees boat',
    vibe: 'Peaceful houseboats, rolling mist tea hills, and rich spice forests.',
    season: 'September — March',
    budget: '₹20,000 - ₹45,000',
    category: 'Hidden Gems',
    tags: ['Backwaters', 'Nature', 'Heritage'],
    overview: 'India\'s "God\'s Own Country", famous for Kumarakom serene backwaters, colonial coastal architecture, Munnar mist tea plantations, and wellness Ayurvedic spas.',
    attractions: ['Alleppey Houseboat Canals', 'Fort Kochi Chinese Nets', 'Munnar Tea Estate Hills', 'Varkala Red Sunset Cliffs'],
    activities: ['Canal houseboat overnight stay', 'Scenic tea estate trail walk', 'Traditional Kathakali theater', 'Ayurvedic body massage'],
    isRecommended: true,
    recommendationReason: 'Best rejuvenating escape for couples'
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    image: 'Jaipur pink city palace fort',
    vibe: 'Royal pink palaces, historic stone forts, and vibrant textile bazaars.',
    season: 'October — March',
    budget: '₹15,000 - ₹30,000',
    category: 'Cultural Cities',
    tags: ['Royal', 'History', 'Bazaars'],
    overview: 'Rajasthan\'s famed capital town boasting majestic Amer stone fortresses, Hawa Mahal pink latticed facades, solar stone astrolabes, and beautiful pottery.',
    attractions: ['Amer Fort Palace', 'Hawa Mahal Frontage', 'City Palace Museum', 'Johari Bazaar Fabric Lane'],
    activities: ['Amer Fort elephant-path climb', 'Hawa Mahal photo session', 'Royal armor museum visit', 'Eating famous Dal Baati Churma'],
    isRecommended: false
  },
  {
    id: 'thailand',
    name: 'Thailand',
    image: 'Thailand tropical island longboat rocks',
    vibe: 'Ornate golden Buddhist temples, street food markets, and karst islands.',
    season: 'November — April',
    budget: '₹40,000 - ₹80,000',
    category: 'Budget Backpacking',
    tags: ['Temples', 'Islands', 'Street Food'],
    overview: 'A beloved Southeast Asian hub showcasing chaotic night food bazaars, crystal limestone islands (Phi Phi), ornate golden shrines, and dynamic massage spas.',
    attractions: ['Bangkok Grand Palace', 'Phi Phi Limestone Islands', 'Chiang Mai Shrines', 'Phuket Old Town lanes'],
    activities: ['Phi Phi island speedboat tour', 'Street food culinary walk', 'Ancient golden temple visit', 'Snorkeling in turquoise waves'],
    isRecommended: true,
    recommendationReason: 'Highly popular among solo backpackers'
  },
  {
    id: 'paris',
    name: 'Paris',
    image: 'Paris eiffel tower seine river autumn',
    vibe: 'Romantic cafes, classical architecture, Louvre arts, and Eiffel light glows.',
    season: 'April — October',
    budget: '₹1,20,000 - ₹2,50,000',
    category: 'Luxury Escapes',
    tags: ['Romantic', 'Art', 'Cuisine'],
    overview: 'The global capital of art, fashion, gastronomy, and romance, famous for Seine river cruise trails, vintage cafés, and the majestic Louvre museum works.',
    attractions: ['Eiffel Tower Summit', 'Louvre Museum Art Gallery', 'Notre-Dame Cathedral Area', 'Champs-Élysées Avenue Walk'],
    activities: ['Eiffel Tower golden hour climb', 'Louvre museum art walk', 'Seine river cruise with dinner', 'French bakery croissant tasting'],
    isRecommended: true,
    recommendationReason: 'Most romantic city break in the world'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Escapes', icon: '🌍' },
  { id: 'Beach Escapes', label: 'Beach Escapes', icon: '🏖️' },
  { id: 'Mountain Retreats', label: 'Mountain Retreats', icon: '🏔️' },
  { id: 'Cultural Cities', label: 'Cultural Cities', icon: '🛕' },
  { id: 'Luxury Escapes', label: 'Luxury Escapes', icon: '💎' },
  { id: 'Budget Backpacking', label: 'Budget Backpacking', icon: '🎒' },
  { id: 'Hidden Gems', label: 'Hidden Gems', icon: '✨' }
];

const TRENDING_SEARCHES = ['Goa beach', 'Romantic', 'Budget trip', 'snow destinations', 'Paris tour'];

const Explore = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Filter logic
  const filteredDestinations = TRENDING_DESTINATIONS.filter(dest => {
    const matchesSearch = 
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.vibe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      dest.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = activeCategory === 'all' || dest.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fav => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const handlePlanTrip = (destName) => {
    navigate('/dashboard', { state: { prefilledDestination: destName } });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="dashboard-container"
      style={{ maxWidth: '1300px' }}
    >
      {/* Self-contained styling overrides for RATI Premium Look */}
      <style>{`
        .explore-search-section {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 2.5rem;
          margin-bottom: 2.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.4);
        }
        .explore-search-section::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .explore-search-container {
          position: relative;
          max-width: 600px;
          margin: 1.5rem auto 1rem;
        }
        .explore-search-input {
          width: 100%;
          padding: 1.1rem 1.5rem 1.1rem 3.5rem;
          background: rgba(0,0,0,0.4);
          border: 1.5px solid rgba(255,255,255,0.15);
          border-radius: 999px;
          color: white;
          font-size: 1.05rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
        }
        .explore-search-input:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3), inset 0 2px 4px rgba(0,0,0,0.5);
          transform: translateY(-1px);
        }
        .explore-search-icon {
          position: absolute;
          left: 1.3rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
        }
        .trending-search-pill {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 999px;
          padding: 0.35rem 0.9rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-block;
          margin: 0.25rem;
        }
        .trending-search-pill:hover {
          background: rgba(59, 130, 246, 0.2);
          border-color: var(--accent-color);
          color: white;
          transform: translateY(-1px);
        }
        .horizontal-category-scroll {
          display: flex;
          overflow-x: auto;
          gap: 0.8rem;
          padding: 0.5rem 0 1.5rem;
          margin-bottom: 2rem;
          scrollbar-width: none;
        }
        .horizontal-category-scroll::-webkit-scrollbar {
          display: none;
        }
        .category-pill {
          flex: 0 0 auto;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 0.75rem 1.25rem;
          font-weight: 500;
          font-size: 0.9rem;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .category-pill:hover {
          background: rgba(255,255,255,0.09);
          color: white;
          transform: translateY(-2px);
        }
        .category-pill.active {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.35) 100%);
          border-color: var(--accent-color);
          color: white;
          box-shadow: 0 0 15px rgba(59,130,246,0.25);
        }
        .explore-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
          margin-bottom: 3.5rem;
        }
        .explore-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          height: 430px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .explore-card:hover {
          transform: translateY(-6px);
          border-color: rgba(59, 130, 246, 0.4);
          box-shadow: 0 15px 35px rgba(0,0,0,0.5), 0 0 25px rgba(59, 130, 246, 0.15);
        }
        .explore-img-wrap {
          position: relative;
          height: 220px;
          overflow: hidden;
          width: 100%;
        }
        .explore-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .explore-card:hover .explore-img-wrap img {
          transform: scale(1.1);
        }
        .explore-img-overlay {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(15,23,42,0.8) 100%);
        }
        .explore-category-tag {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 0.3rem 0.8rem;
          border-radius: 30px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.03em;
        }
        .explore-fav-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s ease;
          color: white;
        }
        .explore-fav-btn:hover {
          transform: scale(1.1);
          border-color: #ef4444;
          color: #ef4444;
        }
        .explore-fav-btn.active {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.4);
        }
        .explore-card-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .explore-card-tags {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
          margin-bottom: 0.6rem;
        }
        .explore-card-tag {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--accent-color);
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 4px;
          padding: 0.15rem 0.4rem;
          text-transform: uppercase;
        }
        .explore-card-title {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 0.4rem;
          color: white;
        }
        .explore-card-vibe {
          color: var(--text-secondary);
          font-size: 0.85rem;
          line-height: 1.45;
          margin-bottom: 1.25rem;
          flex-grow: 1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .explore-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 0.8rem;
          border-top: 1px solid rgba(255,255,255,0.06);
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .explore-card-meta {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        .feed-section-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: white;
        }
        .explore-feed-section {
          background: rgba(255,255,255,0.01);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 3rem;
        }
        .preview-modal-overlay {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(12px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        .preview-modal-card {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border: 1.5px solid var(--glass-border);
          border-radius: 24px;
          width: 100%;
          max-width: 750px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          position: relative;
        }
        .preview-modal-card::-webkit-scrollbar {
          width: 8px;
        }
        .preview-modal-card::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }
        .preview-modal-hero {
          height: 280px;
          position: relative;
          width: 100%;
        }
        .preview-modal-hero img {
          width: 100%; height: 100%; object-fit: cover;
        }
        .preview-modal-close {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          width: 36px; height: 36px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 10;
        }
        .preview-modal-close:hover {
          transform: scale(1.08);
          background: black;
          border-color: white;
        }
        .preview-modal-body {
          padding: 2rem;
        }
        .preview-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .preview-stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 0.8rem;
          text-align: center;
        }
        .preview-stat-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }
        .preview-stat-val {
          font-size: 0.95rem;
          font-weight: 600;
          color: white;
        }
        .preview-modal-cta {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .shimmer-bg {
          background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.6s infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {/* Header Banner */}
      <header className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
        <div className="dashboard-header-left">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Compass className="text-blue" style={{ color: 'var(--accent-color)' }} /> Explore World wonders
          </h2>
          <p>Discover real hand-curated destinations and customize itineraries instantly with AI.</p>
        </div>
      </header>

      {/* Search Experience */}
      <div className="explore-search-section">
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem', background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Find Your Next Adventure
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '550px', margin: '0 auto' }}>
          Search for mountain trails, sandy beaches, ancient royal cities, or luxury island getaways.
        </p>

        <div className="explore-search-container">
          <Search size={20} className="explore-search-icon" />
          <input
            type="text"
            className="explore-search-input"
            placeholder="Search by city, vibe, or travel category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '1.2rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Trending Searches */}
        <div style={{ marginTop: '0.8rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginRight: '0.5rem' }}>Trending:</span>
          {TRENDING_SEARCHES.map(term => (
            <span 
              key={term} 
              className="trending-search-pill"
              onClick={() => setSearchQuery(term)}
            >
              {term}
            </span>
          ))}
        </div>
      </div>

      {/* Scrollable Curated Categories */}
      <div className="horizontal-category-scroll">
        {CATEGORIES.map(cat => (
          <div
            key={cat.id}
            className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </div>
        ))}
      </div>

      {/* AI CURATED Discovery Feeds */}
      {searchQuery === '' && activeCategory === 'all' && (
        <div className="explore-feed-section">
          <h3 className="feed-section-title">
            <Sparkles size={20} style={{ color: '#fbbf24' }} /> AI Recommended For You
          </h3>
          <div className="explore-grid">
            {TRENDING_DESTINATIONS.filter(d => d.isRecommended).map(dest => (
              <motion.div
                key={`rec-${dest.id}`}
                layoutId={`rec-${dest.id}`}
                className="explore-card"
                onClick={() => setSelectedDestination(dest)}
                whileHover={{ scale: 1.02 }}
              >
                <div className="explore-img-wrap">
                  <UnsplashImage query={dest.image} alt={dest.name} />
                  <div className="explore-img-overlay" />
                  <span className="explore-category-tag">{dest.category}</span>
                  <button 
                    className={`explore-fav-btn ${favorites.includes(dest.id) ? 'active' : ''}`}
                    onClick={(e) => toggleFavorite(dest.id, e)}
                  >
                    <Heart size={16} fill={favorites.includes(dest.id) ? '#ef4444' : 'none'} />
                  </button>
                </div>

                <div className="explore-card-body">
                  <div className="explore-card-tags">
                    {dest.tags.map(t => (
                      <span key={t} className="explore-card-tag">{t}</span>
                    ))}
                  </div>
                  <h4 className="explore-card-title">{dest.name}</h4>
                  <p className="explore-card-vibe" style={{ fontStyle: 'italic', color: '#60a5fa', marginBottom: '0.4rem', fontWeight: 500 }}>
                    ✨ {dest.recommendationReason}
                  </p>
                  <p className="explore-card-vibe">{dest.vibe}</p>

                  <div className="explore-card-footer">
                    <span className="explore-card-meta"><Calendar size={13} /> {dest.season.split(' — ')[0]}</span>
                    <span className="explore-card-meta" style={{ color: 'var(--success)' }}><DollarSign size={13} /> {dest.budget.split(' - ')[0]}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Main Discover Grid */}
      <h3 className="feed-section-title" style={{ marginTop: '2.5rem' }}>
        <Compass size={20} className="text-blue" style={{ color: 'var(--accent-color)' }} /> 
        {activeCategory === 'all' ? 'All Curated Destinations' : `${activeCategory} Collection`} 
        <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: 'var(--text-secondary)', marginLeft: '0.8rem' }}>
          ({filteredDestinations.length} found)
        </span>
      </h3>

      {filteredDestinations.length === 0 ? (
        <div className="glass-container empty-state" style={{ padding: '3.5rem' }}>
          <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</span>
          <h4>No matching destinations found</h4>
          <p>Try refining your search terms or choosing a different curated escape category.</p>
          <button className="glass-button" style={{ maxWidth: '200px', marginTop: '1rem' }} onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="explore-grid">
          {filteredDestinations.map(dest => (
            <motion.div
              key={dest.id}
              layoutId={dest.id}
              className="explore-card"
              onClick={() => setSelectedDestination(dest)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="explore-img-wrap">
                <UnsplashImage query={dest.image} alt={dest.name} />
                <div className="explore-img-overlay" />
                <span className="explore-category-tag">{dest.category}</span>
                <button 
                  className={`explore-fav-btn ${favorites.includes(dest.id) ? 'active' : ''}`}
                  onClick={(e) => toggleFavorite(dest.id, e)}
                >
                  <Heart size={16} fill={favorites.includes(dest.id) ? '#ef4444' : 'none'} />
                </button>
              </div>

              <div className="explore-card-body">
                <div className="explore-card-tags">
                  {dest.tags.map(t => (
                    <span key={t} className="explore-card-tag">{t}</span>
                  ))}
                </div>
                <h4 className="explore-card-title">{dest.name}</h4>
                <p className="explore-card-vibe">{dest.vibe}</p>

                <div className="explore-card-footer">
                  <span className="explore-card-meta"><Calendar size={13} /> {dest.season}</span>
                  <span className="explore-card-meta" style={{ color: 'var(--success)' }}><DollarSign size={13} /> {dest.budget}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Destination Preview Modal */}
      <AnimatePresence>
        {selectedDestination && (
          <div className="preview-modal-overlay" onClick={() => setSelectedDestination(null)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="preview-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Hero */}
              <div className="preview-modal-hero">
                <UnsplashImage query={selectedDestination.image} alt={selectedDestination.name} />
                <div className="explore-img-overlay" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, #1e293b 100%)' }} />
                <button className="preview-modal-close" onClick={() => setSelectedDestination(null)}>
                  <X size={18} />
                </button>
                <div style={{ position: 'absolute', bottom: '1.5rem', left: '2rem' }}>
                  <span className="explore-category-tag" style={{ position: 'static', background: 'rgba(59,130,246,0.3)', borderColor: 'var(--accent-color)', display: 'inline-block', marginBottom: '0.6rem' }}>
                    {selectedDestination.category}
                  </span>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, color: 'white' }}>{selectedDestination.name}</h2>
                </div>
              </div>

              {/* Body */}
              <div className="preview-modal-body">
                {/* Stats */}
                <div className="preview-stats-grid">
                  <div className="preview-stat-card">
                    <div className="preview-stat-label">Best Season</div>
                    <div className="preview-stat-val">{selectedDestination.season}</div>
                  </div>
                  <div className="preview-stat-card">
                    <div className="preview-stat-label">Estimated Budget</div>
                    <div className="preview-stat-val" style={{ color: 'var(--success)' }}>{selectedDestination.budget}</div>
                  </div>
                  <div className="preview-stat-card">
                    <div className="preview-stat-label">Vibe Index</div>
                    <div className="preview-stat-val" style={{ color: 'var(--accent-color)' }}>{selectedDestination.tags.join(' • ')}</div>
                  </div>
                </div>

                {/* Content */}
                <h4 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Overview</h4>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {selectedDestination.overview}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ color: 'white', marginBottom: '0.75rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={16} className="text-blue" style={{ color: 'var(--accent-color)' }} /> Iconic Attractions
                    </h4>
                    <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8 }}>
                      {selectedDestination.attractions.map(a => (
                        <li key={a} style={{ marginBottom: '0.25rem' }}>{a}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 style={{ color: 'white', marginBottom: '0.75rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Sparkles size={16} style={{ color: '#fbbf24' }} /> Must-Do Activities
                    </h4>
                    <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8 }}>
                      {selectedDestination.activities.map(a => (
                        <li key={a} style={{ marginBottom: '0.25rem' }}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer CTA */}
                <div className="preview-modal-cta">
                  <button 
                    className="glass-button" 
                    style={{ width: 'auto', background: 'none', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--text-secondary)', margin: 0, padding: '0.75rem 1.5rem' }}
                    onClick={() => setSelectedDestination(null)}
                  >
                    Close
                  </button>
                  <button 
                    className="glass-button" 
                    style={{ 
                      width: 'auto', 
                      margin: 0, 
                      padding: '0.75rem 2rem', 
                      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', 
                      boxShadow: '0 0 20px rgba(37,99,235,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    onClick={() => handlePlanTrip(selectedDestination.name)}
                  >
                    Plan Trip with AI <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Explore;
