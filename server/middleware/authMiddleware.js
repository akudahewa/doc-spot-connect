
const { auth } = require('express-oauth2-jwt-bearer');
const jwt = require('jsonwebtoken');

// Auth0 JWT validation middleware
const validateJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: 'RS256'
});

// Check if user has the required permissions
const checkPermissions = (requiredPermissions) => {
  return (req, res, next) => {
    const permissions = req.auth?.permissions || [];
    
    // Check if the user has all the required permissions
    const hasRequiredPermissions = requiredPermissions.every(permission => 
      permissions.includes(permission)
    );

    if (!hasRequiredPermissions) {
      return res.status(403).json({
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Role-based access control middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    // Extract token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      // Decode JWT (already validated by validateJwt)
      const decoded = jwt.decode(token);
      
      if (!decoded) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      
      // Get user roles from Auth0 token
      const userRoles = decoded[`${process.env.AUTH0_AUDIENCE}/roles`] || [];
      
      // Check if user has any of the required roles
      const hasRole = roles.some(role => userRoles.includes(role));
      
      if (!hasRole) {
        return res.status(403).json({ message: 'Insufficient role' });
      }
      
      // Add user info to request
      req.user = {
        id: decoded.sub,
        email: decoded.email,
        roles: userRoles
      };
      
      next();
    } catch (error) {
      console.error('Role validation error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
};

// Auth0 permissions mapping
const PERMISSIONS = {
  // Doctor permissions
  CREATE_DOCTOR: 'create:doctors',
  UPDATE_DOCTOR: 'update:doctors',
  DELETE_DOCTOR: 'delete:doctors',
  READ_DOCTORS: 'read:doctors',
  
  // Dispensary permissions
  CREATE_DISPENSARY: 'create:dispensaries',
  UPDATE_DISPENSARY: 'update:dispensaries',
  DELETE_DISPENSARY: 'delete:dispensaries',
  READ_DISPENSARIES: 'read:dispensaries',
  
  // TimeSlot permissions
  MANAGE_TIMESLOTS: 'manage:timeslots',
  
  // Booking permissions
  UPDATE_BOOKING: 'update:bookings',
  CREATE_BOOKING: 'create:bookings',
  READ_BOOKINGS: 'read:bookings',
  
  // Reports permissions
  VIEW_REPORTS: 'view:reports'
};

// Auth0 roles mapping
const ROLES = {
  SUPER_ADMIN: 'super_admin',
  DISPENSARY_ADMIN: 'dispensary_admin',
  DISPENSARY_STAFF: 'dispensary_staff'
};

module.exports = {
  validateJwt,
  checkPermissions,
  requireRole,
  PERMISSIONS,
  ROLES
};
