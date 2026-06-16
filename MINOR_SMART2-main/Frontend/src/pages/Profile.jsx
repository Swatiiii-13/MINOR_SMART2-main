import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-container"
      style={{ maxWidth: '800px' }}
    >
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <h2>Profile Settings</h2>
          <p>Manage your account and travel preferences.</p>
        </div>
      </header>

      <div className="glass-container" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: 'white' }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{user.name}</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Premium Member</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Mail size={20} color="var(--text-secondary)" />
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Email Address</div>
                <div>{user.email}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Shield size={20} color="var(--text-secondary)" />
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Account Security</div>
                <div>Password protected</div>
              </div>
            </div>
          </div>

          <button onClick={handleLogout} className="glass-button" style={{ marginTop: '3rem', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <LogOut size={18} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Sign Out
          </button>
        </div>
        
        <div style={{ flex: 1, minWidth: '300px', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          <h4 style={{ marginBottom: '1.5rem' }}>Travel Preferences</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Update your default preferences for the AI Copilot to generate better itineraries for you.
          </p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {['Luxury', 'Adventure', 'Culture', 'Foodie', 'Nature', 'Relaxation'].map(pref => (
              <span key={pref} style={{ padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '20px', fontSize: '0.875rem' }}>
                {pref}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
