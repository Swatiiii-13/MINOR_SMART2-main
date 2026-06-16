import { useState, useEffect } from 'react';

const TRIP_TYPES = [
  { id: 'Adventure', icon: '🏔️', label: 'Adventure' },
  { id: 'Temples & Culture', icon: '🛕', label: 'Temples & Culture' },
  { id: 'Beach & Relaxation', icon: '🏖️', label: 'Beach & Relaxation' },
  { id: 'City & Nightlife', icon: '🌆', label: 'City & Nightlife' },
  { id: 'Food & Cuisine', icon: '🍽️', label: 'Food & Cuisine' },
  { id: 'Family Friendly', icon: '👨‍👩‍👧', label: 'Family Friendly' },
  { id: 'Romantic', icon: '💑', label: 'Romantic' },
  { id: 'Budget Backpacking', icon: '🎒', label: 'Budget Backpacking' },
];

const TripForm = ({ onSubmit, defaultDestination }) => {
  const [originCity, setOriginCity] = useState('');
  const [destination, setDestination] = useState(defaultDestination || '');
  const [duration, setDuration] = useState('');
  const [travelers, setTravelers] = useState('');
  const [budget, setBudget] = useState('');
  const [preferences, setPreferences] = useState('');
  const [tripType, setTripType] = useState('Adventure');

  useEffect(() => {
    if (defaultDestination) {
      setDestination(defaultDestination);
    }
  }, [defaultDestination]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      originCity,
      destination,
      duration: parseInt(duration),
      travelers: parseInt(travelers),
      budget: parseInt(budget),
      preferences: preferences.split(',').map(p => p.trim()).filter(p => p),
      tripType,
    });
  };

  return (
    <div className="glass-container">
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Trip Details</h3>
      <form onSubmit={handleSubmit} className="trip-form-grid">
        <div className="form-group">
          <label>Travelling From (Origin)</label>
          <input 
            type="text" 
            className="glass-input" 
            placeholder="e.g., Mumbai, Delhi"
            value={originCity} 
            onChange={(e) => setOriginCity(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Destination</label>
          <input 
            type="text" 
            className="glass-input" 
            placeholder="e.g., Tokyo, Japan"
            value={destination} 
            onChange={(e) => setDestination(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Duration (days)</label>
          <input 
            type="number" 
            min="1" 
            className="glass-input" 
            placeholder="7"
            value={duration} 
            onChange={(e) => setDuration(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Travelers</label>
          <input 
            type="number" 
            min="1" 
            className="glass-input" 
            placeholder="2"
            value={travelers} 
            onChange={(e) => setTravelers(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Total Budget (₹)</label>
          <input 
            type="number" 
            min="1" 
            className="glass-input" 
            placeholder="50000"
            value={budget} 
            onChange={(e) => setBudget(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Preferences (comma separated)</label>
          <input 
            type="text" 
            className="glass-input" 
            placeholder="Nature, Food, History"
            value={preferences} 
            onChange={(e) => setPreferences(e.target.value)} 
          />
        </div>
        <div className="form-group full-width" style={{ marginTop: '1rem' }}>
          <label style={{ marginBottom: '10px', display: 'block' }}>Trip Type</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
            {TRIP_TYPES.map(type => (
              <div 
                key={type.id} 
                onClick={() => setTripType(type.id)}
                style={{
                  border: tripType === type.id ? '2px solid #2563eb' : '1px solid rgba(255,255,255,0.2)',
                  backgroundColor: tripType === type.id ? 'rgba(37, 99, 235, 0.2)' : 'rgba(0,0,0,0.2)',
                  padding: '12px 10px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  color: 'var(--text-primary)'
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{type.icon}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: tripType === type.id ? 'bold' : 'normal' }}>{type.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="form-group full-width" style={{ marginTop: '0.5rem' }}>
          <button type="submit" className="glass-button">Generate AI Itinerary ✨</button>
        </div>
      </form>
    </div>
  );
};

export default TripForm;
