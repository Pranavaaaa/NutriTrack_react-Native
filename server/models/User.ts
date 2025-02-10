import { Schema, model, Document , Types } from 'mongoose';

export interface IUser extends Document {
    _id: Types.ObjectId;
  username: string;
  email: string;
  passwordHash: string;
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
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  dietaryPreferences: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'keto', 'gluten-free']
  }],
  allergies: [{ type: String }],
  healthGoals: {
    type: String,
    enum: ['weight-loss', 'muscle-gain', 'maintenance', 'improve-health']
  },
  physicalDetails: {
    age: Number,
    gender: { type: String, enum: ['male', 'female', 'other'] },
    weight: Number,
    height: Number
  },
  activityLevel: {
    type: String,
    enum: ['sedentary', 'light', 'moderate', 'active', 'very-active']
  },
  profilePicture: String,
  createdAt: { type: Date, default: Date.now }
});

export default model<IUser>('User', UserSchema);