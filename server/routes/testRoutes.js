const express = require('express');
const router = express.Router();
const { getTests, getTestById, submitTest, createTest } = require('../controllers/testController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getTests);
router.get('/:id', getTestById);
router.post('/', protect, authorize('teacher', 'admin'), createTest);
router.post('/submit', protect, authorize('student'), submitTest);

module.exports = router;
