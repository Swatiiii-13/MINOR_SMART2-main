import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { X, MapPin, Navigation, Info, Shield, Coffee, Camera, Sun, Users, Star, Sparkles } from 'lucide-react';
import UnsplashImage from './UnsplashImage';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const InteractivePlaceModal = ({ isOpen, onClose, placeData, destination }) => {
  const [coords, setCoords] = useState(null);
  const [loadingCoords, setLoadingCoords] = useState(true);

  const placeName = placeData?.title || placeData?.name || placeData?.activity || "Unknown Place";
  const category = placeData?.category || "Attraction";
  const costEstimate = placeData?.costEstimate || placeData?.estimatedSpend || 0;
  const timeOfDay = placeData?.timeOfDay;

  useEffect(() => {
    if (isOpen && placeName && destination) {
      setLoadingCoords(true);
      setCoords(null);
      
      // Clean up the name for geocoding
      const cleanName = placeName.split(',')[0].replace(/visit |explore |tour /gi, '');
      const query = encodeURIComponent(`${cleanName} ${destination}`);
      
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          } else {
            // Fallback to destination
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}`)
              .then(res => res.json())
              .then(d => {
                if (d && d.length > 0) {
                  setCoords([parseFloat(d[0].lat), parseFloat(d[0].lon)]);
                }
              });
          }
        })
        .finally(() => setLoadingCoords(false));
    }
  }, [isOpen, placeName, destination]);

  if (!isOpen || !placeData) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(10px)',
          zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem'
        }}
        onClick={onClose}
      >
        <motion.div 
          initial={{ y: 50, scale: 0.95 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: 50, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          style={{
            background: 'var(--bg-dark)', width: '100%', maxWidth: '1100px', height: '85vh',
            borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--glass-border)',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header Image */}
          <div style={{ position: 'relative', height: '30vh', minHeight: '250px', flexShrink: 0 }}>
            <UnsplashImage 
              query={placeData.imageKeyword || `${placeName} ${destination}`} 
              fallbackSrc="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(15,23,42,1) 100%)' }} />
            
            <button 
              onClick={onClose}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', zIndex: 10 }}
            >
              <X size={20} />
            </button>

            <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem' }}>
              <div style={{ display: 'inline-block', background: 'rgba(59, 130, 246, 0.3)', backdropFilter: 'blur(10px)', border: '1px solid rgba(59, 130, 246, 0.5)', color: '#93c5fd', padding: '0.25rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                <Sparkles size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} />
                {category} • {timeOfDay || "Anytime"}
              </div>
              <h2 style={{ fontSize: '2.5rem', margin: 0, fontWeight: '800', lineHeight: 1.1, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{placeName}</h2>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', color: '#cbd5e1' }}>
                <MapPin size={16} /> {destination}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Left Content Column */}
            <div style={{ flex: '1 1 60%', padding: '2rem', overflowY: 'auto', borderRight: '1px solid var(--glass-border)' }}>
              
              {/* Core Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '4px' }}>Cost</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }}>{costEstimate ? `₹${Number(costEstimate).toLocaleString('en-IN')}` : 'Free'}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '4px' }}>Vibe</div>
                  <div style={{ fontSize: '1rem', fontWeight: '600' }}>{placeData.vibe || 'Authentic'}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={12}/> Crowd</div>
                  <div style={{ fontSize: '1rem', fontWeight: '600' }}>{placeData.crowdLevel || 'Moderate'}</div>
                </div>
              </div>

              {/* Story / Description */}
              {placeData.story && (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'white' }}>Why this place is special</h3>
                  <p style={{ color: '#cbd5e1', lineHeight: 1.6, fontSize: '1.05rem' }}>{placeData.story}</p>
                </div>
              )}

              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                <Info size={20} color="#3b82f6" /> AI Travel Insights
              </h3>
              
              <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                {(placeData.localInsight || placeData.bestTimeToVisit) && (
                  <div style={{ background: 'rgba(59, 130, 246, 0.05)', borderLeft: '3px solid #3b82f6', padding: '1rem', borderRadius: '0 8px 8px 0' }}>
                    <div style={{ fontWeight: 'bold', color: '#93c5fd', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}><Info size={16}/> Local Insight</div>
                    <div style={{ color: '#e2e8f0', fontSize: '0.95rem', lineHeight: 1.5 }}>
                      {placeData.localInsight || 'Ask locals for the best spots around this area.'} {placeData.bestTimeToVisit && `Best time: ${placeData.bestTimeToVisit}`}
                    </div>
                  </div>
                )}
                
                {(placeData.safetyTip || placeData.weatherAdvice) && (
                  <div style={{ background: 'rgba(16, 185, 129, 0.05)', borderLeft: '3px solid #10b981', padding: '1rem', borderRadius: '0 8px 8px 0' }}>
                    <div style={{ fontWeight: 'bold', color: '#6ee7b7', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}><Shield size={16}/> Safety & Weather</div>
                    <div style={{ color: '#e2e8f0', fontSize: '0.95rem', lineHeight: 1.5 }}>
                      {placeData.safetyTip || 'Very safe area, but crowded during peak hours.'} {placeData.weatherAdvice}
                    </div>
                  </div>
                )}

                {(placeData.hiddenGem || placeData.foodRecommendation) && (
                  <div style={{ background: 'rgba(234, 179, 8, 0.05)', borderLeft: '3px solid #eab308', padding: '1rem', borderRadius: '0 8px 8px 0' }}>
                    <div style={{ fontWeight: 'bold', color: '#fde047', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}><Coffee size={16}/> Food & Hidden Gems</div>
                    <div style={{ color: '#e2e8f0', fontSize: '0.95rem', lineHeight: 1.5 }}>
                      {placeData.foodRecommendation || 'Try the local street food stalls nearby.'} {placeData.hiddenGem && `Hidden Gem: ${placeData.hiddenGem}`}
                    </div>
                  </div>
                )}

                {placeData.photographyTip && (
                  <div style={{ background: 'rgba(168, 85, 247, 0.05)', borderLeft: '3px solid #a855f7', padding: '1rem', borderRadius: '0 8px 8px 0' }}>
                    <div style={{ fontWeight: 'bold', color: '#d8b4fe', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}><Camera size={16}/> Photography Tip</div>
                    <div style={{ color: '#e2e8f0', fontSize: '0.95rem', lineHeight: 1.5 }}>
                      {placeData.photographyTip}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Right Map Column */}
            <div style={{ flex: '1 1 40%', background: '#0f172a', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Navigation size={18} /> Location Map
                </h4>
              </div>
              <div style={{ flex: 1, position: 'relative' }}>
                {loadingCoords ? (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                    <span className="loading-dots">Locating</span>
                  </div>
                ) : coords ? (
                  <MapContainer center={coords} zoom={15} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
                    <Marker position={coords}>
                      <Popup>
                        <strong style={{ color: 'black' }}>{placeName}</strong>
                      </Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                    Map not available.
                  </div>
                )}
                
                {/* Floating Map Actions */}
                {coords && (
                  <div style={{ position: 'absolute', bottom: '1.5rem', left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 1000 }}>
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${coords[0]},${coords[1]}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="glass-button"
                      style={{ background: '#3b82f6', width: 'auto', margin: 0, padding: '0.75rem 2rem', borderRadius: '30px', boxShadow: '0 4px 15px rgba(59,130,246,0.4)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}
                    >
                      <Navigation size={18} /> Get Directions
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InteractivePlaceModal;
