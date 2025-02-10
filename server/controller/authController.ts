import { Request, Response, NextFunction } from "express";
import { generateToken, hashPassword, verifyPassword } from "../utils/authUtils.js";
import User, { IUser } from "../models/User.js";

interface RegisterRequest extends Request {
  body: {
    username: string;
    email: string;
    password: string;
    dietaryPreferences?: string[];
    allergies?: string[];
    healthGoals?: string;
    physicalDetails?: {
      age?: number;
      gender?: string;
      weight?: number;
      height?: number;
    };
    activityLevel?: string;
    profilePicture?: string;
  };
}

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

export const register = async (
  req: RegisterRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      username,
      email,
      password,
      dietaryPreferences,
      allergies,
      healthGoals,
      physicalDetails,
      activityLevel,
      profilePicture
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const passwordHash = await hashPassword(password);

    const user = await User.create({
      username,
      email,
      passwordHash,
      dietaryPreferences,
      allergies,
      healthGoals,
      physicalDetails,
      activityLevel,
      profilePicture
    }) as IUser; // Add type assertion here

    const token = generateToken({ 
      id: user._id.toString(), 
      username: user.username 
    });
    
    res.status(201).json({
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        dietaryPreferences: user.dietaryPreferences,
        healthGoals: user.healthGoals,
        activityLevel: user.activityLevel
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: LoginRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }) as IUser | null;
    
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    
    const token = generateToken({ 
      id: user._id.toString(), 
      username: user.username 
    });
    
    res.json({
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        dietaryPreferences: user.dietaryPreferences,
        healthGoals: user.healthGoals,
        activityLevel: user.activityLevel
      },
      token
    });
  } catch (error) {
    next(error);
  }
};