
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'myclinic-secret-key-change-in-production';

// Helper function to hash passwords
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check password
    const hashedPassword = hashPassword(password);
    
    if (user.passwordHash !== hashedPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is disabled. Contact administrator.' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Send response
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        dispensaryIds: user.dispensaryIds || [],
        lastLogin: user.lastLogin
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user with the ID from the token
    const user = await User.findById(decoded.userId).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is disabled' });
    }
    
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      dispensaryIds: user.dispensaryIds || [],
      lastLogin: user.lastLogin
    });
  } catch (error) {
    console.error('Get current user error:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create an initial admin user (for setup purposes)
router.post('/setup-admin', async (req, res) => {
  try {
    // Check if any users exist already
    const userCount = await User.countDocuments();
    
    if (userCount > 0) {
      return res.status(400).json({ message: 'Setup has already been completed' });
    }
    
    // Create the initial admin user
    const adminUser = new User({
      name: 'Super Admin',
      email: 'admin@example.com',
      passwordHash: hashPassword('123456'), // Default password, should be changed
      role: 'super_admin',
      isActive: true,
      lastLogin: new Date()
    });
    
    await adminUser.save();
    
    res.status(201).json({ message: 'Initial admin user created successfully' });
  } catch (error) {
    console.error('Setup admin error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
