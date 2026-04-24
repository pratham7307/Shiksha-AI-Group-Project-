import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Timer, CheckCircle, AlertCircle } from 'lucide-react';

const TestPage: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [test, setTest] = useState<any>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const fetchTest = async () => {
      const { data } = await API.get(`/api/tests/${id}`);
      setTest(data);
      setAnswers(new Array(data.questions.length).fill(''));
      setTimeLeft(data.duration * 60);
    };
    fetchTest();
  }, [id]);

  useEffect(() => {
    let timer: any;
    if (timeLeft > 0 && !result) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !result && test) {
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [timeLeft, result, test]);

  const handleOptionSelect = (qIndex: number, option: string) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = option;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    try {
      const { data } = await API.post('/api/tests/submit', {
        testId: id,
        answers
      });
      setResult(data);
    } catch (error: any) {
      console.error('Submission error:', error);
      alert(error.response?.data?.message || 'Submission failed');
    }
  };

  if (!test) return <div className="loading">Loading Test...</div>;

  const isStudent = user?.role === 'student';
  const isPrivileged = user?.role === 'teacher' || user?.role === 'admin';

  if (!isStudent && !isPrivileged) {
    return (
      <div className="test-page glass-card" style={{ textAlign: 'center', marginTop: '10vh', padding: '3rem' }}>
        <h2>Access Denied</h2>
        <p style={{ margin: '1rem 0 2rem 0', color: 'var(--text-muted)' }}>You are not authorized to view this assessment.</p>
        <button className="btn-primary" onClick={() => navigate('/courses')}>Back to Courses</button>
      </div>
    );
  }

  if (result) {
    return (
      <div className="test-result-page glass-card animate-fade">
        <CheckCircle size={64} color="#10b981" />
        <h1>Test Completed!</h1>
        <div className="score-display">
          <span>Your Score</span>
          <h2>{result.score} / {result.totalQuestions}</h2>
        </div>
        <div className="ai-feedback">
          <h3><AlertCircle size={18} /> AI Performance Analysis</h3>
          <p>{result.performanceAnalysis}</p>
          <div className="weak-topics">
            {result.weakTopics.map((topic: string) => (
              <span key={topic} className="topic-tag">{topic}</span>
            ))}
          </div>
        </div>
        <button className="btn-primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="test-page">
      {!isStudent && (
        <div className="preview-banner animate-fade">
          <AlertCircle size={20} />
          <span><strong>Preview Mode:</strong> You are viewing this test as a {user?.role}. Submission is disabled.</span>
        </div>
      )}
      <header className="test-header" style={{ top: !isStudent ? '140px' : '90px' }}>
        <div className="header-info">
          <h1>{test.title}</h1>
          <span>{test.subject}</span>
        </div>
        <div className="timer glass-card">
          <Timer size={20} />
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </div>
      </header>

      <div className="questions-container">
        {test.questions.map((q: any, qIndex: number) => (
          <div key={qIndex} className="question-card glass-card">
            <h3>{qIndex + 1}. {q.questionText}</h3>
            <div className="options">
              {q.options.map((opt: string) => (
                <div 
                  key={opt} 
                  className={`option ${answers[qIndex] === opt ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(qIndex, opt)}
                >
                  <div className="radio-circle"></div>
                  {opt}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <footer className="test-footer">
        {isStudent ? (
          <button className="btn-primary submit-btn" onClick={handleSubmit}>Submit Test</button>
        ) : (
          <button className="btn-secondary submit-btn" onClick={() => navigate('/courses')}>Exit Preview</button>
        )}
      </footer>

      <style>{`
        .test-page { max-width: 800px; margin: 0 auto; padding: 3rem 2rem; }
        .preview-banner {
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid var(--primary);
          padding: 1rem 1.5rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--primary);
          position: sticky;
          top: 90px;
          z-index: 11;
          backdrop-filter: blur(10px);
        }
        .test-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; position: sticky; top: 90px; z-index: 10; background: var(--bg-dark); padding: 1rem 0; transition: top 0.3s ease; }
        .timer { display: flex; align-items: center; gap: 10px; font-weight: 700; font-family: monospace; font-size: 1.2rem; border-color: var(--primary); color: var(--primary); }
        
        .questions-container { display: flex; flex-direction: column; gap: 2rem; }
        .question-card h3 { margin-bottom: 1.5rem; font-size: 1.2rem; }
        .options { display: grid; gap: 1rem; }
        .option { padding: 1rem; background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 10px; cursor: pointer; display: flex; align-items: center; gap: 15px; transition: var(--transition); }
        .option:hover { background: rgba(255,255,255,0.08); }
        .option.selected { border-color: var(--primary); background: rgba(99, 102, 241, 0.1); }
        .radio-circle { width: 18px; height: 18px; border: 2px solid var(--glass-border); border-radius: 50%; }
        .selected .radio-circle { border-color: var(--primary); background: var(--primary); box-shadow: inset 0 0 0 3px var(--bg-card); }

        .test-footer { margin-top: 4rem; text-align: center; }
        .submit-btn { width: 100%; max-width: 300px; }

        .test-result-page { max-width: 600px; margin: 10vh auto; text-align: center; padding: 4rem; }
        .test-result-page h1 { margin: 1.5rem 0; font-size: 2.5rem; }
        .score-display { background: var(--glass); padding: 2rem; border-radius: 16px; margin-bottom: 2rem; }
        .score-display span { color: var(--text-muted); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; }
        .score-display h2 { font-size: 3rem; color: var(--primary); margin-top: 5px; }
        .ai-feedback { text-align: left; margin-bottom: 3rem; background: rgba(139, 92, 246, 0.05); padding: 2rem; border-radius: 12px; border-left: 4px solid var(--accent); }
        .ai-feedback h3 { display: flex; align-items: center; gap: 10px; font-size: 1rem; color: var(--accent); margin-bottom: 1rem; }
        .weak-topics { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px; }
        .topic-tag { background: rgba(239, 68, 68, 0.1); color: #ef4444; font-size: 0.75rem; font-weight: 600; padding: 4px 10px; border-radius: 50px; border: 1px solid rgba(239, 68, 68, 0.2); }
      `}</style>
    </div>
  );
};

export default TestPage;
