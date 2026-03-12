const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    avatar: {
      type: String,
      default: 'https://via.placeholder.com/150'
    },
    // OAuth IDs
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true
    },
    appleId: {
      type: String,
      unique: true,
      sparse: true
    },
    // OAuth provider
    provider: {
      type: String,
      enum: ['local', 'google', 'github', 'apple'],
      default: 'local'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);