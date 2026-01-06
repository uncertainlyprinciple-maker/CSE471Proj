//server.js

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import User from './src/user.js';
// Import your User model
// file path 

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// 1. Database Connection
mongoose.connect('mongodb+srv://bandhanmondal_db_user:CSE471IHYS@cluster0.vtkztgd.mongodb.net/quizdb?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));

// 2. Question Model
const questionSchema = new mongoose.Schema({
    questionText: String,
    options: [String],
    correctOptionIndex: Number
});
const Question = mongoose.model('Question', questionSchema,'popquiz');

// 3. API: Get questions
app.get('/api/questions', async (req, res) => {
    try {
        const questions = await Question.find({}, { correctOptionIndex: 0 });
        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: "Error fetching questions" });
    }
});

// 4. API: Submit answers, calculate score, and save user results
app.post('/api/submit', async (req, res) => {
    try {
        const { name, email, userAnswers } = req.body; 

        if (!name || !email || !userAnswers) {
            return res.status(400).json({ message: "Missing name, email, or answers" });
        }

        // Fetch all questions
        const questionIds = userAnswers.map(ans => ans.qId);
        const questionsFromDb = await Question.find({ _id: { $in: questionIds } });

        let score = 0;
        userAnswers.forEach(userAns => {
            const dbQuestion = questionsFromDb.find(q => q._id.toString() === userAns.qId);
            if (dbQuestion && dbQuestion.correctOptionIndex === userAns.choice) {
                score++;
            }
        });

        // Update user performance
        const updatedUser = await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            { 
                name, 
                lastScore: score, 
                totalPossible: userAnswers.length,
                completedAt: new Date()
            },
            { upsert: true, new: true }
        );

        res.json({ 
            score, 
            total: userAnswers.length, 
            username: updatedUser.name 
        });

    } catch (err) {
        console.error("Submission Error:", err);
        res.status(500).json({ message: "Error processing submission" });
    }
});

// 5. API: Get Leaderboard
app.get('/api/leaderboard', async (req, res) => {
    try {
        const topScores = await User.find()
            .sort({ lastScore: -1 })
            .limit(10);
        res.json(topScores);
    } catch (err) {
        res.status(500).json({ message: "Error fetching leaderboard" });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));