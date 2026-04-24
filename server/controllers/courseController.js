const Course = require('../models/Course');
const User = require('../models/User');

const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({});
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createCourse = async (req, res) => {
    const { title, subject, description, thumbnail, difficulty, videos } = req.body;
    try {
        const course = new Course({ title, subject, description, thumbnail, difficulty, videos });
        const createdCourse = await course.save();
        res.status(201).json(createdCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const enrollCourse = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const course = await Course.findById(req.params.id);

        if (!course) return res.status(404).json({ message: 'Course not found' });

        if (user.enrolledCourses.map(id => id.toString()).includes(req.params.id)) {
            return res.status(400).json({ message: 'Already enrolled' });
        }

        user.enrolledCourses.push(req.params.id);
        user.progress.push({ courseId: req.params.id, completedVideos: [] });
        await user.save();

        res.status(200).json({ message: 'Enrolled successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCourses, getCourseById, createCourse, enrollCourse };
