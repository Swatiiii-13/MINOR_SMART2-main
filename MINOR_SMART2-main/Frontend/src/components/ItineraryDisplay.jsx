import { useState, useEffect } from 'react';
import api from '../services/api';
import TransportOptions from './TransportOptions';
import HotelCard from './HotelCard';
import UnsplashImage from './UnsplashImage';
import ActivityImage from './ActivityImage';
import MapModal from './MapModal';


const ItineraryDisplay = ({ data, requestData }) => {
  const [saving, setSaving] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(false);
  
  // Map Modal State
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState('');

  const openMap = (place) => {
    setSelectedPlace(place);
    setIsMapOpen(true);
  };

  useEffect(() => {
    if (!data?.tripSummary?.destination) return;
    
    const fetchHotels = async () => {
      setLoadingHotels(true);
      try {
        const response = await api.get(`/hotels/${data.tripSummary.destination}?budget=${requestData.budget}&travelers=${requestData.travelers}&duration=${requestData.duration}`);
        setHotels(response.data);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoadingHotels(false);
      }
    };

    fetchHotels();
  }, [data]);

  const handleSaveTrip = async () => {
    if (!requestData) return;
    setSaving(true);
    try {
      await api.post('/trips/save', {
        destination: requestData.destination,
        duration: requestData.duration,
        budget: requestData.budget,
        itineraryData: data
      });
      alert('Trip saved to history successfully!');
    } catch (error) {
      console.error('Error saving trip:', error);
      alert('Failed to save trip.');
    } finally {
      setSaving(false);
    }
  };

  if (!data) return null;

  const { tripSummary, itinerary } = data;

  return (
    <div className="itinerary-display">
      <div className="glass-container summary-card" style={{ padding: 0, overflow: 'hidden' }}>
        <UnsplashImage 
          query={`${tripSummary.destination} beautiful scenery`}
          fallbackSrc="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
          alt="Destination Banner" 
          className="destination-banner" 
        />
        <div style={{ padding: '2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div className="summary-details">
            <h3>{tripSummary.destination}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              {tripSummary.totalDays} Days • {tripSummary.generalSafetyTip || "Safe travels!"}
            </p>
          </div>
          <div className="summary-cost">
            {tripSummary.estimatedCost ? (typeof tripSummary.estimatedCost === 'number' ? `₹${tripSummary.estimatedCost.toLocaleString('en-IN')}` : tripSummary.estimatedCost.toString().replace('$', '₹')) : "TBD"}
          </div>
        </div>
      </div>

      <TransportOptions 
        destination={tripSummary.destination} 
        origin={requestData?.originCity}
        travelers={requestData?.travelers || 1}
      />

      {/* Hotels Section */}
      <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginTop: '2rem' }}>
        Recommended Hotels in {tripSummary.destination}
      </h3>
      
      {loadingHotels ? (
        <div className="glass-container" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <p>Finding the best stays...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {hotels.map(hotel => (
            <HotelCard key={hotel.id} hotel={hotel} destination={tripSummary.destination} />
          ))}
        </div>
      )}

      <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginTop: '2rem' }}>
        Daily Itinerary
      </h3>

      {itinerary.map((dayData, index) => (
        <div key={`day-${index}`} className="day-card glass-container" style={{ padding: '1.5rem' }}>
          <div className="day-header">
            <h3>Day {dayData.day}</h3>
            <span>{dayData.theme}</span>
          </div>

          <div className="activity-grid">
            <div className="activity-card activity-morning" style={{ display: 'flex', flexDirection: 'column' }}>
              <ActivityImage 
                activityName={dayData.morning.activity}
                imageKeyword={dayData.morning.imageKeyword}
                destination={tripSummary.destination}
                fallbackSrc="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=500&q=80"
                alt="Morning Activity"
                className="activity-image"
              />
              <div className="activity-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span className="activity-time">Morning</span>
                <p className="activity-desc" style={{ flex: 1 }}>{dayData.morning.activity}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <span className="cost-badge">Est. ₹{Number(dayData.morning.costEstimate).toLocaleString('en-IN')}</span>
                  <button 
                    onClick={() => openMap(dayData.morning.activity)}
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    📍 View on Map
                  </button>
                </div>
              </div>
            </div>
            
            <div className="activity-card activity-afternoon" style={{ display: 'flex', flexDirection: 'column' }}>
              <ActivityImage 
                activityName={dayData.afternoon.activity}
                imageKeyword={dayData.afternoon.imageKeyword}
                destination={tripSummary.destination}
                fallbackSrc="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=500&q=80"
                alt="Afternoon Activity"
                className="activity-image"
              />
              <div className="activity-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span className="activity-time">Afternoon</span>
                <p className="activity-desc" style={{ flex: 1 }}>{dayData.afternoon.activity}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <span className="cost-badge">Est. ₹{Number(dayData.afternoon.costEstimate).toLocaleString('en-IN')}</span>
                  <button 
                    onClick={() => openMap(dayData.afternoon.activity)}
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    📍 View on Map
                  </button>
                </div>
              </div>
            </div>
            
            <div className="activity-card activity-evening" style={{ display: 'flex', flexDirection: 'column' }}>
              <ActivityImage 
                activityName={dayData.evening.activity}
                imageKeyword={dayData.evening.imageKeyword}
                destination={tripSummary.destination}
                fallbackSrc="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80"
                alt="Evening Activity"
                className="activity-image"
              />
              <div className="activity-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span className="activity-time">Evening</span>
                <p className="activity-desc" style={{ flex: 1 }}>{dayData.evening.activity}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <span className="cost-badge">Est. ₹{Number(dayData.evening.costEstimate).toLocaleString('en-IN')}</span>
                  <button 
                    onClick={() => openMap(dayData.evening.activity)}
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    📍 View on Map
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {dayData.localFoodSuggestion && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
              <strong>🍽️ Food Suggestion:</strong> {dayData.localFoodSuggestion}
            </div>
          )}
        </div>
      ))}

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button 
          onClick={handleSaveTrip} 
          disabled={saving || !requestData}
          className="glass-button"
          style={{ width: '100%', maxWidth: '300px', margin: '0 auto', padding: '1rem' }}
        >
          {saving ? 'Saving...' : '💾 Save Trip to History'}
        </button>
      </div>

      <MapModal 
        isOpen={isMapOpen} 
        onClose={() => setIsMapOpen(false)} 
        placeName={selectedPlace} 
        destination={tripSummary.destination} 
      />
    </div>
  );
};

export default ItineraryDisplay;
