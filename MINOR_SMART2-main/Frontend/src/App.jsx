import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import TransportPage from './pages/TransportPage';
import StaysPage from './pages/StaysPage';
import MyTrips from './pages/MyTrips';
import Copilot from './pages/Copilot';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import Navbar from './components/Navbar';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div className="loading-spinner">Loading...</div>;
  
  return user ? (
    <>
      <Navbar />
      <div className="page-content-wrapper">
        {children}
      </div>
    </>
  ) : <Navigate to="/login" />;
};

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/explore" element={<PrivateRoute><Explore /></PrivateRoute>} />
        <Route path="/transport" element={<PrivateRoute><TransportPage /></PrivateRoute>} />
        <Route path="/stays" element={<PrivateRoute><StaysPage /></PrivateRoute>} />
        <Route path="/my-trips" element={<PrivateRoute><MyTrips /></PrivateRoute>} />
        <Route path="/copilot" element={<PrivateRoute><Copilot /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
