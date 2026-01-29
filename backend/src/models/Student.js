const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  rollNo: {
    type: String,
    required: true,
    unique: true
  },
  branch: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  cgpa: {
    type: Number,
    required: true
  },
  phone: String,
  skills: [String],
  bio: String,
  github: String,
  linkedin: String,
  resumeUrl: {
    type: String,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);
