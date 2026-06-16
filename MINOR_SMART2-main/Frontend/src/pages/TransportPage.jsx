import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TransportOptions from '../components/TransportOptions';

const TransportPage = () => {
  const [requestData, setRequestData] = useState(null);

  useEffect(() => {
    const savedRequest = sessionStorage.getItem('currentTripRequest');
    if (savedRequest) {
      setRequestData(JSON.parse(savedRequest));
    }
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-container"
    >
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <h2>Transport Routes</h2>
          <p>Intelligent routing and transport analytics.</p>
        </div>
      </header>

      {requestData ? (
        <TransportOptions 
          origin={requestData.originCity} 
          destination={requestData.destination} 
          travelers={requestData.travelers} 
        />
      ) : (
        <div className="glass-container empty-state">
          <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>✈️</span>
          <h3>No trip selected</h3>
          <p>Please plan a trip on the Dashboard to see optimized transport routes.</p>
        </div>
      )}
    </motion.div>
  );
};

export default TransportPage;
