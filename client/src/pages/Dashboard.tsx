import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Flame, Trophy, TrendingUp, BookOpen, Calendar, CheckCircle, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [recs, setRecs] = useState([]);
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: profileData } = await API.get('/api/auth/profile');
      setProfile(profileData);
      const { data: recData } = await API.get('/api/ai/recommend');
      setRecs(recData);
      const { data: testData } = await API.get('/api/tests');
      setTests(testData);
    };
    fetchData();
  }, []);

  const [childEmail, setChildEmail] = useState('');
  const [linking, setLinking] = useState(false);

  const handleLinkChild = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinking(true);
    try {
      await API.post('/api/auth/link-child', { childEmail });
      const { data } = await API.get('/api/auth/profile');
      setProfile(data);
      alert('Child linked successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to link child');
    } finally {
      setLinking(false);
    }
  };

  if (!profile) return <div className="loading">Loading Dashboard...</div>;

  if (user?.role === 'admin') {
    return (
      <div className="dashboard animate-fade">
        <header className="dash-header">
          <h1>Admin Dashboard 🛠️</h1>
          <p>You have full access to platform management and user oversight.</p>
        </header>
        
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', marginTop: '2rem' }}>
          <Shield size={64} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
          <h2>Welcome, Administrator</h2>
          <p style={{ margin: '1rem 0 2rem 0', color: 'var(--text-muted)', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            From here, you can manage users, approve new students, and oversee all courses and tests on the Shiksha AI platform.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/admin" className="btn-primary" style={{ padding: '1rem 2rem' }}>Open User Management</Link>
            <Link to="/profile" className="btn-secondary" style={{ padding: '1rem 2rem' }}>My Account</Link>
          </div>
        </div>
      </div>
    );
  }

  if (user?.role === 'parent') {
    return (
      <div className="dashboard">
        <header className="dash-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h1>Parent Dashboard 👋</h1>
              <p>Monitoring progress for your child.</p>
            </div>
            <Link to="/profile" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>My Profile</Link>
          </div>
        </header>

        {!profile.child ? (
          <div className="glass-card link-child-section animate-fade" style={{ padding: '3rem', textAlign: 'center' }}>
            <h2>Link Your Child's Account</h2>
            <p style={{ margin: '1rem 0 2rem 0', color: 'var(--text-muted)' }}>Enter your child's student account email to start monitoring their progress.</p>
            <form onSubmit={handleLinkChild} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', maxWidth: '500px', margin: '0 auto' }}>
              <input 
                type="email" 
                placeholder="Child's Email Address" 
                value={childEmail}
                onChange={(e) => setChildEmail(e.target.value)}
                required
                style={{ flex: 1, padding: '0.8rem 1.2rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
              />
              <button type="submit" className="btn-primary" disabled={linking}>
                {linking ? 'Linking...' : 'Link Account'}
              </button>
            </form>
          </div>
        ) : (
          <div className="parent-child-view animate-fade">
            <div className="stats-grid">
              <div className="glass-card stat-card">
                <div className="stat-icon streak"><Flame /></div>
                <div className="stat-info">
                  <h3>{profile.child.streak} Days</h3>
                  <p>{profile.child.name}'s Streak</p>
                </div>
              </div>
              <div className="glass-card stat-card">
                <div className="stat-icon courses"><BookOpen /></div>
                <div className="stat-info">
                  <h3>{profile.child.progress?.length || 0}</h3>
                  <p>Courses Started</p>
                </div>
              </div>
              <div className="glass-card stat-card">
                <div className="stat-icon points"><Trophy /></div>
                <div className="stat-info">
                  <h3>{profile.child.testAttempts?.length || 0}</h3>
                  <p>Tests Completed</p>
                </div>
              </div>
            </div>

            <section className="active-courses" style={{ marginTop: '3rem' }}>
              <h2><BookOpen size={20} /> {profile.child.name}'s Course Progress</h2>
              <div className="progress-list" style={{ marginTop: '1.5rem', display: 'grid', gap: '1.5rem' }}>
                {profile.child.progress?.map((p: any, idx: number) => (
                  <div key={idx} className="glass-card progress-item" style={{ padding: '1.5rem', display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <img src={p.courseId?.thumbnail} alt="" style={{ width: '80px', height: '50px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ marginBottom: '8px' }}>{p.courseId?.title}</h4>
                      <div className="progress-bar-container" style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: `${p.completedVideos?.length > 0 ? (p.completedVideos.length / 5) * 100 : 5}%`, // Assuming 5 videos per course for demo
                            height: '100%', 
                            background: 'var(--primary)',
                            boxShadow: '0 0 10px var(--primary)'
                          }}
                        ></div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.completedVideos?.length || 0} Lessons Done</span>
                    </div>
                  </div>
                ))}
                {(!profile.child.progress || profile.child.progress.length === 0) && (
                  <p className="section-desc">No courses started yet.</p>
                )}
              </div>

              <h2 style={{ marginTop: '4rem' }}><TrendingUp size={20} /> {profile.child.name}'s Assessment Scores</h2>
              <div className="test-list" style={{ marginTop: '1.5rem' }}>
                {profile.child.testAttempts?.slice().reverse().map((attempt: any, index: number) => (
                  <div key={index} className="glass-card test-item">
                    <div className="test-info">
                      <h4>{attempt.testId?.title || 'Assessment'}</h4>
                      <span>Score: {attempt.score}/{attempt.totalQuestions} • {new Date(attempt.completedAt).toLocaleDateString()}</span>
                    </div>
                    <div className={`status-tag ${attempt.score / attempt.totalQuestions >= 0.7 ? 'success' : ''}`}>
                      {Math.round((attempt.score / attempt.totalQuestions) * 100)}% Grade
                    </div>
                  </div>
                ))}
                {(!profile.child.testAttempts || profile.child.testAttempts.length === 0) && (
                  <p className="section-desc">No test attempts recorded yet.</p>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1>Welcome back, {user?.name}! 👋</h1>
            <p>Your personalized learning summary for today.</p>
          </div>
          <Link to="/profile" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>View Full Profile</Link>
        </div>
      </header>

      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon streak"><Flame /></div>
          <div className="stat-info">
            <h3>{profile.streak} Days</h3>
            <p>Learning Streak</p>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon courses"><BookOpen /></div>
          <div className="stat-info">
            <h3>{profile.progress.length}</h3>
            <p>Courses in Progress</p>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon points"><Trophy /></div>
          <div className="stat-info">
            <h3>1,250</h3>
            <p>Shiksha Points</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <section className="recommendations">
          <h2><TrendingUp size={20} /> Recommended for You</h2>
          <p className="section-desc">Based on your weak areas and interests</p>
          <div className="recs-grid">
            {recs.map((course: any) => (
              <Link to={`/course/${course._id}`} key={course._id} className="glass-card rec-card">
                <img src={course.thumbnail} alt={course.title} />
                <div className="rec-info">
                  <h4>{course.title}</h4>
                  <span>{course.subject}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="active-courses">
          <h2>My Learning Journey</h2>
          {profile.progress.length === 0 ? (
             <div className="empty-state glass-card">
               <p>No courses started yet. Start learning now!</p>
               <Link to="/courses" className="btn-primary">Browse Courses</Link>
             </div>
          ) : (
            <div className="progress-list">
              {/* Progress items would go here */}
            </div>
          )}

          <h2 style={{ marginTop: '4rem' }}><Calendar size={20} /> Upcoming Assessments</h2>
          <div className="test-list">
            {tests.length === 0 ? (
              <p className="section-desc">No tests scheduled at the moment.</p>
            ) : (
              tests.map((test: any) => {
                const attempt = profile.testAttempts?.find((a: any) => (a.testId?._id || a.testId) === test._id);
                return (
                  <div key={test._id} className="glass-card test-item">
                    <div className="test-info">
                      <h4>{test.title}</h4>
                      <span>{test.subject} • {test.duration} mins</span>
                    </div>
                    {attempt ? (
                      <div className="status-tag success">
                        Finished: {attempt.score}/{attempt.totalQuestions}
                      </div>
                    ) : (
                      <Link to={`/test/${test._id}`} className="btn-start">Take Test</Link>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      <style>{`
        .dashboard { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem; }
        .dash-header { margin-bottom: 3rem; }
        .dash-header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .dash-header p { color: var(--text-muted); }

        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-bottom: 4rem; }
        .stat-card { display: flex; align-items: center; gap: 20px; }
        .stat-icon { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; }
        .stat-icon.streak { background: #f97316; box-shadow: 0 0 20px rgba(249, 115, 22, 0.3); }
        .stat-icon.courses { background: #06b6d4; box-shadow: 0 0 20px rgba(6, 182, 212, 0.3); }
        .stat-icon.points { background: #eab308; box-shadow: 0 0 20px rgba(234, 179, 8, 0.3); }
        .stat-info h3 { font-size: 1.5rem; margin-bottom: 4px; }
        .stat-info p { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }

        .dashboard-sections { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; }
        h2 { display: flex; align-items: center; gap: 10px; font-size: 1.5rem; margin-bottom: 0.5rem; }
        .section-desc { color: var(--text-muted); margin-bottom: 2rem; font-size: 0.9rem; }

        .recs-grid { display: grid; gap: 1.5rem; }
        .rec-card { display: flex; gap: 15px; padding: 12px; transition: var(--transition); }
        .rec-card:hover { background: rgba(255,255,255,0.08); }
        .rec-card img { width: 80px; height: 60px; border-radius: 8px; object-fit: cover; }
        .rec-info h4 { font-size: 1rem; margin-bottom: 4px; }
        .rec-info span { font-size: 0.75rem; color: var(--primary); font-weight: 700; text-transform: uppercase; }

        .empty-state { text-align: center; padding: 3rem; }
        .empty-state p { margin-bottom: 2rem; color: var(--text-muted); }

        .test-list { display: grid; gap: 1rem; margin-top: 1.5rem; }
        .test-item { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; }
        .test-info h4 { margin-bottom: 4px; }
        .test-info span { font-size: 0.8rem; color: var(--text-muted); }
        .btn-start { background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 8px 16px; border-radius: 8px; font-weight: 600; border: 1px solid rgba(16, 185, 129, 0.2); }
        .btn-start:hover { background: #10b981; color: white; }
        .status-tag { font-size: 0.8rem; color: var(--accent); background: rgba(139, 92, 246, 0.1); padding: 4px 10px; border-radius: 4px; border: 1px solid rgba(139, 92, 246, 0.2); }
        .status-tag.success { color: #10b981; background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.2); }
      `}</style>
    </div>
  );
};

export default Dashboard;
