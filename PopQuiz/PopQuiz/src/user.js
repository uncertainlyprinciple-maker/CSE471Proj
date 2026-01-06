import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    lowercase: true,
    unique: true 
  },
  lastScore: { 
    type: Number, 
    default: 0 
  },
  totalPossible: { 
    type: Number, 
    default: 0 
  },
  completedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Create the model
const User = mongoose.model("User", userSchema);

// Export it so server.js can use it
export default User;