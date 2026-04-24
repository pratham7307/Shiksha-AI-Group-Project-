const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher', 'parent', 'admin'], default: 'student' },
    childId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // For parents to track a child
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    progress: [{
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        completedVideos: [{ type: String }]
    }],
    testAttempts: [{
        testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
        score: Number,
        totalQuestions: Number,
        completedAt: { type: Date, default: Date.now }
    }],
    streak: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
    isApproved: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
