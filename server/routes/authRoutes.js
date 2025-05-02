
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { auth } = require('express-oauth2-jwt-bearer');
const { validateJwt, requireRole, ROLES } = require('../middleware/authMiddleware');
const { ManagementClient } = require('auth0');
const axios = require('axios');

// Setup Auth0 Management API client
const auth0Management = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: 'read:users update:users'
});

// Public routes
router.get('/config', (req, res) => {
  res.json({
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID,
    audience: process.env.AUTH0_AUDIENCE,
    redirectUri: process.env.AUTH0_CALLBACK_URL
  });
});

// Auth0 callback route
router.post('/callback', async (req, res) => {
  try {
    const { code, state } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: 'Authorization code is required' });
    }
    
    // Exchange code for token with Auth0
    const tokenResponse = await axios.post(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
      grant_type: 'authorization_code',
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      code,
      redirect_uri: process.env.AUTH0_CALLBACK_URL
    });
    
    if (!tokenResponse.data || !tokenResponse.data.access_token) {
      return res.status(400).json({ message: 'Failed to exchange code for token' });
    }
    
    // Get user info with the access token
    const userInfoResponse = await axios.get(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
      headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` }
    });
    
    const auth0User = userInfoResponse.data;
    
    // Check if user exists in our database
    let user = await User.findOne({ auth0Id: auth0User.sub });
    
    if (!user) {
      // Fetch user roles from Auth0 management API
      const auth0ManagementUser = await auth0Management.getUser({ id: auth0User.sub });
      
      // Extract roles and permissions
      let userRole = 'dispensary_staff'; // Default role
      if (auth0ManagementUser.app_metadata?.roles) {
        if (auth0ManagementUser.app_metadata.roles.includes('super_admin')) {
          userRole = 'super_admin';
        } else if (auth0ManagementUser.app_metadata.roles.includes('dispensary_admin')) {
          userRole = 'dispensary_admin';
        }
      }
      
      // Create new user in our database
      user = new User({
        name: auth0User.name || auth0User.nickname,
        email: auth0User.email,
        auth0Id: auth0User.sub,
        role: userRole,
        dispensaryIds: auth0ManagementUser.app_metadata?.dispensaryIds || [],
        isActive: true,
        lastLogin: new Date()
      });
      
      await user.save();
    } else {
      // Update user login time
      user.lastLogin = new Date();
      await user.save();
    }
    
    // Create our own JWT with user info and permissions
    const token = tokenResponse.data.id_token;
    
    res.json({
      token,
      user: {
        id: user._id,
        auth0Id: user.auth0Id,
        name: user.name,
        email: user.email,
        role: user.role,
        dispensaryIds: user.dispensaryIds || [],
        lastLogin: user.lastLogin
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Auth0 callback error:', error);
    res.status(500).json({ 
      message: 'Authentication failed', 
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
});

// Protected routes
// Get current user profile 
router.get('/me', validateJwt, async (req, res) => {
  try {
    const auth0UserId = req.auth.payload.sub;
    
    // First, check if user exists in our database
    let user = await User.findOne({ auth0Id: auth0UserId });
    
    if (!user) {
      // If not in our database, fetch from Auth0 and create in our DB
      const auth0User = await auth0Management.getUser({ id: auth0UserId });
      
      // Extract roles from Auth0 user metadata or app_metadata
      const userRoles = auth0User.app_metadata?.roles || [];
      const dispensaryIds = auth0User.app_metadata?.dispensaryIds || [];
      
      // Create new user in our database
      user = new User({
        name: auth0User.name || auth0User.nickname,
        email: auth0User.email,
        auth0Id: auth0UserId,
        role: userRoles.includes(ROLES.SUPER_ADMIN) ? 'super_admin' : 
              userRoles.includes(ROLES.DISPENSARY_ADMIN) ? 'dispensary_admin' : 
              'dispensary_staff',
        dispensaryIds: dispensaryIds,
        isActive: true,
        lastLogin: new Date()
      });
      
      await user.save();
    } else {
      // Update last login time
      user.lastLogin = new Date();
      await user.save();
    }
    
    // Get user permissions from Auth0
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.decode(token);
    const permissions = decodedToken[`${process.env.AUTH0_AUDIENCE}/permissions`] || [];
    
    res.status(200).json({
      id: user._id,
      auth0Id: user.auth0Id,
      name: user.name,
      email: user.email,
      role: user.role,
      dispensaryIds: user.dispensaryIds || [],
      permissions: permissions,
      lastLogin: user.lastLogin
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin-only routes
// Get all users (super_admin only)
router.get('/users', validateJwt, requireRole([ROLES.SUPER_ADMIN]), async (req, res) => {
  try {
    const users = await User.find({}).select('-passwordHash');
    res.status(200).json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get users by dispensary (for dispensary admins)
router.get('/users/dispensary/:dispensaryId', validateJwt, requireRole([ROLES.SUPER_ADMIN, ROLES.DISPENSARY_ADMIN]), async (req, res) => {
  try {
    const { dispensaryId } = req.params;
    
    // For dispensary admin, check if they have access to this dispensary
    if (req.user.roles.includes(ROLES.DISPENSARY_ADMIN)) {
      const user = await User.findOne({ auth0Id: req.user.id });
      if (!user.dispensaryIds.includes(dispensaryId)) {
        return res.status(403).json({ message: 'Access denied to this dispensary' });
      }
    }
    
    const users = await User.find({ dispensaryIds: dispensaryId }).select('-passwordHash');
    res.status(200).json(users);
  } catch (error) {
    console.error('Get dispensary users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
