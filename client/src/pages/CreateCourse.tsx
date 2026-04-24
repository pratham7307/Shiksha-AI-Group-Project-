import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Plus, Trash, Save, Video } from 'lucide-react';

const CreateCourse: React.FC = () => {
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    title: '',
    subject: '',
    description: '',
    thumbnail: '',
    difficulty: 'Beginner',
    videos: [{ title: '', videoUrl: '', description: '', topic: '' }]
  });

  const [uploading, setUploading] = useState<string | null>(null);

  const handleFileUpload = async (file: File, type: 'thumbnail' | 'video', index?: number) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploading(type === 'thumbnail' ? 'thumbnail' : `video-${index}`);

    try {
      const { data } = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (type === 'thumbnail') {
        setCourse({ ...course, thumbnail: data.url });
      } else if (index !== undefined) {
        handleVideoChange(index, 'videoUrl', data.url);
      }
    } catch (error) {
      alert('File upload failed');
    } finally {
      setUploading(null);
    }
  };

  const handleAddVideo = () => {
    setCourse({
      ...course,
      videos: [...course.videos, { title: '', videoUrl: '', description: '', topic: '' }]
    });
  };

  const handleRemoveVideo = (index: number) => {
    const newVideos = [...course.videos];
    newVideos.splice(index, 1);
    setCourse({ ...course, videos: newVideos });
  };

  const handleVideoChange = (index: number, field: string, value: string) => {
    const newVideos = [...course.videos];
    (newVideos[index] as any)[field] = value;
    setCourse({ ...course, videos: newVideos });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/courses', course);
      alert('Course Created Successfully!');
      navigate('/courses');
    } catch (error) {
      alert('Failed to create course');
    }
  };

  return (
    <div className="create-course-page animate-fade">
      <header className="page-header">
        <h1>Create New Course</h1>
        <p>Design a comprehensive learning experience for your students.</p>
      </header>

      <form onSubmit={handleSubmit} className="create-form">
        <section className="glass-card form-section">
          <h3>Basic Information</h3>
          <div className="input-row">
            <div className="input-group">
              <label>Course Title</label>
              <input type="text" value={course.title} onChange={(e) => setCourse({...course, title: e.target.value})} required />
            </div>
            <div className="input-group">
              <label>Subject</label>
              <input type="text" value={course.subject} onChange={(e) => setCourse({...course, subject: e.target.value})} required />
            </div>
          </div>
          <div className="input-row">
            <div className="input-group">
              <label>Thumbnail URL (or Upload)</label>
              <div className="file-input-wrapper">
                <input type="text" value={course.thumbnail} onChange={(e) => setCourse({...course, thumbnail: e.target.value})} placeholder="https://..." />
                <input 
                  type="file" 
                  id="thumb-upload" 
                  hidden 
                  accept="image/*"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], 'thumbnail')} 
                />
                <label htmlFor="thumb-upload" className="btn-file">
                  {uploading === 'thumbnail' ? '...' : 'Upload'}
                </label>
              </div>
            </div>
            <div className="input-group">
              <label>Difficulty</label>
              <select value={course.difficulty} onChange={(e) => setCourse({...course, difficulty: e.target.value})}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
          <div className="input-group">
            <label>Description</label>
            <textarea value={course.description} onChange={(e) => setCourse({...course, description: e.target.value})} />
          </div>
        </section>

        <section className="glass-card form-section">
          <div className="section-header">
            <h3>Course Content (Videos/PDFs)</h3>
            <button type="button" onClick={handleAddVideo} className="btn-add"><Plus size={16} /> Add Media</button>
          </div>
          
          <div className="video-list">
            {course.videos.map((video, index) => (
              <div key={index} className="video-item glass-card animate-fade">
                <div className="video-header">
                  <h4><Video size={16} /> Item #{index + 1}</h4>
                  <button type="button" onClick={() => handleRemoveVideo(index)} className="btn-remove"><Trash size={16} /></button>
                </div>
                <div className="input-row">
                  <div className="input-group">
                    <label>Title</label>
                    <input type="text" value={video.title} onChange={(e) => handleVideoChange(index, 'title', e.target.value)} required placeholder="e.g. Introduction to AI" />
                  </div>
                  <div className="input-group">
                    <label>Media Source (Embed URL or Upload)</label>
                    <div className="file-input-wrapper">
                      <input type="text" value={video.videoUrl} onChange={(e) => handleVideoChange(index, 'videoUrl', e.target.value)} required placeholder="YouTube link or Upload file" />
                      <input 
                        type="file" 
                        id={`file-${index}`} 
                        hidden 
                        accept="video/*,application/pdf"
                        onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], 'video', index)} 
                      />
                      <label htmlFor={`file-${index}`} className="btn-file">
                        {uploading === `video-${index}` ? '...' : 'Upload'}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="input-row">
                  <div className="input-group">
                    <label>Topic</label>
                    <input type="text" value={video.topic} onChange={(e) => handleVideoChange(index, 'topic', e.target.value)} placeholder="e.g. Machine Learning" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <button type="submit" className="btn-primary submit-btn"><Save size={18} /> Publish Course</button>
      </form>

      <style>{`
        .create-course-page { max-width: 900px; margin: 0 auto; padding: 4rem 2rem; }
        .page-header { margin-bottom: 3rem; }
        .page-header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .page-header p { color: var(--text-muted); }

        .form-section { margin-bottom: 2rem; padding: 2.5rem; }
        .form-section h3 { margin-bottom: 2rem; font-size: 1.5rem; color: var(--primary); }
        .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 1.5rem; }
        .input-group { margin-bottom: 1.5rem; }
        .input-group label { display: block; margin-bottom: 0.8rem; font-size: 0.9rem; color: var(--text-muted); }
        .input-group input, .input-group textarea, .input-group select { 
          width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 8px; color: white; outline: none;
        }
        .input-group textarea { min-height: 100px; }

        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .btn-add { background: var(--primary); color: white; padding: 8px 16px; border-radius: 8px; display: flex; align-items: center; gap: 8px; font-weight: 600; }
        
        .video-item { background: rgba(255,255,255,0.03); margin-bottom: 1.5rem; padding: 1.5rem; }
        .video-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem; }
        .btn-remove { background: none; color: #ef4444; }
        
        .file-input-wrapper { display: flex; gap: 10px; align-items: center; }
        .btn-file { 
          padding: 10px 18px; 
          background: var(--glass); 
          border: 1px solid var(--primary); 
          border-radius: 8px; 
          color: var(--primary); 
          cursor: pointer; 
          font-weight: 600; 
          font-size: 0.85rem;
          transition: var(--transition);
          white-space: nowrap;
          min-width: 80px;
          text-align: center;
        }
        .btn-file:hover { background: var(--primary); color: white; }

        .submit-btn { width: 100%; padding: 1.5rem; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 2rem; }
      `}</style>
    </div>
  );
};

export default CreateCourse;
