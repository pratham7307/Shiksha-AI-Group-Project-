const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

dotenv.config();
connectDB();

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

const app = express();

// CORS
app.use(cors({
    origin: [
        'https://shiksha-ai-group-project.vercel.app',
        'https://shiksha-ai-group-project-kc7t7spio-pratham7307s-projects.vercel.app',
        /\.vercel\.app$/
    ],
    credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const doubtRoutes = require('./routes/doubtRoutes');
const testRoutes = require('./routes/testRoutes');
const aiRoutes = require('./routes/aiRoutes');

app.use('/api/auth', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/doubts', doubtRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/ai', aiRoutes);

app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url });
});

app.get('/', (req, res) => {
    res.send('Shiksha AI API is running...');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));