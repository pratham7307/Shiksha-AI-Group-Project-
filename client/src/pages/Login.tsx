import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/api/auth/login', { email, password });
      login(data);
      navigate('/dashboard');
    } catch (error) {
      alert('Invalid Credentials');
    }
  };

  return (
    <div className="auth-page">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card auth-card"
      >
        <h2>Welcome Back</h2>
        <p>Login to continue your learning journey.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary w-full">Login</button>
        </form>
        <p className="auth-footer">Don't have an account? <Link to="/register">Register</Link></p>
      </motion.div>

      <style>{`
        .auth-page {
          height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .auth-card {
          width: 100%;
          max-width: 400px;
          padding: 3rem;
          text-align: center;
        }
        h2 { margin-bottom: 0.5rem; font-size: 2rem; }
        .auth-card p { margin-bottom: 2rem; font-size: 0.9rem; }
        .input-group {
          text-align: left;
          margin-bottom: 1.5rem;
        }
        .input-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        .input-group input {
          width: 100%;
          padding: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          color: white;
        }
        .w-full { width: 100%; margin-top: 1rem; }
        .auth-footer { margin-top: 1.5rem !important; }
        .auth-footer a { color: var(--primary); font-weight: 600; }
      `}</style>
    </div>
  );
};

export default Login;
