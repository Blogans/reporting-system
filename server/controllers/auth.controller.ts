import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/index';

declare module 'express-session' {
  interface Session {
    userId?: string;
    userEmail?: string;
    userRole?: string;
  }
}

export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log('Registering user:', req.body);
  try {
    const { username, email, password, role } = req.body;
    
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      role
    });

    const userResponse = {
      id: user.id,
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

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email }).select('+password');
    
    if (!user) {
      res.status(401).json({ message: 'Authentication failed' });
      return;
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      res.status(401).json({ message: 'Authentication failed' });
      return;
    }
    
    req.session.userId = user._id.toString();
    req.session.userEmail = user.email;
    req.session.userRole = user.role;
    
    res.json({ 
      message: 'Login successful', 
      user: { id: user._id, email: user.email, role: user.role } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

export const logout = async (
  req: Request,
  res: Response
): Promise<void> => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ message: 'Could not log out, please try again' });
      return;
    }
    res.json({ message: 'Logout successful' });
  });
};

export const checkAuth = async (
  req: Request,
  res: Response
): Promise<void> => {
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
