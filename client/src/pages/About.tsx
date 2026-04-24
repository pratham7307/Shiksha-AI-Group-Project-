import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Zap, Globe } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-text"
        >
          Democratizing Quality Education through AI
        </motion.h1>
        <p>Shiksha AI is a state-of-the-art digital learning platform inspired by the national DIKSHA mission, enhanced with cutting-edge artificial intelligence to provide truly personalized education.</p>
      </section>

      <div className="mission-grid">
        <div className="glass-card">
          <Shield size={32} color="#6366f1" />
          <h3>Our Mission</h3>
          <p>To bridge the gap between traditional learning and modern technology, ensuring every student has access to an AI-powered personal tutor.</p>
        </div>
        <div className="glass-card">
          <Users size={32} color="#ec4899" />
          <h3>Inclusive Learning</h3>
          <p>Designed for diverse learning styles, our platform adapts to each student's pace, difficulty level, and subject preference.</p>
        </div>
        <div className="glass-card">
          <Zap size={32} color="#8b5cf6" />
          <h3>AI-First Approach</h3>
          <p>From instant doubt resolution to predictive performance analytics, AI is at the heart of everything we do.</p>
        </div>
        <div className="glass-card">
          <Globe size={32} color="#10b981" />
          <h3>Global Standards</h3>
          <p>Built using scalable full-stack architecture and following the best pedagogical practices from around the world.</p>
        </div>
      </div>

      <style>{`
        .about-page { max-width: 1000px; margin: 0 auto; padding: 6rem 2rem; }
        .about-hero { text-align: center; margin-bottom: 5rem; }
        .about-hero h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 1.5rem; line-height: 1.2; }
        .about-hero p { font-size: 1.2rem; color: var(--text-muted); max-width: 800px; margin: 0 auto; }
        
        .mission-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 2rem; }
        .mission-grid .glass-card { padding: 3rem; }
        .mission-grid h3 { font-size: 1.5rem; margin: 1.5rem 0 1rem 0; }
        .mission-grid p { color: var(--text-muted); line-height: 1.7; }
      `}</style>
    </div>
  );
};

export default About;
