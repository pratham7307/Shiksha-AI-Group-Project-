import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Book, Layers, Search } from 'lucide-react';

const Courses: React.FC = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await API.get('/api/courses');
      setCourses(data);
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((c: any) => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="courses-page">
      <header className="page-header">
        <h1>Explore Courses</h1>
        <div className="search-bar">
          <Search size={18} />
          <input 
            placeholder="Search by subject or title..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="course-grid">
        {filteredCourses.map((course: any) => (
          <Link to={`/course/${course._id}`} key={course._id} className="glass-card course-card">
            <img src={course.thumbnail} alt={course.title} />
            <div className="card-content">
              <span className="subject-tag">{course.subject}</span>
              <h3>{course.title}</h3>
              <p>{course.description.substring(0, 80)}...</p>
              <div className="card-footer">
                <span><Layers size={14} /> {course.difficulty}</span>
                <span><Book size={14} /> {course.videos.length} Videos</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        .courses-page { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; }
        .search-bar { 
          display: flex; align-items: center; gap: 10px; 
          background: var(--glass); border: 1px solid var(--glass-border); 
          padding: 10px 20px; border-radius: 12px; width: 400px;
        }
        .search-bar input { background: none; border: none; color: white; width: 100%; outline: none; }
        .course-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem; }
        .course-card { padding: 0; overflow: hidden; transition: var(--transition); }
        .course-card:hover { transform: translateY(-5px); }
        .course-card img { width: 100%; height: 180px; object-fit: crop; }
        .card-content { padding: 1.5rem; }
        .subject-tag { 
          background: rgba(99, 102, 241, 0.2); color: var(--primary); 
          font-size: 0.7rem; font-weight: 700; padding: 4px 8px; 
          border-radius: 4px; text-transform: uppercase; 
        }
        h3 { margin: 10px 0; font-size: 1.2rem; }
        .card-content p { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.5rem; }
        .card-footer { display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted); }
        .card-footer span { display: flex; align-items: center; gap: 5px; }
      `}</style>
    </div>
  );
};

export default Courses;
