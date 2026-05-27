import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Use Firebase's uid string as the primary key instead of a Mongoose ObjectId
  _id: {
    type: String, 
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: null
  }
}, { 
  timestamps: { createdAt: true, updatedAt: false } 
});

export const User = mongoose.model('User', userSchema);