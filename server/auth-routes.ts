import { Router } from 'express';
import { AuthService } from './auth';
import { body, validationResult } from 'express-validator';
import { z } from 'zod';

const router = Router();

// Validation schemas
const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
  userType: z.enum(['customer', 'engineer']),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const verifyEmailSchema = z.object({
  email: z.string().email('Invalid email format'),
  code: z.string().length(6, 'Code must be 6 digits'),
});

// Middleware to authenticate JWT token
export const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = AuthService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Middleware to check if email is verified
export const requireEmailVerification = (req: any, res: any, next: any) => {
  if (!req.user.emailVerified) {
    return res.status(403).json({ 
      error: 'Email verification required',
      requiresVerification: true 
    });
  }
  next();
};

// Middleware to check if user is admin
export const requireAdmin = (req: any, res: any, next: any) => {
  if (!req.user || req.user.userType !== 'admin') {
    return res.status(403).json({ 
      error: 'Admin access required',
      requiresAdmin: true 
    });
  }
  next();
};

// Middleware to check if user is editor
export const requireEditor = (req: any, res: any, next: any) => {
  if (!req.user || req.user.userType !== 'editor') {
    return res.status(403).json({ 
      error: 'Editor access required',
      requiresEditor: true 
    });
  }
  next();
};

// Middleware to check if user is admin or editor
export const requireAdminOrEditor = (req: any, res: any, next: any) => {
  if (!req.user || (req.user.userType !== 'admin' && req.user.userType !== 'editor')) {
    return res.status(403).json({ 
      error: 'Admin or Editor access required',
      requiresAdminOrEditor: true 
    });
  }
  next();
};

// Middleware to check if user is engineer
export const requireEngineer = (req: any, res: any, next: any) => {
  if (!req.user || req.user.userType !== 'engineer') {
    return res.status(403).json({ 
      error: 'Engineer access required',
      requiresEngineer: true 
    });
  }
  next();
};

// Middleware to check if user is customer
export const requireCustomer = (req: any, res: any, next: any) => {
  if (!req.user || req.user.userType !== 'customer') {
    return res.status(403).json({ 
      error: 'Customer access required',
      requiresCustomer: true 
    });
  }
  next();
};

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    
    const { user, token, requiresVerification } = await AuthService.register(validatedData);
    
    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email for verification code.',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType,
        emailVerified: user.emailVerified,
      },
      token,
      requiresVerification
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Validation error',
        details: error.errors 
      });
    }
    
    res.status(400).json({ 
      error: error.message || 'Registration failed' 
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    
    const { user, token, requiresVerification } = await AuthService.login(validatedData.email, validatedData.password);
    
    res.json({
      success: true,
      message: requiresVerification ? 'Please verify your email to continue' : 'Login successful',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType,
        emailVerified: user.emailVerified,
      },
      token,
      requiresVerification: requiresVerification || false
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Validation error',
        details: error.errors 
      });
    }
    
    res.status(401).json({ 
      error: error.message || 'Login failed' 
    });
  }
});

// Verify email endpoint
router.post('/verify-email', async (req, res) => {
  try {
    const validatedData = verifyEmailSchema.parse(req.body);
    
    const user = await AuthService.verifyEmail(validatedData.email, validatedData.code);
    
    // Generate new token with updated verification status
    const token = AuthService.generateToken(user);
    
    res.json({
      success: true,
      message: 'Email verified successfully',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType,
        emailVerified: user.emailVerified,
      },
      token
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Validation error',
        details: error.errors 
      });
    }
    
    res.status(400).json({ 
      error: error.message || 'Email verification failed' 
    });
  }
});

// Resend verification code endpoint
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    await AuthService.resendVerificationCode(email);
    
    res.json({
      success: true,
      message: 'Verification code sent successfully'
    });
  } catch (error: any) {
    res.status(400).json({ 
      error: error.message || 'Failed to send verification code' 
    });
  }
});

// Request password reset endpoint
router.post('/request-reset', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    await AuthService.requestPasswordReset(email);
    
    res.json({
      success: true,
      message: 'Password reset email sent successfully'
    });
  } catch (error: any) {
    res.status(400).json({ 
      error: error.message || 'Failed to send password reset email' 
    });
  }
});

// Reset password endpoint
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    
    const user = await AuthService.resetPassword(token, newPassword);
    
    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error: any) {
    res.status(400).json({ 
      error: error.message || 'Password reset failed' 
    });
  }
});

// Get current user endpoint (protected)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const { storage } = await import('./storage');
    const user = await storage.getUser(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType,
        emailVerified: user.emailVerified,
        phone: user.phone,
        address: user.address,
        city: user.city,
        postcode: user.postcode,
      }
    });
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to fetch user data' 
    });
  }
});

// Logout endpoint
router.post('/logout', authenticateToken, async (req, res) => {
  // In a stateless JWT system, logout is handled client-side
  // But we can add token blacklisting here if needed
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

export default router;