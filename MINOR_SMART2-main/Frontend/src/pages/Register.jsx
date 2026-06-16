import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/register', { name, email, password });
      login(response.data, response.data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed', error);
      alert('Registration failed. Try a different email.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="glass-container auth-card">
        <h2>Create Account</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Join to unlock smart travel planning</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              className="glass-input"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="John Doe"
              required 
            />
          </div>
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
          <button type="submit" className="glass-button">Sign Up</button>
        </form>

        <div className="auth-toggle">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
