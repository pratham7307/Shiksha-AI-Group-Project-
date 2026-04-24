import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Plus, Trash, Save, ClipboardList, Calendar } from 'lucide-react';

const CreateTest: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [test, setTest] = useState({
    title: '',
    subject: '',
    courseId: '',
    duration: 30,
    scheduledAt: new Date().toISOString().slice(0, 16),
    questions: [{ questionText: '', options: ['', '', '', ''], correctAnswer: '', topic: '' }]
  });

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await API.get('/courses');
      setCourses(data);
    };
    fetchCourses();
  }, []);

  const handleAddQuestion = () => {
    setTest({
      ...test,
      questions: [...test.questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '', topic: '' }]
    });
  };

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = [...test.questions];
    newQuestions.splice(index, 1);
    setTest({ ...test, questions: newQuestions });
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const newQuestions = [...test.questions];
    (newQuestions[index] as any)[field] = value;
    setTest({ ...test, questions: newQuestions });
  };

  const handleOptionChange = (qIndex: number, optIndex: number, value: string) => {
    const newQuestions = [...test.questions];
    newQuestions[qIndex].options[optIndex] = value;
    setTest({ ...test, questions: newQuestions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/tests', test);
      alert('Test Scheduled Successfully!');
      navigate('/dashboard');
    } catch (error) {
      alert('Failed to schedule test');
    }
  };

  return (
    <div className="create-test-page">
      <header className="page-header">
        <h1>Schedule Assessment</h1>
        <p>Create and schedule MCQs for your students.</p>
      </header>

      <form onSubmit={handleSubmit} className="create-form">
        <section className="glass-card form-section">
          <h3>Test Details</h3>
          <div className="input-row">
            <div className="input-group">
              <label>Test Title</label>
              <input type="text" value={test.title} onChange={(e) => setTest({...test, title: e.target.value})} required />
            </div>
            <div className="input-group">
              <label>Subject</label>
              <input type="text" value={test.subject} onChange={(e) => setTest({...test, subject: e.target.value})} required />
            </div>
          </div>
          <div className="input-row">
            <div className="input-group">
              <label>Related Course</label>
              <select value={test.courseId} onChange={(e) => setTest({...test, courseId: e.target.value})} required>
                <option value="">Select a Course</option>
                {courses.map((c: any) => (
                  <option key={c._id} value={c._id}>{c.title}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Duration (Minutes)</label>
              <input type="number" value={test.duration} onChange={(e) => setTest({...test, duration: parseInt(e.target.value)})} />
            </div>
          </div>
          <div className="input-group">
            <label><Calendar size={14} /> Schedule Date & Time</label>
            <input type="datetime-local" value={test.scheduledAt} onChange={(e) => setTest({...test, scheduledAt: e.target.value})} />
          </div>
        </section>

        <section className="glass-card form-section">
          <div className="section-header">
            <h3>Questions (MCQs)</h3>
            <button type="button" onClick={handleAddQuestion} className="btn-add"><Plus size={16} /> Add Question</button>
          </div>
          
          <div className="question-list">
            {test.questions.map((q, qIndex) => (
              <div key={qIndex} className="question-item glass-card">
                <div className="question-header">
                  <h4>Q#{qIndex + 1}</h4>
                  <button type="button" onClick={() => handleRemoveQuestion(qIndex)} className="btn-remove"><Trash size={16} /></button>
                </div>
                <div className="input-group">
                  <label>Question Text</label>
                  <textarea value={q.questionText} onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)} required />
                </div>
                <div className="options-grid">
                  {q.options.map((opt, optIndex) => (
                    <div key={optIndex} className="input-group">
                      <label>Option {String.fromCharCode(65 + optIndex)}</label>
                      <input type="text" value={opt} onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)} required />
                    </div>
                  ))}
                </div>
                <div className="input-row">
                  <div className="input-group">
                    <label>Correct Answer (Exact Match)</label>
                    <input type="text" value={q.correctAnswer} onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)} placeholder="Must match one of the options" required />
                  </div>
                  <div className="input-group">
                    <label>Topic Tag</label>
                    <input type="text" value={q.topic} onChange={(e) => handleQuestionChange(qIndex, 'topic', e.target.value)} placeholder="e.g. Algebra" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <button type="submit" className="btn-primary submit-btn"><Save size={18} /> Schedule Test</button>
      </form>

      <style>{`
        .create-test-page { max-width: 900px; margin: 0 auto; padding: 4rem 2rem; }
        .page-header { margin-bottom: 3rem; }
        .form-section { margin-bottom: 2rem; padding: 2.5rem; }
        .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 1.5rem; }
        .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
        
        .question-item { background: rgba(255,255,255,0.02); margin-bottom: 2rem; }
        .question-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .question-item textarea { width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 8px; color: white; min-height: 80px; }
        
        .submit-btn { width: 100%; padding: 1.5rem; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; gap: 10px; }
        .btn-add { background: var(--accent); color: white; padding: 8px 16px; border-radius: 8px; display: flex; align-items: center; gap: 8px; font-weight: 600; }
      `}</style>
    </div>
  );
};

export default CreateTest;
