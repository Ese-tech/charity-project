import mongoose, { Document, Schema } from 'mongoose';

export interface ISponsorship extends Document {
  sponsorInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  monthlyAmount: number;
  childId: mongoose.Schema.Types.ObjectId; // We'll link this to a Child model later
  isCompleted: boolean;
  createdAt: Date;
}

const SponsorshipSchema: Schema = new Schema({
  sponsorInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String }
  },
  monthlyAmount: { type: Number, required: true },
  childId: { type: mongoose.Schema.Types.ObjectId, required: false }, // Optional for now
  isCompleted: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Sponsorship = mongoose.model<ISponsorship>('Sponsorship', SponsorshipSchema);
export default Sponsorship;