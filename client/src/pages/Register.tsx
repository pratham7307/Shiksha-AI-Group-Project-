import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { motion } from 'framer-motion';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const { login } = useAuth();
  const navigate = useNavigate();
//hello
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/api/auth/register', { name, email, password, role });
      login(data);
      navigate('/dashboard');
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card auth-card"
      >
        <h2>Create Account</h2>
        <p>Join Shiksha AI to start your personalized learning.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full select-input">
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
            </select>
          </div>
          <button type="submit" className="btn-primary w-full">Register</button>
        </form>
        <p className="auth-footer">Already have an account? <Link to="/login">Login</Link></p>
      </motion.div>

      <style>{`
        .auth-page { height: 90vh; display: flex; align-items: center; justify-content: center; }
        .auth-card { width: 100%; max-width: 450px; padding: 3rem; text-align: center; }
        .input-group { text-align: left; margin-bottom: 1.2rem; }
        .input-group label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-muted); }
        .input-group input, .select-input { width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 8px; color: white; }
        .select-input { background: #1e293b; color: white; }
        .w-full { width: 100%; margin-top: 1rem; }
        .auth-footer { margin-top: 1.5rem !important; }
        .auth-footer a { color: var(--primary); font-weight: 600; }
      `}</style>
    </div>
  );
};

export default Register;
