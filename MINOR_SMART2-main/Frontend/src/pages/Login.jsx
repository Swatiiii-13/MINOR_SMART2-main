import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [errorDetails, setErrorDetails] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorDetails(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data, response.data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
      if (error.response && error.response.data) {
        setErrorDetails(error.response.data);
      } else {
        setErrorDetails({ message: error.message });
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="glass-container auth-card">
        <h2>Welcome Back</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Sign in to plan your next adventure</p>
        
        {errorDetails && (
          <div style={{ padding: '1rem', background: 'rgba(255, 0, 0, 0.1)', border: '1px solid red', borderRadius: '8px', marginBottom: '1rem', color: '#ff4d4d', fontSize: '0.85rem', overflowX: 'auto', textAlign: 'left' }}>
            <strong>Error: {errorDetails.message}</strong>
            {errorDetails.stack && <pre style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', maxHeight: '200px', overflowY: 'auto', fontFamily: 'monospace' }}>{errorDetails.stack}</pre>}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="glass-input"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="you@example.com"
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="glass-input"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>
          <button type="submit" className="glass-button">Sign In</button>
        </form>

        <div className="auth-toggle">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
