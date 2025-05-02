
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { auth } = require('express-oauth2-jwt-bearer');
const { validateJwt, requireRole, ROLES } = require('../middleware/authMiddleware');
const { ManagementClient } = require('auth0');
const axios = require('axios');

// Setup Auth0 Management API client
let auth0Management;
try {
  auth0Management = new ManagementClient({
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    scope: 'read:users update:users'
  });
  console.log('Auth0 Management API client initialized');
} catch (error) {
  console.error('Failed to initialize Auth0 Management API client:', error);
}

// Public routes
router.get('/config', (req, res) => {
  // Add additional logging for debugging
  console.log('Auth config request received');
  console.log('Auth0 config values:', {
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID,
    audience: process.env.AUTH0_AUDIENCE,
    redirectUri: process.env.AUTH0_CALLBACK_URL,
  });

  res.json({
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID,
    audience: process.env.AUTH0_AUDIENCE,
    redirectUri: process.env.AUTH0_CALLBACK_URL
  });
});

// Auth0 callback route with more robust error handling
router.post('/callback', async (req, res) => {
  try {
    const { code, redirectUri } = req.body;
    console.log('Auth callback received with code:', code ? 'Present (hidden)' : 'Not present');
    console.log('Auth callback redirectUri:', redirectUri);
    
    if (!code) {
      return res.status(400).json({ message: 'Authorization code is required' });
    }
    
    console.log('Exchanging code for token with Auth0...');
    console.log('Token exchange parameters:', {
      grant_type: 'authorization_code',
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: '(hidden)',
      code: '(hidden)',
      redirect_uri: redirectUri || process.env.AUTH0_CALLBACK_URL
    });
    
    const tokenResponse = await axios.post(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
      grant_type: 'authorization_code',
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri || process.env.AUTH0_CALLBACK_URL
    });
    
    if (!tokenResponse.data || !tokenResponse.data.access_token) {
      console.error('Token exchange failed:', tokenResponse.data);
      return res.status(400).json({ message: 'Failed to exchange code for token' });
    }
    
    console.log('Token received successfully');
    
    // Get user info with the access token
    const userInfoResponse = await axios.get(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
      headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` }
    });
    
    const auth0User = userInfoResponse.data;
    console.log('User info retrieved:', {
      sub: auth0User.sub,
      email: auth0User.email,
      name: auth0User.name || auth0User.nickname
    });
    
    // Check if user exists in our database
    let user = await User.findOne({ auth0Id: auth0User.sub });
    
    // Set default role based on Auth0 
    let userRole = 'dispensary_staff';
    let userDispensaryIds = [];
    
    // Try to fetch user roles from Auth0 management API
    if (auth0Management) {
      try {
        const auth0ManagementUser = await auth0Management.getUser({ id: auth0User.sub });
        console.log('User roles from Auth0:', auth0ManagementUser.app_metadata?.roles || 'none');
        
        // Extract roles and permissions
        if (auth0ManagementUser.app_metadata?.roles) {
          if (auth0ManagementUser.app_metadata.roles.includes('super_admin')) {
            userRole = 'super_admin';
            console.log('User is a super admin');
          } else if (auth0ManagementUser.app_metadata.roles.includes('dispensary_admin')) {
            userRole = 'dispensary_admin';
            console.log('User is a dispensary admin');
          }
        }
        
        userDispensaryIds = auth0ManagementUser.app_metadata?.dispensaryIds || [];
      } catch (error) {
        console.error('Failed to fetch user metadata from Auth0:', error);
      }
    }
    
    if (!user) {
      console.log('Creating new user in database...');
      
      // Create new user in our database
      user = new User({
        name: auth0User.name || auth0User.nickname || auth0User.email,
        email: auth0User.email,
        auth0Id: auth0User.sub,
        role: userRole,
        dispensaryIds: userDispensaryIds,
        isActive: true,
        lastLogin: new Date()
      });
      
      await user.save();
      console.log('New user created in database');
    } else {
      // Update user login time and ensure role is correct
      console.log('Updating existing user');
      user.lastLogin = new Date();
      
      // Update role if it's changed in Auth0
      if (userRole !== 'dispensary_staff') {
        user.role = userRole;
      }
      
      await user.save();
    }
    
    // Use the ID token for client auth
    const token = tokenResponse.data.id_token;
    
    console.log('Login successful, sending response');
    res.json({
      token,
      user: {
        id: user._id,
        auth0Id: user.auth0Id,
        name: user.name,
        email: user.email,
        role: user.role,
        dispensaryIds: user.dispensaryIds || []
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Auth0 callback error:', error);
    
    let errorDetails = 'No additional details';
    if (error.response) {
      console.error('Auth0 error response:', error.response.data);
      errorDetails = JSON.stringify(error.response.data);
    }
    
    res.status(500).json({ 
      message: 'Authentication failed', 
      error: error.message,
      details: errorDetails
    });
  }
});

// Protected routes
// Get current user profile 
router.get('/me', validateJwt, async (req, res) => {
  try {
    // In development mode, handle mock authentication
    if (process.env.NODE_ENV === 'development' && req.auth.payload.sub === 'dev-user') {
      console.log('Development mode: Using mock user data');
      return res.status(200).json({
        id: 'dev-user-id',
        name: 'Development User',
        email: 'dev@example.com',
        role: 'super_admin',
        dispensaryIds: [],
        permissions: ['read:doctors', 'read:dispensaries'],
        lastLogin: new Date()
      });
    }
    
    const auth0UserId = req.auth.payload.sub;
    console.log('Getting user profile for:', auth0UserId);
    
    // First, check if user exists in our database
    let user = await User.findOne({ auth0Id: auth0UserId });
    
    if (!user) {
      console.log('User not found in database, creating from Auth0');
      // If not in our database, fetch from Auth0 and create in our DB
      if (!auth0Management) {
        return res.status(500).json({ message: 'Auth0 Management API client not available' });
      }
      
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
