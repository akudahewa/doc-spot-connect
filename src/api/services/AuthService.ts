import { User, UserRole } from '../models';

// Mocked users data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Super Admin',
    email: 'admin@example.com',
    passwordHash: 'hashed_password_123', // In a real implementation, this would be properly hashed
    role: UserRole.SUPER_ADMIN,
    isActive: true,
    lastLogin: new Date('2023-07-01'),
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-07-01')
  },
  {
    id: '2',
    name: 'John Dispensary Admin',
    email: 'john@cityhealthclinic.com',
    passwordHash: 'hashed_password_456',
    role: UserRole.DISPENSARY_ADMIN,
    dispensaryIds: ['1'], // City Health Clinic
    isActive: true,
    lastLogin: new Date('2023-07-10'),
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2023-07-10')
  },
  {
    id: '3',
    name: 'Sarah Staff',
    email: 'sarah@westsidemedical.com',
    passwordHash: 'hashed_password_789',
    role: UserRole.DISPENSARY_STAFF,
    dispensaryIds: ['2'], // Westside Medical Center
    isActive: true,
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2023-06-05')
  },
  {
    id: '4',
    name: 'Multi-Dispensary Admin',
    email: 'multi@dispensaries.com',
    passwordHash: 'hashed_password_101',
    role: UserRole.DISPENSARY_ADMIN,
    dispensaryIds: ['1', '3'], // Can manage multiple dispensaries
    isActive: true,
    createdAt: new Date('2023-04-10'),
    updatedAt: new Date('2023-07-15')
  }
];

// Store active tokens for validation (in a real app, this would be done with proper JWT validation)
const activeTokens = new Map<string, string>(); // Map of userId -> token

export const AuthService = {
  // Login function
  login: async (email: string, password: string): Promise<{ user: Omit<User, 'passwordHash'> | null; token: string | null; message: string }> => {
    console.log(`Login attempt for email: ${email}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find the user by email
    const user = mockUsers.find(u => u.email === email);
    
    // Check if user exists and is active
    if (!user) {
      console.log(`User not found for email: ${email}`);
      return { user: null, token: null, message: 'Invalid email or password' };
    }
    
    if (!user.isActive) {
      console.log(`User account is disabled: ${email}`);
      return { user: null, token: null, message: 'Account is disabled. Please contact administrator.' };
    }
    
    // In a real implementation, you'd verify the password hash here
    // For this mock, we'll use a hardcoded password for demo purposes
    const passwordIsValid = password === '123456';
    
    if (!passwordIsValid) {
      console.log(`Invalid password for user: ${email}`);
      return { user: null, token: null, message: 'Invalid email or password' };
    }
    
    // Update last login time (in a real implementation, this would update the database)
    user.lastLogin = new Date();
    
    // Create a token with predictable format for demo but still unique for each login
    const token = `mock-jwt-token-${user.id}-${Date.now()}`;
    
    // Store the active token for this user
    activeTokens.set(user.id, token);
    
    console.log(`Login successful for user: ${user.name}, token: ${token.substring(0, 20)}...`);
    
    // Return user without password hash
    const { passwordHash, ...userWithoutPassword } = user;
    return { 
      user: userWithoutPassword, 
      token, 
      message: 'Login successful' 
    };
  },
  
  // Get current user (simulating token validation)
  getCurrentUser: async (token: string): Promise<Omit<User, 'passwordHash'> | null> => {
    if (!token) {
      console.log('Token is missing');
      return null;
    }
    
    // In a real implementation, you'd verify the JWT token here
    if (!token.startsWith('mock-jwt-token-')) {
      console.log('Invalid token format');
      return null;
    }
    
    try {
      // Extract user ID from token
      const parts = token.split('-');
      if (parts.length < 3) {
        console.log('Token parts missing');
        return null;
      }
      
      const userId = parts[2];
      console.log(`Validating token for user ID: ${userId}`);
      
      const user = mockUsers.find(u => u.id === userId);
      
      if (!user) {
        console.log(`User not found for user ID: ${userId}`);
        return null;
      }
      
      // Check if the token matches the active token for this user
      const activeToken = activeTokens.get(userId);
      if (activeToken !== token) {
        console.log(`Token mismatch for user ID: ${userId}`);
        console.log(`Stored token: ${activeToken?.substring(0, 20) || 'none'}`);
        console.log(`Provided token: ${token.substring(0, 20)}`);
        return null;
      }
      
      console.log(`Token validated successfully for user: ${user.name}`);
      
      // Return user without password hash
      const { passwordHash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  },
  
  // Create a new user (for admin use)
  createUser: async (userData: Omit<User, 'id' | 'passwordHash' | 'createdAt' | 'updatedAt'>, password: string): Promise<Omit<User, 'passwordHash'> | null> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Check if email already exists
    if (mockUsers.some(u => u.email === userData.email)) {
      return null; // Email already in use
    }
    
    // In a real implementation, you'd hash the password here
    const passwordHash = `hashed_${password}`;
    
    // Create new user
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substring(2, 11),
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // In a real implementation, you'd save this to the database
    
    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },
  
  // Update user (for admin use)
  updateUser: async (userId: string, userData: Partial<Omit<User, 'id' | 'passwordHash' | 'createdAt' | 'updatedAt'>>): Promise<Omit<User, 'passwordHash'> | null> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find user
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return null;
    }
    
    // Update user
    const updatedUser = {
      ...mockUsers[userIndex],
      ...userData,
      updatedAt: new Date()
    };
    
    // In a real implementation, you'd update this in the database
    
    // Return user without password hash
    const { passwordHash, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  },
  
  // Change password
  changePassword: async (userId: string, currentPassword: string, newPassword: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find user
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      return false;
    }
    
    // Verify current password (again, in a real implementation, you'd compare password hashes)
    const passwordIsValid = currentPassword === '123456';
    if (!passwordIsValid) {
      return false;
    }
    
    // Update password (in a real implementation, you'd hash the new password)
    user.passwordHash = `hashed_${newPassword}`;
    user.updatedAt = new Date();
    
    return true;
  },
  
  // Get all users (for super admin)
  getAllUsers: async (): Promise<Omit<User, 'passwordHash'>[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Return all users without password hashes
    return mockUsers.map(({ passwordHash, ...userWithoutPassword }) => userWithoutPassword);
  },
  
  // Get users by dispensary (for dispensary admins)
  getUsersByDispensary: async (dispensaryId: string): Promise<Omit<User, 'passwordHash'>[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Filter users by dispensary
    const filteredUsers = mockUsers.filter(user => 
      user.dispensaryIds?.includes(dispensaryId)
    );
    
    // Return filtered users without password hashes
    return filteredUsers.map(({ passwordHash, ...userWithoutPassword }) => userWithoutPassword);
  }
};
