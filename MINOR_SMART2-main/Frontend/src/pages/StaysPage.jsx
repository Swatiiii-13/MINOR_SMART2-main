import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import HotelCard from '../components/HotelCard';

const StaysPage = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [requestData, setRequestData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedRequest = sessionStorage.getItem('currentTripRequest');
    if (savedRequest) {
      setRequestData(JSON.parse(savedRequest));
    }
  }, []);

  useEffect(() => {
    if (!requestData) return;

    const fetchHotels = async () => {
      setLoading(true);
      setError(null);
      try {
        const { destination, budget, travelers, duration } = requestData;
        const response = await api.get(`/hotels/${encodeURIComponent(destination)}`, {
          params: { budget, travelers, duration }
        });
        setHotels(response.data);
      } catch (err) {
        console.error('Error fetching stays:', err);
        setError('Failed to fetch accommodations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [requestData]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-container"
    >
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <h2>Luxury & Boutique Stays</h2>
          <p>Curated accommodations that fit your dynamic travel style and budget.</p>
        </div>
      </header>

      {requestData ? (
        loading ? (
          <div className="glass-container empty-state" style={{ padding: '3rem' }}>
            <span style={{ fontSize: '3rem', marginBottom: '1rem', display: 'inline-block', animation: 'spin 2s linear infinite' }}>✨</span>
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
            <h3>Finding the perfect stays...</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Our AI is filtering boutique hotels and checking room availability in {requestData.destination}.</p>
          </div>
        ) : error ? (
          <div className="glass-container empty-state" style={{ padding: '3rem' }}>
            <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</span>
            <h3>Unable to fetch accommodations</h3>
            <p style={{ color: '#fca5a5' }}>{error}</p>
            <button 
              onClick={() => setRequestData({ ...requestData })} 
              className="glass-button" 
              style={{ maxWidth: '150px', marginTop: '1rem', margin: '1rem auto 0' }}
            >
              Retry Search
            </button>
          </div>
        ) : hotels.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '2rem', 
            marginTop: '1.5rem',
            marginBottom: '3rem'
          }}>
            {hotels.map((hotel, index) => (
              <HotelCard 
                key={hotel._id || index} 
                hotel={hotel} 
                destination={requestData.destination} 
              />
            ))}
          </div>
        ) : (
          <div className="glass-container empty-state" style={{ padding: '3rem' }}>
            <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏨</span>
            <h3>No stays found</h3>
            <p>We couldn't find any stays matching your specific budget constraints in {requestData.destination}.</p>
          </div>
        )
      ) : (
        <div className="glass-container empty-state" style={{ padding: '3rem' }}>
          <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏨</span>
          <h3>No active trip selection</h3>
          <p>Please plan a trip on the Dashboard first to see curated, budget-tailored accommodations.</p>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="glass-button" 
            style={{ maxWidth: '220px', marginTop: '1rem', margin: '1rem auto 0', background: 'var(--primary-color)' }}
          >
            Go to Dashboard
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default StaysPage;
