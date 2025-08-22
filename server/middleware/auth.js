const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('Auth middleware - Request headers:', req.headers);
    console.log('Auth middleware - Token:', token ? 'Present' : 'Missing');
    
    if (!token) {
      console.error('Auth middleware - No token provided');
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'chronotask_super_secret_jwt_key_2024');
    console.log('Auth middleware - Decoded token:', { userId: decoded.userId });
    
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      console.error('Auth middleware - User not found for userId:', decoded.userId);
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }

    console.log('Auth middleware - User authenticated:', { userId: user._id, username: user.username });
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware - Error:', error);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = auth;
