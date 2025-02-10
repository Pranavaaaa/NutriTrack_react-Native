import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    dietaryPreferences: [{ type: String, enum: ['vegetarian', 'vegan', 'keto', 'gluten-free'] }],
    allergies: [{ type: String }],
    healthGoals: { 
      type: String, 
      enum: ['weight-loss', 'muscle-gain', 'maintenance', 'improve-health'] 
    },
    physicalDetails: {
      age: Number,
      gender: { type: String, enum: ['male', 'female', 'other'] },
      weight: Number, // in kg
      height: Number  // in cm
    },
    activityLevel: { 
      type: String, 
      enum: ['sedentary', 'light', 'moderate', 'active', 'very-active'] 
    },
    profilePicture: String,
    createdAt: { type: Date, default: Date.now }
});

userSchema.methods.generateAuthToken = function () {
  
  const token = jwt.sign(
    { _id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return token;
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;