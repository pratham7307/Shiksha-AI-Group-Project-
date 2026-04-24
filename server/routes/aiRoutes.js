const express = require('express');
const router = express.Router();
const { chatbot, recommendContent } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/chat', chatbot);
router.post('/analyze', protect, chatbot); // Performance analysis
router.get('/recommend', protect, recommendContent);

module.exports = router;
