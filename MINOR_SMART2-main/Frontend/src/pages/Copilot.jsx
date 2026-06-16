import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TravelAgentChat from '../components/TravelAgentChat';

const Copilot = () => {
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
      style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}
    >
      <header className="dashboard-header" style={{ flexShrink: 0 }}>
        <div className="dashboard-header-left">
          <h2>AI Travel Copilot</h2>
          <p>Your personal ChatGPT-style travel assistant.</p>
        </div>
      </header>
      
      <div style={{ flexGrow: 1, position: 'relative', overflow: 'hidden', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
        <TravelAgentChat 
          inline={true}
          context={requestData?.destination ? `Destination: ${requestData.destination}, Duration: ${requestData.duration} days, Budget: ${requestData.budget}` : null} 
        />
      </div>
    </motion.div>
  );
};

export default Copilot;
