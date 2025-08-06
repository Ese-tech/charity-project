import mongoose, { Document, Schema } from 'mongoose';

export interface IDonation extends Document {
  amount: number;
  type: 'one-time' | 'monthly';
  category: 'general' | 'disaster';
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  paymentMethod: string;
  isCompleted: boolean;
  createdAt: Date;
}

const DonationSchema: Schema = new Schema({
  amount: { type: Number, required: true },
  type: { type: String, enum: ['one-time', 'monthly'], required: true },
  category: { type: String, enum: ['general', 'disaster'], required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  paymentMethod: { type: String, required: true },
  isCompleted: { type: Boolean, default: true }, // For simplicity, we assume all donations are completed
  createdAt: { type: Date, default: Date.now }
});

const Donation = mongoose.model<IDonation>('Donation', DonationSchema);
export default Donation;