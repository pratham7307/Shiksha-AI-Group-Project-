const express = require('express');
const router = express.Router();
const { getDoubtsByVideo, createDoubt, answerDoubt, upvoteDoubt } = require('../controllers/doubtController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:videoId', getDoubtsByVideo);
router.post('/', protect, createDoubt);
router.post('/answer', protect, answerDoubt);
router.post('/upvote/:id', protect, upvoteDoubt);

module.exports = router;
