import mongoose, { Document, Schema } from 'mongoose';

export interface Sponsor extends Document {
  name: string;
}

const sponsorSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
    },
  },
  {
    versionKey: false,
    collection: 'sponsors',
    timestamps: { createdAt: 'created_at', updatedAt: false },
    autoCreate: false,
  }
);

 const SponsorModel = mongoose.model<Sponsor>('Sponsor', sponsorSchema);
export default  SponsorModel
