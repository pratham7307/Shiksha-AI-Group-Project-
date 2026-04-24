const mongoose = require('mongoose');

const resultSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    weakTopics: [{ type: String }],
    performanceAnalysis: { type: String } // AI generated feedback
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
