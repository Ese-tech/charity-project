import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // Import jsonwebtoken

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  // Method to compare password
  matchPassword(enteredPassword: string): Promise<boolean>;
  // Method to generate JWT
  generateAuthToken(): string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

// Hash the password before saving the user
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate JWT
UserSchema.methods.generateAuthToken = function (): string {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET as string, {
    expiresIn: '1h', // Token expires in 1 hour
  });
};

export const User = mongoose.model<IUser>('User', UserSchema);