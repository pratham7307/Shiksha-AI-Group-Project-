const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const isApproved = role !== 'student';
        const user = await User.create({ name, email, password, role, isApproved });
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            if (user.role === 'student' && !user.isApproved) {
                return res.status(403).json({ message: 'Your account is pending approval by an admin or teacher.' });
            }
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserProfile = async (req, res) => {
    try {
        let user = await User.findById(req.user._id).populate('testAttempts.testId', 'title');
        
        if (!user) return res.status(404).json({ message: 'User not found' });

        let childData = null;
        if (user.role === 'parent' && user.childId) {
            childData = await User.findById(user.childId)
                .select('name email streak progress testAttempts')
                .populate('testAttempts.testId', 'title')
                .populate('progress.courseId', 'title thumbnail');
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            streak: user.streak,
            progress: user.progress,
            enrolledCourses: user.enrolledCourses,
            testAttempts: user.testAttempts,
            child: childData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const linkChild = async (req, res) => {
    const { childEmail } = req.body;
    try {
        const parent = await User.findById(req.user._id);
        const child = await User.findOne({ email: childEmail, role: 'student' });

        if (!child) return res.status(404).json({ message: 'Student not found with this email' });

        parent.childId = child._id;
        await parent.save();

        res.json({ message: 'Child linked successfully', childName: child.name });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const queryRole = req.user.role === 'admin' 
            ? { $in: ['student', 'teacher'] } 
            : 'student';
            
        const users = await User.find({ role: queryRole })
            .select('-password')
            .sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const approveUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.isApproved = true;
            await user.save();
            res.json({ message: 'User approved successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            // Teachers can only delete students
            if (req.user.role === 'teacher' && user.role !== 'student') {
                return res.status(403).json({ message: 'Teachers can only remove student accounts' });
            }
            await user.deleteOne();
            res.json({ message: 'User removed successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, getUserProfile, linkChild, getAllUsers, approveUser, deleteUser };

