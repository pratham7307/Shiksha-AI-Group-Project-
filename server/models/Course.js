const mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    description: { type: String },
    topic: { type: String }
});

const courseSchema = mongoose.Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String },
    thumbnail: { type: String },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    videos: [videoSchema]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
