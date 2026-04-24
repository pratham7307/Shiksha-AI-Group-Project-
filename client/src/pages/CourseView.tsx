import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import { MessageSquare, Send, ThumbsUp, BrainCircuit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CourseView: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeVideo, setActiveVideo] = useState(0);
  const [doubts, setDoubts] = useState([]);
  const [newDoubt, setNewDoubt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: courseData } = await API.get(`/courses/${id}`);
      setCourse(courseData);
      
      const { data: profile } = await API.get('/auth/profile');
      setIsEnrolled(profile.enrolledCourses?.some((courseId: string) => courseId.toString() === id) || user?.role !== 'student');

      const { data: doubtData } = await API.get(`/doubts/${courseData.videos[0]._id}`);
      setDoubts(doubtData);
    };
    fetchData();
  }, [id, user]);

  const handleEnroll = async () => {
    try {
      await API.post(`/courses/enroll/${id}`);
      setIsEnrolled(true);
      alert('Successfully Enrolled!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Enrollment failed');
    }
  };

  const handlePostDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('Please login to post doubts');
    const { data } = await API.post('/doubts', {
      videoId: course.videos[activeVideo]._id,
      question: newDoubt
    });
    setDoubts([data, ...doubts]);
    setNewDoubt('');
  };

  const askAi = async () => {
    if (!newDoubt) return;
    setLoadingAi(true);
    try {
      const { data } = await API.post('/ai/chat', {
        question: newDoubt,
        context: `Course: ${course.title}, Topic: ${course.videos[activeVideo].topic}`
      });
      setAiResponse(data.response);
    } catch (error) {
      console.error(error);
    }
    setLoadingAi(false);
  };

  if (!course) return <div className="loading">Loading Course...</div>;

  return (
    <div className="course-view">
      <div className="main-content">
        <div className="video-section">
          {!isEnrolled ? (
            <div className="enroll-overlay">
              <div className="overlay-content">
                <h2>Ready to Start Learning?</h2>
                <p>Enroll in this course to access all video lessons, assessments, and AI doubt resolution.</p>
                <button className="btn-primary" onClick={handleEnroll}>Enroll Now</button>
              </div>
            </div>
          ) : (
            <iframe 
              src={course.videos[activeVideo].videoUrl} 
              title={course.videos[activeVideo].title}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          )}
          <div className="video-info">
            <h1>{course.videos[activeVideo].title}</h1>
            <p>{course.videos[activeVideo].description}</p>
          </div>
        </div>

        <div className="interaction-section">
          <div className="tabs">
            <button className="active">Doubts & Discussions</button>
            <button>Notes</button>
            <button>Resources</button>
          </div>

          <div className="doubt-input glass-card">
            <textarea 
              placeholder="Ask a doubt or discuss..." 
              value={newDoubt}
              onChange={(e) => setNewDoubt(e.target.value)}
            />
            <div className="doubt-actions">
              <button className="btn-ai" onClick={askAi} disabled={loadingAi}>
                <BrainCircuit size={18} /> {loadingAi ? 'Thinking...' : 'Ask AI'}
              </button>
              <button className="btn-primary" onClick={handlePostDoubt}>
                <Send size={18} /> Post
              </button>
            </div>
          </div>

          {aiResponse && (
            <div className="ai-response glass-card animate-fade">
              <div className="ai-header"><BrainCircuit size={16} /> AI TEACHER</div>
              <p>{aiResponse}</p>
            </div>
          )}

          <div className="doubt-list">
            {doubts.map((doubt: any) => (
              <div key={doubt._id} className="doubt-item glass-card">
                <div className="doubt-header">
                  <strong>{doubt.userName}</strong>
                  <span>{new Date(doubt.createdAt).toLocaleDateString()}</span>
                </div>
                <p>{doubt.question}</p>
                <div className="doubt-footer">
                  <button><ThumbsUp size={14} /> {doubt.upvotes}</button>
                  <button><MessageSquare size={14} /> {doubt.answers.length} Answers</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sidebar">
        <h3>Course Content</h3>
        <div className="playlist">
          {course.videos.map((video: any, index: number) => (
            <div 
              key={video._id} 
              className={`playlist-item ${activeVideo === index ? 'active' : ''}`}
              onClick={() => setActiveVideo(index)}
            >
              <span className="index">{index + 1}</span>
              <div className="item-info">
                <h4>{video.title}</h4>
                <span>{video.topic}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .course-view { display: grid; grid-template-columns: 1fr 350px; height: calc(100vh - 70px); overflow: hidden; }
        .main-content { overflow-y: auto; padding: 2rem; }
        .video-section iframe { width: 100%; aspect-ratio: 16/9; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        
        .enroll-overlay { width: 100%; aspect-ratio: 16/9; background: rgba(15, 23, 42, 0.95); display: flex; align-items: center; justify-content: center; border-radius: 16px; text-align: center; border: 1px solid var(--glass-border); }
        .overlay-content h2 { margin-bottom: 1rem; font-size: 2rem; }
        .overlay-content p { color: var(--text-muted); margin-bottom: 2rem; max-width: 400px; padding: 0 1rem; }
        .overlay-content .btn-primary { padding: 1rem 3rem; font-size: 1.1rem; }

        .video-info { margin: 2rem 0; }
        .video-info h1 { font-size: 1.8rem; margin-bottom: 0.5rem; }
        .video-info p { color: var(--text-muted); }

        .tabs { display: flex; gap: 2rem; border-bottom: 1px solid var(--glass-border); margin-bottom: 2rem; }
        .tabs button { background: none; padding: 1rem 0; color: var(--text-muted); font-weight: 600; border-bottom: 2px solid transparent; }
        .tabs button.active { color: var(--primary); border-bottom-color: var(--primary); }

        .doubt-input textarea { width: 100%; background: none; border: none; color: white; min-height: 80px; resize: none; outline: none; }
        .doubt-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }
        .btn-ai { background: rgba(139, 92, 246, 0.2); color: #a78bfa; padding: 8px 16px; border-radius: 8px; border: 1px solid rgba(139, 92, 246, 0.3); display: flex; align-items: center; gap: 8px; }
        
        .ai-response { margin: 1.5rem 0; border-left: 4px solid var(--accent); background: rgba(139, 92, 246, 0.05); }
        .ai-header { font-size: 0.7rem; font-weight: 800; color: var(--accent); letter-spacing: 1px; margin-bottom: 10px; }

        .doubt-item { margin-bottom: 1rem; }
        .doubt-header { display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 10px; }
        .doubt-header span { color: var(--text-muted); }
        .doubt-footer { display: flex; gap: 1.5rem; margin-top: 15px; }
        .doubt-footer button { background: none; color: var(--text-muted); font-size: 0.8rem; display: flex; align-items: center; gap: 5px; }

        .sidebar { background: #111827; border-left: 1px solid var(--glass-border); padding: 1.5rem; overflow-y: auto; }
        .playlist { margin-top: 1.5rem; }
        .playlist-item { display: flex; gap: 15px; padding: 1rem; border-radius: 12px; cursor: pointer; transition: var(--transition); margin-bottom: 0.5rem; }
        .playlist-item:hover { background: rgba(255,255,255,0.05); }
        .playlist-item.active { background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.2); }
        .playlist-item .index { color: var(--text-muted); font-weight: 700; width: 20px; }
        .playlist-item h4 { font-size: 0.95rem; margin-bottom: 4px; }
        .playlist-item span { font-size: 0.75rem; color: var(--text-muted); }
      `}</style>
    </div>
  );
};

export default CourseView;
