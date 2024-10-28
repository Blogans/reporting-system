import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { UserModel } from '../models/index';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    userEmail?: string;
    userRole?: string;
  }
}

const validatePassword = (password: string): { isValid: boolean; message: string } => {
  // Minimum length check
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }

  // Must contain at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }

  // Must contain at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }

  // Must contain at least one number
  if (!/\d/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }

  // Must contain at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character' };
  }

  return { isValid: true, message: 'Password meets requirements' };
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        message: 'Password requirements not met',
        error: passwordValidation.message 
      });
    }
    
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcryptjs.hash(password, 10);
    
    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      role
    });

    // Create a user object without the password for response
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ message: 'Error registering user', error: error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    
    const isMatch = await bcryptjs.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    
    // Set user info in session
    req.session.userId = user._id.toString();
    req.session.userEmail = user.email;
    req.session.userRole = user.role;

    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ message: 'Could not log in, please try again' });
      }
      
      console.log('Session saved:', req.session);
      res.json({ message: 'Login successful', user: { id: user._id, email: user.email, role: user.role } });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out, please try again' });
    }

    res.clearCookie('connect.sid', {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false,
      sameSite: 'none',
      domain: process.env.NODE_ENV === 'production' ? 'incident-report-ebfsc5hthwd9g4a2.canadacentral-01.azurewebsites.net' : undefined
    });

    res.json({ message: 'Logout successful' });
  });
};

export const getUser = (req: Request, res: Response) => {
  if (req.session.userId) {
    res.json({ user: { id: req.session.userId, email: req.session.userEmail, role: req.session.userRole } });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};

export const checkAuth = (req: Request, res: Response) => {
  if (req.session.userId) {
    res.json({ 
      id: req.session.userId, 
      email: req.session.userEmail, 
      role: req.session.userRole 
    });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};
