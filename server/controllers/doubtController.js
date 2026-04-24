const Doubt = require('../models/Doubt');

const getDoubtsByVideo = async (req, res) => {
    try {
        const doubts = await Doubt.find({ videoId: req.params.videoId }).sort({ createdAt: -1 });
        res.json(doubts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createDoubt = async (req, res) => {
    const { videoId, question } = req.body;
    try {
        const doubt = new Doubt({
            userId: req.user._id,
            userName: req.user.name,
            videoId,
            question
        });
        const createdDoubt = await doubt.save();
        res.status(201).json(createdDoubt);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const answerDoubt = async (req, res) => {
    const { doubtId, text } = req.body;
    try {
        const doubt = await Doubt.findById(doubtId);
        if (doubt) {
            const answer = {
                userId: req.user._id,
                userName: req.user.name,
                text,
                isTeacher: req.user.role === 'teacher'
            };
            doubt.answers.push(answer);
            await doubt.save();
            res.json(doubt);
        } else {
            res.status(404).json({ message: 'Doubt not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const upvoteDoubt = async (req, res) => {
    try {
        const doubt = await Doubt.findById(req.params.id);
        if (doubt) {
            doubt.upvotes += 1;
            await doubt.save();
            res.json(doubt);
        } else {
            res.status(404).json({ message: 'Doubt not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDoubtsByVideo, createDoubt, answerDoubt, upvoteDoubt };
