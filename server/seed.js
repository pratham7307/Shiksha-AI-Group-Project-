const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');
const Test = require('./models/Test');

dotenv.config();

const courses = [
    {
        title: "Introduction to Artificial Intelligence",
        subject: "AI",
        description: "Learn the basics of AI, Machine Learning, and Neural Networks.",
        thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
        difficulty: "Beginner",
        videos: [
            { title: "What is AI?", videoUrl: "https://www.youtube.com/embed/ad79nYk2keg", description: "Introduction to AI", topic: "Basics" },
            { title: "Machine Learning Explained", videoUrl: "https://www.youtube.com/embed/h0e2HAPTGF4", description: "How machines learn", topic: "ML" }
        ]
    },
    {
        title: "Web Development Bootcamp",
        subject: "CS",
        description: "Master HTML, CSS, and JavaScript from scratch.",
        thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
        difficulty: "Intermediate",
        videos: [
            { title: "HTML Basics", videoUrl: "https://www.youtube.com/embed/qz0aGYMCzl0", description: "Structure of web pages", topic: "HTML" }
        ]
    }
];

const tests = [
    {
        title: "AI Fundamentals Quiz",
        subject: "AI",
        questions: [
            {
                questionText: "What does AI stand for?",
                options: ["Artificial Intelligence", "Automated Information", "Actual Insight", "Alpha Index"],
                correctAnswer: "Artificial Intelligence",
                topic: "Basics"
            },
            {
                questionText: "Which of the following is a type of Machine Learning?",
                options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "All of the above"],
                correctAnswer: "All of the above",
                topic: "ML"
            }
        ]
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Course.deleteMany();
        await Test.deleteMany();
        await Course.insertMany(courses);
        await Test.insertMany(tests);
        console.log("Data Seeded Successfully");
        process.exit();
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();
