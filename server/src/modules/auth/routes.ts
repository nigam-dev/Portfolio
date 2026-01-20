import { Router, Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import passport from '../../config/passport';
import { config } from '../../config';
import { sendSuccess, sendError } from '../../utils/response';
import { HTTP_STATUS } from '../../../../shared/src/constants';
import { JWT_COOKIE_NAME } from '../../../../shared/src/constants';
import { authenticate, AuthRequest } from '../../middlewares/auth';
import { ADMIN_EMAIL } from '../../../../shared/src/constants';
import { UserRole } from '../../../../shared/src/types';
import AuditLog from '../../models/AuditLog';
import User from '../../models/User';

const router = Router();

// Generate JWT token
const generateToken = (userId: string, email: string, role: string): string => {
  return jwt.sign(
    { id: userId, email, role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn as string }
  );
};

// @route   POST /api/v1/auth/register
// @desc    Register admin user (only for admin email)
// @access  Public
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;
    
    // Validate input
    if (!email || !password || !name) {
      return sendError(res, 'Email, password and name are required', HTTP_STATUS.BAD_REQUEST);
    }
    
    // Only admin email can register
    if (email !== ADMIN_EMAIL) {
      return sendError(res, 'Registration is only allowed for admin email', HTTP_STATUS.FORBIDDEN);
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 'User already exists', HTTP_STATUS.CONFLICT);
    }
    
    // Create admin user
    const user = await User.create({
      email,
      password,
      name,
      role: UserRole.ADMIN,
      isActive: true,
    });
    
    // Generate token
    const token = generateToken(user._id.toString(), user.email, user.role);
    
    // Log registration
    await AuditLog.create({
      userId: user._id.toString(),
      action: 'REGISTER',
      resource: 'AUTH',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    
    // Set cookie
    res.cookie(JWT_COOKIE_NAME, token, {
      httpOnly: true,
      secure: config.env === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax',
    });
    
    return sendSuccess(res, { 
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token 
    }, 'Admin registered successfully', HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/v1/auth/login
// @desc    Login with email and password
// @access  Public
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return sendError(res, 'Email and password are required', HTTP_STATUS.BAD_REQUEST);
    }
    
    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return sendError(res, 'Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
    }
    
    // Check if user is active
    if (!user.isActive) {
      return sendError(res, 'Account is inactive', HTTP_STATUS.FORBIDDEN);
    }
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return sendError(res, 'Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
    }
    
    // Generate token
    const token = generateToken(user._id.toString(), user.email, user.role);
    
    // Log login
    await AuditLog.create({
      userId: user._id.toString(),
      action: 'LOGIN',
      resource: 'AUTH',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    
    // Set cookie
    res.cookie(JWT_COOKIE_NAME, token, {
      httpOnly: true,
      secure: config.env === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax',
    });
    
    return sendSuccess(res, { 
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token 
    }, 'Logged in successfully');
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/v1/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?.id).select('-__v');
    
    if (!user) {
      return sendError(res, 'User not found', HTTP_STATUS.NOT_FOUND);
    }
    
    return sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/v1/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Log logout
    await AuditLog.create({
      userId: req.user?.id,
      action: 'LOGOUT',
      resource: 'AUTH',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    
    res.clearCookie(JWT_COOKIE_NAME);
    
    return sendSuccess(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/v1/auth/refresh
// @desc    Refresh token
// @access  Private
router.post('/refresh', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = generateToken(req.user!.id, req.user!.email, req.user!.role);
    
    res.cookie(JWT_COOKIE_NAME, token, {
      httpOnly: true,
      secure: config.env === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });
    
    return sendSuccess(res, { token }, 'Token refreshed successfully');
  } catch (error) {
    next(error);
  }
});

export default router;
