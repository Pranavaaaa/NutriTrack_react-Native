import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

interface TokenUser {
  id: string;
  username: string;
}

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (user: TokenUser): string => {
  return jwt.sign(
    { id: user.id, username: user.username }, 
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: "1h" }
  );
};