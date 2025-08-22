const express = require('express');
const { body, validationResult } = require('express-validator');
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(auth);

// Test endpoint for debugging status updates
router.get('/test-status/:id', async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    res.json({
      message: 'Todo status test',
      todo: {
        id: todo._id,
        title: todo.title,
        status: todo.status,
        updatedAt: todo.updatedAt
      }
    });
  } catch (error) {
    console.error('Test status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// @route   GET /api/todos
// @desc    Get all todos for current user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id })
      .sort({ startTime: 1 });
    
    res.json(todos);
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/todos/week/:date
// @desc    Get todos for a specific week
// @access  Private
router.get('/week/:date', async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const todos = await Todo.find({
      user: req.user._id,
      startTime: { $gte: startOfWeek, $lte: endOfWeek }
    }).sort({ startTime: 1 });

    res.json(todos);
  } catch (error) {
    console.error('Get week todos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/todos
// @desc    Create a new todo
// @access  Private
router.post('/', [
  body('title').notEmpty().withMessage('Title is required'),
  body('startTime').isISO8601().withMessage('Start time must be a valid date'),
  body('endTime').isISO8601().withMessage('End time must be a valid date'),
  body('priority').isIn(['low', 'mid', 'high']).withMessage('Invalid priority'),
  body('category').isIn(['work', 'study', 'personal', 'health', 'other']).withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, startTime, endTime, priority, category, notes } = req.body;

    // Validate time logic
    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    const todo = new Todo({
      user: req.user._id,
      title,
      description,
      startTime,
      endTime,
      priority,
      category,
      notes
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/todos/:id
// @desc    Update a todo
// @access  Private
router.put('/:id', [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('startTime').optional().isISO8601().withMessage('Start time must be a valid date'),
  body('endTime').optional().isISO8601().withMessage('End time must be a valid date'),
  body('priority').optional().isIn(['low', 'mid', 'high']).withMessage('Invalid priority'),
  body('category').optional().isIn(['work', 'study', 'personal', 'health', 'other']).withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Validate time logic if updating times
    if (req.body.startTime && req.body.endTime) {
      if (new Date(req.body.startTime) >= new Date(req.body.endTime)) {
        return res.status(400).json({ message: 'End time must be after start time' });
      }
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedTodo);
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/todos/:id
// @desc    Delete a todo
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/todos/:id/status
// @desc    Update todo status
// @access  Private
router.patch('/:id/status', [
  body('status').isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    console.log('Updating todo status:', { todoId: req.params.id, newStatus: req.body.status, userId: req.user._id });

    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) {
      console.error('Todo not found:', req.params.id);
      return res.status(404).json({ message: 'Todo not found' });
    }

    console.log('Found todo:', { id: todo._id, oldStatus: todo.status, newStatus: req.body.status });

    // Update the status
    todo.status = req.body.status;
    
    // Save to database
    const savedTodo = await todo.save();
    
    console.log('Todo status updated successfully:', { id: savedTodo._id, status: savedTodo.status });

    res.json(savedTodo);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
