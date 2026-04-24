const express = require('express');
const router = express.Router();
const { getCourses, getCourseById, createCourse, enrollCourse } = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/', protect, authorize('teacher', 'admin'), createCourse);
router.post('/enroll/:id', protect, authorize('student'), enrollCourse);

module.exports = router;
