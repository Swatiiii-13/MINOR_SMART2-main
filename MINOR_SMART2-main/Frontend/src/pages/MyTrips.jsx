import React from 'react';
import { motion } from 'framer-motion';
import TravelHistory from '../components/TravelHistory';

const MyTrips = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-container"
    >
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <h2>My Trips</h2>
          <p>Your saved itineraries and travel memories.</p>
        </div>
      </header>
      
      <div className="dashboard-main" style={{ marginTop: '2rem' }}>
        <TravelHistory />
      </div>
    </motion.div>
  );
};

export default MyTrips;
