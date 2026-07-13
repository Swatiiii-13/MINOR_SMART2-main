import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Compass, Plane, Hotel, Map, MessageSquare, User, LogOut, Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <Map size={18} /> },
  { path: '/explore', label: 'Explore', icon: <Compass size={18} /> },
  { path: '/transport', label: 'Transport', icon: <Plane size={18} /> },
  { path: '/stays', label: 'Stays', icon: <Hotel size={18} /> },
  { path: '/my-trips', label: 'My Trips', icon: <Map size={18} /> },
  { path: '/copilot', label: 'AI Copilot', icon: <Sparkles size={18} />, isPremium: true },
];

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="premium-navbar"
      >
        <div className="navbar-container">
          <Link to="/dashboard" className="navbar-brand">
            <span className="brand-icon">✨</span>
            <span className="brand-text">RATI</span>
          </Link>

          <div className="navbar-links desktop-only">
            {navItems.map((item) => (
              <NavLink 
                key={item.path} 
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''} ${item.isPremium ? 'premium-link' : ''}`}
              >
                {({ isActive }) => (
                  <>
                    {item.icon}
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div 
                        layoutId="nav-indicator" 
                        className="nav-indicator"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="navbar-actions desktop-only">
            <Link to="/profile" className="profile-btn">
              <User size={18} />
              <span>{user?.name?.split(' ')[0] || 'Profile'}</span>
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={18} />
            </button>
          </div>

          <button 
            className="mobile-menu-btn mobile-only"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mobile-menu"
          >
            <div className="mobile-menu-content">
              {navItems.map((item) => (
                <NavLink 
                  key={item.path} 
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''} ${item.isPremium ? 'premium-link' : ''}`}
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
              <div className="mobile-menu-divider" />
              <Link to="/profile" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                <User size={18} /> Profile
              </Link>
              <button onClick={handleLogout} className="mobile-nav-link text-red">
                <LogOut size={18} /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
