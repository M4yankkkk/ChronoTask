const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'mid', 'high'],
    default: 'mid'
  },
  category: {
    type: String,
    enum: ['work', 'study', 'personal', 'health', 'other'],
    default: 'other'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  color: {
    type: String,
    default: '#3B82F6'
  }
}, {
  timestamps: true
});

// Index for efficient queries
todoSchema.index({ user: 1, startTime: 1 });
todoSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Todo', todoSchema);
