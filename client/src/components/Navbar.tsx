import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, BookOpen, Layout, Info, Plus, ClipboardList, Shield } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <span className="logo-icon">S</span>
          SHIKSHA AI
        </Link>
        <div className="nav-links">
          <Link to="/courses"><BookOpen size={18} /> Courses</Link>
          <Link to="/about"><Info size={18} /> About</Link>
          {user ? (
            <>
              {(user.role === 'teacher' || user.role === 'admin') && (
                <>
                  <Link to="/admin"><Shield size={18} />Action</Link>
                  <Link to="/create-course"><Plus size={18} /> Course</Link>
                  <Link to="/create-test"><ClipboardList size={18} /> Test</Link>
                </>
              )}
              <Link to="/profile"><User size={18} /> Profile</Link>
              <Link to="/dashboard"><Layout size={18} /> Dashboard</Link>
              <button onClick={handleLogout} className="logout-btn">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary">Login</Link>
          )}
        </div>
      </div>
      <style>{`
        .navbar {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--glass-border);
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
        }
        .logo {
          font-size: 1.5rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
          letter-spacing: 1px;
        }
        .logo-icon {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          color: white;
          font-weight: 800;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .nav-links a {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          color: var(--text-muted);
          transition: var(--transition);
        }
        .nav-links a:hover {
          color: white;
        }
        .logout-btn {
          background: none;
          color: var(--text-muted);
        }
        .logout-btn:hover {
          color: #ef4444;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
