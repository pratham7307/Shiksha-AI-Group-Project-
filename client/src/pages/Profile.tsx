import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { User as UserIcon, Mail, Shield, Calendar, Book, Award, Clock } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/auth/profile');
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="loading">Loading Profile...</div>;
  if (!profile) return <div className="error">Could not load profile.</div>;

  const isParent = profile.role === 'parent';
  const displayAttempts = isParent && profile.child ? profile.child.testAttempts : profile.testAttempts;

  return (
    <div className="profile-container animate-fade">
      <header className="profile-header glass-card">
        <div className="profile-avatar">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <div className="profile-main-info">
          <h1>{profile.name}</h1>
          <div className="profile-badges">
            <span className="badge role-badge"><Shield size={14} /> {profile.role}</span>
            <span className="badge streak-badge"><Award size={14} /> {profile.streak} Day Streak</span>
          </div>
        </div>
      </header>

      <div className="profile-grid">
        <section className="profile-info-section glass-card">
          <h3><UserIcon size={20} /> Personal Information</h3>
          <div className="info-item">
            <Mail size={18} />
            <div>
              <label>Email Address</label>
              <p>{profile.email}</p>
            </div>
          </div>
          <div className="info-item">
            <Calendar size={18} />
            <div>
              <label>Member Since</label>
              <p>{new Date(profile.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>
        </section>

        <section className="profile-stats-section glass-card">
          <h3><Book size={20} /> My Learning</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>{profile.enrolledCourses?.length || 0}</h4>
              <span>My Courses</span>
            </div>
            {isParent && profile.child && (
              <div className="stat-card" style={{ borderColor: 'var(--accent)' }}>
                <h4 style={{ color: 'var(--accent)' }}>{profile.child.streak}</h4>
                <span>Child's Streak</span>
              </div>
            )}
            {!isParent && (
              <div className="stat-card">
                <h4>{profile.testAttempts?.length || 0}</h4>
                <span>Tests Taken</span>
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="profile-history glass-card">
        <h3><Clock size={20} /> {isParent ? `${profile.child?.name || 'Child'}'s Recent Tests` : 'My Recent Test Attempts'}</h3>
        {displayAttempts && displayAttempts.length > 0 ? (
          <div className="history-list">
            {displayAttempts.slice().reverse().map((attempt: any, index: number) => (
              <div key={index} className="history-item">
                <div className="history-info">
                  <strong>{attempt.testId?.title || 'Assessment'}</strong>
                  <span>{new Date(attempt.completedAt).toLocaleDateString()}</span>
                </div>
                <div className={`history-score ${attempt.score / attempt.totalQuestions >= 0.7 ? 'success' : 'warning'}`}>
                  {attempt.score} / {attempt.totalQuestions}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">
            {isParent ? 'No test records found for your child.' : 'No test attempts yet. Start learning!'}
          </p>
        )}
      </section>

      <style>{`
        .profile-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 4rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .profile-header {
          display: flex;
          align-items: center;
          gap: 2.5rem;
          padding: 3rem;
          border-left: 5px solid var(--primary);
        }
        .profile-avatar {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          font-weight: 800;
          color: white;
          box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
        }
        .profile-main-info h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        .profile-badges {
          display: flex;
          gap: 10px;
        }
        .badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: capitalize;
        }
        .role-badge { background: rgba(99, 102, 241, 0.1); color: var(--primary); border: 1px solid rgba(99, 102, 241, 0.2); }
        .streak-badge { background: rgba(245, 158, 11, 0.1); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.2); }

        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        @media (max-width: 768px) { .profile-grid { grid-template-columns: 1fr; } }

        .profile-info-section h3, .profile-stats-section h3, .profile-history h3 {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 2rem;
          color: var(--text-muted);
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          margin-bottom: 1.5rem;
        }
        .info-item label { display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 2px; }
        .info-item p { font-weight: 500; font-size: 1.05rem; }

        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .stat-card { background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 16px; text-align: center; border: 1px solid var(--glass-border); }
        .stat-card h4 { font-size: 2rem; color: var(--primary); margin-bottom: 5px; }
        .stat-card span { font-size: 0.85rem; color: var(--text-muted); }

        .history-list { display: flex; flex-direction: column; gap: 1rem; }
        .history-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.2rem 1.5rem;
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          border: 1px solid var(--glass-border);
          transition: var(--transition);
        }
        .history-item:hover { background: rgba(255,255,255,0.06); border-color: var(--primary); }
        .history-info strong { display: block; margin-bottom: 4px; }
        .history-info span { font-size: 0.85rem; color: var(--text-muted); }
        .history-score { font-weight: 700; font-size: 1.2rem; }
        .history-score.success { color: #10b981; }
        .history-score.warning { color: #f59e0b; }

        .empty-state { text-align: center; padding: 2rem; color: var(--text-muted); font-style: italic; }
      `}</style>
    </div>
  );
};

export default Profile;
