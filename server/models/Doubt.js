const mongoose = require('mongoose');

const answerSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String },
    text: { type: String, required: true },
    isTeacher: { type: Boolean, default: false }
}, { timestamps: true });

const doubtSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String },
    videoId: { type: String, required: true },
    question: { type: String, required: true },
    answers: [answerSchema],
    upvotes: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Doubt', doubtSchema);
