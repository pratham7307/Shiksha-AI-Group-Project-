const { getChatbotResponse } = require('../services/aiService');
const Course = require('../models/Course');
const Result = require('../models/Result');

const chatbot = async (req, res) => {
    const { question, context } = req.body;
    try {
        const response = await getChatbotResponse(question, context);
        res.json({ response });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const recommendContent = async (req, res) => {
    try {
        const latestResult = await Result.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
        if (!latestResult || latestResult.weakTopics.length === 0) {
            // Suggest trending courses if no weak topics
            const trending = await Course.find({}).limit(3);
            return res.json(trending);
        }

        const recommendations = await Course.find({
            subject: { $in: latestResult.weakTopics }
        }).limit(5);

        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { chatbot, recommendContent };
