import { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import TripForm from '../components/TripForm';
import TripExperience from '../components/TripExperience';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [itineraryData, setItineraryData] = useState(null);
  const [tripRequestData, setTripRequestData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.prefilledDestination) {
      // Clear any cached old trip when a new prefilled destination is provided from the Explore page
      sessionStorage.removeItem('currentItinerary');
      sessionStorage.removeItem('currentTripRequest');
      setItineraryData(null);
      setTripRequestData(null);
    } else {
      const savedItinerary = sessionStorage.getItem('currentItinerary');
      const savedRequest = sessionStorage.getItem('currentTripRequest');
      if (savedItinerary && savedRequest) {
        try {
          const parsedItinerary = JSON.parse(savedItinerary);
          if (parsedItinerary && parsedItinerary.success !== false) {
            setItineraryData(parsedItinerary);
            setTripRequestData(JSON.parse(savedRequest));
          } else {
            sessionStorage.removeItem('currentItinerary');
            sessionStorage.removeItem('currentTripRequest');
          }
        } catch (e) {
          sessionStorage.removeItem('currentItinerary');
          sessionStorage.removeItem('currentTripRequest');
        }
      }
    }
  }, [location.state?.prefilledDestination]);

  const handleGenerateItinerary = async (formData) => {
    setTripRequestData(formData);
    setLoading(true);
    setItineraryData(null);
    try {
      const response = await api.post('/trips/generate', formData);
      
      if (response.data && response.data.success === false) {
        // Catch pre-trip validation failures cleanly
        alert(`❌ Trip Planning Issue:\n${response.data.message}\n\n💡 Suggestion:\n${response.data.suggestion}`);
        setItineraryData(null);
        return;
      }
      
      setItineraryData(response.data);
      sessionStorage.setItem('currentItinerary', JSON.stringify(response.data));
      sessionStorage.setItem('currentTripRequest', JSON.stringify(formData));
    } catch (error) {
      console.error('Error generating itinerary', error);
      alert('Failed to generate itinerary. Check your API key or inputs.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  // If we have data, switch to the full screen experience mode instead of split dashboard
  if (itineraryData && !loading) {
    return (
      <div className="experience-container" style={{ padding: '0', margin: '0 auto', maxWidth: '1400px' }}>
        <button 
          onClick={() => { setItineraryData(null); sessionStorage.removeItem('currentItinerary'); }}
          className="glass-button"
          style={{ position: 'fixed', top: '85px', left: '2rem', zIndex: 100, width: 'auto', padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          ← New Plan
        </button>
        <TripExperience data={itineraryData} requestData={tripRequestData} />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-container"
    >
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <h2>Create Your Journey</h2>
          <p>Where are you going next, {user.name.split(' ')[0]}?</p>
        </div>
      </header>

      <div className="dashboard-grid">
        <aside className="dashboard-sidebar">
          <TripForm onSubmit={handleGenerateItinerary} defaultDestination={location.state?.prefilledDestination || ''} />
        </aside>

        <main className="dashboard-main">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-container loading-spinner"
              >
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  style={{ fontSize: '3rem', marginBottom: '1rem' }}
                >
                  ✨
                </motion.div>
                <h3>Curating your perfect itinerary...</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Our AI is researching hotels, routes, and local experiences.</p>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-container empty-state"
              >
                <span style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.8 }}>✈️</span>
                <h3>Ready to explore?</h3>
                <p>Fill out your preferences on the left and let AI craft a hyper-personalized journey.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  );
};

export default Dashboard;
