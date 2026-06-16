import { useState, useEffect } from 'react';
import api from '../services/api';

const TravelHistory = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/trips/history');
        setTrips(response.data);
      } catch (error) {
        console.error('Error fetching travel history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="glass-container loading-spinner">
        <p>Loading history...</p>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="glass-container empty-state">
        <span style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📚</span>
        <h3>No travel history</h3>
        <p>You haven't saved any trips yet.</p>
      </div>
    );
  }

  return (
    <div className="travel-history">
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>My Travel History</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {trips.map(trip => (
          <div key={trip._id} className="glass-container summary-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' }}>
            <div>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{trip.destination}</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                {trip.duration} Days • Budget: {trip.budget}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {new Date(trip.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelHistory;
