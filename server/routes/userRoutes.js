const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, linkChild, getAllUsers, approveUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.post('/link-child', protect, linkChild);
router.get('/', protect, authorize('admin', 'teacher'), getAllUsers);
router.put('/approve/:id', protect, authorize('admin', 'teacher'), approveUser);
router.delete('/:id', protect, authorize('admin', 'teacher'), deleteUser);

module.exports = router;
