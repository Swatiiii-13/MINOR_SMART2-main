import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Map, Compass, BedDouble, Plane, Wallet, ChevronRight } from 'lucide-react';
import UnsplashImage from './UnsplashImage';
import BudgetDashboard from './BudgetDashboard';
import TransportOptions from './TransportOptions';
import HotelCard from './HotelCard';
import ActivityImage from './ActivityImage';
import InteractivePlaceModal from './InteractivePlaceModal';
import api from '../services/api';

const ExpandableSection = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div style={{ marginBottom: '1rem', border: '1px solid var(--glass-border)', borderRadius: '16px', overflow: 'hidden', background: 'rgba(15,23,42,0.4)' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.2rem', fontWeight: '600' }}>
          <Icon color="#3b82f6" /> {title}
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TripExperience = ({ data, requestData }) => {
  const [saving, setSaving] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(false);
  
  // Interactive Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const openPlaceModal = (activityData, category, timeOfDay) => {
    setSelectedPlace({
      name: activityData.activity,
      cost: activityData.costEstimate,
      category,
      timeOfDay,
      ...activityData
    });
    setIsModalOpen(true);
  };

  const fetchHotels = async () => {
    if (hotels.length > 0 || loadingHotels) return;
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

  if (!data || data.success === false || !data.tripSummary) {
    return (
      <div className="glass-container empty-state" style={{ padding: '3rem', margin: '2rem auto', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontSize: '4.5rem', marginBottom: '1rem', display: 'block' }}>⚠️</span>
        <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#fca5a5' }}>Trip Feasibility Validation Issue</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', textAlign: 'center', lineHeight: 1.6 }}>
          {data?.message || "An unexpected error occurred during trip planning or the inputs provided are unrealistic."}
        </p>
        {data?.suggestion && (
          <div style={{ marginTop: '1.5rem', fontStyle: 'italic', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: '1.25rem', borderRadius: '12px', width: '100%', boxSizing: 'border-box' }}>
            <span style={{ fontWeight: 'bold', color: '#fbbf24', display: 'block', marginBottom: '0.25rem' }}>💡 Suggestion & Corrections:</span>
            <span style={{ color: '#e2e8f0', fontSize: '1.05rem', lineHeight: 1.5 }}>{data.suggestion}</span>
          </div>
        )}
      </div>
    );
  }

  const { tripSummary, itinerary } = data;

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* 1. Cinematic Trip Overview Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ position: 'relative', height: '50vh', minHeight: '400px', borderRadius: '24px', overflow: 'hidden', marginBottom: '3rem', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
      >
        <UnsplashImage 
          query={`${tripSummary.destination} beautiful scenery`}
          fallbackSrc="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
          alt="Destination Banner" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(15,23,42,1) 0%, rgba(15,23,42,0) 100%)' }} />
        
        <div style={{ position: 'absolute', bottom: '3rem', left: '3rem', right: '3rem' }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div style={{ display: 'inline-block', background: 'rgba(59,130,246,0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(59,130,246,0.4)', color: '#93c5fd', padding: '0.25rem 1rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '600', marginBottom: '1rem', marginRight: '0.5rem' }}>
              ⭐ AI Score: 96/100
            </div>
            <div style={{ display: 'inline-block', background: 'rgba(16,185,129,0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(16,185,129,0.4)', color: '#a7f3d0', padding: '0.25rem 1rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '600', marginBottom: '1rem' }}>
              ☀️ Recommended Season
            </div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '0.5rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              Your {tripSummary.totalDays}-Day <br/>{tripSummary.destination} Escape
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#cbd5e1', maxWidth: '600px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {tripSummary.generalSafetyTip || "Safe travels and great vibes."}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* 2. Modular Expandable Sections */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        
        <ExpandableSection title="Day-by-Day Immersive Itinerary" icon={Compass} defaultOpen={true}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingTop: '1rem' }}>
            {itinerary.map((dayData, index) => (
              <div key={index} style={{ borderLeft: '2px solid rgba(59,130,246,0.3)', paddingLeft: '2rem', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-11px', top: '0', width: '20px', height: '20px', borderRadius: '50%', background: '#3b82f6', border: '4px solid #0f172a' }} />
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.5rem', color: '#3b82f6', margin: '0 0 0.5rem 0' }}>Day {dayData.day}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', margin: 0 }}>{dayData.theme}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {/* Morning */}
                  <motion.div whileHover={{ y: -5 }} onClick={() => openPlaceModal(dayData.morning, "Morning Experience", "Morning")} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>
                    <ActivityImage activityName={dayData.morning.activity} imageKeyword={dayData.morning.imageKeyword} destination={tripSummary.destination} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                    <div style={{ padding: '1.5rem' }}>
                      <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#fcd34d', letterSpacing: '1px', marginBottom: '0.5rem', fontWeight: 'bold' }}>Morning</div>
                      <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.5 }}>{dayData.morning.activity}</p>
                      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#10b981', fontWeight: '600' }}>₹{Number(dayData.morning.costEstimate).toLocaleString('en-IN')}</span>
                        <ChevronRight size={18} color="var(--text-secondary)" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Afternoon */}
                  <motion.div whileHover={{ y: -5 }} onClick={() => openPlaceModal(dayData.afternoon, "Afternoon Experience", "Afternoon")} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>
                    <ActivityImage activityName={dayData.afternoon.activity} imageKeyword={dayData.afternoon.imageKeyword} destination={tripSummary.destination} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                    <div style={{ padding: '1.5rem' }}>
                      <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#f97316', letterSpacing: '1px', marginBottom: '0.5rem', fontWeight: 'bold' }}>Afternoon</div>
                      <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.5 }}>{dayData.afternoon.activity}</p>
                      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#10b981', fontWeight: '600' }}>₹{Number(dayData.afternoon.costEstimate).toLocaleString('en-IN')}</span>
                        <ChevronRight size={18} color="var(--text-secondary)" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Evening */}
                  <motion.div whileHover={{ y: -5 }} onClick={() => openPlaceModal(dayData.evening, "Evening Experience", "Evening")} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>
                    <ActivityImage activityName={dayData.evening.activity} imageKeyword={dayData.evening.imageKeyword} destination={tripSummary.destination} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                    <div style={{ padding: '1.5rem' }}>
                      <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#a855f7', letterSpacing: '1px', marginBottom: '0.5rem', fontWeight: 'bold' }}>Evening</div>
                      <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.5 }}>{dayData.evening.activity}</p>
                      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#10b981', fontWeight: '600' }}>₹{Number(dayData.evening.costEstimate).toLocaleString('en-IN')}</span>
                        <ChevronRight size={18} color="var(--text-secondary)" />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </ExpandableSection>

        <div onClick={fetchHotels}>
          <ExpandableSection title="Stays & Accommodations" icon={BedDouble}>
            {loadingHotels ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem', paddingTop: '1rem' }}>
                {[1, 2, 3].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                    style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid var(--glass-border)', overflow: 'hidden', height: '350px' }}
                  >
                    <div style={{ height: '200px', background: 'rgba(255,255,255,0.05)' }}></div>
                    <div style={{ padding: '1.5rem' }}>
                      <div style={{ height: '24px', width: '70%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '1rem' }}></div>
                      <div style={{ height: '16px', width: '40%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '0.5rem' }}></div>
                      <div style={{ height: '16px', width: '90%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : hotels.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem', paddingTop: '1rem' }}>
                {hotels.map((hotel, idx) => (
                  <HotelCard key={idx} hotel={hotel} destination={tripSummary.destination} />
                ))}
              </div>
            ) : (
              <div style={{ padding: '3rem 2rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'all 0.3s' }} onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'} onMouseOut={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}>
                <BedDouble size={48} color="#3b82f6" style={{ marginBottom: '1rem', opacity: 0.8 }} />
                <h4 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>Find curated stays in {tripSummary.destination}</h4>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Click here to discover AI-recommended boutique hotels and premium accommodations perfectly matched to your budget.</p>
              </div>
            )}
          </ExpandableSection>
        </div>

        <ExpandableSection title="Transport & Routing" icon={Plane}>
          <div style={{ paddingTop: '1rem' }}>
            <TransportOptions destination={tripSummary.destination} origin={requestData?.originCity} travelers={requestData?.travelers || 1} />
          </div>
        </ExpandableSection>

        <ExpandableSection title="Smart Budget Insights" icon={Wallet}>
          <div style={{ paddingTop: '1rem' }}>
            <BudgetDashboard itineraryData={data} tripRequestData={requestData} />
          </div>
        </ExpandableSection>

      </motion.div>

      {/* Save Action */}
      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <button 
          onClick={handleSaveTrip} 
          disabled={saving}
          className="glass-button"
          style={{ width: 'auto', padding: '1rem 3rem', fontSize: '1.1rem', background: 'var(--primary-color)' }}
        >
          {saving ? 'Saving to Memories...' : '💾 Save Trip to My Trips'}
        </button>
      </div>

      {/* Interactive Place Detail Modal */}
      {selectedPlace && (
        <InteractivePlaceModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          placeData={selectedPlace}
          destination={tripSummary.destination}
        />
      )}
    </div>
  );
};

export default TripExperience;
