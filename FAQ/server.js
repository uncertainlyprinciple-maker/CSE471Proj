import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Atlas connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.post("/submit", async (req, res) => {
  try {
    const { name, email, faq } = req.body;
    const newUser = new User({ name, email, faq });
    await newUser.save();
    res.json({ message: "Data saved successfully!" });
  } catch (err) {
    console.error("Error saving to MongoDB:", err);
    res.status(500).json({ error: "Failed to save data" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
