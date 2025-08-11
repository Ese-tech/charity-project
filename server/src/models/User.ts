//server/src/models/User.ts

import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; // <-- ADD THIS IMPORT

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  passwordResetToken?: string; // <-- ADD THIS PROPERTY
  passwordResetExpires?: Date; // <-- ADD THIS PROPERTY
  matchPassword(enteredPassword: string): Promise<boolean>;
  generateAuthToken(): string;
  // <-- ADD THIS METHOD
  getResetPasswordToken(): string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  passwordResetToken: { type: String }, // <-- ADD THIS FIELD TO THE SCHEMA
  passwordResetExpires: { type: Date }, // <-- ADD THIS FIELD TO THE SCHEMA
}, {
  timestamps: true
});

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.generateAuthToken = function (): string {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET as string, {
    expiresIn: '1h',
  });
};

// <-- ADD THIS NEW METHOD TO GENERATE AND HASH THE RESET TOKEN
UserSchema.methods.getResetPasswordToken = function (): string {
  // Generate a random token
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  // Hash the token and set it to passwordResetToken
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  
  // Set the token's expiration time (e.g., 1 hour)
  this.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
  
  return resetToken;
};

export const User = mongoose.model<IUser>('User', UserSchema);