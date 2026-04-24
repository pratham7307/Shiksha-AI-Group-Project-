import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseView from './pages/CourseView';
import Dashboard from './pages/Dashboard';
import CreateCourse from './pages/CreateCourse';
import CreateTest from './pages/CreateTest';
import TestPage from './pages/TestPage';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import About from './pages/About';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/course/:id" element={<CourseView />} />
              <Route path="/create-course" element={<CreateCourse />} />
              <Route path="/create-test" element={<CreateTest />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/test/:id" element={<TestPage />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
