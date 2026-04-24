const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    topic: { type: String }
});

const testSchema = mongoose.Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    questions: [questionSchema],
    duration: { type: Number, default: 30 }, // minutes
    scheduledAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);
