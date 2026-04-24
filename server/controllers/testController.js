const Test = require('../models/Test');
const Result = require('../models/Result');
const User = require('../models/User');
const { analyzePerformance } = require('../services/aiService');

const getTests = async (req, res) => {
    try {
        const tests = await Test.find({});
        res.json(tests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTestById = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);
        if (test) {
            res.json(test);
        } else {
            res.status(404).json({ message: 'Test not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const submitTest = async (req, res) => {
    const { testId, answers } = req.body;
    try {
        const test = await Test.findById(testId);
        if (!test) return res.status(404).json({ message: 'Test not found' });

        if (!req.user) return res.status(401).json({ message: 'User not authenticated' });

        let score = 0;
        const results = [];

        test.questions.forEach((q, index) => {
            const userAnswer = answers && answers[index] ? answers[index] : '';
            const isCorrect = q.correctAnswer === userAnswer;
            if (isCorrect) score++;
            results.push({
                question: q.questionText,
                correctAnswer: q.correctAnswer,
                userAnswer: userAnswer,
                topic: q.topic || 'General',
                isCorrect
            });
        });

        // AI Analysis
        let weakTopics = [];
        let performanceAnalysis = "Analysis pending...";
        try {
            const analysisData = await analyzePerformance(results);
            performanceAnalysis = analysisData.analysis || "No analysis available";
            
            // Extract topics from results where user was incorrect
            const incorrectTopics = results.filter(r => !r.isCorrect).map(r => r.topic);
            weakTopics = [...new Set(incorrectTopics.filter(Boolean))]; // Unique topics
        } catch (aiError) {
            console.error("AI Analysis skipped due to error:", aiError);
        }

        // Save Attempt to User Profile
        const user = await User.findById(req.user._id);
        if (user) {
            user.testAttempts.push({
                testId: test._id,
                score,
                totalQuestions: test.questions.length
            });
            await user.save();
        }

        const result = new Result({
            userId: req.user._id,
            testId: test._id,
            score,
            totalQuestions: test.questions.length,
            weakTopics,
            performanceAnalysis
        });

        await result.save();
        res.status(201).json(result);
    } catch (error) {
        console.error("Submission Error:", error);
        res.status(500).json({ message: error.message });
    }
};

const createTest = async (req, res) => {
    const { title, subject, courseId, questions, duration, scheduledAt } = req.body;
    try {
        const test = new Test({
            title, subject, courseId, questions, duration, scheduledAt
        });
        const createdTest = await test.save();
        res.status(201).json(createdTest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTests, getTestById, submitTest, createTest };
