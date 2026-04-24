import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Brain, Target, Award } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="home">
      <section className="hero">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hero-content"
        >
          <div className="badge"><Sparkles size={14} /> AI-Powered Learning</div>
          <h1 className="gradient-text">Personalized Education for Every Student</h1>
          <p>Shiksha AI leverages advanced artificial intelligence to create unique learning paths, solve doubts instantly, and track your progress in real-time.</p>
          <div className="hero-btns">
            <Link to="/courses" className="btn-primary">Explore Courses <ArrowRight size={18} /></Link>
            <Link to="/about" className="btn-secondary">Learn More</Link>
          </div>
        </motion.div>
      </section>

      <section className="features">
        <div className="feature-grid">
          <div className="glass-card feature-card">
            <div className="icon-box"><Brain /></div>
            <h3>AI Doubt Solver</h3>
            <p>Get instant answers to your complex questions with our GPT-powered chatbot.</p>
          </div>
          <div className="glass-card feature-card">
            <div className="icon-box"><Target /></div>
            <h3>Smart Recommendations</h3>
            <p>Suggested content based on your weak areas identified from weekly tests.</p>
          </div>
          <div className="glass-card feature-card">
            <div className="icon-box"><Award /></div>
            <h3>Gamified Tracking</h3>
            <p>Maintain streaks, earn badges, and visualize your growth with deep analytics.</p>
          </div>
        </div>
      </section>

      <style>{`
        .home {
          padding-bottom: 5rem;
        }
        .hero {
          height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%);
        }
        .hero-content {
          max-width: 800px;
          padding: 0 2rem;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(99, 102, 241, 0.1);
          color: var(--primary);
          padding: 8px 16px;
          border-radius: 100px;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }
        h1 {
          font-size: 4rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }
        p {
          color: var(--text-muted);
          font-size: 1.2rem;
          margin-bottom: 2.5rem;
        }
        .hero-btns {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
        }
        .btn-secondary {
          padding: 12px 24px;
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          color: white;
          font-weight: 600;
        }
        .features {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        .feature-card {
          text-align: left;
          transition: var(--transition);
        }
        .feature-card:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-10px);
        }
        .icon-box {
          background: var(--primary);
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        h3 { margin-bottom: 1rem; font-size: 1.5rem; }
      `}</style>
    </div>
  );
};

export default Home;
