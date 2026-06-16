import { useState, useEffect } from 'react';
import api from '../services/api';

const TransportOptions = ({ destination, origin, travelers = 1 }) => {
  const [activeTab, setActiveTab] = useState('Flights');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!destination || !origin) return;

    const fetchTransport = async () => {
      setLoading(true);
      setError(null);
      setOptions([]);

      try {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        const dateStr = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;

        let endpoint = '/transport/flights';
        if (activeTab === 'Trains') endpoint = '/transport/trains';
        else if (activeTab === 'Buses') endpoint = '/transport/buses';
        
        const response = await api.get(`${endpoint}?origin=${origin}&destination=${destination}&date=${dateStr}&travelers=${travelers}`);
        setOptions(response.data);
        
        if (!response.data || response.data.length === 0) {
          setError(`No ${activeTab.toLowerCase()} found for this route.`);
        }
      } catch (err) {
        console.error(`Error fetching ${activeTab}:`, err);
        setError(`Failed to fetch ${activeTab.toLowerCase()} data from AI. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    fetchTransport();
  }, [destination, origin, activeTab, travelers]);

  const handleIRCTCRedirect = () => {
    window.open('https://www.irctc.co.in', '_blank');
  };

  const handleRedBusRedirect = () => {
    window.open('https://www.redbus.in', '_blank');
  };

  const handleMMTRedirect = () => {
    window.open('https://www.makemytrip.com/flights/', '_blank');
  };

  return (
    <div className="transport-options" style={{ marginTop: '1.5rem' }}>
      <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
        Transport Options: {origin} to {destination}
      </h3>
      
      {/* Tabs UI */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['Flights', 'Trains', 'Buses'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`glass-button ${activeTab === tab ? 'active' : ''}`}
            style={{ 
              margin: 0, 
              padding: '0.6rem 1.5rem', 
              width: 'auto', 
              background: activeTab === tab ? 'rgba(37, 99, 235, 0.4)' : 'rgba(255,255,255,0.05)', 
              border: activeTab === tab ? '1px solid #3b82f6' : '1px solid var(--glass-border)',
              transition: 'all 0.2s'
            }}
          >
            {tab === 'Flights' && '✈️ '}
            {tab === 'Trains' && '🚂 '}
            {tab === 'Buses' && '🚌 '}
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="glass-container" style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Asking AI for the best {activeTab.toLowerCase()} routes...</p>
        </div>
      ) : error ? (
        <div className="glass-container" style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#fca5a5', marginBottom: '1rem' }}>
            {activeTab === 'Flights' ? 'Unable to fetch flights.' : error}
          </p>
          <button 
            onClick={activeTab === 'Trains' ? handleIRCTCRedirect : activeTab === 'Buses' ? handleRedBusRedirect : handleMMTRedirect}
            className="glass-button" 
            style={{ margin: '0 auto', background: 'var(--primary-color)' }}
          >
            {activeTab === 'Trains' ? 'Search manually on IRCTC' : activeTab === 'Buses' ? 'Search manually on RedBus' : 'Book directly on MakeMyTrip'}
          </button>
        </div>
      ) : options.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {options.map((option, idx) => (
            <div key={idx} className="glass-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 1.5rem', gap: '1rem' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flex: 1 }}>
                <div style={{ 
                  width: '50px', height: '50px', 
                  background: 'rgba(255,255,255,0.1)', 
                  borderRadius: '50%', 
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  fontSize: '1.5rem', fontWeight: 'bold'
                }}>
                  {activeTab === 'Flights' ? (option.airlineName ? option.airlineName.charAt(0).toUpperCase() : '✈️') : activeTab === 'Trains' ? '🚂' : '🚌'}
                </div>
                
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>
                    {activeTab === 'Flights' ? `${option.airlineName || 'Airline Unavailable'} (${option.flightNumber || 'N/A'})` : activeTab === 'Trains' ? `${option.trainName || 'Train Name Unavailable'} (${option.trainNumber || 'N/A'})` : `${option.operatorName || 'Operator Unavailable'} - ${option.busType || 'Unknown Type'}`}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#9ca3af' }}>
                    {option.departureTime || 'TBD'} - {option.arrivalTime || 'TBD'}
                  </p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#d1d5db' }}>
                    Duration: {option.duration || 'Duration Unavailable'}
                  </p>
                  
                  {activeTab === 'Flights' && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.7rem', background: option.stops && option.stops.toLowerCase().includes('non') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(234, 179, 8, 0.2)', color: option.stops && option.stops.toLowerCase().includes('non') ? '#34d399' : '#fde047', border: option.stops && option.stops.toLowerCase().includes('non') ? '1px solid #10b981' : '1px solid #eab308', padding: '2px 6px', borderRadius: '12px' }}>
                        {option.stops || 'N/A'}
                      </span>
                      <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                        {option.class || 'Economy'}
                      </span>
                    </div>
                  )}

                  {activeTab === 'Trains' && Array.isArray(option.availableClasses) && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {option.availableClasses.map((c, i) => (
                        <span key={i} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                          {c.className || 'Unknown'}: {c.farePerPerson ? `₹${Number(c.farePerPerson).toLocaleString('en-IN')}` : 'N/A'}
                        </span>
                      ))}
                    </div>
                  )}

                  {activeTab === 'Buses' && Array.isArray(option.amenities) && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {option.amenities.map((amenity, i) => (
                        <span key={i} style={{ fontSize: '0.7rem', background: 'rgba(37,99,235,0.2)', color: '#93c5fd', border: '1px solid #2563eb', padding: '2px 6px', borderRadius: '12px' }}>
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div style={{ textAlign: 'right', minWidth: '150px' }}>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Total for {travelers} passenger(s)</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#10b981' }}>
                  {option.totalFareForGroup && !isNaN(Number(option.totalFareForGroup)) ? `₹${Number(option.totalFareForGroup).toLocaleString('en-IN')}` : (activeTab === 'Flights' ? 'Check on MakeMyTrip' : activeTab === 'Trains' ? 'Check on IRCTC' : 'Check on RedBus')}
                </div>
                
                {activeTab === 'Flights' ? (
                  <button 
                    onClick={handleMMTRedirect}
                    className="glass-button" 
                    style={{ margin: 0, padding: '0.5rem 1.2rem', background: '#f97316', fontSize: '0.9rem', fontWeight: 'bold' }}
                  >
                    Book on MakeMyTrip
                  </button>
                ) : activeTab === 'Trains' ? (
                  <button 
                    onClick={handleIRCTCRedirect}
                    className="glass-button" 
                    style={{ margin: 0, padding: '0.5rem 1.2rem', background: '#f97316', fontSize: '0.9rem', fontWeight: 'bold' }}
                  >
                    Book on IRCTC
                  </button>
                ) : (
                  <button 
                    onClick={handleRedBusRedirect}
                    className="glass-button" 
                    style={{ margin: 0, padding: '0.5rem 1.2rem', background: '#dc2626', fontSize: '0.9rem', fontWeight: 'bold' }}
                  >
                    Book on RedBus
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default TransportOptions;
